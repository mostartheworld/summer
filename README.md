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
| `index.html` | 🏝️ 3D island home — walk/tap Summer to a building to enter each activity | ✅ Ready |
| `menu.html` | Classic card menu (all pages + parent tools); badges show ✨3D / 🏝️ island-theme pages | ✅ Ready |
| `24_question.html` | 24 conversation starters — bilingual 🇬🇧/🇹🇭 toggle | ✅ Ready |
| `robot_game.html` | ✨3D robot workshop — tap parts onto the robot, short lessons per part, robot wakes up and dances | ✅ Ready |
| `knowledge.html` | Thai-English vocabulary across multiple topics + number fun | ✅ Ready |
| `thai_money.html` | ✨3D coin museum (1/2/5/10 baht, flip to hear) + quiz | ✅ Ready |
| `pay_money.html` | ✨3D shop — pay a cat shopkeeper with coins, get change back | ✅ Ready |
| `color_mix.html` | ✨3D colour pot — mix red/blue/yellow, find all 3 secondary colours | ✅ Ready |
| `gravity.html` | ✨3D gravity lab — Earth/Moon drop test, rocket, jump | ✅ Ready |
| `farm_kid.html` | ฝึกข้อสอบหลายหมวด (เตรียมสอบแนวสาธิต/เกษตร) — สุ่มเล่นครั้งละ 5 ข้อ | ✅ Ready |
| `satit_exam.html` | ฝึกสอบสาธิต — 6 หมวด: ตรรกะ (โดมิโน+อนุกรม), มิติสัมพันธ์ (บล็อก+คลี่ลูกเต๋า), วิทย์-คณิต (25 ข้อ), ภาษา-ฟัง (TTS 4 เรื่อง), ภาษาไทย, พร้อมสอบ + ลากเส้น 8 แบบ — 🧊 บล็อก/คลี่ลูกเต๋า และ ✏️ ลากเส้น เป็น 3D (หมุนดู, นับให้ดู, พับกล่อง, รูปที่วาดลุกขึ้นเป็น 3D) | ✅ Ready |
| `sa_ra.html` | สระ — ฝึกสระพื้นฐาน (อา อิ อี อุ อู เอ แอ โอ ไอ) + โหมดเกม 10 ข้อ + ฟังเสียงสะกดไทย (หน้าไทยล้วน) | ✅ Ready |
| `clock_game.html` | ✨3D หอนาฬิกา (นกกาเหว่าออกมาเมื่อตอบถูก) — อ่านเข็มนาฬิกา เต็มชั่วโมง/ครึ่งชั่วโมง 3 โหมด 10 ข้อ/รอบ | ✅ Ready |
| `math_2digit.html` | ✨3D บวกลบสองหลัก — base-10 blocks ย้าย/หายให้เห็น (🟦=10 🔴=1) visual aid, 3 โหมด (บวก/ลบ/ผสม), 3 ระดับ, 10 ข้อ/รอบ | ✅ Ready |
| `chinese.html` | ภาษาจีน — เรียนตัวอักษรจีนแบบดั้งเดิม (Traditional Chinese) + กดฟังเสียงอ่านได้ (click-to-speak) | ✅ Ready |

## For parents

| Page | What it is | Status |
|------|------------|--------|
| `school_dashboard.html` | Compare schools (charts, fees, notes) — เก็บไว้เป็นข้อมูลอ้างอิง | ✅ Ready |
| `rp-prep-for-summer.html` | เตรียมลูกสอบ PRE ACP อัสสัมชัญ — RP / Viva / สัมภาษณ์ / แนวข้อสอบ / Checklist (6 tabs) | ✅ Ready |

## Repo notes

- `home.html` is a simple redirect to `index.html` (handy for some hosting setups).
- Shared 3D files: `world-kit.js` (Three.js helpers: Summer avatar, stage, coins, confetti, sound/TTS), `world-theme.css` (UI for full-3D pages), `world-shell.js` (adds the island top bar + small 3D backdrop to text/quiz pages: 24_question, satit_exam, sa_ra, chinese, knowledge, farm_kid).
