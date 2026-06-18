/* ===================================================================
   AKIO STUDIO — Interactividad (Vanilla JS)
   - Nav compacta + auto-hide al hacer scroll
   - Menú móvil (toggle + cierre animado)
   - Reveal en cascada por scroll (IntersectionObserver)
   =================================================================== */

(function () {
  'use strict';

  /* Refs compartidos */
  const toggle     = document.getElementById('menu-toggle');
  const menu       = document.getElementById('mobile-menu');

  /* ---------- 1. Navbar: compactar + auto-hide ---------- */
  const navbar     = document.getElementById('navbar');
  const navWrapper = navbar ? navbar.closest('.nav-wrapper') : null;
  let lastScrollY   = 0;
  let lastScrollTime = Date.now();
  let scrollVelocity = 0; // px/ms, suavizado con EMA

  if (navbar) {
    // Velocidad → duración: rápido = animación corta, lento = animación larga
    const MIN_DUR    = 0.08;  // s (scroll muy rápido)
    const MAX_DUR    = 0.45;  // s (scroll muy lento o pausa)
    const VEL_K      = 0.22;  // constante de escala: dur = VEL_K / velocity
    const EMA_ALPHA  = 0.4;   // suavizado EMA (0 = sin cambio, 1 = sin suavizado)

    const applyVelocityTransition = () => {
      const raw = scrollVelocity > 0.01 ? VEL_K / scrollVelocity : MAX_DUR;
      const dur = Math.min(MAX_DUR, Math.max(MIN_DUR, raw));
      navWrapper.style.setProperty('--nav-dur', `${dur.toFixed(2)}s`);
    };

    const onScroll = () => {
      const now = Date.now();
      const y   = window.scrollY;
      const dt  = now - lastScrollTime;
      const dy  = Math.abs(y - lastScrollY);

      // Actualizar velocidad EMA; resetear si el usuario pausó el scroll
      if (dt > 0 && dt < 200) {
        scrollVelocity = EMA_ALPHA * (dy / dt) + (1 - EMA_ALPHA) * scrollVelocity;
      } else if (dt >= 200) {
        scrollVelocity = 0;
      }

      // Compactar glass al bajar
      navbar.classList.toggle('scrolled', y > 24);

      // Auto-hide: ocultar al bajar, mostrar al subir
      if (navWrapper) {
        const menuOpen = menu && !menu.hidden && !menu.classList.contains('is-closing');
        if (!menuOpen) {
          if (y > lastScrollY && y > 80) {
            applyVelocityTransition();
            navWrapper.classList.add('nav-hidden');
          } else if (y < lastScrollY) {
            applyVelocityTransition();
            navWrapper.classList.remove('nav-hidden');
          }
        }
      }

      lastScrollY    = y;
      lastScrollTime = now;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- 2. Menú móvil ---------- */
  if (toggle && menu) {
    const closeMenu = () => {
      // Guardia: no cerrar si ya está cerrando o ya está oculto
      if (menu.classList.contains('is-closing') || menu.hidden) return;

      // Animar cierre, luego ocultar
      menu.classList.add('is-closing');
      menu.addEventListener('animationend', () => {
        menu.hidden = true;
        menu.classList.remove('is-closing');
      }, { once: true });

      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menú');
    };

    const openMenu = () => {
      menu.hidden = false;
      // Mostrar nav siempre que el menú abra
      if (navWrapper) navWrapper.classList.remove('nav-hidden');
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

    // Cerrar al hacer clic fuera del menú y del botón
    document.addEventListener('click', (e) => {
      if (!menu.hidden && !menu.contains(e.target) && !toggle.contains(e.target)) closeMenu();
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

    const dotsEl = document.getElementById('cupos-dots');
    if (dotsEl) {
      for (let i = 0; i < total; i++) {
        const dot = document.createElement('div');
        dot.className = i < taken ? 'cupo-dot cupo-dot--taken' : 'cupo-dot cupo-dot--available';
        dot.setAttribute('aria-hidden', 'true');
        dotsEl.appendChild(dot);
      }
    }

    const textEl = document.getElementById('cupos-text');
    if (textEl) {
      if (available === 0) {
        textEl.textContent = '¡Cupos agotados! Únete a la lista de espera.';
        textEl.style.color = 'rgba(255, 100, 100, 0.85)';
      } else if (available === 1) {
        textEl.textContent = '¡Solo queda 1 cupo disponible!';
      } else {
        textEl.textContent = `Solo quedan ${available} de ${total} cupos disponibles para este mes`;
      }
    }
  }

  /* ---------- 4. Formulario → WhatsApp ---------- */
  const form = document.getElementById('contact-form');
  const formError = document.getElementById('form-error');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = form.name.value.trim();
      const biz  = form.biz.value.trim();
      const msg  = form.msg ? form.msg.value.trim() : '';

      // Solo nombre y tipo de negocio son obligatorios
      if (!name || !biz) {
        formError.hidden = false;
        formError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      formError.hidden = true;

      // Construir mensaje de WhatsApp
      let waText = `Hola AKIO Studio, mi nombre es ${name} y me interesa la promoción de $1,999 para mi negocio de ${biz}.`;
      if (msg) waText += ` ${msg}`;

      const WA_NUMBER = '525580951666'; // REEMPLAZA AQUÍ CON TU NÚMERO REAL
      const waURL = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waText)}`;
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
      revealItems.forEach((item) => item.classList.add('is-visible'));
    }
  }
})();
