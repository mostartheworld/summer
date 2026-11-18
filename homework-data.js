/* =========================================================
   การบ้านของ Summer (homework list) — used by homework.html
   To add homework: add one object to HOMEWORK (newest first).

   type 'speech' = a speech / text to practise out loud
     paragraphs: [{ cue: emoji picture to help remember, th: Thai meaning, sentences: [...] }]
     {NAME} / {SCHOOL} inside a sentence = shown as a ⭐ blank, NOT read aloud.
       The site is public, so the real full name and school are never written in this file.
       Summer says these parts himself.

   Other types (words, reading, checklist …) — ask Claude to add them when that homework arrives.
   ========================================================= */
window.BLANKS = {
  NAME:   { th: 'ชื่อจริงของหนู', en: 'your full name' },
  SCHOOL: { th: 'ชื่อโรงเรียนของหนู', en: 'your school' },
};

window.HOMEWORK = [
  {
    id: 'speech-wonderful-day',
    type: 'speech',
    emoji: '🎤',
    color: '#e0457a',
    th: 'สุนทรพจน์ภาษาอังกฤษ',
    en: 'A Wonderful Day with My Family',
    paragraphs: [
      { cue: '🌞', th: 'เปิดเรื่อง แนะนำตัว', sentences: [
        'What makes a day wonderful?',
        'For me, it’s spending time with my family.',
        'Good morning, judges, teachers, and friends.',
        'My name is {NAME}, but you can call me Summer.',
        'I am six years old.',
        'I’m in Kindergarten 3, and I study at {SCHOOL}.',
        'Today, I will tell you about a wonderful day with my family.',
      ] },
      { cue: '🚗', th: 'ชอบของเล่น เล่นรถกับป๊า', sentences: [
        'I love toys!',
        'I used to play with Hot Wheels cars with my dad.',
        'Zoom! Zoom!',
      ] },
      { cue: '🧪', th: 'ซื้อกล่องสุ่ม เขย่าหลอดทดลอง', sentences: [
        'One weekend, we went to the toy store and got a MrBeast Lab mystery box.',
        'Inside was a little test tube.',
        'Dad helped me put water in it and shake it.',
        'Shake, shake, shake!',
        'I hoped to get a rare toy.',
      ] },
      { cue: '💪', th: 'ได้ Muscle Sword ของเล่นตัวโปรด', sentences: [
        'When we opened it, we found a special edition toy, Muscle Sword.',
        'Wow!',
        'I was so happy!',
        'It is now my favorite toy.',
      ] },
      { cue: '📱', th: 'ป๊าทำแอปบอกชื่อของเล่น', sentences: [
        'At home, my dad made an app.',
        'We took a photo of my toy, and the app told us its name.',
        'My dad is so clever!',
      ] },
      { cue: '🏃', th: 'ครอบครัวมางานโรงเรียน', sentences: [
        'But toys are not the only things that make me happy.',
        'I also feel happy when my family joins me for school activities, like Sports Day, our Project Approach activities, and festivals.',
      ] },
      { cue: '👴', th: 'ไปหาปู่ย่าตายาย', sentences: [
        'I love visiting my grandparents, too.',
        'It makes me happy when our big family is together!',
      ] },
      { cue: '❤️', th: 'ปิดเรื่อง ครอบครัวอยู่กับเราเสมอ', sentences: [
        'That was a wonderful day with my family.',
        'It helped me understand that my favorite toys may change, but my family is always there for me.',
        'We can make any day special just by being together!',
        'Thank you for listening.',
      ] },
    ],
  },
];
