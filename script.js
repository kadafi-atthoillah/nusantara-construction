/* ============================================================
   NUSANTARA CONSTRUCTION — Main JavaScript
   Handles: Loading, Navbar, Animations, Portfolio, Calculator,
            Simulator, Slider, Blog, Forms, Canvas Background
   ============================================================ */

'use strict';

// ============================================================
// 1. LOADING SCREEN
// ============================================================
(function initLoader() {
  const loader = document.getElementById('loader');
  const barFill = document.querySelector('.loader-bar-fill');
  const percent = document.getElementById('loaderPercent');
  let progress = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 18;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
        // Trigger initial scroll animations
        checkScrollAnimations();
        startCounters();
      }, 400);
    }
    barFill.style.width = progress + '%';
    percent.textContent = Math.floor(progress) + '%';
  }, 120);

  document.body.style.overflow = 'hidden';
})();


// ============================================================
// 2. HERO CANVAS PARTICLE BACKGROUND
// ============================================================
(function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Particles representing building/construction dots
  const particles = [];
  const PARTICLE_COUNT = 80;

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.7 ? '#c9a227' : '#2450a0';
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  // Draw connecting lines
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(201,162,39,${0.08 * (1 - dist / 130)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animate);
  }
  animate();
})();


// ============================================================
// 3. NAVBAR
// ============================================================
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNavLink();
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

// Close mobile nav on link click
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// Active nav link based on scroll
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) {
      if (scrollY >= top && scrollY < top + height) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    }
  });
}


// ============================================================
// 4. DARK MODE TOGGLE
// ============================================================
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const html = document.documentElement;

// Detect system preference
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
let currentTheme = localStorage.getItem('nc-theme') || (prefersDark ? 'dark' : 'light');
applyTheme(currentTheme);

themeToggle.addEventListener('click', () => {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(currentTheme);
  localStorage.setItem('nc-theme', currentTheme);
});

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}


// ============================================================
// 5. SCROLL ANIMATIONS (Custom AOS-like)
// ============================================================
function checkScrollAnimations() {
  const elements = document.querySelectorAll('[data-aos]');
  const windowHeight = window.innerHeight;

  elements.forEach(el => {
    const rect = el.getBoundingClientRect();
    const delay = el.getAttribute('data-aos-delay') || 0;
    if (rect.top < windowHeight * 0.88) {
      setTimeout(() => {
        el.classList.add('aos-visible');
      }, parseInt(delay));
    }
  });
}

window.addEventListener('scroll', checkScrollAnimations);
window.addEventListener('resize', checkScrollAnimations);
// Initial check after loader
setTimeout(checkScrollAnimations, 1500);


// ============================================================
// 6. COUNTER ANIMATION (Hero Stats)
// ============================================================
function startCounters() {
  const counters = document.querySelectorAll('.stat-number[data-count]');
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-count'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const update = () => {
      current += step;
      if (current >= target) {
        counter.textContent = target;
      } else {
        counter.textContent = Math.floor(current);
        requestAnimationFrame(update);
      }
    };
    requestAnimationFrame(update);
  });
}


// ============================================================
// 7. BACK TO TOP & SCROLL
// ============================================================
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
});
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


// ============================================================
// 8. PORTFOLIO DATA & RENDERING
// ============================================================
const portfolioData = [
  {
    id: 1, category: 'rumah', cat_label: 'Rumah Tinggal',
    title: 'Villa Modern Sentul', location: 'Bogor, Jawa Barat', year: 2023,
    desc: 'Villa 3 lantai dengan desain modern tropis. Dilengkapi kolam renang infinity, taman vertikal, dan sistem smart home terintegrasi.',
    icon: 'fa-home', color: '#2450a0'
  },
  {
    id: 2, category: 'gedung', cat_label: 'Gedung Komersial',
    title: 'Menara Bisnis Sudirman', location: 'Jakarta Pusat, DKI Jakarta', year: 2022,
    desc: 'Gedung perkantoran 12 lantai dengan fasad kaca curtain wall modern. Memiliki lobby premium, rooftop garden, dan basement parking 3 level.',
    icon: 'fa-city', color: '#c9a227'
  },
  {
    id: 3, category: 'interior', cat_label: 'Desain Interior',
    title: 'Interior Penthouse Semanggi', location: 'Jakarta Selatan, DKI Jakarta', year: 2023,
    desc: 'Desain interior luxury penthouse seluas 450m² dengan konsep modern kontemporer. Menggunakan material marmer Italia dan kayu eksotis Kalimantan.',
    icon: 'fa-couch', color: '#6c5ce7'
  },
  {
    id: 4, category: 'renovasi', cat_label: 'Renovasi',
    title: 'Renovasi Ruko Heritage', location: 'Kota Lama, Semarang', year: 2023,
    desc: 'Transformasi ruko tua era kolonial menjadi kafe & galeri seni modern. Mempertahankan elemen historis dengan sentuhan kontemporer.',
    icon: 'fa-tools', color: '#e17055'
  },
  {
    id: 5, category: 'rumah', cat_label: 'Rumah Tinggal',
    title: 'Rumah Minimalis BSD City', location: 'Tangerang, Banten', year: 2022,
    desc: 'Rumah tipe 120 dengan konsep open living space. Desain minimalis Scandinavian dengan pencahayaan alami maksimal dan taman Zen.',
    icon: 'fa-home', color: '#00b894'
  },
  {
    id: 6, category: 'gedung', cat_label: 'Gedung Komersial',
    title: 'Hotel Boutique Ubud', location: 'Ubud, Bali', year: 2021,
    desc: 'Hotel butik 5 lantai 40 kamar dengan arsitektur Bali kontemporer. Mengintegrasikan sawah alami sebagai bagian dari desain bangunan.',
    icon: 'fa-hotel', color: '#fdcb6e'
  },
  {
    id: 7, category: 'interior', cat_label: 'Desain Interior',
    title: 'Kantor Startup District 8', location: 'Jakarta Selatan, DKI Jakarta', year: 2023,
    desc: 'Desain interior kantor startup 2000m² dengan konsep industrial chic. Area kolaborasi, breakout zone, dan biophilic design.',
    icon: 'fa-building', color: '#74b9ff'
  },
  {
    id: 8, category: 'renovasi', cat_label: 'Renovasi',
    title: 'Renovasi Rumah Klasik Menteng', location: 'Jakarta Pusat, DKI Jakarta', year: 2022,
    desc: 'Revitalisasi rumah art deco 1940-an menjadi hunian modern. Struktur asli dipertahankan dengan penambahan fasilitas modern.',
    icon: 'fa-home', color: '#a29bfe'
  },
  {
    id: 9, category: 'rumah', cat_label: 'Rumah Tinggal',
    title: 'Rumah Tropis Alam Sutera', location: 'Tangerang, Banten', year: 2023,
    desc: 'Rumah mewah 450m² konsep indoor-outdoor living. Atap tinggi, void double, dan taman tengah sebagai paru-paru rumah.',
    icon: 'fa-leaf', color: '#00cec9'
  }
];

function renderPortfolio(filter = 'all') {
  const grid = document.getElementById('portfolioGrid');
  const filtered = filter === 'all' ? portfolioData : portfolioData.filter(p => p.category === filter);

  grid.innerHTML = filtered.map(item => `
    <div class="portfolio-item" data-aos="fade-up" onclick="openModal(${item.id})">
      <div class="portfolio-img">
        <div class="portfolio-img-placeholder" style="background: linear-gradient(135deg, ${item.color}22, ${item.color}11);">
          <i class="fas ${item.icon}" style="color:${item.color};font-size:3rem;opacity:0.6;"></i>
          <span style="color:${item.color};opacity:0.5;">${item.title}</span>
        </div>
        <div class="portfolio-overlay">
          <button class="portfolio-overlay-btn">
            <i class="fas fa-expand-alt"></i> Lihat Detail
          </button>
        </div>
      </div>
      <div class="portfolio-info">
        <div class="portfolio-cat">${item.cat_label}</div>
        <h3>${item.title}</h3>
        <div class="portfolio-meta">
          <span><i class="fas fa-map-marker-alt"></i>${item.location}</span>
          <span><i class="fas fa-calendar"></i>${item.year}</span>
        </div>
      </div>
    </div>
  `).join('');

  // Re-trigger animations
  setTimeout(checkScrollAnimations, 100);
}

// Filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    renderPortfolio(this.getAttribute('data-filter'));
  });
});

renderPortfolio();


// ============================================================
// 9. PORTFOLIO MODAL
// ============================================================
function openModal(id) {
  const item = portfolioData.find(p => p.id === id);
  if (!item) return;

  document.getElementById('modalImg').innerHTML = `
    <div style="width:100%;height:100%;background:linear-gradient(135deg,${item.color}44,${item.color}11);
    display:flex;align-items:center;justify-content:center;font-size:5rem;color:${item.color};opacity:0.6;">
      <i class="fas ${item.icon}"></i>
    </div>`;
  document.getElementById('modalCategory').textContent = item.cat_label;
  document.getElementById('modalTitle').textContent = item.title;
  document.getElementById('modalLocation').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${item.location}`;
  document.getElementById('modalYear').innerHTML = `<i class="fas fa-calendar"></i> ${item.year}`;
  document.getElementById('modalDesc').textContent = item.desc;

  document.getElementById('portfolioModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('portfolioModal').classList.remove('active');
  document.body.style.overflow = '';
}

document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalOverlay').addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
window.closeModal = closeModal;
window.openModal = openModal;


// ============================================================
// 10. HOUSE SIMULATOR
// ============================================================
const simState = { type: 'type36', floor: '1', style: 'modern' };

const houseData = {
  type36:  { area: '36 m²',  bed: '2 Kamar Tidur', bath: '1 Kamar Mandi', garage: 'Tanpa Garasi' },
  type45:  { area: '45 m²',  bed: '3 Kamar Tidur', bath: '1 Kamar Mandi', garage: 'Carport 1' },
  type72:  { area: '72 m²',  bed: '3 Kamar Tidur', bath: '2 Kamar Mandi', garage: 'Garasi 1' },
  type120: { area: '120 m²', bed: '4 Kamar Tidur', bath: '3 Kamar Mandi', garage: 'Garasi 2' }
};

const styleColors = {
  modern:    { wall: '#2d3561', roof: '#c9a227', window: '#74b9ff', accent: '#c9a227' },
  minimalis: { wall: '#e8ecf0', roof: '#95a5a6', window: '#dfe6e9', accent: '#636e72' },
  klasik:    { wall: '#f5e6c8', roof: '#8b4513', window: '#87ceeb', accent: '#d4a054' },
  tropis:    { wall: '#2d5a27', roof: '#8b4513', window: '#a8e6cf', accent: '#ff6b6b' }
};

const styleDescs = {
  modern:    'Desain kontemporer dengan garis tegas, fasad dinamis, dan material modern. Menggabungkan estetika urban dengan fungsi maksimal.',
  minimalis: 'Konsep clean & simple dengan palet netral. Mengutamakan ruang terbuka, sedikit ornamen, dan cahaya alami yang melimpah.',
  klasik:    'Arsitektur elegan bergaya kolonial dengan detail dekoratif, atap pelana tinggi, dan pilar-pilar megah yang timeless.',
  tropis:    'Desain organik yang bersatu dengan alam. Ventilasi silang alami, taman terintegrasi, dan material lokal yang berkelanjutan.'
};

function renderHouseSVG() {
  const { type, floor, style } = simState;
  const colors = styleColors[style];
  const floors = parseInt(floor);
  const isLarge = type === 'type72' || type === 'type120';
  const hasGarage = type !== 'type36';

  const svgW = 400, svgH = 280;
  const baseY = 220;
  const houseW = isLarge ? 200 : 160;
  const floorH = 55;
  const houseH = floors * floorH;
  const houseX = hasGarage ? 80 : (svgW - houseW) / 2;

  let garageSection = '';
  if (hasGarage) {
    const gW = 80, gH = 70, gX = houseX + houseW;
    garageSection = `
      <rect x="${gX}" y="${baseY - gH}" width="${gW}" height="${gH}" fill="${colors.wall}" stroke="${colors.accent}" stroke-width="1.5" rx="2"/>
      <rect x="${gX + 8}" y="${baseY - gH + 15}" width="${gW - 16}" height="${gH - 20}" fill="${colors.accent}" opacity="0.3" rx="2"/>
      <line x1="${gX}" y1="${baseY - gH + 15}" x2="${gX + gW}" y2="${baseY - gH + 15}" stroke="${colors.accent}" stroke-width="1"/>
      <line x1="${gX}" y1="${baseY - gH + 30}" x2="${gX + gW}" y2="${baseY - gH + 30}" stroke="${colors.accent}" stroke-width="1" opacity="0.5"/>
      <line x1="${gX}" y1="${baseY - gH + 45}" x2="${gX + gW}" y2="${baseY - gH + 45}" stroke="${colors.accent}" stroke-width="1" opacity="0.3"/>
      <polygon points="${gX},${baseY - gH} ${gX + gW/2},${baseY - gH - 25} ${gX + gW},${baseY - gH}" fill="${colors.roof}" opacity="0.9"/>
    `;
  }

  // Windows per floor
  let windows = '';
  const wCount = isLarge ? 3 : 2;
  const wW = 28, wH = 24;
  const wSpacing = houseW / (wCount + 1);
  for (let f = 0; f < floors; f++) {
    const fy = baseY - houseH + f * floorH;
    for (let w = 0; w < wCount; w++) {
      const wx = houseX + wSpacing * (w + 1) - wW / 2;
      const wy = fy + 15;
      windows += `
        <rect x="${wx}" y="${wy}" width="${wW}" height="${wH}" fill="${colors.window}" rx="2" opacity="0.8"/>
        <line x1="${wx + wW/2}" y1="${wy}" x2="${wx + wW/2}" y2="${wy + wH}" stroke="${colors.accent}" stroke-width="1" opacity="0.5"/>
        <line x1="${wx}" y1="${wy + wH/2}" x2="${wx + wW}" y2="${wy + wH/2}" stroke="${colors.accent}" stroke-width="1" opacity="0.5"/>
      `;
    }
  }

  // Door
  const doorW = 28, doorH = 40;
  const doorX = houseX + houseW / 2 - doorW / 2;
  const doorY = baseY - doorH;

  // Floor lines
  let floorLines = '';
  for (let f = 1; f < floors; f++) {
    const ly = baseY - f * floorH;
    floorLines += `<line x1="${houseX}" y1="${ly}" x2="${houseX + houseW}" y2="${ly}" stroke="${colors.accent}" stroke-width="1" opacity="0.3"/>`;
  }

  // Roof shape
  let roofPoints = '';
  if (style === 'modern') {
    roofPoints = `
      <rect x="${houseX - 10}" y="${baseY - houseH - 20}" width="${houseW + 20}" height="20" fill="${colors.roof}" rx="2"/>
      <rect x="${houseX}" y="${baseY - houseH - 35}" width="${houseW * 0.6}" height="15" fill="${colors.roof}" opacity="0.8" rx="2"/>
    `;
  } else if (style === 'tropis') {
    roofPoints = `
      <polygon points="${houseX - 20},${baseY - houseH} ${houseX + houseW/2},${baseY - houseH - 60} ${houseX + houseW + 20},${baseY - houseH}" fill="${colors.roof}" opacity="0.9"/>
      ${floors > 1 ? `<polygon points="${houseX - 10},${baseY - floorH} ${houseX + houseW/2},${baseY - floorH - 40} ${houseX + houseW + 10},${baseY - floorH}" fill="${colors.roof}" opacity="0.7"/>` : ''}
    `;
  } else {
    roofPoints = `
      <polygon points="${houseX - 15},${baseY - houseH} ${houseX + houseW/2},${baseY - houseH - 55} ${houseX + houseW + 15},${baseY - houseH}" fill="${colors.roof}" opacity="0.9"/>
    `;
  }

  // Decorative elements
  let extras = '';
  if (style === 'klasik') {
    extras = `
      <rect x="${houseX + 10}" y="${baseY - houseH}" width="12" height="${houseH}" fill="${colors.accent}" opacity="0.3" rx="2"/>
      <rect x="${houseX + houseW - 22}" y="${baseY - houseH}" width="12" height="${houseH}" fill="${colors.accent}" opacity="0.3" rx="2"/>
    `;
  }
  if (type === 'type120') {
    extras += `
      <rect x="${houseX - 25}" y="${baseY - 80}" width="25" height="80" fill="${colors.wall}" stroke="${colors.accent}" stroke-width="1.5"/>
      <rect x="${houseX - 22}" y="${baseY - 65}" width="19}" height="25" fill="${colors.window}" rx="1" opacity="0.7"/>
    `;
  }

  // Ground & landscape
  const ground = `
    <rect x="20" y="${baseY}" width="${svgW - 40}" height="50" fill="url(#grassGrad)" rx="4"/>
    <ellipse cx="${houseX + houseW/2}" cy="${baseY + 5}" rx="${houseW * 0.4}" ry="8" fill="rgba(0,0,0,0.2)"/>
    <!-- Trees -->
    <rect x="30" y="${baseY - 60}" width="8" height="60" fill="#5a3825" rx="2"/>
    <ellipse cx="34" cy="${baseY - 65}" rx="22" ry="25" fill="#2d7a3a" opacity="0.8"/>
    <rect x="${svgW - 60}" y="${baseY - 50}" width="7" height="50" fill="#5a3825" rx="2"/>
    <ellipse cx="${svgW - 57}" cy="${baseY - 55}" rx="18" ry="20" fill="#3a9a48" opacity="0.7"/>
    <!-- Path -->
    <polygon points="${doorX},${baseY} ${doorX - 10},${baseY + 40} ${doorX + doorW + 10},${baseY + 40} ${doorX + doorW},${baseY}" fill="#c8b98a" opacity="0.6"/>
  `;

  return `
    <svg viewBox="0 0 ${svgW} ${svgH + 30}" xmlns="http://www.w3.org/2000/svg" style="filter:drop-shadow(0 10px 30px rgba(0,0,0,0.3))">
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0a1628"/>
          <stop offset="100%" stop-color="#1a2a4a"/>
        </linearGradient>
        <linearGradient id="grassGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#2d7a3a"/>
          <stop offset="100%" stop-color="#1a4a22"/>
        </linearGradient>
      </defs>
      <!-- Sky -->
      <rect width="${svgW}" height="${svgH + 30}" fill="url(#skyGrad)" rx="12"/>
      <!-- Stars -->
      <circle cx="60" cy="30" r="1" fill="white" opacity="0.5"/>
      <circle cx="120" cy="20" r="1.5" fill="white" opacity="0.4"/>
      <circle cx="280" cy="15" r="1" fill="white" opacity="0.6"/>
      <circle cx="340" cy="35" r="1" fill="white" opacity="0.3"/>
      <!-- Moon -->
      <circle cx="${svgW - 50}" cy="35" r="18" fill="#f9e4b7" opacity="0.8"/>
      <circle cx="${svgW - 43}" cy="30" r="14" fill="#1a2a4a" opacity="0.9"/>
      <!-- House body -->
      <rect x="${houseX}" y="${baseY - houseH}" width="${houseW}" height="${houseH}" fill="${colors.wall}" stroke="${colors.accent}" stroke-width="1.5" rx="2"/>
      ${extras}
      ${floorLines}
      ${windows}
      <!-- Door -->
      <rect x="${doorX}" y="${doorY}" width="${doorW}" height="${doorH}" fill="${colors.accent}" opacity="0.5" rx="2"/>
      <circle cx="${doorX + doorW - 5}" cy="${doorY + doorH/2}" r="2.5" fill="${colors.roof}"/>
      <!-- Roof -->
      ${roofPoints}
      <!-- Garage -->
      ${garageSection}
      <!-- Ground -->
      ${ground}
    </svg>
  `;
}

function updateSimulator() {
  const { type, floor, style } = simState;
  const data = houseData[type];
  const floors = parseInt(floor);
  const typeLabel = { type36: 'Tipe 36', type45: 'Tipe 45', type72: 'Tipe 72', type120: 'Tipe 120' };
  const styleLabel = { modern: 'Modern', minimalis: 'Minimalis', klasik: 'Klasik', tropis: 'Tropis' };

  document.getElementById('simCanvas').innerHTML = renderHouseSVG();
  document.getElementById('simTitle').textContent = `Rumah ${styleLabel[style]} ${typeLabel[type]} — ${floor} Lantai`;
  document.getElementById('specArea').textContent = `${parseInt(data.area) * floors} m² (${data.area}/lantai)`;
  document.getElementById('specBed').textContent = data.bed;
  document.getElementById('specBath').textContent = data.bath;
  document.getElementById('specGarage').textContent = data.garage;
  document.getElementById('simDesc').textContent = styleDescs[style];
}

// Bind simulator controls
['simType', 'simFloor', 'simStyle'].forEach(groupId => {
  document.getElementById(groupId)?.querySelectorAll('.sim-opt').forEach(btn => {
    btn.addEventListener('click', function () {
      const group = this.closest('.sim-options');
      group.querySelectorAll('.sim-opt').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const val = this.getAttribute('data-val');
      if (groupId === 'simType') simState.type = val;
      else if (groupId === 'simFloor') simState.floor = val;
      else if (groupId === 'simStyle') simState.style = val;
      updateSimulator();
    });
  });
});

updateSimulator();


// ============================================================
// 11. COST CALCULATOR
// ============================================================

// Price per m² by building type and quality (in millions IDR)
const priceTable = {
  rumah_tinggal: { ekonomis: 3.5, standar: 5.5, premium: 9.0 },
  rumah_mewah:   { ekonomis: 6.0, standar: 9.0, premium: 16.0 },
  ruko:          { ekonomis: 4.0, standar: 6.0, premium: 10.0 },
  gedung:        { ekonomis: 5.5, standar: 8.5, premium: 14.0 },
  villa:         { ekonomis: 7.0, standar: 11.0, premium: 18.0 },
  gudang:        { ekonomis: 2.0, standar: 3.5, premium: 5.5 }
};

// Duration estimate (weeks per 100m²)
const durationTable = {
  rumah_tinggal: 12, rumah_mewah: 20, ruko: 14,
  gedung: 24, villa: 22, gudang: 8
};

function formatRupiah(num) {
  if (num >= 1e9) return `Rp ${(num / 1e9).toFixed(1)} Miliar`;
  if (num >= 1e6) return `Rp ${(num / 1e6).toFixed(0)} Juta`;
  return `Rp ${num.toLocaleString('id-ID')}`;
}

window.calculateCost = function () {
  const area = parseFloat(document.getElementById('calcArea').value);
  const type = document.getElementById('calcType').value;
  const quality = document.querySelector('input[name="quality"]:checked').value;
  const floors = parseInt(document.getElementById('calcFloor').value);

  if (!area || area < 20) {
    showToast('Masukkan luas bangunan minimal 20 m²', 'error');
    return;
  }

  const pricePerM2 = priceTable[type][quality] * 1e6;
  const floorMultiplier = 1 + (floors - 1) * 0.15; // 15% add per floor
  const construction = area * pricePerM2 * floorMultiplier;
  const design = construction * 0.05;
  const supervision = construction * 0.03;
  const total = construction + design + supervision;

  const baseWeeks = durationTable[type];
  const durationWeeks = Math.ceil((area / 100) * baseWeeks * floors);
  const durationText = durationWeeks > 52
    ? `±${Math.round(durationWeeks / 4.3)} Bulan`
    : `±${durationWeeks} Minggu (${Math.round(durationWeeks / 4.3)} Bulan)`;

  document.getElementById('resCost').textContent = formatRupiah(construction);
  document.getElementById('resDesign').textContent = formatRupiah(design);
  document.getElementById('resSupervision').textContent = formatRupiah(supervision);
  document.getElementById('resTotal').textContent = formatRupiah(total);
  document.getElementById('resTime').textContent = durationText;

  document.getElementById('resultPlaceholder').style.display = 'none';
  document.getElementById('resultData').style.display = 'block';

  // Animate result
  document.getElementById('calcResult').style.transform = 'scale(1.02)';
  setTimeout(() => { document.getElementById('calcResult').style.transform = ''; }, 300);

  showToast('Estimasi biaya berhasil dihitung!', 'success');
};

// Quality card selection
document.querySelectorAll('.quality-opt input').forEach(radio => {
  radio.addEventListener('change', function () {
    document.querySelectorAll('.quality-card').forEach(c => c.classList.remove('active'));
    this.nextElementSibling.classList.add('active');
  });
});


// ============================================================
// 12. BOOKING FORM
// ============================================================
window.handleFileUpload = function (input) {
  const label = document.getElementById('fileLabel');
  if (input.files.length > 0) {
    const file = input.files[0];
    if (file.size > 5 * 1024 * 1024) {
      showToast('Ukuran file maksimal 5MB', 'error');
      input.value = '';
      return;
    }
    label.textContent = `✓ ${file.name}`;
    document.getElementById('fileUpload').style.borderColor = 'var(--gold)';
    document.getElementById('fileUpload').style.color = 'var(--gold)';
  }
};

window.submitBooking = function (e) {
  e.preventDefault();
  const name = document.getElementById('bName').value;
  const wa = document.getElementById('bWa').value;

  if (!name || !wa) {
    showToast('Lengkapi nama dan nomor WhatsApp', 'error');
    return;
  }

  // Simulate submission with loading
  const btn = e.target.querySelector('button[type="submit"]');
  const originalHTML = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
  btn.disabled = true;

  setTimeout(() => {
    document.getElementById('bookingForm').style.display = 'none';
    document.getElementById('bookingSuccess').style.display = 'block';
    document.getElementById('successName').textContent = name;
    showToast('Booking berhasil dikirim! 🎉', 'success');
  }, 1800);
};


// ============================================================
// 13. CONTACT FORM
// ============================================================
window.submitContact = function (e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-check"></i> Pesan Terkirim!';
    btn.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';
    e.target.reset();
    showToast('Pesan berhasil dikirim! Kami akan segera membalas.', 'success');
    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Kirim Pesan';
      btn.style.background = '';
      btn.disabled = false;
    }, 4000);
  }, 1800);
};


// ============================================================
// 14. TESTIMONIALS SLIDER
// ============================================================
const testimonials = [
  {
    name: 'Budi Santoso', role: 'CEO, PT Maju Bersama', project: 'Gedung Perkantoran 5 Lantai',
    text: 'Nusantara Construction benar-benar melampaui ekspektasi kami. Gedung selesai tepat waktu dengan kualitas konstruksi yang sangat baik. Tim mereka sangat profesional dan komunikatif.',
    rating: 5, initials: 'BS'
  },
  {
    name: 'Dewi Rahayu', role: 'Pemilik Rumah', project: 'Rumah Mewah BSD City',
    text: 'Rumah impian kami akhirnya terwujud! Desainnya indah, pengerjaan rapi, dan mereka selalu memberikan update progress. Sangat puas dan tidak akan ragu merekomendasikan ke teman.',
    rating: 5, initials: 'DR'
  },
  {
    name: 'Ahmad Fauzi', role: 'Pengusaha', project: 'Renovasi Ruko 3 Lantai',
    text: 'Renovasi ruko saya selesai 2 minggu lebih cepat dari jadwal! Material yang digunakan berkualitas tinggi dan hasilnya memuaskan. Harga kompetitif dengan kualitas premium.',
    rating: 5, initials: 'AF'
  },
  {
    name: 'Siti Nurhaliza', role: 'Arsitek', project: 'Desain Interior Kantor',
    text: 'Sebagai sesama profesional di bidang desain, saya sangat menghargai ketelitian dan perhatian terhadap detail yang ditunjukkan tim Nusantara. Kolaborasi yang luar biasa!',
    rating: 5, initials: 'SN'
  },
  {
    name: 'Robert Tanaka', role: 'Investor Properti', project: 'Apartemen 10 Unit',
    text: 'Sudah 3 proyek saya percayakan ke Nusantara Construction. Setiap proyek selalu on-budget dan on-time. Ini yang membedakan mereka dari kontraktor lain.',
    rating: 5, initials: 'RT'
  },
  {
    name: 'Maya Kusuma', role: 'Interior Designer', project: 'Villa Bali Premium',
    text: 'Kolaborasi terbaik yang pernah saya alami. Tim Nusantara memahami visi desain dengan sempurna dan mengeksekusinya dengan presisi tinggi. Hasilnya spektakuler!',
    rating: 5, initials: 'MK'
  }
];

let sliderIndex = 0;
let sliderVisible = 3;
let autoSlideInterval;

function getVisibleCount() {
  if (window.innerWidth < 768) return 1;
  if (window.innerWidth < 1024) return 2;
  return 3;
}

function renderTestimonials() {
  const track = document.getElementById('testimonialsTrack');
  track.innerHTML = testimonials.map(t => `
    <div class="testimonial-card">
      <div class="testi-rating">
        ${Array(t.rating).fill('<i class="fas fa-star"></i>').join('')}
      </div>
      <p class="testi-text">${t.text}</p>
      <div class="testi-author">
        <div class="testi-avatar">${t.initials}</div>
        <div>
          <div class="testi-name">${t.name}</div>
          <div class="testi-role">${t.role}</div>
          <div class="testi-project"><i class="fas fa-hard-hat"></i> ${t.project}</div>
        </div>
      </div>
    </div>
  `).join('');

  // Dots
  const dotsContainer = document.getElementById('sliderDots');
  const totalSlides = testimonials.length - getVisibleCount() + 1;
  dotsContainer.innerHTML = Array(totalSlides).fill(0).map((_, i) =>
    `<div class="slider-dot ${i === 0 ? 'active' : ''}" onclick="goToSlide(${i})"></div>`
  ).join('');
}

function updateSlider() {
  const track = document.getElementById('testimonialsTrack');
  sliderVisible = getVisibleCount();
  const cardWidth = track.querySelector('.testimonial-card')?.offsetWidth || 0;
  const gap = 24;
  const maxIndex = testimonials.length - sliderVisible;
  sliderIndex = Math.max(0, Math.min(sliderIndex, maxIndex));
  track.style.transform = `translateX(-${sliderIndex * (cardWidth + gap)}px)`;

  // Update dots
  document.querySelectorAll('.slider-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === sliderIndex);
  });
}

window.goToSlide = function(index) {
  sliderIndex = index;
  updateSlider();
  resetAutoSlide();
};

document.getElementById('sliderNext').addEventListener('click', () => {
  sliderIndex = Math.min(sliderIndex + 1, testimonials.length - getVisibleCount());
  updateSlider();
  resetAutoSlide();
});

document.getElementById('sliderPrev').addEventListener('click', () => {
  sliderIndex = Math.max(sliderIndex - 1, 0);
  updateSlider();
  resetAutoSlide();
});

function resetAutoSlide() {
  clearInterval(autoSlideInterval);
  autoSlideInterval = setInterval(() => {
    const maxIdx = testimonials.length - getVisibleCount();
    sliderIndex = sliderIndex >= maxIdx ? 0 : sliderIndex + 1;
    updateSlider();
  }, 4000);
}

renderTestimonials();
setTimeout(() => { updateSlider(); resetAutoSlide(); }, 500);
window.addEventListener('resize', () => { renderTestimonials(); setTimeout(updateSlider, 100); });


// ============================================================
// 15. BLOG DATA & RENDERING
// ============================================================
const blogPosts = [
  {
    title: '10 Tips Membangun Rumah Impian dengan Budget Terbatas',
    excerpt: 'Wujudkan hunian idaman tanpa harus menguras kantong. Berikut strategi cerdas dari para ahli konstruksi kami...',
    category: 'Tips Bangun Rumah',
    date: '15 Nov 2024',
    readTime: '7 mnt',
    icon: '🏠',
    color: '#2450a0'
  },
  {
    title: 'Cara Memilih Kontraktor Terpercaya: 8 Red Flag yang Harus Diwaspadai',
    excerpt: 'Jangan sampai proyek impian Anda jadi mimpi buruk. Pelajari tanda-tanda kontraktor bermasalah sebelum terlambat...',
    category: 'Panduan',
    date: '8 Nov 2024',
    readTime: '5 mnt',
    icon: '⚠️',
    color: '#c9a227'
  },
  {
    title: 'Estimasi Biaya Bangun Rumah 2024: Panduan Lengkap per Kota',
    excerpt: 'Harga material dan upah konstruksi terus berubah. Update terbaru harga bangun rumah di Jakarta, Surabaya, dan Bali...',
    category: 'Estimasi Biaya',
    date: '1 Nov 2024',
    readTime: '10 mnt',
    icon: '💰',
    color: '#00b894'
  },
  {
    title: 'Tren Desain Rumah 2025: Dari Biophilic Design hingga Smart Home',
    excerpt: 'Apa yang akan mendominasi dunia arsitektur di 2025? Para desainer kami berbagi insight tentang tren terkini...',
    category: 'Tren Desain',
    date: '25 Okt 2024',
    readTime: '6 mnt',
    icon: '✨',
    color: '#6c5ce7'
  },
  {
    title: 'Renovasi Dapur: Transformasi Total dengan Budget Rp 50 Juta',
    excerpt: 'Studi kasus nyata renovasi dapur sempit jadi modern dan fungsional. Termasuk breakdown biaya detail...',
    category: 'Tips Renovasi',
    date: '18 Okt 2024',
    readTime: '8 mnt',
    icon: '🔨',
    color: '#e17055'
  },
  {
    title: 'Green Building: Investasi Masa Depan yang Hemat Energi',
    excerpt: 'Bangunan ramah lingkungan bukan lagi kemewahan — ini kebutuhan. Pelajari teknologi green building terjangkau...',
    category: 'Green Building',
    date: '10 Okt 2024',
    readTime: '9 mnt',
    icon: '🌿',
    color: '#2d7a3a'
  }
];

function renderBlog() {
  const grid = document.getElementById('blogGrid');
  grid.innerHTML = blogPosts.map((post, i) => `
    <div class="blog-card" data-aos="fade-up" data-aos-delay="${i * 100}">
      <div class="blog-img" style="background: linear-gradient(135deg, ${post.color}33, ${post.color}11);">
        <span style="font-size:3rem;">${post.icon}</span>
        <div class="blog-img-overlay"></div>
      </div>
      <div class="blog-body">
        <div class="blog-meta">
          <span class="blog-cat">${post.category}</span>
          <span><i class="fas fa-calendar"></i> ${post.date}</span>
          <span><i class="fas fa-clock"></i> ${post.readTime}</span>
        </div>
        <h3>${post.title}</h3>
        <p>${post.excerpt}</p>
        <a href="#" class="blog-read">Baca Selengkapnya <i class="fas fa-arrow-right"></i></a>
      </div>
    </div>
  `).join('');
}

renderBlog();


// ============================================================
// 16. TOAST NOTIFICATIONS
// ============================================================
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const icon = type === 'success' ? '✓' : '✗';
  toast.className = `toast ${type}`;
  toast.textContent = `${icon} ${message}`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}
window.showToast = showToast;


// ============================================================
// 17. SMOOTH SCROLL FOR ALL ANCHOR LINKS
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  });
});


// ============================================================
// 18. PARALLAX HERO EFFECT
// ============================================================
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero-content');
  const canvas = document.getElementById('heroCanvas');
  const scrollY = window.scrollY;
  if (hero && scrollY < window.innerHeight) {
    hero.style.transform = `translateY(${scrollY * 0.3}px)`;
    hero.style.opacity = 1 - scrollY / (window.innerHeight * 0.7);
    if (canvas) canvas.style.transform = `translateY(${scrollY * 0.2}px)`;
  }
});


// ============================================================
// 19. INTERSECTION OBSERVER for Counter Trigger
// ============================================================
const statsSection = document.querySelector('.hero-stats');
let countersDone = false;
const statsObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !countersDone) {
    countersDone = true;
    startCounters();
  }
}, { threshold: 0.3 });
if (statsSection) statsObserver.observe(statsSection);


// ============================================================
// 20. KEYBOARD NAVIGATION
// ============================================================
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') {
    sliderIndex = Math.min(sliderIndex + 1, testimonials.length - getVisibleCount());
    updateSlider();
  } else if (e.key === 'ArrowLeft') {
    sliderIndex = Math.max(sliderIndex - 1, 0);
    updateSlider();
  }
});


// ============================================================
// 21. INIT LOG
// ============================================================
console.log('%cNusantara Construction', 'font-size:18px;font-weight:bold;color:#c9a227;');
console.log('%cWebsite v2.0 — Built with ❤️ in Indonesia', 'color:#8a9bbf;');
