# Summer's World

แหล่งเรียนรู้และเกมสนุกสำหรับ Summer (5 ขวบ) — a tiny family web platform for kids age 5+.

- Stack: pure `HTML / CSS / JavaScript` (no build step, no framework)
- UX goals: big buttons, forgiving interactions, English-first with Thai hints
- Last updated: 2026-11-17
- Look: the kids' side is one 3D voxel island world (Three.js) — Summer, in his yellow racing suit, walks to each activity

## Quick start

- Local: open `index.html` in any browser (3D needs internet for Three.js from jsdelivr; pages fall back gracefully offline)
- GitHub Pages (optional): serve the repo root (users can land on `home.html` → redirects to `index.html`)

## Games & activities

| Page | What it is | Status |
|------|------------|--------|
| `index.html` | 🏝️ 3D island home — 2 tall floors + hill, glass lifts between floors, waterfall, 15 unique buildings, day/night + weather (rain umbrella, snowmen) + festivals (Christmas, Loy Krathong), rotating mini-map; walk/tap Summer to a building to enter each activity | ✅ Ready |
| `menu.html` | Classic card menu (all pages + parent tools); badges show ✨3D / 🏝️ island-theme pages | ✅ Ready |
| `24_question.html` | ✨3D picnic — roll the big die, a topic chest opens with a conversation question; 🇹🇭/🇬🇧 toggle, progress saved | ✅ Ready |
| `robot_game.html` | ✨3D robot workshop — 4 levels Noob/Pro/Hacker/God (5–12 parts), endless random colours (tap a part to recolour or restyle), lessons per part | ✅ Ready |
| `knowledge.html` | ✨3D word museum — tap exhibits to hear Thai + English and earn stars (6 topics), counting-block add/subtract | ✅ Ready |
| `thai_money.html` | ✨3D coin museum (1/2/5/10 baht, flip to hear) + quiz | ✅ Ready |
| `pay_money.html` | ✨3D shop — pay a cat shopkeeper with coins, get change back | ✅ Ready |
| `color_mix.html` | ✨3D colour pot — 4 modes: primaries, tints/shades (white/black), multi-drop mixing, colour quiz | ✅ Ready |
| `gravity.html` | ✨3D space — Earth/Moon drop test, rocket, jump, 🔭 night-sky planetarium (Thai constellations), 🪐 solar-system tour Sun → Neptune | ✅ Ready |
| `farm_kid.html` | ✨3D ฟาร์มฝึกคิด — 5 โรงนา = 5 หมวด (250 ข้อ), ตอบทีละ 5 ข้อ ตอบถูกพืชงอกในแปลง, เก็บดาวสูงสุด | ✅ Ready |
| `satit_exam.html` | ฝึกสอบสาธิต — 6 หมวด: ตรรกะ (โดมิโน+อนุกรม), มิติสัมพันธ์ (บล็อก+คลี่ลูกเต๋า), วิทย์-คณิต (25 ข้อ), ภาษา-ฟัง (TTS 4 เรื่อง), ภาษาไทย, พร้อมสอบ + ลากเส้น 8 แบบ — 🧊 บล็อก/คลี่ลูกเต๋า, 🁫 โดมิโน และ ✏️ ลากเส้น เป็น 3D (หมุนดู, นับแต้มให้ดู, พับกล่อง, รูปที่วาดลุกขึ้นเป็น 3D) | ✅ Ready |
| `sa_ra.html` | ✨3D โรงงานต่อคำ — บล็อกพยัญชนะ + บล็อกสระ (อา อิ อี อุ อู เอ แอ โอ ไอ) บินไปวางตำแหน่งจริงแล้วรวมเป็นคำ, ฟังสะกด, เกม 10 ข้อ | ✅ Ready |
| `clock_game.html` | ✨3D หอนาฬิกา (นกกาเหว่าออกมาเมื่อตอบถูก) — อ่านเข็มนาฬิกา เต็มชั่วโมง/ครึ่งชั่วโมง 3 โหมด 10 ข้อ/รอบ | ✅ Ready |
| `math_2digit.html` | ✨3D บวกลบสองหลัก — base-10 blocks ย้าย/หายให้เห็น (🟦=10 🔴=1) visual aid, 3 โหมด (บวก/ลบ/ผสม), 3 ระดับ, 10 ข้อ/รอบ | ✅ Ready |
| `chinese.html` | ✨3D ถนนโคมไฟ — แตะโคมฟังเสียงจีน (Traditional Chinese), ตัวเลขมีจุดให้นับ, ทดสอบ 10 ข้อ | ✅ Ready |
| `homework.html` | ✨3D homework room (prep for Grade 1) — first item: English speech practice on a stage: 👂 listen (karaoke), 🗣️ repeat, 🎭 perform + record. Homework list lives in `homework-data.js` | ✅ Ready |
| `rewards.html` | ✨3D treasure room — parents give stars (behind a sum gate) with a reason, stars fill the jar, chests open at goals | ✅ Ready |
| `mrbeast_lab.html` | Beast Lab Scanner — แคตตาล็อก MrBeast Lab Swarms 486 ตัว (ข้อมูล `mrbeast/catalog.json` + ภาพ `mrbeast/img/`), ค้นหา/กรอง, เดาจากสีรูปถ่าย, ติ๊กตัวที่มีแล้ว — 🏝️ ธีมเกาะ | ✅ Ready |

## For parents

| Page | What it is | Status |
|------|------------|--------|
| `school_dashboard.html` | Compare schools (charts, fees, notes) — เก็บไว้เป็นข้อมูลอ้างอิง | ✅ Ready |
| `rp-prep-for-summer.html` | เตรียมลูกสอบ PRE ACP อัสสัมชัญ — RP / Viva / สัมภาษณ์ / แนวข้อสอบ / Checklist (6 tabs) | ✅ Ready |

## Repo notes

- `home.html` is a simple redirect to `index.html` (handy for some hosting setups).
- Shared 3D files: `world-kit.js` (Three.js helpers: Summer avatar, stage, coins, confetti, sound/TTS), `world-theme.css` (UI for full-3D pages), `world-shell.js` (adds the island top bar + small 3D backdrop to text/quiz pages: satit_exam, mrbeast_lab).
