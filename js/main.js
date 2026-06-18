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

  const sections = [
    { id: 'inicio', el: document.getElementById('inicio') },
    { id: 'servicios', el: document.getElementById('servicios') },
    { id: 'nosotros', el: document.getElementById('nosotros') },
    { id: 'portafolio', el: document.getElementById('portafolio') },
    { id: 'contacto', el: document.getElementById('contacto') },
  ].filter(section => section.el);

  function getHeaderOffset() {
    const anchor = document.getElementById('servicios') || document.getElementById('inicio');
    if (anchor) {
      const margin = parseFloat(getComputedStyle(anchor).scrollMarginTop);
      if (!Number.isNaN(margin) && margin > 0) return margin;
    }
    const header = document.querySelector('.header');
    return header ? header.getBoundingClientRect().height : 80;
  }

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
    const offset = getHeaderOffset();
    const probe = offset + 8;
    let current = sections[0].id;

    sections.forEach(({ id, el }) => {
      if (el.getBoundingClientRect().top <= probe) {
        current = id;
      }
    });

    const nearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    if (nearBottom) {
      current = sections[sections.length - 1].id;
    }

    setActiveNav(current);
  }

  let scrollTicking = false;
  function onScrollSpy() {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      updateActiveSection();
      scrollTicking = false;
    });
  }

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('is-open');
      nav.classList.toggle('is-open');
    });

    function getScrollOffset() {
      return getHeaderOffset();
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

        if (href?.startsWith('#')) {
          setActiveNav(href.slice(1));
        }

        pulseElement(link);
        flashNavSelection(link);
        toggle.classList.remove('is-open');
        nav.classList.remove('is-open');
      });
    });
  }

  if (sections.length && navLinks.length) {
    window.addEventListener('scroll', onScrollSpy, { passive: true });
    window.addEventListener('resize', onScrollSpy, { passive: true });
    window.addEventListener('hashchange', updateActiveSection);
    window.addEventListener('rudo:ready', updateActiveSection);
    window.addEventListener('load', updateActiveSection);
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

  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    const backToTopThreshold = 320;

    function updateBackToTop() {
      const show = window.scrollY > backToTopThreshold;
      backToTop.classList.toggle('is-visible', show);
      backToTop.setAttribute('aria-hidden', show ? 'false' : 'true');
      backToTop.tabIndex = show ? 0 : -1;
    }

    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: reducedMotion ? 'auto' : 'smooth',
      });
      history.pushState(null, '', '#inicio');
      setActiveNav('inicio');
      toggle?.classList.remove('is-open');
      nav?.classList.remove('is-open');
    });

    window.addEventListener('scroll', updateBackToTop, { passive: true });
    updateBackToTop();
  }
});
