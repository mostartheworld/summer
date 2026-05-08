# App Design & Component Reference — Summer's World

โหลดไฟล์นี้ทุกครั้งที่จะสร้างหรือแก้ไข HTML ใดๆ ในโปรเจกต์นี้

---

## Stack

- **Pure HTML / CSS / JavaScript** — ไม่มี framework, ไม่มี build step
- **Fonts (Google Fonts):** `Noto Sans Thai` (ภาษาไทย), `Bungee` (หัวข้อ/labels), `Fredoka` (เนื้อหาทั่วไป)
- **ไม่ใช้** npm, node_modules, หรือ CDN อื่นนอกจาก Google Fonts
- ทุกไฟล์เป็น self-contained HTML ไฟล์เดียว (CSS + JS อยู่ใน `<style>` และ `<script>` tag)

---

## หน้าที่มีอยู่แล้ว

| ไฟล์ | ชื่อหน้า | สำหรับใคร | Card class |
|------|---------|-----------|------------|
| `index.html` | Summer's World (หน้าหลัก) | ทุกคน | — |
| `knowledge.html` | รู้อะไรบ้างนะ? | Summer | `c-purple` |
| `24_question.html` | 24 คำถาม คุยเล่นกับลูก | Summer + พ่อแม่ | `c-pink` |
| `school_dashboard.html` | เปรียบเทียบโรงเรียน ป.1 | พ่อแม่ | `c-green card-wide` |
| `thai_money.html` | เหรียญไทย | Summer | `c-coin` |
| `pay_money.html` | จ่ายเงินซื้อของ | Summer + แม่ | `c-teal` |
| `robot_game.html` | ประกอบหุ่นยนต์ | Summer | `c-gold` |
| `color_mix.html` | ผสมสีกัน! | Summer | `c-rainbow` |

---

## Design System

### สีพื้นหลัง (Body)
```css
background: #fff9f0;
/* + radial gradients: ชมพู top-left, ฟ้า top-right, เหลือง bottom-center, เขียว bottom-left */
```

### Card Color Themes
```css
.c-pink    { background: linear-gradient(145deg, #e84d8a 0%, #ff9f4d 100%); }   /* ชมพู-ส้ม */
.c-gold    { background: linear-gradient(145deg, #e6a117 0%, #ffd93d 100%); }   /* ทอง-เหลือง */
.c-purple  { background: linear-gradient(145deg, #5a56e0 0%, #c855f7 100%); }   /* น้ำเงิน-ม่วง */
.c-teal    { background: linear-gradient(145deg, #0a8a7e 0%, #2dd4bf 100%); }   /* teal-cyan */
.c-coin    { background: linear-gradient(145deg, #c97c0a 0%, #fbbf24 100%); }   /* เหรียญทอง */
.c-green   { background: linear-gradient(145deg, #15803d 0%, #4ade80 100%); }   /* เขียวเข้ม-เขียวสด */
.c-rainbow { background: linear-gradient(145deg, #FF2A2A 0%, #FF9F1C 45%, #1A40FF 100%); } /* สีรุ้ง */
/* เพิ่ม class ใหม่ตามรูปแบบ: .c-XXX { background: linear-gradient(145deg, ...) } */
```

### Tag Colors
```css
.tag          { background: #f5eeff; color: #7c3aed; }  /* ม่วง (default) */
.tag-green    { background: #f0fdf4; color: #16a34a; }
.tag-blue     { background: #eff6ff; color: #2563eb; }
.tag-orange   { background: #fff7ed; color: #c2410c; }
.tag-pink     { background: #fff1f8; color: #db2777; }
```

### Font Usage
```css
/* หัวข้อใหญ่ / labels / ชื่อ EN caps */
font-family: 'Bungee', cursive;

/* เนื้อหาทั่วไป / ภาษาไทย */
font-family: 'Fredoka', 'Noto Sans Thai', sans-serif;
```

---

## HTML Patterns

### Font Link (ใส่ใน `<head>` ทุกไฟล์)
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bungee&family=Fredoka:wght@400;500;600;700&family=Noto+Sans+Thai:wght@400;600;700;900&display=swap" rel="stylesheet">
```

### Card ใน index.html (template สำหรับเพิ่มหน้าใหม่)
```html
<a href="FILENAME.html" class="card c-COLOR">
  <div class="card-icon">EMOJI</div>
  <div class="card-name-th">ชื่อภาษาไทย</div>
  <div class="card-name-en">ENGLISH NAME</div>
  <div class="card-desc">คำอธิบายสั้นๆ ว่าหน้านี้ทำอะไร</div>
  <div class="card-arrow">→</div>
</a>
```

Wide card (spanning 2 columns — ใช้กับหน้า parent เช่น school_dashboard):
```html
<a href="FILENAME.html" class="card c-COLOR card-wide">
  <div class="card-icon">EMOJI</div>
  <div class="card-info">
    <div class="card-name-th">ชื่อภาษาไทย</div>
    <div class="card-name-en">ENGLISH NAME</div>
    <div class="card-desc">คำอธิบาย</div>
  </div>
  <div class="card-arrow">→</div>
</a>
```

### Floating Blobs Script (copy ไปทุกหน้าที่ต้องการ background เคลื่อนไหว)
```html
<div class="blobs" id="blobs"></div>
<script>
(function() {
  const cols = ["#ffb3d9","#ffe082","#a5f3c6","#bfdbfe","#ddd6fe","#99f6e4","#fca5a5","#fbcfe8"];
  const wrap = document.getElementById("blobs");
  for (let i = 0; i < 22; i++) {
    const b = document.createElement("div");
    b.className = "blob";
    const s = 40 + Math.random() * 120;
    b.style.cssText = `width:${s}px;height:${s}px;background:${cols[i%cols.length]};
      left:${Math.random()*100}%;top:${Math.random()*100}%;
      animation-duration:${8+Math.random()*14}s;animation-delay:${-Math.random()*10}s;`;
    wrap.appendChild(b);
  }
})();
</script>
```

---

## UX Rules — เด็ก 5 ขวบ

1. **ปุ่มใหญ่** — touch target ≥ 56px, ไม่มีปุ่มเล็กติดกัน
2. **Feedback ทันที** — ถูก: แสดง ✅ + เสียง/animation; ผิด: แสดง "ลองใหม่นะ" ไม่ดุ ไม่แดง
3. **คำอธิบายสั้น** — ประโยคเดียว ใช้คำง่าย ไม่เกิน 10 คำ
4. **Emoji แทนภาพ** — ใช้ emoji ขนาดใหญ่ (48–80px) เป็น visual cue
5. **ไม่มี timer กดดัน** — ยกเว้นถ้าเป็นเกมที่ผู้ใหญ่เล่นด้วย
6. **Back button ชัดเจน** — ทุกหน้าต้องมีปุ่มกลับ index.html
7. **อ่านออกเสียงได้** — ใช้ `title` attribute หรือ aria-label สำหรับปุ่มสำคัญ

---

## Deploy Process UAT

โปรเจกต์นี้เป็น static HTML ไม่มี build step  
**Hosting:** Synology NAS — `smb://192.168.1.49/web`

**ขั้นตอน deploy / update:**
1. แก้ไขหรือสร้างไฟล์ `.html` ใน `/Users/imo/Workspace/Summer-Project/`
2. เพิ่ม card ใน `home.html` (ถ้าเป็นหน้าใหม่)
3. เปิด browser ทดสอบด้วย `open home.html` หรือ Live Server
4. ตรวจ responsive บน mobile (viewport 375px)
5. Copy ไฟล์ที่แก้ไขไปยัง Synology NAS:
   - Mount: `smb://192.168.1.49/web`
   - คัดลอกไฟล์ `.html` ที่แก้ไขทับของเดิมใน share นั้น

```bash
# ตัวอย่าง copy ผ่าน Terminal (ถ้า mount แล้วที่ /Volumes/web)
cp /Users/imo/Workspace/Summer-Project/*.html /Volumes/web/
```
## Deploy to PRODUCTION
0. before process this step , please confirm with me to commit to PRODUCTION .
event confirm go to next step, event reject nothing.
1. update new content to README.md file as well
2. maindatory file to push to github [README.md, all .html] 
3. commit to github : https://github.com/mostartheworld/summer