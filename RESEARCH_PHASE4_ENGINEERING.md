# Phase 4A — Engineering Feasibility Review

**Role:** Engineering Feasibility Architect  
**Prepared:** 2026-06-17  
**Scope:** N1–N12 from `RESEARCH_NORMALIZED_CANDIDATES.md`; research and architecture only; no application changes  
**Repository basis:** master prompt, validated Phase 1 context, all Phase 2 research and implementation files, and the Phase 3 Persona Council

## Executive engineering judgment

The current React/Vite/Firebase shape can support the strongest candidates, but the deployed implementation is not a safe base for model-directed writes, reminders, or sharing. The first release should remain a Firebase monolith: React 18/Vite/Ant Design in the browser, Firebase Auth and owner-scoped Firestore, and one consolidated second-generation Functions backend. The standalone `chat-backend/` should not remain a second production implementation.

There is also a deployment-level mismatch: `functions/package.json` requests Node 24, while Firebase's current Functions guide lists Node 22 and 20 as supported and Node 18 as deprecated. Normalize and emulator/deploy-test the runtime before feature work; do not assume the current engine value is deployable ([Firebase: manage Functions / set Node.js version](https://firebase.google.com/docs/functions/manage-functions#set_node.js_version); accessed 2026-06-17).

The near-term engineering order is:

1. Repair authentication, authorization, security rules, secret/log handling, save truth, scanner truth, user-scoped storage, and backend drift.
2. Add a typed proposal/action layer, provenance, versioned writes, user-visible audit/undo, tests, cost/latency telemetry, and deterministic no-model fallbacks.
3. Build **N2**, **N3**, and **N4** first. N2 should ship as deterministic accessible UX; N3 supplies the source/correction contract reused by N4.
4. Add **N8** only after a consent-aware notification module replaces the current blanket daily email scan. Pilot **N1** after the same write/provenance controls.
5. Treat **N5, N6, and N9** as second-wave work. **N7** is a separate delegated-access program, not an email feature. **N10** has no established directory partnership. **N11** should remain manual. **N12** should remain a generic worksheet unless one governed decision-aid integration is validated.

No candidate should depend on free OpenRouter models in production. OpenRouter says free models have low rate limits and are usually unsuitable for production; structured outputs are available only on compatible models. Tool calls are model suggestions—the application, not the model, executes a tool. These constraints align with the proposed server-authorized design ([OpenRouter FAQ](https://openrouter.ai/docs/faq), [structured outputs](https://openrouter.ai/docs/guides/features/structured-outputs), [tool calling](https://openrouter.ai/docs/guides/features/tool-calling); accessed 2026-06-17).

## Estimation method and staffing assumptions

- One **engineer-week (EW)** is five focused days by an experienced engineer familiar with React, Node, Firebase, and automated testing. Estimates include implementation, code review, automated tests, accessibility fixes in the touched flow, deployment work, and a modest defect allowance. They do not include elapsed recruiting/procurement time, formal legal review, clinical validation, or a prospective older-adult study.
- Reference delivery team: **two full-stack engineers**, **0.5 QA/automation engineer**, **0.25 product designer/accessibility specialist**, and **0.2 SRE/security support**. Clinical/pharmacy/privacy reviewers are external dependencies, not substitutes for engineering capacity. Two engineers do not halve elapsed time where work is sequential or review-gated.
- Size bands: **S = 1–3 EW**, **M = 4–7 EW**, **L = 8–14 EW**, **XL = 15–28 EW**.
- Candidate estimates below are **incremental after the Core Foundation**. Optional shared modules are listed separately and must be counted once per portfolio, not once per candidate. A named spike is included in the range unless explicitly described as a partnership or research gate.
- Confidence is engineering-estimate confidence, not evidence of clinical value: **High** for repository-local deterministic work, **Medium** for bounded model workflows, and **Low** for new identity, content, or external-data programs.

## Shared foundation — count once

### F0. Core secure agent foundation — XL, 22–33 EW

| Workstream | Required change | Effort |
|---|---|---:|
| Runtime repair | Revoke/scrub the exposed credential; move the unsupported Node 24 request to a Firebase-supported runtime and deploy-test it; consolidate `functions/` and `chat-backend/`; narrow CORS; authenticate every call; add App Check in monitored enforcement; remove public reminder/debug surfaces; fix save-error swallowing and scanner false success. | 5–7 EW |
| Data and authorization | Replace broad rules with owner/delegate-scoped rules; establish true draft/completed state, answer revision, immutable snapshots, retention/deletion, and user-scoped browser state; validate admin-only questionnaire writes. | 5–8 EW |
| Proposal/action platform | Server-side JSON schemas, allowlisted tools, policy checks, expected revision, idempotency key, confirmation token, read-back verification, immutable action attempts, user-visible audit, and undo/revoke where possible. | 5–8 EW |
| Model boundary | Separate instructions from untrusted questionnaire/scan/document/directory text; pin compatible paid models/providers; require supported parameters; validate every structured response; add timeout, retry budget, circuit breaker, deterministic fallback, and per-user cost/rate limits. | 3–5 EW |
| Verification and operations | Unit/integration/rules/emulator/E2E/accessibility tests; golden and adversarial model sets; redacted structured logging; dashboards/alerts for latency, errors, spend, denied tools, duplicate actions, and fallback rate; staged flags and incident runbook. | 4–5 EW |

Use HTTPS callable Functions where practical: Firebase callable requests automatically include available Auth and App Check tokens and validate auth tokens; still enforce resource ownership and tool policy server-side. App Check can reject missing/invalid tokens but is abuse reduction, not user authorization ([Firebase callable Functions](https://firebase.google.com/docs/functions/callable), [App Check for Functions](https://firebase.google.com/docs/app-check/cloud-functions); accessed 2026-06-17).

The proposed common collections are illustrative and should be finalized in a data-model review:

- `assessments/{assessmentId}`: owner, schema version, status, revision, responses, timestamps.
- `assessmentSnapshots/{snapshotId}`: owner, source assessment/revision, immutable normalized answers, created time.
- `proposals/{proposalId}`: owner, type, source version, structured payload, status, expiry; short retention.
- `actions/{actionId}` and child attempts: owner/actor, tool, target, confirmation, idempotency key, before/after hashes or minimal diff, result, undo link.
- `userPreferences/{uid}`: accessibility, processing, notification, timezone, quiet-hours, and retention choices.
- Optional module collections below: `reminders`, `notificationDeliveries`, `delegationGrants`, `invitations`, `supportTasks`, `sourceDocuments`, and `resourceDirectoryVersions`.

Likely composite indexes are owner plus time/status queries: `(ownerId, createdAt desc)` for snapshots/actions, `(ownerId, status, updatedAt desc)` for proposals/tasks, and module-specific indexes named below. Rules must deny clients from creating successful action/audit records, changing ownership/actor fields, approving their own delegation, or writing directory/system configuration. Rules are only one layer; Admin SDK operations bypass them and therefore require server authorization. Firebase documents owner/role conditions using `request.auth`, and the Emulator Suite is the appropriate local rules/integration test surface ([Firestore rule conditions](https://firebase.google.com/docs/firestore/security/rules-conditions), [role-based access](https://firebase.google.com/docs/firestore/solutions/role-based-access), [Firebase Emulator Suite](https://firebase.google.com/docs/emulator-suite); accessed 2026-06-17).

### F1. Notification and durable scheduling module — L, 5–8 EW

Required once for N8 and later N9/N11 reminders: notification preferences, verified channel, generic lock-screen preview, timezone/DST and quiet-hours normalization, expiry, pause/delete, deterministic recurrence, idempotency/deduplication, delivery-attempt truth, retry/dead-letter handling, and audit. Prefer Cloud Tasks/task-queue Functions for individual near-term deliveries and one Cloud Scheduler reconciliation job rather than scanning every user daily. Queue payloads contain IDs, not health text; execution rechecks consent and current status.

Firebase task-queue Functions expose rate limiting and retry policy; scheduled Functions use Cloud Scheduler and may overlap or run more than once, so handlers must be idempotent. At current published list prices, Cloud Tasks includes the first one million billable operations per month and then charges per million; Cloud Scheduler includes three jobs per billing account and charges per job thereafter. Functions, Firestore, logs, and email remain additional usage-based costs ([Firebase task queue](https://firebase.google.com/docs/functions/task-functions), [scheduled Functions](https://firebase.google.com/docs/functions/schedule-functions), [Cloud Tasks pricing](https://cloud.google.com/tasks/pricing), [Cloud Scheduler pricing](https://cloud.google.com/scheduler/pricing); accessed 2026-06-17).

### F2. Delegated-access module — L, 8–12 EW

Required once for N7 or any later support-person action: invitation proof, separate supporter account, grant scope/domain/actions, owner and grantee acceptance, expiry, revocation epoch, step-up confirmation for disclosure, comment/propose-only enforcement, attributed authorship, denied-attempt audit, abuse/reporting path, and all-session revocation. This does not include guardianship/personal-representative adjudication, which needs legal policy and manual operations.

### F3. Governed source-ingestion module — M/L, 5–8 EW

Reusable by N9 and any decision-specific N12: safe text/file intake, MIME/size/malware controls, source hash/version, page/sentence anchors, short retention/TTL, deletion, citation rendering, and source-to-output evaluation. It excludes OCR vendor integration and clinical-content licensing. Firestore TTL can support cleanup, but TTL deletion is not instantaneous and must not be represented as immediate deletion ([Firestore TTL](https://firebase.google.com/docs/firestore/ttl); accessed 2026-06-17).

## Stack-wide technical decisions, service risk, and cost model

### Deterministic code versus models

Deterministic code owns identity, permission, consent, schema validation, field paths, required/optional status, range/format/duplicate checks, revision conflict, idempotency, write/send/schedule execution, source and recipient selection, urgent stop panels, notification time calculation, retry, audit, and success claims. A model may only extract candidate fields/tasks, summarize source-linked user text, or draft neutral language. A valid JSON object is not a true or authorized object.

OpenRouter should be an inference adapter, not the action orchestrator. Pin a paid model/provider set that supports strict structured output; set provider requirements and privacy restrictions explicitly instead of accepting arbitrary free-first routing. OpenRouter documents load balancing/fallbacks and request controls including `require_parameters`, provider allow/deny lists, data-collection policy, and zero-data-retention routing. It also says underlying providers have distinct logging/retention terms. This improves portability and availability but creates a changing multi-vendor policy surface ([provider routing](https://openrouter.ai/docs/guides/routing/provider-selection), [provider logging](https://openrouter.ai/docs/guides/privacy/provider-logging), [OpenRouter data collection](https://openrouter.ai/docs/guides/privacy/data-collection); accessed 2026-06-17).

### Availability, latency, offline, and cost

- **Online truth:** model extraction, server-authorized writes, exports requiring server rendering, sends, and schedule creation are online operations. Target a visible 8–12 second model timeout and one bounded retry; never keep a user in an indefinite spinner. Server write tools use transactions/version checks and read-back. Firestore transactions fail offline ([Firestore transactions](https://firebase.google.com/docs/firestore/manage-data/transactions); accessed 2026-06-17).
- **Offline usefulness:** cache schema and deterministic views; allow an explicitly labeled local draft/pending operation, copy, print, and deterministic report where feasible. Do not call queued local state “saved online.” Firestore web persistence is disabled by default and, if enabled, retains cached sensitive data across sessions; ask whether the device is trusted and provide clear-device controls ([Firestore offline data](https://firebase.google.com/docs/firestore/manage-data/enable-offline); accessed 2026-06-17).
- **Model cost:** record model/provider, input/output tokens, retry, latency, and cost for each request without health content. Budget is `calls × (input tokens × input rate + output tokens × output rate)`, plus retries. OpenRouter passes through provider inference pricing but uses prepaid credits and a credit-purchase fee; prices differ by model. Enforce per-user/day and portfolio monthly caps ([OpenRouter FAQ](https://openrouter.ai/docs/faq); accessed 2026-06-17).
- **Firebase cost:** Firestore reads/writes, Functions compute/network, Cloud Logging volume, Scheduler, Tasks, Storage, and Auth-related services must be load-tested and budget-alerted. Avoid poll-every-user jobs and unbounded audit payloads. See current [Firebase pricing](https://firebase.google.com/pricing) (accessed 2026-06-17).
- **Email:** SendGrid is already present but is a paid, vendor-specific delivery channel. “API accepted” is not “delivered” or “read”; consume signed Event Webhook status for delivery/bounce truth, suppress repeatedly failing addresses, and never place health detail in subject/preview by default ([SendGrid API](https://www.twilio.com/docs/sendgrid/for-developers/sending-email/api-getting-started), [Event Webhook](https://www.twilio.com/docs/sendgrid/for-developers/tracking-events/event); accessed 2026-06-17).
- **Observability:** use structured redacted logs and metrics, not prompts, questionnaire values, coordinates, medication lists, source documents, or full addresses. Firebase supports structured logging into Cloud Logging ([Functions logging](https://firebase.google.com/docs/functions/writing-and-viewing-logs); accessed 2026-06-17).

## Candidate feasibility assessments

### Current-stack fit by candidate

This matrix makes “fit” explicit. **Reuse** means a useful seam exists but is not production-ready; **optional** means the MVP must work without it; **replace** means the present implementation is unsafe or semantically wrong.

| ID | React/Vite/AntD | Auth/Firestore/data model | Node/Functions/Express | OpenRouter | SendGrid / scheduler | Browser APIs |
|---|---|---|---|---|---|---|
| N1 | Reuse form, dictation, proposal UI | Extend assessment revision/provenance | New structured extraction + patch tools | Required for semantic MVP; pin compatible paid model | None | Typed baseline; speech optional |
| N2 | Strong reuse of questionnaire/navigation | Extend status/checkpoint/pending state | Save/read-back support; model endpoint optional | Optional and removable | None | Focus/storage/connectivity; speech optional |
| N3 | Reuse Review/edit/focus paths | Extend answer version and source citations | Structured summary validator | Optional for free-text condensation | None | Speech synthesis optional; print fallback |
| N4 | Reuse Review/share/print/download | Add packet revision/history | Optional summarizer/artifact tool | Optional question drafting | Email replace/defer; no scheduler | Native share/print with feature detection |
| N5 | Reuse medication UI/scanner shell | Replace entry provenance/verification shape | New server lookup adapters and patch tools | Optional explanation only | None | Camera optional; manual equivalent required |
| N6 | New snapshot/diff UI | Replace single mutable history with snapshots | Snapshot transaction/export | Optional neutral summary | None in MVP | Print/download; cached view optional |
| N7 | New owner/supporter surfaces | Major role/grant/task extension | New authorization and invitation tools | Optional task/permission drafting | Immediate privacy-safe invite only; no scheduler | Shared-device/cache handling |
| N8 | New reminder preview/history | New reminders/deliveries/preferences | New Tasks/Scheduler executors | Optional date-language proposal | Replace current blanket SendGrid scheduler | Notification permission only if web push later |
| N9 | New source/task reviewer | New source/task/retention records | New extraction/task tools | Required for extraction pilot | F1 only after reminder MVP | Paste/manual baseline; camera/upload later |
| N10 | New directory/result/contact UI | New curated directory/version/history | New ingestion/search/send adapters | Optional ranking/explanation | Optional confirmed email; refresh scheduler | Manual ZIP baseline; no background location |
| N11 | New plan/checklist UI | New trip/source records | Minimal artifact tool; adapters later | Optional drafting | F1 only for reminders | Existing geolocation optional; print baseline |
| N12 | New worksheet UI | New worksheet/source catalog | Generic save/export; governed source tools later | Optional generic; bounded paraphrase later | None | Print/download; audio optional |

### N1. Assisted Narrative-to-Form Draft

**Fit and changes.** **Good bounded fit.** Add a text-first narrative composer and editable transcript, then proposal cards beside `FourMSection` with source span, destination label, Keep/Change/Skip, pending/saved state, and Undo. A consolidated Function receives only the selected schema/answer subset and returns strict `{fieldPath, proposedValue, sourceSpan, uncertainty}` records. Add short-lived `proposals` plus provenance; no new global index beyond `(ownerId,status,updatedAt)`. Owner rules permit reading the draft but not forging approval/action success. A typed `patchAssessmentField` validates an allowlisted path, current schema, expected revision, confirmation token, and idempotency key. No scheduler or notifications. Observe extraction latency, invalid-schema rate, proposal acceptance/edit/reject/undo, wrong-field incidents, spend, and fallback use.

**Deterministic/model split.** The model maps language to candidate fields and may phrase one clarification. Deterministic code supplies the schema, rejects unsupported paths/types/fabricated values, limits batches to three, performs writes, and verifies persistence. Medication narrative extraction is excluded from MVP.

**Services, runtime, and maintenance.** Existing browser speech recognition can be a later optional input but has browser/vendor availability and no guaranteed offline behavior; typed/pasted text is the baseline. OpenRouter adds per-call cost, latency, and provider-policy exposure. Offline can preserve a user-controlled local draft, but extraction and confirmed write wait for connectivity. Maintain a versioned mapping corpus whenever questionnaire fields change.

**Testing.** Golden narratives for What Matters/Mobility, paraphrases, negation, ambiguity, multiple facts, unsupported facts, multilingual/low-literacy text, prompt injection, stale revisions, duplicate confirmation, screen readers, zoom, keyboard/switch, and model outage. Require zero writes without a matching confirmation and zero out-of-schema paths.

**Dependencies, effort, spike.** F0; clinical review only for urgent stop copy. **L, 7–11 EW; Medium confidence.** Included **1–2 EW spike:** evaluate two paid structured-output models on a de-identified representative corpus. Proceed only if wrong-field proposals are conspicuous and correction takes less work than ordinary entry for target users.

### N2. Guided Completion and Recovery Companion

**Fit and changes.** **Excellent fit; mostly ordinary product engineering.** Extend `Questionnaire.jsx` with deterministic remaining-item calculation, one-question/reduced-distraction mode, exact resume point, last verified save, persistent Retry/Copy/Return recovery, and predictable focus. Store presentation preference and checkpoint under the authenticated owner; store local pending drafts per user/device with explicit status. Existing `Answers/{uid}_4ms_health` should migrate to an assessment with `revision`, `schemaVersion`, and true `draft/completed` status. No special composite index, scheduler, notification, or model tool is required. If natural-language help survives testing, it maps explicit text to a small allowlisted intent enum. Track save/read-back mismatch, pending age, conflict, help accept/dismiss/disable, mode exit, and offline recovery.

**Deterministic/model split.** Remaining counts, save errors, inactivity/repeated-validation counters, route choice, checkpoint, completion, and all fixed help are deterministic. A model may paraphrase approved help only; it must not infer frustration, cognition, or capacity. The MVP should work with the model disabled.

**Services, runtime, and maintenance.** No new third party. Firebase offline cache can help, but sensitive persistence requires trusted-device consent and conflict design; online verification is still necessary. This has the lowest variable cost and lock-in. Maintenance is mainly schema-aware progress rules and cross-browser focus/offline behavior.

**Testing.** State-machine and property tests for every question type; network loss before/during/after save; multi-tab/device revision conflict; corrupted checkpoint; refresh/sign-out/shared device; 400% reflow; screen reader/focus; keyboard/touch; slow network; fixed-help versus AI A/B. Never display “saved” before server/read-back truth.

**Dependencies, effort, spike.** F0 runtime/data portions; it can begin before the model platform. **M, 4–7 EW; High confidence.** Included **0.5–1 EW spike:** prototype pending-write/conflict behavior with the Firestore emulator and two tabs/devices. If it is confusing, keep local drafts exportable but require reconnect before merge.

### N3. Plain-Language Readback and Readiness Check

**Fit and changes.** **Strong fit.** Add a Review readback with sentence-level source links, deterministic missing/format/duplicate/possible-conflict flags, “keep as written,” direct edit, return-to-sentence focus, version badge, and field-list fallback. The Function returns `{text, sourceFieldIds, uncertainty}` against an answer revision. Store a short-lived generated summary or regenerate it; persist only confirmation/correction metadata when possible. Add `(ownerId,assessmentId,answerRevision)` lookup only if summaries are stored. Rules prevent summaries from authorizing source-answer changes. `patchAssessmentField` handles a separately confirmed correction. No scheduler or notification. Monitor unsupported-source rejection, stale-summary display prevention, corrections, “keep both,” latency, spend, and fallback.

**Deterministic/model split.** Code produces the complete factual field list and readiness flags, checks every cited ID exists in the provided revision, rejects uncited sentences, and blocks medical interpretation. The model only compresses free text and phrases neutral clarification. Medication names/doses should render deterministically in MVP.

**Services, runtime, and maintenance.** OpenRouter cost/availability applies to generated summaries; deterministic readback remains available offline from cached answers. Provider/model changes require regression against a fidelity corpus. Avoid storing duplicate health prose because it increases retention and breach surface.

**Testing.** Sentence-to-source coverage, omission and emphasis, negation, conflicting-but-compatible answers, stale revisions, adversarial free text, plain-language rubric, deterministic fallback equivalence, direct-edit return/focus, screen-reader landmarks, print, and outage. Unsupported claims target zero in the governed evaluation set.

**Dependencies, effort, spike.** F0. **M/L, 6–9 EW; Medium confidence.** Included **1 EW spike:** compare extractive/template summary with one model-generated variant. Prefer templates for any domain where the model does not materially improve comprehension.

### N4. What-Matters-Led Visit Preparation Packet

**Fit and changes.** **Strong fit after N3.** Refactor the existing Review report builder into a tested packet domain model and accessible HTML/plain-text renderer. Add priority selection, include/exclude per item, up-to-three question drafts, accommodation notes, revision preview, and local print/download/native share. Store packet revision/hash, source snapshot/revision, selections, and export action; `(ownerId,createdAt desc)` supports packet history if retained. Rules keep packets owner-private. `createPacketArtifact` is L3 only after the exact preview is approved. The deterministic artifact can be browser-side; a backend Function is needed only for optional model drafting, durable server rendering, or later sending. No scheduler or queue. Email notification is not MVP; a later `sendApprovedPacket` requires separate recipient/content confirmation and delivery telemetry. Observe generation/render failures, source-coverage rejection, export/cancel, artifact revision mismatch, model latency/spend, and later provider delivery states.

**Deterministic/model split.** Template controls sections, length, sources, medication rendering, labels, exclusions, and disclaimer. The model may draft concise questions and condense user free text but cannot rank clinical urgency. Every generated sentence cites source fields; the user chooses the top priority.

**Services, runtime, and maintenance.** Client-side accessible HTML/plain text minimizes latency, cost, and lock-in and remains usable offline once the owned source revision is locally available. Tagged PDF is not assumed; browser “print to PDF” does not establish PDF accessibility. Native share support varies, so print/download remain primary. Optional OpenRouter calls can be deferred or cached by revision. Optional SendGrid later adds cost and wrong-recipient risk.

**Testing.** Exact-source inclusion/exclusion, one-page/large-print layouts, 200–400% zoom, keyboard reorder (no drag requirement), print browsers, Unicode, long text, no-model packet, canceled native share, file hash/revision, and email failure semantics if later. An OS share sheet cannot prove a send; record only app-side initiation/cancellation when knowable.

**Dependencies, effort, spike.** F0 and preferably N3 provenance components. **M, 5–8 EW; High/Medium confidence.** N3 reuse may save 1–2 EW. Included **1 EW spike:** accessible print/download across supported browsers and a tagged-PDF go/no-go; default to HTML/plain text if tagging is not reliable.

### N5. Medication List Verification and Question Prep

**Fit and changes.** **Technically feasible but high-risk and not “medication reconciliation.”** Replace the current client fan-out/food lookup with server adapters for NDC Directory/openFDA and RxNorm. Add an accessible provenance comparison table/manual path, explicit unresolved state, per-field approval, and pharmacist-question export. Extend each medication with original text, normalized candidate, identifiers, source/version/query time, route/form where available, user-reported taking status, and confirmation per field. Index medications only within owner assessment/snapshot; avoid a global health-field index. Rules prevent client claims of external verification. Tools are `lookupMedicationIdentifier`, `proposeMedicationPatch`, and confirmed `patchMedicationEntry`; no scheduler/notifications. Monitor upstream status/latency/disagreement, false match, user rejection, unresolved rate, and any food-product match (target zero).

**Deterministic/model split.** Identifier validation, source precedence, exact field comparison, completeness, conservative duplicate candidates, and writes are deterministic. A model may explain a mismatch or draft a neutral question; it never supplies a missing dose/frequency, selects the “correct” regimen, checks safety, or recommends change.

**Services, cost, and availability.** openFDA and RxNorm are government APIs and reduce license lock-in, but neither is a patient-specific pharmacy record or guaranteed clinical truth. openFDA documents authentication/rate limits; RxNorm supplies terminology APIs. Cache normalized reference responses with source date, honor limits, retain original user text, and fail to manual/unresolved state ([openFDA drug NDC](https://open.fda.gov/apis/drug/ndc/), [openFDA authentication and limits](https://open.fda.gov/apis/authentication/), [RxNav APIs](https://lhncbc.nlm.nih.gov/RxNav/APIs/index.html); accessed 2026-06-17). Pharmacy/EHR import, label OCR, and interaction checking are unavailable integrations, not MVP assumptions. Offline is manual list viewing/edit drafting only.

**Testing and maintenance.** A pharmacist-reviewed set covering NDC formats, repackagers, brand/generic, strength/form/route, discontinued products, combination products, duplicate candidates, service disagreement/outage, prompt injection in names/notes, and accessibility of dense comparisons. Contract tests and cached fixtures are required; source schema/terminology drift and clinical copy require ongoing ownership.

**Dependencies, effort, spike.** F0 plus pharmacist and privacy review. **L/XL, 10–16 EW; Low/Medium confidence.** Included **2–3 EW spike:** measure match coverage and dangerous merge/split cases on a pharmacist-reviewed sample and verify production-use terms/rate limits. Stop at manual provenance/question prep if conservative normalization cannot meet the agreed error threshold.

### N6. Longitudinal 4Ms Change Review

**Fit and changes.** **Good stack fit once immutable snapshots exist.** Add explicit “complete and snapshot” semantics, snapshot selector, deterministic field-level diff, source/version/date labels, annotation, and export. Never compare the single mutable Answer document to itself. `assessmentSnapshots` needs `(ownerId,createdAt desc)`; annotations need `(ownerId,snapshotPairId,createdAt)`. Rules make snapshots immutable to clients; a server transaction creates one from an owned completed revision. Tools create an approved snapshot annotation/export; no scheduler or notification in MVP. Monitor snapshot failures, incompatible schema comparisons, changed/unchanged counts, annotation/export, model-summary mismatch, and deletion/retention behavior.

**Deterministic/model split.** Code aligns schema versions, computes added/removed/changed values, and labels unavailable/incomparable fields. A model may phrase a neutral brief grounded in diff IDs. It cannot call change improvement, decline, cause, risk, or adherence.

**Services, runtime, and maintenance.** No new third party; optional OpenRouter summary can fail to a raw diff. Firestore creates storage/read growth but modest at questionnaire scale. Cached selected snapshots can render offline if the trusted-device policy permits. Schema migrations and deletion/export semantics are the main maintenance burden.

**Testing.** Snapshot atomicity/immutability, schema additions/removals, arrays/order, free text, medication identities, unchanged normalization, date/timezone, stale selection, deletion, offline cached view, adversarial text, and language prohibitions. Use deterministic snapshots as fixtures.

**Dependencies, effort, spike.** F0 snapshot/data work. **M/L, 6–10 EW; High/Medium confidence.** Included **1–2 EW spike:** define snapshot identity, schema-version alignment, and legacy Answer migration. Do not backfill “historical” snapshots from mutable data without labeling their provenance.

### N7. Consent-Governed Care Circle Task

**Fit and changes.** **Possible in Firebase, but a separate delegated-access/security program.** Add owner and supporter dashboards, invitation acceptance into a distinct authenticated account, plain-language grant builder/receipt, exact data preview, comment/propose-only task flow, attributed disagreement, expiry, instant revoke, and access history. Use F2 collections with indexes `(ownerId,status,expiresAt)`, `(granteeUid,status,expiresAt)`, and `(grantId,status,updatedAt)`. Rules and every Admin tool evaluate the live grant, role, domain, allowed action, and revocation epoch. `inviteSupporter`, `createGrant`, `proposeTaskChange`, `approveOwnerChange`, and `revokeGrant` are separate tools. Notifications are limited to immediate privacy-safe invitation/task-status text and use SendGrid only after verification; no questionnaire details in email. There is no recurring scheduler/queue in MVP. Observe denied access, stale sessions, wrong identity, grants by scope, expiry/revoke latency, disputes, and support incidents.

**Deterministic/model split.** Identity, grant semantics, field filtering, expiry, authorship, writes, and sends are deterministic. A model may translate the owner’s request into a draft task or explain permissions; it cannot infer authority, capacity, family relationship, or resolve disagreement.

**Services, availability, offline, and lock-in.** Firebase Auth/Firestore fit, but email ownership does not prove a trusted relationship or legal authority. SendGrid invitation availability is not grant authorization. Revocation and consequential activity require online live-policy checks; cached delegate data must be minimized and wiped on revoke/sign-out. Firebase-specific rules/grants create moderate lock-in. Account recovery, coercion, shared devices, deceased/incapacitated owner, and personal-representative claims need manual policy/operations.

**Testing and maintenance.** Full authorization matrix, cross-user object IDs, revoked/expired grants, token/session races, email reuse/change, invite forwarding, enumeration, multi-device offline cache, owner-versus-supporter attribution, prompt injection, abuse reporting, accessibility of permission comprehension, and penetration testing. Ongoing safeguarding/support load is material.

**Dependencies, effort, spike.** F0 + F2; legal/privacy/safeguarding review is a hard gate. **Program total XL, 18–28 EW (10–16 EW candidate + 8–12 EW F2); Low confidence.** Included **2 EW technical spike:** Firebase Auth invitation/account-link/revocation prototype and rules model. A separate non-engineering policy spike must decide which authority types the product will and will not support.

### N8. What-Matters Goal and Reminder Steward

**Fit and changes.** **Good fit only after replacing the current reminder job.** Add one-goal plan, standard date/time controls plus natural-language draft, full absolute-time/timezone/channel/message preview, quiet hours, expiry, pause/delete, history, and delivery status. `reminders` indexes: `(ownerId,status,nextRunAt)`, `(status,nextRunAt)` for reconciliation, and `notificationDeliveries(reminderId,scheduledFor,attempt)`. Rules let owners manage intent/preferences but not forge delivery. `createReminder`, `pauseReminder`, `cancelReminder`, and queue execution are deterministic and idempotent. F1 supplies scheduler/queue/notification/observability. No caregiver nonresponse escalation and no medication-dose reminders.

**Deterministic/model split.** A model may turn “tomorrow after breakfast” into a proposal with uncertainty. A date/time library and server normalize timezone/DST, recurrence, quiet hours, expiry, and deduplication. The user approves the full normalized value. Model text never becomes a schedule directly.

**Services, availability, and cost.** Cloud Tasks/Scheduler and Functions are suitable and inexpensive at pilot scale but at-least-once/overlap behavior requires idempotency. SendGrid email is optional and must use generic text, verified recipient, unsubscribe/preference enforcement, bounce processing, and honest delivery status. Web push would add FCM, service worker, browser permission/support testing, and shared-device lock-screen risk; do not assume it for MVP. An in-app reminder works only when the app is opened. Offline can show the plan/history but cannot confirm a server schedule or cancellation.

**Testing and maintenance.** DST spring/fall, timezone travel/change, ambiguous natural language, quiet-hour crossing, recurrence/end, duplicate clicks/tasks, delayed/retried/out-of-order delivery, cancel-versus-dispatch race, provider bounce/outage, no backfill burst, lock-screen privacy, and load/cost tests. Timezone and email deliverability are ongoing maintenance.

**Dependencies, effort, spike.** F0 + F1. **Program total L/XL, 9–15 EW (4–7 EW candidate + 5–8 EW F1); Medium confidence.** Included **1–2 EW spike:** task scheduling/cancel race and DST simulator with email versus in-app channel decision. SMS is unavailable and out of scope.

### N9. After-Visit Follow-Through Organizer

**Fit and changes.** **Feasible as pasted-text administrative-task pilot; not as clinical instruction automation.** Add paste/manual source input, source/task side-by-side review, one-item approval, “needs clinician clarification,” checklist, and optional reminder. F3 stores source hash/anchors/retention; `supportTasks` indexes `(ownerId,status,dueAt)` and `(ownerId,sourceId,createdAt)`. Tools are `extractAdministrativeTaskProposals`, `confirmTask`, and reversible task-state changes; F1 is required only for reminders. No OCR, EHR, portal messaging, calls, or booking in MVP. Monitor source coverage, extraction correction, blocked clinical/medication items, due-date edits, duplicate tasks, reminder failures, deletion, cost, and any unauthorized action.

**Deterministic/model split.** The model extracts candidate text/date/category with exact anchors. Deterministic allowlists permit only administrative categories and require per-item confirmation/date validation. Medication and clinical instructions are preserved verbatim and stopped for clarification; do not trust a model classifier alone to decide that an instruction is safe to operationalize.

**Services, availability, offline, and lock-in.** OpenRouter and sensitive-source processing add cost/policy exposure. Pasted text avoids OCR vendor cost and poor image capture; manual checklist is the offline fallback. Future OCR would require secure object storage, malware/type validation, a vendor such as Document AI, deletion verification, language/handwriting evaluation, and new lock-in. EHR/FHIR, calendar, and patient-portal integrations are not present and must not appear in estimates.

**Testing and maintenance.** Clinician-reviewed after-visit samples with administrative versus clinical/conditional/medication wording, negation, no date/ambiguous date, duplicate/revised instructions, tables, prompt injection, source deletion, unsupported language, model outage, and accessibility of source comparison. Measure dangerous operationalization at zero in the test corpus.

**Dependencies, effort, spike.** F0 + F3; add F1 once notifications are enabled. **Pilot L, 8–13 EW after F0/F3; Low/Medium confidence.** With reminders and no existing F1, portfolio total increases by 5–8 EW once. Included **2 EW spike:** blinded task extraction with a conservative administrative allowlist. If safe recall is poor, ship a manual source-linked checklist only.

### N10. Local Support Navigator and Warm Handoff

**Fit and changes.** **Code fits; reliable directory operations do not yet exist.** Build a text-first need/location/preferences form, freshness-stamped comparison cards, honest no-result state, minimum-data contact draft, exact recipient/content confirmation, and contact-attempt status. Backend requires an ingested, versioned, curated regional directory, deterministic eligibility/filtering, source URL/date, archival/takedown workflow, and outbound-domain allowlist. Collections need `(region,category,status)`, `(resourceId,versionDate desc)`, and owner contact-history indexes. Admin/service accounts alone publish directory versions. Model may rank or explain only after deterministic candidate retrieval; `sendApprovedInquiry` is a separate confirmed tool. A scheduled ingestion/verification process and stale-data alerts are required; no user notification by default.

**Deterministic/model split.** Region/category/channel/accessibility filters, freshness, eligibility facts, recipient, minimum-data payload, and sending are deterministic. The model may summarize quoted criteria or draft an inquiry but cannot claim eligibility, endorsement, current capacity, or successful enrollment.

**Services, availability, cost, and lock-in.** The repository’s Nominatim reverse geocode is not a service directory. The 211 API portal demonstrates an API program, not universal free coverage, licensing, consistent taxonomy, accessibility-channel completeness, or a contract for this app ([211 API portal](https://apiportal.211.org/); accessed 2026-06-17). Availability differs by region; rural no-result rates may dominate. A curated, versioned regional snapshot can be cached for an explicit offline/low-bandwidth “last updated” view, but eligibility, contact, and capacity verification remain online and may be stale. Cost includes data licensing/partnership, ingestion, verification, support, SendGrid, and likely **0.2–0.5 operations FTE** after launch—far more significant than model tokens. Provider/directory taxonomy creates high data-model lock-in even if the HTTP adapter is replaceable. Observability must report ingestion age/failure, source freshness, search no-result rate by geography/channel, contact failure, wrong-recipient near misses, external latency, and directory/model spend without logging user needs or full location.

**Testing and maintenance.** Data contract/ingestion, duplicate organizations, closed/moved services, conditional eligibility, unsupported counties, inaccessible contact channels, wrong recipient, malicious directory text, no-result honesty, stale thresholds, geographic/equity metrics, and provider complaint/takedown. This is an operations product, not a one-time API integration.

**Dependencies, effort, spike.** F0; F3 concepts help provenance. **XL, 10–16 EW engineering plus ongoing directory operations; Low confidence.** Before backlog commitment, run a **2–4 EW partnership/data spike** for one named region: obtain terms, sample data, update cadence, coverage, channel/accessibility fields, and cost. **Disposition: defer/research pilot until this passes.**

### N11. Door-to-Door Mobility Plan

**Fit and changes.** **Manual MVP fits; automated “door-to-door” data does not.** Add destination/date, user-stated mobility preferences, transport mode, venue facts with source/checked date, unknowns, verification questions, backup, linear print/share plan, and optional reminder. Store owner-private plan, facts/provenance, short-retention destination, and approved artifact hash; `(ownerId,tripDate,status)` supports history. `saveMobilityPlan` and export are confirmed tools; F1 is needed only for reminders. No background geolocation, booking, tracking, or arrival alerts. Observability covers unknown/stale fact rate, plan completion/cancel, geolocation opt-out/delete, external adapter failures later, and prohibited safety-language detection.

**Deterministic/model split.** Code labels user-entered/sourced/unknown facts, dates freshness, inserts verification/backup sections, and blocks safety guarantees. The model may draft a checklist or call script. It cannot estimate fall risk, walking capacity, route safety, or infer venue accessibility.

**Services, availability, cost, and lock-in.** Manual facts use no new service and work offline after saving/printing. The current direct Nominatim call is not a production route/accessibility source and is subject to the public instance usage policy ([Nominatim usage policy](https://operations.osmfoundation.org/policies/nominatim/); accessed 2026-06-17). A later Google Routes adapter is billed and vendor-specific and still does not establish venue/sidewalk safety ([Google Routes API](https://developers.google.com/maps/documentation/routes); accessed 2026-06-17). GTFS accessibility fields depend on local agency data quality; NOAA weather is U.S.-specific and changing ([GTFS Schedule reference](https://gtfs.org/documentation/schedule/reference/), [National Weather Service API](https://www.weather.gov/documentation/services-web-api); accessed 2026-06-17). Rural/paratransit/venue gaps remain normal outcomes.

**Testing and maintenance.** Unknown/stale facts, wrong destination, timezone, no transport options, inaccessible maps, location deletion, source injection, safety-language rules, print/large text/screen reader, no connectivity, and external outage if later. Each new geography/provider creates contract and data-quality maintenance.

**Dependencies, effort, spike.** F0. **Manual MVP M, 4–7 EW; Medium/High confidence. External-data version XL, 12–20 EW plus API fees; Low confidence.** Included **1 EW manual spike:** test whether a deterministic template provides the same value as model drafting. External work requires a separate **2–4 EW one-region data spike**. Prefer the manual non-AI checklist unless evidence shows incremental value.

### N12. Shared-Decision Conversation Builder

**Fit and changes.** **Generic values/questions worksheet fits; decision-specific comparison is not production-ready.** Add private one-question-at-a-time values prompts, “not sure,” source-separated sections, editable questions, selective packet inclusion, and print/export. Store worksheet revision, user-selected priorities, source metadata/chunks if any, citations, and approval; `(ownerId,updatedAt desc)` is sufficient. Generic `saveWorksheet`/export need no scheduler, queue, or notification. Decision-specific mode requires F3, an admin-only allowlisted/versioned content catalog, complete-option checks, citation validation, expiry/review status, and a hard no-source/no-comparison gate. Observe source-version age, citation rejection, option-omission checks, user edits/cancel, prohibited recommendation language, model latency/spend, and deterministic fallback use.

**Deterministic/model split.** Generic values elicitation can be deterministic. A model may summarize the user’s stated tradeoffs or paraphrase a supplied governed passage. Code preserves every option, citation, version, and uncertainty and blocks “best option”/selection/consent. The model never invents evidence, calculates personalized risk, or communicates a treatment choice.

**Services, availability, cost, and lock-in.** Generic MVP needs no external service except optional OpenRouter and can work offline. Decision-specific work needs licensed/qualified decision aids, content governance, clinical ownership, version monitoring, and possibly inaccessible PDF conversion; no such API/catalog partnership is present. Model cost is secondary to content and evaluation cost. Broad web retrieval is contraindicated.

**Testing and maintenance.** Neutral order/framing, option omission (target zero), citation/source fidelity, numeric-risk language, low literacy, long/inaccessible source documents, stale/withdrawn content, adversarial source text, perceived steering, model/provider change, and no-model worksheet. Each clinical decision is a separate validated product surface, not a reusable prompt.

**Dependencies, effort, spike.** Generic: F0 portions, **M, 4–7 EW; High/Medium confidence** and may be entirely non-AI. Decision-specific: F0 + F3, **XL, 16–24 EW engineering/content tooling per first governed decision family; Low confidence**, plus clinical research. Run a **2–4 EW content/technical spike** with one qualified decision aid; keep it research-only unless completeness, fidelity, accessibility, and non-steering gates pass.

## Comparative matrix and dependency accounting

| ID | Current-stack fit | New unavailable/uncertain dependency | Increment after F0 | One-time shared module(s) | Engineering disposition |
|---|---|---|---:|---|---|
| N1 | Good | None; paid compatible model must be selected | L, 7–11 EW | — | Bounded pilot after N2/N3 controls |
| N2 | Excellent | None | M, 4–7 EW | — | Build first; deterministic MVP |
| N3 | Strong | None; model optional | M/L, 6–9 EW | — | Build first |
| N4 | Strong | Tagged PDF/email not assumed | M, 5–8 EW | Reuse N3 | Build first; local artifact MVP |
| N5 | Moderate | Pharmacy/EHR/OCR unavailable; public terminology APIs only | L/XL, 10–16 EW | — | Second wave, pharmacist-gated |
| N6 | Good | None | M/L, 6–10 EW | F0 snapshots | Second wave after real snapshots |
| N7 | Moderate | Legal authority and relationship verification unresolved | L, 10–16 EW | F2 8–12 EW | Separate XL program/pilot |
| N8 | Good | Reliable active channel decision | M, 4–7 EW | F1 5–8 EW | Build after notification foundation |
| N9 | Moderate | OCR/EHR/portal unavailable | L, 8–13 EW | F3; F1 later | Controlled pasted-text pilot |
| N10 | Code good/data poor | Regional directory contract, coverage, operations | XL, 10–16 EW | Directory operations | Defer pending one-region partnership |
| N11 | Good manual/poor external | Venue/accessibility/transit completeness | M 4–7 / XL 12–20 EW | F1 if reminders | Manual checklist only; external pilot later |
| N12 | Good generic/poor specific | Governed decision-aid catalog/content program | M 4–7 / XL 16–24 EW | F3 for specific | Generic worksheet; specific research-only |

Example portfolio accounting, not a roadmap commitment: **F0 (22–33) + N2 (4–7) + N3 (6–9) + N4 (5–8) + F1 (5–8) + N8 (4–7) = 46–72 EW**. N3/N4 component reuse could remove roughly 1–2 EW, but qualification, usability, accessibility, security, and clinical review add elapsed calendar time. With the reference team, this is roughly a 6–9 month engineering program after discovery, not a sequence of four chatbot prompts.

## Required technical gates

1. **Security gate:** owner/delegate rule tests, authenticated callable/tool checks, App Check monitoring, no public reminder/debug invocation, secret rotation, redacted logs, and cross-tenant penetration tests pass.
2. **Action-truth gate:** every write/send/schedule has proposal, exact confirmation, policy decision, idempotency, read-back/provider status, user-visible audit, and failure/undo or revoke semantics.
3. **Model gate:** pinned paid model/provider supports required schema; de-identified golden/adversarial sets meet feature-specific thresholds; no direct model writes; deterministic fallback passes; token/latency/cost caps and provider privacy settings are verified in the actual account.
4. **Offline gate:** every surface distinguishes local draft, queued/pending, saved online, provider accepted, delivered, and read/unknown; sensitive web persistence is opt-in on trusted devices.
5. **Accessibility gate:** keyboard, screen reader, visible focus, 200–400% zoom/reflow, large targets, hearing-independent operation, reduced fine-motor path, plain-language/error recovery, and cancel/undo parity are tested with representative older adults.
6. **Operations gate:** dashboards and alerts cover auth denials, action failures/duplicates, provider availability/latency, model invalid output, spend, queue age/dead letters, notification bounces, and retention deletion; runbooks name an owner.
7. **Integration gate:** no EHR, pharmacy, calendar, OCR, SMS, provider portal, booking, paid transport, directory, map/accessibility, or decision-aid integration enters a committed roadmap without terms, security/privacy review, data-quality sample, failure semantics, ongoing owner, and a bounded spike.

## Bottom line

The most feasible portfolio is not the most externally connected one. N2, N3, and N4 convert data and components already in the repository into reliable, source-linked workflows; N8 adds genuinely agentic repeated action only after F1. N1 is a reasonable bounded model pilot. N5 and N9 require conservative source handling and professional review; N6 requires time and immutable snapshots. N7, N10, external N11, and decision-specific N12 contain identity, partnership, data-quality, or content-governance work that the present repository cannot supply. Their polished demos would be much easier than dependable products, so their estimates and dispositions deliberately reflect the latter.
