document.addEventListener('DOMContentLoaded', () => {
  const cloud = document.querySelector('.tags-cloud');
  if (!cloud) return;

  const tags = [...cloud.querySelectorAll('.tag')];
  if (!tags.length) return;

  const infoPanel = document.getElementById('tag-info');
  const infoTitle = infoPanel?.querySelector('.tag-info__title');
  const infoDesc = infoPanel?.querySelector('.tag-info__desc');

  const BASE_LAYOUT = {
    'tag--apps':        { x: -120, y: -100, rot: -8,  z: 3 },
    'tag--foto':        { x: -210, y: -30,  rot: -12, z: 4 },
    'tag--ilustracion': { x: 30,   y: -55,  rot: 10,  z: 5 },
    'tag--editorial':   { x: -215, y: 55,   rot: -6,  z: 2 },
    'tag--web':         { x: 55,   y: 65,   rot: 5,   z: 4 },
    'tag--animacion':   { x: -185, y: 115,  rot: -4,  z: 3 },
    'tag--branding':    { x: -15,  y: 95,   rot: 8,   z: 6 },
    'tag--estrategia':  { x: 175,  y: 120,  rot: 6,   z: 4 },
  };

  const SERVICE_INFO = {
    'tag--apps': {
      title: 'Apps',
      desc: 'Diseñamos interfaces claras y funcionales para apps móviles y productos digitales que la gente disfruta usar.',
    },
    'tag--foto': {
      title: 'Fotografia',
      desc: 'Producción visual para marcas: retratos, producto y contenido que comunica con intención y estilo.',
    },
    'tag--ilustracion': {
      title: 'Ilustracion',
      desc: 'Ilustración personalizada para campañas, packaging y piezas editoriales con identidad propia.',
    },
    'tag--editorial': {
      title: 'Editorial',
      desc: 'Diseño de catálogos, revistas y publicaciones con ritmo visual, tipografía y narrativa cuidada.',
    },
    'tag--web': {
      title: 'web',
      desc: 'Sitios y landing pages rápidos, responsive y alineados con la personalidad de tu marca.',
    },
    'tag--animacion': {
      title: 'Animacion',
      desc: 'Motion graphics y piezas animadas para redes, presentaciones y experiencias digitales memorables.',
    },
    'tag--branding': {
      title: 'Branding',
      desc: 'Construimos identidades completas: logo, sistema visual, voz y aplicaciones para cada touchpoint.',
    },
    'tag--estrategia': {
      title: 'Estrategia',
      desc: 'Definimos dirección creativa y posicionamiento para que cada decisión de diseño tenga propósito.',
    },
  };

  let zTop = 10;
  let activeTag = null;
  let selectedTag = null;
  let dragMode = 'move';
  let dragOffset = { x: 0, y: 0 };
  let rotateStart = { angle: 0, rot: 0 };
  let pointerStart = { x: 0, y: 0 };
  let didDrag = false;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const floatEnabled = !reducedMotion;
  let floatTick = 0;
  let entranceDone = false;

  function scaleFactor() {
    return cloud.offsetWidth / 720;
  }

  function randomInRange(min, max) {
    return min + Math.random() * (max - min);
  }

  function getClassKey(tag) {
    return [...tag.classList].find(c => c.startsWith('tag--')) || '';
  }

  function createLayout(tag) {
    const base = BASE_LAYOUT[getClassKey(tag)] || { x: 0, y: 0, rot: 0, z: 1 };
    const s = scaleFactor();

    return {
      x: (base.x + randomInRange(-18, 18)) * s,
      y: (base.y + randomInRange(-14, 14)) * s,
      rot: base.rot + randomInRange(-3, 3),
      z: base.z,
    };
  }

  function applyTransform(tag, index = tags.indexOf(tag)) {
    const { x, y, rot } = tag._state;
    const floatY = floatEnabled && !tag.classList.contains('is-dragging')
      ? Math.sin((floatTick / 1000) * 1.15 + index * 0.9) * 3.5
      : 0;
    tag.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y + floatY}px)) rotate(${rot}deg)`;
  }

  function layoutTags() {
    tags.forEach((tag) => {
      const layout = createLayout(tag);
      tag._state = { x: layout.x, y: layout.y, rot: layout.rot };
      tag.style.zIndex = String(layout.z);
      applyTransform(tag);
    });

    zTop = tags.length + 10;
  }

  function runTagEntrance() {
    if (entranceDone || reducedMotion) return;
    entranceDone = true;

    const finals = tags.map((tag) => ({ ...tag._state }));
    const s = scaleFactor();

    tags.forEach((tag, i) => {
      tag._state = {
        x: (Math.random() - 0.5) * 120 * s,
        y: (Math.random() - 0.5) * 100 * s,
        rot: finals[i].rot + (Math.random() - 0.5) * 24,
      };
      tag.style.opacity = '0';
      tag.style.transition = 'none';
      applyTransform(tag, i);
    });

    requestAnimationFrame(() => {
      cloud.classList.add('is-entered');
      tags.forEach((tag, i) => {
        const delay = i * 55;
        tag.style.transition = `transform 0.75s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, opacity 0.45s ease ${delay}ms`;
        tag._state = finals[i];
        tag.style.opacity = '1';
        applyTransform(tag, i);
      });

      window.setTimeout(() => {
        tags.forEach((tag) => {
          tag.style.transition = '';
        });
      }, 1400);
    });
  }

  function tickFloat(now) {
    if (floatEnabled) {
      floatTick = now;
      tags.forEach((tag, i) => {
        if (!tag.classList.contains('is-dragging')) {
          applyTransform(tag, i);
        }
      });
    }
    requestAnimationFrame(tickFloat);
  }

  function positionInfoPanel(tag) {
    if (!infoPanel || !tag) return;

    const cloudRect = cloud.getBoundingClientRect();
    const tagRect = tag.getBoundingClientRect();
    const gap = 14;
    const edgePad = 10;

    let centerX = tagRect.left + tagRect.width / 2 - cloudRect.left;
    const panelW = infoPanel.offsetWidth || Math.min(cloud.offsetWidth - 16, 420);
    const half = panelW / 2;
    centerX = Math.max(edgePad + half, Math.min(cloud.offsetWidth - edgePad - half, centerX));

    const tagTop = tagRect.top - cloudRect.top;
    const tagBottom = tagRect.bottom - cloudRect.top;
    const panelH = infoPanel.offsetHeight || 160;

    infoPanel.classList.remove('is-below');

    if (tagTop - gap - panelH < edgePad) {
      infoPanel.classList.add('is-below');
      infoPanel.style.setProperty('--info-x', `${centerX}px`);
      infoPanel.style.setProperty('--info-y', `${tagBottom + gap}px`);
    } else {
      infoPanel.style.setProperty('--info-x', `${centerX}px`);
      infoPanel.style.setProperty('--info-y', `${tagTop - gap}px`);
    }
  }

  function closeServiceInfo() {
    tags.forEach((item) => {
      item.classList.remove('is-selected');
      item.setAttribute('aria-pressed', 'false');
    });

    if (infoPanel) {
      infoPanel.hidden = true;
      infoPanel.classList.remove('is-opening', 'is-below');
    }

    selectedTag = null;
    cloud.classList.remove('has-selection');
  }

  function showServiceInfo(tag) {
    const key = getClassKey(tag);
    const info = SERVICE_INFO[key];
    if (!info || !infoPanel || !infoTitle || !infoDesc) return;

    if (tag.classList.contains('is-selected')) {
      closeServiceInfo();
      return;
    }

    tags.forEach(item => {
      item.classList.remove('is-selected');
      item.setAttribute('aria-pressed', 'false');
    });

    tag.classList.add('is-selected');
    tag.setAttribute('aria-pressed', 'true');
    tag.style.zIndex = String(++zTop);

    tag.classList.remove('is-pulse');
    void tag.offsetWidth;
    tag.classList.add('is-pulse');
    tag.addEventListener('animationend', () => tag.classList.remove('is-pulse'), { once: true });

    infoTitle.textContent = info.title;
    infoDesc.textContent = info.desc;
    infoPanel.hidden = false;
    selectedTag = tag;
    positionInfoPanel(tag);
    requestAnimationFrame(() => positionInfoPanel(tag));
    infoPanel.classList.remove('is-opening');
    void infoPanel.offsetWidth;
    infoPanel.classList.add('is-opening');
    cloud.classList.add('has-selection');
  }

  function initTag(tag) {
    tag.addEventListener('pointerdown', onPointerDown);
    tag.addEventListener('wheel', onWheel, { passive: false });
    tag.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        showServiceInfo(tag);
      }
    });
  }

  function cloudCenter() {
    const rect = cloud.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  }

  function pointerToLocal(clientX, clientY) {
    const center = cloudCenter();
    return {
      x: clientX - center.x,
      y: clientY - center.y,
    };
  }

  function angleFromCenter(clientX, clientY) {
    const center = cloudCenter();
    return Math.atan2(clientY - center.y, clientX - center.x) * (180 / Math.PI);
  }

  function onPointerDown(e) {
    if (e.button !== 0) return;

    activeTag = e.currentTarget;
    activeTag.setPointerCapture(e.pointerId);
    activeTag.classList.add('is-dragging');
    activeTag.style.zIndex = String(++zTop);

    pointerStart = { x: e.clientX, y: e.clientY };
    didDrag = false;

    const local = pointerToLocal(e.clientX, e.clientY);
    const state = activeTag._state;

    if (e.shiftKey) {
      dragMode = 'rotate';
      rotateStart.angle = angleFromCenter(e.clientX, e.clientY);
      rotateStart.rot = state.rot;
    } else {
      dragMode = 'move';
      dragOffset.x = local.x - state.x;
      dragOffset.y = local.y - state.y;
    }

    e.preventDefault();
  }

  function onPointerMove(e) {
    if (!activeTag) return;

    if (Math.hypot(e.clientX - pointerStart.x, e.clientY - pointerStart.y) > 6) {
      didDrag = true;
    }

    const state = activeTag._state;

    if (dragMode === 'rotate') {
      const angle = angleFromCenter(e.clientX, e.clientY);
      state.rot = rotateStart.rot + (angle - rotateStart.angle);
    } else {
      const local = pointerToLocal(e.clientX, e.clientY);
      state.x = local.x - dragOffset.x;
      state.y = local.y - dragOffset.y;
    }

    applyTransform(activeTag);

    if (activeTag.classList.contains('is-selected')) {
      positionInfoPanel(activeTag);
    }
  }

  function onPointerUp(e) {
    if (!activeTag) return;

    const clickedTag = activeTag;

    if (clickedTag.hasPointerCapture(e.pointerId)) {
      clickedTag.releasePointerCapture(e.pointerId);
    }

    clickedTag.classList.remove('is-dragging');

    if (!didDrag) {
      showServiceInfo(clickedTag);
    }

    activeTag = null;
    dragMode = 'move';
  }

  function onWheel(e) {
    e.preventDefault();
    const tag = e.currentTarget;
    tag._state.rot += e.deltaY * 0.12;
    tag.style.zIndex = String(++zTop);
    applyTransform(tag);
  }

  tags.forEach((tag) => {
    tag.setAttribute('aria-pressed', 'false');
    initTag(tag);
  });
  layoutTags();

  if (!reducedMotion) {
    const entranceObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          runTagEntrance();
          entranceObserver.disconnect();
        });
      },
      { threshold: 0.2 }
    );
    entranceObserver.observe(cloud);
    requestAnimationFrame(tickFloat);
  } else {
    cloud.classList.add('is-entered');
  }

  const closeBtn = infoPanel?.querySelector('.tag-info__close');
  closeBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeServiceInfo();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeServiceInfo();
    }
  });

  document.addEventListener('click', (e) => {
    if (!cloud.classList.contains('has-selection')) return;
    if (cloud.contains(e.target)) return;
    closeServiceInfo();
  });

  document.addEventListener('pointermove', onPointerMove);
  document.addEventListener('pointerup', onPointerUp);
  document.addEventListener('pointercancel', onPointerUp);

  let lastWidth = cloud.offsetWidth;
  let resizeTimer;

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const newWidth = cloud.offsetWidth;
      const ratio = newWidth / lastWidth;
      if (Math.abs(ratio - 1) < 0.02) return;

      tags.forEach(tag => {
        tag._state.x *= ratio;
        tag._state.y *= ratio;
        applyTransform(tag);
      });

      if (selectedTag) {
        positionInfoPanel(selectedTag);
      }

      lastWidth = newWidth;
    }, 150);
  });
});
