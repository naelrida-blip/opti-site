'use strict';

/* ─── DARK MODE ──────────────────────────────────────────────── */
const html   = document.documentElement;
const toggle = document.getElementById('themeToggle');

// Lire la préférence sauvegardée, sinon utiliser la préférence système
const saved = localStorage.getItem('opti-theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialTheme = saved || (prefersDark ? 'dark' : 'light');
html.setAttribute('data-theme', initialTheme);

toggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('opti-theme', next);
});

// Suivre les changements système si pas de préférence sauvegardée
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  if (!localStorage.getItem('opti-theme')) {
    html.setAttribute('data-theme', e.matches ? 'dark' : 'light');
  }
});

/* ─── NAV ACTIVE AU SCROLL ────────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle(
          'active',
          link.getAttribute('href') === '#' + entry.target.id
        );
      });
    }
  });
}, { rootMargin: '-30% 0px -60% 0px' });

sections.forEach(s => observer.observe(s));

/* ─── NAV SHADOW AU SCROLL ────────────────────────────────────── */
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.style.boxShadow = window.scrollY > 10
    ? '0 1px 20px rgba(0,0,0,0.08)'
    : 'none';
}, { passive: true });

/* ─── SMOOTH SCROLL POUR LES ANCRES INTERNES ─────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 70; // hauteur nav
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ─── ANIMATION D'APPARITION ─────────────────────────────────── */
const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.feature-card, .step, .faq-item').forEach(el => {
  el.classList.add('fade-in');
  fadeObserver.observe(el);
});

/* ─── STYLE ANIMATION ─────────────────────────────────────────── */
const style = document.createElement('style');
style.textContent = `
  .fade-in {
    opacity: 0;
    transform: translateY(18px);
    transition: opacity 0.45s ease, transform 0.45s ease;
  }
  .fade-in.visible {
    opacity: 1;
    transform: none;
  }
  .nav-links a.active { color: var(--text); font-weight: 600; }
`;
document.head.appendChild(style);
