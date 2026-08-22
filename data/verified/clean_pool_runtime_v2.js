(function(g){'use strict';
function arraysFromGlobal(){const seen=new Set(),out=[];function add(arr){if(!Array.isArray(arr))return;for(const q of arr){if(q&&q.id&&!seen.has(q.id)){seen.add(q.id);out.push(q);}}}
 add(g.YKS2027_VERIFIED_QUESTIONS);
 const keys=Object.keys(g).filter(k=>/^YKS/i.test(k));
 for(const k of keys){const v=g[k];if(Array.isArray(v))add(v);else if(v&&typeof v==='object'){add(v.questions);if(v.batches&&typeof v.batches==='object'){for(const b of Object.values(v.batches)){if(Array.isArray(b))add(b);else if(b&&Array.isArray(b.questions))add(b.questions);}}}}
 return out;}
function run(opts){if(!g.YKS2027QualityGateV2)throw new Error('quality_gate_v2.js must be loaded first');const questions=arraysFromGlobal();const result=g.YKS2027QualityGateV2.process(questions,opts);g.YKS2027_CLEAN_POOL_STAGE2={generatedLoaded:questions.length,qualityGateVersion:result.version,semanticFamilies:result.semanticFamilies,reviewCandidateCount:result.reviewCandidateCount,quarantineCount:result.quarantineCount,reviewCandidates:result.reviewCandidates,quarantine:result.quarantine,liveEligible:[],livePoolReady:false,note:'Second independent semantic/content review is mandatory before any candidate can become liveEligible.'};return g.YKS2027_CLEAN_POOL_STAGE2;}
g.YKS2027CleanPoolRuntimeV2={run,arraysFromGlobal};if(typeof module!=='undefined'&&module.exports)module.exports=g.YKS2027CleanPoolRuntimeV2;
})(typeof globalThis!=='undefined'?globalThis:this);