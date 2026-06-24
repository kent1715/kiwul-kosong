# Template Prompt Lengkap — Kiwul Storyboard Studio

> Template ini untuk konsistensi visual antar scene. Semua scene pakai style yang sama, cuma aksi/lokasi yang beda.

---

## 🎨 STYLE DASAR (sama untuk semua scene)

```
Style: cinematic semi-realistic 2D illustration
Color: muted warm tones, cinematic color palette
Lighting: cinematic lighting, soft ambient light
Quality: high detail, sharp focus, professional composition
```

**PENTING:** Jangan campur style antar scene. Kalau scene 1 pakai "semi-realistic", semua scene harus pakai itu juga.

---

## 📐 TEMPLATE 1: Background Prompt (Empty Environment)

**Untuk:** Generate background image (scene tanpa karakter)

```
[LOKASI], 2D animated background, clean cartoon illustration,
environment only, empty [room/street/area], no people, no children,
no silhouettes, no background character, cinematic lighting,
[WAKTU: daytime/nighttime/golden hour], [CUACA: clear/rainy/foggy],
muted warm tones, high detail, professional composition
```

### Contoh:

**Rumah siang:**
```
Indonesian residential interior living room, 2D animated background,
clean cartoon illustration, environment only, empty room, no people,
no children, no silhouettes, cinematic lighting, daytime, clear,
muted warm tones, high detail, professional composition
```

**Lorong malam:**
```
Indonesian residential alley at night, 2D animated background,
clean cartoon illustration, environment only, empty narrow street,
no people, no children, no silhouettes, cinematic lighting, nighttime,
wet road reflecting streetlights, muted warm tones, high detail,
professional composition
```

**Gudang:**
```
Warehouse interior with shelves, 2D animated background,
clean cartoon illustration, environment only, empty warehouse,
no people, no silhouettes, cinematic lighting, daytime, dusty atmosphere,
muted warm tones, high detail, professional composition
```

---

## 📐 TEMPLATE 2: Image Prompt — 2 Karakter (Final Scene)

**Untuk:** Scene dengan 2 character reference (Figure 2 + Figure 3)

```
Create a natural final scene using Figure 1 as the background.
Use Figures 2 and 3 only for character identity, face, hair, clothing,
clothing color, body proportions, silhouette, age, and visual style.
Keep the exact visual style as: cinematic semi-realistic 2D illustration.
Do not copy the original poses, original hand positions, original props,
original weapons, original objects, original pets, or original compositions
of Figures 2 or 3.

Change the pose of the character in Figure 2 to a new acting pose: [AKSI FIGURE 2].
Change the pose of the character in Figure 3 to a new acting pose: [AKSI FIGURE 3].

Place both characters naturally in the scene with clear left/right or
foreground/background positioning. Blend both characters naturally into
the lighting and perspective of Figure 1.

The final result should be a single scene, not a reference sheet,
not a character arrangement, not a poster.
```

### Contoh:

**Arman + Pak Karto di gerbang:**
```
Create a natural final scene using Figure 1 as the background.
Use Figures 2 and 3 only for character identity, face, hair, clothing,
clothing color, body proportions, silhouette, age, and visual style.
Keep the exact visual style as: cinematic semi-realistic 2D illustration.
Do not copy the original poses...

Change the pose of the character in Figure 2 to a new acting pose:
Arman on the left frozen in fear while holding a delivery package and phone.
Change the pose of the character in Figure 3 to a new acting pose:
Pak Karto on the right leaning forward from the gate with a grumpy complaining face.

Place both characters naturally in the scene with clear left/right positioning.
Blend both characters naturally into the lighting and perspective of Figure 1.

The final result should be a single scene, not a reference sheet...
```

---

## 📐 TEMPLATE 3: Image Prompt — 1 Karakter

**Untuk:** Scene dengan 1 character reference (Figure 2 only)

```
Create a natural final scene using Figure 1 as the background.
Use Figure 2 only for character identity, face, hair, clothing,
clothing color, body proportions, silhouette, age, and visual style.
Keep the exact visual style as: cinematic semi-realistic 2D illustration.
Do not copy the original pose, original hand positions, original props,
or original composition of Figure 2.

Change the pose of the character in Figure 2 to a new acting pose: [AKSI KARAKTER].

Place the character naturally in the scene. Blend the character naturally
into the lighting and perspective of Figure 1.

The final result should be a single scene, not a reference sheet.
```

### Contoh:

**Arman ketakutan:**
```
Create a natural final scene using Figure 1 as the background.
Use Figure 2 only for character identity, face, hair, clothing,
clothing color, body proportions, silhouette, age, and visual style.
Keep the exact visual style as: cinematic semi-realistic 2D illustration.
Do not copy the original pose...

Change the pose of the character in Figure 2 to a new acting pose:
Arman standing in the center, eyes wide with fear, holding a phone,
body slightly tensed.

Place the character naturally in the scene. Blend the character naturally
into the lighting and perspective of Figure 1.
```

---

## 📐 TEMPLATE 4: Image Prompt — No Characters

**Untuk:** Scene tanpa karakter (scene_004, scene_034)

```
Create a natural final cinematic environment scene using Figure 1 as the background.
Keep the exact visual style as: cinematic semi-realistic 2D illustration.
No characters, no people, no silhouettes.
Emphasize the scene action through objects and atmosphere: [DETAIL OBJEK/AKTIVITAS].
Muted warm tones, high detail, professional composition.
```

### Contoh:

**Paket di gudang:**
```
Create a natural final cinematic environment scene using Figure 1 as the background.
Keep the exact visual style as: cinematic semi-realistic 2D illustration.
No characters, no people, no silhouettes.
Emphasize the scene action through objects and atmosphere:
several sealed packages on warehouse shelves, a phone on a table
showing a missed call notification, dust particles in the air.
Muted warm tones, high detail, professional composition.
```

---

## 📐 TEMPLATE 5: Video Prompt — 2 Karakter

**Untuk:** Animasi 2 karakter (5 detik)

```
Animate both characters naturally with subtle, realistic motion.
[CHARACTER 1 NAME] [AKSI 1]: [gerakan spesifik, subtle].
[CHARACTER 2 NAME] [AKSI 2]: [gerakan spesifik, subtle].
Keep the camera static (no zoom, no pan). Maintain the exact composition
from the input image. Duration: 5 seconds. Natural physics, no impossible
movements, no character merging, no extra people appearing.
```

### Contoh:

```
Animate both characters naturally with subtle, realistic motion.
Arman: slowly turns his head, eyes wide with fear, grip tightens on the package.
Pak Karto: leans forward slightly, mouth moves as if complaining,
gestures with one hand pointing at Arman.
Keep the camera static (no zoom, no pan). Maintain the exact composition
from the input image. Duration: 5 seconds. Natural physics, no impossible
movements, no character merging, no extra people appearing.
```

---

## 📐 TEMPLATE 6: Video Prompt — 1 Karakter

```
Animate the character naturally with subtle, realistic motion.
[CHARACTER NAME] [AKSI]: [gerakan spesifik, subtle].
Keep the camera static (no zoom, no pan). Maintain the exact composition
from the input image. Duration: 5 seconds. Natural physics, no impossible
movements.
```

### Contoh:

```
Animate the character naturally with subtle, realistic motion.
Arman: chest rises and falls with heavy breathing, eyes dart around
nervously, phone screen glows in his hand.
Keep the camera static (no zoom, no pan). Maintain the exact composition
from the input image. Duration: 5 seconds. Natural physics.
```

---

## 📐 TEMPLATE 7: Video Prompt — No Characters

```
Animate the environment naturally with subtle atmospheric motion.
[GERAKAN LINGKUNGAN: wind, dust, light flicker, water ripple].
Keep the camera static (no zoom, no pan). Maintain the exact composition
from the input image. Duration: 5 seconds. Natural physics.
```

### Contoh:

```
Animate the environment naturally with subtle atmospheric motion.
Dust particles drift slowly through the air, soft light flickers
through the window, a phone screen glows intermittently.
Keep the camera static (no zoom, no pan). Duration: 5 seconds.
```

---

## ❌ NEGATIVE PROMPT

**Tidak perlu isi manual** — sistem sudah otomatis kirim:
- `ANTI_STACKING_NEGATIVE_PROMPT` untuk scene 2-karakter
- `SINGLE_CHARACTER_NEGATIVE_PROMPT` untuk scene 1-karakter

Kalau mau tambah custom negative prompt per scene (optional), isi field `negative_prompt` via API atau UI (kalau sudah ditambahkan).

---

## 📋 CHECKLIST SCENE

Sebelum generate, setiap scene harus punya:

- [ ] `background_prompt` — pakai Template 1
- [ ] `image_prompt` — pakai Template 2/3/4 (sesuai jumlah karakter)
- [ ] `video_prompt` — pakai Template 5/6/7
- [ ] `negative_prompt` — kosong (sistem auto-handle)
- [ ] Character reference assigned (kalau butuh)
- [ ] `duration` = 5

---

## 🎯 TIPS HASIL OPTIMAL

### A. Konsistensi
- Style keyword SAMA di semua scene
- Color palette konsisten (mis. "muted warm tones" untuk semua)
- Jangan campur "anime" + "realistic" di project yang sama

### B. Background
- Selalu sebut "no people, no silhouettes"
- Tambah dekorasi kalau dinding kosong (frame, rak, tirai) — cegah ghost
- Sebut waktu (daytime/nighttime) untuk konsistensi lighting

### C. Character Pose
- Spesifik: "frozen in fear", "leaning forward", "standing tall"
- Sebut posisi: "on the left", "in the center", "foreground"
- Sebut prop: "holding a phone", "gripping a package"

### D. Video Motion
- Subtle motion lebih baik dari dramatic
- Maksimal 2 gerakan per karakter (mis. "turns head" + "grip tightens")
- Jangan minta "berlari" atau "melompat" — WAN 2.2 i2v terbatas

### E. Yang Dihindari
- ❌ "people", "crowd", "children" di background_prompt
- ❌ Campur style (anime + realistic)
- ❌ Pose kompleks ("berlari menyeberang jalan")
- ❌ "reference sheet", "character arrangement" di image_prompt

---

## 🔧 SCRIPT AUTO-GENERATE

File: `generate-prompts.cjs` (download dari preview panel)

Script ini akan:
1. Read semua scene dari DB
2. Apply template berdasarkan jumlah character reference
3. Save ke DB via PATCH API

**Cara pakai:**
1. Edit script, isi `[AKSI]` per scene (lihat contoh di script)
2. Jalankan `node generate-prompts.cjs`
3. Review hasil di UI
4. Generate All

---

## 📝 CONTOH SCENE LENGKAP

### Scene 1 (2 karakter: Arman + Pak Karto)

**background_prompt:**
```
Indonesian residential gate at night, 2D animated background,
clean cartoon illustration, environment only, empty gate area,
no people, no children, no silhouettes, cinematic lighting,
nighttime, streetlight glow, muted warm tones, high detail,
professional composition
```

**image_prompt:**
```
Create a natural final scene using Figure 1 as the background.
Use Figures 2 and 3 only for character identity, face, hair, clothing...
Keep the exact visual style as: cinematic semi-realistic 2D illustration.

Change the pose of the character in Figure 2 to a new acting pose:
Arman on the left frozen in fear while holding a delivery package and phone.
Change the pose of the character in Figure 3 to a new acting pose:
Pak Karto on the right leaning forward from the gate with a grumpy complaining face.

Place both characters naturally in the scene with clear left/right positioning.
```

**video_prompt:**
```
Animate both characters naturally with subtle, realistic motion.
Arman: slowly turns his head, eyes wide with fear, grip tightens.
Pak Karto: leans forward, mouth moves complaining, gestures with hand.
Keep the camera static. Duration: 5 seconds.
```

---

**Template ini dipakai untuk semua 60 scene. Konsistensi style = hasil terlihat professional.**
