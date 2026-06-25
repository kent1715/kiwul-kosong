# Emotion Library — Prompt untuk Eksplresi Karakter Sesuai Cerita

> Reference untuk tambah emosi eksplisit ke image_prompt supaya karakter tidak datar.
> Setiap emosi = deskripsi fisik detail (mata, mulut, alis, keringat, dll).

---

## 🎭 PRINSIP DASAR

Qwen-Image-Edit-2509 butuh **deskripsi fisik emosi**, bukan cuma label emosi:

| ❌ Generic (datar) | ✅ Spesifik (ekspresif) |
|--------------------|-----------------------|
| "fearful expression" | "wide terrified eyes, pupils dilated, mouth agape, sweat beading on forehead, eyebrows raised high" |
| "grumpy" | "furrowed eyebrows, squinting eyes, downturned mouth, jaw clenched, deep frown lines" |
| "shocked" | "eyes wide open, eyebrows raised to hairline, mouth open in O shape, slight head pullback" |

---

## 📚 EMOTION LIBRARY (20+ Emosi)

### 1. FEAR / TAKUT

**Mild Fear (takut ringan):**
```
eyes slightly widened, eyebrows raised, lips pressed together,
slight tense posture, subtle sweat on temple
```

**Intense Fear (takut intens):**
```
wide terrified eyes, pupils dilated, mouth agape, sweat beading on forehead,
eyebrows raised high, pale face, body rigid, shoulders raised defensively
```

**Frozen Fear (ketakutan membeku):**
```
wide unblinking eyes, mouth slightly open, face drained of color,
body frozen mid-motion, sweat on brow, hands trembling visibly
```

**Panic (panik):**
```
wild wide eyes, rapid breathing visible, mouth open gasping,
sweat dripping, eyebrows raised in distress, body coiled to flee
```

### 2. ANGER / MARAH

**Grumpy (grumpy/kesal):**
```
furrowed eyebrows, squinting eyes, downturned mouth, jaw clenched,
deep frown lines, slight head tilt forward
```

**Angry (marah):**
```
eyebrows drawn together, glaring eyes, flared nostrils, tight lips,
clenched jaw, reddened face, tense neck muscles
```

**Furious (marah berat):**
```
deep furrowed brows, burning glaring eyes, bared teeth, flared nostrils,
red face, veins visible on neck, fists clenched
```

### 3. SURPRISE / TERKEJUT

**Shock (terkejut):**
```
eyes wide open, eyebrows raised to hairline, mouth open in O shape,
slight head pullback, body frozen
```

**Disbelief (tidak percaya):**
```
eyes wide, eyebrows raised, mouth slightly open, head tilted,
confused furrowed brow, one hand near face
```

**Astonishment (tercengang):**
```
wide eyes, raised eyebrows, open mouth, slight smile of wonder,
body leaning forward, hands raised in amazement
```

### 4. SADNESS / SEDIH

**Sad (sedih):**
```
downturned eyes, sad eyebrows (inner up, outer down), downturned mouth,
slumped shoulders, head bowed slightly
```

**Disappointment (kecewa):**
```
downcast eyes, furrowed brow, lips pressed tight, slight head shake,
slumped posture, heavy expression
```

**Grief (duka):**
```
tears streaming, red puffy eyes, quivering mouth, head bowed,
body hunched, hands covering face
```

### 5. HAPPY / SENANG

**Smug (sok pintar):**
```
smirk, one corner of mouth raised, squinting confident eyes,
eyebrow slightly raised, chin lifted
```

**Happy (senang):**
```
genuine smile, eyes crinkled, cheeks raised, slight laugh lines,
relaxed posture, head slightly tilted
```

**Relieved (lega):**
```
soft smile, eyes relaxed, shoulders dropped, slight exhale visible,
subtle head nod, peaceful expression
```

### 6. NEUTRAL / KHUSUS

**Fake Polite (pura-pura sopan):**
```
forced smile, eyes not matching mouth (calculating cold eyes),
slight head tilt, tense jaw, professional posture
```

**Nervous (gugup):**
```
darting eyes, forced smile, sweat on temple, fidgeting hands,
shifted weight, tense shoulders
```

**Suspicious (curiga):**
```
narrowed eyes, one eyebrow raised, tight lips, slight head lean,
body angled away, guarded posture
```

**Hopeful (penuh harap):**
```
wide soft eyes, slight smile, raised eyebrows, head tilted up,
hands clasped, body leaning forward
```

---

## 🎬 MAPPING EMOSI PER SCENE — Story "Pocong Salah Alamat COD"

### Story Arc Overview

| Scene | Arc | Emosi Dominan |
|-------|-----|---------------|
| 001-005 | Setup malam takut | Arman: mild fear → intense fear |
| 006-010 | Pertemuan pocong | Arman: frozen fear, Pak Karto: grumpy |
| 011-015 | Konflik salah barang | Arman: panic, Pak Karto: furious |
| 016-020 | Bantuan Bowo | Bowo: smug → shock, Arman: disbelief |
| 021-025 | Bowo ketemu pocong | Bowo: shock → panic, Maya: fake polite |
| 026-030 | Investigasi kuburan | Arman: nervous, Pak Karto: grumpy |
| 031-035 | Menuju gudang | Arman: nervous, Bowo: terrified |
| 036-040 | Gudang ketemu Maya | Maya: fake polite → shock, Arman: angry |
| 041-045 | Konfrontasi Maya | Arman: angry, Maya: panic, Pak Karto: furious |
| 046-050 | Resolution kuburan | Pak Karto: sad → hopeful, Bowo: shock |
| 051-055 | Penyelesaian | Maya: shame, Pak Karto: grateful |
| 056-060 | Ending | Arman: relieved → shock (twist ending) |

### Detail Emosi Per Scene (60 scene)

```javascript
const SCENE_EMOTIONS = {
  scene_001: { arman: "frozen fear", pakKarto: "grumpy" },
  scene_002: { arman: "nervous" },
  scene_003: { arman: "nervous" },
  scene_004: { }, // no characters
  scene_005: { arman: "intense fear" },
  scene_006: { arman: "frozen fear" },
  scene_007: { pakKarto: "grumpy" },
  scene_008: { arman: "frozen fear", pakKarto: "grumpy" },
  scene_009: { arman: "panic" },
  scene_010: { arman: "shock", pakKarto: "disappointment" },
  scene_011: { pakKarto: "disappointment" },
  scene_012: { arman: "disbelief", pakKarto: "grumpy" },
  scene_013: { pakKarto: "smug" },
  scene_014: { arman: "nervous" },
  scene_015: { arman: "panic", pakKarto: "grumpy" },
  scene_016: { bowo: "smug" },
  scene_017: { bowo: "shock" },
  scene_018: { arman: "panic", pakKarto: "furious" },
  scene_019: { arman: "sad" },
  scene_020: { arman: "nervous", bowo: "smug" },
  scene_021: { bowo: "panic", pakKarto: "grumpy" },
  scene_022: { arman: "intense fear", bowo: "panic", pakKarto: "angry" },
  scene_023: { arman: "intense fear", bowo: "shock" },
  scene_024: { maya: "fake polite" },
  scene_025: { maya: "fake polite" },
  scene_026: { arman: "nervous", bowo: "nervous" },
  scene_027: { pakKarto: "grumpy" },
  scene_028: { arman: "nervous", bowo: "nervous", pakKarto: "grumpy" },
  scene_029: { arman: "panic" },
  scene_030: { arman: "sad", pakKarto: "grumpy" },
  scene_031: { arman: "nervous", bowo: "terrified" },
  scene_032: { pakKarto: "grumpy" },
  scene_033: { arman: "nervous", bowo: "terrified", pakKarto: "grumpy" },
  scene_034: { }, // no characters
  scene_035: { maya: "fake polite" },
  scene_036: { arman: "nervous", bowo: "panic" },
  scene_037: { pakKarto: "grumpy" },
  scene_038: { maya: "shock", pakKarto: "grumpy" },
  scene_039: { arman: "angry", bowo: "panic", maya: "fake polite" },
  scene_040: { maya: "fake polite" },
  scene_041: { arman: "angry", maya: "panic" },
  scene_042: { pakKarto: "furious", maya: "panic" },
  scene_043: { bowo: "shock" },
  scene_044: { arman: "angry", bowo: "shock" },
  scene_045: { pakKarto: "sad" },
  scene_046: { pakKarto: "sad" },
  scene_047: { arman: "sad" },
  scene_048: { arman: "hopeful", bowo: "nervous" },
  scene_049: { bowo: "shock" },
  scene_050: { maya: "panic" },
  scene_051: { arman: "angry", maya: "sad" },
  scene_052: { maya: "sad", pakKarto: "grumpy" },
  scene_053: { pakKarto: "hopeful" },
  scene_054: { arman: "relieved", bowo: "nervous", pakKarto: "happy" },
  scene_055: { pakKarto: "happy" },
  scene_056: { arman: "relieved", pakKarto: "hopeful" },
  scene_057: { bowo: "sad" },
  scene_058: { maya: "sad" },
  scene_059: { arman: "relieved" },
  scene_060: { arman: "shock" },
};
```

---

## 🎯 CARA PAKAI EMOTION LIBRARY

### Opsi A — Edit Manual per Scene (presisi tinggi)

Untuk scene penting (mis. scene_001), edit `image_prompt` di UI, tambah deskripsi emosi:

**Contoh scene_001 (Arman frozen fear):**

Tambah ke prompt Arman:
```
Arman on the left, body angled toward the gate, back partially to camera,
frozen mid-step, one hand gripping the delivery package against his chest,
phone in the other hand hanging down, head turned slightly toward the gate,

[EMOSI:]
wide unblinking eyes, mouth slightly open, face drained of color,
sweat on brow, eyebrows raised high in frozen fear, body rigid,
shoulders raised defensively
```

### Opsi B — Script V3 Auto-Apply Emosi (untuk 60 scene)

Saya buatkan script `generate-prompts-v3.cjs` yang include emosi per scene.

---

## 💡 TIPS HASIL EMOSI BAGUS

### 1. Kombinasikan 3-4 detail fisik

Jangan cuma "fearful". Pakai kombinasi:
- **Mata**: wide, dilated, unblinking
- **Mulut**: agape, trembling, pressed
- **Wajah**: pale, sweat, flushed
- **Body**: rigid, frozen, tense shoulders

### 2. Sesuaikan intensitas dengan scene

| Scene Type | Intensitas |
|-----------|------------|
| Setup (001-005) | mild → building |
| Climax (010, 022, 042) | intense peak |
| Resolution (050-060) | relief → calm |

### 3. Kontras antar karakter

Scene 2-karakter → kontras emosi bikin dynamic:
- Arman terrified + Pak Karto grumpy = comedic tension
- Arman angry + Maya panic = confrontation
- Pak Karto sad + Arman relieved = emotional resolution

### 4. Negative prompt untuk emosi

Tambah ke negative_prompt (kalau perlu):
```
neutral expression, blank stare, emotionless face, dead eyes, stiff pose
```

---

## 📋 CHECKLIST EMOSI PER SCENE

Sebelum generate, pastikan setiap scene punya:

- [ ] Emosi spesifik per karakter (bukan generic "fearful")
- [ ] 3-4 detail fisik emosi (mata + mulut + wajah + body)
- [ ] Intensitas sesuai story arc
- [ ] Kontras antar karakter (untuk scene 2+ karakter)
- [ ] Negative prompt untuk hindari netral

---

## 🔄 NEXT STEPS

1. **Review emotion mapping** di atas — sesuaikan kalau perlu
2. **Pilih opsi implementasi:**
   - Opsi A: Edit manual per scene (presisi tinggi, lambat)
   - Opsi B: Script V3 auto-apply (cepat, konsisten)
3. **Test 1 scene** dengan emosi eksplisit → review hasil
4. **Kalau bagus** → apply ke semua 60 scene

Mau saya buatkan `generate-prompts-v3.cjs` dengan emosi per scene?
