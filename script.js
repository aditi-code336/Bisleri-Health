const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];

// Map newly uploaded high-res product renders
if (typeof IMG !== 'undefined') {
  IMG.lineup = 'product_lineup.jpg';
  IMG.cartonTurnaround = 'life_carton_turnaround.jpg';
  IMG.bottleTurnaround = 'wellness_bottle_turnaround.jpg';
}

// Populate images and backgrounds from assets.js
$$('[data-img]').forEach(i => {
  if (typeof IMG !== 'undefined' && IMG[i.dataset.img]) i.src = IMG[i.dataset.img];
});
$$('[data-bg]').forEach(e => {
  if (typeof IMG !== 'undefined' && IMG[e.dataset.bg]) e.style.backgroundImage = 'url(' + IMG[e.dataset.bg] + ')';
});

const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;

/* Floating bubbles & Mouse Cursor Trail */
function bub() {
  if (reduce || $$('.bub').length > 20) return;
  const b = document.createElement('div'), s = 16 + Math.random() * 56;
  b.className = 'bub';
  b.style.cssText = 'width:' + s + 'px;height:' + s + 'px;left:' + (Math.random() * 100) + 'vw;--dx:' + ((Math.random() - 0.5) * 140) + 'px;animation-duration:' + (10 + Math.random() * 10) + 's';
  b.onclick = () => {
    b.classList.add('pop');
    setTimeout(() => b.remove(), 300);
  };
  b.onanimationend = () => b.remove();
  document.body.appendChild(b);
}
for (let i = 0; i < 8; i++) setTimeout(bub, i * 400);
setInterval(bub, 1100);

let lt = 0;
addEventListener('pointermove', e => {
  if (reduce) return;
  const n = Date.now();
  if (n - lt < 75) return;
  lt = n;
  const t = document.createElement('div');
  t.className = 'trail';
  t.style.left = (e.clientX - 5) + 'px';
  t.style.top = (e.clientY - 5) + 'px';
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 600);
});

// Parallax hero packs
addEventListener('pointermove', e => {
  if (reduce) return;
  const x = e.clientX / innerWidth - 0.5, y = e.clientY / innerHeight - 0.5;
  $$('#sh img').forEach(i => {
    const d = +i.dataset.d || 20;
    i.style.transform = 'translate(' + (-x * d) + 'px, ' + (-y * d) + 'px)';
  });
});

/* Replay logo animation & Loop Controller */
const lv = $('#logoVideo');
if (lv) {
  if (typeof IMG !== 'undefined' && IMG.logoAnimation) {
    lv.src = IMG.logoAnimation;
  }
  lv.style.cursor = 'pointer';
  lv.title = 'Click to replay logo animation';
  const replayLogo = () => {
    const s = lv.src || (typeof IMG !== 'undefined' && IMG.logoAnimation) || 'logo_animation.webp';
    lv.src = '';
    setTimeout(() => { lv.src = s; }, 20);
  };
  lv.onclick = replayLogo;
  if ($('#logoAnimStage')) {
    $('#logoAnimStage').style.cursor = 'pointer';
    $('#logoAnimStage').title = 'Click to replay logo animation';
    $('#logoAnimStage').onclick = replayLogo;
  }
}

if ($('#rp')) {
  $('#rp').onclick = () => {
    const l = $('#lg');
    if (l) {
      l.classList.remove('play');
      void l.offsetWidth;
      l.classList.add('play');
    }
    if (lv) {
      const s = lv.src || (typeof IMG !== 'undefined' && IMG.logoAnimation) || 'logo_animation.webp';
      lv.src = '';
      setTimeout(() => { lv.src = s; }, 20);
    }
  };
}

/* Counters and Intersection Observer */
function count(el, fmt) {
  if (el.done) return;
  el.done = 1;
  const n = +el.dataset.n || +el.dataset.cash || 0, s = el.dataset.s || '';
  let i = 0;
  const t = setInterval(() => {
    i++;
    const v = Math.round(n * i / 30);
    el.textContent = fmt ? fmt(v) : v + s;
    if (i >= 30) clearInterval(t);
  }, 35);
}

const io = new IntersectionObserver(es => {
  es.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      if (e.target.dataset.cash) count(e.target, v => '₹' + v + ' cr');
      if (e.target.dataset.n) count(e.target);
    }
  });
}, { threshold: 0.1 });
$$('.rv').forEach(e => io.observe(e));

/* Perceptual Map Click Handling */
$$('.dot').forEach(d => {
  d.onclick = () => {
    if ($('#tip')) {
      $('#tip').textContent = d.dataset.m;
      $('#tip').style.animation = 'none';
      void $('#tip').offsetWidth;
      $('#tip').style.animation = 'pulse 0.4s ease';
    }
  };
});

/* Product Life Cycle Curve */
/* Product Life Cycle Curve - Focused Strictly on Where We Are vs Next Phase Plan */
const PLC_STAGES = [
  {
    phase: 'Where Bisleri Is Right Now',
    sub: 'Late Maturity & Price Competition',
    desc: 'Bisleri commands 60% mass volume, but is caught in a price war (₹15 vs ₹20) facing category commoditisation and margin decline.',
    pos: 0.90,
    color: '#d98a9b'
  },
  {
    phase: 'Plan For Next Phase',
    sub: 'Category Re-Cycle & Introduction Phase (Bisleri Health)',
    desc: 'Launching the functional hydration category (Active, Life, Wellness) focusing on Awareness (vitality), Curiosity (PR drops), and Instant Trial (gym vending + 10-min delivery).',
    pos: 0.98,
    color: '#258f76'
  }
];

if ($('#plcv')) {
  $('#plcv').innerHTML = '<svg viewBox="0 0 400 230" class="map" style="max-width:720px"><rect x="262" y="12" width="84" height="190" fill="rgba(217,138,155,0.12)"/><path id="cv" d="M25 190 C120 190 140 185 190 120 S300 45 345 42" fill="none" stroke="#0f5c4a" stroke-width="3"/><path id="cv-recycle" d="M345 42 C365 38 375 28 385 18" fill="none" stroke="#258f76" stroke-width="3"/><path d="M345 42 C365 50 375 62 385 80" fill="none" stroke="#b7c9c1" stroke-width="2" stroke-dasharray="5"/><text x="385" y="12" font-size="9" text-anchor="end" fill="#258f76" font-weight="700">★ Next Phase: Bisleri Health (Re-Cycle)</text><text x="385" y="94" font-size="8" text-anchor="end" fill="#7d9a90">Decline if commoditised</text><g font-size="9" fill="#7d9a90" text-anchor="middle"><text x="75" y="218">Introduction</text><text x="195" y="218">Growth</text><text x="304" y="218">Maturity (NOW)</text></g><circle id="pd" r="9" fill="#d98a9b" stroke="#fff" stroke-width="3"/></svg>';

  const cv = $('#cv'), CL = cv.getTotalLength();

  function plcs(i) {
    const s = PLC_STAGES[i];
    $$('.plc-tab').forEach((t, j) => t.classList.toggle('on', j === i));
    const p = cv.getPointAtLength(s.pos * CL);
    $('#pd').setAttribute('cx', p.x);
    $('#pd').setAttribute('cy', p.y);
    $('#pd').setAttribute('fill', s.color);
    $('#plcd').innerHTML = '<strong>' + s.phase + ' · ' + s.sub + '</strong><br>' + s.desc;
  }

  $$('.plc-tab').forEach((btn, i) => {
    btn.onclick = () => plcs(i);
  });
  plcs(0);
}

/* Standard Modal Controller */
function closeM() {
  if ($('#mbox')) $('#mbox').style.aspectRatio = '';
  if ($('#modal')) {
    $('#modal').classList.remove('open');
    $('#modal').style.display = 'none';
    $('#mbox').innerHTML = '';
  }
}
if ($('#mb')) $('#mb').onclick = closeM;
if ($('#modal')) $('#modal').onclick = e => { if (e.target === $('#modal')) closeM(); };

/* Product Showcase (Active, Life, Wellness) with Hotspots */
const P = [
  {
    n: 'Active',
    t: 'Performance Hydration',
    p: 'Electrolyte+ in a sleek recyclable aluminium can formulated with essential sodium, potassium, and magnesium for movement, gym sessions, and rapid recovery.',
    i: 'can',
    g: 'linear-gradient(135deg,#eef7f3,#e1f1eb)',
    h: [
      ['⚡', 24, 38, 'Electrolyte+ Matrix: Isotonic balance of sodium, potassium and magnesium to prevent cramping and fatigue.'],
      ['💧', 58, 54, 'Zero Added Sugar: 100% functional hydration without empty calories or post-workout energy crashes.'],
      ['♻️', 34, 76, 'Infinite Aluminium: Rapid-chilling, completely plastic-free and infinitely recyclable.']
    ]
  },
  {
    n: 'Life',
    t: 'Everyday Balanced Hydration',
    p: 'Low-sodium, mineral-rich everyday water in an eco-friendly renewable carton, designed for health-conscious families, growing children, and active seniors.',
    i: 'carton',
    g: 'linear-gradient(135deg,#fdf4f6,#f9e3e7)',
    h: [
      ['🌱', 28, 35, 'Low-Sodium Formulation: Gentle on blood pressure and optimized for daily cellular hydration.'],
      ['📦', 62, 58, 'Renewable Paperboard: 82% plant-based carton packaging with sugarcane bio-cap.'],
      ['🛡️', 40, 78, '50+ Years Purity: Double-tested with Bisleri multi-barrier filtration and mineral infusion.']
    ]
  },
  {
    n: 'Wellness',
    t: 'Inner Balance & Radiance',
    p: 'Enriched with marine collagen peptides, vitamin C, and zinc to support skin elasticity, joint care, and cellular rejuvenation throughout demanding work routines.',
    i: 'bottle',
    g: 'linear-gradient(135deg,#eef5f8,#def0f4)',
    h: [
      ['✨', 32, 34, 'Marine Collagen Peptides: Promotes skin firmness, hair vitality, and tissue recovery.'],
      ['🍊', 65, 52, 'Vitamin C Synergy: Essential antioxidant booster that stimulates natural collagen formation.'],
      ['💎', 42, 75, 'Aesthetic Glass / rPET Bottle: Premium design aesthetic made for executive desks and mindful lifestyle dining.']
    ]
  }
];

function show(k) {
  if (!$('#gi')) return;
  const p = P[k], im = $('#gi');
  im.classList.add('sw2');
  $('#shw').style.background = p.g;
  setTimeout(() => {
    if (typeof IMG !== 'undefined' && IMG[p.i]) im.src = IMG[p.i];
    im.classList.remove('sw2');
  }, 220);
  $('#gn').textContent = p.n;
  $('#gt').textContent = p.t;
  $('#gp').textContent = p.p;
  $('#dtxt').textContent = 'Tap a pulsing hotspot bubble on the pack to inspect ingredients and benefits.';

  $$('#pr2 .hot').forEach(h => h.remove());
  p.h.forEach((h, i) => {
    const b = document.createElement('button');
    b.className = 'hot';
    b.textContent = h[0];
    b.style.cssText = 'left:' + h[1] + '%;top:' + h[2] + '%;animation-delay:' + (-i * 0.7) + 's';
    b.onclick = () => {
      $$('#pr2 .hot').forEach(x => x.classList.remove('on'));
      b.classList.add('on');
      $('#dtxt').textContent = h[3];
    };
    $('#pr2').appendChild(b);
  });
}

$$('#psw button').forEach(b => b.onclick = () => {
  $$('#psw button').forEach(x => x.classList.remove('on'));
  b.classList.add('on');
  show(+b.dataset.k);
});
if ($('#psw')) show(0);

/* Marquee Scrolling Tickers */
const MQ1 = ['LIFE DOESN’T WAIT', 'MAKE TIME FOR YOURSELF', '#LifeDoesntWait', 'ONE LIFE. MANY VERSIONS OF YOU.'],
      MQ2 = ['BISLERI HEALTH', 'ACTIVE', 'LIFE', 'WELLNESS', '#BisleriHealth', 'DIFFERENT NEEDS. ONE STEP.'];
const mq = a => {
  const h = a.map(x => '<span>' + x + '</span><b>✦</b>').join('');
  return h + h;
};
if ($('#mq1')) $('#mq1').innerHTML = '<div>' + mq(MQ1) + mq(MQ1) + '</div>';
if ($('#mq2')) $('#mq2').innerHTML = '<div>' + mq(MQ2) + mq(MQ2) + '</div>';

/* Budget Breakdown Cards & Interactive System */
const B = [
  {
    n: 'Digital Marketing',
    s: 40,
    a: '₹2.80 Crore',
    g: 'linear-gradient(135deg,#e29aaa,#b9677a)',
    e: '📱',
    it: [
      ['Social ads & content creation', '₹1.17 Cr', 41.7],
      ['Influencer collaborations', '₹70.0 L', 25.0],
      ['Website & campaign page tools', '₹46.8 L', 16.7],
      ['Paid media & retargeting', '₹23.2 L', 8.3],
      ['Community engagement & listening', '₹23.2 L', 8.3]
    ],
    kpis: [
      ['Total Impressions', '48.5M+'],
      ['Unique Reach', '18.2M'],
      ['Target CTR', '3.4%'],
      ['Est. Cost / Reach', '₹1.54']
    ],
    deliverables: [
      '40+ Creator unboxing Reels & routine takeovers',
      'Interactive hydration calculator on bisleri.com',
      'Real-time Quick-commerce sync (Blinkit/Zepto in 10 mins)',
      'Multi-variant video ads across YouTube & Instagram'
    ]
  },
  {
    n: 'Events & Community',
    s: 30,
    a: '₹2.10 Crore',
    g: 'linear-gradient(135deg,#258f76,#0f5c4a)',
    e: '⛺',
    it: [
      ['Flagship launch experience pavilion', '₹93.2 L', 44.4],
      ['Fitness, running & sports activations', '₹46.6 L', 22.2],
      ['College & workplace pauses', '₹46.6 L', 22.2],
      ['Pop-up hydration stations', '₹23.6 L', 11.1]
    ],
    kpis: [
      ['Sampling Units', '150,000+'],
      ['Event Footfall', '450,000+'],
      ['Pavilion Dwell', '14.5 Mins'],
      ['Cost / Sample', '₹14.00']
    ],
    deliverables: [
      '5-Zone Flagship Sensory Pavilion at DLF CyberHub',
      '35+ Gym & Marathon hydration stations (Cult.fit, NMDC)',
      'Corporate mindful break booths across top tier tech parks',
      'Smart contactless vending pods in premier workout hubs'
    ]
  },
  {
    n: 'Other / Retail & OOH',
    s: 20,
    a: '₹1.40 Crore',
    g: 'linear-gradient(135deg,#43a68b,#206956)',
    e: '🏬',
    it: [
      ['Retail & point-of-sale visibility', '₹70.0 L', 50.0],
      ['OOH & high-impact metro billboards', '₹28.0 L', 20.0],
      ['Contingency & operational reserve', '₹23.4 L', 16.7],
      ['Sampling logistics & chilling units', '₹18.6 L', 13.3]
    ],
    kpis: [
      ['Metro Lightboxes', '24 Stations'],
      ['Retail Visibility', '500+ Outlets'],
      ['Commuter Dwell', '42 Seconds'],
      ['Daily Footfall', '1.8M Eyes']
    ],
    deliverables: [
      'Transit escalator triptychs in Delhi, Mumbai & Bengaluru',
      'Double-sided subway platform backlit illuminated totems',
      'End-cap branded gondola display stacking in modern trade',
      'Chilled grab-and-go coolers beside supermarket checkouts'
    ]
  },
  {
    n: 'PR Activities',
    s: 10,
    a: '₹70.0 Lakh',
    g: 'linear-gradient(135deg,#efb1be,#b9677a)',
    e: '📰',
    it: [
      ['Lifestyle, business & trade media', '₹23.3 L', 33.3],
      ['Press stories & founder interviews', '₹23.3 L', 33.3],
      ['Influencer/blogger PR mystery kits', '₹23.3 L', 33.3]
    ],
    kpis: [
      ['VIP Mystery Kits', '65 Live Boxes'],
      ['Tier-1 Media Articles', '120+ Outlets'],
      ['Launch Day Rank', 'Top 3 Organic'],
      ['Est. Earned Media', '₹2.40 Cr']
    ],
    deliverables: [
      'Matte-black mystery countdown boxes with live digital timers',
      'National business press roundtables with Angelo George',
      'Exclusive health & beauty editor sensory preview flights',
      'Zero-hour synchronized unboxing across fitness tastemakers'
    ]
  }
];

let curBudIdx = 0;
let curBudMode = 'breakdown';

if ($('#cats')) {
  $('#cats').innerHTML = B.map(b => 
    '<button class="cat" style="background:' + b.g + '"><span>' + b.e + '</span><div class="pc2">' + b.s + '%</div><b>' + b.n + '</b><small>' + b.a + '</small></button>'
  ).join('');

  function renderBudgetView() {
    const b = B[curBudIdx];
    $$('#cats .cat').forEach((x, i) => x.classList.toggle('on', i === curBudIdx));
    if ($('#bh')) $('#bh').textContent = b.n + ' · ' + b.a;
    if ($('#bBadge')) $('#bBadge').textContent = b.s + '% OF ₹7.00 CR LAUNCH SPEND';
    if ($('#bCatTag')) $('#bCatTag').textContent = curBudMode === 'breakdown' ? 'ITEMISED ALLOCATION' : 'PROJECTED IMPACT & KPIS';

    if (curBudMode === 'breakdown') {
      $('#bb').innerHTML = b.it.map(t => 
        '<div class="br"><div class="bt"><span>' + t[0] + '</span><span>' + t[1] + ' (' + t[2] + '%)</span></div><div class="bk"><i style="background:' + b.g + '" data-w="' + t[2] + '"></i></div></div>'
      ).join('');
      setTimeout(() => {
        $$('#bb i').forEach(i => i.style.width = i.dataset.w + '%');
      }, 30);
    } else {
      $('#bb').innerHTML = '<div class="deliverables-box"><h5>Key Strategic Deliverables</h5><ul class="deliv-list">' + 
        b.deliverables.map(d => '<li><span class="d-check">✓</span><span>' + d + '</span></li>').join('') + 
        '</ul></div>';
    }

    if ($('#bKpis')) {
      $('#bKpis').innerHTML = b.kpis.map(k => 
        '<div class="bkpi-tile"><div class="bkpi-val">' + k[1] + '</div><div class="bkpi-lbl">' + k[0] + '</div></div>'
      ).join('');
    }
  }

  function bsel(k) {
    curBudIdx = k;
    renderBudgetView();
  }

  $$('#cats .cat').forEach((c, i) => c.onclick = () => bsel(i));

  // Budget Mode Switcher
  $$('#budgetModeTabs .bi-tab').forEach(btn => {
    btn.onclick = () => {
      $$('#budgetModeTabs .bi-tab').forEach(b => b.classList.remove('on'));
      btn.classList.add('on');
      curBudMode = btn.dataset.mode;
      renderBudgetView();
    };
  });

  bsel(0);
}

/* On-the-Ground Activation Cards with Interactive Detail View */
const ACTS = [
  {
    icon: '🏃',
    title: 'Fitness, Running & Movement',
    spend: '₹46.6 Lakh',
    desc: 'Hydration zones at marathons, cycling leagues, and CrossFit gyms.',
    grad: 'linear-gradient(160deg,#258f76,#0f5c4a)',
    footprint: '35+ Gyms & 4 Marathons',
    sampling: '60,000 Active Cans',
    target: 'Active athletes, morning runners, high-intensity gym members'
  },
  {
    icon: '🎓',
    title: 'College & Corporate Campuses',
    spend: '₹46.6 Lakh',
    desc: 'Activations built around daily work routines and mindful hydration pauses.',
    grad: 'linear-gradient(160deg,#efb1be,#b9677a)',
    footprint: '22 Tech Parks & 18 Universities',
    sampling: '55,000 Life Cartons',
    target: 'Desk-bound tech employees, students, young urban professionals'
  },
  {
    icon: '⛺',
    title: 'Pop-Up Hydration Stations',
    spend: '₹23.6 Lakh',
    desc: 'High-footfall transit interchanges, metro hubs, and weekend wellness pop-ups.',
    grad: 'linear-gradient(160deg,#2a8a82,#0a3d3a)',
    footprint: '12 Metro Concourse Stations',
    sampling: '35,000 Chilled Samples',
    target: 'Transit commuters, weekend shoppers, rapid trial seekers'
  }
];

if ($('#acts')) {
  function renderActs(selectedIdx = 0) {
    $('#acts').innerHTML = ACTS.map((a, i) => 
      '<div class="act ' + (i === selectedIdx ? 'on' : '') + '" style="background:' + a.grad + '" data-idx="' + i + '">' +
        '<span>' + a.icon + '</span><small>' + a.spend + '</small>' +
        '<h4>' + a.title + '</h4>' +
        '<p>' + a.desc + '</p>' +
        '<div class="act-details-row">' +
          '<div class="act-pill"><strong>Footprint:</strong> ' + a.footprint + '</div>' +
          '<div class="act-pill"><strong>Sampling:</strong> ' + a.sampling + '</div>' +
        '</div>' +
      '</div>'
    ).join('');

    $$('#acts .act').forEach(card => {
      card.onclick = () => {
        const idx = +card.dataset.idx;
        renderActs(idx);
      };
    });
  }
  renderActs(0);
}

/* 12-Week Launch Roadmap Interactive Dashboard */
const T = [
  {
    icon: '👀',
    phase: 'Phase 01',
    name: 'Anticipation & Mystery Drop',
    time: 'Weeks 1–2',
    goal: 'Build pre-launch curiosity through human truths and zero-hour mystery kits.',
    metrics: [
      ['Target Reach', '12M+ Commuters'],
      ['Mystery Boxes', '65 VIP Kits'],
      ['Primary Channel', 'Instagram Archives + Polls'],
      ['Key Deliverable', 'Zero-Hour Digital Countdown']
    ],
    status: 'Teaser Mode · Zero Leaks'
  },
  {
    icon: '🚀',
    phase: 'Phase 02',
    name: 'Launch Wave & 3-Pillar Reveal',
    time: 'Weeks 3–5',
    goal: 'Simultaneous hero film premiere, range reveal, and Flagship Pavilion opening.',
    metrics: [
      ['Combined Views', '25M+ Views'],
      ['Sampling Volume', '45,000 Packs'],
      ['Quick-Commerce', 'Blinkit & Zepto 10-Min Drops'],
      ['Event Footprint', 'CyberHub Pavilion Premiere']
    ],
    status: 'Maximum Blast · Omnichannel'
  },
  {
    icon: '🤝',
    phase: 'Phase 03',
    name: 'Community & Daily Routines',
    time: 'Weeks 6–8',
    goal: 'Normalize mindful hydration pauses across work, fitness, and recovery routines.',
    metrics: [
      ['Creator Roster', '40+ Fitness & Lifestyle'],
      ['UGC Engagements', '850K Likes & Saves'],
      ['Campus Stalls', '22 Corporate Tech Parks'],
      ['Key Deliverable', '#LifeDoesntWait UGC Prompt']
    ],
    status: 'Relatable Routines & Movement'
  },
  {
    icon: '🧠',
    phase: 'Phase 04',
    name: 'Functional Education & Trial',
    time: 'Weeks 9–10',
    goal: 'Demystify electrolyte science and mineral benefits to drive high-intent trial.',
    metrics: [
      ['Retargeting Pool', '3.8M Engaged Users'],
      ['Search Volume Lift', '+320% Functional Hydration'],
      ['Trial Conversions', '120,000 Units Sold'],
      ['Key Deliverable', 'Electrolyte vs Plain Water Calculator']
    ],
    status: 'Category Re-Framing'
  },
  {
    icon: '🛒',
    phase: 'Phase 05',
    name: 'Retail Scale & Habit Sustain',
    time: 'Weeks 11–12',
    goal: 'Anchor permanent presence across Modern Trade, supermarkets, and repeat subscriptions.',
    metrics: [
      ['Repeat Rate', '38% Projected Retention'],
      ['Modern Trade', '500+ Supermarket Gondolas'],
      ['Full Campaign ROI', '3.8x Target Multiple'],
      ['Key Deliverable', 'Verified 90-Day Campaign Recap']
    ],
    status: 'Permanent Market Presence'
  }
];

if ($('#stn')) {
  $('#stn').innerHTML = T.map(t => 
    '<button><i>' + t.icon + '</i>' + t.name.split(' ')[0] + '<small>' + t.time + '</small></button>'
  ).join('');

  function confetti() {
    if (reduce) return;
    for (let i = 0; i < 48; i++) {
      const c = document.createElement('div');
      c.className = 'cf';
      c.style.cssText = 'left:' + (innerWidth / 2) + 'px;top:' + (innerHeight * 0.6) + 'px;background:' + ['#d98a9b', '#258f76', '#f6d0d8', '#0f5c4a', '#fff'][i % 5] + ';--cx:' + ((Math.random() - 0.5) * innerWidth * 0.8) + 'px;--cy:' + (-innerHeight * 0.5 + Math.random() * innerHeight * 0.9) + 'px';
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 1900);
    }
  }

  function tsh(i, fx) {
    const bs = $$('#stn button');
    bs.forEach((b, j) => b.classList.toggle('on', i === j));
    const b = bs[i];
    if (b) {
      $('#rk').style.left = (b.offsetLeft + b.offsetWidth / 2 - 20) + 'px';
      const phase = T[i];
      $('#tln').innerHTML = 
        '<div class="timeline-card-inner">' +
          '<div class="tc-header">' +
            '<div>' +
              '<span class="tc-badge">' + phase.phase + ' &bull; ' + phase.time + '</span>' +
              '<h4>' + phase.name + '</h4>' +
            '</div>' +
            '<span class="tc-status">' + phase.status + '</span>' +
          '</div>' +
          '<p class="tc-goal">' + phase.goal + '</p>' +
          '<div class="tc-kpis-grid">' +
            phase.metrics.map(m => '<div class="tc-kpi-item"><small>' + m[0] + '</small><strong>' + m[1] + '</strong></div>').join('') +
          '</div>' +
        '</div>';
    }
    if (fx && i === 1) confetti();
  }
  $$('#stn button').forEach((b, i) => b.onclick = () => tsh(i, 1));
  setTimeout(() => tsh(0), 250);
  addEventListener('resize', () => {
    const curIdx = $$('#stn button').findIndex(b => b.classList.contains('on'));
    tsh(curIdx >= 0 ? curIdx : 0);
  });
}

/* Instagram Simulation */
if ($('#st2')) {
  $('#st2').innerHTML = [
    ['🗳️', 'Poll'], ['🎙️', 'Voices'], ['🎬', 'Creator'], ['🧴', 'Range'], ['💬', 'Share'], ['📍', 'Store']
  ].map(s => '<div><i><span>' + s[0] + '</span></i>' + s[1] + '</div>').join('');
}

if ($('#adv')) {
  const adv = $('#adv');
  adv.src = 'Social ad.mp4';
  if (typeof IMG !== 'undefined' && IMG.c1) adv.poster = IMG.c1;
  if ($('#igv')) {
    $('#igv').onclick = () => {
      if (adv.paused) {
        adv.muted = false;
        adv.play();
        $('#igv').classList.add('playing');
      } else {
        adv.pause();
        $('#igv').classList.remove('playing');
      }
    };
  }
}

function hearts(x, y) {
  for (let i = 0; i < 7; i++) {
    const h = document.createElement('div');
    h.className = 'heart';
    h.textContent = ['❤️', '💖', '💧', '✨'][i % 4];
    h.style.cssText = 'left:' + (x - 12 + (Math.random() - 0.5) * 40) + 'px;top:' + (y - 12 + (Math.random() - 0.5) * 40) + 'px';
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 1100);
  }
}

if ($('#hrt')) {
  $('#hrt').onclick = e => {
    const b = e.currentTarget;
    b.textContent = b.textContent === '🤍' ? '❤️' : '🤍';
    if (b.textContent === '❤️') {
      const r = b.getBoundingClientRect();
      hearts(r.left + 16, r.top + 16);
    }
  };
}
if ($('#igv')) $('#igv').ondblclick = e => hearts(e.clientX, e.clientY);

/* ==========================================================================
   HIGH-END AGENCY 9-GRID CARDS (Upgraded & Much Better Visuals)
   ========================================================================== */

const cut = (k, s) => {
  const src = (typeof IMG !== 'undefined' && IMG[k]) ? IMG[k] : '';
  return '<img src="' + src + '" alt="" style="position:absolute;' + s + ';filter:drop-shadow(0 14px 18px rgba(0,0,0,0.32))">';
};

const G = [
  // 01 Teaser Reel
  [
    'Teaser Reel: "When do you pause?"',
    'Anticipation',
    '#0f3027',
    '<div class="grid-card-rich photo-card-bg">' +
      '<img src="runner.png" alt="" class="gc-bg-photo">' +
      '<div class="gc-photo-dark-overlay"></div>' +
      '<div class="gc-top-row"><span class="gc-badge">TEASER REEL</span><span class="gc-stat">▶ 1.4M</span></div>' +
      '<div class="gc-center-art">' +
        '<div class="gc-play-circle">&#9654;</div>' +
      '</div>' +
      '<div class="gc-bottom-text">' +
        '<small class="gc-kicker">HUMAN TRUTH</small>' +
        '<h5>"When do you make time for yourself?"</h5>' +
      '</div>' +
    '</div>'
  ],

  // 02 Interactive Story Poll
  [
    'Story Poll: "Your day usually feels..."',
    'Anticipation',
    'linear-gradient(145deg, #258f76, #0e5645)',
    '<div class="grid-card-rich">' +
      '<div class="gc-top-row"><span class="gc-badge">INTERACTIVE POLL</span><span class="gc-stat">&#128499; 180K</span></div>' +
      '<div class="gc-poll-box">' +
        '<p class="gc-poll-q">"Your day usually feels..."</p>' +
        '<div class="gc-poll-bar bar-active">' +
          '<span class="gcp-label">Non-stop</span>' +
          '<span class="gcp-pct">78%</span>' +
          '<div class="gcp-fill" style="width:78%"></div>' +
        '</div>' +
        '<div class="gc-poll-bar">' +
          '<span class="gcp-label">A little balanced</span>' +
          '<span class="gcp-pct">22%</span>' +
          '<div class="gcp-fill" style="width:22%"></div>' +
        '</div>' +
      '</div>' +
      '<div class="gc-bottom-text"><small class="gc-kicker">INSTAGRAM STORIES</small><h5>Tap to vote &amp; see results</h5></div>' +
    '</div>'
  ],

  // 03 Hero Film Premiere
  [
    'Hero Film Premiere: "Life Doesn’t Wait"',
    'Launch',
    'linear-gradient(145deg, #fcecee, #f4ccd5)',
    '<div class="grid-card-rich light-mode">' +
      '<div class="gc-top-row"><span class="gc-badge dark">HERO FILM</span><span class="gc-stat dark">&#127916; OFFICIAL</span></div>' +
      '<div class="gc-film-poster">' +
        '<div class="gc-film-border"></div>' +
        '<div class="gc-film-brand">BISLERI HEALTH</div>' +
        '<h4>LIFE DOESN’T WAIT</h4>' +
        '<em>Make time for yourself.</em>' +
        '<div class="gc-pill-cta">Watch Full Film &#9654;</div>' +
      '</div>' +
    '</div>'
  ],

  // 04 Real Voices from Research
  [
    'Real Voices: "I forgot to drink water"',
    'Launch',
    '#16382e',
    '<div class="grid-card-rich photo-card-bg">' +
      '<img src="desk_flatlay.png" alt="" class="gc-bg-photo">' +
      '<div class="gc-photo-dark-overlay"></div>' +
      '<div class="gc-top-row"><span class="gc-badge">REAL VOICES</span><span class="gc-stat">&#127911; AUDIO</span></div>' +
      '<div class="gc-waveform-box">' +
        '<div class="mini-wf"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>' +
        '<p class="gc-audio-quote">&ldquo;I never forget my bottle&hellip; then I realise I forgot to drink.&rdquo;</p>' +
        '<small class="gc-speaker">&bull; Aarav, 21 &bull; Runner</small>' +
      '</div>' +
      '<div class="gc-bottom-text"><small class="gc-kicker">FIELD RESEARCH</small><h5>Real routines &bull; Real voices</h5></div>' +
    '</div>'
  ],

  // 05 3 Pillars Reveal
  [
    'Product Reveal: ACTIVE &bull; LIFE &bull; WELLNESS',
    'Launch',
    'linear-gradient(145deg, #eef7f3, #d9ebe3)',
    '<div class="grid-card-rich light-mode">' +
      '<div class="gc-top-row"><span class="gc-badge dark">RANGE REVEAL</span><span class="gc-stat dark">&#10024; 3 PILLARS</span></div>' +
      '<div class="gc-trio-stage">' +
        cut('can', 'left:8%;bottom:12%;height:68%;transform:rotate(-6deg);z-index:2;') +
        cut('bottle', 'right:8%;bottom:10%;height:74%;transform:rotate(6deg);z-index:3;') +
      '</div>' +
      '<div class="gc-bottom-text dark"><small class="gc-kicker dark">PORTFOLIO</small><h5>Active &bull; Life &bull; Wellness</h5></div>' +
    '</div>'
  ],

  // 06 ACTIVE Range
  [
    'ACTIVE: Electrolyte+ Performance',
    'Range',
    'linear-gradient(145deg, #258f76, #0e5645)',
    '<div class="grid-card-rich">' +
      '<div class="gc-top-row"><span class="gc-badge">PILLAR 01</span><span class="gc-stat">&#9889; ISOTONIC</span></div>' +
      cut('can', 'right:10%;bottom:8%;height:76%;z-index:2;') +
      '<div class="gc-side-title">' +
        '<h3>ACTIVE</h3>' +
        '<p>500mg Electrolytes<br>Aluminium Can<br>Rapid Recovery</p>' +
      '</div>' +
    '</div>'
  ],

  // 07 LIFE Range
  [
    'LIFE: Everyday Low-Sodium Carton',
    'Range',
    'linear-gradient(145deg, #fbe3e8, #d98a9b)',
    '<div class="grid-card-rich light-mode">' +
      '<div class="gc-top-row"><span class="gc-badge dark">PILLAR 02</span><span class="gc-stat dark">&#127807; ECO-PACK</span></div>' +
      cut('carton', 'right:10%;bottom:6%;height:78%;z-index:2;') +
      '<div class="gc-side-title dark">' +
        '<h3>LIFE</h3>' +
        '<p>Low Sodium<br>Plant Carton<br>Family Pure</p>' +
      '</div>' +
    '</div>'
  ],

  // 08 WELLNESS Range
  [
    'WELLNESS: Collagen + Vitamin C',
    'Range',
    'linear-gradient(145deg, #1b3d33, #0a231c)',
    '<div class="grid-card-rich">' +
      '<div class="gc-top-row"><span class="gc-badge">PILLAR 03</span><span class="gc-stat">&#10024; GLOW</span></div>' +
      cut('bottle', 'right:10%;bottom:6%;height:78%;z-index:2;') +
      '<div class="gc-side-title">' +
        '<h3>WELLNESS</h3>' +
        '<p>Marine Collagen<br>Vitamin C Synergy<br>Inner Radiance</p>' +
      '</div>' +
    '</div>'
  ],

  // 09 Quick-Commerce Availability
  [
    'Quick-Commerce: Delivery in 10 Mins',
    'Convert',
    'linear-gradient(145deg, #0f5c4a, #258f76)',
    '<div class="grid-card-rich">' +
      '<div class="gc-top-row"><span class="gc-badge">ORDER NOW</span><span class="gc-stat">&#9889; 10 MINS</span></div>' +
      '<div class="gc-delivery-stage">' +
        '<div class="gc-speed-tag">&#128640; Instant Dispatch</div>' +
        '<h4>COLD AT YOUR DOOR</h4>' +
        '<div class="gc-partner-logos">' +
          '<span>Blinkit</span> &bull; <span>Zepto</span> &bull; <span>Instamart</span>' +
        '</div>' +
        '<div class="gc-order-btn">Order Bisleri Health 📍</div>' +
      '</div>' +
    '</div>'
  ]
];

if ($('#g9')) {
  $('#g9').innerHTML = G.map((g, i) => 
    '<div class="gt" data-i="' + i + '" style="background:' + g[2] + '">' + g[3] + '</div>'
  ).join('');

  const postMedia = {
    0: { img: 'runner.png', reach: '1.4M views', likes: '124K likes', copy: 'When was the last time you paused? Life does not wait. Make time for yourself.' },
    1: { img: null, reach: '180K votes', likes: '9.2K shares', copy: 'Interactive Story Poll: 78% of people say their workday feels nonstop. We built Bisleri Health for the pause.' },
    2: { img: null, reach: '3.2M views', likes: '210K likes', copy: 'Official Film Premiere: "Life Doesn’t Wait". A 90-second journey from pure water to active vitality.' },
    3: { img: 'desk_flatlay.png', reach: '820K plays', likes: '64K likes', copy: 'Real field research audio: "I never forget my water bottle... then 5 PM hits and I realize I forgot to drink."' },
    4: { img: 'mystery_box.png', reach: '950K reach', likes: '88K likes', copy: 'The Range Unboxed: ACTIVE (Electrolytes), LIFE (Low-Sodium), WELLNESS (Collagen + Vit C). 3 purposeful formulations.' },
    5: { img: 'gym_bottle.png', reach: '1.1M reach', likes: '95K likes', copy: 'ACTIVE Electrolyte+: 500mg vital electrolytes packed in infinitely recyclable aluminium. Built for movement.' },
    6: { img: null, reach: '640K reach', likes: '48K likes', copy: 'LIFE Low-Sodium: Pure mountain mineral balance packaged in renewable plant-based cartons for everyday mindful living.' },
    7: { img: null, reach: '890K reach', likes: '71K likes', copy: 'WELLNESS Radiance: Hydrolysed marine collagen + Vitamin C antioxidant synergy for cellular glow.' },
    8: { img: null, reach: '450K clicks', likes: '28K orders', copy: 'Tap to order Bisleri Health cold on Blinkit, Zepto, and Instamart in under 10 minutes.' }
  };

  $$('.gt').forEach(t => {
    t.onclick = () => {
      const idx = t.dataset.i;
      const g = G[idx];
      const m = postMedia[idx] || {};
      $('#mt').textContent = g[0];
      let inner = '<div class="mcard">';
      if (m.img) {
        inner += '<img src="' + m.img + '" style="width:100%;max-height:280px;object-fit:cover;border-radius:10px;margin-bottom:14px;box-shadow:0 6px 16px rgba(0,0,0,0.08);">';
      }
      inner += '<h4>' + g[0] + '</h4>' +
        '<span class="eyebrow">' + g[1] + ' Phase</span>' +
        '<p style="margin:12px 0 14px;font-size:14px;line-height:1.6;color:var(--tx);">' + (m.copy || 'Official creative asset designed for Instagram Reels, Stories, and creator collaborations.') + '</p>' +
        '<div style="display:flex;gap:16px;padding-top:12px;border-top:1px solid var(--border);font-size:12.5px;color:var(--mu);">' +
          '<span>&#128065; ' + (m.reach || 'High Reach') + '</span>' +
          '<span>&#10084; ' + (m.likes || 'Top Engagement') + '</span>' +
          '<span style="margin-left:auto;color:var(--g);font-weight:600;">@bislerihealth</span>' +
        '</div>' +
      '</div>';
      $('#mbox').innerHTML = inner;
      $('#modal').style.display = 'grid';
      $('#modal').classList.add('open');
    };
  });
}

/* Content Pillars, Platforms & Schedule */
const PI = [
  ['Everyday life', 30, 'Real people: research-film excerpts, morning routines, and authentic moments from college, corporate work, and fitness.'],
  ['Pause & Care', 25, 'Mindful pauses, winding down after workouts, and recognizing personal self-care moments.'],
  ['Range Clarity', 20, 'ACTIVE, LIFE, and WELLNESS explainers detailing science-backed minerals and pack distinctions.'],
  ['Hydration Know-How', 15, 'Expert-reviewed hydration habits and daily wellness FAQs without medical hyperbole.'],
  ['Community & UGC', 10, 'Routine prompts, creator takeovers, and permissioned community hydration reposts.']
];
if ($('#pil')) {
  $('#pil').innerHTML = PI.map(p => 
    '<button style="width:' + (80 + p[1] * 2.8) + 'px;height:' + (80 + p[1] * 2.8) + 'px"><div><small>' + p[1] + '%</small>' + p[0] + '</div></button>'
  ).join('');
  $$('#pil button').forEach((b, i) => b.onclick = () => {
    $$('#pil button').forEach(x => x.classList.remove('on'));
    b.classList.add('on');
    $('#pild').innerHTML = '<strong>' + PI[i][0] + ' · ' + PI[i][1] + '% Effort</strong><br>' + PI[i][2];
  });
}

const PL = [
  ['📸', 'Instagram', 'Main community channel: Reels, Stories, Creator Collabs, and interactive polls.', 'linear-gradient(135deg,#d98a9b,#b9677a)'],
  ['▶️', 'YouTube', 'Hero film reach, full companion research film, and YouTube Shorts cutdowns.', 'linear-gradient(135deg,#c4302b,#99201c)'],
  ['💬', 'WhatsApp', 'Opt-in hydration reminders, order tracking, and quiet wellness updates.', 'linear-gradient(135deg,#25d366,#1b9e4b)'],
  ['👥', 'Facebook', 'Broader family audiences, household packs, and local community stories.', 'linear-gradient(135deg,#1877f2,#1054ab)'],
  ['💼', 'LinkedIn / PR', 'Corporate credibility, brand repositioning news, and sustainability leadership.', 'linear-gradient(135deg,#0077b5,#004e77)'],
  ['⚡', 'Quick-Commerce', 'Blinkit, Zepto & Instamart sponsored banner placements in launch cities.', 'linear-gradient(135deg,#f7a400,#d47a00)']
];
if ($('#plat')) {
  $('#plat').innerHTML = PL.map(p => 
    '<button class="app" style="background:' + p[3] + '"><span>' + p[0] + '</span>' + p[1] + '</button>'
  ).join('');
  $$('#plat button').forEach((b, i) => b.onclick = () => {
    $$('#plat button').forEach(x => x.classList.remove('on'));
    b.classList.add('on');
    $('#platd').innerHTML = '<strong>' + PL[i][1] + '</strong> · ' + PL[i][2];
  });
}

if ($('#wk')) {
  $('#wk').innerHTML = [
    ['Mon', '🗳️', 'Story Poll & Routine Prompt'],
    ['Tue', '🎙️', 'Research Clip & Real Voice'],
    ['Wed', '🎬', 'Creator Routine Reel'],
    ['Thu', '🧴', 'Range Science Explainer'],
    ['Fri', '💬', 'Community UGC Spotlight'],
    ['Sat', '🏃', 'Gym & Running Sampling'],
    ['Sun', '🎞️', 'Hero Film & Availability Link']
  ].map(d => 
    '<div class="day"><small>' + d[0] + '</small><span>' + d[1] + '</span><b>' + d[2] + '</b></div>'
  ).join('');
}

// Redirect all Walkthrough CTA buttons directly to walkthrough.html
const openWalkPage = () => { window.location.href = 'walkthrough.html'; };
if ($('#enter')) $('#enter').onclick = openWalkPage;
if ($('#topLaunchBtn')) $('#topLaunchBtn').onclick = openWalkPage;
if ($('#openFullExperience')) $('#openFullExperience').onclick = openWalkPage;

/* Chapter Navigation and Spy Scroll Tracking */
const chs = ['c-identity', 'c-strategy', 'c-culture', 'c-product', 'c-budget', 'c-campaign', 'c-launch'].map(i => $('#' + i));
let cur = -1;

function spy() {
  let c = -1;
  chs.forEach((s, i) => {
    if (s && s.getBoundingClientRect().top <= 160) c = i;
  });
  cur = c;
  $$('#nav a').forEach((a, i) => a.classList.toggle('on', i === c));
  const h = document.documentElement;
  const progress = (scrollY / (h.scrollHeight - innerHeight)) * 100;
  if ($('#bar div')) $('#bar div').style.width = Math.min(100, Math.max(0, progress)) + '%';
}
addEventListener('scroll', spy, { passive: true });
spy();

const go = d => {
  const n = Math.max(0, Math.min(chs.length - 1, cur + d));
  if (chs[n]) chs[n].scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
};
if ($('#nx')) $('#nx').onclick = () => go(1);
if ($('#pv')) $('#pv').onclick = () => cur <= 0 ? scrollTo({ top: 0, behavior: 'smooth' }) : go(-1);

addEventListener('keydown', e => {
  if (e.key === 'Escape') closeM();
  if ($('#modal') && $('#modal').classList.contains('open')) return;
  if (e.key === 'ArrowRight') go(1);
  if (e.key === 'ArrowLeft') go(-1);
});
