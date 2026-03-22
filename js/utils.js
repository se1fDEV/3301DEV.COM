/* ===== Shared UI utilities ===== */
(function () {

  /* --- Mobile nav toggle --- */
  var navToggle = document.querySelector('.nav-toggle');
  var mainNav   = document.getElementById('mainNav');
  if (navToggle && mainNav) {
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.addEventListener('click', function () {
      var isOpen = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('click', function (e) {
      if (!mainNav.contains(e.target) && !navToggle.contains(e.target)) {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* --- Scroll to top --- */
  var btn = document.getElementById('scrollTop');
  if (btn) {
    btn.setAttribute('tabindex', '-1');

    window.addEventListener('scroll', function () {
      var visible = window.scrollY > 400;
      btn.classList.toggle('visible', visible);
      btn.setAttribute('tabindex', visible ? '0' : '-1');
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* --- Scroll reveal --- */
  if ('IntersectionObserver' in window) {
    var revealEls = document.querySelectorAll('.card, .step, .team-card, .pricing-card, .faq-item');
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach(function (el, i) {
      el.classList.add('reveal');
      el.style.transitionDelay = (i % 4 * 80) + 'ms';
      observer.observe(el);
    });
  }

})();
