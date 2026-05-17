(() => {
  const navToggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-nav]');
  const header = document.querySelector('[data-header]');
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.prepend(progress);

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

  const parallaxElements = document.querySelectorAll('[data-parallax]');
  let ticking = false;

  const updateScrollEffects = () => {
    const scrollTop = window.scrollY || window.pageYOffset;
    const maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1);
    const progressValue = Math.min(scrollTop / maxScroll, 1);

    root.style.setProperty('--scroll-progress', progressValue.toFixed(4));
    root.style.setProperty('--scroll-y', `${scrollTop.toFixed(0)}px`);
    header?.classList.toggle('is-scrolled', scrollTop > 14);

    if (!reduceMotion) {
      parallaxElements.forEach((element) => {
        const depth = Number(element.dataset.parallax || 0.04);
        const rect = element.getBoundingClientRect();
        const viewportOffset = (rect.top + rect.height / 2) - window.innerHeight / 2;
        const translate = Math.max(Math.min(viewportOffset * depth, 28), -28);
        element.style.setProperty('--parallax-y', `${translate.toFixed(2)}px`);
      });
    }

    ticking = false;
  };

  const requestScrollUpdate = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollEffects);
      ticking = true;
    }
  };

  window.addEventListener('scroll', requestScrollUpdate, { passive: true });
  window.addEventListener('resize', requestScrollUpdate);
  updateScrollEffects();

  const revealElements = document.querySelectorAll('.reveal');
  revealElements.forEach((element, index) => {
    element.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 80}ms`);
  });

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
