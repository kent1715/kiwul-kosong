"""
Diagnostik: cek apakah proxy (port 9500) benar-benar meneruskan
negative_prompt dari request body ke node 110 workflow ComfyUI.

Cara pakai:
  1. Pastikan ComfyUI (8188) dan proxy target (9500) jalan.
  2. Siapkan 1 file PNG kecil untuk dipakai sebagai base image
     (parameter --base). Default: pakai file PNG pertama di folder ini.
  3. Jalankan:
       python check-negative-prompt-forward.py --proxy http://127.0.0.1:9500 --base some.png
  4. Tool akan:
       - POST ke proxy dengan negative_prompt berisi marker unik
       - tunggu ComfyUI selesai
       - ambil entry history terbaru, periksa node 110 inputs.prompt
       - cetak PASS / FAIL

Tidak perlu proxy milikku yang baru — ini untuk mengetes proxy LAMA kamu.
"""

from __future__ import annotations

import argparse
import base64
import io
import json
import time
import uuid
from pathlib import Path

import httpx
from PIL import Image


COMFYUI_URL = "http://127.0.0.1:8188"
MARKER = f"NEGCHECK_{uuid.uuid4().hex[:8]}"


def make_tiny_png() -> bytes:
    img = Image.new("RGB", (512, 512), color=(120, 140, 160))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


def stage_input(client: httpx.Client, png: bytes) -> str:
    # upload via ComfyUI /upload/image
    files = {"image": ("negcheck.png", png, "image/png")}
    r = client.post(f"{COMFYUI_URL}/upload/image", files=files, data={"overwrite": "true"})
    r.raise_for_status()
    return r.json()["name"]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--proxy", default="http://127.0.0.1:9500")
    ap.add_argument("--base", help="path PNG untuk base image (opsional)")
    ap.add_argument("--char-a", help="path PNG untuk character A (opsional)")
    ap.add_argument("--char-b", help="path PNG untuk character B (opsional)")
    ap.add_argument("--comfyui", default=COMFYUI_URL)
    args = ap.parse_args()

    marker_neg = f"transparan, blur, {MARKER}, low quality"
    print(f"[*] marker negative_prompt = {MARKER}")

    # siapkan base image
    if args.base:
        base_png = Path(args.base).read_bytes()
    else:
        base_png = make_tiny_png()
        print("[*] tidak ada --base, pakai tiny PNG 512x512 abu-abu")

    # data URL untuk base
    base_data_url = "data:image/png;base64," + base64.b64encode(base_png).decode()

    # character refs (opsional - kalau tidak ada, skip)
    ref_images = [{"type": "base", "image": base_data_url}]
    if args.char_a:
        ref_images.append({"type": "character", "name": "char_A", "image": args.char_a})
    if args.char_b:
        ref_images.append({"type": "character", "name": "char_B", "image": args.char_b})

    payload = {
        "model": "kiwul-qwen2509-editplus",
        "prompt": "a neutral test scene, two people standing far apart",
        "negative_prompt": marker_neg,
        "reference_images": ref_images,
        "size": "576x576",
        "n": 1,
    }

    print(f"[*] POST {args.proxy}/v1/images/generations")
    with httpx.Client(timeout=900) as client:
        # snapshot history sebelum
        before = client.get(f"{args.comfyui}/history").json() or {}
        before_ids = set(before.keys())

        try:
            r = client.post(f"{args.proxy}/v1/images/generations", json=payload)
            print(f"[*] proxy response HTTP {r.status_code}")
            if r.status_code >= 400:
                print(r.text[:500])
        except Exception as e:
            print(f"[!] proxy call failed: {e}")
            print("    -> proxy tidak bisa dihubungi. Pastikan jalan di port 9500.")
            return

        # tunggu entry baru di history
        print("[*] menunggu ComfyUI history entry baru...")
        found_entry = None
        deadline = time.time() + 600
        while time.time() < deadline:
            h = client.get(f"{args.comfyui}/history").json() or {}
            new_ids = set(h.keys()) - before_ids
            for nid in new_ids:
                entry = h[nid]
                # pastikan sudah selesai (punya outputs)
                if entry.get("outputs"):
                    found_entry = (nid, entry)
                    break
            if found_entry:
                break
            time.sleep(2)

        if not found_entry:
            print("[!] TIMEOUT: tidak ada entry baru di ComfyUI history dalam 10 menit.")
            print("    -> proxy mungkin gagal meng-queue prompt ke ComfyUI.")
            return

        nid, entry = found_entry
        print(f"[+] ComfyUI prompt_id = {nid}")

        # ambil prompt yang sebenarnya dikirim ke ComfyUI
        prompt_payload = entry.get("prompt") or []
        if isinstance(prompt_payload, list) and prompt_payload:
            workflow = prompt_payload[2] if len(prompt_payload) > 2 else {}
        elif isinstance(prompt_payload, dict):
            workflow = prompt_payload
        else:
            workflow = {}

        if not workflow:
            print("[!] tidak bisa membaca workflow dari history entry.")
            return

        node110 = workflow.get("110", {})
        node111 = workflow.get("111", {})
        actual_neg = (node110.get("inputs", {}) or {}).get("prompt", "<MISSING>")
        actual_pos = (node111.get("inputs", {}) or {}).get("prompt", "<MISSING>")

        print()
        print("---- ComfyUI actual node values ----")
        print(f"node 110 (negative) prompt = {actual_neg!r}")
        print(f"node 111 (positive) prompt = {actual_pos!r}")
        print()
        if MARKER in str(actual_neg):
            print(f"PASS: marker {MARKER} ditemukan di node 110.")
            print("     -> Proxy kamu SUDAH meneruskan negative_prompt dengan benar.")
        else:
            print(f"FAIL: marker {MARKER} TIDAK ditemukan di node 110.")
            print("     -> Proxy kamu TIDAK meneruskan negative_prompt ke node 110.")
            print("     -> Perbaikan anti-stacking di route.ts tidak berdampak.")
            print("     -> Solusi: pakai proxy reference di proxy/qwen2509-editplus-proxy/server.py")
            print("        atau tambahkan baris: workflow['110']['inputs']['prompt'] = negative_prompt")


if __name__ == "__main__":
    main()
