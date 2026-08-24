---
name: arena-ai-teacher-standard
description: Apply the shared Arena AI Teacher product, quota, safety, cost-control, and PWA integration contract when an Arena project names ARENA-AI-TEACHER-V1 or adds an AI tutor.
---

# Arena AI Teacher Standard

Use the immutable decision marker `ARENA-AI-TEACHER-V1` across Arena projects.

## Product boundary

- Treat visual question solving as a separate external Photomath flow. Do not claim an integration is live without a valid license, supported handoff, and verified production connection.
- Define Arena AI Teacher as a text tutor grounded in the Arena project's reviewed lesson content. It is not an unrestricted general chatbot and does not browse the open web by default.
- Keep Premium as the complete standard study product. Reserve AI diagnosis, adaptive explanations, and personal tutoring for Pro. Pro+ may add higher quotas and real human support.

## Shared entitlements

- Free: 3 lifetime demonstration questions.
- Premium: 5 demonstration questions per month.
- Pro: no more than 10 questions per day and 200 per month in the initial contract.
- Pro+: do not promise a fixed unlimited allowance before human and model costs are measured.

Enforce entitlements and usage on a trusted backend. Client-side counters are display-only.

## Runtime invariants

- Keep provider selection behind a server-side adapter. The initial cost-oriented default may be `gpt-5.6-luna`, but verify current official documentation and run subject-quality evaluations before every production selection or migration.
- Never put an AI provider key in PWA JavaScript, HTML, a manifest, or a service worker.
- Retrieve only the few reviewed Arena content fragments relevant to the selected course and topic. Cap normal answers at roughly 500 words and avoid sending long chat histories.
- Do not send names, phone numbers, school names, parent data, exact locations, or other direct identifiers to the model. Use anonymous internal identifiers only when necessary.
- Apply age-appropriate disclosure, input/output safety checks, abuse reporting, rate limits, and hard daily/monthly spend limits.
- Disable provider-side response storage when supported. Store only the minimum application data required for the student's own history and document the retention rule.

## Honest delivery

Do not simulate AI answers or describe the tutor as working until the backend, provider credentials, subscription verification, server quotas, safety controls, and failure states are operational. A preview must say that the live AI service is not connected.

When deploying an Arena PWA change, increment its visible build ID, align the manifest and service-worker cache, keep production visuals in the established versioned visual layer, and test the offline shell.
