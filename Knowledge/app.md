# App Design & Component Reference — Summer's World

โหลดไฟล์นี้ทุกครั้งที่จะสร้างหรือแก้ไข HTML ใดๆ ในโปรเจกต์นี้

---

## Stack

- **Pure HTML / CSS / JavaScript** — ไม่มี framework, ไม่มี build step
- **Fonts (Google Fonts):** `Noto Sans Thai` (ภาษาไทย), `Prompt` (หัวข้อ bold), `Nunito` (อังกฤษ)
- **ไม่ใช้** npm, node_modules, หรือ CDN อื่นนอกจาก Google Fonts
- ทุกไฟล์เป็น self-contained HTML ไฟล์เดียว (CSS + JS อยู่ใน `<style>` และ `<script>` tag)

---

## หน้าที่มีอยู่แล้ว

| ไฟล์ | ชื่อหน้า | สำหรับใคร | Card class |
|------|---------|-----------|------------|
| `home.html` | Summer's World (หน้าหลัก) | ทุกคน | — |
| `knowledge.html` | รู้อะไรบ้างนะ? | Summer | `card-k` (gradient: indigo→purple→pink) |
| `24_question.html` | 24 คำถาม คุยเล่นกับลูก | Summer + พ่อแม่ | `card-q` (gradient: pink→orange→yellow) |
| `school_dashboard.html` | เปรียบเทียบโรงเรียน ป.1 | พ่อแม่ | `card-s` (gradient: emerald→green) |
| `thai_money.html` | เหรียญไทย | Summer | `card-c` (gradient: amber→yellow) |
| `pay_money.html` | จ่ายเงินซื้อของ | Summer + แม่ | `card-p` (gradient: teal→cyan) |

---

## Design System

### สีพื้นหลัง (Body)
```css
background: #fff9f0;
/* + radial gradients: ชมพู top-left, ฟ้า top-right, เหลือง bottom-center, เขียว bottom-left */
```

### Card Gradient Themes — เพิ่มใหม่ทีละ class
```css
.card-q  { background: linear-gradient(135deg, #ff6b9d, #ff8a5b, #ffd020); }  /* ชมพู-ส้ม-เหลือง */
.card-k  { background: linear-gradient(135deg, #6366f1, #a855f7, #ec4899); }  /* น้ำเงิน-ม่วง-ชมพู */
.card-s  { background: linear-gradient(135deg, #059669, #22c55e, #86efac); }  /* เขียวเข้ม-เขียวสด */
.card-c  { background: linear-gradient(135deg, #f59e0b, #fcd34d, #fef08a); }  /* ทอง-เหลือง (thai_money) */
.card-p  { background: linear-gradient(135deg, #0d9488, #14b8a6, #5eead4); }  /* teal-cyan (pay_money) */
/* สร้าง class ใหม่ตามตัวอักษรถัดไป: card-m, card-t, card-n ... */
/* ตัวอย่างสีที่ยังไม่ใช้: ฟ้า (#0ea5e9, #38bdf8), แดง (#ef4444, #f87171) */
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
/* หัวข้อใหญ่ / ชื่อการ์ด */
font-family: 'Prompt', 'Noto Sans Thai', sans-serif;
font-weight: 900;

/* เนื้อหาทั่วไป / คำอธิบาย */
font-family: 'Noto Sans Thai', 'Nunito', system-ui, sans-serif;

/* ชื่อภาษาอังกฤษ */
font-family: 'Nunito', sans-serif;
font-weight: 700;
```

---

## HTML Patterns

### Font Link (ใส่ใน `<head>` ทุกไฟล์)
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@400;700;800;900&family=Prompt:wght@700;800;900&family=Nunito:wght@700;800;900&display=swap" rel="stylesheet">
```

### Card ใน home.html (template สำหรับเพิ่มหน้าใหม่)
```html
<a class="page-card card-X" href="FILENAME.html">
  <div class="card-banner">
    <span class="card-big-emoji">EMOJI</span>
    <div class="card-title">ชื่อภาษาไทย</div>
    <div class="card-title-en">English Subtitle</div>
  </div>
  <div class="card-body">
    <p class="card-desc">คำอธิบายสั้นๆ ว่าหน้านี้ทำอะไร เหมาะกับใคร</p>
    <div class="card-tags">
      <span class="tag tag-COLOR">EMOJI หัวข้อ</span>
    </div>
    <div class="card-arrow">→</div>
  </div>
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
6. **Back button ชัดเจน** — ทุกหน้าต้องมีปุ่มกลับ home.html
7. **อ่านออกเสียงได้** — ใช้ `title` attribute หรือ aria-label สำหรับปุ่มสำคัญ

---

## Deploy Process

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
