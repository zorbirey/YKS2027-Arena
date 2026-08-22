(() => {
  'use strict';

  const LOCAL_COVER = './assets/zeus-cover-inline.webp?v=12';
  const LOCAL_WATERMARK = './assets/zeus-watermark-inline.webp?v=12';

  function installVisualFixes() {
    const cover = document.querySelector('.entry-cover');
    if (cover && !/zeus-cover-inline\.webp/.test(cover.getAttribute('src') || '')) {
      cover.src = LOCAL_COVER;
    }

    const shell = document.querySelector('.app');
    let watermark = document.getElementById('globalZeusWatermark');
    if (shell && !watermark) {
      watermark = document.createElement('img');
      watermark.id = 'globalZeusWatermark';
      watermark.className = 'global-zeus-watermark';
      watermark.alt = '';
      watermark.setAttribute('aria-hidden', 'true');
      shell.prepend(watermark);
    }
    if (watermark) watermark.src = LOCAL_WATERMARK;
  }

  function installResultLock() {
    if (typeof window.startSession !== 'function' || window.startSession.__yksLocked) return;
    const original = window.startSession;
    const wrapped = function(title) {
      const review = document.getElementById('review');
      if (review) {
        review.dataset.unlocked = '0';
        review.innerHTML = '<div class="small">Tur tamamlandığında cevapların burada gösterilir.</div>';
      }
      return original.apply(this, arguments);
    };
    wrapped.__yksLocked = true;
    window.startSession = wrapped;
  }

  installVisualFixes();
  installResultLock();
  window.addEventListener('DOMContentLoaded', installVisualFixes, { once:true });
  window.addEventListener('load', installResultLock, { once:true });
})();