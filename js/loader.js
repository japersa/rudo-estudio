(function () {
  const preloader = document.getElementById('preloader');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const MIN_MS = reducedMotion ? 0 : 400;
  const MAX_MS = 6000;
  const start = performance.now();
  let finished = false;

  function finish() {
    if (finished) return;
    finished = true;

    const elapsed = performance.now() - start;
    const wait = Math.max(0, MIN_MS - elapsed);

    window.setTimeout(() => {
      document.body.classList.remove('is-loading');
      document.body.classList.add('is-ready');
      preloader?.classList.add('is-done');
      preloader?.setAttribute('aria-hidden', 'true');

      window.__rudoReady = true;
      window.dispatchEvent(new Event('rudo:ready'));

      window.setTimeout(() => preloader?.remove(), reducedMotion ? 0 : 650);
    }, wait);
  }

  if (reducedMotion) {
    finish();
    return;
  }

  if (document.readyState === 'complete') {
    finish();
  } else {
    window.addEventListener('load', finish, { once: true });
    window.setTimeout(finish, MAX_MS);
  }
})();
