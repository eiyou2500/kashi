(() => {
  const navToggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-nav]');

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isOpen));
      nav.classList.toggle('is-open', !isOpen);
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
      });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        navToggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
      }
    });
  }

  const yearElements = document.querySelectorAll('[data-year]');
  const thisYear = new Date().getFullYear();
  yearElements.forEach((element) => {
    element.textContent = thisYear;
  });

  const revealElements = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    revealElements.forEach((element) => element.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.14,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach((element) => observer.observe(element));
})();
