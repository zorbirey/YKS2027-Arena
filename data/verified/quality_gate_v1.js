(function(g){'use strict';
const VERSION='1.0.0';
const FACTORY_MIN=16,FACTORY_MAX=301;
const CONTEXT_WORDS=/\b(analitik|odaklı|stratejik|karma|ileri|seçici|yoğun|süreli|yorumlu|beceri|kapsamlı|bağlantılı|dengeli|hedefli|derin|uygulamalı|tekrar|deneme|tarama|prova|çalışma|oturum|kamp|kontrol|pekiştirme|simülasyon|kapsamında|sırasında|notlarında|için|hazırlanan|çalışmasında)\b/gi;
function clone(x){return JSON.parse(JSON.stringify(x));}
function batchNo(id){const m=String(id||'').match(/^V(\d+)-/);return m?Number(m[1]):null;}
function setVerification(q,patch){q.verification=Object.assign({},q.verification||{},patch);return q;}
function replaceOptions(q,options,correctIndex,explanation){q.options=options;q.correctIndex=correctIndex;q.explanation=explanation;return q;}
function remediateKnown(question){const q=clone(question),v=batchNo(q.id);if(v==null)return q;
  // V42–V61: ambiguous chemistry equilibrium template. Make K the only invariant at constant temperature.
  if(v>=42&&v<=61&&/-AYT-KIM-002$/.test(q.id)){
    q.topic='Kimyasal Denge';
    q.question='Sıcaklık sabit tutulurken dengedeki bir tepkimeye derişim değişikliği uygulanıyor. Sistem yeniden dengeye ulaştığında aşağıdaki niceliklerden hangisinin değeri değişmeden kalır?';
    replaceOptions(q,['Tepkime bölümü Q','Denge sabiti K','İleri tepkime hızı','Geri tepkime hızı','Dengedeki türlerin derişimleri'],1,'Denge sabiti K yalnız sıcaklığa bağlıdır; sıcaklık sabitken derişim değişikliği K değerini değiştirmez.');
    setVerification(q,{remediation:'QG1-V42-CHEM-EQUILIBRIUM',answerChecked:true,distractorsChecked:true,semanticReviewRequired:true});
  }
  // V62–V101: replace weak/undefined AYT physics multiplication templates with explicit physical models.
  if(v>=62&&v<=101&&/-AYT-FIZ-00[1-4]$/.test(q.id)){
    const b=v-62,slot=Number(q.id.slice(-1));
    if(slot===1){const m=2+(b%6),a=3+(b%7),r=m*a;q.topic='Dinamik';q.question=`${m} kg kütleli bir cisme yatay doğrultuda net ${r} N kuvvet uygulanıyor. Cismin ivmesinin büyüklüğü kaç m/s² olur?`;replaceOptions(q,[String(a-2),String(a-1),String(a),String(a+1),String(a+2)],2,`Newton'un ikinci yasasına göre a=F/m=${r}/${m}=${a} m/s².`);}
    if(slot===2){const F=8+2*(b%8),d=3+(b%6),r=F*d;q.topic='İş ve Enerji';q.question=`Sabit ${F} N büyüklüğündeki kuvvet, kuvvet yönünde bir cismi ${d} m yer değiştiriyor. Bu kuvvetin yaptığı iş kaç J'dür?`;replaceOptions(q,[String(r-2*F),String(r-F),String(r),String(r+F),String(r+2*F)],2,`Kuvvet ve yer değiştirme aynı yönde olduğundan W=F·d=${F}×${d}=${r} J.`);}
    if(slot===3){const m=2+(b%5),speed=4+(b%6),r=m*speed*speed/2;q.topic='Enerji';q.question=`${m} kg kütleli bir cisim ${speed} m/s hızla hareket ediyor. Cismin kinetik enerjisi kaç J'dür?`;replaceOptions(q,[String(r-m*speed),String(r-m),String(r),String(r+m),String(r+m*speed)],2,`Kinetik enerji Eₖ=½mv²=½×${m}×${speed}²=${r} J.`);}
    if(slot===4){const m=2+(b%6),speed=3+(b%8),r=m*speed;q.topic='Momentum';q.question=`${m} kg kütleli bir cisim doğrusal olarak ${speed} m/s hızla hareket ediyor. Momentumunun büyüklüğü kaç kg·m/s'dir?`;replaceOptions(q,[String(r-2*m),String(r-m),String(r),String(r+m),String(r+2*m)],2,`Momentum p=m·v=${m}×${speed}=${r} kg·m/s.`);}
    setVerification(q,{remediation:'QG1-V62-PHYSICS-REWRITE',numericSecondCheck:true,answerChecked:true,distractorsChecked:true,semanticReviewRequired:true});
  }
  // V102–V141: difficulty was ID-length based. Reassign from cognitive/topic complexity.
  if(v>=102&&v<=141){
    const t=String(q.topic||'').toLocaleLowerCase('tr-TR');
    const s=String(q.subject||'').toLocaleLowerCase('tr-TR');
    let d='Orta';
    if(/yazım|noktalama|sözcükte anlam|temel kavram/.test(t))d='Kolay';
    if(/paragraf|denklem|yüzde|oran|hareket|kuvvet|mol|hücre/.test(t))d='Orta';
    if(/türev|integral|logaritma|ikinci derece|diziler/.test(t))d='Orta';
    if(s.includes('felsefe')||s.includes('tarih')||s.includes('coğrafya')||s.includes('edebiyat'))d='Orta';
    q.difficulty=d;
    setVerification(q,{difficultyCalibration:'QG1-content-rule',semanticReviewRequired:true});
  }
  // V142–V301: rectangle area was mislabeled as analytic geometry.
  if(v>=142&&v<=301&&/-AYT-MAT-006$/.test(q.id)&&/dikdörtgenin alanı/i.test(q.question||'')){
    q.topic='Dörtgenler ve Alan';
    setVerification(q,{remediation:'QG1-V142-TOPIC-LABEL',semanticReviewRequired:true});
  }
  // Factory-generated records are not individually verified until second semantic review.
  if(v>=FACTORY_MIN&&v<=FACTORY_MAX){
    setVerification(q,{status:'generated-baseline',liveEligible:false,humanReviewRequired:true,qualityGateVersion:VERSION});
  }
  return q;
}
function semanticFingerprint(question){
  let s=String(question.question||'').toLocaleLowerCase('tr-TR');
  s=s.replace(/[“”"'’]/g,'').replace(/\d+(?:[.,]\d+)?/g,'#').replace(CONTEXT_WORDS,' ');
  s=s.replace(/\b(v|v\d+|tyt|ayt)\b/g,' ').replace(/[^a-zçğıöşü#]+/gi,' ').replace(/\s+/g,' ').trim();
  return [String(question.exam||''),String(question.subject||''),String(question.topic||''),s].join('|');
}
function structuralIssues(q){const out=[];if(!q||!q.id)out.push('missing-id');if(!Array.isArray(q.options)||q.options.length!==5)out.push('not-five-options');else if(new Set(q.options).size!==5)out.push('duplicate-options');if(!Number.isInteger(q.correctIndex)||q.correctIndex<0||q.correctIndex>4)out.push('invalid-correctIndex');if(!String(q.question||'').trim())out.push('empty-question');if(!String(q.explanation||'').trim())out.push('empty-explanation');return out;}
function process(questions,opts){opts=Object.assign({maxPerSemanticFamily:4},opts||{});const remediated=(questions||[]).map(remediateKnown),families=new Map(),quarantine=[],secondReview=[];
  for(const q of remediated){const issues=structuralIssues(q);const fp=semanticFingerprint(q);const n=(families.get(fp)||0)+1;families.set(fp,n);if(issues.length){quarantine.push({id:q.id,reasons:issues});continue;}if(n>opts.maxPerSemanticFamily){quarantine.push({id:q.id,reasons:['semantic-family-overuse'],fingerprint:fp});continue;}secondReview.push(q);}
  return {version:VERSION,total:remediated.length,semanticFamilies:families.size,secondReviewCandidates:secondReview,quarantine,liveEligible:[],note:'No generated-baseline question becomes liveEligible without an independent second semantic/content review.'};
}
const api={version:VERSION,remediateKnown,semanticFingerprint,structuralIssues,process};g.YKS2027QualityGate=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);