(() => {
  'use strict';

  // Giriş kapağı ilk HTML çiziminde yüklenen yerel görsel olarak kalır.
  // Android/PWA yeniden yazımı artık entry-cover kaynağını değiştirmez.
  const VERIFIED_ZEUS = 'https://zorbirey.github.io/LGS2027-Arena/assets/zeus-real-v09.webp?v=11';
  const LOCAL_ZEUS = './assets/zeus-real-v09.webp?v=11';

  function setVerifiedSource(img) {
    if (!img) return;
    if (img.dataset.verifiedZeus === '1') return;
    img.dataset.verifiedZeus = '1';
    img.addEventListener('error', () => {
      if (img.dataset.localFallback !== '1') {
        img.dataset.localFallback = '1';
        img.src = LOCAL_ZEUS;
      }
    }, { once: true });
    img.src = VERIFIED_ZEUS;
  }

  function installVerifiedZeus() {
    // entry-cover özellikle hariç tutulur. Giriş ekranındaki resim butona basılana
    // kadar aynı DOM elemanı ve aynı kaynak olarak görünmeye devam eder.
    document.querySelectorAll('img:not(.entry-cover)').forEach(img => {
      const src = img.getAttribute('src') || '';
      if (/zeus/i.test(src)) setVerifiedSource(img);
    });

    const app = document.querySelector('.app');
    let watermark = document.getElementById('globalZeusWatermark');
    if (app && !watermark) {
      watermark = document.createElement('img');
      watermark.id = 'globalZeusWatermark';
      watermark.className = 'global-zeus-watermark';
      watermark.alt = '';
      watermark.setAttribute('aria-hidden', 'true');
      app.prepend(watermark);
    }
    setVerifiedSource(watermark);
  }

  installVerifiedZeus();
  window.addEventListener('DOMContentLoaded', installVerifiedZeus, { once: true });
  window.addEventListener('load', installVerifiedZeus, { once: true });

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js?v=11')
        .then(reg => {
          reg.update().catch(() => {});
          if (reg.waiting) reg.waiting.postMessage('SKIP_WAITING');
        })
        .catch(console.error);
    }, { once: true });
  }

  window.YksArenaZeus = { installVerifiedZeus, source: VERIFIED_ZEUS };
})();
