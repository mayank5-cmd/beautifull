document.documentElement.classList.add('js');

const revealElements = document.querySelectorAll('.reveal');
const parallaxElements = document.querySelectorAll('.parallax');
const galleryButtons = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxClose = document.getElementById('lightboxClose');
const filterButtons = document.querySelectorAll('.filter-btn');
const placeCards = document.querySelectorAll('.nature-card[data-category]');
const quoteTarget = document.getElementById('natureQuote');
const quoteButton = document.getElementById('newQuote');
const toTopButton = document.getElementById('toTop');
const petalLayer = document.querySelector('.petals');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const quotes = [
  '“Adopt the pace of nature: her secret is patience.”',
  '“Deep in their roots, all flowers keep the light.”',
  '“Heaven is under our feet as well as over our heads.”',
  '“Colors are the smiles of nature.”',
  '“Nature always wears the colors of the spirit.”',
  '“Between every two pines is a doorway to a new world.”'
];

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });
revealElements.forEach((el) => observer.observe(el));

setTimeout(() => {
  revealElements.forEach((el) => {
    if (!el.classList.contains('visible')) {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 1.15) el.classList.add('visible');
    }
  });
}, 1000);

let lastFocused = null;
const openLightbox = (button) => {
  const full = button.dataset.full;
  const image = button.querySelector('img');
  if (!full || !lightbox || !lightboxImage || !lightboxClose) return;
  lastFocused = button;
  lightboxImage.src = full;
  lightboxImage.alt = image?.alt ?? 'Nature image';
  lightbox.classList.add('active');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  lightboxClose.focus();
};
const closeLightbox = () => {
  if (!lightbox?.classList.contains('active')) return;
  lightbox.classList.remove('active');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lightboxImage) lightboxImage.src = '';
  lastFocused?.focus();
};

galleryButtons.forEach((button) => button.addEventListener('click', () => openLightbox(button)));
lightboxClose?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', (event) => { if (event.target === lightbox) closeLightbox(); });
window.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeLightbox(); });

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    placeCards.forEach((card) => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !show);
    });
  });
});

quoteButton?.addEventListener('click', () => {
  if (!quoteTarget) return;
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  quoteTarget.textContent = quote;
});

let parallaxTicking = false;
const updateParallax = () => {
  if (prefersReducedMotion) { parallaxTicking = false; return; }
  const scrollY = window.scrollY;
  parallaxElements.forEach((el) => {
    const speed = Number(el.dataset.speed) || 0.08;
    el.style.setProperty('--parallax-offset', `${Math.min(150, scrollY * speed)}px`);
  });
  parallaxTicking = false;
};

const toggleToTop = () => {
  if (!toTopButton) return;
  toTopButton.classList.toggle('visible', window.scrollY > 500);
};

window.addEventListener('scroll', () => {
  toggleToTop();
  if (parallaxTicking) return;
  parallaxTicking = true;
  window.requestAnimationFrame(updateParallax);
}, { passive: true });

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = link.getAttribute('href');
    if (!target || target === '#') return;
    const element = document.querySelector(target);
    if (!element) return;
    event.preventDefault();
    element.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });
});

toTopButton?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
});

const createPetal = () => {
  if (!petalLayer || prefersReducedMotion) return;
  const petal = document.createElement('span');
  petal.className = 'petal';
  const size = Math.random() * 10 + 8;
  petal.style.width = `${size}px`;
  petal.style.height = `${size * 0.7}px`;
  petal.style.left = `${Math.random() * 100}vw`;
  petal.style.opacity = `${Math.random() * 0.55 + 0.2}`;
  petal.style.animationDuration = `${Math.random() * 16 + 12}s`;
  petal.style.animationDelay = `${Math.random() * 8}s`;
  petalLayer.appendChild(petal);
  setTimeout(() => petal.remove(), 30000);
};

if (!prefersReducedMotion) {
  for (let i = 0; i < 18; i += 1) createPetal();
  setInterval(createPetal, 1800);
}

toggleToTop();
updateParallax();
