// generate-prompts.cjs
// Auto-generate prompt untuk semua 60 scene — Story: Pocong Salah Alamat COD (180s)
// Style: cinematic semi-realistic 2D illustration (konsisten untuk semua scene)
//
// CARA PAKAI:
// 1. Pastikan Next.js jalan (bun run dev)
// 2. Jalankan: node generate-prompts.cjs
// 3. Review hasil di UI storyboard
// 4. Generate All Backgrounds → Images → Videos

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
// SCENE_DATA — auto-extracted from pocong_salah_alamat_cod_kiwul_180s.json
// 60 scenes, 4 characters: arman, pak karto, bowo, maya
// ============================================

const SCENE_DATA = {
  scene_001: {
    location: "A quiet Indonesian village road at midnight with a small empty house gate, wet asphalt",
    time: "nighttime", weather: "wet, rainy",
    characters: ["arman", "pak karto"],
    action1: "Arman on the left frozen in fear while holding a delivery package and phone",
    action2: "Pak Karto pocong on the right leaning forward from the gate with a grumpy complaining face",
    videoAction1: "slowly turns his head, eyes wide with fear, grip tightens on the package",
    videoAction2: "leans forward slightly, mouth moves as if complaining, gestures with one hand",
  },
  scene_002: {
    location: "A courier smartphone screen glow on a scooter handlebar, dark village alley entrance",
    time: "nighttime", weather: "clear",
    characters: ["arman"],
    action1: "Arman sits on his parked scooter staring at his phone with anxious wide eyes, one hand gripping the delivery box",
    videoAction1: "chest rises and falls with heavy breathing, eyes dart nervously across the phone screen",
  },
  scene_003: {
    location: "A narrow village alley at night with closed wooden doors, puddles",
    time: "nighttime", weather: "wet, rainy",
    characters: ["arman"],
    action1: "Arman walks carefully into the alley while pretending to be brave, holding the package under one arm and phone flashlight forward",
    videoAction1: "cautious forward steps, phone light trembles slightly, head turns nervously",
  },
  scene_004: {
    location: "A dead-end village alley with old walls, weak streetlamp",
    time: "nighttime", weather: "foggy, misty",
    characters: [],
    action1: "the phone screen on the scooter shows no signal while the package label glows faintly under the streetlamp, fog creeping across the ground",
    videoAction1: "fog slides across the ground, light buzzes softly, phone screen flickers",
  },
  scene_005: {
    location: "A close view of a sealed cardboard delivery package on wet ground near a rusty gate, dim streetlamp",
    time: "nighttime", weather: "wet, rainy",
    characters: ["arman"],
    action1: "Arman crouches near the package, recoiling with both hands raised as the box slightly shakes on the ground",
    videoAction1: "small package vibration, Arman flinches back subtly, wide eyes fixed on the box",
  },
  scene_006: {
    location: "A rusty gate in front of an abandoned small house, dark porch",
    time: "nighttime", weather: "wet, rainy",
    characters: ["arman"],
    action1: "Arman turns his head sharply toward the gate, one foot stepping backward, package clutched tight against his chest",
    videoAction1: "slow pan from Arman to the gate, plants sway lightly, Arman's shoulders tense",
  },
  scene_007: {
    location: "An old abandoned house gate half open, mossy wall",
    time: "nighttime", weather: "foggy, misty",
    characters: ["pak karto"],
    action1: "Pak Karto pocong stands just behind the gate, leaning forward with grumpy squinting eyes as if ready to complain",
    videoAction1: "slow push in, fog curls around the gate, Pak Karto makes a small grumpy head tilt",
  },
  scene_008: {
    location: "A small empty house porch with rusty gate, wet tiles",
    time: "nighttime", weather: "wet, rainy",
    characters: ["arman", "pak karto"],
    action1: "Arman stands stiff on the left holding his phone like a shield",
    action2: "Pak Karto on the right points grumpily toward the delivery package with bundled cloth hands",
    videoAction1: "slight handheld wobble, Arman blinks nervously",
    videoAction2: "Pak Karto makes a small pointing movement with bundled cloth hands",
  },
  scene_009: {
    location: "A smartphone close-up showing a delivery confirmation page on a dark alley background, wet ground and cardboard box nearby",
    time: "nighttime", weather: "wet, rainy",
    characters: ["arman"],
    action1: "Arman holds the phone with trembling hands, his anxious face lit by the screen as he hesitates to press confirmation",
    videoAction1: "slow zoom onto the trembling phone, tiny finger movement, screen glow flickers",
  },
  scene_010: {
    location: "A dim porch floor with an opened cardboard package and a strange demon-head-shaped speaker inside, eerie but comedic lighting",
    time: "nighttime", weather: "clear",
    characters: ["arman", "pak karto"],
    action1: "Arman crouches left with horrified confused expression pointing at the opened box",
    action2: "Pak Karto leans right staring angrily at the speaker like a disappointed customer",
    videoAction1: "slow push in on the opened box, subtle flicker from the speaker, Arman flinches",
    videoAction2: "Pak Karto makes a tiny angry head shake staring at the wrong speaker",
  },
  scene_011: {
    location: "An old empty porch with opened cardboard box, demon-head speaker on cracked tiles",
    time: "nighttime", weather: "foggy, misty",
    characters: ["pak karto"],
    action1: "Pak Karto stands beside the opened package with grumpy disappointment, looking down at the wrong item like an angry customer",
    videoAction1: "slow tilt from package to Pak Karto's annoyed face, cloth edges flutter slightly",
  },
  scene_012: {
    location: "A midnight village porch near a rusty gate, opened package on the floor",
    time: "nighttime", weather: "foggy, misty",
    characters: ["arman", "pak karto"],
    action1: "Arman stands left scratching his head in disbelief while holding the delivery phone",
    action2: "Pak Karto stands right with offended posture as if explaining himself",
    videoAction1: "subtle push in, Arman tilts his head in confusion",
    videoAction2: "Pak Karto gives a tiny offended nod, cloth shifts slightly",
  },
  scene_013: {
    location: "A humorous spooky cemetery corner beyond a village wall, small router box mounted near a tree",
    time: "nighttime", weather: "foggy, misty",
    characters: ["pak karto"],
    action1: "Pak Karto proudly stands near the gate pointing toward the direction of the cemetery Wi-Fi with a smug grumpy face",
    videoAction1: "slow pan toward the faint cemetery wall, Pak Karto makes a small proud head lift",
  },
  scene_014: {
    location: "A dark village alley with return label paper, cardboard box",
    time: "nighttime", weather: "wet, rainy",
    characters: ["arman"],
    action1: "Arman kneels on the wet ground trying to scan a return label, his face increasingly worried",
    videoAction1: "slow zoom on the failed scan, phone glow pulses, Arman's hand trembles",
  },
  scene_015: {
    location: "A spooky porch with opened package, phone screen glowing unnaturally",
    time: "nighttime", weather: "clear",
    characters: ["arman", "pak karto"],
    action1: "Arman on the left recoils while holding the phone toward Pak Karto",
    action2: "Pak Karto on the right squints at the phone like an impatient customer",
    videoAction1: "slow push in on the phone, ghostly glow pulses, Arman flinches subtly",
    videoAction2: "Pak Karto squints and makes a small impatient head lean forward",
  },
  scene_016: {
    location: "A small messy courier office at night, desk with parcels",
    time: "nighttime", weather: "clear",
    characters: ["bowo"],
    action1: "Bowo sits at the courier office desk answering a phone call with smug confidence, one hand holding a snack",
    videoAction1: "slow push in, fluorescent light flickers gently, Bowo gives a tiny confident nod",
  },
  scene_017: {
    location: "A messy courier office with parcels and a speakerphone on the desk, dim fluorescent night lighting",
    time: "nighttime", weather: "clear",
    characters: ["bowo"],
    action1: "Bowo leans close to the phone with a smug grin turning into open-mouth fear",
    videoAction1: "quick subtle push in, Bowo's expression shifts from confident to terrified, monitor light flickers",
  },
  scene_018: {
    location: "A village alley in front of an abandoned house gate, opened package on wet ground",
    time: "nighttime", weather: "wet, rainy",
    characters: ["arman", "pak karto"],
    action1: "Arman stands left holding phone and package receipt, sweating nervously",
    action2: "Pak Karto stands right with stern customer posture, bundled cloth pointed toward the package",
    videoAction1: "subtle push in, Arman shifts weight nervously, sweat visible",
    videoAction2: "Pak Karto makes a tiny demanding nod, cloth hand gestures firmly",
  },
  scene_019: {
    location: "A smartphone screen showing a delivery rating interface glowing ominously beside a courier bag, dark alley background",
    time: "nighttime", weather: "clear",
    characters: ["arman"],
    action1: "Arman stares at the phone in despair, holding it close to his face as his shoulders slump",
    videoAction1: "slow zoom to Arman's face, shoulders drop in defeat, phone glow reflects in his eyes",
  },
  scene_020: {
    location: "A village alley entrance with a parked scooter, courier bag",
    time: "nighttime", weather: "foggy, misty",
    characters: ["arman", "bowo"],
    action1: "Arman stands left looking desperate while holding the wrong package",
    action2: "Bowo stands right arriving confidently with a clipboard and fake professional pose",
    videoAction1: "subtle push in, Arman gestures desperately with the package",
    videoAction2: "Bowo raises the clipboard slightly with a confident smirk",
  },
  scene_021: {
    location: "A damp village porch with opened gate, wrong package on floor",
    time: "nighttime", weather: "clear",
    characters: ["pak karto", "bowo"],
    action1: "Bowo stands left pretending professional but visibly trembling",
    action2: "Pak Karto stands right looking down judgmentally at Bowo's sandals",
    videoAction1: "Bowo shifts nervously, clipboard shakes in his hands",
    videoAction2: "Pak Karto makes a small disapproving head shake, looking down judgmentally",
  },
  scene_022: {
    location: "A dark old porch with demon-head speaker glowing inside opened package, rusty gate",
    time: "nighttime", weather: "wet, rainy",
    characters: ["arman", "pak karto"],
    action1: "Arman recoils left, Bowo hides partly behind him in the middle, Pak Karto leans from the right toward the glowing speaker, all faces clearly separated",
    action2: "Pak Karto leans from the right toward the glowing speaker with angry curiosity",
    videoAction1: "tiny character flinches, speaker glow pulses subtly",
    videoAction2: "Pak Karto makes a small lean forward toward the glowing speaker",
    isThreeChar: true,
  },
  scene_023: {
    location: "A demon-head speaker inside a cardboard box on a dark porch floor, phone and receipts scattered nearby",
    time: "nighttime", weather: "clear",
    characters: ["arman", "bowo"],
    action1: "Arman crouches left holding the speaker at a distance with both hands",
    action2: "Bowo stands right leaning in with scared curiosity",
    videoAction1: "slow push in, Arman's hands shake holding the speaker",
    videoAction2: "Bowo leans in slightly with nervous curiosity, eyes wide",
  },
  scene_024: {
    location: "A small online shop packing room at night with shelves of parcels, laptop",
    time: "nighttime", weather: "clear",
    characters: ["maya"],
    action1: "Maya stands in her packing room with a fake polite smile, holding a phone and a shipping label",
    videoAction1: "slow push in, Maya's smile flickers briefly, eyes shift calculating",
  },
  scene_025: {
    location: "An online shop desk with laptop, pile of shipping labels",
    time: "nighttime", weather: "clear",
    characters: ["maya"],
    action1: "Maya sits confidently at the desk speaking into the phone with a polite fake smile and one raised finger",
    videoAction1: "slow zoom, Maya speaks with fake confidence, one finger raised professionally",
  },
  scene_026: {
    location: "A dark alley near the abandoned house, wet ground",
    time: "nighttime", weather: "wet, rainy",
    characters: ["arman", "bowo"],
    action1: "Arman stands left staring intensely at the shipping label",
    action2: "Bowo stands right peeking over Arman's shoulder with fearful curiosity",
    videoAction1: "fog moves slowly, Arman's eyes narrow at the label",
    videoAction2: "Bowo peeks nervously over Arman's shoulder, gulps visibly",
  },
  scene_027: {
    location: "A cemetery edge at night with an old gravestone, delivery label stuck on a small stone",
    time: "nighttime", weather: "foggy, misty",
    characters: ["pak karto"],
    action1: "Pak Karto stands beside a gravestone pointing grumpily at an old delivery label attached to the stone",
    videoAction1: "slow push in, fog drifts, Pak Karto points firmly at the label on the gravestone",
  },
  scene_028: {
    location: "A cemetery gate at midnight with old packages scattered near the entrance, dim lantern",
    time: "nighttime", weather: "foggy, misty",
    characters: ["arman", "pak karto"],
    action1: "Arman holds a pile of old labels on the left, Bowo reads them nervously in the middle, Pak Karto stands on the right with angry customer posture, all faces visible",
    action2: "Pak Karto stands on the right with angry customer posture, bundled cloth pointing at labels",
    videoAction1: "labels flutter slightly in the night breeze, characters shift nervously",
    videoAction2: "Pak Karto makes a small angry gesture toward the scattered labels",
    isThreeChar: true,
  },
  scene_029: {
    location: "A parked delivery scooter in a dark village alley, keyhole glowing faintly",
    time: "nighttime", weather: "wet, rainy",
    characters: ["arman"],
    action1: "Arman pulls at the scooter handle with panic, trying to unlock it while glancing toward the cemetery",
    videoAction1: "Arman fumbles with the key, hands shake, glances nervously over shoulder",
  },
  scene_030: {
    location: "A village road between abandoned house and cemetery wall, distant pale moon",
    time: "nighttime", weather: "wet, rainy",
    characters: ["arman", "pak karto"],
    action1: "Arman stands left exhausted and scared holding his phone",
    action2: "Pak Karto stands right pointing toward the pale horizon with strict urgency",
    videoAction1: "mist drifts, Arman's shoulders sag with exhaustion",
    videoAction2: "Pak Karto points firmly toward the horizon, cloth flutters in the wind",
  },
  scene_031: {
    location: "A quiet village road leading to a small warehouse area, wet asphalt",
    time: "nighttime", weather: "wet, rainy",
    characters: ["arman", "bowo"],
    action1: "Arman sits forward on the scooter looking determined but nervous",
    action2: "Bowo sits behind him clutching the courier bag with terrified eyes",
    videoAction1: "scooter headlight glows, Arman leans forward with determination",
    videoAction2: "Bowo clutches the courier bag tighter, eyes darting nervously",
  },
  scene_032: {
    location: "A village road at night with a delivery scooter, package box strapped behind",
    time: "nighttime", weather: "foggy, misty",
    characters: ["pak karto"],
    action1: "Pak Karto awkwardly balances behind a scooter with bundled feet, grumpy but determined, cloth fluttering in the wind",
    videoAction1: "cloth flutters in the wind, Pak Karto bounces slightly on the scooter, grumpy expression",
  },
  scene_033: {
    location: "An empty midnight village road with dim streetlights, scooter headlight beam",
    time: "nighttime", weather: "wet, rainy",
    characters: ["arman", "pak karto"],
    action1: "Arman drives nervously in front, Bowo clings behind him, Pak Karto perches awkwardly at the back, all characters visible and clearly separated",
    action2: "Pak Karto perches awkwardly at the back of the scooter, cloth fluttering",
    videoAction1: "subtle road vibration, scooter moves forward, characters bounce slightly",
    videoAction2: "Pak Karto bounces awkwardly at the back, cloth flutters in the wind",
    isThreeChar: true,
  },
  scene_034: {
    location: "An empty small warehouse at night with shelves of cardboard packages, some boxes slightly open",
    time: "nighttime", weather: "clear",
    characters: [],
    action1: "several sealed packages on warehouse shelves tremble slightly under red light, no people or characters present, eerie atmosphere",
    videoAction1: "packages tremble slightly, red light pulses softly, dust particles drift",
  },
  scene_035: {
    location: "A small warehouse packing desk with laptop, parcel scanner",
    time: "nighttime", weather: "clear",
    characters: ["maya"],
    action1: "Maya stands beside the packing desk with a confident fake smile, holding a scanner and checking a package label",
    videoAction1: "Maya scans a package with fake confidence, smile frozen, eyes calculating",
  },
  scene_036: {
    location: "A metal warehouse door at night with small signboard, wet concrete",
    time: "nighttime", weather: "wet, rainy",
    characters: ["arman", "bowo"],
    action1: "Arman stands left knocking politely with shaky knees",
    action2: "Bowo stands right hiding behind the courier bag and peeking nervously",
    videoAction1: "Arman knocks with trembling hand, knees visibly shaking",
    videoAction2: "Bowo shifts backward, peeks nervously from behind the courier bag",
  },
  scene_037: {
    location: "An exterior warehouse wall at night with mist, faint red light leaking from windows",
    time: "nighttime", weather: "foggy, misty",
    characters: ["pak karto"],
    action1: "Pak Karto stands half-facing the warehouse wall with a confident grumpy expression, preparing to pass through like a ghost",
    videoAction1: "fog swirls, Pak Karto drifts slightly toward the wall, cloth ripples eerily",
  },
  scene_038: {
    location: "A dim warehouse aisle with shelves of cardboard packages, red light",
    time: "nighttime", weather: "clear",
    characters: ["pak karto", "maya"],
    action1: "Maya stands left frozen with fake smile collapsing into fear",
    action2: "Pak Karto stands right beside the shelf with grumpy customer posture",
    videoAction1: "Maya's hand trembles slightly, fake smile cracks",
    videoAction2: "Pak Karto stands sternly, cloth hand gestures toward the shelf",
  },
  scene_039: {
    location: "A warehouse entrance interior with stacked boxes, dim red lamp",
    time: "nighttime", weather: "clear",
    characters: ["arman", "bowo"],
    action1: "Arman stands left trying to look firm, Bowo peeks from behind him in the middle, Maya stands right trying to regain composure, all faces clear",
    action2: "Maya stands right trying to regain composure with a nervous fake smile",
    videoAction1: "Bowo peeks and ducks behind Arman, eyes wide with fear",
    videoAction2: "Maya straightens up nervously, tries to regain composure",
    isThreeChar: true,
  },
  scene_040: {
    location: "A warehouse packing desk with laptop showing blurred marketplace layout, stacked parcels",
    time: "nighttime", weather: "clear",
    characters: ["maya"],
    action1: "Maya stands beside the desk with nervous fake confidence, one hand explaining while the other hides a shipping label",
    videoAction1: "Maya gestures with fake confidence, one hand hides a label behind her back",
  },
  scene_041: {
    location: "A dim warehouse aisle with package shelves, opened boxes",
    time: "nighttime", weather: "clear",
    characters: ["arman", "maya"],
    action1: "Arman stands left pointing angrily while still visibly scared",
    action2: "Maya stands right stepping back with defensive hands raised",
    videoAction1: "Arman points angrily, hand shakes with mixed fear and anger",
    videoAction2: "Maya steps back slightly, hands raised defensively",
  },
  scene_042: {
    location: "A warehouse shelf packed with wrong demon-head speakers and sealed parcels, red light",
    time: "nighttime", weather: "clear",
    characters: ["pak karto", "maya"],
    action1: "Pak Karto stands left leaning forward with furious grumpy customer expression",
    action2: "Maya stands right shrinking back while holding a parcel scanner",
    videoAction1: "Pak Karto leans forward furiously, cloth hand shakes with anger",
    videoAction2: "Maya's scanner hand trembles, she shrinks back against the shelf",
  },
  scene_043: {
    location: "A warehouse table covered with shipping labels, return forms",
    time: "nighttime", weather: "clear",
    characters: ["bowo"],
    action1: "Bowo stands at the table holding a stack of labels with shocked wide eyes and open mouth",
    videoAction1: "Bowo's jaw drops, eyes widen at the stack of labels, hands shake",
  },
  scene_044: {
    location: "A dim warehouse corner with stacked returned packages, old stamps",
    time: "nighttime", weather: "clear",
    characters: ["arman", "bowo"],
    action1: "Arman stands left reading a label with angry realization",
    action2: "Bowo stands right pointing at a pile of return packages with terrified excitement",
    videoAction1: "papers rustle, Arman's expression shifts to angry realization",
    videoAction2: "Bowo points with terrified excitement, hand shakes",
  },
  scene_045: {
    location: "A quiet warehouse aisle with a single wrong package under soft red light, shelves fading into darkness",
    time: "nighttime", weather: "clear",
    characters: ["pak karto"],
    action1: "Pak Karto stands alone beside the wrong package, grumpy face softened into sadness, head slightly lowered",
    videoAction1: "Pak Karto's head lowers slightly, expression softens from grumpy to sad",
  },
  scene_046: {
    location: "A quiet cemetery edge at night with old small radio-shaped memory object on a stone, moonlight",
    time: "nighttime", weather: "foggy, misty",
    characters: ["pak karto"],
    action1: "Pak Karto stands quietly near the memory object with emotional tired eyes, looking less angry and more lonely",
    videoAction1: "fog drifts, Pak Karto looks at the radio with nostalgic sad eyes, cloth ripples gently",
  },
  scene_047: {
    location: "A warehouse aisle with soft blue light from the open door, wrong package on the floor",
    time: "nighttime", weather: "clear",
    characters: ["arman"],
    action1: "Arman stands alone looking at the package with softened expression, one hand on his chest and phone lowered",
    videoAction1: "Arman's expression softens, hand touches chest, phone lowers to his side",
  },
  scene_048: {
    location: "A warehouse shelf maze full of parcels, dim red light",
    time: "nighttime", weather: "clear",
    characters: ["arman", "bowo"],
    action1: "Arman stands left determined, pointing toward a high shelf",
    action2: "Bowo stands right reluctantly searching through boxes with nervous face",
    videoAction1: "Arman points firmly toward the high shelf with determination",
    videoAction2: "Bowo moves a box slightly, face nervous, hands trembling",
  },
  scene_049: {
    location: "A warehouse shelf close-up with a small old radio among cardboard boxes, eerie sticker-like label without readable text",
    time: "nighttime", weather: "clear",
    characters: ["bowo"],
    action1: "Bowo holds a small old radio with both hands, eyes wide with comedic fear",
    videoAction1: "Bowo holds the radio with trembling hands, eyes wide with comedic terror",
  },
  scene_050: {
    location: "A warehouse metal exit door blocked by stacked cardboard boxes, red warning light",
    time: "nighttime", weather: "clear",
    characters: ["maya"],
    action1: "Maya runs toward the blocked door with panic, arms raised, fake confidence completely gone",
    videoAction1: "Maya runs frantically toward the blocked door, arms flailing with panic",
  },
  scene_051: {
    location: "A warehouse packing desk with phone, parcels",
    time: "nighttime", weather: "clear",
    characters: ["arman", "maya"],
    action1: "Arman stands left firmly holding the phone as evidence",
    action2: "Maya stands right ashamed and frightened, hands lowered",
    videoAction1: "Arman holds the phone firmly as evidence, stern expression",
    videoAction2: "Maya nods timidly, head lowered in shame",
  },
  scene_052: {
    location: "A dim warehouse aisle with parcels on shelves, soft red-blue lighting",
    time: "nighttime", weather: "clear",
    characters: ["pak karto", "maya"],
    action1: "Maya stands left bowing slightly with trembling hands",
    action2: "Pak Karto stands right listening with stern but calmer expression",
    videoAction1: "Maya bows subtly, hands tremble at her sides",
    videoAction2: "Pak Karto listens with stern but slightly calmer expression, gives a small nod",
  },
  scene_053: {
    location: "A warehouse floor with small old radio placed on a cardboard box, soft moonlight from window",
    time: "nighttime", weather: "foggy, misty",
    characters: ["pak karto"],
    action1: "Pak Karto stands beside the small radio with calmer grumpy face, looking hopeful",
    videoAction1: "Pak Karto looks at the radio with hopeful calmer expression, cloth settles",
  },
  scene_054: {
    location: "A warehouse aisle transformed by warm small lights from opened boxes, old radio on a box",
    time: "nighttime", weather: "clear",
    characters: ["arman", "pak karto"],
    action1: "Arman smiles awkwardly on the left, Bowo claps nervously in the middle, Pak Karto sways happily on the right, all faces clear",
    action2: "Pak Karto sways happily on the right near the radio, grumpy face softened",
    videoAction1: "warm lights flicker gently, Arman smiles awkwardly",
    videoAction2: "Pak Karto sways softly with a small grateful laugh, cloth shimmers warmly",
    isThreeChar: true,
  },
  scene_055: {
    location: "A quiet warehouse aisle with warm glow around a small radio, packages on shelves",
    time: "nighttime", weather: "foggy, misty",
    characters: ["pak karto"],
    action1: "Pak Karto stands peacefully near the radio, grumpy expression softened into a small grateful laugh, faint glow around his shroud",
    videoAction1: "warm glow pulses gently, Pak Karto's expression softens into a grateful laugh",
  },
  scene_056: {
    location: "A warehouse entrance with soft dawn-blue light outside, old radio on box",
    time: "dawn, golden hour", weather: "foggy, misty",
    characters: ["arman", "pak karto"],
    action1: "Arman stands left holding his phone with stunned relief",
    action2: "Pak Karto stands right glowing faintly, giving a small approving nod",
    videoAction1: "dawn light grows, Arman's expression shifts to stunned relief",
    videoAction2: "Pak Karto nods gently, form glows faintly and begins to fade",
  },
  scene_057: {
    location: "A warehouse corner with parcels, warm fading glow",
    time: "nighttime", weather: "clear",
    characters: ["bowo"],
    action1: "Bowo stands alone wiping tears with one hand while holding out the other hand awkwardly as if asking payment",
    videoAction1: "Bowo wipes tears with one hand, other hand extends awkwardly for payment",
  },
  scene_058: {
    location: "A cleaned online shop desk at dawn with organized return packages, small signboard without readable text",
    time: "dawn, golden hour", weather: "clear",
    characters: ["maya"],
    action1: "Maya sits at the desk looking humbled, organizing return packages carefully with a sincere expression",
    videoAction1: "Maya organizes packages carefully with sincere humbled expression, dawn light",
  },
  scene_059: {
    location: "A quiet village road at dawn with soft orange-blue sky, parked delivery scooter",
    time: "dawn, golden hour", weather: "wet, rainy",
    characters: ["arman"],
    action1: "Arman rides his scooter slowly down the quiet dawn road, relieved but exhausted, courier bag still on his shoulder",
    videoAction1: "scooter moves slowly forward, Arman's posture relaxes with relief, dawn light",
  },
  scene_060: {
    location: "A courier smartphone mounted on a scooter handlebar at dawn, quiet village road background",
    time: "dawn, golden hour", weather: "clear",
    characters: ["arman"],
    action1: "Arman stops his scooter and stares at the phone notification with horrified disbelief, one hand frozen above the screen",
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

  // 3 characters (special scenes: 022, 028, 033, 039, 054)
  if (scene.isThreeChar) {
    return [
      'Create a natural final scene using Figure 1 as the background.',
      'Use Figures 2, 3, and 4 only for character identity, face, hair, clothing, clothing color, body proportions, silhouette, age, and visual style.',
      'Keep the exact visual style as: ' + STYLE + '.',
      'Do not copy the original poses from the reference figures.',
      'Create new acting poses for each character according to the scene action: ' + scene.action1 + '.',
      'Place all characters clearly without overlapping faces.',
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
      'Do not copy the original pose, original hand positions, original props, or original composition of Figure 2.',
      '',
      'Change the character pose to a new acting pose: ' + scene.action1 + '.',
      '',
      'Place the character naturally in the scene. Blend the character naturally into the lighting and perspective of Figure 1.',
      '',
      'The final result should be a single scene, not a reference sheet.',
    ].join('\n');
  }

  // 2 characters (default)
  return [
    'Create a natural final scene using Figure 1 as the background.',
    'Use Figures 2 and 3 only for character identity, face, hair, clothing, clothing color, body proportions, silhouette, age, and visual style.',
    'Keep the exact visual style as: ' + STYLE + '.',
    'Do not copy the original poses, original hand positions, original props, original weapons, original objects, original pets, or original compositions of Figures 2 or 3.',
    '',
    'Change the pose of the character in Figure 2 to a new acting pose: ' + scene.action1 + '.',
    'Change the pose of the character in Figure 3 to a new acting pose: ' + (scene.action2 || 'standing naturally in the scene') + '.',
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

  // No characters
  if (!scene.characters || scene.characters.length === 0) {
    return 'Animate the environment naturally with subtle atmospheric motion. ' + vid1 + '. Keep the camera static (no zoom, no pan). Maintain the exact composition from the input image. Duration: 5 seconds. Natural physics.';
  }

  // 1 character
  if (scene.characters.length === 1) {
    return 'Animate the character naturally with subtle, realistic motion. ' + scene.characters[0] + ': ' + vid1 + '. Keep the camera static (no zoom, no pan). Maintain the exact composition from the input image. Duration: 5 seconds. Natural physics, no impossible movements.';
  }

  // 2+ characters
  return 'Animate both characters naturally with subtle, realistic motion. ' + scene.characters[0] + ': ' + vid1 + '. ' + scene.characters[1] + ': ' + vid2 + '. Keep the camera static (no zoom, no pan). Maintain the exact composition from the input image. Duration: 5 seconds. Natural physics, no impossible movements, no character merging, no extra people appearing.';
}

// ============================================
// MAIN
// ============================================

(async () => {
  console.log('=== Generate Prompts for All 60 Scenes ===');
  console.log('Story: Pocong Salah Alamat COD (180s)');
  console.log('Style: ' + STYLE);
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
        console.log('OK ' + scene.scene_id + ' [' + type + ']');
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
  console.log('Next steps:');
  console.log('  1. Review prompts di UI storyboard');
  console.log('  2. Assign character reference (kalau belum)');
  console.log('  3. Generate All Backgrounds');
  console.log('  4. Generate All Images (batch 10 scene)');
  console.log('  5. Generate All Videos (batch 5 scene)');

  await p.$disconnect();
})();
