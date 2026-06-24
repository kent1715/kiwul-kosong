// generate-prompts.cjs
// Auto-generate prompt untuk semua scene berdasarkan template
//
// CARA PAKAI:
// 1. Edit bagian SCENE_DATA di bawah, isi [AKSI] per scene
// 2. Jalankan: node generate-prompts.cjs
// 3. Review hasil di UI storyboard
// 4. Generate All Images/Videos
//
// Template lengkap: lihat TEMPLATE-PROMPTS.md

const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();

// ============================================
// CONFIG
// ============================================
const PROJECT_ID = "cmqqcps7v0000va98p5sdmgmj";
const STYLE = "cinematic semi-realistic 2D illustration";
const COLOR = "muted warm tones, cinematic color palette";
const LIGHTING = "cinematic lighting, soft ambient light";
const QUALITY = "high detail, sharp focus, professional composition";

// ============================================
// SCENE DATA — EDIT INI!
// ============================================
// Format:
//   scene_id: {
//     location: "deskripsi lokasi",
//     time: "daytime/nighttime/golden hour",
//     weather: "clear/rainy/foggy",
//     characters: ["arman", "pak karto"] | ["arman"] | [],
//     action1: "aksi karakter 1 (Figure 2)",
//     action2: "aksi karakter 2 (Figure 3, kalau ada)",
//     videoAction1: "gerakan video karakter 1",
//     videoAction2: "gerakan video karakter 2",
//   }
//
// characters: [] = scene tanpa karakter (no-characters template)

const SCENE_DATA = {
  scene_001: {
    location: "Indonesian residential gate at night",
    time: "nighttime",
    weather: "clear",
    characters: ["arman", "pak karto"],
    action1: "Arman on the left frozen in fear while holding a delivery package and phone",
    action2: "Pak Karto on the right leaning forward from the gate with a grumpy complaining face",
    videoAction1: "slowly turns his head, eyes wide with fear, grip tightens on the package",
    videoAction2: "leans forward slightly, mouth moves as if complaining, gestures with one hand",
  },
  scene_002: {
    location: "Indonesian residential interior living room",
    time: "nighttime",
    weather: "clear",
    characters: ["arman"],
    action1: "Arman standing in the center, looking at his phone with a worried expression",
    videoAction1: "chest rises and falls with heavy breathing, eyes dart around nervously",
  },
  // ... tambahkan scene_003 sampai scene_060 di sini
  // Copy-paste template di atas, edit location/time/characters/action
};

// ============================================
// TEMPLATE BUILDER
// ============================================

function buildBackgroundPrompt(scene) {
  if (!scene.location) return null;
  return `${scene.location}, 2D animated background, clean cartoon illustration, environment only, empty area, no people, no children, no silhouettes, no background character, ${LIGHTING}, ${scene.time}, ${scene.weather}, ${COLOR}, ${QUALITY}`;
}

function buildImagePrompt(scene) {
  if (!scene.characters || scene.characters.length === 0) {
    // No characters template
    return `Create a natural final cinematic environment scene using Figure 1 as the background. Keep the exact visual style as: ${STYLE}. No characters, no people, no silhouettes. Emphasize the scene action through objects and atmosphere: ${scene.action1 || "ambient details and mood"}. ${COLOR}, ${QUALITY}.`;
  }

  if (scene.characters.length === 1) {
    // 1 character template
    return `Create a natural final scene using Figure 1 as the background. Use Figure 2 only for character identity, face, hair, clothing, clothing color, body proportions, silhouette, age, and visual style. Keep the exact visual style as: ${STYLE}. Do not copy the original pose, original hand positions, original props, or original composition of Figure 2.\n\nChange the pose of the character in Figure 2 to a new acting pose: ${scene.action1}.\n\nPlace the character naturally in the scene. Blend the character naturally into the lighting and perspective of Figure 1.\n\nThe final result should be a single scene, not a reference sheet.`;
  }

  // 2 characters template
  return `Create a natural final scene using Figure 1 as the background. Use Figures 2 and 3 only for character identity, face, hair, clothing, clothing color, body proportions, silhouette, age, and visual style. Keep the exact visual style as: ${STYLE}. Do not copy the original poses, original hand positions, original props, original weapons, original objects, original pets, or original compositions of Figures 2 or 3.\n\nChange the pose of the character in Figure 2 to a new acting pose: ${scene.action1}.\nChange the pose of the character in Figure 3 to a new acting pose: ${scene.action2}.\n\nPlace both characters naturally in the scene with clear left/right or foreground/background positioning. Blend both characters naturally into the lighting and perspective of Figure 1.\n\nThe final result should be a single scene, not a reference sheet, not a character arrangement, not a poster.`;
}

function buildVideoPrompt(scene) {
  if (!scene.characters || scene.characters.length === 0) {
    return `Animate the environment naturally with subtle atmospheric motion. ${scene.videoAction1 || "soft ambient movement, dust particles drift slowly"}. Keep the camera static (no zoom, no pan). Maintain the exact composition from the input image. Duration: 5 seconds. Natural physics.`;
  }

  if (scene.characters.length === 1) {
    return `Animate the character naturally with subtle, realistic motion. ${scene.characters[0]}: ${scene.videoAction1}. Keep the camera static (no zoom, no pan). Maintain the exact composition from the input image. Duration: 5 seconds. Natural physics, no impossible movements.`;
  }

  return `Animate both characters naturally with subtle, realistic motion. ${scene.characters[0]}: ${scene.videoAction1}. ${scene.characters[1]}: ${scene.videoAction2}. Keep the camera static (no zoom, no pan). Maintain the exact composition from the input image. Duration: 5 seconds. Natural physics, no impossible movements, no character merging, no extra people appearing.`;
}

// ============================================
// MAIN
// ============================================

(async () => {
  console.log("=== Generate Prompts for All Scenes ===");
  console.log("");

  const scenes = await p.storyboardScene.findMany({
    where: { project_id: PROJECT_ID },
    select: { scene_id: true, image_prompt: true, background_prompt: true, video_prompt: true },
    orderBy: { scene_number: "asc" },
  });

  let updated = 0;
  let skipped = 0;
  let noData = 0;

  for (const scene of scenes) {
    const data = SCENE_DATA[scene.scene_id];

    if (!data) {
      console.log("SKIP " + scene.scene_id + " (no data in SCENE_DATA)");
      noData++;
      continue;
    }

    const bgPrompt = buildBackgroundPrompt(data);
    const imgPrompt = buildImagePrompt(data);
    const vidPrompt = buildVideoPrompt(data);

    // Update via API
    try {
      const res = await fetch(`http://localhost:3000/api/storyboard/${PROJECT_ID}/scenes/${scene.scene_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          background_prompt: bgPrompt,
          image_prompt: imgPrompt,
          video_prompt: vidPrompt,
        }),
      });
      const result = await res.json();
      if (result.ok) {
        console.log("OK " + scene.scene_id);
        updated++;
      } else {
        console.log("FAIL " + scene.scene_id + ": " + (result.error || "unknown"));
        skipped++;
      }
    } catch (e) {
      console.log("ERROR " + scene.scene_id + ": " + e.message);
      skipped++;
    }

    await new Promise((r) => setTimeout(r, 50));
  }

  console.log("");
  console.log("=== Summary ===");
  console.log("Updated: " + updated + " scenes");
  console.log("Skipped: " + skipped + " scenes");
  console.log("No data: " + noData + " scenes (need to add to SCENE_DATA)");

  await p.$disconnect();
})();
