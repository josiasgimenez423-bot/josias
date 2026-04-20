/* ============================================================
   AirMax — Aire Acondicionado Profesional
   script.js
   ============================================================ */

/* ── 1. NAVBAR: scroll y hamburguesa ───────────────────── */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const toggle    = document.getElementById('navToggle');
  const navMenu   = document.getElementById('navMenu');
  const navLinks  = navMenu.querySelectorAll('.nav-link');

  /* Agrega clase "scrolled" cuando el usuario hace scroll */
  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
    updateActiveLink();
  }

  /* Abre / cierra el menú mobile */
  toggle.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
  });

  /* Cierra el menú al hacer clic en un link */
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* Cierra el menú al hacer clic fuera */
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      navMenu.classList.remove('open');
      toggle.classList.remove('open');
    }
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Estado inicial
})();


/* ── 2. SCROLL SUAVE (por compatibilidad con Safari ≤ 15) ── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const navbarH = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--navbar-h'),
        10
      ) || 72;

      const top = target.getBoundingClientRect().top + window.scrollY - navbarH + 4;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ── 3. LINK ACTIVO EN NAVBAR SEGÚN SECCIÓN VISIBLE ─────── */
function updateActiveLink() {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');
  const navbarH   = 80;

  let currentId = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - navbarH - 20;
    if (window.scrollY >= sectionTop) {
      currentId = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentId}`) {
      link.classList.add('active');
    }
  });
}


/* ── 4. ANIMACIONES DE ENTRADA AL HACER SCROLL ──────────── */
(function initScrollAnimations() {
  const elements = document.querySelectorAll('[data-animate]');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el    = entry.target;
          const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0;

          setTimeout(() => {
            el.classList.add('in-view');
          }, delay);

          observer.unobserve(el); // Solo se anima una vez
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  elements.forEach(el => observer.observe(el));
})();


/* ── 5. VALIDACIÓN Y ENVÍO DEL FORMULARIO ──────────────── */
(function initForm() {
  const form       = document.getElementById('contactForm');
  const submitBtn  = document.getElementById('submitBtn');
  const successDiv = document.getElementById('formSuccess');

  if (!form) return;

  /* ── Helpers de validación ── */
  function showError(fieldId, msg) {
    const group = document.getElementById(fieldId).closest('.form-group');
    const errEl = document.getElementById(`err-${fieldId}`);
    group.classList.add('has-error');
    if (errEl) errEl.textContent = msg;
  }

  function clearError(fieldId) {
    const group = document.getElementById(fieldId).closest('.form-group');
    const errEl = document.getElementById(`err-${fieldId}`);
    group.classList.remove('has-error');
    if (errEl) errEl.textContent = '';
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  /* ── Validación en tiempo real (blur) ── */
  ['nombre', 'email', 'mensaje'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;

    el.addEventListener('blur', () => validateField(id));
    el.addEventListener('input', () => {
      if (el.closest('.form-group').classList.contains('has-error')) {
        validateField(id);
      }
    });
  });

  function validateField(id) {
    const el = document.getElementById(id);
    if (!el) return true;

    const val = el.value.trim();

    if (id === 'nombre') {
      if (!val) { showError('nombre', 'El nombre es obligatorio.'); return false; }
      if (val.length < 3) { showError('nombre', 'Ingresá al menos 3 caracteres.'); return false; }
      clearError('nombre'); return true;
    }

    if (id === 'email') {
      if (!val) { showError('email', 'El correo es obligatorio.'); return false; }
      if (!isValidEmail(val)) { showError('email', 'Ingresá un correo válido.'); return false; }
      clearError('email'); return true;
    }

    if (id === 'mensaje') {
      if (!val) { showError('mensaje', 'El mensaje es obligatorio.'); return false; }
      if (val.length < 15) { showError('mensaje', 'El mensaje debe tener al menos 15 caracteres.'); return false; }
      clearError('mensaje'); return true;
    }

    return true;
  }

  /* ── Validación completa antes de enviar ── */
  function validateAll() {
    const fields    = ['nombre', 'email', 'mensaje'];
    const allValid  = fields.map(validateField).every(Boolean);
    return allValid;
  }

  /* ── Submit ── */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    successDiv.classList.remove('visible');

    if (!validateAll()) return;

    /* Estado de carga */
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');

    /* Simula llamada a servidor (1.8s) */
    await new Promise(resolve => setTimeout(resolve, 1800));

    /* Éxito */
    submitBtn.disabled = false;
    submitBtn.classList.remove('loading');

    /* Muestra mensaje de éxito */
    successDiv.classList.add('visible');
    form.reset();

    /* Scroll suave al mensaje de confirmación */
    successDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    /* Oculta el mensaje después de 7 segundos */
    setTimeout(() => successDiv.classList.remove('visible'), 7000);
  });
})();


/* ── 6. BOTÓN "VOLVER ARRIBA" ───────────────────────────── */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ── 7. CONTADOR ANIMADO (stats del hero) ───────────────── */
(function initCounters() {
  const stats = document.querySelectorAll('.stat strong');
  if (!stats.length) return;

  /* Extrae el número de un texto como "+2 400", "98%", "24 h" */
  function parseNumber(text) {
    const num = text.replace(/[^0-9]/g, '');
    return parseInt(num, 10) || 0;
  }

  function animateCounter(el) {
    const original = el.textContent;
    const target   = parseNumber(original);
    if (!target) return;

    const prefix   = original.match(/^[^\d]*/)?.[0] ?? '';
    const suffix   = original.match(/[^\d]*$/)?.[0] ?? '';

    let start = null;
    const duration = 1800;

    function step(timestamp) {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      /* Ease-out quart */
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(eased * target);

      /* Formatea con separador de miles */
      el.textContent = prefix + current.toLocaleString('es-AR') + suffix;

      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = original; // Restaura texto original exacto
    }

    requestAnimationFrame(step);
  }

  /* Observa la sección hero para disparar contadores */
  const heroSection = document.getElementById('inicio');
  if (!heroSection) return;

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        stats.forEach(animateCounter);
        observer.disconnect();
      }
    },
    { threshold: 0.5 }
  );

  observer.observe(heroSection);
})();
