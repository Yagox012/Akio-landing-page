/* ===================================================================
   AKIO STUDIO — Interactividad (Vanilla JS)
   - Nav compacta al hacer scroll
   - Menú móvil (toggle + cierre)
   - Reveal en cascada por scroll (IntersectionObserver)
   =================================================================== */

(function () {
  'use strict';

  /* ---------- 1. Navbar: compactar al hacer scroll ---------- */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 24);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- 2. Menú móvil ---------- */
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');

  if (toggle && menu) {
    const closeMenu = () => {
      menu.hidden = true;
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menú');
    };

    const openMenu = () => {
      menu.hidden = false;
      toggle.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Cerrar menú');
    };

    toggle.addEventListener('click', () => {
      menu.hidden ? openMenu() : closeMenu();
    });

    // Cerrar al hacer clic en un enlace del menú
    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !menu.hidden) closeMenu();
    });

    // Cerrar al redimensionar a escritorio
    window.addEventListener('resize', () => {
      if (window.innerWidth > 860 && !menu.hidden) closeMenu();
    });
  }

  /* ---------- 3. Reveal en cascada por scroll ---------- */
  const revealItems = document.querySelectorAll('.reveal-on-scroll');

  if (revealItems.length) {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
      );
      revealItems.forEach((item) => observer.observe(item));
    } else {
      // Fallback: mostrar todo si no hay soporte
      revealItems.forEach((item) => item.classList.add('is-visible'));
    }
  }
})();
