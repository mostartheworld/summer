# CLAUDE.md — Summer's World

**Project:** Family web platform สำหรับ Summer (อายุ 5 ปี)
**Stack:** Pure HTML / CSS / JavaScript — ไม่มี build step, ไม่มี framework
**Maintainers:** พ่อ + แม่ (ทั้งคู่ contribute)

---

## Knowledge Files — Load Rules

| ไฟล์ | เนื้อหา | โหลดเมื่อไหร่ |
|------|---------|--------------|
| `Knowledge/app.md` | Design system, components, UX rules, deploy process | **ALWAYS** — โหลดก่อนทุกครั้งที่แตะ HTML |
| `Knowledge/curriculum.md` | หลักสูตรประถม ป.ก่อน–ป.6 แยกวิชา | เมื่อคิด content หรือสร้าง activity ใหม่ |

---

## Skills

| Skill | Trigger | ทำอะไร |
|-------|---------|---------|
| `add-activity` | "เพิ่ม activity", "สร้างหน้าใหม่", "เพิ่มเกม [topic]" | คิด content → สร้าง HTML → update home.html → ทดสอบ → deploy |

---

## Goals

- Educational activities และเกมเหมาะกับเด็ก 5 ขวบ
- Parent-facing tools สำหรับพ่อแม่ (เช่น school dashboard)
- UI เรียบง่าย ภาพใหญ่ ตัวอักษรชัด เหมาะมือเด็ก

---

## Pages

| ไฟล์ | หน้า | ผู้ใช้ |
|------|------|--------|
| `home.html` | หน้าหลัก | ทุกคน |
| `knowledge.html` | รู้อะไรบ้างนะ? (คำศัพท์) | Summer |
| `24_question.html` | 24 คำถามคุยเล่นกับลูก | Summer + พ่อแม่ |
| `school_dashboard.html` | เปรียบเทียบโรงเรียน ป.1 | พ่อแม่ |

---

## Notes

- ทุก page ต้องมี back button → `home.html`
- Target end-user หลักคือเด็ก 5 ขวบ — UI ต้องง่ายและให้อภัย (forgiving)
- ภาษาไทยเป็นหลัก มีอังกฤษกำกับ
- Keep code readable — ทั้งสองคนจะมาแก้
