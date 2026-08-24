const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');

const source=fs.readFileSync('app.js','utf8');
const start=source.indexOf('const BENCHMARK_QUESTIONS=100;');
const end=source.indexOf('const WEEK_PROGRAM=[',start);
assert.ok(start>=0&&end>start,'Program hedef kuralları bulunamadı.');
const rules=source.slice(start,end);
const context={};
vm.createContext(context);
vm.runInContext(rules,context,{filename:'program-rules'});
assert.equal(context.normalizeQuestionTarget(100,false),50);
assert.equal(context.normalizeQuestionTarget(500,false),50);
assert.equal(context.normalizeQuestionTarget(40,false),40);
assert.equal(context.normalizeQuestionTarget('',false),50);
assert.equal(context.normalizeQuestionTarget(100,true),100);
assert.equal(context.normalizeQuestionTarget(500,true),500);
assert.equal(context.normalizeQuestionTarget('',true),100);

const html=fs.readFileSync('index.html','utf8');
assert.match(html,/id="questionTarget"[^>]+max="50"/);
assert.match(html,/id="settingsQuestionTarget"[^>]+max="50"/);
assert.match(html,/PWA ID: 20260824-04/);
console.log('Program target smoke tests OK: free max 50, premium unlimited, old/invalid free target defaults to 50.');