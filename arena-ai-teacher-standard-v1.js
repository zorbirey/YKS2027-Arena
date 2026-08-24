(function () {
  'use strict';

  const standard = {
    marker: 'ARENA-AI-TEACHER-V1',
    schemaVersion: 1,
    status: 'reserved-not-live',
    productBoundary: {
      visualQuestionSolver: 'external-photomath-flow',
      arenaTeacher: 'grounded-text-tutor'
    },
    entitlements: {
      free: { lifetimeDemoQuestions: 3 },
      premium: { monthlyDemoQuestions: 5 },
      pro: { dailyQuestions: 10, monthlyQuestions: 200 },
      proPlus: { policy: 'higher-quota-with-human-support' }
    },
    runtime: {
      providerAdapterRequired: true,
      defaultProvider: 'openai',
      defaultModel: 'gpt-5.6-luna',
      apiKeyInClient: false,
      serverEntitlementCheck: true,
      verifiedArenaContentOnly: true,
      openWebSearch: false,
      maxAnswerWords: 500,
      sendDirectIdentifiers: false,
      providerStateStorage: false,
      inputOutputModeration: true
    }
  };

  window.ARENA_AI_TEACHER_STANDARD = Object.freeze(standard);
})();
