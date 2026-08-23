(function(){
  'use strict';
  var MIN_ANDROID=10;
  var ua=navigator.userAgent||'';
  var androidMatch=ua.match(/Android\s([0-9]+(?:\.[0-9]+)?)/i);
  var isAndroid=!!androidMatch;
  var isIOS=/iPad|iPhone|iPod/i.test(ua) || (navigator.platform==='MacIntel' && navigator.maxTouchPoints>1);
  var androidVersion=isAndroid?parseFloat(androidMatch[1]):null;
  var supported=!isAndroid || androidVersion>=MIN_ANDROID;

  function platformText(){
    if(isAndroid) return 'Android '+androidVersion;
    if(isIOS) return 'iOS / iPadOS';
    return 'Web tarayıcısı';
  }

  function buildSettings(){
    var topbar=document.querySelector('.topbar');
    if(!topbar || document.getElementById('settingsBtn')) return;
    var btn=document.createElement('button');
    btn.id='settingsBtn';
    btn.className='settings-btn';
    btn.type='button';
    btn.setAttribute('aria-label','Ayarlar ve sistem gereksinimleri');
    btn.textContent='⚙';
    topbar.appendChild(btn);

    var modal=document.createElement('div');
    modal.id='settingsModal';
    modal.className='settings-modal';
    modal.setAttribute('aria-hidden','true');
    modal.innerHTML='<div class="settings-sheet" role="dialog" aria-modal="true" aria-labelledby="settingsTitle">'+
      '<div class="settings-head"><div><span class="settings-kicker">YKS2027 ARENA</span><h2 id="settingsTitle">Ayarlar</h2></div><button id="settingsClose" class="settings-close" type="button" aria-label="Kapat">×</button></div>'+
      '<div class="settings-card"><span>Cihaz</span><strong id="devicePlatform">'+platformText()+'</strong><small id="deviceSupport"></small></div>'+
      '<div class="settings-card"><h3>Minimum Sistem Gereksinimleri</h3><p><b>Minimum:</b> Android 10</p><p><b>Önerilen:</b> Android 12 veya üzeri</p><p><b>Ana test:</b> Android 16 + güncel Chrome</p><p><b>Bellek:</b> En az 2 GB RAM önerilir</p><p><b>Tablet:</b> Telefon ve tablet ekranları desteklenir</p><p><b>Bağlantı:</b> İlk kurulum ve güncellemeler için internet gerekir; önbelleğe alınan içerik çevrimdışı çalışabilir.</p></div>'+
      '<div class="settings-card"><h3>Platform</h3><p>Bu sürüm Android-first geliştirilmiştir. Android 10–16 telefon ve tabletler ana destek aralığıdır.</p><p>iPhone/iPad tarayıcıdan açılabilir; iOS için mağaza sürümü hazırlanırken aynı içerik ve iş mantığı korunup iOS uyumluluk katmanı ayrıca uygulanır.</p></div>'+
      '</div>';
    document.body.appendChild(modal);

    var close=document.getElementById('settingsClose');
    var support=document.getElementById('deviceSupport');
    if(isAndroid && !supported){
      support.textContent='Desteklenen minimum Android sürümünün altında. Bazı özellikler düzgün çalışmayabilir.';
      support.className='support-bad';
    }else if(isAndroid){
      support.textContent='Desteklenen Android aralığında.';
      support.className='support-good';
    }else if(isIOS){
      support.textContent='Web erişimi mümkün; bu PWA sürümü Android için optimize edilmiştir.';
      support.className='support-warn';
    }else{
      support.textContent='Masaüstü/web önizleme modu.';
      support.className='support-warn';
    }

    function open(){modal.classList.add('show');modal.setAttribute('aria-hidden','false');}
    function hide(){modal.classList.remove('show');modal.setAttribute('aria-hidden','true');}
    btn.addEventListener('click',open);
    close.addEventListener('click',hide);
    modal.addEventListener('click',function(e){if(e.target===modal)hide();});

    if(isAndroid && !supported && !sessionStorage.getItem('yks-android-warning')){
      sessionStorage.setItem('yks-android-warning','1');
      setTimeout(open,700);
    }
  }

  function markPlatform(){
    document.documentElement.setAttribute('data-platform',isAndroid?'android':(isIOS?'ios':'web'));
    if(isAndroid) document.documentElement.setAttribute('data-android-major',String(Math.floor(androidVersion)));
  }

  markPlatform();
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',buildSettings);
  else buildSettings();
})();