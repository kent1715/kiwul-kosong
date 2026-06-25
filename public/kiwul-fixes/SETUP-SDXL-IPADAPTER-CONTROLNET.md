# Setup SDXL + IP-Adapter + ControlNet — Panduan Lengkap

> Hybrid strategy: Pakai Qwen Edit untuk produksi 60 scene sekarang, sambil setup SDXL pipeline paralel untuk scene kompleks yang butuh pose ekstrem.
>
> GPU: 16GB VRAM (cukup untuk SDXL + IP-Adapter + ControlNet)

---

## 📋 ROADMAP HYBRID

### Phase 1 — Produksi Qwen (SEKARANG, 0 setup)
- Pakai Qwen Edit-2509 untuk 60 scene
- Accept limitation (pose frontal, emosi mild)
- Hasil: storyboard complete, bisa langsung pakai

### Phase 2 — Setup SDXL Pipeline (PARALEL, 1-2 hari)
- Download models (~15 GB)
- Install custom nodes ComfyUI
- Build workflow ComfyUI (SDXL + IP-Adapter + ControlNet)
- Build proxy baru (port 9600)
- Test dengan scene kunci

### Phase 3 — Switch Scene Kunci ke SDXL (SETELAH SETUP)
- Regenerate 5-10 scene kunci dengan SDXL (pose ekstrem)
- Scene lain tetap pakai Qwen (frontal, simple)
- Hasil: hybrid — Qwen untuk simple, SDXL untuk kompleks

---

## 🛠️ PHASE 2 SETUP — Step by Step

### Step 1 — Download Models (15 GB total)

#### 1.1 SDXL Base Model (6.5 GB)
```
URL: https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0/resolve/main/sd_xl_base_1.0.safetensors
Save to: C:\ComfyUI\models\checkpoints\sd_xl_base_1.0.safetensors
```

#### 1.2 IP-Adapter Models (~3 GB)
```
URL 1: https://huggingface.co/h94/IP-Adapter/resolve/main/sdxl_models/ip-adapter_sdxl_vit-h.safetensors
Save to: C:\ComfyUI\models\ipadapter\ip-adapter_sdxl_vit-h.safetensors

URL 2: https://huggingface.co/h94/IP-Adapter/resolve/main/sdxl_models/ip-adapter-plus_sdxl_vit-h.safetensors
Save to: C:\ComfyUI\models\ipadapter\ip-adapter-plus_sdxl_vit-h.safetensors

URL 3: https://huggingface.co/h94/IP-Adapter/resolve/main/sdxl_models/ip-adapter-faceid-plusv2_sdxl.bin
Save to: C:\ComfyUI\models\ipadapter\ip-adapter-faceid-plusv2_sdxl.bin
```

#### 1.3 CLIP Vision Model (untuk IP-Adapter, ~3.5 GB)
```
URL: https://huggingface.co/h94/IP-Adapter/resolve/main/models/image_encoder/model.safetensors
Save to: C:\ComfyUI\models\clip_vision\CLIP-ViT-H-14-laion2B-s32B-b79K.safetensors
Rename: model.safetensors → CLIP-ViT-H-14-laion2B-s32B-b79K.safetensors
```

#### 1.4 ControlNet OpenPose SDXL (~2.5 GB)
```
URL: https://huggingface.co/thibaud/controlnet-openpose-sdxl-1.0/resolve/main/controlnet-openpose-sdxl-1.0.safetensors
Save to: C:\ComfyUI\models\controlnet\controlnet-openpose-sdxl-1.0.safetensors
```

#### 1.5 (Opsional) ControlNet Depth + Canny
```
Depth: https://huggingface.co/thibaud/controlnet-depth-sdxl-1.0/resolve/main/controlnet-depth-sdxl-1.0.safetensors
Canny: https://huggingface.co/thibaud/controlnet-canny-sdxl-1.0/resolve/main/controlnet-canny-sdxl-1.0.safetensors
Save to: C:\ComfyUI\models\controlnet\
```

### Step 2 — Install Custom Nodes ComfyUI

#### 2.1 Buka ComfyUI Manager
1. Buka browser → `http://127.0.0.1:8188`
2. Klik tombol **Manager** (kanan atas)
3. Klik **Install Custom Nodes**

#### 2.2 Install 3 Custom Nodes

**Node 1: ComfyUI-IP-Adapter-Plus**
```
Search: "IP-Adapter-Plus"
Repo: https://github.com/cubiq/ComfyUI_IPAdapter_plus
Install → Restart ComfyUI
```

**Node 2: ComfyUI-ControlNet-Aux** (untuk OpenPose preprocessor)
```
Search: "ControlNet-Aux" atau "comfyui_controlnet_aux"
Repo: https://github.com/Fannovel16/comfyui_controlnet_aux
Install → Restart ComfyUI
```

**Node 3: (sudah ada) ComfyUI-VideoHelperSuite**
```
Cek: sudah terinstall (untuk video)
```

#### 2.3 Atau Install Manual via Git
```powershell
cd C:\ComfyUI\custom_nodes

git clone https://github.com/cubiq/ComfyUI_IPAdapter_plus.git
git clone https://github.com/Fannovel16/comfyui_controlnet_aux.git

# Install dependencies
cd ComfyUI_IPAdapter_plus
pip install -r requirements.txt

cd ..\comfyui_controlnet_aux
pip install -r requirements.txt

# Restart ComfyUI
```

### Step 3 — Build Workflow ComfyUI

#### 3.1 Workflow Scene 2-Karakter (SDXL + IP-Adapter + ControlNet)

Setelah install custom nodes, build workflow ini di ComfyUI UI:

```yaml
# Workflow: sdxl_2char_ipadapter_controlnet.json

Nodes:
  # === LOAD MODELS ===
  1. CheckpointLoaderSimple
     - ckpt_name: sd_xl_base_1.0.safetensors

  2. CLIPVisionLoader
     - clip_name: CLIP-ViT-H-14-laion2B-s32B-b79K.safetensors

  3. ControlNetLoader
     - control_net_name: controlnet-openpose-sdxl-1.0.safetensors

  # === LOAD IMAGES ===
  4. LoadImage (reference Arman) → node 5
  5. IPAdapterApply (model: ip-adapter-faceid-plusv2_sdxl, weight: 0.7)

  6. LoadImage (reference Pak Karto) → node 7
  7. IPAdapterApply (model: ip-adapter-faceid-plusv2_sdxl, weight: 0.7)

  8. LoadImage (background) → node 9 (VAEEncode)
  9. VAEEncode → base latent

  10. LoadImage (OpenPose skeleton 2 char) → node 11
  11. ControlNetApply (strength: 1.0)

  # === TEXT ENCODE ===
  12. CLIPTextEncode (positive prompt)
  13. CLIPTextEncode (negative prompt)

  # === SAMPLER ===
  14. KSampler
      - model: SDXL + IP-Adapter A + IP-Adapter B + ControlNet
      - positive: text + ipadapter_a + ipadapter_b + controlnet
      - negative: text
      - latent_image: base (from background)
      - steps: 25
      - cfg: 7.0
      - sampler: dpmpp_2m
      - scheduler: karras
      - denoise: 0.7 (img2img, preserve some background)

  15. VAEDecode → SaveImage
```

#### 3.2 Save Workflow
1. Di ComfyUI UI, susun nodes di atas
2. Klik **Save** → beri nama `sdxl_2char_ipadapter_controlnet.json`
3. Save ke `D:\storyboard-kiwul\workflows\sdxl_2char_ipadapter_controlnet.json`

### Step 4 — Generate OpenPose Skeleton Library

Untuk control pose, kamu butuh skeleton per pose type. 2 cara:

#### Cara A — DWPose Estimator (auto-extract dari foto)
```
1. Cari/foto orang dengan pose target (mis. back view, 3/4 view)
2. Upload ke ComfyUI
3. Pakai node DWPoseEstimator → extract skeleton
4. Save skeleton image → pakai sebagai ControlNet input
```

#### Cara B — OpenPose Editor Manual (web tool)
```
URL: https://pose.my.wiki/ atau https://github.com/lllyasviel/OpenPoseEditor
1. Buka editor
2. Drag keypoints ke pose yang diinginkan
3. Export sebagai PNG
4. Pakai sebagai ControlNet input
```

#### Library Pose yang Direkomendasikan (10 pose)
```
1. frontal_standing.png       - berdiri frontal netral
2. frontal_walking.png        - berjalan frontal
3. side_profile_walking.png   - berjalan tampak samping
4. back_view_walking.png      - berjalan membelakangi
5. three_quarter_view.png     - 3/4 view
6. crouching.png              - jongkok
7. leaning_forward.png        - condong ke depan
8. turning_head.png           - menoleh
9. reaching_out.png           - meraih
10. scared_pose.png           - pose ketakutan
```

### Step 5 — Build Proxy Baru (port 9600)

Buat folder + proxy untuk SDXL pipeline:

```powershell
# Buat folder
mkdir D:\storyboard-kiwul\proxy\sdxl-ipadapter-proxy
```

File: `D:\storyboard-kiwul\proxy\sdxl-ipadapter-proxy\server.py`
```python
"""
Proxy SDXL + IP-Adapter + ControlNet untuk scene 2-karakter dengan pose ekstrem.
Port 9600

Request body:
  - prompt: text prompt
  - negative_prompt: text
  - reference_images: [
      { type: 'character', name: 'char_A', image: data_url },
      { type: 'character', name: 'char_B', image: data_url },
      { type: 'base', image: data_url },  # background
      { type: 'pose', image: data_url }   # OpenPose skeleton
    ]
  - size: "1024x576" (16:9) atau "576x1024" (9:16)

Workflow: workflows/sdxl_2char_ipadapter_controlnet.json
"""
# Implementation mirip dengan proxy Qwen port 9500
# Tapi load workflow SDXL, apply IP-Adapter + ControlNet
# ... (akan diimplement setelah workflow ComfyUI jadi)
```

### Step 6 — Update Route.ts untuk Hybrid

Modifikasi `image/route.ts` supaya:
- Scene simple (1-karakter, frontal) → Qwen (port 9500)
- Scene kompleks (2-karakter, pose ekstrem) → SDXL (port 9600)

```typescript
// Logic routing hybrid
const useSDXL = 
  characterReferences.length >= 2 && 
  scene.use_sdxl === true;  // flag per scene

const selectedProvider = useSDXL
  ? { base_url: 'http://127.0.0.1:9600', model: 'sdxl-ipadapter-controlnet' }
  : useTwoCharacterProvider
    ? { base_url: 'http://127.0.0.1:9500', model: 'kiwul-qwen2509-editplus' }
    : provider;
```

---

## 📊 PERBANDINGAN HASIL EXPECTED

| Aspek | Qwen Edit-2509 | SDXL + IP-Adapter + ControlNet |
|-------|----------------|-------------------------------|
| **Pose frontal** | ✅ Bagus | ✅ Bagus |
| **Pose ekstrem (back/side)** | ❌ Gagal | ✅ Bisa |
| **Identity preservation** | ✅ Excellent | ✅ Good (IP-Adapter Face) |
| **Multi-character** | ✅ 2 char | ✅ 2-4 char |
| **Quality** | ✅ High | ✅ High |
| **Speed per image** | ⚡ ~3 menit | 🐢 ~8-10 menit |
| **VRAM** | ~8 GB | ~12 GB |
| **Setup** | ✅ Done | ⚠️ 1-2 hari |

---

## 🎯 PRIORITAS SETUP

Kalau mau mulai setup SDXL, urutan prioritas:

### Prioritas 1 — Download models (bisa paralel dengan produksi Qwen)
```powershell
# Download semua model sambil generate Qwen jalan
# Butuh internet stabil, ~15 GB
```

### Prioritas 2 — Install custom nodes (30 menit)
```powershell
# Via ComfyUI Manager atau git clone
# Restart ComfyUI setelah install
```

### Prioritas 3 — Build workflow + test (2-4 jam)
```
1. Build workflow di ComfyUI UI
2. Test dengan 1 scene manual
3. Tweak weight IP-Adapter + ControlNet
4. Save workflow JSON
```

### Prioritas 4 — Build proxy + integrate route (3-4 jam)
```
1. Adaptasi server.py dari proxy Qwen
2. Handle 4 reference (2 char + 1 bg + 1 pose)
3. Update route.ts untuk hybrid routing
4. Test end-to-end
```

### Prioritas 5 — Generate OpenPose library (2-3 jam)
```
1. Identify 10-20 pose yang dibutuhkan
2. Generate/extract OpenPose skeleton
3. Save ke folder poses/
4. Map scene → pose
```

---

## 📝 CHECKLIST SETUP

- [ ] Download sd_xl_base_1.0.safetensors (6.5 GB)
- [ ] Download IP-Adapter models (3 GB)
- [ ] Download CLIP Vision model (3.5 GB)
- [ ] Download ControlNet OpenPose SDXL (2.5 GB)
- [ ] Install ComfyUI-IP-Adapter-Plus (custom node)
- [ ] Install ComfyUI-ControlNet-Aux (custom node)
- [ ] Restart ComfyUI
- [ ] Build workflow sdxl_2char_ipadapter_controlnet.json
- [ ] Test workflow manual di ComfyUI UI
- [ ] Tweak IP-Adapter weight (0.6-0.8)
- [ ] Tweak ControlNet weight (0.8-1.2)
- [ ] Save workflow JSON
- [ ] Build proxy port 9600
- [ ] Update route.ts untuk hybrid routing
- [ ] Generate OpenPose library (10-20 pose)
- [ ] Test end-to-end dengan scene_001

---

## 🚀 CARA MULAI

### Sekarang:
1. **Start download models** (butuh waktu, bisa paralel)
2. **Lanjut produksi Qwen** untuk 60 scene (accept limitation)
3. **Sambil tunggu download**, install custom nodes

### Setelah download selesai:
1. Build workflow ComfyUI
2. Test manual dengan scene_001
3. Kalau OK → build proxy + integrate route

### Saya bantu:
- Workflow JSON template (setelah custom nodes terinstall)
- Proxy server.py (adaptasi dari Qwen proxy)
- Route.ts hybrid routing
- OpenPose library guide

---

## 💡 TIPS

### A. Download Model Cepat
Pakai `aria2c` atau `wget` untuk download parallel:
```powershell
# Install aria2
winget install aria2.aria2

# Download parallel (4 connection per file)
aria2c -x 4 -s 4 "https://huggingface.co/..." -d "C:\ComfyUI\models\checkpoints\"
```

### B. Test Workflow Tanpa Proxy
Sebelum build proxy, test workflow langsung di ComfyUI UI:
1. Load workflow JSON
2. Manual load images (reference, background, pose)
3. Queue prompt
4. Cek hasil

Kalau hasil bagus → baru build proxy untuk automate.

### C. IP-Adapter Weight Tuning
- Weight 0.5 → identity lemah, pose dominant
- Weight 0.7 → balanced (RECOMMENDED)
- Weight 0.9 → identity kuat, pose lemah

### D. ControlNet Weight Tuning
- Weight 0.5 → pose guidance lemah
- Weight 1.0 → pose guidance kuat (RECOMMENDED)
- Weight 1.5 → pose terlalu rigid

---

**Next step:** Mulai download models sekarang (butuh waktu lama). Sambil download, lanjut produksi Qwen. Setelah download selesai, kasih tahu saya — saya bantu build workflow + proxy.
