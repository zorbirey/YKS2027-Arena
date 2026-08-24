'use strict';

const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const assert = (condition, message) => { if (!condition) throw new Error(message); };

const standard = read('arena-ai-teacher-standard-v1.js');
const index = read('index.html');
const sw = read('sw.js');
const sharedSkill = read('standards/arena-ai-teacher-standard/SKILL.md');

assert(standard.includes("marker: 'ARENA-AI-TEACHER-V1'"), 'Ortak AI öğretmen işareti eksik.');
assert(standard.includes('lifetimeDemoQuestions: 3'), 'Ücretsiz tanıtım hakkı eksik.');
assert(standard.includes('monthlyDemoQuestions: 5'), 'Premium tanıtım hakkı eksik.');
assert(standard.includes('dailyQuestions: 10') && standard.includes('monthlyQuestions: 200'), 'Pro kotaları eksik.');
assert(standard.includes('apiKeyInClient: false'), 'API anahtarı istemci yasağı eksik.');
assert(standard.includes('verifiedArenaContentOnly: true'), 'Doğrulanmış içerik sınırı eksik.');
assert(standard.includes('sendDirectIdentifiers: false'), 'Doğrudan kimlik bilgisi yasağı eksik.');
assert(index.includes('ARENA-AI-TEACHER-V1'), 'İşaret canlı arayüzde görünmüyor.');
assert(index.includes('Canlı yapay zekâ servisi henüz bağlı değildir'), 'Canlı olmayan özellik dürüstçe etiketlenmedi.');
assert(sw.includes('./arena-ai-teacher-standard-v1.js?v=20260824-08'), 'Standart service worker önbelleğinde eksik.');
assert(sw.includes('./arena-ai-teacher-v1.css?v=20260824-08'), 'AI öğretmen stili service worker önbelleğinde eksik.');
assert(sharedSkill.includes('ARENA-AI-TEACHER-V1'), 'Paylaşılan beceri işareti eksik.');

console.log('Arena AI Teacher standard smoke tests OK: shared marker, honest status, tier quotas and PWA cache.');
