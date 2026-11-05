/* ==========================================================================
   FLAGSHIP PAVILION LAUNCH WALKTHROUGH — JAVASCRIPT LOGIC
   ========================================================================== */

const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];

// Populate initial images from assets.js
$$('[data-img]').forEach(i => {
  if (typeof IMG !== 'undefined' && IMG[i.dataset.img]) i.src = IMG[i.dataset.img];
});

/* 5 Flagship Pavilion Zones Data */
const ZONES = [
  {
    num: '01',
    kicker: 'ZONE 01 · SENSORY WELCOME',
    title: 'Arrival & Consent Arch',
    sensory: ['🌫️ Cooling Micro-Mist', '🪪 Digital QR Check-In', '🔒 Zero Marketing Spam'],
    desc: 'Guests step through a gentle cooling mist portal, receiving their personalised digital pass and wellness passport. Media consent is collected ethically with separate opt-in.',
    imgKey: 'can',
    thumb: 'portal_arch.png',
    photos: [
      { src: 'portal_arch.png', label: 'Mist Portal' },
      { src: 'light_tunnel.png', label: 'Outdoor Tunnel' }
    ],
    glow: 'radial-gradient(circle, rgba(37,143,118,0.45), transparent 70%)',
    coords: [85, 260],
    short: 'Sensory Welcome & Consent'
  },
  {
    num: '02',
    kicker: 'ZONE 02 · ACOUSTIC THEATER',
    title: 'The Immersive Film Dome',
    sensory: ['🎬 360° Surround Sound', '🎙️ Research Film', '🎞️ Life Doesn’t Wait'],
    desc: 'A curved panoramic dome screening the real-voices research film followed by the emotional hero film. Mirrors the consumer journey from awareness to reflection.',
    imgKey: 'bottle',
    thumb: 'projection_dome.png',
    photos: [
      { src: 'projection_dome.png', label: '360° Dome' },
      { src: 'immersion_screen.png', label: 'Panoramic Screen' }
    ],
    glow: 'radial-gradient(circle, rgba(217,138,155,0.45), transparent 70%)',
    coords: [150, 100],
    short: '360° Cinema & Real Voices'
  },
  {
    num: '03',
    kicker: 'ZONE 03 · PACK & FORMULA REVEAL',
    title: 'Range Discovery Lab',
    sensory: ['⚡ Active Electrolytes', '📦 Life Low-Sodium', '✨ Wellness Collagen'],
    desc: 'Illuminated tactile podiums showcasing ACTIVE aluminium cans, LIFE eco-cartons, and WELLNESS glass bottles with touchable mineral specimens.',
    imgKey: 'carton',
    thumb: 'product_lineup.jpg',
    photos: [
      { src: 'product_lineup.jpg', label: '3-Pillar Family' },
      { src: 'life_carton_turnaround.jpg', label: 'Life Eco-Carton 360°' },
      { src: 'wellness_bottle_turnaround.jpg', label: 'Wellness Bottle 360°' }
    ],
    glow: 'radial-gradient(circle, rgba(37,143,118,0.5), transparent 70%)',
    coords: [275, 220],
    short: '3 Pillars Tactile Lab'
  },
  {
    num: '04',
    kicker: 'ZONE 04 · TASTING FLIGHTS',
    title: 'Functional Sampling Bar',
    sensory: ['🥤 Chilled Flights', '💧 Isotonic Mixology', '🌱 Pure Clean Taste'],
    desc: 'Certified water sommeliers and trained hydration mixologists pour cold electrolyte and mineral mocktail flights with molecular cryo-chill glass frosters.',
    imgKey: 'can',
    thumb: 'bar_counter.png',
    photos: [
      { src: 'bar_counter.png', label: 'Hydration Bar' },
      { src: 'water_sommelier.png', label: 'Sommelier Flights' },
      { src: 'cryo_chill_cocktail.png', label: 'Cryo-Chill Mocktail' },
      { src: 'water_glasses.png', label: 'Chilled Purity' }
    ],
    glow: 'radial-gradient(circle, rgba(217,138,155,0.45), transparent 70%)',
    coords: [385, 100],
    short: 'Chilled Electrolyte Flights'
  },
  {
    num: '05',
    kicker: 'ZONE 05 · INSTANT ACCESS',
    title: 'The QR Vault & Smart Vending',
    sensory: ['⚡ 10-Min Quick-Commerce', '📸 Live Photo Wall', '🤝 Hydration Pledge'],
    desc: 'Interactive scanner walls linked to instant 10-minute doorstep delivery, refrigerated smart vending kiosks, and live sustainability pledge counter.',
    imgKey: 'lineup',
    thumb: 'gym_vending.png',
    photos: [
      { src: 'gym_vending.png', label: 'Smart Vending Kiosk' }
    ],
    glow: 'radial-gradient(circle, rgba(37,143,118,0.5), transparent 70%)',
    coords: [470, 240],
    short: 'Smart Vending & Fast Delivery'
  }
];

let curIdx = 0;
let isAudioOn = true;
let audioCtx = null;
let tourTimer = null;

/* Ambient Sound Synthesizer (Water Ripple & Harmonic Chime) */
function playRippleSound() {
  if (!isAudioOn) return;
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(520 + Math.random() * 180, now);
    osc.frequency.exponentialRampToValueAtTime(1040 + Math.random() * 120, now + 0.18);

    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.55);
  } catch (e) {}
}

/* Render SVG Pins on Architectural Blueprint */
$('#svgPins').innerHTML = ZONES.map((z, i) => `
  <g class="svg-pin ${i === 0 ? 'on' : ''}" data-idx="${i}" transform="translate(${z.coords[0]} ${z.coords[1]})">
    <circle class="c" r="28" fill="#0f5c4a" stroke="#fff" stroke-width="2.5"/>
    <text y="7" text-anchor="middle" font-size="16" fill="#fff" font-weight="700" font-family="Montserrat,sans-serif">${z.num}</text>
    <text y="42" text-anchor="middle" font-size="11" font-weight="700" fill="#16382e" font-family="Montserrat,sans-serif">${z.num} · ${z.title.split('&')[0]}</text>
  </g>
`).join('');

/* Render Sidebar Zone List (Clean, Compact, Minimalist) */
$('#zoneList').innerHTML = ZONES.map((z, i) => `
  <button class="wz-btn ${i === 0 ? 'on' : ''}" data-idx="${i}">
    <span class="wz-num">${z.num}</span>
    <div style="flex-grow:1;">
      <strong>${z.title}</strong>
      <small style="display:block;color:var(--tx-muted);font-size:11px;">${z.short}</small>
    </div>
  </button>
`).join('');

/* Update Stage Viewport to Given Zone */
function setZone(idx) {
  curIdx = (idx + ZONES.length) % ZONES.length;
  const z = ZONES[curIdx];

  // Text & Glow
  if ($('#stageKicker')) $('#stageKicker').textContent = z.kicker;
  if ($('#stageTitle')) $('#stageTitle').textContent = z.title;
  if ($('#stageDesc')) $('#stageDesc').textContent = z.desc;
  if ($('#stageGlow')) $('#stageGlow').style.background = z.glow;

  // Sensory Tags (if present)
  if ($('#stageSensory')) {
    $('#stageSensory').innerHTML = z.sensory.map(s => `<span class="sensory-tag">${s}</span>`).join('');
  }

  // Centerpiece: Real Architectural Photo vs 3D Pedestal
  const photoFrame = $('#stagePhotoFrame');
  const pedestal = $('#stagePedestal');
  const realPhoto = $('#stageRealPhoto');
  const pvt = $('#photoViewToggle');

  if (z.photos && z.photos.length > 0) {
    if (pedestal) pedestal.style.display = 'none';
    if (photoFrame) photoFrame.style.display = 'block';
    if (realPhoto) {
      realPhoto.style.opacity = '0';
      realPhoto.style.transform = 'scale(0.96)';
      setTimeout(() => {
        realPhoto.src = z.photos[0].src;
        realPhoto.alt = z.photos[0].label;
        realPhoto.style.opacity = '1';
        realPhoto.style.transform = 'none';
      }, 150);
    }

    if (z.photos.length > 1 && pvt) {
      pvt.style.display = 'flex';
      pvt.innerHTML = z.photos.map((p, pi) => 
        `<button class="pvt-btn ${pi === 0 ? 'active' : ''}" data-src="${p.src}">${p.label}</button>`
      ).join('');
      $$('.pvt-btn').forEach(btn => {
        btn.onclick = (e) => {
          e.stopPropagation();
          $$('.pvt-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          if (realPhoto) {
            realPhoto.style.opacity = '0';
            setTimeout(() => {
              realPhoto.src = btn.dataset.src;
              realPhoto.style.opacity = '1';
            }, 140);
          }
        };
      });
    } else if (pvt) {
      pvt.style.display = 'none';
    }
  } else {
    if (photoFrame) photoFrame.style.display = 'none';
    if (pedestal) pedestal.style.display = 'grid';
    const imgEl = $('#stagePackImg');
    if (imgEl) {
      imgEl.style.opacity = '0';
      imgEl.style.transform = 'scale(0.9)';
      setTimeout(() => {
        if (typeof IMG !== 'undefined' && IMG[z.imgKey]) {
          imgEl.src = IMG[z.imgKey];
        }
        imgEl.style.opacity = '1';
        imgEl.style.transform = 'none';
      }, 180);
    }
  }

  // Update Controls & Blueprint
  $$('.step-pill').forEach((p, j) => p.classList.toggle('on', curIdx === j));
  $$('.wz-btn').forEach((b, j) => b.classList.toggle('on', curIdx === j));
  $$('.svg-pin').forEach((pin, j) => pin.classList.toggle('on', curIdx === j));

  // Move visitor pin
  if ($('#visPin')) {
    $('#visPin').style.transform = `translate(${z.coords[0]}px, ${z.coords[1] - 38}px)`;
  }

  playRippleSound();
}

// Arrow Nav
$('#prevZoneBtn').onclick = () => setZone(curIdx - 1);
$('#nextZoneBtn').onclick = () => setZone(curIdx + 1);

// Pill Nav
$$('.step-pill').forEach((pill, i) => pill.onclick = () => setZone(i));

// Sidebar & Blueprint Clicks
$$('.wz-btn').forEach((btn, i) => btn.onclick = () => setZone(i));
$$('.svg-pin').forEach((pin, i) => pin.onclick = () => setZone(i));

// Sound Toggle
$('#soundToggle').onclick = () => {
  isAudioOn = !isAudioOn;
  $('#soundToggle').textContent = isAudioOn ? '🔊 Sound: ON' : '🔈 Sound: MUTED';
  if (isAudioOn) playRippleSound();
};

/* Confetti Trigger */
function confetti() {
  for (let i = 0; i < 48; i++) {
    const c = document.createElement('div');
    c.className = 'cf';
    c.style.cssText = `left:${innerWidth / 2}px;top:${innerHeight * 0.55}px;background:${['#d98a9b','#258f76','#f6d0d8','#0f5c4a','#fff'][i % 5]};--cx:${(Math.random() - 0.5) * innerWidth * 0.8}px;--cy:${-innerHeight * 0.5 + Math.random() * innerHeight * 0.9}px`;
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 1900);
  }
}

/* Auto-Tour Experience */
$('#autoTourBtn').onclick = () => {
  if (tourTimer) {
    clearInterval(tourTimer);
    tourTimer = null;
    $('#autoTourBtn').textContent = '▶ Auto-Tour Pavilion';
    return;
  }

  $('#autoTourBtn').textContent = '⏸ Pause Tour';
  let tIdx = 0;
  setZone(tIdx);

  tourTimer = setInterval(() => {
    tIdx++;
    if (tIdx >= ZONES.length) {
      clearInterval(tourTimer);
      tourTimer = null;
      $('#autoTourBtn').textContent = '▶ Auto-Tour Pavilion';
      confetti();
    } else {
      setZone(tIdx);
    }
  }, 2800);
};

// Initial trigger
setZone(0);

// Keyboard controls
addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') setZone(curIdx + 1);
  if (e.key === 'ArrowLeft') setZone(curIdx - 1);
});
