const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');

const context={window:{}};
vm.createContext(context);
for(const file of ['courses-v1.js','exam-guide-v1.js','exam-questions-core-v1.js','exam-questions-social-v1.js']){
  vm.runInContext(fs.readFileSync(file,'utf8'),context,{filename:file});
}

const courses=context.window.YKS2027_COURSES.courses;
const guide=context.window.YKS2027_EXAM_GUIDE;
const sets=context.window.YKS2027_EXAM_QUESTION_SETS;
const units=courses.flatMap((course)=>course.units.map((unit)=>course.title+'|'+unit.title));
assert.equal(guide.buildId,'20260824-08');
assert.equal(units.length,44);
assert.equal(Object.keys(guide.profiles).length,44,'Her ünite için sınav rehberi bulunmalı.');
for(const key of units){
  const profile=guide.profiles[key];
  assert.ok(profile,key+' rehberi eksik.');
  assert.ok(profile.questionTypes.length>=3,key+' soru tipleri eksik.');
  assert.ok(profile.distractors.length>=3,key+' çeldiricileri eksik.');
  assert.ok(profile.cautions.length>=3,key+' dikkat noktaları eksik.');
  assert.ok(profile.examUse.length>=80,key+' sınav kullanımı açıklaması kısa.');
}

const expectedPacks=[
  'Matematik|Limit ve Süreklilik',
  'Türk Dili ve Edebiyatı|Hikâye',
  'Fizik|Çembersel Hareket',
  'Kimya|Kimya ve Elektrik',
  'Biyoloji|Genden Proteine',
  'T.C. İnkılap Tarihi ve Atatürkçülük|Millî Mücadele’nin Hazırlık Dönemi',
  'Coğrafya|Doğal Sistemler ve Ekstrem Olaylar',
  'Felsefe Grubu ve Din Kültürü|Mantık'
];
assert.deepEqual(Object.keys(sets).sort(),expectedPacks.sort());
const ids=new Set();
let questionCount=0;
for(const key of expectedPacks){
  const pack=sets[key];
  assert.equal(pack.length,5,key+' beş seviyeyi içermeli.');
  assert.deepEqual(Array.from(pack,(question)=>question.difficulty),Array.from(guide.difficultyOrder));
  for(const question of pack){
    questionCount+=1;
    assert.equal(question.options.length,5,question.id+' beş seçenekli olmalı.');
    assert.ok(Number.isInteger(question.answer)&&question.answer>=0&&question.answer<5);
    assert.ok(question.explanation.length>=60,question.id+' çözümü kısa.');
    assert.equal(question.distractorNotes.length,4,question.id+' dört yanlış seçeneği açıklamalı.');
    assert.ok(question.attention.length>=35,question.id+' dikkat notu kısa.');
    assert.equal(ids.has(question.id),false,question.id+' yineleniyor.');
    ids.add(question.id);
  }
}
assert.equal(questionCount,40);

const engagement=fs.readFileSync('engagement-v1.js','utf8');
assert.match(engagement,/5 • SORU TİPLERİ VE ÇELDİRİCİLER/);
assert.match(engagement,/6 • SEVİYELİ SORU LABORATUVARI/);
assert.match(engagement,/Cevap ve çeldirici analizini göster/);
const index=fs.readFileSync('index.html','utf8');
for(const asset of ['exam-guide-v1.css','exam-guide-v1.js','exam-questions-core-v1.js','exam-questions-social-v1.js'])assert.match(index,new RegExp(asset.replaceAll('.','\\.')));
assert.ok(index.indexOf('exam-questions-social-v1.js')<index.indexOf('engagement-v1.js'));
const sw=fs.readFileSync('sw.js','utf8');
for(const asset of ['exam-guide-v1.css','exam-guide-v1.js','exam-questions-core-v1.js','exam-questions-social-v1.js'])assert.match(sw,new RegExp(asset.replaceAll('.','\\.')));

console.log('Exam guide smoke tests OK: 44 guides, 8 courses, 40 original questions, five difficulty levels.');
