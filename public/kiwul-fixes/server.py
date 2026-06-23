"""
Reference proxy: OpenAI-compatible /v1/images/generations -> ComfyUI
untuk engine Qwen-Image-Edit-2509 (2 karakter, port 9500).

Perilaku penting (yang sering bocor di proxy buatan sendiri):
  - request body field `negative_prompt` -> node 110 inputs.prompt  (WAJIB)
  - request body field `prompt`          -> node 111 inputs.prompt  (WAJIB)
  - reference_images[type=base]          -> LoadImage node 78
  - reference_images[type=character] #1  -> LoadImage node 106
  - reference_images[type=character] #2  -> LoadImage node 108

Jika proxy kamu yang lama tidak memetakan negative_prompt ke node 110,
maka node 110 akan pakai default "transparan,blur" dari workflow JSON
dan perbaikan anti-stacking di route.ts menjadi sia-sia.

Jalankan:  python -m uvicorn server:app --host 0.0.0.0 --port 9500
"""

from __future__ import annotations

import base64
import io
import json
import logging
import os
import time
import uuid
from pathlib import Path
from typing import Any

import httpx
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from PIL import Image

# --------------------------------------------------------------------------- #
# Konfigurasi (override via env var)
# --------------------------------------------------------------------------- #
COMFYUI_URL = os.environ.get("COMFYUI_URL", "http://127.0.0.1:8188")
COMFYUI_INPUT_DIR = Path(
    os.environ.get("COMFYUI_INPUT_DIR", r"C:\ComfyUI\input")
)
WORKFLOW_PATH = Path(
    os.environ.get(
        "WORKFLOW_PATH",
        str(Path(__file__).resolve().parent.parent.parent / "workflows" / "image_qwen_image_edit_2509.json"),
    )
)
POLL_INTERVAL_SEC = float(os.environ.get("POLL_INTERVAL_SEC", "2"))
POLL_TIMEOUT_SEC = float(os.environ.get("POLL_TIMEOUT_SEC", "1200"))

# Node ID mapping (sesuai workflow image_qwen_image_edit_2509.json)
NODE_PROMPT_POS = "111"            # TextEncodeQwenImageEditPlus positive
NODE_PROMPT_NEG = "110"            # TextEncodeQwenImageEditPlus negative
NODE_LOAD_BASE = "78"              # LoadImage background
NODE_LOAD_CHAR_A = "106"           # LoadImage character A
NODE_LOAD_CHAR_B = "108"           # LoadImage character B
NODE_SAVE_IMAGE = "60"             # SaveImage output

# --------------------------------------------------------------------------- #
# Logging
# --------------------------------------------------------------------------- #
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
log = logging.getLogger("qwen2509-proxy")

# --------------------------------------------------------------------------- #
# App
# --------------------------------------------------------------------------- #
app = FastAPI(title="Kiwul Qwen2509 EditPlus Proxy")


# --------------------------------------------------------------------------- #
# Helpers
# --------------------------------------------------------------------------- #
def _load_workflow() -> dict[str, Any]:
    if not WORKFLOW_PATH.exists():
        raise RuntimeError(f"Workflow file not found: {WORKFLOW_PATH}")
    with WORKFLOW_PATH.open("r", encoding="utf-8") as f:
        return json.load(f)


def _decode_to_png_bytes(image_value: str) -> bytes:
    """Terima data URL, path file lokal, atau URL http -> bytes PNG."""
    if not image_value:
        raise ValueError("Empty image value")

    # data:image/png;base64,....  /  data:image/jpeg;base64,....
    if image_value.startswith("data:"):
        header, _, b64 = image_value.partition(",")
        if not b64:
            raise ValueError(f"Malformed data URL: {header}")
        raw = base64.b64decode(b64)
        img = Image.open(io.BytesIO(raw)).convert("RGB")
        buf = io.BytesIO()
        img.save(buf, format="PNG")
        return buf.getvalue()

    # Windows path (D:\...) atau unix path
    if os.path.exists(image_value):
        with open(image_value, "rb") as f:
            raw = f.read()
        img = Image.open(io.BytesIO(raw)).convert("RGB")
        buf = io.BytesIO()
        img.save(buf, format="PNG")
        return buf.getvalue()

    # http(s) URL
    if image_value.lower().startswith(("http://", "https://")):
        with httpx.Client(timeout=60) as c:
            r = c.get(image_value)
            r.raise_for_status()
            raw = r.content
        img = Image.open(io.BytesIO(raw)).convert("RGB")
        buf = io.BytesIO()
        img.save(buf, format="PNG")
        return buf.getvalue()

    raise ValueError(f"Cannot resolve image value: {image_value[:80]}")


def _stage_input_image(image_value: str) -> str:
    """Tulis image ke folder input ComfyUI, return filename yang dipakai LoadImage."""
    png = _decode_to_png_bytes(image_value)
    COMFYUI_INPUT_DIR.mkdir(parents=True, exist_ok=True)
    filename = f"kiwul_{uuid.uuid4().hex}.png"
    target = COMFYUI_INPUT_DIR / filename
    target.write_bytes(png)
    log.info("staged input image -> %s (%d bytes)", target, len(png))
    return filename


def _apply_reference_images(workflow: dict, reference_images: list[dict]) -> None:
    """Map reference_images ke LoadImage node 78/106/108."""
    char_slot = 0
    for item in reference_images or []:
        t = str(item.get("type", "")).lower()
        img_val = item.get("image") or item.get("file_path") or item.get("url")
        if not img_val:
            continue

        if t == "base":
            fname = _stage_input_image(img_val)
            workflow[NODE_LOAD_BASE]["inputs"]["image"] = fname
            log.info("reference base -> node %s = %s", NODE_LOAD_BASE, fname)
        elif t == "character":
            if char_slot == 0:
                fname = _stage_input_image(img_val)
                workflow[NODE_LOAD_CHAR_A]["inputs"]["image"] = fname
                log.info("reference char_A -> node %s = %s", NODE_LOAD_CHAR_A, fname)
                char_slot += 1
            elif char_slot == 1:
                fname = _stage_input_image(img_val)
                workflow[NODE_LOAD_CHAR_B]["inputs"]["image"] = fname
                log.info("reference char_B -> node %s = %s", NODE_LOAD_CHAR_B, fname)
                char_slot += 1
            else:
                log.warning("ignoring extra character reference (only 2 supported)")


def _apply_prompts(workflow: dict, prompt: str, negative_prompt: str) -> None:
    """
    INI BAGIAN KRITIS.
    Forward prompt & negative_prompt dari request body ke node workflow.
    Banyak proxy buatan sendiri lupa melakukan ini -> ComfyUI pakai default
    yang ada di file JSON.
    """
    workflow[NODE_PROMPT_POS]["inputs"]["prompt"] = prompt or ""
    workflow[NODE_PROMPT_NEG]["inputs"]["prompt"] = negative_prompt or ""

    log.info("forwarded prompt         -> node %s (%d chars)", NODE_PROMPT_POS, len(prompt or ""))
    log.info("forwarded negative_prompt -> node %s = %r", NODE_PROMPT_NEG, (negative_prompt or "")[:120])


def _apply_seed(workflow: dict) -> None:
    """Randomize seed KSampler (node 3) supaya tidak reproduce."""
    if "3" in workflow and workflow["3"].get("class_type") == "KSampler":
        new_seed = int.from_bytes(os.urandom(8), "big")
        workflow["3"]["inputs"]["seed"] = new_seed
        log.info("KSampler seed randomized -> %d", new_seed)


def _parse_size(size: str | None) -> tuple[int, int] | None:
    if not size:
        return None
    try:
        w, h = size.lower().split("x")
        return int(w), int(h)
    except Exception:
        return None


def _apply_size(workflow: dict, size: str | None) -> None:
    """
    Output resolution pada workflow ini ditentukan oleh node 93
    (ImageScaleToTotalPixels, megapixels=1) terhadap base image, BUKAN oleh
    node 112 (orphan). Jadi kita TIDAK mengubah 112. Field `size` dari request
    hanya kita log untuk transparansi.
    """
    parsed = _parse_size(size)
    if parsed:
        log.info("size requested = %s (note: actual output follows base image scaled to 1MP via node 93)", size)


async def _queue_and_wait(workflow: dict) -> dict:
    async with httpx.AsyncClient(timeout=POLL_TIMEOUT_SEC) as client:
        # 1. queue prompt
        resp = await client.post(f"{COMFYUI_URL}/prompt", json={"prompt": workflow})
        if resp.status_code != 200:
            raise RuntimeError(f"ComfyUI /prompt HTTP {resp.status_code}: {resp.text[:500]}")
        prompt_id = resp.json().get("prompt_id")
        log.info("ComfyUI prompt queued: %s", prompt_id)

        # 2. poll history
        deadline = time.time() + POLL_TIMEOUT_SEC
        while time.time() < deadline:
            h = await client.get(f"{COMFYUI_URL}/history/{prompt_id}")
            if h.status_code != 200:
                await _sleep(POLL_INTERVAL_SEC)
                continue
            hj = h.json() or {}
            entry = hj.get(prompt_id)
            if not entry:
                await _sleep(POLL_INTERVAL_SEC)
                continue

            status = entry.get("status", {})
            if status.get("status_str") == "ERROR":
                raise RuntimeError(f"ComfyUI execution error: {status.get('messages')}")

            outputs = entry.get("outputs", {})
            node_out = outputs.get(NODE_SAVE_IMAGE, {})
            images = node_out.get("images", [])
            if images:
                img_info = images[0]
                view_params = {
                    "filename": img_info["filename"],
                    "subfolder": img_info.get("subfolder", ""),
                    "type": img_info.get("type", "output"),
                }
                view = await client.get(f"{COMFYUI_URL}/view", params=view_params)
                if view.status_code != 200:
                    raise RuntimeError(f"ComfyUI /view HTTP {view.status_code}")
                return {
                    "b64_json": base64.b64encode(view.content).decode("ascii"),
                    "filename": img_info["filename"],
                }
            await _sleep(POLL_INTERVAL_SEC)

        raise TimeoutError(f"ComfyUI did not finish within {POLL_TIMEOUT_SEC}s")


async def _sleep(sec: float) -> None:
    # helper supaya bisa di-patch di test
    import asyncio
    await asyncio.sleep(sec)


# --------------------------------------------------------------------------- #
# Endpoints
# --------------------------------------------------------------------------- #
@app.get("/health")
async def health():
    return {
        "ok": True,
        "comfyui_url": COMFYUI_URL,
        "comfyui_input_dir": str(COMFYUI_INPUT_DIR),
        "workflow_path": str(WORKFLOW_PATH),
        "workflow_exists": WORKFLOW_PATH.exists(),
    }


@app.post("/v1/images/generations")
async def generate(request: Request):
    try:
        body = await request.json()
    except Exception as e:
        return JSONResponse({"error": {"message": f"Invalid JSON: {e}"}}, status_code=400)

    model = body.get("model", "kiwul-qwen2509-editplus")
    prompt = body.get("prompt", "")
    negative_prompt = body.get("negative_prompt", "") or ""
    reference_images = body.get("reference_images", []) or []
    size = body.get("size")
    n = body.get("n", 1)

    log.info("=" * 70)
    log.info("REQUEST model=%s size=%s n=%s", model, size, n)
    log.info("prompt         (%d chars): %s", len(prompt), (prompt or "")[:120])
    log.info("negative_prompt(%d chars): %s", len(negative_prompt), (negative_prompt or "")[:120])
    log.info("reference_images count=%d", len(reference_images))

    try:
        workflow = _load_workflow()
        _apply_reference_images(workflow, reference_images)
        _apply_prompts(workflow, prompt, negative_prompt)   # <-- KRITIS
        _apply_seed(workflow)
        _apply_size(workflow, size)

        result = await _queue_and_wait(workflow)
        log.info("DONE image=%s bytes=%d", result["filename"], len(result["b64_json"]))
        return {
            "created": int(time.time()),
            "data": [{"b64_json": result["b64_json"]}],
        }
    except Exception as e:
        log.exception("generate failed")
        return JSONResponse(
            {"error": {"message": str(e), "type": type(e).__name__}},
            status_code=500,
        )


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", "9500"))
    uvicorn.run("server:app", host="0.0.0.0", port=port, reload=False)
