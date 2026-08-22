(()=>{
  'use strict';

  const ROOT=document.documentElement;
  const COVER_PAYLOAD='./assets/zeus-cover-inline.webp?v=14';
  const WATERMARK_PAYLOAD='./assets/zeus-watermark-inline.webp?v=14';
  const FALLBACK_COVER='./assets/zeus-real-v09.webp?v=14';
  const FALLBACK_WATERMARK='./assets/zeus-watermark-v09.webp?v=14';

  function quoteCssUrl(url){
    return `url("${url.replace(/"/g,'%22')}")`;
  }

  async function payloadToDataUrl(path){
    const response=await fetch(path,{cache:'no-store'});
    if(!response.ok) throw new Error(`Zeus payload HTTP ${response.status}`);
    const raw=(await response.text()).trim();
    if(raw.startsWith('data:image/')) return raw;
    if(!/^UklGR[A-Za-z0-9+/=\r\n]+$/.test(raw)) throw new Error('Geçersiz Zeus WebP payload');
    return `data:image/webp;base64,${raw.replace(/\s+/g,'')}`;
  }

  function applyAssets(cover,watermark,mode){
    ROOT.style.setProperty('--zeus-cover-image',quoteCssUrl(cover));
    ROOT.style.setProperty('--zeus-watermark-image',quoteCssUrl(watermark));
    ROOT.dataset.zeusAssetMode=mode;
    ROOT.classList.add('zeus-ready');
    window.dispatchEvent(new CustomEvent('yks-zeus-ready',{detail:{mode}}));
  }

  async function loadZeus(){
    ROOT.classList.add('zeus-loading');
    try{
      const [cover,watermark]=await Promise.all([
        payloadToDataUrl(COVER_PAYLOAD),
        payloadToDataUrl(WATERMARK_PAYLOAD)
      ]);
      applyAssets(cover,watermark,'inline-base64-decoded');
    }catch(err){
      console.warn('YKS Zeus payload fallback:',err);
      applyAssets(FALLBACK_COVER,FALLBACK_WATERMARK,'binary-fallback');
    }finally{
      ROOT.classList.remove('zeus-loading');
    }
  }

  loadZeus();
})();
