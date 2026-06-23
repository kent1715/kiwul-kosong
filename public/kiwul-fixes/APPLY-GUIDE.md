# Panduan Menerapkan Perbaikan ke Komputer Windows Kamu

> File-file di folder ini adalah hasil perbaikan yang sudah saya buat di sandbox.
> Kamu tidak perlu copy-paste manual — cukup download file-file di sini
> lalu ikuti langkah di bawah.

---

## Daftar file di folder ini

| File | Untuk apa |
|------|-----------|
| `image_qwen_image_edit_2509.json` | Workflow ComfyUI baru (FP8, tanpa AuraFlow) |
| `image-route.ts` | File route.ts LENGKAP yang sudah ditambah negative prompt |
| `route-ts.diff` | Diff perubahan route.ts (buat kamu yang mau lihat apa yang berubah) |
| `server.py` | Kode proxy baru port 9500 (FastAPI) |
| `requirements.txt` | Dependency Python untuk proxy |
| `run.cmd` | Script startup proxy di Windows |
| `check-negative-prompt-forward.py` | Tool test apakah proxy forward negative_prompt |
| `APPLY-GUIDE.md` | File ini |

---

## SEBELUM MULAI

1. Pastikan repo storyboard-kiwul sudah ada di komputer kamu (mis. `D:\storyboard-kiwul`).
2. **Stop dulu semua service yang jalan:**
   - Next.js dev server (tutup terminal yang jalan `bun run dev`)
   - Proxy port 9500 (tutup terminal yang ada "Z-Image Proxy" atau sejenis)
   - ComfyUI port 8188 (tutup terminal `run-comfyui.cmd`)
3. **Backup workflow lama** (kalau nanti mau balik):
   ```cmd
   cd D:\storyboard-kiwul
   copy workflows\image_qwen_image_edit_2509.json workflows\image_qwen_image_edit_2509.backup-lama.json
   ```

---

## LANGKAH 1 — Download model FP8 (WAJIB)

Workflow baru pakai model FP8, bukan GGUF. Kalau file ini belum ada, ComfyUI akan error.

1. Download file: `qwen_image_edit_2509_fp8_e4m3fn.safetensors`
   - Sumber resmi: HuggingFace `Qwen/Qwen-Image-Edit-2509` (cari file fp8)
   - Atau mirror ComfyUI org
2. Letakkan di:
   ```
   C:\ComfyUI\models\diffusion_models\qwen_image_edit_2509_fp8_e4m3fn.safetensors
   ```
3. **Cek file lain yang dipakai workflow** (seharusnya sudah ada dari setup lama):
   - `C:\ComfyUI\models\clip\qwen_2.5_vl_7b_fp8_scaled.safetensors`
   - `C:\ComfyUI\models\vae\qwen_image_vae.safetensors`
   - `C:\ComfyUI\models\loras\Qwen-Image-Lightning-4steps-V1.0.safetensors`

> Kalau ada yang belum ada, download dari repositori ComfyUI Qwen-Image.

---

## LANGKAH 2 — Ganti workflow JSON

1. Download file `image_qwen_image_edit_2509.json` dari folder ini.
2. Timpa file lama di repo kamu:
   ```
   D:\storyboard-kiwul\workflows\image_qwen_image_edit_2509.json
   ```
   (kalau ragu, backup dulu yang lama — lihat SEBELUM MULAI)

---

## LANGKAH 3 — Update route.ts (negative prompt anti-stacking)

**Opsi A (ganti total — paling gampang):**
1. Download `image-route.ts` dari folder ini.
2. Timpa file:
   ```
   D:\storyboard-kiwul\src\app\api\storyboard\[projectId]\scenes\[sceneId]\image\route.ts
   ```
   Ganti nama file dari `image-route.ts` menjadi `route.ts` saat disimpan.

**Opsi B (pakai diff — kalau kamu sudah ubah route.ts sendiri):**
```cmd
cd D:\storyboard-kiwul
git apply route-ts.diff
```

---

## LANGKAH 4 — Setup proxy port 9500 yang baru

> Bagian ini HANYA kalau proxy lama kamu tidak meneruskan `negative_prompt`
> ke node 110 workflow ComfyUI. Kalau belum yakin, jalankan LANGKAH 6 dulu
> untuk ngetes proxy lama. Kalau FAIL, baru lakukan langkah ini.

### 4.1 Buat folder proxy baru
```cmd
cd D:\storyboard-kiwul
mkdir proxy\qwen2509-editplus-proxy
cd proxy\qwen2509-editplus-proxy
```

### 4.2 Download 4 file dari folder ini ke folder `proxy\qwen2509-editplus-proxy\`:
- `server.py`
- `requirements.txt`
- `run.cmd`
- `check-negative-prompt-forward.py`

### 4.3 Sesuaikan path di `server.py` (HANYA kalau ComfyUI kamu bukan di `C:\ComfyUI`)
Buka `server.py`, cari baris ini (sekitar baris 30-40):
```python
COMFYUI_URL = os.environ.get("COMFYUI_URL", "http://127.0.0.1:8188")
COMFYUI_INPUT_DIR = Path(os.environ.get("COMFYUI_INPUT_DIR", r"C:\ComfyUI\input"))
```
Ganti `C:\ComfyUI\input` sesuai path ComfyUI kamu.

### 4.4 Hentikan proxy LAMA kamu
Tutup window terminal yang jalan proxy port 9500 lama.

---

## LANGKAH 5 — Start semua service (urutan PENTING)

### 5.1 Start ComfyUI
```cmd
D:\storyboard-kiwul\scripts-start\run-comfyui.cmd
```
Tunggu sampai muncul `To see the GUI go to: http://127.0.0.1:8188`

### 5.2 Start proxy baru (window terminal BARU)
```cmd
cd D:\storyboard-kiwul\proxy\qwen2509-editplus-proxy
run.cmd
```
- Pertama kali: akan buat venv + install dependency (butuh internet, ~2 menit)
- Setelah jalan: muncul `Uvicorn running on http://0.0.0.0:9500`

### 5.3 Start Next.js dev (window terminal BARU)
```cmd
cd D:\storyboard-kiwul
bun run dev
```
Tunggu sampai `Ready in ...`

### 5.4 (Opsional) Start service lain yang kamu pakai
- `run-zimage-ui.cmd` (port 9000, Z-Image Turbo)
- `run-zimage-proxy.cmd` (port 9100)
- `run-video-proxy.cmd`

---

## LANGKAH 6 — Test apakah perbaikan berhasil

### 6.1 Test proxy dengan tool diagnostik
```cmd
cd D:\storyboard-kiwul\proxy\qwen2509-editplus-proxy
.venv\Scripts\activate
python check-negative-prompt-forward.py --proxy http://127.0.0.1:9500
```

Output yang diharapkan:
```
PASS: marker NEGCHECK_xxxxxxxx ditemukan di node 110.
     -> Proxy kamu SUDAH meneruskan negative_prompt dengan benar.
```

Kalau **FAIL**: proxy belum forward negative_prompt. Pastikan kamu pakai `server.py` yang baru (LANGKAH 4), bukan proxy lama.

### 6.2 Test dari UI storyboard
1. Buka aplikasi storyboard di browser (biasanya `http://localhost:3000`)
2. Buka project yang ada scene 2-karakter
3. Klik tombol Generate Image untuk 1 scene
4. Cek log di terminal proxy (window LANGKAH 5.2) — harus muncul:
   ```
   forwarded negative_prompt -> node 110 = 'blended faces, merged body, ...
   ```
5. Cek log di terminal Next.js (window LANGKAH 5.3) — harus muncul:
   ```
   [image negative_prompt] { resolvedNegativePrompt: 'blended faces, ...' }
   ```
6. Hasil image: karakter tidak boleh menumpuk/merge/ghosting

---

## TROUBLESHOOTING

### Error: "model not found: qwen_image_edit_2509_fp8_e4m3fn.safetensors"
→ Model FP8 belum didownload atau salah path. Ulangi LANGKAH 1.

### Error: "Could not resolve: next/server" saat bun run dev
→ Jalankan `bun install` dulu di folder repo.

### Proxy 9500 tidak bisa dihubungi
→ Cek `run.cmd` sudah jalan. Test: buka browser ke `http://127.0.0.1:9500/health`
   Harus muncul JSON dengan `"ok": true`.

### Tool diagnostik FAIL padahal pakai server.py baru
→ Pastikan tidak ada proxy LAMA yang masih jalan di port 9500.
   Cek: `netstat -ano | findstr :9500` — harus hanya satu PID.

### Image masih stacking setelah semua langkah
→ Cek apakah workflow JSON di proxy benar-benar yang baru.
   Buka `http://127.0.0.1:9500/health`, lihat field `workflow_path` dan `workflow_exists`.
   Pastikan file di path itu adalah `image_qwen_image_edit_2509.json` yang baru (cek: punya node "116" class "UNETLoader").

### ComfyUI error "node 116 UNETLoader not found"
→ ComfyUI kamu versi lama. Update ComfyUI:
   ```cmd
   cd C:\ComfyUI
   git pull
   pip install -r requirements.txt
   ```

---

## RINGKASAN URUTAN

```
[STOP semua service]
  ↓
[LANGKAH 1] download model FP8
  ↓
[LANGKAH 2] ganti workflow JSON
  ↓
[LANGKAH 3] update route.ts
  ↓
[LANGKAH 4] setup proxy baru (kalau perlu)
  ↓
[LANGKAH 5] start ComfyUI → proxy → Next.js
  ↓
[LANGKAH 6] test diagnostik + test UI
```

Kalau salah satu langkah bermasalah, kasih tahu saya pesan error-nya.
