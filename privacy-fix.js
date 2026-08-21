(() => {
  'use strict';

  // LGS2027 Arena'da çalışan doğrulanmış Zeus dosyasını doğrudan kullan.
  const VERIFIED_ZEUS = 'https://zorbirey.github.io/LGS2027-Arena/assets/zeus-real-v09.webp?v=09';

  function installVisualFixes() {
    // YKS'deki gerçek hata: entry-cover z-index:-3 yüzünden siyah gate arkasına düşüyordu.
    // Bu override görseli kalıcı olarak görünür katmanda tutar.
    let style = document.getElementById('yks-zeus-v10-runtime');
    if (!style) {
      style = document.createElement('style');
      style.id = 'yks-zeus-v10-runtime';
      style.textContent = `
        .entry-gate{isolation:isolate!important;background:#020609!important}
        .entry-cover{z-index:0!important;opacity:1!important;visibility:visible!important;display:block!important;object-fit:cover!important;object-position:center 18%!important}
        .entry-shade{z-index:1!important}
        .entry-content{position:relative!important;z-index:2!important}
        .global-zeus-watermark{
          position:fixed!important;left:50%!important;top:51%!important;
          width:min(84vw,430px)!important;height:auto!important;
          transform:translate(-50%,-50%)!important;object-fit:contain!important;
          opacity:.085!important;filter:saturate(1.08) contrast(1.08) drop-shadow(0 0 24px rgba(240,182,45,.12))!important;
          z-index:80!important;pointer-events:none!important;mix-blend-mode:screen!important;
        }
        .app>header,.nav{z-index:90!important}
        #notes .note{padding:15px!important}
        #notes .note h3{font-size:22px!important;line-height:1.25!important;margin-bottom:10px!important}
        #notes .note p,#notes .note strong{font-size:18px!important;line-height:1.58!important}
        #notes .notes-grid{overflow:auto!important;gap:10px!important}
        @media(max-width:430px){
          .entry-cover{object-position:center 16%!important}
          .global-zeus-watermark{width:min(92vw,400px)!important;opacity:.095!important;top:49%!important}
          #notes .note h3{font-size:22px!important}
          #notes .note p,#notes .note strong{font-size:18px!important;line-height:1.6!important}
        }
      `;
      document.head.appendChild(style);
    }

    const cover = document.querySelector('.entry-cover');
    if (cover && cover.getAttribute('src') !== VERIFIED_ZEUS) {
      cover.src = VERIFIED_ZEUS;
      cover.removeAttribute('onerror');
    }

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
    if (watermark && watermark.getAttribute('src') !== VERIFIED_ZEUS) {
      watermark.src = VERIFIED_ZEUS;
    }
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

  // Body sonunda yüklendiği için beklemeden düzelt.
  installVisualFixes();
  installResultLock();

  window.addEventListener('load', () => {
    installVisualFixes();
    installResultLock();
    if ('serviceWorker' in navigator && location.protocol !== 'file:') {
      navigator.serviceWorker.register('./service-worker.js?v=10')
        .then(reg => {
          reg.update().catch(() => {});
          if (reg.waiting) reg.waiting.postMessage('SKIP_WAITING');
        })
        .catch(() => {});
    }
  });
})();