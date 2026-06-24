// generate-prompts-v2.cjs
// Auto-generate prompt untuk 60 scene — Story: Pocong Salah Alamat COD (180s)
// V2: Pose lebih natural — tambah camera angle + body orientation
//
// PERUBAHAN DARI V1:
// - Setiap scene dapat camera angle spesifik (3/4 view, side view, over-the-shoulder, dll)
// - Body orientation relatif environment (facing gate, turned away from camera, dll)
// - Hindari pose front-facing stiff
//
// CARA PAKAI:
// 1. Pastikan Next.js jalan (bun run dev)
// 2. Jalankan: node generate-prompts-v2.cjs
// 3. Review hasil di UI storyboard

const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

// ============================================
// CONFIG
// ============================================
const PROJECT_ID = 'cmqqcps7v0000va98p5sdmgmj';
const STYLE = 'cinematic semi-realistic 2D illustration';
const COLOR = 'muted warm tones, cinematic color palette';
const LIGHTING = 'cinematic lighting, soft ambient light';
const QUALITY = 'high detail, sharp focus, professional composition';

// ============================================
// SCENE_DATA V2 — dengan camera angle + body orientation
// cameraAngle: "3/4 view" | "side view" | "over-the-shoulder" | "back view" | "wide shot"
// ============================================

const SCENE_DATA = {
  scene_001: {
    location: "A quiet Indonesian village road at midnight with a small empty house gate, wet asphalt",
    time: "nighttime", weather: "wet, rainy",
    characters: ["arman", "pak karto"],
    cameraAngle: "wide shot, 3/4 view from the street side",
    action1: "Arman on the left, body angled toward the gate, back partially to camera, frozen mid-step, one hand gripping the delivery package against his chest, phone in the other hand hanging down, head turned slightly toward the gate",
    action2: "Pak Karto pocong on the right, leaning forward from behind the half-open gate, facing Arman with a grumpy squinting expression, cloth shroud catching the faint streetlight",
    videoAction1: "Arman freezes mid-step, shoulders tense, head turns slowly toward the gate",
    videoAction2: "Pak Karto leans forward slightly from behind the gate, cloth rustles",
  },
  scene_002: {
    location: "A courier smartphone screen glow on a scooter handlebar, dark village alley entrance",
    time: "nighttime", weather: "clear",
    characters: ["arman"],
    cameraAngle: "over-the-shoulder shot from behind Arman, looking past him toward the phone and alley",
    action1: "Arman sits sideways on his parked scooter, back mostly to camera, hunched forward with both hands holding the phone, face lit by screen glow visible in profile, shoulders tense",
    videoAction1: "chest rises and falls with heavy breathing, shoulders hunch tighter, head tilts down toward phone",
  },
  scene_003: {
    location: "A narrow village alley at night with closed wooden doors, puddles",
    time: "nighttime", weather: "wet, rainy",
    characters: ["arman"],
    cameraAngle: "wide shot from behind Arman, looking down the alley ahead of him",
    action1: "Arman walks forward into the alley, back to camera, package clutched under one arm, phone flashlight held up ahead illuminating the wet ground, shoulders hunched defensively",
    videoAction1: "cautious forward steps, phone light beam trembles across the wet alley walls, head swivels nervously",
  },
  scene_004: {
    location: "A dead-end village alley with old walls, weak streetlamp",
    time: "nighttime", weather: "foggy, misty",
    characters: [],
    cameraAngle: "wide establishing shot of the empty dead-end alley",
    action1: "the phone screen on the scooter shows no signal while the package label glows faintly under the streetlamp, fog creeping across the ground, wet puddles reflecting dim light",
    videoAction1: "fog slides across the ground, light buzzes softly, phone screen flickers with no signal",
  },
  scene_005: {
    location: "A close view of a sealed cardboard delivery package on wet ground near a rusty gate, dim streetlamp",
    time: "nighttime", weather: "wet, rainy",
    characters: ["arman"],
    cameraAngle: "low angle side view, camera near ground level",
    action1: "Arman crouches beside the package in a 3/4 side view, body angled away from camera facing the package, both hands raised defensively near his chest, knees bent, head tilted down toward the shaking box",
    videoAction1: "small package vibration, Arman flinches back subtly, wide eyes fixed on the box",
  },
  scene_006: {
    location: "A rusty gate in front of an abandoned small house, dark porch",
    time: "nighttime", weather: "wet, rainy",
    characters: ["arman"],
    cameraAngle: "side profile shot, Arman and gate both visible from the side",
    action1: "Arman in side profile, body turned toward the gate, one foot stepping backward, package clutched tight against his chest, head snapped to look over his shoulder toward the gate, face visible in profile with wide eyes",
    videoAction1: "slow pan from Arman to the gate, Arman's shoulders tense, head turns sharply",
  },
  scene_007: {
    location: "An old abandoned house gate half open, mossy wall",
    time: "nighttime", weather: "foggy, misty",
    characters: ["pak karto"],
    cameraAngle: "3/4 view from outside the gate, looking through the gate opening",
    action1: "Pak Karto pocong stands just behind the half-open gate, body angled 3/4 toward camera, leaning forward through the gate opening, grumpy squinting eyes visible, cloth shroud draped naturally, one bundled hand resting on the gate edge",
    videoAction1: "slow push in, fog curls around the gate, Pak Karto makes a small grumpy head tilt",
  },
  scene_008: {
    location: "A small empty house porch with rusty gate, wet tiles",
    time: "nighttime", weather: "wet, rainy",
    characters: ["arman", "pak karto"],
    cameraAngle: "wide shot from the porch edge, both characters in 3/4 view facing each other",
    action1: "Arman on the left, body turned toward Pak Karto in 3/4 view, holding his phone up defensively like a shield between them, shoulders raised, feet planted wide",
    action2: "Pak Karto on the right, body angled toward Arman, leaning forward with one bundled cloth hand extended pointing grumpily toward the delivery package on the wet tiles",
    videoAction1: "slight handheld wobble, Arman blinks nervously, phone hand trembles",
    videoAction2: "Pak Karto makes a small pointing movement with bundled cloth hand, head nods grumpily",
  },
  scene_009: {
    location: "A smartphone close-up showing a delivery confirmation page on a dark alley background, wet ground and cardboard box nearby",
    time: "nighttime", weather: "wet, rainy",
    characters: ["arman"],
    cameraAngle: "close-up over-the-shoulder, camera behind Arman looking past him at the phone screen",
    action1: "Arman's hands visible holding the phone, his face in soft profile lit by the screen glow, shoulders hunched, one thumb hovering over the confirmation button, body angled away from camera",
    videoAction1: "slow zoom onto the trembling phone, thumb hovers, screen glow flickers",
  },
  scene_010: {
    location: "A dim porch floor with an opened cardboard package and a strange demon-head-shaped speaker inside, eerie but comedic lighting",
    time: "nighttime", weather: "clear",
    characters: ["arman", "pak karto"],
    cameraAngle: "low angle 3/4 shot from floor level, looking up at both characters around the box",
    action1: "Arman crouches on the left in 3/4 view, body angled toward the opened box, one hand pointing at the speaker inside, face turned toward the box with horrified confusion",
    action2: "Pak Karto leans from the right in side profile, staring down into the box with angry disappointment, cloth hand gesturing toward the wrong speaker",
    videoAction1: "slow push in on the opened box, subtle flicker from the speaker, Arman flinches",
    videoAction2: "Pak Karto makes a tiny angry head shake staring at the wrong speaker",
  },
  scene_011: {
    location: "An old empty porch with opened cardboard box, demon-head speaker on cracked tiles",
    time: "nighttime", weather: "foggy, misty",
    characters: ["pak karto"],
    cameraAngle: "side profile view of Pak Karto standing beside the package",
    action1: "Pak Karto in side profile, standing beside the opened package, body angled down toward the wrong item, head tilted with grumpy disappointment, cloth shroud draped naturally, one bundled hand on hip area",
    videoAction1: "slow tilt from package to Pak Karto's annoyed face, cloth edges flutter slightly",
  },
  scene_012: {
    location: "A midnight village porch near a rusty gate, opened package on the floor",
    time: "nighttime", weather: "foggy, misty",
    characters: ["arman", "pak karto"],
    cameraAngle: "wide 3/4 shot, both characters facing each other across the package",
    action1: "Arman on the left in 3/4 view, body turned toward Pak Karto, one hand scratching his head in disbelief, the other holding the delivery phone, shoulders slumped in confusion",
    action2: "Pak Karto on the right in 3/4 view, body angled toward Arman, standing with offended upright posture, bundled cloth hands gesturing as if explaining himself",
    videoAction1: "subtle push in, Arman tilts his head in confusion, hand scratches head",
    videoAction2: "Pak Karto gives a tiny offended nod, cloth shifts slightly",
  },
  scene_013: {
    location: "A humorous spooky cemetery corner beyond a village wall, small router box mounted near a tree",
    time: "nighttime", weather: "foggy, misty",
    characters: ["pak karto"],
    cameraAngle: "3/4 view from the cemetery side, Pak Karto angled toward the router",
    action1: "Pak Karto in 3/4 view, standing near the gate, body turned toward the direction of the cemetery Wi-Fi router, one bundled cloth hand pointing proudly, smug grumpy expression, cloth catching moonlight",
    videoAction1: "slow pan toward the faint cemetery wall, Pak Karto makes a small proud head lift",
  },
  scene_014: {
    location: "A dark village alley with return label paper, cardboard box",
    time: "nighttime", weather: "wet, rainy",
    characters: ["arman"],
    cameraAngle: "high angle over-the-shoulder, looking down at Arman's hands and the label",
    action1: "Arman kneeling on wet ground, back mostly to camera, body hunched forward over the return label, phone held in one hand scanning, head bowed, face in profile showing worry",
    videoAction1: "slow zoom on the failed scan, phone glow pulses, Arman's hand trembles",
  },
  scene_015: {
    location: "A spooky porch with opened package, phone screen glowing unnaturally",
    time: "nighttime", weather: "clear",
    characters: ["arman", "pak karto"],
    cameraAngle: "wide 3/4 shot, both characters facing the phone between them",
    action1: "Arman on the left in 3/4 view, body recoiling away from the phone, holding it out at arm's length toward Pak Karto, face turned in profile showing fear",
    action2: "Pak Karto on the right in 3/4 view, leaning forward to squint at the phone like an impatient customer, bundled cloth hand near his face",
    videoAction1: "slow push in on the phone, ghostly glow pulses, Arman flinches subtly",
    videoAction2: "Pak Karto squints and makes a small impatient head lean forward",
  },
  scene_016: {
    location: "A small messy courier office at night, desk with parcels",
    time: "nighttime", weather: "clear",
    characters: ["bowo"],
    cameraAngle: "3/4 view from across the desk, Bowo seated at the desk",
    action1: "Bowo seated at the courier office desk in 3/4 view, body angled toward the phone, leaning back in his chair with smug confidence, one hand holding a snack, phone in the other, feet up on desk edge",
    videoAction1: "slow push in, fluorescent light flickers gently, Bowo gives a tiny confident nod",
  },
  scene_017: {
    location: "A messy courier office with parcels and a speakerphone on the desk, dim fluorescent night lighting",
    time: "nighttime", weather: "clear",
    characters: ["bowo"],
    cameraAngle: "close-up 3/4 view of Bowo's face at the speakerphone",
    action1: "Bowo in 3/4 close-up, leaning close to the speakerphone on the desk, body hunched forward, smug grin on his face, one hand near his ear, expression caught mid-transition to fear",
    videoAction1: "quick subtle push in, Bowo's expression shifts from confident to terrified, monitor light flickers",
  },
  scene_018: {
    location: "A village alley in front of an abandoned house gate, opened package on wet ground",
    time: "nighttime", weather: "wet, rainy",
    characters: ["arman", "pak karto"],
    cameraAngle: "wide 3/4 shot, both characters standing over the package",
    action1: "Arman on the left in 3/4 view, body turned toward Pak Karto, holding phone and package receipt, sweating visibly, shoulders raised defensively",
    action2: "Pak Karto on the right in side profile, standing with stern customer posture, one bundled cloth hand pointing toward the package, body angled toward Arman",
    videoAction1: "subtle push in, Arman shifts weight nervously, sweat visible",
    videoAction2: "Pak Karto makes a tiny demanding nod, cloth hand gestures firmly",
  },
  scene_019: {
    location: "A smartphone screen showing a delivery rating interface glowing ominously beside a courier bag, dark alley background",
    time: "nighttime", weather: "clear",
    characters: ["arman"],
    cameraAngle: "side profile shot, Arman visible in silhouette against the phone glow",
    action1: "Arman in side profile, holding the phone close to his face, shoulders slumped in despair, head bowed slightly, body angled away from camera, face lit ominously by screen glow",
    videoAction1: "slow zoom to Arman's face, shoulders drop in defeat, phone glow reflects in his eyes",
  },
  scene_020: {
    location: "A village alley entrance with a parked scooter, courier bag",
    time: "nighttime", weather: "foggy, misty",
    characters: ["arman", "bowo"],
    cameraAngle: "wide 3/4 shot, both characters facing each other at the alley entrance",
    action1: "Arman on the left in 3/4 view, body turned toward Bowo, holding the wrong package out, face desperate, shoulders hunched",
    action2: "Bowo on the right in 3/4 view, arriving with confident stride, holding a clipboard at his side, fake professional pose, chin lifted",
    videoAction1: "subtle push in, Arman gestures desperately with the package",
    videoAction2: "Bowo raises the clipboard slightly with a confident smirk",
  },
  scene_021: {
    location: "A damp village porch with opened gate, wrong package on floor",
    time: "nighttime", weather: "clear",
    characters: ["pak karto", "bowo"],
    cameraAngle: "wide 3/4 shot, both characters facing each other over the package",
    action1: "Bowo on the left in 3/4 view, body angled toward Pak Karto, pretending professional composure but visibly trembling, clipboard clutched to chest",
    action2: "Pak Karto on the right in side profile, looking down judgmentally at Bowo's sandals, grumpy disapproving expression, bundled cloth hand gesturing downward",
    videoAction1: "Bowo shifts nervously, clipboard shakes in his hands",
    videoAction2: "Pak Karto makes a small disapproving head shake, looking down judgmentally",
  },
  scene_022: {
    location: "A dark old porch with demon-head speaker glowing inside opened package, rusty gate",
    time: "nighttime", weather: "wet, rainy",
    characters: ["arman", "pak karto"],
    cameraAngle: "wide 3/4 shot, three characters arranged around the glowing speaker box",
    action1: "Arman on the left in 3/4 view recoiling back, Bowo in the middle behind Arman peeking over his shoulder, Pak Karto on the right leaning toward the glowing speaker from the side, all faces clearly separated and visible",
    action2: "Pak Karto on the right in side profile, leaning toward the glowing speaker with angry curiosity, cloth hand extended",
    videoAction1: "tiny character flinches, speaker glow pulses subtly",
    videoAction2: "Pak Karto makes a small lean forward toward the glowing speaker",
    isThreeChar: true,
  },
  scene_023: {
    location: "A demon-head speaker inside a cardboard box on a dark porch floor, phone and receipts scattered nearby",
    time: "nighttime", weather: "clear",
    characters: ["arman", "bowo"],
    cameraAngle: "low angle 3/4 shot from floor level looking up at both characters",
    action1: "Arman crouches on the left in 3/4 view, body angled away from the speaker, holding it at arm's length with both hands, face turned in profile showing fear",
    action2: "Bowo stands on the right in 3/4 view, leaning in from behind with scared curiosity, one hand on Arman's shoulder",
    videoAction1: "slow push in, Arman's hands shake holding the speaker",
    videoAction2: "Bowo leans in slightly with nervous curiosity, eyes wide",
  },
  scene_024: {
    location: "A small online shop packing room at night with shelves of parcels, laptop",
    time: "nighttime", weather: "clear",
    characters: ["maya"],
    cameraAngle: "3/4 view from the packing desk side, Maya standing in her work space",
    action1: "Maya in 3/4 view, standing in her packing room, body angled toward the shelves, head turned toward camera, fake polite smile, one hand holding a phone to her ear, the other holding a shipping label, confident posture",
    videoAction1: "slow push in, Maya's smile flickers briefly, eyes shift calculating",
  },
  scene_025: {
    location: "An online shop desk with laptop, pile of shipping labels",
    time: "nighttime", weather: "clear",
    characters: ["maya"],
    cameraAngle: "side profile shot, Maya seated at the desk",
    action1: "Maya in side profile, seated confidently at the desk, body angled toward the laptop, phone held to her ear, polite fake smile, one finger raised professionally, back straight",
    videoAction1: "slow zoom, Maya speaks with fake confidence, one finger raised professionally",
  },
  scene_026: {
    location: "A dark alley near the abandoned house, wet ground",
    time: "nighttime", weather: "wet, rainy",
    characters: ["arman", "bowo"],
    cameraAngle: "over-the-shoulder shot from behind Arman, looking at the shipping label in his hand",
    action1: "Arman on the left in 3/4 back view, body angled toward the label in his hand, head bowed studying it intensely",
    action2: "Bowo on the right in 3/4 view, leaning over Arman's shoulder from behind, face peeking past with fearful curiosity",
    videoAction1: "fog moves slowly, Arman's eyes narrow at the label",
    videoAction2: "Bowo peeks nervously over Arman's shoulder, gulps visibly",
  },
  scene_027: {
    location: "A cemetery edge at night with an old gravestone, delivery label stuck on a small stone",
    time: "nighttime", weather: "foggy, misty",
    characters: ["pak karto"],
    cameraAngle: "3/4 view from behind the gravestone, Pak Karto visible beside it",
    action1: "Pak Karto in 3/4 view, standing beside the gravestone, body angled toward the stone, one bundled cloth hand pointing grumpily at the delivery label attached to it, head tilted with annoyed recognition",
    videoAction1: "slow push in, fog drifts, Pak Karto points firmly at the label on the gravestone",
  },
  scene_028: {
    location: "A cemetery gate at midnight with old packages scattered near the entrance, dim lantern",
    time: "nighttime", weather: "foggy, misty",
    characters: ["arman", "pak karto"],
    cameraAngle: "wide 3/4 shot, three characters arranged around the scattered packages",
    action1: "Arman on the left in 3/4 view holding a pile of old labels, Bowo in the middle in 3/4 view reading labels nervously, Pak Karto on the right in side profile with angry customer posture, all faces visible",
    action2: "Pak Karto on the right in side profile, standing with angry customer posture, bundled cloth pointing at labels",
    videoAction1: "labels flutter slightly in the night breeze, characters shift nervously",
    videoAction2: "Pak Karto makes a small angry gesture toward the scattered labels",
    isThreeChar: true,
  },
  scene_029: {
    location: "A parked delivery scooter in a dark village alley, keyhole glowing faintly",
    time: "nighttime", weather: "wet, rainy",
    characters: ["arman"],
    cameraAngle: "side profile shot, Arman and scooter visible from the side",
    action1: "Arman in side profile, body angled toward the scooter handle, both hands fumbling with the key, head turned over his shoulder glancing toward the cemetery in the background, face in profile showing panic",
    videoAction1: "Arman fumbles with the key, hands shake, glances nervously over shoulder",
  },
  scene_030: {
    location: "A village road between abandoned house and cemetery wall, distant pale moon",
    time: "nighttime", weather: "wet, rainy",
    characters: ["arman", "pak karto"],
    cameraAngle: "wide shot from behind both characters, looking toward the horizon",
    action1: "Arman on the left in back 3/4 view, body facing away from camera toward the horizon, holding his phone, shoulders slumped with exhaustion",
    action2: "Pak Karto on the right in back 3/4 view, body angled toward the horizon, one bundled cloth hand pointing toward the pale moon, standing upright with strict urgency",
    videoAction1: "mist drifts, Arman's shoulders sag with exhaustion",
    videoAction2: "Pak Karto points firmly toward the horizon, cloth flutters in the wind",
  },
  scene_031: {
    location: "A quiet village road leading to a small warehouse area, wet asphalt",
    time: "nighttime", weather: "wet, rainy",
    characters: ["arman", "bowo"],
    cameraAngle: "side profile shot, both characters on the scooter from the side",
    action1: "Arman in side profile on the front of the scooter, body angled forward with determination, hands gripping handlebars, face in profile showing nervous focus",
    action2: "Bowo in side profile behind Arman on the scooter, body hunched, arms wrapped around Arman's waist, face peeking over Arman's shoulder with terrified eyes",
    videoAction1: "scooter headlight glows, Arman leans forward with determination",
    videoAction2: "Bowo clutches tighter around Arman's waist, eyes darting nervously",
  },
  scene_032: {
    location: "A village road at night with a delivery scooter, package box strapped behind",
    time: "nighttime", weather: "foggy, misty",
    characters: ["pak karto"],
    cameraAngle: "side profile shot, Pak Karto awkwardly on the back of the scooter",
    action1: "Pak Karto in side profile, perched awkwardly on the back of the moving scooter, body stiff, bundled cloth feet dangling, grumpy but determined expression, shroud fluttering dramatically in the wind",
    videoAction1: "cloth flutters in the wind, Pak Karto bounces slightly on the scooter, grumpy expression",
  },
  scene_033: {
    location: "An empty midnight village road with dim streetlights, scooter headlight beam",
    time: "nighttime", weather: "wet, rainy",
    characters: ["arman", "pak karto"],
    cameraAngle: "wide side profile shot, three characters on the scooter from the side",
    action1: "Arman in side profile driving nervously in front, Bowo in side profile clinging behind him, Pak Karto in side profile perching awkwardly at the very back, all characters visible and clearly separated along the scooter",
    action2: "Pak Karto in side profile at the back of the scooter, cloth fluttering, awkward balancing pose",
    videoAction1: "subtle road vibration, scooter moves forward, characters bounce slightly",
    videoAction2: "Pak Karto bounces awkwardly at the back, cloth flutters in the wind",
    isThreeChar: true,
  },
  scene_034: {
    location: "An empty small warehouse at night with shelves of cardboard packages, some boxes slightly open",
    time: "nighttime", weather: "clear",
    characters: [],
    cameraAngle: "wide establishing shot of the empty warehouse interior",
    action1: "several sealed packages on warehouse shelves tremble slightly under red light, no people or characters present, eerie atmosphere, dust particles in the air",
    videoAction1: "packages tremble slightly, red light pulses softly, dust particles drift",
  },
  scene_035: {
    location: "A small warehouse packing desk with laptop, parcel scanner",
    time: "nighttime", weather: "clear",
    characters: ["maya"],
    cameraAngle: "3/4 view from across the packing desk",
    action1: "Maya in 3/4 view, standing beside the packing desk, body angled toward a package on the desk, head turned toward camera, confident fake smile, one hand holding a scanner, the other checking a package label",
    videoAction1: "Maya scans a package with fake confidence, smile frozen, eyes calculating",
  },
  scene_036: {
    location: "A metal warehouse door at night with small signboard, wet concrete",
    time: "nighttime", weather: "wet, rainy",
    characters: ["arman", "bowo"],
    cameraAngle: "3/4 view from behind both characters, looking at the warehouse door",
    action1: "Arman on the left in back 3/4 view, body angled toward the warehouse door, one hand raised knocking, knees visibly shaking, head turned slightly toward the door",
    action2: "Bowo on the right in back 3/4 view, body angled away from the door, hiding behind the courier bag, peeking nervously over Arman's shoulder",
    videoAction1: "Arman knocks with trembling hand, knees visibly shaking",
    videoAction2: "Bowo shifts backward, peeks nervously from behind the courier bag",
  },
  scene_037: {
    location: "An exterior warehouse wall at night with mist, faint red light leaking from windows",
    time: "nighttime", weather: "foggy, misty",
    characters: ["pak karto"],
    cameraAngle: "side profile shot, Pak Karto facing the warehouse wall",
    action1: "Pak Karto in side profile, standing half-facing the warehouse wall, body angled toward the wall with confident grumpy expression, preparing to phase through like a ghost, cloth shroud beginning to drift forward",
    videoAction1: "fog swirls, Pak Karto drifts slightly toward the wall, cloth ripples eerily",
  },
  scene_038: {
    location: "A dim warehouse aisle with shelves of cardboard packages, red light",
    time: "nighttime", weather: "clear",
    characters: ["pak karto", "maya"],
    cameraAngle: "wide 3/4 shot, both characters at the warehouse shelf",
    action1: "Maya on the left in 3/4 view, body recoiling backward, fake smile collapsing into fear, hands raised defensively, face turned in profile",
    action2: "Pak Karto on the right in 3/4 view, standing beside the shelf with grumpy customer posture, body angled toward Maya, bundled cloth hand gesturing at the wrong packages",
    videoAction1: "Maya's hand trembles slightly, fake smile cracks",
    videoAction2: "Pak Karto stands sternly, cloth hand gestures toward the shelf",
  },
  scene_039: {
    location: "A warehouse entrance interior with stacked boxes, dim red lamp",
    time: "nighttime", weather: "clear",
    characters: ["arman", "bowo"],
    cameraAngle: "wide 3/4 shot, three characters arranged in the warehouse entrance",
    action1: "Arman on the left in 3/4 view trying to look firm, body angled toward Maya, Bowo in the middle in 3/4 view peeking from behind Arman, Maya on the right in 3/4 view trying to regain composure, all faces clear",
    action2: "Maya on the right in 3/4 view, body angled toward Arman, nervous fake smile, hands clasped in front",
    videoAction1: "Bowo peeks and ducks behind Arman, eyes wide with fear",
    videoAction2: "Maya straightens up nervously, tries to regain composure",
    isThreeChar: true,
  },
  scene_040: {
    location: "A warehouse packing desk with laptop showing blurred marketplace layout, stacked parcels",
    time: "nighttime", weather: "clear",
    characters: ["maya"],
    cameraAngle: "3/4 view from across the desk, Maya standing beside it",
    action1: "Maya in 3/4 view, standing beside the desk, body angled toward the laptop, nervous fake confidence, one hand raised explaining, the other subtly hiding a shipping label behind her back, head turned toward camera",
    videoAction1: "Maya gestures with fake confidence, one hand hides a label behind her back",
  },
  scene_041: {
    location: "A dim warehouse aisle with package shelves, opened boxes",
    time: "nighttime", weather: "clear",
    characters: ["arman", "maya"],
    cameraAngle: "wide 3/4 shot, both characters facing each other in the aisle",
    action1: "Arman on the left in 3/4 view, body angled toward Maya, one hand pointing angrily, face in profile showing mixed fear and anger",
    action2: "Maya on the right in 3/4 view, body stepping back, defensive hands raised, face turned toward Arman",
    videoAction1: "Arman points angrily, hand shakes with mixed fear and anger",
    videoAction2: "Maya steps back slightly, hands raised defensively",
  },
  scene_042: {
    location: "A warehouse shelf packed with wrong demon-head speakers and sealed parcels, red light",
    time: "nighttime", weather: "clear",
    characters: ["pak karto", "maya"],
    cameraAngle: "wide 3/4 shot, both characters at the shelf of wrong speakers",
    action1: "Pak Karto on the left in 3/4 view, leaning forward with furious grumpy customer expression, body angled toward the shelf, bundled cloth hand shaking",
    action2: "Maya on the right in 3/4 view, shrinking back against the shelf, holding a parcel scanner defensively, face turned in profile showing fear",
    videoAction1: "Pak Karto leans forward furiously, cloth hand shakes with anger",
    videoAction2: "Maya's scanner hand trembles, she shrinks back against the shelf",
  },
  scene_043: {
    location: "A warehouse table covered with shipping labels, return forms",
    time: "nighttime", weather: "clear",
    characters: ["bowo"],
    cameraAngle: "3/4 view from across the table, Bowo standing at it",
    action1: "Bowo in 3/4 view, standing at the table, body angled toward the labels, holding a stack with both hands, head bowed looking at them, face turned in profile showing shocked wide eyes and open mouth",
    videoAction1: "Bowo's jaw drops, eyes widen at the stack of labels, hands shake",
  },
  scene_044: {
    location: "A dim warehouse corner with stacked returned packages, old stamps",
    time: "nighttime", weather: "clear",
    characters: ["arman", "bowo"],
    cameraAngle: "wide 3/4 shot, both characters in the warehouse corner",
    action1: "Arman on the left in 3/4 view, body angled toward a label in his hand, head bowed reading, expression shifting to angry realization",
    action2: "Bowo on the right in 3/4 view, body angled toward a pile of return packages, one hand pointing, face turned toward the pile with terrified excitement",
    videoAction1: "papers rustle, Arman's expression shifts to angry realization",
    videoAction2: "Bowo points with terrified excitement, hand shakes",
  },
  scene_045: {
    location: "A quiet warehouse aisle with a single wrong package under soft red light, shelves fading into darkness",
    time: "nighttime", weather: "clear",
    characters: ["pak karto"],
    cameraAngle: "3/4 back view from behind Pak Karto, looking past him at the package",
    action1: "Pak Karto in back 3/4 view, standing alone beside the wrong package, body angled toward the package, head slightly lowered, grumpy face softened into sadness, cloth shroud drooping",
    videoAction1: "Pak Karto's head lowers slightly, expression softens from grumpy to sad",
  },
  scene_046: {
    location: "A quiet cemetery edge at night with old small radio-shaped memory object on a stone, moonlight",
    time: "nighttime", weather: "foggy, misty",
    characters: ["pak karto"],
    cameraAngle: "side profile shot, Pak Karto beside the gravestone",
    action1: "Pak Karto in side profile, standing quietly near the memory object on the gravestone, body angled toward it, head tilted down, emotional tired eyes visible, less angry and more lonely, cloth catching moonlight",
    videoAction1: "fog drifts, Pak Karto looks at the radio with nostalgic sad eyes, cloth ripples gently",
  },
  scene_047: {
    location: "A warehouse aisle with soft blue light from the open door, wrong package on the floor",
    time: "nighttime", weather: "clear",
    characters: ["arman"],
    cameraAngle: "3/4 back view from behind Arman, looking past him at the package",
    action1: "Arman in back 3/4 view, standing alone, body angled toward the package on the floor, head tilted down, one hand on his chest, phone lowered to his side, posture softened",
    videoAction1: "Arman's expression softens, hand touches chest, phone lowers to his side",
  },
  scene_048: {
    location: "A warehouse shelf maze full of parcels, dim red light",
    time: "nighttime", weather: "clear",
    characters: ["arman", "bowo"],
    cameraAngle: "wide 3/4 shot, both characters among the shelf maze",
    action1: "Arman on the left in 3/4 view, body angled toward a high shelf, one hand pointing up, determined expression, face in profile",
    action2: "Bowo on the right in 3/4 view, body angled toward lower boxes, reluctantly searching, face turned toward the boxes with nervous expression",
    videoAction1: "Arman points firmly toward the high shelf with determination",
    videoAction2: "Bowo moves a box slightly, face nervous, hands trembling",
  },
  scene_049: {
    location: "A warehouse shelf close-up with a small old radio among cardboard boxes, eerie sticker-like label without readable text",
    time: "nighttime", weather: "clear",
    characters: ["bowo"],
    cameraAngle: "close-up 3/4 view of Bowo holding the radio",
    action1: "Bowo in 3/4 close-up, holding a small old radio with both hands, body angled away from it slightly, face turned in profile, eyes wide with comedic fear, mouth open",
    videoAction1: "Bowo holds the radio with trembling hands, eyes wide with comedic terror",
  },
  scene_050: {
    location: "A warehouse metal exit door blocked by stacked cardboard boxes, red warning light",
    time: "nighttime", weather: "clear",
    characters: ["maya"],
    cameraAngle: "side profile shot, Maya running toward the blocked door",
    action1: "Maya in side profile, running toward the blocked door, body angled forward in motion, arms raised, panic stricken, fake confidence completely gone, hair and clothes in motion",
    videoAction1: "Maya runs frantically toward the blocked door, arms flailing with panic",
  },
  scene_051: {
    location: "A warehouse packing desk with phone, parcels",
    time: "nighttime", weather: "clear",
    characters: ["arman", "maya"],
    cameraAngle: "wide 3/4 shot, both characters at the packing desk",
    action1: "Arman on the left in 3/4 view, body angled toward Maya, firmly holding the phone out as evidence, stern expression, face in profile",
    action2: "Maya on the right in 3/4 view, body angled away from Arman, head lowered, ashamed and frightened, hands clasped in front",
    videoAction1: "Arman holds the phone firmly as evidence, stern expression",
    videoAction2: "Maya nods timidly, head lowered in shame",
  },
  scene_052: {
    location: "A dim warehouse aisle with parcels on shelves, soft red-blue lighting",
    time: "nighttime", weather: "clear",
    characters: ["pak karto", "maya"],
    cameraAngle: "wide 3/4 shot, both characters in the aisle",
    action1: "Maya on the left in 3/4 view, body angled toward Pak Karto, bowing slightly, trembling hands clasped, head lowered",
    action2: "Pak Karto on the right in 3/4 view, body angled toward Maya, listening with stern but calmer expression, bundled cloth hand near his chest",
    videoAction1: "Maya bows subtly, hands tremble at her sides",
    videoAction2: "Pak Karto listens with stern but slightly calmer expression, gives a small nod",
  },
  scene_053: {
    location: "A warehouse floor with small old radio placed on a cardboard box, soft moonlight from window",
    time: "nighttime", weather: "foggy, misty",
    characters: ["pak karto"],
    cameraAngle: "3/4 view from beside the radio, Pak Karto visible beside it",
    action1: "Pak Karto in 3/4 view, standing beside the small radio on the box, body angled toward it, calmer grumpy face, looking hopeful, cloth shroud settled, moonlight catching his form",
    videoAction1: "Pak Karto looks at the radio with hopeful calmer expression, cloth settles",
  },
  scene_054: {
    location: "A warehouse aisle transformed by warm small lights from opened boxes, old radio on a box",
    time: "nighttime", weather: "clear",
    characters: ["arman", "pak karto"],
    cameraAngle: "wide 3/4 shot, three characters arranged in the warm-lit aisle",
    action1: "Arman on the left in 3/4 view smiling awkwardly, Bowo in the middle in 3/4 view clapping nervously, Pak Karto on the right in side profile swaying happily near the radio, all faces clear",
    action2: "Pak Karto on the right in side profile, swaying happily near the radio, grumpy face softened",
    videoAction1: "warm lights flicker gently, Arman smiles awkwardly",
    videoAction2: "Pak Karto sways softly with a small grateful laugh, cloth shimmers warmly",
    isThreeChar: true,
  },
  scene_055: {
    location: "A quiet warehouse aisle with warm glow around a small radio, packages on shelves",
    time: "nighttime", weather: "foggy, misty",
    characters: ["pak karto"],
    cameraAngle: "3/4 view from beside the radio, Pak Karto visible near it",
    action1: "Pak Karto in 3/4 view, standing peacefully near the radio, body angled toward it, grumpy expression softened into a small grateful laugh, faint warm glow around his shroud, cloth settled",
    videoAction1: "warm glow pulses gently, Pak Karto's expression softens into a grateful laugh",
  },
  scene_056: {
    location: "A warehouse entrance with soft dawn-blue light outside, old radio on box",
    time: "dawn, golden hour", weather: "foggy, misty",
    characters: ["arman", "pak karto"],
    cameraAngle: "wide 3/4 shot from inside the warehouse looking toward the entrance",
    action1: "Arman on the left in 3/4 view, body angled toward the entrance, holding his phone, stunned relief expression, face in profile lit by dawn light",
    action2: "Pak Karto on the right in 3/4 view, body angled toward the entrance, glowing faintly, giving a small approving nod, form beginning to fade into dawn light",
    videoAction1: "dawn light grows, Arman's expression shifts to stunned relief",
    videoAction2: "Pak Karto nods gently, form glows faintly and begins to fade",
  },
  scene_057: {
    location: "A warehouse corner with parcels, warm fading glow",
    time: "nighttime", weather: "clear",
    characters: ["bowo"],
    cameraAngle: "3/4 view from the side, Bowo standing alone in the corner",
    action1: "Bowo in 3/4 view, standing alone, body angled away from camera, one hand wiping tears, the other hand extended awkwardly palm-up as if asking for payment, face in profile showing mixed emotion",
    videoAction1: "Bowo wipes tears with one hand, other hand extends awkwardly for payment",
  },
  scene_058: {
    location: "A cleaned online shop desk at dawn with organized return packages, small signboard without readable text",
    time: "dawn, golden hour", weather: "clear",
    characters: ["maya"],
    cameraAngle: "side profile shot, Maya seated at the cleaned desk",
    action1: "Maya in side profile, seated at the desk, body angled toward the organized packages, head bowed working, sincere humbled expression, hands carefully organizing return packages, dawn light",
    videoAction1: "Maya organizes packages carefully with sincere humbled expression, dawn light",
  },
  scene_059: {
    location: "A quiet village road at dawn with soft orange-blue sky, parked delivery scooter",
    time: "dawn, golden hour", weather: "wet, rainy",
    characters: ["arman"],
    cameraAngle: "wide side profile shot, Arman on the scooter from the side",
    action1: "Arman in side profile, riding his scooter slowly down the quiet dawn road, body angled forward, courier bag on his shoulder, face in profile showing relieved but exhausted expression, dawn sky behind",
    videoAction1: "scooter moves slowly forward, Arman's posture relaxes with relief, dawn light",
  },
  scene_060: {
    location: "A courier smartphone mounted on a scooter handlebar at dawn, quiet village road background",
    time: "dawn, golden hour", weather: "clear",
    characters: ["arman"],
    cameraAngle: "close-up over-the-shoulder, camera behind Arman looking at the phone screen",
    action1: "Arman in back 3/4 view, stopped on his scooter, body angled toward the phone, one hand frozen above the screen, head tilted down, face in soft profile showing horrified disbelief, dawn light",
    videoAction1: "Arman's hand freezes above the screen, eyes widen with horrified disbelief",
  },
};

// ============================================
// TEMPLATE BUILDER
// ============================================

function buildBackgroundPrompt(scene) {
  if (!scene.location) return null;
  return [
    scene.location,
    '2D animated background, clean cartoon illustration',
    'environment only, empty area, no people, no children, no silhouettes, no background character',
    LIGHTING,
    scene.time,
    scene.weather,
    COLOR,
    QUALITY,
  ].join(', ');
}

function buildImagePrompt(scene) {
  const cameraAngle = scene.cameraAngle || '3/4 view';

  // No characters
  if (!scene.characters || scene.characters.length === 0) {
    return [
      'Create a natural final cinematic environment scene using Figure 1 as the background.',
      'Keep the exact visual style as: ' + STYLE + '.',
      'No characters, no people, no silhouettes.',
      'Emphasize the scene action through objects and atmosphere: ' + (scene.action1 || 'ambient details and mood') + '.',
      COLOR + ', ' + QUALITY + '.',
    ].join(' ');
  }

  // 3 characters
  if (scene.isThreeChar) {
    return [
      'Create a natural final scene using Figure 1 as the background.',
      'Use Figures 2, 3, and 4 only for character identity, face, hair, clothing, clothing color, body proportions, silhouette, age, and visual style.',
      'Keep the exact visual style as: ' + STYLE + '.',
      'Camera angle: ' + cameraAngle + '.',
      'Do not copy the original poses from the reference figures.',
      'Create new acting poses for each character according to the scene action: ' + scene.action1 + '.',
      'Place all characters clearly without overlapping faces, with natural body orientation relative to the environment (not all facing the camera).',
      'Blend them naturally into the lighting and perspective of Figure 1.',
      'The final result should be a single cinematic scene, not a reference sheet.',
    ].join(' ');
  }

  // 1 character
  if (scene.characters.length === 1) {
    return [
      'Create a natural final scene using Figure 1 as the background.',
      'Use Figure 2 only for character identity, face, hair, clothing, clothing color, body proportions, silhouette, age, and visual style.',
      'Keep the exact visual style as: ' + STYLE + '.',
      'Camera angle: ' + cameraAngle + '.',
      'Do not copy the original pose, original hand positions, original props, or original composition of Figure 2.',
      '',
      'Change the character pose to a new acting pose: ' + scene.action1 + '.',
      'The character should have natural body orientation relative to the environment, not stiffly facing the camera.',
      '',
      'Place the character naturally in the scene. Blend the character naturally into the lighting and perspective of Figure 1.',
      '',
      'The final result should be a single scene, not a reference sheet.',
    ].join('\n');
  }

  // 2 characters
  return [
    'Create a natural final scene using Figure 1 as the background.',
    'Use Figures 2 and 3 only for character identity, face, hair, clothing, clothing color, body proportions, silhouette, age, and visual style.',
    'Keep the exact visual style as: ' + STYLE + '.',
    'Camera angle: ' + cameraAngle + '.',
    'Do not copy the original poses, original hand positions, original props, original weapons, original objects, original pets, or original compositions of Figures 2 or 3.',
    '',
    'Change the pose of the character in Figure 2 to a new acting pose: ' + scene.action1 + '.',
    'Change the pose of the character in Figure 3 to a new acting pose: ' + (scene.action2 || 'standing naturally in the scene') + '.',
    'Both characters should have natural body orientation relative to the environment and each other, not stiffly facing the camera.',
    '',
    'Place both characters naturally in the scene with clear left/right or foreground/background positioning.',
    'Blend both characters naturally into the lighting and perspective of Figure 1.',
    '',
    'The final result should be a single scene, not a reference sheet, not a character arrangement, not a poster.',
  ].join('\n');
}

function buildVideoPrompt(scene) {
  const vid1 = scene.videoAction1 || 'subtle breathing and small head movement';
  const vid2 = scene.videoAction2 || 'subtle body shift';

  if (!scene.characters || scene.characters.length === 0) {
    return 'Animate the environment naturally with subtle atmospheric motion. ' + vid1 + '. Keep the camera static (no zoom, no pan). Maintain the exact composition from the input image. Duration: 5 seconds. Natural physics.';
  }

  if (scene.characters.length === 1) {
    return 'Animate the character naturally with subtle, realistic motion. ' + scene.characters[0] + ': ' + vid1 + '. Keep the camera static (no zoom, no pan). Maintain the exact composition from the input image. Duration: 5 seconds. Natural physics, no impossible movements.';
  }

  return 'Animate both characters naturally with subtle, realistic motion. ' + scene.characters[0] + ': ' + vid1 + '. ' + scene.characters[1] + ': ' + vid2 + '. Keep the camera static (no zoom, no pan). Maintain the exact composition from the input image. Duration: 5 seconds. Natural physics, no impossible movements, no character merging, no extra people appearing.';
}

// ============================================
// MAIN
// ============================================

(async () => {
  console.log('=== Generate Prompts V2 for All 60 Scenes ===');
  console.log('Story: Pocong Salah Alamat COD (180s)');
  console.log('Style: ' + STYLE);
  console.log('V2: Natural body orientation + camera angle per scene');
  console.log('');

  const scenes = await p.storyboardScene.findMany({
    where: { project_id: PROJECT_ID },
    select: { scene_id: true },
    orderBy: { scene_number: 'asc' },
  });

  let updated = 0;
  let skipped = 0;

  for (const scene of scenes) {
    const data = SCENE_DATA[scene.scene_id];

    if (!data) {
      console.log('SKIP ' + scene.scene_id + ' (no data)');
      skipped++;
      continue;
    }

    const bgPrompt = buildBackgroundPrompt(data);
    const imgPrompt = buildImagePrompt(data);
    const vidPrompt = buildVideoPrompt(data);

    try {
      const res = await fetch('http://localhost:3000/api/storyboard/' + PROJECT_ID + '/scenes/' + scene.scene_id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          background_prompt: bgPrompt,
          image_prompt: imgPrompt,
          video_prompt: vidPrompt,
        }),
      });
      const result = await res.json();
      if (result.ok) {
        const charCount = data.characters ? data.characters.length : 0;
        const type = charCount === 0 ? 'NO-CHAR' : charCount === 1 ? '1-CHAR' : data.isThreeChar ? '3-CHAR' : '2-CHAR';
        console.log('OK ' + scene.scene_id + ' [' + type + '] ' + (data.cameraAngle || '').slice(0, 30));
        updated++;
      } else {
        console.log('FAIL ' + scene.scene_id + ': ' + (result.error || 'unknown'));
        skipped++;
      }
    } catch (e) {
      console.log('ERROR ' + scene.scene_id + ': ' + e.message);
      skipped++;
    }

    await new Promise(r => setTimeout(r, 50));
  }

  console.log('');
  console.log('=== Summary ===');
  console.log('Updated: ' + updated + ' scenes');
  console.log('Skipped: ' + skipped + ' scenes');
  console.log('');
  console.log('V2 improvements:');
  console.log('  - Camera angle per scene (3/4 view, side, over-the-shoulder, dll)');
  console.log('  - Body orientation relatif environment (facing gate, turned away, dll)');
  console.log('  - Hindari pose front-facing stiff');

  await p.$disconnect();
})();
