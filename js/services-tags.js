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
    'tag--packaging':   { x: 130,  y: -90,  rot: -5,  z: 3 },
    'tag--social':      { x: -95,  y: 145,  rot: 7,   z: 4 },
    'tag--video':       { x: 210,  y: -35,  rot: -11, z: 5 },
    'tag--uiux':        { x: -155, y: -80,  rot: 11,  z: 4 },
  };

  const SERVICE_INFO = () => {
    const i18n = window.RudoI18n;
    if (!i18n) return {};
    const map = {};
    Object.keys(i18n.SERVICE_KEYS).forEach((classKey) => {
      map[classKey] = i18n.getServiceInfo(classKey);
    });
    return map;
  };

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const gravityEnabled = !reducedMotion;
  const GRAVITY = 720;
  const DAMPING = 0.96;
  const RESTITUTION = 0.28;
  const TAG_RESTITUTION = 0.12;
  const FRICTION = 0.82;
  const SLEEP_VELOCITY = 18;
  const SLEEP_FRAMES = 10;

  let zTop = 10;
  let activeTag = null;
  let selectedTag = null;
  let dragMode = 'move';
  let dragOffset = { x: 0, y: 0 };
  let rotateStart = { angle: 0, rot: 0 };
  let pointerStart = { x: 0, y: 0 };
  let didDrag = false;
  let entranceDone = false;
  let physicsActive = false;
  let lastPhysicsTime = 0;
  let dragVelocity = { x: 0, y: 0 };
  let lastDragSample = { x: 0, y: 0, t: 0 };

  function scaleFactor() {
    const w = cloud.offsetWidth / 720;
    const h = cloud.offsetHeight / 320;
    return Math.max(w, h, 1);
  }

  function axisScale() {
    return {
      x: cloud.offsetWidth / 720,
      y: cloud.offsetHeight / 320,
    };
  }

  function randomInRange(min, max) {
    return min + Math.random() * (max - min);
  }

  function getClassKey(tag) {
    return [...tag.classList].find(c => c.startsWith('tag--')) || '';
  }

  function ensureVelocity(state) {
    if (state.vx === undefined) state.vx = 0;
    if (state.vy === undefined) state.vy = 0;
    if (state.vr === undefined) state.vr = 0;
  }

  function createLayout(tag) {
    const base = BASE_LAYOUT[getClassKey(tag)] || { x: 0, y: 0, rot: 0, z: 1 };
    const { x: sx, y: sy } = axisScale();

    return {
      x: (base.x + randomInRange(-22, 22)) * sx,
      y: (base.y + randomInRange(-18, 18)) * sy,
      rot: base.rot + randomInRange(-3, 3),
      vx: 0,
      vy: 0,
      vr: 0,
      z: base.z,
    };
  }

  function applyTransform(tag) {
    const { x, y, rot } = tag._state;
    tag.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${rot}deg)`;
  }

  function layoutTags() {
    tags.forEach((tag) => {
      const layout = createLayout(tag);
      tag._state = layout;
      tag.style.zIndex = String(layout.z);
      applyTransform(tag);
    });

    zTop = tags.length + 10;
  }

  function getBounds() {
    const pad = 8 * scaleFactor();
    const halfW = cloud.offsetWidth / 2;
    const halfH = cloud.offsetHeight / 2;

    return {
      left: -halfW + pad,
      right: halfW - pad,
      top: -halfH + pad,
      bottom: halfH - pad,
    };
  }

  function getTagRadius(tag) {
    if (tag._radius) return tag._radius;
    const rect = tag.getBoundingClientRect();
    return Math.max(rect.width, rect.height) * 0.42;
  }

  function cacheTagRadii() {
    tags.forEach((tag) => {
      const rect = tag.getBoundingClientRect();
      tag._radius = Math.max(rect.width, rect.height) * 0.42;
    });
  }

  function wakeTag(tag) {
    ensureVelocity(tag._state);
    tag._state.sleeping = false;
    tag._state.sleepFrames = 0;
    startPhysics();
  }

  function wakeAllTags() {
    tags.forEach((tag) => {
      ensureVelocity(tag._state);
      tag._state.sleeping = false;
      tag._state.sleepFrames = 0;
    });
    startPhysics();
  }

  function clampStateToBounds(tag) {
    const bounds = getBounds();
    const radius = getTagRadius(tag);
    const state = tag._state;

    state.x = Math.max(bounds.left + radius, Math.min(bounds.right - radius, state.x));
    state.y = Math.max(bounds.top + radius, Math.min(bounds.bottom - radius, state.y));
  }

  function resolveWallCollision(tag, bounds) {
    const radius = getTagRadius(tag);
    const state = tag._state;

    if (state.x - radius < bounds.left) {
      state.x = bounds.left + radius;
      state.vx = Math.abs(state.vx) * RESTITUTION;
    }

    if (state.x + radius > bounds.right) {
      state.x = bounds.right - radius;
      state.vx = -Math.abs(state.vx) * RESTITUTION;
    }

    if (state.y - radius < bounds.top) {
      state.y = bounds.top + radius;
      state.vy = Math.abs(state.vy) * RESTITUTION;
    }

    if (state.y + radius > bounds.bottom) {
      state.y = bounds.bottom - radius;
      if (Math.abs(state.vy) > SLEEP_VELOCITY) {
        state.vy = -state.vy * RESTITUTION;
        state.vx *= FRICTION;
        state.vr *= 0.9;
      } else {
        state.vy = 0;
        state.vx *= 0.85;
        state.vr *= 0.85;
      }
    }
  }

  function trySleepTag(tag, bounds) {
    const state = tag._state;
    const radius = getTagRadius(tag);
    const onFloor = state.y + radius >= bounds.bottom - 1.5;
    const slow = Math.abs(state.vx) < SLEEP_VELOCITY
      && Math.abs(state.vy) < SLEEP_VELOCITY
      && Math.abs(state.vr) < 0.2;

    if (!onFloor || !slow) {
      state.sleepFrames = 0;
      return;
    }

    state.sleepFrames = (state.sleepFrames || 0) + 1;
    if (state.sleepFrames >= SLEEP_FRAMES) {
      state.sleeping = true;
      state.vx = 0;
      state.vy = 0;
      state.vr = 0;
      state.y = bounds.bottom - radius;
    }
  }

  function resolveTagCollisions() {
    for (let i = 0; i < tags.length; i += 1) {
      for (let j = i + 1; j < tags.length; j += 1) {
        const a = tags[i];
        const b = tags[j];
        if (a.classList.contains('is-dragging') || b.classList.contains('is-dragging')) continue;
        if (a._state.sleeping && b._state.sleeping) continue;

        const dx = b._state.x - a._state.x;
        const dy = b._state.y - a._state.y;
        const distance = Math.hypot(dx, dy) || 0.001;
        const minDistance = getTagRadius(a) + getTagRadius(b);

        if (distance >= minDistance) continue;

        const overlap = minDistance - distance;
        const nx = dx / distance;
        const ny = dy / distance;

        if (a._state.sleeping) {
          b._state.x += nx * overlap;
          b._state.y += ny * overlap;
          b._state.sleeping = false;
          b._state.sleepFrames = 0;
        } else if (b._state.sleeping) {
          a._state.x -= nx * overlap;
          a._state.y -= ny * overlap;
          a._state.sleeping = false;
          a._state.sleepFrames = 0;
        } else {
          a._state.x -= nx * overlap * 0.5;
          a._state.y -= ny * overlap * 0.5;
          b._state.x += nx * overlap * 0.5;
          b._state.y += ny * overlap * 0.5;

          const relativeVx = b._state.vx - a._state.vx;
          const relativeVy = b._state.vy - a._state.vy;
          const impulse = (relativeVx * nx + relativeVy * ny) * TAG_RESTITUTION;

          if (Math.abs(impulse) < 1.5) continue;

          a._state.sleeping = false;
          a._state.sleepFrames = 0;
          b._state.sleeping = false;
          b._state.sleepFrames = 0;

          a._state.vx += impulse * nx;
          a._state.vy += impulse * ny;
          b._state.vx -= impulse * nx;
          b._state.vy -= impulse * ny;
        }
      }
    }
  }

  function stepPhysics(dt) {
    const bounds = getBounds();
    const gravity = GRAVITY * scaleFactor();
    let awakeCount = 0;

    tags.forEach((tag) => {
      if (tag.classList.contains('is-dragging')) {
        awakeCount += 1;
        return;
      }

      const state = tag._state;
      ensureVelocity(state);

      if (state.sleeping) return;

      awakeCount += 1;
      state.vy += gravity * dt;
      state.x += state.vx * dt;
      state.y += state.vy * dt;
      state.rot += state.vr * dt;

      state.vx *= DAMPING;
      state.vy *= DAMPING;
      state.vr *= 0.96;

      resolveWallCollision(tag, bounds);
      trySleepTag(tag, bounds);
    });

    if (awakeCount > 0) {
      resolveTagCollisions();

      tags.forEach((tag) => {
        if (tag.classList.contains('is-dragging') || tag._state.sleeping) return;
        resolveWallCollision(tag, bounds);
        trySleepTag(tag, bounds);
      });
    }

    tags.forEach(applyTransform);

    if (selectedTag && !selectedTag.classList.contains('is-dragging')) {
      positionInfoPanel(selectedTag);
    }

    if (awakeCount === 0) {
      physicsActive = false;
    }
  }

  function tickPhysics(now) {
    if (gravityEnabled && physicsActive) {
      const dt = Math.min((now - lastPhysicsTime) / 1000, 0.032);
      if (dt > 0) stepPhysics(dt);
      lastPhysicsTime = now;
    }
    requestAnimationFrame(tickPhysics);
  }

  function startPhysics() {
    if (!gravityEnabled) return;
    physicsActive = true;
    lastPhysicsTime = performance.now();
  }

  function runTagEntrance() {
    if (entranceDone || reducedMotion) return;
    entranceDone = true;

    const finals = tags.map((tag) => ({ ...tag._state }));

    tags.forEach((tag, i) => {
      tag._state = {
        ...finals[i],
        x: (Math.random() - 0.5) * cloud.offsetWidth * 0.75,
        y: -cloud.offsetHeight * 0.48,
        rot: finals[i].rot + (Math.random() - 0.5) * 24,
        vx: (Math.random() - 0.5) * 40,
        vy: 0,
        vr: (Math.random() - 0.5) * 20,
      };
      tag.style.opacity = '0';
      tag.style.transition = 'none';
      applyTransform(tag);
    });

    requestAnimationFrame(() => {
      cloud.classList.add('is-entered');
      tags.forEach((tag, i) => {
        const delay = i * 55;
        tag.style.transition = `opacity 0.45s ease ${delay}ms`;
        tag.style.opacity = '1';
      });

      startPhysics();
      wakeAllTags();

      window.setTimeout(() => {
        tags.forEach((tag) => {
          tag.style.transition = '';
        });
      }, 900);
    });
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
    const info = SERVICE_INFO()[key];
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
    wakeTag(activeTag);

    ensureVelocity(activeTag._state);
    activeTag._state.vx = 0;
    activeTag._state.vy = 0;

    pointerStart = { x: e.clientX, y: e.clientY };
    didDrag = false;

    const local = pointerToLocal(e.clientX, e.clientY);
    const state = activeTag._state;
    lastDragSample = { x: local.x, y: local.y, t: performance.now() };
    dragVelocity = { x: 0, y: 0 };

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
      const now = performance.now();
      const dt = (now - lastDragSample.t) / 1000;

      if (dt > 0 && dt < 0.08) {
        dragVelocity.x = (local.x - lastDragSample.x) / dt * 0.5;
        dragVelocity.y = (local.y - lastDragSample.y) / dt * 0.5;
      }

      lastDragSample = { x: local.x, y: local.y, t: now };
      state.x = local.x - dragOffset.x;
      state.y = local.y - dragOffset.y;
      clampStateToBounds(activeTag);
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

    if (didDrag && gravityEnabled) {
      ensureVelocity(clickedTag._state);
      clickedTag._state.vx = dragVelocity.x;
      clickedTag._state.vy = dragVelocity.y;
      startPhysics();
    }

    if (!didDrag) {
      showServiceInfo(clickedTag);
    }

    activeTag = null;
    dragMode = 'move';
  }

  function onWheel(e) {
    e.preventDefault();
    const tag = e.currentTarget;
    ensureVelocity(tag._state);
    tag._state.rot += e.deltaY * 0.12;
    tag._state.vr += e.deltaY * 0.02;
    tag.style.zIndex = String(++zTop);
    wakeTag(tag);
    applyTransform(tag);
  }

  tags.forEach((tag) => {
    tag.setAttribute('aria-pressed', 'false');
    initTag(tag);
  });
  layoutTags();
  cacheTagRadii();

  const relayoutOnResize = () => {
    cacheTagRadii();
    tags.forEach((tag) => {
      if (tag.classList.contains('is-dragging')) return;
      clampStateToBounds(tag);
      applyTransform(tag);
    });
    if (selectedTag) positionInfoPanel(selectedTag);
  };

  if (gravityEnabled) {
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
    requestAnimationFrame(tickPhysics);
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

  window.addEventListener('rudo:langchange', () => {
    if (selectedTag && !selectedTag.classList.contains('is-dragging')) {
      const info = SERVICE_INFO()[getClassKey(selectedTag)];
      if (info && infoTitle && infoDesc) {
        infoTitle.textContent = info.title;
        infoDesc.textContent = info.desc;
      }
    }
  });

  let lastWidth = cloud.offsetWidth;
  let resizeTimer;

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const newWidth = cloud.offsetWidth;
      const ratio = newWidth / lastWidth;
      if (Math.abs(ratio - 1) < 0.02) {
        relayoutOnResize();
        return;
      }

      tags.forEach(tag => {
        tag._state.x *= ratio;
        tag._state.y *= ratio;
        applyTransform(tag);
      });

      lastWidth = newWidth;
      relayoutOnResize();
    }, 150);
  });
});
