const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');

const context={window:{}};
vm.createContext(context);
vm.runInContext(fs.readFileSync('courses-v1.js','utf8'),context,{filename:'courses-v1.js'});
vm.runInContext(fs.readFileSync('course-details-v1.js','utf8'),context,{filename:'course-details-v1.js'});

const courses=context.window.YKS2027_COURSES.courses;
const library=context.window.YKS2027_COURSE_DETAILS;
const units=courses.flatMap((course)=>course.units.map((unit)=>({course:course.title,unit})));
assert.equal(library.buildId,'20260824-06');
assert.equal(units.length,44,'Beklenen 44 ders ünitesi bulunmalı.');
assert.equal(Object.keys(library.details).length,44,'Her ünite için tek bir ayrıntılı içerik bulunmalı.');

for(const entry of units){
  const detail=library.details[entry.course+'|'+entry.unit.title];
  assert.ok(detail,entry.course+' / '+entry.unit.title+' ayrıntısı eksik.');
  assert.ok(detail.explanation.length>=250,entry.unit.title+' anlatımı yeterince ayrıntılı değil.');
  assert.ok(Array.isArray(detail.concepts)&&detail.concepts.length>=4,entry.unit.title+' kavramları eksik.');
  assert.ok(Array.isArray(detail.solution)&&detail.solution.length>=3,entry.unit.title+' çözümlü örneği eksik.');
  assert.ok(detail.mistake.length>=60,entry.unit.title+' hata uyarısı eksik.');
  assert.ok(detail.visual&&detail.visual.items.length>=3,entry.unit.title+' şeması eksik.');
}

assert.ok(library.sources.common.length>=2);
assert.ok(library.sources.Matematik.length>=2);
assert.ok(library.sources.Fizik.length>=2);
const engagement=fs.readFileSync('engagement-v1.js','utf8');
assert.match(engagement,/function lessonPages\(/);
assert.match(engagement,/sınav rehberi/);
assert.match(engagement,/5 • SORU TİPLERİ VE ÇELDİRİCİLER/);
assert.match(engagement,/readerState\.page\+=1/);
const index=fs.readFileSync('index.html','utf8');
assert.ok(index.indexOf('courses-v1.js')<index.indexOf('course-details-v1.js'));
assert.ok(index.indexOf('course-details-v1.js')<index.indexOf('exam-guide-v1.js'));
assert.ok(index.indexOf('exam-guide-v1.js')<index.indexOf('exam-questions-core-v1.js'));
assert.ok(index.indexOf('exam-questions-social-v1.js')<index.indexOf('engagement-v1.js'));
const app=fs.readFileSync('app.js','utf8');
assert.match(app,/if\(!isPremium\(\)\|\|!programPrefs\.wantsRest/);
assert.match(index,/id="programPersonalizeLock"[^>]+data-premium-route="program-customize"/);

console.log('Course details smoke tests OK: 44 rich units, exam-guide reader, verified sources and Premium program lock.');
