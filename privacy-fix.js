// Her yeni turda önceki turun sonuç kilidini yeniden kapatır.
// Böylece soru çözümü sırasında Raporlar sekmesine geçilse bile doğru cevaplar görünmez.
(function(){
  if(typeof startSession!=='function') return;
  const originalStartSession=startSession;
  startSession=function(title){
    const review=document.getElementById('review');
    if(review){
      review.dataset.unlocked='0';
      review.innerHTML='<div class="small">Tur tamamlandığında cevapların burada gösterilir.</div>';
    }
    return originalStartSession(title);
  };
})();
