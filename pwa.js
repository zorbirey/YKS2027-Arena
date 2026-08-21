(() => {
  'use strict';

  // LGS2027 Arena'da Android 16 üzerinde doğrulanan gerçek Zeus görseli.
  // YKS deposundaki eski/yanlış WebP dosyasını kullanmak yerine çalışan kaynağa yönlendiriyoruz.
  const VERIFIED_ZEUS = 'https://zorbirey.github.io/LGS2027-Arena/assets/zeus-real-v09.webp?v=10';
  const LOCAL_FALLBACK = './assets/zeus-real-v09.webp?v=10';

  function setVerifiedSource(img) {
    if (!img) return;
    if (img.dataset.verifiedZeus === '1') return;
    img.dataset.verifiedZeus = '1';
    img.addEventListener('error', () => {
      if (!img.src.includes('assets/zeus-real-v09.webp')) img.src = LOCAL_FALLBACK;
    }, { once: true });
    img.src = VERIFIED_ZEUS;
  }

  function installVerifiedZeus() {
    const cover = document.querySelector('.entry-cover');
    setVerifiedSource(cover);

    // Eski Zeus görselleri varsa çalışma anında tek doğrulanmış kaynağa çevir.
    document.querySelectorAll('img').forEach(img => {
      const src = img.getAttribute('src') || '';
      if (/zeus|arena-cover/i.test(src)) setVerifiedSource(img);
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

  // DOM hazır olduğu anda çalıştır; eski görselin ekranda parlamasını bekleme.
  installVerifiedZeus();
  window.addEventListener('DOMContentLoaded', installVerifiedZeus, { once: true });
  window.addEventListener('load', installVerifiedZeus, { once: true });

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js?v=10')
        .then(reg => {
          reg.update().catch(() => {});
          if (reg.waiting) reg.waiting.postMessage('SKIP_WAITING');
        })
        .catch(console.error);
    }, { once: true });
  }

  window.YksArenaZeus = { installVerifiedZeus, source: VERIFIED_ZEUS };
})();
