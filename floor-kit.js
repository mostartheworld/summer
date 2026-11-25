/* =========================================================
   floor-kit.js — shared parts for the lift and the game floors
   (lift.html, maze.html, runner.html, space.html)

     <script src="world-kit.js"></script>
     <script src="floor-kit.js"></script>
     const fk = FloorKit(kit);
     fk.mathGate(() => …)            a Grade-1 sum must be right before a game starts
     fk.chooser({ cats, … })         dress-up / build tray
     fk.hud() · fk.result({ … })     hearts, score, end card
     fk.warpTo(href)                 white flash, then the next floor
     fk.exit(n)                      🛗 ออก button (top left) + pause card; check fk.paused in the game loop
     fk.liftDoor()                   3D lift door to put in a scene; fk.tapDoor(...) makes it tappable
     fk.doorsTo(href) / fk.arrive()  steel lift doors close / open between pages

   To add a floor: add one entry to FLOORS (the lift buttons and What's New read it).
   Saved in localStorage "summer_floors_v1": { whatsNew: '1.0', best: { maze, runner, space } }
   ========================================================= */
(function () {
  window.FLOORS = [
    { n: 1, href: 'index.html?floor=1', emoji: '🏠', th: 'บ้านของ Summer', en: 'HOUSES', color: '#2fb36a', news: 'บ้านและเกมเดิมทั้งหมดอยู่ที่นี่' },
    { n: 2, href: 'maze.html',   emoji: '🌀', th: 'เขาวงกต',     en: 'MAZE',   color: '#8a5cc9', news: 'แต่งหุ่นยนต์ แล้วเดินเขาวงกตที่ไม่ซ้ำกันเลย' },
    { n: 3, href: 'runner.html', emoji: '🏃', th: 'วิ่งกระโดด',  en: 'RUNNER', color: '#e3793a', news: 'แต่งชุด แล้ววิ่งกระโดดข้ามมอนสเตอร์บล็อก' },
    { n: 4, href: 'space.html',  emoji: '🚀', th: 'ตะลุยอวกาศ', en: 'SPACE',  color: '#3f7cc9', news: 'สร้างยานเอง แล้วบินหลบอุกกาบาต' },
  ];
  const KEY = 'summer_floors_v1';
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } };
  const write = patch => { const s = Object.assign(load(), patch); try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} return s; };
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const pick = list => list[Math.floor(Math.random() * list.length)];

  // Grade-1 sums: + and − with every number from 0 to 20 (answers are never negative)
  function makeSum(last) {
    let q;
    do {
      const plus = Math.random() < .5;
      if (plus) { const a = 1 + Math.floor(Math.random() * 15), b = 1 + Math.floor(Math.random() * Math.min(9, 20 - a)); q = { a, b, op: '+', ans: a + b }; }
      else { const a = 2 + Math.floor(Math.random() * 18), b = 1 + Math.floor(Math.random() * Math.min(9, a)); q = { a, b, op: '−', ans: a - b }; }
    } while (last && last.a === q.a && last.b === q.b && last.op === q.op);
    return q;
  }

  window.FloorKit = function (kit) {
    const fk = { load, write, el, pick, makeSum };

    // ── Best scores ──
    fk.best = id => (load().best || {})[id] || 0;
    fk.saveBest = function (id, value) {            // returns true when it's a new record
      const best = load().best || {};
      if (value <= (best[id] || 0)) return false;
      best[id] = value; write({ best });
      return true;
    };

    // ── Warp light ──
    fk.warpTo = function (href, ms = 950) {
      const w = el('div', 'f-warp'); document.body.appendChild(w);
      requestAnimationFrame(() => requestAnimationFrame(() => w.classList.add('on')));
      kit.tones([330, 440, 587, 784, 1047, 1397], .11, 'sine', .2);
      setTimeout(() => { location.href = href; }, ms);
    };
    fk.warpIn = function () {
      const w = el('div', 'f-warp arrive'); document.body.appendChild(w);
      setTimeout(() => w.remove(), 1100);
    };
    // Coming back with the browser's Back button can restore the page under a white flash → clear it
    addEventListener('pageshow', e => { if (e.persisted) document.querySelectorAll('.f-warp, .w-fade-out, .f-doors').forEach(w => w.remove()); });

    // ── Steel lift doors across the screen ──
    const doors = cls => { const d = el('div', 'f-doors ' + cls, '<i></i><i></i>'); document.body.appendChild(d); return d; };
    fk.doorsTo = function (href) {
      if (document.querySelector('.f-doors.close')) return;   // already leaving
      doors('close'); kit.tones([659, 523], .18, 'sine', .2);
      setTimeout(() => { location.href = href; }, 900);
    };
    fk.doorsIn = function (cls) { const d = doors(cls); setTimeout(() => d.remove(), 1300); };   // 'open' = slide apart, 'fade' = fade away
    // Arriving on a floor by lift: the doors slide open with light behind them
    fk.markRide = () => { try { sessionStorage.setItem('summerWorld.ride', '1'); } catch (e) {} };
    fk.arrive = function () {
      try { if (sessionStorage.getItem('summerWorld.ride') !== '1') return; sessionStorage.removeItem('summerWorld.ride'); } catch (e) { return; }
      fk.doorsIn('open'); kit.tones([784, 1047], .14, 'sine', .16);
    };

    // ── Way out: the same 🛗 ออก button on every game floor; it pauses the game and asks first ──
    fk.paused = false;
    let exitCard = null;
    fk.closeExit = function () { if (exitCard) exitCard.remove(); exitCard = null; fk.paused = false; };
    fk.exit = function (n) {
      fk.floor = n;
      const b = el('button', 'w-pill f-exit', '🛗 <span>ออก</span>'); b.title = 'ออกไปลิฟต์ Exit to the lift';
      b.onclick = fk.askExit;
      document.querySelector('.w-top').prepend(b);
      fk.arrive();
    };
    fk.askExit = function () {
      if (exitCard) return;
      fk.paused = true; kit.tones([523], .1);
      document.querySelectorAll('.f-pad.held').forEach(p => p.dispatchEvent(new Event('pointercancel')));
      exitCard = fk.result({
        emoji: '🛗', title: 'ออกจากชั้น ' + fk.floor + ' ไหม?', lines: ['เกมหยุดรออยู่นะ'],
        buttons: [
          { text: '▶ เล่นต่อ', fn: fk.closeExit },
          { text: '🛗 กลับลิฟต์', white: true, fn: () => fk.doorsTo('lift.html?from=' + fk.floor) },
          { text: '🏝️ กลับเกาะ', white: true, fn: () => kit.fadeTo('index.html?floor=1') },
        ],
      });
      kit.speak('ออกไปลิฟต์ไหม หรือเล่นต่อ');
    };
    fk.toLift = () => fk.doorsTo('lift.html?from=' + fk.floor);
    // While the card is open the game must not hear the keyboard (Escape = open / keep playing)
    addEventListener('keydown', e => {
      if (e.key === 'Escape' && fk.floor) { exitCard ? fk.closeExit() : fk.askExit(); e.stopImmediatePropagation(); }
      else if (exitCard) e.stopImmediatePropagation();
    }, true);

    // ── 3D lift door, 1 wide × 1.5 tall, facing +z ──
    fk.liftDoor = function (scale = 1, text = '🛗 ทางออก') {
      const { THREE, box } = kit, g = new THREE.Group();
      box(g, 1.1, 1.6, .16, '#f59e0b', 0, .8, -.06);
      box(g, .86, 1.36, .06, '#dfe6ee', 0, .7, .03);
      [-.21, .21].forEach(x => { box(g, .4, 1.32, .05, '#f2f6fa', x, .69, .06, false); box(g, .22, .7, .02, '#9fd4ee', x, .82, .09, false); });
      box(g, .03, 1.32, .06, '#8e98a6', 0, .69, .07, false);
      box(g, .5, .16, .04, '#1c2233', 0, 1.49, .04, false);
      [-.15, -.05, .05, .15].forEach((x, i) => box(g, .06, .07, .02, i + 1 === fk.floor ? '#ffd23f' : '#5b6a86', x, 1.49, .07, false));
      const sign = kit.labelSprite(text, .34, { bg: '#f59e0b', fg: '#ffffff' }); sign.position.set(0, 1.85, .05); g.add(sign);
      g.scale.setScalar(scale);
      g.traverse(o => { o.userData.liftDoor = true; });
      return g;
    };
    // Tap the door (while active() is true) → ask to leave
    fk.tapDoor = function (canvas, camera, door, active) {
      const ray = new kit.THREE.Raycaster(); let p0 = null;
      canvas.addEventListener('pointerdown', e => { p0 = [e.clientX, e.clientY]; });
      canvas.addEventListener('pointerup', e => {
        if (!p0 || fk.paused || !active() || Math.hypot(e.clientX - p0[0], e.clientY - p0[1]) > 12) return;
        ray.setFromCamera(new kit.THREE.Vector2(e.clientX / innerWidth * 2 - 1, 1 - e.clientY / innerHeight * 2), camera);
        if (ray.intersectObject(door, true).length) fk.askExit();
      });
    };

    // ── Maths gate: type the answer; a wrong answer shows a counting picture and you try again ──
    let gate = null;
    fk.mathGate = function (onPass) {
      let q = makeSum(), typed = '', locked = false;
      gate = el('div', 'f-gate show', `
        <div class="w-card">
          <h2>🔢 ตอบเลขก่อนเข้าเกม</h2>
          <div class="tip">Solve it to open the door</div>
          <div class="f-sum"><span class="q"></span><div class="f-answer"></div></div>
          <div class="f-hint"></div>
          <div class="f-keys"></div>
          <button class="helpBtn">💡 ดูรูปช่วยนับ</button>
        </div>`);
      document.body.appendChild(gate);
      const $ = s => gate.querySelector(s);
      const say = () => kit.speak(`${q.a} ${q.op === '+' ? 'บวก' : 'ลบ'} ${q.b} เท่ากับเท่าไร`);
      const show = () => { $('.q').textContent = `${q.a} ${q.op} ${q.b} =`; $('.f-answer').textContent = typed || '?'; };
      // Pictures to count, in groups of ten; for − the ones taken away are crossed out
      const hint = () => {
        const item = (cls, e, i) => `<i class="${cls}${(i + 1) % 10 === 0 ? ' ten' : (i + 1) % 5 === 0 ? ' ten' : ''}">${e}</i>`;
        let html = '';
        if (q.op === '+') {
          for (let i = 0; i < q.a; i++) html += item('', '🍎', i);
          html += '<br>➕<br>';
          for (let i = 0; i < q.b; i++) html += item('', '🍏', i);
        } else for (let i = 0; i < q.a; i++) html += item(i >= q.a - q.b ? 'gone' : '', '🍎', i);
        $('.f-hint').innerHTML = html;
      };
      const type = d => { if (locked || typed.length >= 2) return; typed = (typed === '0' ? '' : typed) + d; show(); kit.tones([520 + d * 30], .05, 'triangle', .12); };
      const del = () => { if (locked) return; typed = typed.slice(0, -1); show(); };
      const submit = () => {
        if (locked || !typed) return;
        if (+typed === q.ans) {
          locked = true;
          $('.f-answer').style.cssText = 'background:#e3f8ea;border-color:#2fb36a;color:#1f8a4f';
          $('.tip').textContent = '✅ ถูกต้อง! เก่งมาก'; kit.cheer(); kit.speak('ถูกต้อง เก่งมาก');
          removeEventListener('keydown', onKey);
          setTimeout(() => { gate.remove(); gate = null; onPass(); }, 1100);
        } else {
          typed = ''; show(); hint();
          $('.tip').textContent = 'เกือบแล้ว! ลองนับรูปดูนะ 💪';
          gate.classList.remove('wrong'); void gate.offsetWidth; gate.classList.add('wrong');
          kit.tones([300, 260], .12); kit.speak('ลองใหม่นะ');
        }
      };
      const onKey = e => {
        if (/^[0-9]$/.test(e.key)) type(+e.key);
        else if (e.key === 'Backspace') del();
        else if (e.key === 'Enter') submit();
        else return;
        e.preventDefault();
      };
      addEventListener('keydown', onKey);
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 'del', 0, 'ok'].forEach(k => {
        const b = el('button', typeof k === 'string' ? k : '', k === 'del' ? '⌫' : k === 'ok' ? 'ตอบ ✓' : k);
        b.setAttribute('aria-label', k === 'del' ? 'ลบ Delete' : k === 'ok' ? 'ตอบ Answer' : k);
        b.onclick = () => k === 'del' ? del() : k === 'ok' ? submit() : type(k);
        $('.f-keys').appendChild(b);
      });
      $('.helpBtn').onclick = hint;
      show(); setTimeout(say, 500);
      fk._gate = { q: () => q, type, submit };   // for tests
    };

    // ── Dress-up / build tray ──
    // cats: [{ id, th, emoji, options: [{ id, th, emoji | color }] }]; every category must be picked before "done" works
    fk.chooser = function ({ cats, value = {}, onPick, onComplete, onDone, doneText }) {
      const tray = el('div', 'f-tray show'), tabs = el('div', 'f-cats'), opts = el('div', 'f-opts'), done = el('button', 'w-btn big', doneText);
      tray.append(tabs, opts, done);
      document.body.appendChild(tray);
      let cur = cats[0].id, completed = false;
      const full = () => cats.every(c => value[c.id]);
      function draw() {
        tabs.innerHTML = ''; opts.innerHTML = '';
        cats.forEach(c => {
          const b = el('button', (c.id === cur ? 'on ' : '') + (value[c.id] ? 'done' : ''), `<span class="em">${c.emoji}</span>${c.th}`);
          b.onclick = () => { cur = c.id; draw(); };
          tabs.appendChild(b);
        });
        cats.find(c => c.id === cur).options.forEach(o => {
          const b = el('button', value[cur] === o.id ? 'on' : '', (o.color ? `<span class="dot" style="background:${o.color}"></span>` : `<span class="em">${o.emoji}</span>`) + o.th);
          b.onclick = () => choose(cur, o.id);
          opts.appendChild(b);
        });
        done.disabled = !full();
      }
      function choose(cat, id) {
        const first = !value[cat];
        value[cat] = id; kit.tones([660, 880], .06);
        onPick(cat, id, value);
        if (full() && !completed) { completed = true; if (onComplete) onComplete(value); }
        else if (first) { const next = cats.find(c => !value[c.id]); if (next) cur = next.id; }   // move on to the next empty part
        draw();
      }
      done.onclick = () => { if (full()) { tray.classList.remove('show'); onDone(value); } };
      draw();
      return { value, choose, show: v => tray.classList.toggle('show', v), done: () => done.click() };
    };

    // On phones held sideways the tray sits on the right, so pages move their camera aside
    fk.sideTray = () => innerHeight < 560 && innerWidth > innerHeight;

    // ── HUD: hearts left, big number in the middle, score right ──
    fk.hud = function (label) {
      const h = el('div', 'f-hud', `<div class="box hearts"></div><div class="box main"><b>0</b><span>${label}</span></div><div class="box score"></div>`);
      document.body.appendChild(h);
      return {
        show(v) { h.classList.toggle('show', v); document.body.classList.toggle('f-playing', v); },
        set(hearts, main, score) {
          const put = (s, t) => { const e = h.querySelector(s); if (e.innerHTML !== String(t)) e.innerHTML = t; };
          put('.hearts', hearts); put('.main b', main); put('.score', score);
        },
      };
    };

    // ── End card ──  buttons: [{ text, white, fn }]
    fk.result = function ({ emoji, title, lines, buttons }) {
      const bg = el('div', 'w-modal-bg show f-result', `<div class="w-card"><div class="em">${emoji}</div><h2>${title}</h2><div class="lines">${lines.map(l => `<div>${l}</div>`).join('')}</div><div class="btns"></div></div>`);
      buttons.forEach(b => { const x = el('button', 'w-btn' + (b.white ? ' white' : ''), b.text); x.onclick = () => { bg.remove(); b.fn(); }; bg.querySelector('.btns').appendChild(x); });
      document.body.appendChild(bg);
      return bg;
    };

    // ── Buttons that can be held down ──
    fk.hold = function (btn, down, up) {
      btn.addEventListener('pointerdown', e => { e.preventDefault(); btn.classList.add('held'); down(); });
      ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => btn.addEventListener(ev, () => { btn.classList.remove('held'); if (up) up(); }));
      btn.addEventListener('contextmenu', e => e.preventDefault());
    };

    const cap = document.getElementById('caption'), ban = document.getElementById('banner');
    let capT, banT;
    fk.caption = (t, ms = 2600) => { if (!cap) return; cap.textContent = t; cap.classList.add('show'); clearTimeout(capT); capT = setTimeout(() => cap.classList.remove('show'), ms); };
    fk.banner = (t, ms = 1600) => { if (!ban) return; ban.textContent = t; ban.classList.add('show'); clearTimeout(banT); banT = setTimeout(() => ban.classList.remove('show'), ms); };
    return fk;
  };
})();
