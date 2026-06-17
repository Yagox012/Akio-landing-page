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

  /* ---------- 3. Contador de cupos disponibles ---------- */
  const cuposEl = document.getElementById('cupos-counter');
  if (cuposEl) {
    const total = parseInt(cuposEl.dataset.total, 10) || 5;
    const taken = parseInt(cuposEl.dataset.taken, 10) || 0;
    const available = Math.max(0, total - taken);

    // Renderizar los puntos
    const dotsEl = document.getElementById('cupos-dots');
    if (dotsEl) {
      for (let i = 0; i < total; i++) {
        const dot = document.createElement('div');
        dot.className = i < taken ? 'cupo-dot cupo-dot--taken' : 'cupo-dot cupo-dot--available';
        dot.setAttribute('aria-hidden', 'true');
        dotsEl.appendChild(dot);
      }
    }

    // Actualizar texto
    const textEl = document.getElementById('cupos-text');
    if (textEl) {
      if (available === 0) {
        textEl.textContent = '¡Cupos agotados! Únete a la lista de espera.';
        textEl.style.color = 'rgba(255, 100, 100, 0.85)';
      } else if (available === 1) {
        textEl.textContent = '¡Solo queda 1 cupo disponible!';
      } else {
        textEl.textContent = `${available} de ${total} cupos disponibles`;
      }
    }
  }

  /* ---------- 4. Formulario → WhatsApp ---------- */
  const form = document.getElementById('contact-form');
  const formError = document.getElementById('form-error');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name  = form.name.value.trim();
      const biz   = form.biz.value.trim();
      const phone = form.phone.value.trim();
      const msg   = form.msg ? form.msg.value.trim() : '';

      // Validación básica
      if (!name || !biz || !phone) {
        formError.hidden = false;
        formError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      formError.hidden = true;

      // Armar mensaje de WhatsApp
      let waText = `Hola AKIO Studio 👋\n\nMe llamo *${name}* y tengo un negocio de *${biz}*.\n\nMe interesa la oferta de lanzamiento de $2,499 MXN. Mi WhatsApp es ${phone}.`;
      if (msg) waText += `\n\n${msg}`;

      // TODO: reemplazar 521000000000 con el número real de WhatsApp
      const waURL = `https://wa.me/521000000000?text=${encodeURIComponent(waText)}`;
      window.open(waURL, '_blank', 'noopener');
    });

    // Ocultar error al empezar a escribir
    form.addEventListener('input', () => { formError.hidden = true; });
  }

  /* ---------- 5. Reveal en cascada por scroll ---------- */
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
