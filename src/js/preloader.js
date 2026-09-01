/**
 * 7DREAM YOUTH CAPSULE PRELOADER MODULE
 * Smooth loading animation featuring the 7 Chibis with progress bar & transition
 */

export function initPreloader() {
  const preloader = document.getElementById('site-preloader');
  const progressFill = document.getElementById('preloader-progress-fill');
  const progressPercent = document.getElementById('preloader-percent');

  if (!preloader) return;

  let progress = 0;
  const startTime = Date.now();
  const minDisplayTime = 1400; // 1.4s for delightful animation

  const updateProgress = () => {
    const elapsed = Date.now() - startTime;
    const targetProgress = Math.min(100, Math.floor((elapsed / minDisplayTime) * 100));

    if (progress < targetProgress) {
      progress += 2;
      if (progress > 100) progress = 100;

      if (progressFill) progressFill.style.width = `${progress}%`;
      if (progressPercent) progressPercent.textContent = `${progress}%`;
    }

    if (progress < 100) {
      requestAnimationFrame(updateProgress);
    } else {
      setTimeout(() => {
        dismissPreloader();
      }, 250);
    }
  };

  requestAnimationFrame(updateProgress);

  function dismissPreloader() {
    preloader.classList.add('preloader-fade-out');
    document.body.classList.remove('is-loading');
    setTimeout(() => {
      preloader.remove();
    }, 600);
  }

  // Fail-safe auto dismiss after 2.5s maximum
  setTimeout(() => {
    if (document.body.contains(preloader)) {
      dismissPreloader();
    }
  }, 2500);
}
