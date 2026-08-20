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

// v6: Zeus görsellerini normal resim dosyası olarak değil Base64 metin payload olarak
// indirip tarayıcı içinde data URL'e çevirir. Böylece GitHub Pages görsel/MIME/cache
// sorunlarından bağımsız çalışır.
(async function loadEmbeddedZeus(){
  try{
    const cover=document.querySelector('.entry-cover');
    if(cover) cover.removeAttribute('src');

    const [coverRes,watermarkRes]=await Promise.all([
      fetch('./assets/zeus-cover-inline.webp?v=6',{cache:'no-store'}),
      fetch('./assets/zeus-watermark-inline.webp?v=6',{cache:'no-store'})
    ]);
    if(!coverRes.ok||!watermarkRes.ok) throw new Error('Zeus payload alınamadı');

    const [coverB64,watermarkB64]=await Promise.all([
      coverRes.text(),
      watermarkRes.text()
    ]);

    if(cover){
      cover.src='data:image/webp;base64,'+coverB64.trim();
      cover.style.opacity='1';
    }
    document.documentElement.style.setProperty(
      '--zeus-watermark-image',
      'url("data:image/webp;base64,'+watermarkB64.trim()+'")'
    );
    document.documentElement.classList.add('zeus-assets-ready');
  }catch(err){
    console.error('Zeus görselleri yüklenemedi',err);
  }
})();

// v6: filigranı her sekmede görünür tutan ve Akıllı Notları telefonda okunur yapan
// son katman. Ayrı CSS dosyasına bağımlı olmadan doğrudan sayfaya eklenir.
(function applyV6VisualFix(){
  const style=document.createElement('style');
  style.id='yks-v6-visual-fix';
  style.textContent=`
    .entry-cover{opacity:0;transition:opacity .2s ease}
    .zeus-assets-ready .entry-cover{opacity:1}
    .screen::before{
      background-image:var(--zeus-watermark-image,none)!important;
      background-position:center right!important;
      background-size:contain!important;
      background-repeat:no-repeat!important;
      opacity:.15!important;
      filter:saturate(.9) contrast(1.08)!important;
    }
    .screen .card{
      background:linear-gradient(180deg,rgba(17,29,39,.91),rgba(11,20,29,.91))!important;
    }
    #home .hero{background:rgba(5,10,15,.72)!important}
    #notes .note{background:rgba(9,19,27,.91)!important;padding:14px!important}
    #notes .note h3{font-size:19px!important;line-height:1.24!important;margin-bottom:9px!important}
    #notes .note p{font-size:16px!important;line-height:1.56!important;margin:8px 0!important;color:#f0f4f7!important}
    #notes .note strong{font-size:16px!important}
    #notes .notes-tools .chip,#notes .notes-tools select{font-size:12px!important}
    @media(max-width:430px){
      .screen::before{inset:4% -10% 0 10%!important;opacity:.17!important;background-position:center 46%!important}
      #notes .note{padding:15px!important}
      #notes .note h3{font-size:20px!important}
      #notes .note p,#notes .note strong{font-size:17px!important;line-height:1.58!important}
      #notes .notes-tools .chip,#notes .notes-tools select{font-size:13px!important}
      #notes .notes-grid{gap:10px!important;overflow:auto!important}
    }
  `;
  document.head.appendChild(style);
})();
