// Her yeni turda önceki turun sonuç kilidini yeniden kapatır.
// Böylece soru çözümü sırasında Raporlar sekmesine geçilse bile doğru cevaplar görünmez.
(function(){
  if(typeof startSession==='function'){
    const originalStartSession=startSession;
    startSession=function(title){
      const review=document.getElementById('review');
      if(review){
        review.dataset.unlocked='0';
        review.innerHTML='<div class="small">Tur tamamlandığında cevapların burada gösterilir.</div>';
      }
      return originalStartSession(title);
    };
  }
})();

// v7: GitHub Pages asset yolunu tamamen devre dışı bırak.
// Görseller, oluşturuldukları sabit commit üzerinden raw.githubusercontent.com'dan gelir.
(function loadZeusFromImmutableRaw(){
  const commit='0a8ac41f0dd52dddbfebeac81619d89a85dcf6be';
  const base='https://raw.githubusercontent.com/zorbirey/YKS2027-Arena/'+commit+'/assets/';
  const coverUrl=base+'arena-cover.webp';
  const watermarkUrl=base+'zeus-watermark.webp';

  const cover=document.querySelector('.entry-cover');
  if(cover){
    cover.src=coverUrl;
    cover.removeAttribute('srcset');
    cover.style.opacity='1';
    cover.onerror=function(){
      // İkinci yol: doğrudan main branch raw dosyası.
      if(!this.dataset.fallback){
        this.dataset.fallback='1';
        this.src='https://raw.githubusercontent.com/zorbirey/YKS2027-Arena/main/assets/arena-cover.webp?v=7';
      }
    };
  }

  document.documentElement.style.setProperty(
    '--zeus-watermark-image',
    'url("'+watermarkUrl+'")'
  );
  document.documentElement.classList.add('zeus-assets-ready');
})();

// v7 mobil görünürlük ve Akıllı Notlar okunabilirlik katmanı.
(function applyV7VisualFix(){
  const style=document.createElement('style');
  style.id='yks-v7-visual-fix';
  style.textContent=`
    .entry-cover{opacity:1!important;object-fit:cover!important;object-position:center top!important}
    .screen{position:relative!important;isolation:isolate!important}
    .screen::before{
      content:""!important;
      position:absolute!important;
      inset:0!important;
      pointer-events:none!important;
      z-index:-1!important;
      background-image:var(--zeus-watermark-image,none)!important;
      background-position:center 42%!important;
      background-size:min(82vw,520px) auto!important;
      background-repeat:no-repeat!important;
      opacity:.16!important;
      filter:saturate(.9) contrast(1.08)!important;
    }
    .screen .card{background:linear-gradient(180deg,rgba(17,29,39,.90),rgba(11,20,29,.90))!important}
    #notes .note{background:rgba(8,18,26,.91)!important;padding:15px!important}
    #notes .note h3{font-size:20px!important;line-height:1.22!important;margin:0 0 10px!important}
    #notes .note p{font-size:17px!important;line-height:1.58!important;margin:9px 0!important;color:#f3f6f8!important}
    #notes .note strong{font-size:17px!important}
    #notes .notes-tools .chip,#notes .notes-tools select{font-size:13px!important}
    #notes .notes-grid{gap:10px!important;overflow:auto!important}
    @media(max-width:430px){
      .screen::before{background-size:94vw auto!important;background-position:center 46%!important;opacity:.18!important}
      #notes .note{padding:16px!important}
      #notes .note h3{font-size:21px!important}
      #notes .note p,#notes .note strong{font-size:17px!important;line-height:1.62!important}
    }
  `;
  document.head.appendChild(style);
})();