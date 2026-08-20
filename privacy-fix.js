(() => {
  'use strict';

  // LGS2027 Arena v0.9'da çalışan doğrulanmış Zeus mimarisinin YKS uyarlaması.
  const COVER = './assets/zeus-real-v09.webp?v=09';
  const WATERMARK = './assets/zeus-watermark-v09.webp?v=09';

  function installVerifiedZeus() {
    // Açılış kapağını beklemeden doğrulanmış binary WebP dosyasına yönlendir.
    const cover = document.querySelector('.entry-cover');
    if (cover) {
      const absolute = new URL(COVER, document.baseURI).href;
      if (cover.src !== absolute) cover.src = COVER;
      cover.removeAttribute('onerror');
    }

    // Önceki denemelerden kalmış Zeus resimlerini tek doğrulanmış asset'e yönlendir.
    document.querySelectorAll('img').forEach(img => {
      if (img === cover || img.id === 'globalZeusWatermark') return;
      const src = (img.getAttribute('src') || '').toLowerCase();
      if (src.includes('zeus') || src.includes('arena-cover')) {
        img.src = COVER;
      }
    });

    // LGS'deki gibi uygulama kabuğuna TEK global filigran ekle.
    const shell = document.querySelector('.app');
    let watermark = document.getElementById('globalZeusWatermark');
    if (shell && !watermark) {
      watermark = document.createElement('img');
      watermark.id = 'globalZeusWatermark';
      watermark.className = 'global-zeus-watermark';
      watermark.alt = '';
      watermark.setAttribute('aria-hidden', 'true');
      shell.appendChild(watermark);
    }
    if (watermark) watermark.src = WATERMARK;
  }

  // Sonuç kilidi: yeni tur başladığında önceki cevaplar tekrar kapanır.
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

  // LGS çözümündeki gibi CSS katmanını versiyonlu olarak yükle.
  if (!document.querySelector('link[data-yks-zeus-v09]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = './yks-v09-zeus.css?v=09';
    link.dataset.yksZeusV09 = '1';
    document.head.appendChild(link);
  }

  // Body sonunda yüklendiği için window.load beklemeden uygula.
  installVerifiedZeus();
  installResultLock();

  window.addEventListener('load', () => {
    installVerifiedZeus();
    installResultLock();

    if ('serviceWorker' in navigator && location.protocol !== 'file:') {
      navigator.serviceWorker.register('./service-worker.js?v=09')
        .then(reg => {
          reg.update().catch(() => {});
          if (reg.waiting) reg.waiting.postMessage('SKIP_WAITING');
        })
        .catch(() => {});
    }
  });
})();
