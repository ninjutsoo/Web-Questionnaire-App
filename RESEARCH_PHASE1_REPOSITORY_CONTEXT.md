# Validated Phase 1 Repository Context

Validated by the lead against the repository on 2026-06-17. Labels mean runtime evidence, not product intent. Credential values are deliberately redacted.

## 1. Product, users, stakeholders, and journeys

- **Implemented:** React/Vite/Ant Design application for an authenticated older adult to answer four 4Ms domains: What Matters, Medication, Mentation (`mind`), and Mobility (`src/views/Questionnaire/Questionnaire.jsx:19-52`; `src/services/questionnaireService.js:187-250`).
- **Implemented:** Users move between sections, use tags/free text/ratings, dictate or type, scan medication codes, explicitly save, review/edit, and share/print/download a plaintext report (`src/views/Questionnaire/4msSection.jsx:122-695`; `src/views/Questionnaire/ReviewSubmit.jsx:174-255,348-410`).
- **Partially implemented:** Review says **Save Assessment** and never calls the available `completeSession`; there is no active submission threshold or immutable submission state (`src/views/Questionnaire/ReviewSubmit.jsx:375-397`; `src/services/questionnaireService.js:448-459`).
- **Documented only:** README claims autosave, caregiver-tip UI, and Submit Assessment; current UI has explicit Save, no caregiver send control, and no submit action (`README.md:34-41,254-268`; `src/views/Questionnaire/Questionnaire.jsx:142-165`; `src/views/Questionnaire/ReviewSubmit.jsx:375-397`).
- **Inferred:** Primary user is the older adult; family caregivers are secondary recipients/supporters, and clinicians are prospective consumers of exported reports, not authenticated roles in current code.

## 2. Inputs, outputs, storage, communications, and device capabilities

- **Implemented:** `Questions/4ms_health` stores a mutable questionnaire schema and is seeded/migrated client-side when read (`src/services/questionnaireService.js:160-266`).
- **Implemented:** `Answers/{uid}_4ms_health` stores `userId`, questionnaire ID, status, four response maps, timestamps, and generated quick questions (`src/services/questionnaireService.js:337-410`; `src/components/AIChatbot.jsx:389-410`). The README's `Sessions` claim is stale.
- **Implemented:** Inputs include tag selections and notes; happiness, memory concern, and sleep 1-10 ratings; mobility type/aids/challenges/fall concerns; and structured medication category/name/dose/frequency/notes (`src/services/questionnaireService.js:56-82,187-250`; `src/views/Questionnaire/4msSection.jsx:211-232`). Caregiver email is a profile field in `Users`, not a questionnaire response (`src/views/Signup/Signup.jsx:385-418`; `src/components/ProfileModal.jsx:65-71`).
- **Implemented:** Browser storage keeps chat messages, quick-question cache/timestamps, and the location-enabled preference under origin-global keys, not user-scoped keys (`src/components/AIChatbot.jsx:45-65,78-81,100-129,460-463`).
- **Implemented:** Browser capabilities include Web Speech Recognition, speech synthesis, geolocation, native share, print/download, and camera barcode scanning (`src/components/AIChatbot.jsx:187-265,473-516`; `src/components/SpeechReader.jsx:8-55`; `src/components/MedicationScanner.jsx:105-181`; `src/views/Questionnaire/ReviewSubmit.jsx:219-255`).
- **Implemented:** External flows send coordinates to OpenStreetMap Nominatim; scanned codes to openFDA, RxNorm, UPC services/CORS proxies, and Open Food Facts; questionnaire/chat/location context to OpenRouter; and medication/mobility content through SendGrid (`src/components/AIChatbot.jsx:483-499`; `src/services/drugLookupService.js:1-210`; `functions/index.js:156-211,322-396`).
- **Implemented:** Caregiver email is excluded from assembled AI questionnaire context (`src/services/questionnaireService.js:619-625`).

## 3. Current AI behavior and action capability

- **Implemented:** Chat sends full locally retained history plus formatted questionnaire context and optional reverse-geocoded address to `/api/chat`; quick questions are generated from questionnaire context and saved locally and in the Answer document (`src/components/AIChatbot.jsx:518-570,744-766`).
- **Implemented:** Firebase Functions build a concise, plain-language system prompt, interpolate user-provided questionnaire values directly, and use a persistent free-first OpenRouter router with model circuits, paid fallback, and scheduled recovery probing (`functions/index.js:50-80,322-396`; `functions/aiModelRouter.js:15-26,166-176,320-445`).
- **Partially implemented:** Prompt language incorrectly calls the model a "medical advisor" and supplies no deterministic medical/emergency policy, contraindication validator, or clinician escalation rule (`functions/index.js:69-77`).
- **Partially implemented:** Only a 15-second client cooldown limits chat. HTTP endpoints lack Firebase ID-token verification and server-side per-user rate/cost limits (`src/components/AIChatbot.jsx:533-535`; `functions/index.js:243-396`).
- **Partially implemented:** Generic outage responses resemble normal assistant output; personalization/model failure is not always explicit (`functions/index.js:354-364,384-394`).
- **Implemented:** Current AI can answer and generate questions only (L0/L1). It has no typed tool registry, user-confirmed writes, audit trail, scheduler preference tool, or permission-aware caregiver/clinician action.

## 4. Architecture and data flow

- **Implemented:** React 18/Vite/Ant Design calls Firebase Auth and Firestore directly. Hosting serves `dist`, rewrites `/api/**` to Firebase Function `api`, and falls back to the SPA (`package.json:6-30`; `firebase.json:25-48`).
- **Implemented:** Two Express backends duplicate chat, quick-question, email, reminder, and fallback logic: standalone `chat-backend/server.js` and deployed-oriented `functions/index.js`. Functions additionally use `functions/aiModelRouter.js`; model lists, routing, secret handling, and fallbacks have drifted.
- **Inferred:** Root `/send-caregiver-tip` and `/send-daily-reminders-now` are not covered by the `/api/**` Hosting rewrite (`firebase.json:40-43`; `functions/index.js:253-293`).
- **Implemented:** Root scripts provide build/lint but no automated test command (`package.json:6-11`).
- **Partially implemented:** `saveSectionResponses` catches and does not rethrow Firestore errors, so the caller can report success despite failed persistence (`src/services/questionnaireService.js:428-442`; `src/views/Questionnaire/Questionnaire.jsx:142-164`).

## 5. Accessibility and older-adult provisions

- **Implemented:** Focus moves to section headings; choice groups are keyboard buttons with `aria-pressed`; many controls meet 44px sizing; status text uses live regions; layout is responsive; voice has typed fallback; question speech is slowed (`src/views/Questionnaire/Questionnaire.jsx:54-56,266-279`; `src/views/Questionnaire/4msSection.jsx:79-120`; `src/components/SpeechReader.jsx:18-21,58-92`; `src/components/AppLayout.jsx:120-239`).
- **Partially implemented:** Some visible field descriptors are not programmatically associated labels; camera failures suppress user-facing explanations; speech synthesis can retry indefinitely if voices never load (`src/views/Questionnaire/4msSection.jsx:469-498`; `src/components/MedicationScanner.jsx:174-180`; `src/components/SpeechReader.jsx:37-55`).
- **Unknown:** No repository evidence establishes WCAG 2.2 conformance, screen-reader coverage, 200-400% zoom/reflow testing, hearing-loss testing, cognitive accessibility testing, or co-design/usability studies with diverse older adults.

## 6. Safety, privacy, consent, security, and reliability

- **Implemented:** `AI_SETUP.md` contains a plaintext credential-like token. **Value redacted.** Revoke/rotate it and scrub history (`AI_SETUP.md:30`).
- **Implemented:** `firebase.json` deploys `firebase-security-rules.txt`, which permits public `Users` get/list and any authenticated user read/write access to all other documents. That includes other users' Answers, questionnaire definitions, and `system/aiModelRouting` (`firebase.json:2-7`; `firebase-security-rules.txt:5-15`).
- **Partially implemented:** Unused `firestore-rules-only.txt` is narrower but still permits any authenticated user to write Questions and has unsafe Answer-create ownership semantics (`firestore-rules-only.txt:9-20`).
- **Implemented:** CORS reflects all origins with credentials; chat, quick-question, email, reminder, and debug/status routes do not authenticate callers. A public manual reminder call can trigger email across all users (`functions/index.js:243-251,285-320,322-396,464-550`).
- **Implemented:** The daily scheduler sends medication summaries and mobility content to profile, caregiver, and Auth emails without active opt-in, preference, quiet-hour, timezone, revocation, or recipient-scope checks. The conditional consent-like code is commented out (`functions/index.js:111-127,156-211,214-241,552-557`).
- **Implemented:** Server and browser logs expose messages, questionnaire context, addresses, prompt fragments, user IDs, and recipient emails; debug prompt fragments return to the browser (`chat-backend/server.js:225-265,340-360`; `src/components/AIChatbot.jsx:544-562`; `functions/index.js:203-206,377-382`).
- **Implemented:** Questionnaire free text is interpolated into the system message without instruction/data separation, creating direct prompt-injection exposure (`src/services/questionnaireService.js:627-657`; `functions/index.js:69-77`).
- **Implemented:** Chat history is local and origin-global, so accounts sharing a browser profile can see one another's retained chat (`src/components/AIChatbot.jsx:45-65,460-463`).
- **Partially implemented:** Structured medication entries can be counted beyond schema totals and make progress exceed 100%; daily email formatting ignores this structured array (`src/views/Questionnaire/Questionnaire.jsx:115-127`; `src/views/Questionnaire/ReviewSubmit.jsx:97-118`; `functions/index.js:130-145`).
- **Partially implemented:** A non-medication UPC/Open Food Facts match may return success and the scanner announces "Medication found and added" (`src/services/drugLookupService.js:151-198`; `src/components/MedicationScanner.jsx:137-141`).
- **Unknown:** Repository inspection cannot establish actual deployed rules/version, provider retention/training terms, SendGrid sender/consent status, HIPAA or other legal applicability, or production monitoring.

## 7. Constraints, duplication, stale docs, unfinished code, and seams

- **Documented only:** `AI_SETUP.md` describes an offline keyword/Hugging Face implementation and `/api/chat/simple`; current code is OpenRouter `/api/chat`. Its no-sensitive-data-storage claim conflicts with retained local health chat (`AI_SETUP.md:37-121`; `src/components/AIChatbot.jsx:45-65`).
- **Documented only:** README claims `Sessions`, autosave, caregiver-tip UI, and submission; runtime uses `Answers`, explicit Save, no send UI, and no completion call.
- **Partially implemented:** Mojibake appears in docs, prompts, logs, and legacy text and may reach users (`AI_SETUP.md`; `functions/index.js:54-62`; `src/components/AIChatbot.jsx:15-17`).
- **Implemented:** Integration seams include `getUserQuestionnaireContext`, generic section/choice rendering, report generation, speech reader, scanner/drug lookup, Firebase Function API, scheduled Functions, SendGrid, and persistent model routing.
- **Constraint:** Before agentic tools, fix authorization/rules, secret exposure, logging, consent, user-scoped storage, backend duplication, save error propagation, and medication-identification semantics.

## 8. Strict status summary

| Area | Status |
|---|---|
| Guided 4Ms questionnaire and explicit save | **Implemented** |
| Autosave and true submission/completion | **Documented only / Partially implemented** |
| AI chat and generated quick questions | **Implemented (L0/L1 only)** |
| Voice, location, scanner, share/print/download | **Implemented with gaps** |
| Caregiver email profile field | **Implemented** |
| Questionnaire caregiver send UI | **Documented only** |
| Daily medication/mobility scheduler | **Implemented without adequate consent/security controls** |
| Server-authorized agent actions/audit/undo | **Unknown / not implemented** |
| WCAG 2.2 conformance and older-adult validation | **Unknown** |
| Production readiness/compliance | **Unknown; cannot be inferred** |

## 9. Reusable assets and non-negotiable blockers

**Reusable:** questionnaire schema/context service; generic section renderer; accessible button groups; speech input/output; structured medication entry UI; drug lookup adapter; report builder; Firebase Auth/Firestore/Functions; SendGrid adapter; scheduled triggers; OpenRouter routing/circuit logic.

**Blockers:** overly broad Firestore rules; unauthenticated APIs; exposed credential; unscoped logs/localStorage; no consent/delegation model; unsafe reminder defaults; no typed/authorized tool layer, idempotency, confirmation, audit, undo, or retention controls; direct prompt injection path; backend drift; no automated/evaluation test suite; medication scan false-success semantics; save failures hidden from UI; no qualified clinical/privacy/legal review.
