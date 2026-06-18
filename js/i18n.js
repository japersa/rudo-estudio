(function () {
  const STORAGE_KEY = 'rudo-lang';
  const SUPPORTED = ['es', 'en'];

  const TRANSLATIONS = {
    es: {
      'meta.title': 'Rudo Estudio — Estudio Creativo en Cartagena',
      'meta.description': 'Rudo Estudio es un estudio creativo en Cartagena, Colombia. Branding, diseño gráfico, desarrollo web, fotografía, animación y estrategia para marcas con propósito.',
      'meta.ogDescription': 'Branding, diseño web, fotografía y animación para marcas que quieren conectar con su audiencia.',
      'meta.ogImageAlt': 'Rudo Estudio — Estudio creativo en Cartagena',
      'meta.twitterDescription': 'Branding, diseño web, fotografía y animación para marcas con propósito.',
      'meta.schemaDescription': 'Estudio creativo en Cartagena especializado en branding, diseño gráfico, desarrollo web, fotografía y animación.',

      'a11y.loading': 'Cargando',
      'a11y.openMenu': 'Abrir menú',
      'a11y.closeInfo': 'Cerrar información',
      'a11y.backHome': 'Volver al inicio',
      'a11y.backToTop': 'Volver arriba',
      'a11y.tagsCloud': 'Etiquetas de servicios interactivas',
      'a11y.langSwitch': 'Idioma',
      'a11y.instagram': 'Instagram de Rudo Estudio',
      'a11y.behance': 'Behance de Rudo Estudio',
      'a11y.facebook': 'Facebook de Rudo Estudio',
      'a11y.tiktok': 'TikTok de Rudo Estudio',

      'nav.home': 'Inicio',
      'nav.services': 'Servicios',
      'nav.about': 'Nosotros',
      'nav.portfolio': 'Portafolio',
      'nav.contact': 'Contacto',

      'hero.line1': 'ESTUDIO',
      'hero.line2': 'CREATIVO',
      'hero.subtitle': 'Crea de la mano con nosotros',
      'cta.start': 'Comenzar',

      'marquee.text': 'nuevas plazas disponibles en 2026',
      'marquee.phrase': 'desarrollo web',

      'services.our': 'NUESTROS',
      'services.title': 'SERVICIOS',
      'services.desc': 'Creamos soluciones creativas completas para marcas que quieren verse bien y funcionar mejor.',
      'services.label': 'Servicio',

      'services.apps.title': 'Apps',
      'services.apps.desc': 'Diseñamos interfaces claras y funcionales para apps móviles y productos digitales que la gente disfruta usar.',
      'services.foto.title': 'Fotografia',
      'services.foto.desc': 'Producción visual para marcas: retratos, producto y contenido que comunica con intención y estilo.',
      'services.ilustracion.title': 'Ilustracion',
      'services.ilustracion.desc': 'Ilustración personalizada para campañas, packaging y piezas editoriales con identidad propia.',
      'services.editorial.title': 'Editorial',
      'services.editorial.desc': 'Diseño de catálogos, revistas y publicaciones con ritmo visual, tipografía y narrativa cuidada.',
      'services.web.title': 'web',
      'services.web.desc': 'Sitios y landing pages rápidos, responsive y alineados con la personalidad de tu marca.',
      'services.animacion.title': 'Animacion',
      'services.animacion.desc': 'Motion graphics y piezas animadas para redes, presentaciones y experiencias digitales memorables.',
      'services.branding.title': 'Branding',
      'services.branding.desc': 'Construimos identidades completas: logo, sistema visual, voz y aplicaciones para cada touchpoint.',
      'services.estrategia.title': 'Estrategia',
      'services.estrategia.desc': 'Definimos dirección creativa y posicionamiento para que cada decisión de diseño tenga propósito.',
      'services.packaging.title': 'Empaque',
      'services.packaging.desc': 'Diseño de empaques y etiquetas que destacan en anaquel y cuentan la historia de tu producto.',
      'services.social.title': 'Redes',
      'services.social.desc': 'Contenido visual y piezas para redes que mantienen tu marca coherente, activa y memorable.',
      'services.video.title': 'Video',
      'services.video.desc': 'Producción y edición de video para campañas, reels y piezas que conectan en segundos.',
      'services.uiux.title': 'UI/UX',
      'services.uiux.desc': 'Diseño de experiencias digitales claras, usables y alineadas con los objetivos de tu producto.',

      'about.chip': 'NOSOTROS',
      'about.title': 'RUDO ESTUDIO',
      'about.intro': 'NACIÓ EN SEPTIEMBRE DE 2024 CON LA VISIÓN DE REVOLUCIONAR EL DISEÑO EN CARTAGENA. EXISTIMOS PORQUE HAY DEMASIADAS MARCAS QUE SE VEN IGUALES, GENÉRICAS Y SIN INTENCIÓN, Y ESO LES CUESTA CONEXIÓN, RELEVANCIA Y CRECIMIENTO REAL.',
      'about.body': 'Somos un estudio creativo que combina diseño gráfico, branding, fotografía, animación y desarrollo web. Creemos en el diseño con propósito: cada proyecto es una oportunidad de contar una historia única y construir marcas que realmente conecten con su audiencia. Trabajamos de la mano con nuestros clientes para transformar ideas en experiencias visuales memorables.',

      'team.creators': 'CREADORES',
      'team.jaxir.role': 'Diseñador Gráfico',
      'team.jaxir.bio': 'Especialista en identidad visual y piezas editoriales. Transforma conceptos en sistemas gráficos coherentes y memorables.',
      'team.rosa.role': 'Diseñadora Gráfica',
      'team.rosa.bio': 'Apasionada por el branding y la narrativa visual. Crea marcas con personalidad que conectan emocionalmente con su audiencia.',
      'team.alvaro.role': 'Ingeniero de Software',
      'team.alvaro.bio': 'Desarrolla experiencias web funcionales y escalables. Une diseño y tecnología para que cada proyecto funcione tan bien como se ve.',

      'portfolio.title': 'PORTAFOLIO',
      'portfolio.p1.name': 'Proyecto 01',
      'portfolio.p1.role': 'Branding',
      'portfolio.p1.bio': 'Identidad visual y sistema gráfico para una marca en crecimiento.',
      'portfolio.p1.alt': 'Proyecto Branding',
      'portfolio.p2.name': 'Proyecto 02',
      'portfolio.p2.role': 'Web',
      'portfolio.p2.bio': 'Sitio web con enfoque en experiencia de usuario y conversión.',
      'portfolio.p2.alt': 'Proyecto Web',
      'portfolio.p3.name': 'Proyecto 03',
      'portfolio.p3.role': 'Editorial',
      'portfolio.p3.bio': 'Piezas editoriales y publicaciones con narrativa visual cuidada.',
      'portfolio.p3.alt': 'Proyecto Editorial',
      'portfolio.p4.name': 'Proyecto 04',
      'portfolio.p4.role': 'Fotografia',
      'portfolio.p4.bio': 'Sesión fotográfica y dirección de arte para campaña de producto.',
      'portfolio.p4.alt': 'Proyecto Fotografia',
      'portfolio.p5.name': 'Proyecto 05',
      'portfolio.p5.role': 'Animacion',
      'portfolio.p5.bio': 'Motion graphics para redes y presentación de marca.',
      'portfolio.p5.alt': 'Proyecto Animacion',
      'portfolio.p6.name': 'Proyecto 06',
      'portfolio.p6.role': 'Estrategia',
      'portfolio.p6.bio': 'Dirección creativa y posicionamiento de marca.',
      'portfolio.p6.alt': 'Proyecto Estrategia',

      'contact.title': 'Hola!<br><span>Queremos conocer tu proyecto</span>',
      'contact.nameLabel': 'Para comenzar, ¿cómo te llamas?',
      'contact.emailLabel': '¿Cuál es tu correo?',
      'contact.phoneLabel': '¿Tu número de WhatsApp o teléfono?',
      'contact.serviceLabel': '¿Qué servicio te interesa?',
      'contact.projectLabel': 'Cuéntanos sobre tu proyecto',
      'contact.projectPlaceholder': '¿Qué necesitas? ¿Para cuándo? ¿Algún detalle importante?',
      'contact.selectDefault': 'Selecciona una opción',
      'contact.serviceOther': 'Otro / varios servicios',
      'contact.continue': 'Continuar',
      'contact.submitWhatsApp': 'Enviar por WhatsApp',
      'contact.nameError': 'Escribe al menos 2 caracteres.',
      'contact.whatsappIntro': '¡Hola Rudo Estudio! Quiero conocer más sobre sus servicios.',
      'contact.whatsappName': 'Nombre',
      'contact.whatsappEmail': 'Email',
      'contact.whatsappPhone': 'Teléfono / WhatsApp',
      'contact.whatsappService': 'Servicio de interés',
      'contact.whatsappProject': 'Sobre mi proyecto',

      'footer.location': 'Ubicación',
      'footer.follow': 'SÍGUENOS',
      'footer.rights': '© 2025 Rudo Estudio. Todos los derechos reservados.',
      'footer.credit': 'Diseñado por | RudoEstudio',
    },
    en: {
      'meta.title': 'Rudo Estudio — Creative Studio in Cartagena',
      'meta.description': 'Rudo Estudio is a creative studio in Cartagena, Colombia. Branding, graphic design, web development, photography, animation, and strategy for purposeful brands.',
      'meta.ogDescription': 'Branding, web design, photography, and animation for brands that want to connect with their audience.',
      'meta.ogImageAlt': 'Rudo Estudio — Creative studio in Cartagena',
      'meta.twitterDescription': 'Branding, web design, photography, and animation for purposeful brands.',
      'meta.schemaDescription': 'Creative studio in Cartagena specializing in branding, graphic design, web development, photography, and animation.',

      'a11y.loading': 'Loading',
      'a11y.openMenu': 'Open menu',
      'a11y.closeInfo': 'Close information',
      'a11y.backHome': 'Back to home',
      'a11y.backToTop': 'Back to top',
      'a11y.tagsCloud': 'Interactive service tags',
      'a11y.langSwitch': 'Language',
      'a11y.instagram': 'Rudo Estudio on Instagram',
      'a11y.behance': 'Rudo Estudio on Behance',
      'a11y.facebook': 'Rudo Estudio on Facebook',
      'a11y.tiktok': 'Rudo Estudio on TikTok',

      'nav.home': 'Home',
      'nav.services': 'Services',
      'nav.about': 'About',
      'nav.portfolio': 'Portfolio',
      'nav.contact': 'Contact',

      'hero.line1': 'CREATIVE',
      'hero.line2': 'STUDIO',
      'hero.subtitle': 'Create alongside us',
      'cta.start': 'Get started',

      'marquee.text': 'new spots available in 2026',
      'marquee.phrase': 'web development',

      'services.our': 'OUR',
      'services.title': 'SERVICES',
      'services.desc': 'We build complete creative solutions for brands that want to look great and work better.',
      'services.label': 'Service',

      'services.apps.title': 'Apps',
      'services.apps.desc': 'We design clear, functional interfaces for mobile apps and digital products people enjoy using.',
      'services.foto.title': 'Photography',
      'services.foto.desc': 'Visual production for brands: portraits, product shots, and content that communicates with intention and style.',
      'services.ilustracion.title': 'Illustration',
      'services.ilustracion.desc': 'Custom illustration for campaigns, packaging, and editorial pieces with a distinct identity.',
      'services.editorial.title': 'Editorial',
      'services.editorial.desc': 'Catalog, magazine, and publication design with visual rhythm, typography, and careful storytelling.',
      'services.web.title': 'web',
      'services.web.desc': 'Fast, responsive sites and landing pages aligned with your brand personality.',
      'services.animacion.title': 'Animation',
      'services.animacion.desc': 'Motion graphics and animated pieces for social, presentations, and memorable digital experiences.',
      'services.branding.title': 'Branding',
      'services.branding.desc': 'We build complete identities: logo, visual system, voice, and applications for every touchpoint.',
      'services.estrategia.title': 'Strategy',
      'services.estrategia.desc': 'We define creative direction and positioning so every design decision has purpose.',
      'services.packaging.title': 'Packaging',
      'services.packaging.desc': 'Packaging and label design that stands out on shelf and tells your product story.',
      'services.social.title': 'Social',
      'services.social.desc': 'Visual content and assets for social media that keep your brand consistent and memorable.',
      'services.video.title': 'Video',
      'services.video.desc': 'Video production and editing for campaigns, reels, and pieces that connect in seconds.',
      'services.uiux.title': 'UI/UX',
      'services.uiux.desc': 'Digital experience design that is clear, usable, and aligned with your product goals.',

      'about.chip': 'ABOUT US',
      'about.title': 'RUDO ESTUDIO',
      'about.intro': 'BORN IN SEPTEMBER 2024 WITH A VISION TO REVOLUTIONIZE DESIGN IN CARTAGENA. WE EXIST BECAUSE TOO MANY BRANDS LOOK THE SAME — GENERIC AND WITHOUT INTENTION — AND THAT COSTS THEM CONNECTION, RELEVANCE, AND REAL GROWTH.',
      'about.body': 'We are a creative studio combining graphic design, branding, photography, animation, and web development. We believe in purposeful design: every project is a chance to tell a unique story and build brands that truly connect with their audience. We work hand in hand with our clients to turn ideas into memorable visual experiences.',

      'team.creators': 'CREATORS',
      'team.jaxir.role': 'Graphic Designer',
      'team.jaxir.bio': 'Specialist in visual identity and editorial work. Turns concepts into coherent, memorable graphic systems.',
      'team.rosa.role': 'Graphic Designer',
      'team.rosa.bio': 'Passionate about branding and visual storytelling. Creates brands with personality that connect emotionally with their audience.',
      'team.alvaro.role': 'Software Engineer',
      'team.alvaro.bio': 'Builds functional, scalable web experiences. Bridges design and technology so every project works as well as it looks.',

      'portfolio.title': 'PORTFOLIO',
      'portfolio.p1.name': 'Project 01',
      'portfolio.p1.role': 'Branding',
      'portfolio.p1.bio': 'Visual identity and graphic system for a growing brand.',
      'portfolio.p1.alt': 'Branding project',
      'portfolio.p2.name': 'Project 02',
      'portfolio.p2.role': 'Web',
      'portfolio.p2.bio': 'Website focused on user experience and conversion.',
      'portfolio.p2.alt': 'Web project',
      'portfolio.p3.name': 'Project 03',
      'portfolio.p3.role': 'Editorial',
      'portfolio.p3.bio': 'Editorial pieces and publications with careful visual narrative.',
      'portfolio.p3.alt': 'Editorial project',
      'portfolio.p4.name': 'Project 04',
      'portfolio.p4.role': 'Photography',
      'portfolio.p4.bio': 'Photo shoot and art direction for a product campaign.',
      'portfolio.p4.alt': 'Photography project',
      'portfolio.p5.name': 'Project 05',
      'portfolio.p5.role': 'Animation',
      'portfolio.p5.bio': 'Motion graphics for social media and brand presentation.',
      'portfolio.p5.alt': 'Animation project',
      'portfolio.p6.name': 'Project 06',
      'portfolio.p6.role': 'Strategy',
      'portfolio.p6.bio': 'Creative direction and brand positioning.',
      'portfolio.p6.alt': 'Strategy project',

      'contact.title': 'Hi!<br><span>We want to hear about your project</span>',
      'contact.nameLabel': 'To get started, what\'s your name?',
      'contact.emailLabel': 'What\'s your email?',
      'contact.phoneLabel': 'Your WhatsApp or phone number?',
      'contact.serviceLabel': 'Which service are you interested in?',
      'contact.projectLabel': 'Tell us about your project',
      'contact.projectPlaceholder': 'What do you need? When do you need it? Any important details?',
      'contact.selectDefault': 'Select an option',
      'contact.serviceOther': 'Other / multiple services',
      'contact.continue': 'Continue',
      'contact.submitWhatsApp': 'Send via WhatsApp',
      'contact.nameError': 'Please enter at least 2 characters.',
      'contact.whatsappIntro': 'Hi Rudo Estudio! I\'d like to learn more about your services.',
      'contact.whatsappName': 'Name',
      'contact.whatsappEmail': 'Email',
      'contact.whatsappPhone': 'Phone / WhatsApp',
      'contact.whatsappService': 'Service of interest',
      'contact.whatsappProject': 'About my project',

      'footer.location': 'Location',
      'footer.follow': 'FOLLOW US',
      'footer.rights': '© 2025 Rudo Estudio. All rights reserved.',
      'footer.credit': 'Designed by | RudoEstudio',
    },
  };

  const SERVICE_KEYS = {
    'tag--apps': 'apps',
    'tag--foto': 'foto',
    'tag--ilustracion': 'ilustracion',
    'tag--editorial': 'editorial',
    'tag--web': 'web',
    'tag--animacion': 'animacion',
    'tag--branding': 'branding',
    'tag--estrategia': 'estrategia',
    'tag--packaging': 'packaging',
    'tag--social': 'social',
    'tag--video': 'video',
    'tag--uiux': 'uiux',
  };

  let currentLang = 'es';

  function detectLang() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED.includes(stored)) return stored;
    const browser = (navigator.language || 'es').slice(0, 2).toLowerCase();
    return SUPPORTED.includes(browser) ? browser : 'es';
  }

  function t(key) {
    return TRANSLATIONS[currentLang]?.[key] ?? TRANSLATIONS.es[key] ?? key;
  }

  function updateMeta() {
    document.title = t('meta.title');
    document.documentElement.lang = currentLang;

    const setMeta = (selector, content) => {
      const el = document.querySelector(selector);
      if (el && content) el.setAttribute('content', content);
    };

    setMeta('meta[name="description"]', t('meta.description'));
    setMeta('meta[property="og:locale"]', currentLang === 'en' ? 'en_US' : 'es_CO');
    setMeta('meta[property="og:title"]', t('meta.title'));
    setMeta('meta[property="og:description"]', t('meta.ogDescription'));
    setMeta('meta[property="og:image:alt"]', t('meta.ogImageAlt'));
    setMeta('meta[name="twitter:title"]', t('meta.title'));
    setMeta('meta[name="twitter:description"]', t('meta.twitterDescription'));

    const schema = document.querySelector('script[type="application/ld+json"]');
    if (schema) {
      try {
        const data = JSON.parse(schema.textContent);
        data.description = t('meta.schemaDescription');
        schema.textContent = JSON.stringify(data, null, 2);
      } catch (_) { /* ignore */ }
    }
  }

  function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      el.textContent = t(el.dataset.i18n);
    });

    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      el.innerHTML = t(el.dataset.i18nHtml);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      el.placeholder = t(el.dataset.i18nPlaceholder);
    });

    document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
      el.dataset.i18nAttr.split(';').forEach((pair) => {
        const [attr, key] = pair.split(':').map((s) => s.trim());
        if (attr && key) el.setAttribute(attr, t(key));
      });
    });

    document.querySelectorAll('.lang-switch__btn').forEach((btn) => {
      const active = btn.dataset.lang === currentLang;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    updateMeta();
  }

  function setLang(lang) {
    if (!SUPPORTED.includes(lang) || lang === currentLang) return;
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    applyTranslations();
    window.dispatchEvent(new CustomEvent('rudo:langchange', { detail: { lang } }));
  }

  function getServiceInfo(classKey) {
    const id = SERVICE_KEYS[classKey];
    if (!id) return null;
    return {
      title: t(`services.${id}.title`),
      desc: t(`services.${id}.desc`),
    };
  }

  function initLangSwitch() {
    document.querySelectorAll('.lang-switch__btn').forEach((btn) => {
      btn.addEventListener('click', () => setLang(btn.dataset.lang));
    });
  }

  function init() {
    currentLang = detectLang();
    applyTranslations();
    initLangSwitch();
  }

  window.RudoI18n = {
    t,
    getLang: () => currentLang,
    setLang,
    getServiceInfo,
    SERVICE_KEYS,
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
