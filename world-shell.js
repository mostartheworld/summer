/* =========================================================
   world-shell.js — wraps a reading/quiz page in the island look
   - removes the long .site-nav and adds the "🏝️ กลับเกาะ" top bar
   - paints the warm yellow sky + a small 3D island with Summer behind the page
   - fades in on arrival, fades out when going back to the island
   The page's own content and JavaScript are left untouched.

   Use at the very end of <body> (after the page's own scripts):
     <script src="world-kit.js"></script>
     <script src="world-shell.js" data-emoji="📝" data-title="ตะลุยสาธิต"></script>
   ========================================================= */
(function () {
  const me = document.currentScript;
  const emoji = (me && me.dataset.emoji) || '⭐';
  const title = (me && me.dataset.title) || document.title.replace(/\s*[—·-]\s*(Summer's World|Learn with Summer).*$/i, '');

  // ── Styles (injected so a page needs only the two script tags) ──
  const css = `
  body.w-shell { background: radial-gradient(ellipse at 50% 30%, #ffe9b3 0%, #f6cf7a 100%) fixed !important; }
  body.w-shell .blobs, body.w-shell .stars, body.w-shell .site-nav, body.w-shell .home-link { display: none !important; }   /* the top bar replaces these */
  body.w-shell .page { position: relative; z-index: 1; padding-top: 92px !important; }
  body.w-shell .hero { background: rgba(255,255,255,.82); border-radius: 28px; padding: 18px 16px !important; box-shadow: 0 8px 0 rgba(0,0,0,.06); }
  .w-backdrop { position: fixed; inset: 0; width: 100vw; height: 100vh; z-index: 0; pointer-events: none; }
  .w-shell-top { position: fixed; top: 14px; left: 14px; right: 14px; z-index: 60; display: flex; justify-content: space-between; align-items: center; gap: 8px; pointer-events: none; }
  .w-shell-top > * { pointer-events: auto; }
  .w-shell-top a, .w-shell-top div {
    background: #fff; border-radius: 999px; min-height: 56px; padding: 0 18px;
    display: flex; align-items: center; gap: 6px; box-shadow: 0 6px 0 rgba(0,0,0,.08);
    text-decoration: none; color: #3b2a1a; font-family: 'Fredoka','Noto Sans Thai',sans-serif; font-size: 18px; font-weight: 700;
  }
  .w-shell-top a:active { transform: translateY(3px); box-shadow: 0 3px 0 rgba(0,0,0,.08); }
  .w-shell-top .t { color: #f59e0b; font-weight: 900; font-size: 19px; pointer-events: none; max-width: 55vw; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
  .w-shell-top .menu { width: 56px; padding: 0; justify-content: center; font-size: 22px; }
  @media (max-width: 480px) { .w-shell-top .back span { display: none; } .w-shell-top .t { font-size: 16px; } }
  .w-shell-fade { position: fixed; inset: 0; z-index: 100; background: #ffe9b3; pointer-events: none; opacity: 1; transition: opacity .5s; }`;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
  document.body.classList.add('w-shell');

  // ── Top bar: back to island · page title · full menu ──
  const top = document.createElement('div');
  top.className = 'w-shell-top';
  top.innerHTML = `<a class="back" href="index.html" title="กลับเกาะ Back to island">🏝️ <span>กลับเกาะ</span></a>
    <div class="t">${emoji} ${title}</div>
    <a class="menu" href="menu.html" title="เมนูทั้งหมด Menu">☰</a>`;
  document.body.appendChild(top);

  // ── Fade in now, fade out when leaving for the island ──
  const fade = document.createElement('div');
  fade.className = 'w-shell-fade';
  document.body.appendChild(fade);
  requestAnimationFrame(() => requestAnimationFrame(() => { fade.style.opacity = 0; }));
  top.querySelector('.back').addEventListener('click', e => {
    e.preventDefault();
    fade.style.opacity = 1;
    setTimeout(() => { location.href = 'index.html'; }, 450);
  });
  addEventListener('pageshow', e => { if (e.persisted) fade.style.opacity = 0; });   // coming back via the browser Back button

  // ── 3D backdrop: a little floating island with Summer (skipped quietly if offline) ──
  const canvas = document.createElement('canvas');
  canvas.className = 'w-backdrop';
  document.body.insertBefore(canvas, document.body.firstChild);

  import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js').then(THREE => {
    const kit = window.WorldKit(THREE, null);
    const { box } = kit;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, .1, 200);
    scene.add(new THREE.HemisphereLight(0xfff4d6, 0xc9a46a, 1.3));
    const sun = new THREE.DirectionalLight(0xffffff, 1.5);
    sun.position.set(10, 20, 12);
    scene.add(sun);

    // The island sits low on the screen so the page's cards stay readable
    const island = new THREE.Group();
    scene.add(island);
    box(island, 9, .5, 9, '#8fd16a', 0, -.25, 0, false);
    box(island, 8.6, 1.2, 8.6, '#d39a5c', 0, -1.1, 0, false);
    box(island, 6.6, 1.2, 6.6, '#b87e47', 0, -2.3, 0, false);
    box(island, 4, 1, 4, '#9b6a3c', 0, -3.4, 0, false);
    box(island, 3, .06, 9, '#f1d9a8', 0, .03, 0, false);                     // little path
    [[-3, -2.8, '#5fb36a'], [3.1, -3, '#ff9eb8'], [-3.2, 2.6, '#3f9a5a'], [3.3, 2.2, '#f2a65a']].forEach(([x, z, c]) => {
      box(island, .35, 1, .35, '#8b5a3c', x, .5, z, false);
      box(island, 1.6, 1.2, 1.6, c, x, 1.6, z, false);
      box(island, 1, .7, 1, kit.shade(c, 1.12), x, 2.5, z, false);
    });
    box(island, .18, 2.2, .18, '#8b5a3c', 1.6, 1.1, 1.2, false);              // signpost with the page emoji
    const sign = kit.emojiSprite(emoji, '#f59e0b', 1.3);
    sign.position.set(1.6, 2.9, 1.2);
    island.add(sign);
    const summer = kit.makeSummer();
    summer.g.position.set(-.6, 0, 1.4);
    island.add(summer.g);
    const floaters = kit.createFloaters(scene, { count: 14, radius: 9, spread: 7, y0: 1 });

    function resize() {
      renderer.setSize(innerWidth, innerHeight, false);
      camera.aspect = innerWidth / innerHeight;
      const portrait = innerWidth < innerHeight;
      camera.fov = portrait ? 50 : 35;
      // portrait: island at the bottom; landscape: island bottom-right
      camera.position.set(portrait ? 0 : -9, 9, 24);
      camera.lookAt(portrait ? 0 : -9, portrait ? 7 : 5, 0);
      camera.updateProjectionMatrix();
    }
    addEventListener('resize', resize);
    resize();

    const clock = new THREE.Clock();
    let time = 0;
    function loop() {
      requestAnimationFrame(loop);
      if (document.hidden) return;
      const dt = Math.min(clock.getDelta(), .05);
      time += dt;
      island.rotation.y = time * .12 + scrollY * .002;   // slow spin, a little extra when scrolling
      island.position.y = Math.sin(time * .8) * .25;
      kit.poseSummer(summer, time, Math.sin(time * .5) > .6 ? 'cheer' : 'idle');
      floaters.update(dt, time);
      renderer.render(scene, camera);
    }
    loop();
  }).catch(() => { canvas.remove(); });   // offline: keep the flat yellow sky
})();
