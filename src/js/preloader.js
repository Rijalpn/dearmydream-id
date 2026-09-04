/**
 * 7DREAM SPECIAL EDITION PHOTOCARD PRELOADER MODULE
 * Smooth loading animation featuring 7Dream Photocard with holographic sweep & dynamic status
 */

export function initPreloader() {
  const preloader = document.getElementById('site-preloader');
  const progressFill = document.getElementById('preloader-progress-fill');
  const progressPercent = document.getElementById('preloader-percent');
  const statusText = document.getElementById('preloader-status-text');

  if (!preloader) return;

  let progress = 0;
  const startTime = Date.now();
  const minDisplayTime = 1600; // 1.6s for aesthetic photocard & holo shine appreciation

  const statusStages = [
    { threshold: 0, text: 'Menyiapkan Ruang Kumpul...' },
    { threshold: 30, text: 'Menghubungkan 7 Bintang Impian...' },
    { threshold: 65, text: 'My Dream is My Youth ✨' },
    { threshold: 92, text: 'Selamat Datang, Dreamzen! 🎉' }
  ];

  let currentStageText = statusStages[0].text;

  const updateProgress = () => {
    const elapsed = Date.now() - startTime;
    const targetProgress = Math.min(100, Math.floor((elapsed / minDisplayTime) * 100));

    if (progress < targetProgress) {
      progress += 2;
      if (progress > 100) progress = 100;

      if (progressFill) progressFill.style.width = `${progress}%`;
      if (progressPercent) progressPercent.textContent = `${progress}%`;

      // Update dynamic status message
      for (let i = statusStages.length - 1; i >= 0; i--) {
        if (progress >= statusStages[i].threshold) {
          if (currentStageText !== statusStages[i].text) {
            currentStageText = statusStages[i].text;
            if (statusText) {
              statusText.style.opacity = '0';
              setTimeout(() => {
                if (statusText) {
                  statusText.textContent = currentStageText;
                  statusText.style.opacity = '1';
                }
              }, 120);
            }
          }
          break;
        }
      }
    }

    if (progress < 100) {
      requestAnimationFrame(updateProgress);
    } else {
      setTimeout(() => {
        dismissPreloader();
      }, 300);
    }
  };

  requestAnimationFrame(updateProgress);

  function dismissPreloader() {
    preloader.classList.add('preloader-fade-out');
    document.body.classList.remove('is-loading');
    setTimeout(() => {
      preloader.remove();
    }, 650);
  }

  // Fail-safe auto dismiss after 3.0s maximum
  setTimeout(() => {
    if (document.body.contains(preloader)) {
      dismissPreloader();
    }
  }, 3000);
}
