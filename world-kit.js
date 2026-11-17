/* =========================================================
   world-kit.js — shared 3D building blocks for Summer's World
   Used by index.html (the island) and every 3D activity page,
   so Summer, the colours, sounds and lighting look the same everywhere.

   How to use in a page:
     <script src="world-kit.js"></script>            (classic script — works from file:// too)
     <script type="module">
       import * as THREE from 'three';
       import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
       const kit = WorldKit(THREE, OrbitControls);
       const stage = kit.createStage({ canvas: document.getElementById('world') });
       ...
     </script>
   ========================================================= */
(function () {
  const SAVE_KEY = 'summerWorld.v1';

  window.WorldKit = function (THREE, OrbitControls) {
    const kit = { THREE };

    // ── Shared save data (same key as the island) ──
    kit.loadSave = function () {
      try { return JSON.parse(localStorage.getItem(SAVE_KEY)) || {}; } catch (e) { return {}; }
    };
    kit.writeSave = function (patch) {
      const s = Object.assign(kit.loadSave(), patch);
      try { localStorage.setItem(SAVE_KEY, JSON.stringify(s)); } catch (e) {}
      return s;
    };
    kit.soundOn = () => kit.loadSave().sound !== false;

    // Wire a 🔊/🔇 button to the shared sound setting
    kit.bindSoundButton = function (btn) {
      const show = () => { btn.textContent = kit.soundOn() ? '🔊' : '🔇'; };
      btn.addEventListener('click', () => { kit.writeSave({ sound: !kit.soundOn() }); show(); });
      show();
    };

    // ── Sound: Thai speech + small synth tones ──
    kit.speak = function (text) {
      if (!kit.soundOn() || !('speechSynthesis' in window)) return;
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'th-TH'; u.rate = .9; u.pitch = 1.2;
      speechSynthesis.speak(u);
    };
    let audioCtx = null;
    kit.tones = function (freqs, gap = .09, type = 'triangle', vol = .22) {
      if (!kit.soundOn()) return;
      try {
        audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
        freqs.forEach((f, i) => {
          const o = audioCtx.createOscillator(), g = audioCtx.createGain();
          o.type = type; o.frequency.value = f;
          const t = audioCtx.currentTime + i * gap;
          g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .02);
          g.gain.exponentialRampToValueAtTime(.0001, t + .3);
          o.connect(g).connect(audioCtx.destination); o.start(t); o.stop(t + .35);
        });
      } catch (e) {}
    };
    kit.cheer = () => kit.tones([523, 659, 784, 1047]);

    // ── Voxel helpers: one shared cube geometry + cached materials ──
    const UNIT = new THREE.BoxGeometry(1, 1, 1);
    const matCache = {};
    kit.UNIT = UNIT;
    kit.mat = color => matCache[color] || (matCache[color] = new THREE.MeshLambertMaterial({ color }));
    kit.box = function (parent, w, h, d, color, x, y, z, shadows = true) {
      const m = new THREE.Mesh(UNIT, kit.mat(color));
      m.scale.set(w, h, d); m.position.set(x, y, z);
      m.castShadow = shadows; m.receiveShadow = true;
      parent.add(m);
      return m;
    };
    kit.shade = (hex, f) => '#' + new THREE.Color(hex).multiplyScalar(f).getHexString();

    // ── Canvas sprites (always face the camera) ──
    function roundRectPath(g, x, y, w, h, r) {
      g.beginPath();
      g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
      g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
    }
    function spriteFromCanvas(c, height) {
      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false, transparent: true }));
      s.scale.set(height * c.width / c.height, height, 1);
      s.renderOrder = 10;
      return s;
    }
    kit.labelSprite = function (text, height = .62, colors = {}) {
      const c = document.createElement('canvas'), g = c.getContext('2d');
      const font = '700 56px "Noto Sans Thai","Fredoka",sans-serif';
      g.font = font;
      const w = Math.ceil(g.measureText(text).width) + 56;
      c.width = w + 8; c.height = 96;
      g.font = font;
      g.fillStyle = 'rgba(0,0,0,.12)'; roundRectPath(g, 4, 12, w, 80, 40); g.fill();
      g.fillStyle = colors.bg || '#fff'; roundRectPath(g, 0, 4, w, 80, 40); g.fill();
      g.fillStyle = colors.fg || '#3b2a1a'; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText(text, w / 2, 46);
      return spriteFromCanvas(c, height);
    };
    kit.emojiSprite = function (emoji, ring, height = 1) {
      const c = document.createElement('canvas'), g = c.getContext('2d');
      c.width = c.height = 128;
      if (ring) {
        g.fillStyle = '#fff'; g.beginPath(); g.arc(64, 64, 58, 0, Math.PI * 2); g.fill();
        g.lineWidth = 8; g.strokeStyle = ring; g.stroke();
      }
      g.font = `${ring ? 64 : 100}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`;
      g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText(emoji, 64, 70);
      return spriteFromCanvas(c, height);
    };

    // ── Summer: voxel boy in a yellow racing suit and helmet ──
    kit.makeSummer = function () {
      const box = kit.box;
      const Y = '#ffd23f', Ysh = '#e8b417', K = '#2b2118', S = '#ffd9bf';
      const g = new THREE.Group(), body = new THREE.Group();
      g.add(body);
      const limb = (x, y) => { const p = new THREE.Group(); p.position.set(x, y, 0); body.add(p); return p; };
      const legL = limb(-.1, .42), legR = limb(.1, .42);
      [legL, legR].forEach(l => { box(l, .15, .36, .17, Ysh, 0, -.18, 0); box(l, .18, .1, .25, K, 0, -.37, .03); });
      box(body, .44, .44, .3, Y, 0, .64, 0);                           // racing suit
      box(body, .45, .07, .31, Ysh, 0, .45, 0);                        // belt
      box(body, .045, .44, .31, K, -.2, .64, 0, false);                // side stripes
      box(body, .045, .44, .31, K, .2, .64, 0, false);
      const num = document.createElement('canvas'); num.width = num.height = 64;
      const n = num.getContext('2d');
      n.fillStyle = '#fff'; n.beginPath(); n.arc(32, 32, 30, 0, 7); n.fill();
      n.fillStyle = '#e63946'; n.font = '900 46px Fredoka, sans-serif'; n.textAlign = 'center'; n.textBaseline = 'middle'; n.fillText('1', 32, 35);
      const numTex = new THREE.CanvasTexture(num); numTex.colorSpace = THREE.SRGBColorSpace;
      const badge = new THREE.Mesh(new THREE.PlaneGeometry(.2, .2), new THREE.MeshLambertMaterial({ map: numTex, transparent: true }));
      badge.position.set(0, .68, .156); body.add(badge);
      const armL = limb(-.28, .8), armR = limb(.28, .8);
      [armL, armR].forEach(a => { box(a, .13, .34, .15, Y, 0, -.15, 0); box(a, .15, .13, .17, K, 0, -.34, 0); });
      // helmet with open face and flipped-up visor
      const head = new THREE.Group(); head.position.y = 1.12; body.add(head);
      box(head, .6, .54, .56, Y, 0, 0, 0);
      box(head, .62, .07, .58, Ysh, 0, -.25, 0);
      box(head, .13, .05, .58, K, 0, .28, 0, false);
      box(head, .13, .5, .05, K, 0, 0, -.29, false);
      box(head, .42, .27, .04, S, 0, -.05, .29, false);                // face
      const eyes = [-.09, .09].map(ex => box(head, .055, .07, .02, K, ex, -.02, .31, false));
      [-.16, .16].forEach(ex => box(head, .06, .035, .02, '#ff9aa8', ex, -.1, .31, false));
      box(head, .09, .025, .02, K, 0, -.13, .31, false);
      box(head, .54, .12, .09, '#34495e', 0, .15, .29, false);         // visor
      box(head, .15, .025, .02, '#ffffff', -.12, .17, .34, false);
      g.scale.setScalar(1.15);
      g.traverse(o => { o.userData.isSummer = true; });
      return { g, body, head, legL, legR, armL, armR, eyes };
    };
    // Walk / idle / cheer animation — call every frame
    kit.poseSummer = function (s, time, mode = 'idle') {
      const walking = mode === 'walk';
      const swing = walking ? Math.sin(time * 12) * .7 : 0;
      s.body.position.y = walking ? Math.abs(Math.sin(time * 12)) * .06 : Math.sin(time * 2) * .015;
      s.legL.rotation.x = swing; s.legR.rotation.x = -swing;
      if (mode === 'cheer') {
        s.armL.rotation.z = -2.6 + Math.sin(time * 10) * .3; s.armR.rotation.z = 2.6 - Math.sin(time * 10) * .3;
        s.armL.rotation.x = s.armR.rotation.x = 0;
      } else {
        s.armL.rotation.z = s.armR.rotation.z = 0;
        s.armL.rotation.x = -swing * .8; s.armR.rotation.x = swing * .8;
      }
      const blink = time % 4 < .12 ? .15 : 1;
      s.eyes.forEach(e => { e.scale.y = .07 * blink; });
    };

    // ── Stage: renderer + camera + orbit controls + warm sunlight ──
    kit.createStage = function ({ canvas, fog = null, shadowSize = 26 }) {
      const small = Math.min(innerWidth, innerHeight) < 700;
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(devicePixelRatio, small ? 1.5 : 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      const scene = new THREE.Scene();
      if (fog) scene.fog = new THREE.Fog(fog, 55, 110);
      const camera = new THREE.PerspectiveCamera(35, innerWidth / innerHeight, .1, 500);
      const controls = new OrbitControls(camera, canvas);
      controls.enablePan = false;
      controls.enableDamping = true; controls.dampingFactor = .08;
      controls.rotateSpeed = .6;
      controls.touches = { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_ROTATE };
      const hemi = new THREE.HemisphereLight(0xfff4d6, 0xc9a46a, 1.25);
      scene.add(hemi);
      const sun = new THREE.DirectionalLight(0xffffff, 1.7);
      sun.position.set(18, 32, 14);
      sun.castShadow = true;
      sun.shadow.mapSize.set(small ? 1024 : 2048, small ? 1024 : 2048);
      Object.assign(sun.shadow.camera, { left: -shadowSize, right: shadowSize, top: shadowSize, bottom: -shadowSize, near: 1, far: 120 });
      sun.shadow.bias = -.0005; sun.shadow.normalBias = .03;
      scene.add(sun, sun.target);
      function resize() {
        renderer.setSize(innerWidth, innerHeight, false);
        camera.aspect = innerWidth / innerHeight;
        camera.fov = innerWidth < innerHeight ? 45 : 35;   // portrait phones see a bit wider
        camera.updateProjectionMatrix();
      }
      addEventListener('resize', resize);
      resize();
      const clock = new THREE.Clock();
      return {
        renderer, scene, camera, controls, sun, hemi, small,
        // fn(dt, time) runs every frame before rendering
        start(fn) {
          renderer.setAnimationLoop(() => {
            const dt = Math.min(.05, clock.getDelta());
            fn(dt, clock.elapsedTime);
            controls.update();
            renderer.render(scene, camera);
          });
        },
      };
    };

    // Smoothly move the camera + orbit target (e.g. when switching modes)
    kit.flyTo = function (stage, pos, target, ms = 900) {
      const p0 = stage.camera.position.clone(), t0 = stage.controls.target.clone(), start = performance.now();
      const step = () => {
        const k = Math.min(1, (performance.now() - start) / ms), e = k * k * (3 - 2 * k);
        stage.camera.position.lerpVectors(p0, pos, e);
        stage.controls.target.lerpVectors(t0, target, e);
        if (k < 1) requestAnimationFrame(step);
      };
      step();
    };

    // Project a 3D point to screen pixels
    const v3 = new THREE.Vector3();
    kit.toScreen = function (camera, x, y, z) {
      v3.set(x, y, z).project(camera);
      return { x: (v3.x + 1) / 2 * innerWidth, y: (1 - v3.y) / 2 * innerHeight };
    };

    // ── Effects ──
    // Confetti cubes: const fx = kit.createConfetti(scene); fx.burst(x,y,z); fx.update(dt) every frame
    kit.createConfetti = function (scene) {
      const bits = [];
      return {
        burst(x, y, z, colors = ['#ffd23f', '#ff8fbf', '#9fe8da', '#ffffff'], count = 18) {
          for (let i = 0; i < count; i++) {
            const m = kit.box(scene, .14, .14, .14, colors[i % colors.length], x, y, z, false);
            const a = Math.random() * Math.PI * 2, sp = 2 + Math.random() * 2;
            bits.push({ m, vx: Math.cos(a) * sp, vy: 4 + Math.random() * 3, vz: Math.sin(a) * sp, life: 1.4 });
          }
        },
        update(dt) {
          for (let i = bits.length - 1; i >= 0; i--) {
            const b = bits[i];
            b.vy -= 12 * dt;
            b.m.position.x += b.vx * dt; b.m.position.y += b.vy * dt; b.m.position.z += b.vz * dt;
            b.m.rotation.x += dt * 6; b.life -= dt;
            if (b.life <= 0) { scene.remove(b.m); bits.splice(i, 1); }
          }
        },
      };
    };
    // Floating pastel cubes around the scene (the island's sky look)
    kit.createFloaters = function (scene, { count = 30, radius = 18, spread = 16, y0 = -4 } = {}) {
      const colors = ['#ffb3c8', '#ffd166', '#9fe8da', '#ffffff', '#b8a4ff', '#ff9f7a'];
      const list = [];
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2, dist = radius + Math.random() * spread;
        const m = kit.box(scene, 1, 1, 1, colors[i % colors.length], Math.cos(a) * dist, y0 + Math.random() * 20, Math.sin(a) * dist, false);
        m.scale.setScalar(.25 + Math.random() * .45);
        list.push({ m, base: m.position.y, ph: Math.random() * 6, spin: .2 + Math.random() * .6 });
      }
      const group = { list, update(dt, time) {
        list.forEach(f => {
          f.m.position.y = f.base + Math.sin(time * .6 + f.ph) * .6;
          f.m.rotation.x += dt * f.spin; f.m.rotation.y += dt * f.spin * .7;
        });
      }, setVisible(v) { list.forEach(f => { f.m.visible = v; }); } };
      return group;
    };
    // Star field (for space / moon scenes)
    kit.createStars = function (scene, count = 600, radius = 150) {
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const v = new THREE.Vector3().randomDirection().multiplyScalar(radius * (.6 + Math.random() * .4));
        pos.set([v.x, Math.abs(v.y) * .9 + 5, v.z], i * 3);
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const pts = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xffffff, size: 1.6, transparent: true, opacity: 1, fog: false }));
      scene.add(pts);
      return pts;
    };

    // ── Page transitions ──
    // Fade to the island colour, then go (used by "กลับเกาะ" and building doors)
    kit.fadeTo = function (href, ms = 450) {
      let f = document.querySelector('.w-fade-out');
      if (!f) { f = document.createElement('div'); f.className = 'w-fade-out'; document.body.appendChild(f); }
      requestAnimationFrame(() => f.classList.add('on'));
      setTimeout(() => { location.href = href; }, ms);
    };
    // Make every link marked data-fade use the fade
    kit.bindFadeLinks = function () {
      document.querySelectorAll('a[data-fade]').forEach(a => a.addEventListener('click', e => {
        e.preventDefault(); kit.fadeTo(a.getAttribute('href'));
      }));
    };

    // ── Thai baht coins (used by thai_money.html + pay_money.html) ──
    // Colours follow the real coins: 1฿ silver (small), 2฿ gold, 5฿ silver (big), 10฿ gold centre + silver ring.
    kit.COINS = {
      1:  { th: 'เหรียญหนึ่งบาท', thai: '๑',  r: .55, face: '#d9dde3', rim: '#b7bec8', ink: '#5b6472', color: 'สีเงิน', size: 'เล็กที่สุด' },
      2:  { th: 'เหรียญสองบาท',  thai: '๒',  r: .6,  face: '#f2cf63', rim: '#d4a73a', ink: '#7a5a12', color: 'สีทอง',  size: 'เล็ก' },
      5:  { th: 'เหรียญห้าบาท',  thai: '๕',  r: .68, face: '#d9dde3', rim: '#a9b0bb', ink: '#5b6472', color: 'สีเงิน', size: 'ใหญ่' },
      10: { th: 'เหรียญสิบบาท',  thai: '๑๐', r: .75, face: '#f2cf63', rim: '#d9dde3', ink: '#7a5a12', color: 'สองสี ทองกับเงิน', size: 'ใหญ่ที่สุด' },
    };
    const coinTextures = {};
    function coinFace(value) {
      if (coinTextures[value]) return coinTextures[value];
      const C = kit.COINS[value], c = document.createElement('canvas');
      c.width = c.height = 256;
      const g = c.getContext('2d');
      g.fillStyle = C.rim; g.fillRect(0, 0, 256, 256);
      g.fillStyle = C.face; g.beginPath(); g.arc(128, 128, value === 10 ? 92 : 112, 0, Math.PI * 2); g.fill();
      g.strokeStyle = C.ink; g.globalAlpha = .35; g.lineWidth = 4; g.beginPath(); g.arc(128, 128, 104, 0, Math.PI * 2); g.stroke(); g.globalAlpha = 1;
      g.fillStyle = C.ink; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.translate(128, 128); g.rotate(-Math.PI / 2); g.translate(-128, -128);   // the cylinder cap maps the canvas turned 90°
      g.font = `900 ${value === 10 ? 92 : 112}px "Noto Sans Thai", sans-serif`; g.fillText(C.thai, 128, 112);
      g.font = '700 40px Fredoka, sans-serif'; g.fillText(value + ' บาท', 128, 196);
      const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
      return (coinTextures[value] = tex);
    }
    // Returns a coin lying flat (face up). Rotate .x by π/2 to stand it up facing +z.
    kit.makeCoin = function (value, scale = 1) {
      const C = kit.COINS[value], r = C.r * scale;
      const face = new THREE.MeshBasicMaterial({ map: coinFace(value) });   // unlit: the face stays shiny and readable
      const edge = new THREE.MeshLambertMaterial({ color: C.rim });
      const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, .12 * scale, 40), [edge, face, face]);
      m.castShadow = true;
      m.userData.coin = value;
      return m;
    };

    return kit;
  };
})();
