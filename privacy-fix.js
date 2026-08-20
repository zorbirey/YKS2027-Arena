// Her yeni turda önceki turun sonuç kilidini yeniden kapatır.
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

// v7: Zeus görselleri için üç bağımsız kaynak.
(function loadZeusWithFallbacks(){
  const commit='0a8ac41f0dd52dddbfebeac81619d89a85dcf6be';
  const coverSources=[
    'https://raw.githubusercontent.com/zorbirey/YKS2027-Arena/'+commit+'/assets/arena-cover.webp',
    'https://cdn.jsdelivr.net/gh/zorbirey/YKS2027-Arena@'+commit+'/assets/arena-cover.webp',
    './assets/arena-cover.webp?v=7'
  ];
  const watermarkSources=[
    'https://raw.githubusercontent.com/zorbirey/YKS2027-Arena/'+commit+'/assets/zeus-watermark.webp',
    'https://cdn.jsdelivr.net/gh/zorbirey/YKS2027-Arena@'+commit+'/assets/zeus-watermark.webp',
    './assets/zeus-watermark.webp?v=7'
  ];

  const cover=document.querySelector('.entry-cover');
  if(cover){
    let i=0;
    cover.style.opacity='0';
    const next=()=>{
      if(i>=coverSources.length){
        cover.style.display='none';
        return;
      }
      cover.src=coverSources[i++];
    };
    cover.onload=()=>{cover.style.display='block';cover.style.opacity='1'};
    cover.onerror=next;
    next();
  }

  document.documentElement.style.setProperty(
    '--zeus-watermark-image',
    watermarkSources.map(u=>'url("'+u+'")').join(',')
  );
  document.documentElement.classList.add('zeus-assets-ready');
})();

(function applyV7VisualFix(){
  const style=document.createElement('style');
  style.id='yks-v7-visual-fix';
  style.textContent=`
    .entry-cover{object-fit:cover!important;object-position:center top!important;transition:opacity .18s ease!important}
    .screen{position:relative!important;isolation:isolate!important}
    .screen::before{
      content:""!important;
      position:absolute!important;
      inset:0!important;
      pointer-events:none!important;
      z-index:-1!important;
      background-image:var(--zeus-watermark-image,none)!important;
      background-position:center 42%,center 42%,center 42%!important;
      background-size:min(82vw,520px) auto,min(82vw,520px) auto,min(82vw,520px) auto!important;
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
      .screen::before{background-size:94vw auto,94vw auto,94vw auto!important;background-position:center 46%,center 46%,center 46%!important;opacity:.18!important}
      #notes .note{padding:16px!important}
      #notes .note h3{font-size:21px!important}
      #notes .note p,#notes .note strong{font-size:17px!important;line-height:1.62!important}
    }
  `;
  document.head.appendChild(style);
})();