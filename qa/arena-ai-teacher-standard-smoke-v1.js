'use strict';
const fs=require('fs'),assert=require('assert');
const code=fs.readFileSync('arena-ai-teacher-standard-v1.js','utf8'),core=fs.readFileSync('arena-core-v1.js','utf8'),sw=fs.readFileSync('service-worker.js','utf8'),html=fs.readFileSync('index.html','utf8');
assert.match(code,/ARENA-AI-TEACHER-V1/);assert.match(code,/apiKeyInClient:\s*false/);assert.match(core,/proDaily:10,proMonthly:200/);assert.match(sw,/arena-ai-teacher-standard-v1\.js/);assert.match(html,/ARENA PRO/);assert.match(html,/ARENA PRO\+/);console.log('Arena AI teacher standard smoke OK');