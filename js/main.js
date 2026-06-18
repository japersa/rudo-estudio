document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  const navLinks = nav ? [...nav.querySelectorAll('.nav__link')] : [];
  const logos = [...document.querySelectorAll('.logo--header, .logo--footer')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let activeSectionId = null;

  function pulseElement(el, className = 'is-pulse') {
    if (!el || reducedMotion) return;
    el.classList.remove(className);
    void el.offsetWidth;
    el.classList.add(className);
  }

  function flashNavSelection(link) {
    if (!link || reducedMotion) return;
    link.classList.remove('is-just-selected');
    void link.offsetWidth;
    link.classList.add('is-just-selected');
    window.setTimeout(() => link.classList.remove('is-just-selected'), 400);
  }

  logos.forEach((logo) => {
    logo.addEventListener('click', () => pulseElement(logo));
    logo.addEventListener('animationend', (e) => {
      if (e.target === logo.querySelector('img') && e.animationName === 'logoBounce') {
        logo.classList.remove('is-pulse');
      }
    });
  });

  document.querySelectorAll('.footer__social-links a').forEach((link) => {
    link.addEventListener('click', () => pulseElement(link));
    link.addEventListener('animationend', (e) => {
      if (e.animationName === 'socialPulse') {
        link.classList.remove('is-pulse');
      }
    });
  });

  navLinks.forEach((link) => {
    link.addEventListener('animationend', (e) => {
      if (e.animationName === 'navPulse') {
        link.classList.remove('is-pulse');
      }
    });
  });

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('is-open');
      nav.classList.toggle('is-open');
    });

    function getScrollOffset() {
      const anchor = document.getElementById('servicios') || document.getElementById('inicio');
      if (!anchor) return 72;
      return parseFloat(getComputedStyle(anchor).scrollMarginTop) || 72;
    }

    function scrollToSection(id) {
      const el = document.getElementById(id);
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY - getScrollOffset();
      window.scrollTo({ top: Math.max(0, top), behavior: 'auto' });
      history.pushState(null, '', `#${id}`);
    }

    function isMobileNav() {
      return window.matchMedia('(max-width: 768px)').matches;
    }

    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');

        if (isMobileNav() && href?.startsWith('#')) {
          e.preventDefault();
          const id = href.slice(1);
          toggle.classList.remove('is-open');
          nav.classList.remove('is-open');
          setActiveNav(id);
          scrollToSection(id);
          return;
        }

        pulseElement(link);
        flashNavSelection(link);
        toggle.classList.remove('is-open');
        nav.classList.remove('is-open');
      });
    });
  }

  const sections = [
    { id: 'inicio', el: document.getElementById('inicio') },
    { id: 'servicios', el: document.getElementById('servicios') },
    { id: 'nosotros', el: document.getElementById('nosotros') },
    { id: 'portafolio', el: document.getElementById('portafolio') },
    { id: 'contacto', el: document.getElementById('contacto') },
  ].filter(section => section.el);

  function setActiveNav(id) {
    const sectionChanged = activeSectionId !== null && activeSectionId !== id;
    activeSectionId = id;

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      const isActive = href === `#${id}`;
      link.classList.toggle('nav__link--active', isActive);
      if (isActive && sectionChanged) {
        flashNavSelection(link);
      }
    });
  }

  function updateActiveSection() {
    const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h'), 10) || 80;
    const scrollPos = window.scrollY + offset + 80;
    let current = sections[0].id;

    sections.forEach(({ id, el }) => {
      if (el.offsetTop <= scrollPos) {
        current = id;
      }
    });

    setActiveNav(current);
  }

  if (sections.length && navLinks.length) {
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    updateActiveSection();
  }

  const portfolioShells = [...document.querySelectorAll('.portfolio-item__shell')];

  function closePortfolioItems() {
    portfolioShells.forEach(shell => shell.classList.remove('is-open'));
  }

  portfolioShells.forEach((shell) => {
    shell.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = shell.classList.contains('is-open');
      closePortfolioItems();
      if (!isOpen) {
        shell.classList.add('is-open');
      }
    });
  });

  document.addEventListener('click', () => {
    closePortfolioItems();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closePortfolioItems();
    }
  });
});
