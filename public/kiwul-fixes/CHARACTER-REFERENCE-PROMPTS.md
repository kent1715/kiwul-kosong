# Prompt Generate Character Reference — Kiwul Storyboard Studio

> Prompt ini untuk generate karakter reference image yang optimal untuk dipakai di Qwen-Image-Edit-2509.
> Hasil: close-up wajah + upper body, background polos, pose netral, lighting merata.

---

## 🎯 PRINSIP DASAR CHARACTER REFERENCE

Karakter reference yang BAIK untuk image-to-image:

| Element | Harus | Sebab |
|---------|-------|-------|
| **Framing** | Close-up wajah + upper body | Qwen fokus ke identity (face, hair, outfit) |
| **Background** | Polos (putih/abu-abu/hijau) | Hindari distraksi, model fokus ke karakter |
| **Pose** | Netral frontal, menghadap kamera | Identity paling jelas dari frontal |
| **Lighting** | Merata, soft, no harsh shadow | Wajah terlihat jelas dari semua sisi |
| **Expression** | Netral (tidak emo berlebih) | Ekspresi scene diatur via image_prompt, bukan reference |
| **Outfit** | Lengkap terlihat (jaket, celana, aksesori) | Model replicate outfit di scene final |
| **Resolution** | Minimum 768×768, ideal 1024×1024 | Detail cukup untuk identity transfer |

---

## 📐 STRUKTUR PROMPT (Template Universal)

```
[CHARACTER NAME], [GENDER] [AGE] [ETHNICITY],
[FACE DESCRIPTION], [HAIR DESCRIPTION],
wearing [OUTFIT DESCRIPTION], [OUTFIT COLOR],
[BODY PROPORTION], [EXPRESSION],
neutral frontal pose, facing camera, head and shoulders visible,
clean [BACKGROUND COLOR] background, soft even studio lighting,
no harsh shadows, high detail face, sharp focus,
cinematic semi-realistic 2D illustration style,
professional character reference sheet quality
```

---

## 🎬 PROMPT PER KARAKTER (4 Karakter Story "Pocong Salah Alamat COD")

### Karakter 1: ARMAN (Kurir COD)

**Generate prompt:**
```
Arman, male 27 years old Indonesian young adult,
warm medium-brown skin, oval face, expressive tired eyes,
thick eyebrows, slightly rounded nose, faint mustache shadow,
friendly but anxious look,
short black hair slightly messy under a dark green delivery cap,
neat sideburns,
wearing dark green courier jacket with orange reflective accents,
plain black t-shirt underneath, black cargo pants, black sneakers,
small sling delivery bag across shoulder,
average height, slim but slightly tired build, natural human proportions,
neutral calm expression, mouth closed, looking directly at camera,
neutral frontal pose, head and shoulders visible,
clean light gray background, soft even studio lighting,
no harsh shadows, high detail face, sharp focus,
cinematic semi-realistic 2D illustration style,
professional character reference sheet quality
```

**Negative prompt (kalau perlu):**
```
multiple people, extra characters, side view, back view, profile,
busy background, props in hand, exaggerated expression,
smiling, angry, sad, deformed face, blurry, low quality
```

---

### Karakter 2: PAK KARTO (Pocong Tua)

**Generate prompt:**
```
Pak Karto, elderly Indonesian male pocong ghost,
traditional white pocong burial shroud tied above the head and near the feet,
shroud covering entire body except face area,
wrinkled elderly face visible through shroud opening,
grumpy tired eyes, furrowed eyebrows, thin white beard stubble,
annoyed impatient expression,
shroud draped naturally with folds, cloth texture visible,
tied at top forming pointed head shape,
tied at bottom near feet area,
slim frail elderly body proportion,
neutral frontal pose, head and shoulders visible,
clean dark gray background, soft even studio lighting,
eerie but comedic atmosphere, no harsh shadows,
high detail face, sharp focus,
cinematic semi-realistic 2D illustration style,
professional character reference sheet quality
```

**Negative prompt:**
```
multiple ghosts, extra characters, side view, back view,
modern clothing, human skin visible, scary horror gore,
blood, decomposed, busy background, exaggerated expression,
deformed face, blurry, low quality
```

---

### Karakter 3: BOWO (Sahabat Arman)

**Generate prompt:**
```
Bowo, male 28 years old Indonesian young adult,
warm medium-brown skin, round face, confident smug eyes,
thin eyebrows, flat nose, clean shaven,
smug confident smirk expression,
short black hair neatly styled, no cap,
wearing casual short-sleeve blue shirt, simple wristwatch,
blue jeans, brown sandals,
average height, slightly chubby build, natural human proportions,
neutral confident pose, mouth slightly curved in smirk, looking directly at camera,
neutral frontal pose, head and shoulders visible,
clean light blue background, soft even studio lighting,
no harsh shadows, high detail face, sharp focus,
cinematic semi-realistic 2D illustration style,
professional character reference sheet quality
```

**Negative prompt:**
```
multiple people, extra characters, side view, back view, profile,
busy background, props in hand, exaggerated expression,
delivery uniform, cap, deformed face, blurry, low quality
```

---

### Karakter 4: MAYA (Seller Online Misterius)

**Generate prompt:**
```
Maya, female 26 years old Indonesian young adult,
warm medium-brown skin, oval face, sharp calculating eyes,
thin arched eyebrows, small nose, polite fake smile,
long straight black hair tied in a neat ponytail,
wearing online shop seller blouse (cream color), long skirt,
simple flats, small phone pouch on waist,
slim build, natural human proportions, professional posture,
neutral polite expression with subtle fake smile, looking directly at camera,
neutral frontal pose, head and shoulders visible,
clean light cream background, soft even studio lighting,
no harsh shadows, high detail face, sharp focus,
cinematic semi-realistic 2D illustration style,
professional character reference sheet quality
```

**Negative prompt:**
```
multiple people, extra characters, side view, back view, profile,
busy background, props in hand, exaggerated expression,
angry, sad, deformed face, blurry, low quality
```

---

## 🛠️ CARA PAKAI PROMPT INI

### Opsi A — Generate via ComfyUI (recommended, paling konsisten)

1. Buka ComfyUI UI (`http://127.0.0.1:8188`)
2. Pakai workflow sederhana: text-to-image (bukan image-edit)
3. Set prompt = prompt karakter di atas
4. Set model = Qwen-Image-Edit-2509 (atau SDXL fine-tuned untuk character)
5. Set resolution = 1024×1024
6. Generate 4-8 variasi per karakter, pilih yang terbaik

### Opsi B — Generate via proxy Z-Image (port 9100)

Z-Image Turbo bisa generate character reference tanpa input image. Kirim request:

```powershell
$body = @{
    model = "z-image-turbo"
    prompt = "Arman, male 27 years old Indonesian young adult, warm medium-brown skin, oval face, expressive tired eyes, thick eyebrows, slightly rounded nose, faint mustache shadow, friendly but anxious look, short black hair slightly messy under a dark green delivery cap, neat sideburns, wearing dark green courier jacket with orange reflective accents, plain black t-shirt underneath, black cargo pants, black sneakers, small sling delivery bag across shoulder, average height, slim but slightly tired build, natural human proportions, neutral calm expression, mouth closed, looking directly at camera, neutral frontal pose, head and shoulders visible, clean light gray background, soft even studio lighting, no harsh shadows, high detail face, sharp focus, cinematic semi-realistic 2D illustration style, professional character reference sheet quality"
    negative_prompt = "multiple people, extra characters, side view, back view, profile, busy background, props in hand, exaggerated expression, smiling, angry, sad, deformed face, blurry, low quality"
    size = "1024x1024"
    n = 1
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://127.0.0.1:9100/v1/images/generations" -Method Post -Body $body -ContentType "application/json" -TimeoutSec 300
```

### Opsi C — Generate via UI Storyboard (ReferencePanel)

1. Buka UI storyboard
2. Klik panel Reference (di header)
3. Upload section: paste prompt ke field prompt
4. Klik Generate
5. Save sebagai character reference

---

## 📋 TIPS HASIL OPTIMAL

### A. Generate Beberapa Variasi
Generate 4-8 variasi per karakter, pilih yang:
- ✅ Wajah paling jelas
- ✅ Outfit lengkap terlihat
- ✅ Pose netral (tidak miring)
- ✅ Background paling polos
- ✅ Lighting merata (no harsh shadow)

### B. Edit Post-Process (kalau perlu)
Kalau hasil generate bagus tapi background rame:
- Inpaint background → ganti jadi polos
- Atau crop tighter ke wajah + upper body

### C. Konsistensi Style
Pastikan semua 4 karakter di-generate dengan:
- Style keyword sama: `cinematic semi-realistic 2D illustration`
- Lighting sama: `soft even studio lighting`
- Framing sama: `head and shoulders visible, neutral frontal pose`

### D. Hindari
- ❌ Foto real manusia (akan terlihat tidak match dengan scene 2D)
- ❌ Karakter dengan prop berlebihan (pisau, senjata)
- ❌ Background rame (pohon, rumah, orang lain)
- ❌ Pose extreme (sambil berlari, melompat)
- ❌ Ekspresi berlebihan (marah, ketawa)

---

## 🔄 SETELAH GENERATE CHARACTER REFERENCE

1. **Upload ke ReferencePanel** di UI storyboard
2. **Assign ke scene** pakai script:
   - `smart-assign-apply.cjs` (25 scene 2-karakter)
   - `assign-remaining-scenes.cjs` (33 scene sisanya)
3. **Generate All Images** — sekarang character reference baru akan dipakai

---

## 📝 CHECKLIST KARAKTER REFERENCE

Setiap karakter reference harus:

- [ ] Close-up wajah + upper body (head to chest)
- [ ] Background polos (putih/abu/cream)
- [ ] Pose netral frontal (menghadap kamera)
- [ ] Lighting merata (no harsh shadow)
- [ ] Ekspresi netral (tidak emo berlebih)
- [ ] Outfit lengkap terlihat (jaket, celana, aksesori)
- [ ] Resolution ≥ 768×768
- [ ] Style: cinematic semi-realistic 2D illustration
- [ ] Format PNG
- [ ] File size 500KB - 2MB

---

## 🎯 RINGKASAN

**4 prompt siap pakai:**
1. Arman — kurir COD
2. Pak Karto — pocong tua
3. Bowo — sahabat Arman
4. Maya — seller online

**Cara pakai:**
1. Generate via ComfyUI / Z-Image proxy / UI
2. Pilih hasil terbaik (4-8 variasi per karakter)
3. Upload ke ReferencePanel
4. Assign ke scene
5. Generate All Images

**Hasil:** Character reference berkualitas tinggi → Qwen Edit-2509 akan reproduce identity dengan konsisten di semua scene.
