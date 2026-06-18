document.addEventListener('DOMContentLoaded', () => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  document.documentElement.classList.add('js-animated');

  function boot() {
    if (document.body.dataset.animationsInit) return;
    document.body.dataset.animationsInit = '1';
    initPageAnimations(reducedMotion, finePointer);
  }

  if (document.body.classList.contains('is-ready') || window.__rudoReady) {
    boot();
  } else {
    window.addEventListener('rudo:ready', boot, { once: true });
  }
});

function initPageAnimations(reducedMotion, finePointer) {
  const header = document.querySelector('.header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 24);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function portfolioRevealDelay(index) {
    const cols = window.innerWidth <= 480 ? 1 : window.innerWidth <= 900 ? 2 : 4;
    const row = Math.floor(index / cols);
    const col = index % cols;
    return row * 220 + col * 85;
  }

  const revealItems = [
    { selector: '.services__heading-block' },
    { selector: '.services__info' },
    { selector: '.about__header' },
    { selector: '.about__intro' },
    { selector: '.about__body' },
    { selector: '.team__bg-text' },
    { selector: '.hero-banner--portafolio', extra: 'reveal--banner' },
    { selector: '.contact-section__content' },
  ];

  revealItems.forEach(({ selector, extra }) => {
    document.querySelectorAll(selector).forEach((el) => {
      el.classList.add('reveal');
      if (extra) el.classList.add(extra);
    });
  });

  document.querySelectorAll('.team__grid').forEach((grid) => {
    grid.classList.add('reveal-stagger');
    grid.querySelectorAll('.team-card').forEach((card, index) => {
      card.classList.add('reveal', 'reveal--scale');
      card.style.setProperty('--reveal-delay', `${index * 120}ms`);
    });
  });

  document.querySelectorAll('.portfolio-grid').forEach((grid) => {
    grid.classList.add('reveal-stagger');
    grid.querySelectorAll('.portfolio-item').forEach((item, index) => {
      item.classList.add('reveal', 'reveal--scale');
      item.style.setProperty('--reveal-delay', `${portfolioRevealDelay(index)}ms`);
    });
  });

  const reveals = document.querySelectorAll('.reveal');

  if (reducedMotion) {
    reveals.forEach((el) => el.classList.add('is-visible'));
    document.querySelector('.contact-section')?.classList.add('is-visible');
    document.querySelectorAll('.portfolio-item__img').forEach((img) => {
      img.classList.remove('is-loading');
      img.classList.add('is-loaded');
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -24px 0px' }
  );

  reveals.forEach((el) => observer.observe(el));

  const servicios = document.getElementById('servicios');
  if (servicios) {
    const serviciosObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          servicios.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
          serviciosObserver.disconnect();
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -10% 0px' }
    );
    serviciosObserver.observe(servicios);
  }

  const contacto = document.getElementById('contacto');
  const contactSection = document.querySelector('.contact-section');
  if (contacto && contactSection) {
    const contactoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          contactSection.classList.add('is-visible');
          contacto.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
          contactoObserver.disconnect();
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -10% 0px' }
    );
    contactoObserver.observe(contacto);
  }

  const teamBgText = document.querySelector('.team__bg-text');
  const teamSection = document.querySelector('.team');
  if (teamBgText && teamSection) {
    const onTeamParallax = () => {
      const rect = teamSection.getBoundingClientRect();
      const viewH = window.innerHeight;
      if (rect.bottom < 0 || rect.top > viewH) return;
      const progress = (viewH - rect.top) / (viewH + rect.height);
      const offset = (progress - 0.5) * 48;
      teamBgText.style.setProperty('--parallax-y', `${offset}px`);
    };
    window.addEventListener('scroll', onTeamParallax, { passive: true });
    onTeamParallax();
  }

  if (finePointer) {
    document.querySelectorAll('.portfolio-item__shell').forEach((shell) => {
      shell.addEventListener('mousemove', (e) => {
        const rect = shell.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        shell.style.setProperty('--tilt-x', `${-y * 7}deg`);
        shell.style.setProperty('--tilt-y', `${x * 7}deg`);
      });

      shell.addEventListener('mouseleave', () => {
        shell.style.setProperty('--tilt-x', '0deg');
        shell.style.setProperty('--tilt-y', '0deg');
      });
    });
  }

  document.querySelectorAll('.portfolio-item__img').forEach((img) => {
    img.classList.add('is-loading');
    const markLoaded = () => {
      img.classList.remove('is-loading');
      img.classList.add('is-loaded');
    };
    if (img.complete) {
      markLoaded();
    } else {
      img.addEventListener('load', markLoaded, { once: true });
      img.addEventListener('error', markLoaded, { once: true });
    }
  });

  const heroBannerTitle = document.querySelector('.hero-banner--portafolio .hero-banner__title-text');
  if (heroBannerTitle) {
    const banner = heroBannerTitle.closest('.hero-banner--portafolio');
    if (banner) {
      const bannerObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            banner.classList.add('is-banner-animated');
            bannerObserver.disconnect();
          });
        },
        { threshold: 0.3 }
      );
      bannerObserver.observe(banner);
    }
  }
}
