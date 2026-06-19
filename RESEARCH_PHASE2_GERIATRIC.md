# Phase 2B — Geriatric 4Ms and Care-Workflow Capability Discovery

**Role:** Geriatric 4Ms and care-workflow specialist  
**Repository context used:** `RESEARCH_PHASE1_REPOSITORY_CONTEXT.md`, validated 2026-06-17  
**Evidence access date:** 2026-06-17 for every external source below

## Scope and clinical-authority boundary

This report proposes workflow support for an older adult, not clinical care. The application may help a person record observations, notice incomplete or internally inconsistent entries, prepare questions, organize a visit, approve sharing, and remember an administrative follow-up. It must not diagnose, screen autonomously, assess decision-making capacity, perform medication review, rank treatments, interpret clinician instructions, or claim that a generated plan is clinically appropriate.

The 4Ms are intended to work as a set—What Matters, Medication, Mentation, and Mobility—and to align care with the older adult's priorities, not to become four isolated scores [S1]. The app currently collects useful self-report data across all four domains, but it has one mutable `Answers/{uid}_4ms_health` record rather than a longitudinal clinical record, no authenticated caregiver or clinician role, no true submission state, and no authorized action/audit layer. Those constraints shape every proposal below.

Important evidence interpretation:

- The IHI framework supports organizing conversations around all four Ms, but it does **not** validate this questionnaire, an LLM interpretation of its answers, or an automated care recommendation [S1, S2].
- Medication reconciliation and review are skilled clinical processes involving multiple sources, discrepancies, conditions, preferences, and professional coordination. The app can prepare a patient-reported list and questions; it cannot claim to reconcile or review medications [S3].
- Patient decision aids can improve knowledge and values-choice congruence, but a valid decision aid contains evidence-based option information. A generative model improvising options is not a decision aid [S4, S5].
- CDC STEADI's Screen–Assess–Intervene workflow is directed to health professionals. This consumer app can surface a stated fall concern for discussion; it must not represent that it has performed a STEADI assessment [S6].
- For asymptomatic community-dwelling adults 65 and older, the USPSTF currently finds evidence insufficient to assess benefits and harms of cognitive-impairment screening. The app's memory rating is therefore not a diagnostic or screening result [S7].
- Family or friends may be involved when the individual agrees, does not object in an applicable context, or a lawful personal-representative rule applies; that is not permission for default or irrevocable caregiver access [S8]. Product policy needs qualified legal review and must be stricter than a model's inference.
- WHO ICOPE provides a useful person-centred assessment/care-pathway model, including follow-up, but applying it clinically is a health-workforce function. The proposed longitudinal features are organizational support and require clinical validation before any health claim [S9].

## Autonomy scale used

| Level | Permitted meaning in these proposals |
|---|---|
| **L0** | Explain, restate, or summarize user-provided information. |
| **L1** | Recommend a question or low-risk workflow step; never recommend diagnosis or treatment. |
| **L2** | Prepare a draft, checklist, clarification, invitation, or proposed record change for review. |
| **L3** | After explicit approval, execute a reversible low-risk action such as saving an edited self-report, exporting an approved brief, or sending to an already-authorized recipient. |
| **L4** | Execute only a narrowly pre-authorized recurring action, such as a check-in reminder, with pause/revoke controls and visible history. L4 does not include clinical escalation, medication changes, or expanding caregiver access. |

## Capability catalog

### G1. 4Ms Readiness and Clarification Check

**Value proposition.** Before review or a visit, find missing, stale, or internally inconsistent self-report and help the older adult clarify it without pretending to infer the medically “correct” answer.

**Primary user and story.** An older adult preparing a report sees: “You selected no mobility challenges and also noted concern about falling. Both can be true. Would you like to add a note for your visit?” They can explain, skip, or confirm that the entries are intentional.

**Problem and why agent behavior is warranted.** Plain required-field checks belong in ordinary UI, but useful clarification can span multiple 4Ms, free text, structured medication entries, scan provenance, and prior versions. AI is warranted only to phrase a short neutral question and summarize the user's answer; rule evaluation and record updates must remain deterministic.

**Inputs.**

- **Existing, required:** current `whatMatters`, `medication`, `mind`, and `mobility` responses from `Answers/{uid}_4ms_health`; questionnaire schema; structured medication name/dose/frequency/notes.
- **Existing, optional:** scanner lookup result and provenance if retained safely; profile language/accessibility preferences when available.
- **Proposed, optional:** `unknown` / `preferNotToAnswer` states; “confirmed as intentional”; last-verified timestamp per field; user-entered clarification; source (`typed`, `spoken`, `scan`, `carePartnerObservation`); confidence belongs only to extraction/provenance, never to a clinical claim.

**Exact agent loop and autonomy.**

1. **Observe:** read only the authenticated user's current draft and schema.
2. **Deterministic checks:** calculate missing required fields, invalid values, duplicate medication rows, progress anomalies, unverified scan matches, stale verification dates, and a small clinician-approved list of *possible inconsistencies*. A rule must say “needs clarification,” never “incorrect.”
3. **AI contribution:** convert one flag at a time into plain, non-leading language; summarize only the answer just supplied. The model does not decide whether the inconsistency is resolved.
4. **Propose (L1/L2):** show original values, the reason for asking, and a proposed note or field edit.
5. **Confirm/act (L3 maximum):** after field-level approval, save a reversible edit through a server-authorized tool; verify the persisted value; write old/new values and actor to an audit event.
6. **Recover:** on save failure, retain the unsaved draft visibly and never report success. “Keep both,” “skip for now,” and undo are always available.

**Confirmation, handoff, and emergency boundary.** No clarification is shared automatically. The person may add an unresolved item to the visit brief. Free-text crisis or urgent-symptom handling must use a separately validated deterministic policy and qualified-clinician-reviewed copy; the model must not triage severity or assure safety. A caregiver cannot answer as the older adult unless a later delegated role explicitly labels whose observation it is.

**Repository implementation concept.** Reuse schema/context logic in `src/services/questionnaireService.js`, the four section views in `src/views/Questionnaire/`, and the review screen. First fix swallowed save errors, progress overcounting, scan false-success semantics, Firestore ownership rules, API authentication, and backend drift. Add a server-side typed `proposeAnswerPatch` / `applyApprovedAnswerPatch` pair, structured rule IDs, version checks, and user-visible audit events. Questionnaire free text must remain untrusted data, not system instructions.

**Accessibility and non-voice fallback.** One issue per screen; plain text plus optional speech; large “Keep as is,” “Edit,” and “Skip” controls; no color-only warning; preserved focus; all content usable by keyboard/screen reader; never require speech or camera. Do not repeatedly challenge a deliberately skipped answer.

**Risks, limitations, dependencies, outcome.** False conflict flags can erode trust or feel judgmental, while model phrasing can lead the user. Dependencies are a clinically reviewed rule set, answer versioning, authenticated writes, audit/undo, and older-adult usability testing. Measure clarification completion, intentional “keep both” rate, false/annoying flag rate, undo rate, save failures correctly reported, report completeness, and time/burden—not health outcomes.

**MVP vs later.** MVP: deterministic missing/format/duplicate checks and 4–6 high-precision cross-field clarification rules, no AI required for rule selection. Later: compare with consented historical snapshots and use AI for language adaptation after evaluation.

---

### G2. What-Matters-Led Visit Brief and Agenda

**Value proposition.** Turn the older adult's approved 4Ms responses into a one-page, source-linked visit agenda that leads with their goals and ends with their own questions.

**Primary user and story.** Before a primary-care visit, an older adult chooses “staying independent at home” as the lead priority, selects two medication questions and one fall concern, previews the page, and downloads or explicitly shares it.

**Problem and why agent behavior is warranted.** The current plaintext report is comprehensive but not necessarily visit-ready. Cross-domain summarization, prioritization in the user's words, and adapting length to a visit benefit from constrained generation. Selection, source attribution, dates, recipient authorization, and sending are deterministic.

**Inputs.**

- **Existing, required:** user-selected 4Ms answers and notes.
- **Existing, optional:** structured medication list; user profile name; generated questions only if the user explicitly selects them.
- **Proposed, required for generation:** user chooses the lead What Matters priority and confirms items to include.
- **Proposed, optional:** visit date/type, clinician/service name, time available, questions, “private—do not include” per field, preferred output format, recipient chosen from an authorized list.

**Exact agent loop and autonomy.**

1. **Observe:** gather only fields the person has selected for this brief.
2. **Deterministic preparation:** label each fact with its source field/date; detect missing medication details; enforce one-page/section limits; keep unanswered fields out rather than guessing.
3. **AI contribution (L0/L2):** draft a plain-language summary organized as “What matters to me,” “Changes or concerns,” “Medication list/questions,” and “Questions I want to ask.” Preserve uncertainty and first-person ownership; do not turn a concern into a diagnosis.
4. **Confirm:** present a source-linked preview where every sentence can be edited, removed, or restored. Require explicit confirmation of content, recipient, channel, and sensitive domains.
5. **Act (L3 maximum):** download/print/native-share the approved brief, or send it through an authenticated idempotent tool to an already-authorized address. Verify generation/delivery status and record exactly what was shared.
6. **Recover:** failed delivery leaves a downloadable copy and a clear retry option; duplicate sends are prevented.

**Confirmation, handoff, and emergency boundary.** Export is not clinical submission, and delivery does not imply review by a clinician. Show that distinction. No default caregiver copy. Do not send urgent content as ordinary email; use clinician-reviewed emergency copy and direct the user to appropriate immediate services rather than implying inbox monitoring.

**Repository implementation concept.** Extend `src/views/Questionnaire/ReviewSubmit.jsx` report generation and native share/print/download flow. Use `getUserQuestionnaireContext` only as a data adapter after prompt-injection hardening. Add a server-side structured summary schema with sentence-to-source IDs, a render service, explicit share authorization, idempotency key, delivery status, and audit record. Do not use the existing unauthenticated SendGrid routes or scheduler.

**Accessibility and non-voice fallback.** Offer brief and detailed versions; 16px+ scalable text, strong headings, print contrast, meaningful reading order, editable plain text, and screen-reader-friendly source links. Speech can read the preview but is optional; PDF must not be the only format.

**Risks, limitations, dependencies, outcome.** The summary may omit nuance, amplify generated questions, expose sensitive content, or create false expectations of clinician review. Dependencies include consent/share infrastructure and accurate delivery state. Measure user-rated agenda fidelity, edits/removals per brief, percentage leading with a confirmed What Matters goal, successful exports, wrong-recipient near misses, delivery failures, and post-visit report of whether priority topics were discussed. Clinical effects require a study.

**MVP vs later.** MVP: local structured brief with manual selection, edit, download/print, and no email. Later: authenticated sharing to a verified recipient/EHR only after partnership, legal/privacy review, and delivery acknowledgment design.

---

### G3. Medication List Verification and Conversation Prep

**Value proposition.** Help the user produce a clearly labeled “patient-reported, not yet clinician-reconciled” medication list and focused questions about missing or uncertain details.

**Primary user and story.** An older adult managing several medicines sees that two entries have no dose, one scan was an uncertain consumer-product match, and one medicine may be duplicated by name. They correct what they know and add “Please verify this with my pharmacist” to the visit agenda.

**Problem and why agent behavior is warranted.** Comparing structured entries, free-text medication notes, and scan provenance can reduce clerical burden. AI may help normalize spelling for *candidate matching* and phrase questions, but medication identity, duplicate detection thresholds, and all actions must be deterministic or human-confirmed. Actual reconciliation/review remains a clinician/pharmacist process [S3].

**Inputs.**

- **Existing, required:** medication category/name/dose/frequency/notes and medication free text.
- **Existing, optional:** scan/lookup response and service provenance; medication concerns from What Matters or Mentation.
- **Proposed, optional:** prescription-label photo processed under a separately consented secure flow; “as reported by”; last verified date; purpose in the user's own words; prescriber/pharmacy entered by user; taking/not taking/unsure; external RxNorm identifier only after user confirmation.

**Exact agent loop and autonomy.**

1. **Observe:** collect the user's medication entries and provenance, never assume that a product lookup is a medication.
2. **Deterministic checks:** required-field gaps, exact/normalized duplicate candidates, invalid dose/frequency shapes, conflicting “none” versus populated entries, and low-confidence/unverified scans. Drug databases provide candidate identifiers, not clinical verification.
3. **AI contribution:** extract a *proposed* structured row from user text/photo, preserve the original, and draft neutral questions such as “What dose is on the label?” No interactions, appropriateness, adherence judgment, or deprescribing suggestion.
4. **Propose/confirm (L2):** show side-by-side original and candidate values with source and uncertainty; the user accepts each field or marks unknown.
5. **Act (L3 maximum):** save approved self-report corrections and add approved verification questions to G2; verify and audit. The output banner always says “Bring this list for verification.”
6. **Recover:** a lookup outage never blocks typing; an unverified scan stays unresolved and is never announced as “medication found.”

**Confirmation, handoff, and emergency boundary.** Never tell a person to start, stop, skip, split, combine, or change a dose. Never infer nonadherence. Suspected adverse effects or urgent symptoms receive validated escalation copy, not generated causality. Caregiver-added items must be separately attributed and require the older adult's scoped permission; a clinician/pharmacist resolves discrepancies.

**Repository implementation concept.** Reuse `MedicationScanner.jsx`, `drugLookupService.js`, structured medication rendering, and visit report. Remove non-medication UPC success behavior, store lookup source/response time/candidate status, and add server-side normalization with allowlisted RxNorm/openFDA calls. Treat all third-party text as untrusted. No LLM writes directly to `Answers`.

**Accessibility and non-voice fallback.** Manual entry is always available; scan errors are spoken *and* shown in text; rows have large edit buttons and field labels; support “I don't know”; avoid dense drug tables on small screens; no red/green-only confidence display.

**Risks, limitations, dependencies, outcome.** The app sees only self-report, names may map incorrectly, OTC/supplement products complicate matching, and a polished list may be mistaken for a verified record. Dependencies include provenance, clinical/pharmacy review of copy and rules, and scanner repair. Measure unknown fields resolved, incorrect candidate acceptance/override, scan false-success rate (target zero), duplicate false-positive rate, list export rate, and clinician/pharmacist-reported usefulness in a pilot.

**MVP vs later.** MVP: completeness/provenance checks and conversation questions; no image AI and no clinical rules. Later: secure label extraction and standards-based medication import only with explicit consent, source reconciliation UI, and clinical integration.

---

### G4. Longitudinal 4Ms Change Review and Opt-In Check-ins

**Value proposition.** With explicit consent, preserve periodic snapshots, show what the person says changed, and offer a low-burden check-in without interpreting change as clinical deterioration or improvement.

**Primary user and story.** A user opts for a monthly check-in. The app asks whether anything changed in their priorities, medicines, memory/sleep concerns, or mobility. It then shows: “You report more concern about falling than last month; would you like to put that on your visit agenda?”

**Problem and why agent behavior is warranted.** Today the single mutable Answer document loses history. Deterministic comparison can calculate field changes, but AI can summarize mixed structured/free-text changes and ask one relevant follow-up at a time. WHO's person-centred pathway model supports the general importance of follow-up, but this specific app workflow is a product hypothesis requiring validation [S9].

**Inputs.**

- **Existing, required:** current four-domain responses.
- **Proposed, required:** immutable user-approved snapshots with assessment date/version; explicit check-in consent; cadence, channel, timezone, quiet hours, pause state, and retention setting.
- **Proposed, optional:** reason for update (routine, upcoming visit, after visit); self-reported “meaningful change”; contact preference; selected follow-up question.

**Exact agent loop and autonomy.**

1. **Observe:** scheduler reads consent/preferences only; the comparison tool reads two approved snapshots after authentication.
2. **Deterministic actions:** due-date/timezone calculation, quiet hours, rate limit, snapshot diff, numeric deltas, added/removed selections, notification deduplication, and retention.
3. **AI contribution (L0/L1):** summarize only verified differences, quote source dates, and propose a clarification or visit-agenda item. Never label a trend as disease, decline, improvement, risk score, or emergency.
4. **Confirm/act:** L3 saves an explicitly approved snapshot or agenda item. **L4 is limited to sending the pre-authorized check-in notification** at the chosen cadence; answering, sharing, or escalating always needs a new confirmation.
5. **Verify/record:** show last run, next run, channel, result, and history; provide one-tap pause/revoke.
6. **Recover:** offline users can answer later; missed check-ins do not accumulate; provider failures produce no fabricated “all clear.”

**Confirmation, handoff, and emergency boundary.** No caregiver/clinician notification based on a change score. The user separately chooses whether to include a change in G2 or share through G5. Urgent disclosures invoke a validated policy in the active session; silence or a missed check-in is never interpreted as harm or wellness.

**Repository implementation concept.** Add versioned assessment snapshots rather than overloading the current mutable Answer. Replace the unsafe global daily reminder behavior in `functions/index.js` with authenticated preference tools and a least-privilege scheduled worker. Add idempotent notification jobs, consent version, timezone/quiet-hours enforcement, per-user rate limits, model-free fallback diff, and audit history. Current client-local chat cache must not be a longitudinal source.

**Accessibility and non-voice fallback.** Allow “no changes” in one action, one domain at a time, save-and-return, large controls, text/email/in-app choice when technically supported, no audio-only prompt, and clear dates (“June 17, 2026,” not relative-only language). Users may disable reminders without losing data.

**Risks, limitations, dependencies, outcome.** Repeated prompts can create burden or anxiety; ordinary variability may be overinterpreted; notifications can expose health information on shared devices. Dependencies include a consent/preference center, secure snapshots, scheduler hardening, and retention/deletion support. Measure opt-in and revocation, response burden/time, snooze/pause, notification delivery, false duplicate sends, agenda items accepted/rejected, and user understanding that trends are self-report rather than clinical findings.

**MVP vs later.** MVP: user-initiated “compare with last saved snapshot” and no scheduled messaging. Later: L4 check-ins after notification privacy/usability pilots; clinician integration remains separate and partnership-dependent.

---

### G5. Older-Adult-Controlled Care-Partner Collaboration

**Value proposition.** Let an older adult grant a named supporter limited, time-bounded access to specific tasks or 4Ms domains while preserving the older adult's voice and showing every action.

**Primary user and story.** An older adult invites a daughter to help verify the medication list for two weeks but keeps What Matters and Mentation private. The daughter adds an attributed observation; the older adult accepts it, keeps both accounts, or rejects it, then revokes access.

**Problem and why agent behavior is warranted.** Delegation is a permission and workflow problem, not a chatbot problem. Deterministic authorization is mandatory. AI is warranted only to summarize attributed differences, draft a respectful invitation, and explain permission choices in plain language. HHS guidance supports individual-directed involvement but does not justify blanket access [S8].

**Inputs.**

- **Existing, optional:** caregiver email in `Users`; selected questionnaire data. The email alone is **not authorization**.
- **Proposed, required:** invited person's authenticated identity; relationship label supplied by user; grant owner; allowed domains/actions; start/expiry; recipient verification; consent text/version; revoke state.
- **Proposed, optional:** task-specific request, care-partner observation, older adult's disposition (`accept`, `keepBoth`, `decline`), notification preferences, lawful personal-representative status handled outside model inference.

**Exact agent loop and autonomy.**

1. **Observe:** read only grants owned by the authenticated older adult and only the minimum fields needed for the requested task.
2. **Deterministic authorization:** deny by default; enforce subject, domain, action, expiry, recipient, and purpose on every read/write/send. Never derive authority from email possession, relationship text, a memory response, or model output.
3. **AI contribution (L0/L2):** explain a proposed grant, draft an invitation, and summarize differences between separately attributed accounts without selecting a “true” account.
4. **Confirm/act:** L3 sends an invitation or activates/revokes a verified grant only after a scope preview. L4 may send a recurring task reminder **only within a separately pre-authorized grant and notification preference**; it never expands scope or shares new domains.
5. **Reconcile:** proposed changes enter a review queue. The older adult approves, rejects, edits, or keeps both unless a legally validated representative workflow applies.
6. **Verify/audit:** both parties see status; the older adult sees access and action history and can immediately revoke. Failed invitations reveal no health data.

**Confirmation, handoff, and emergency boundary.** No automatic caregiver alert from Mentation, falls, medications, missed check-ins, or free text. No model assessment of capacity. Emergency contact is not the same as ongoing data access. Abuse/coercion and personal-representative cases require qualified legal, safeguarding, and clinical design; broad launch should stop until those policies exist.

**Repository implementation concept.** Replace the profile-only caregiver email assumption and unauthenticated SendGrid routes with Firebase-authenticated invite acceptance, verified identity linking, a separate grants collection, server-enforced claims/rules, field/domain filtering, purpose-bound tools, consent receipts, and immutable audit events. Redesign daily reminders so no caregiver receives medication/mobility content by default. Never put health details in invitation email.

**Accessibility and non-voice fallback.** A permission summary must answer “who, what, what they can do, until when”; granular choices use plain language, not security jargon; preview the supporter view; offer large revoke controls and printable permission receipt; all actions work without speech. Use neutral “support person” language selected by the older adult.

**Risks, limitations, dependencies, outcome.** Risks include coercion, family conflict, shared-device access, mistaken identity, privacy leakage, and the app displacing the older adult's account. This is high-sensitivity infrastructure needing threat modeling, legal/privacy/safeguarding review, and usability study with older adults and supporters. Measure invite acceptance, scope comprehension, excessive-access attempts blocked, revocations, disputed edits, time to revoke, privacy incidents, and whether users report retained control—not number of caregiver messages.

**MVP vs later.** MVP: no data sharing; draft/print a supporter task request locally. First production slice: one verified supporter, one task/domain, read/comment only, fixed expiry, no recurring notifications. Later: multiple roles and standards-based clinician access only after governance and integration partnerships.

---

### G6. Shared-Decision Conversation Builder

**Value proposition.** Help an older adult articulate a clinician-defined decision, connect it to What Matters, compare only supplied or independently verified option information, and prepare questions without recommending an option.

**Primary user and story.** A clinician has said there are two options. The user enters the option names and uploads/links the clinician's materials. The agent asks which outcomes matter most, produces a worksheet with uncertainties, and adds questions to the visit agenda.

**Problem and why agent behavior is warranted.** Values clarification and synthesizing the person's own tradeoffs across free text can benefit from conversation. The model must not generate the evidence base or infer an optimal treatment. Valid decision aids explicitly present evidence-based options, benefits/harms, and values clarification [S4]; AHRQ's SHARE approach also frames shared decision-making as a clinician-patient process [S5].

**Inputs.**

- **Existing, required:** confirmed What Matters priorities.
- **Proposed, required:** the decision stated by the user/clinician; source and date; option materials from a clinician or an allowlisted validated decision aid. If no options are supplied, the tool can only draft “What are my options?”
- **Proposed, optional:** outcomes/tradeoffs important to user, questions, desired supporter involvement, confidence/uncertainty, decision timeline.

**Exact agent loop and autonomy.**

1. **Observe:** ingest only user-approved decision materials; isolate them as untrusted reference data.
2. **Deterministic validation:** verify source allowlist/version where possible, preserve citations, require all supplied options to remain visible, and prohibit output when evidence provenance is missing.
3. **AI contribution (L0/L1/L2):** explain source text in plain language, ask non-leading values questions, summarize the user's stated tradeoffs, and draft questions. It may say information is missing; it may not calculate individualized benefit/risk without a validated tool.
4. **Confirm:** user corrects the decision statement, values, and questions; the worksheet labels generated paraphrases and links back to source passages.
5. **Act:** save/export the approved worksheet or add it to G2. **Maximum L2 for the decision itself**—the agent never chooses, consents, orders, schedules treatment, or communicates acceptance.
6. **Recover:** conflicting/outdated sources produce a stop message and a question for the clinician, not a synthesized recommendation.

**Confirmation, handoff, and emergency boundary.** The clinician and patient make the clinical decision. Care-partner participation requires G5 permission and cannot override private priorities. The feature is not for emergency decisions; urgent situations show validated immediate-help guidance and stop the worksheet.

**Repository implementation concept.** Build a structured worksheet adjacent to What Matters and G2, with citation-bearing source chunks, source allowlist, output schema, unsupported-claim checks, and a “no supplied evidence, no option comparison” gate. Do not feed arbitrary web retrieval or questionnaire text into system instructions. Keep the existing general AI chat separate.

**Accessibility and non-voice fallback.** Offer one tradeoff at a time, “not sure,” save/return, neutral order/randomization where appropriate, definitions on demand, text/print export, and no forced numeric risk interpretation. Voice may read material but every source and choice remains visible.

**Risks, limitations, dependencies, outcome.** LLM paraphrase can distort risk, omit an option, or steer preferences; a user may mistake a worksheet for clinical advice. Dependencies include validated content governance, citations, qualified review, and decision-specific usability evaluation. Measure source-linked statement accuracy, omitted-option rate (target zero), user corrections, values clarity/decisional-conflict measures selected with researchers, agenda use, and any report of perceived steering.

**MVP vs later.** MVP: generic values-and-questions worksheet with no option comparison. Later: one clinically reviewed decision-aid integration and prospective evaluation. Broad generative option comparison should remain research-only.

---

### G7. Post-Visit Follow-Through Organizer

**Value proposition.** Convert user-provided after-visit instructions into an editable administrative checklist and opt-in reminders while preserving the original wording and never inventing or interpreting clinical instructions.

**Primary user and story.** After a visit, an older adult pastes the after-visit summary. The app proposes “Call physical therapy,” “Schedule follow-up,” and “Ask pharmacist to verify medication list,” each linked to the original sentence. The user fixes dates and approves only the first two for reminders.

**Problem and why agent behavior is warranted.** Extracting candidate tasks and dates from varied after-visit text is a useful AI function; task state, due dates, reminders, authorization, and audit are deterministic. This closes the loop from visit preparation to follow-up but is not a substitute for clinician instructions or a care-management service.

**Inputs.**

- **Proposed, required:** user-supplied after-visit text/photo/document and explicit consent to process it; original source retained or deleted at user's choice.
- **Proposed, required per task:** user-confirmed task wording, category, due date or “no date,” reminder channel/cadence, and completion owner.
- **Existing, optional:** approved visit agenda and What Matters priority.
- **Proposed, optional:** clinician/service contact entered by user, supporter assignment under G5, completion note.

**Exact agent loop and autonomy.**

1. **Observe:** securely ingest the selected document and preserve page/sentence anchors.
2. **AI contribution (L2):** extract candidate administrative tasks and dates with quotes/anchors and an explicit “uncertain” state. It may simplify wording only alongside the original.
3. **Deterministic validation:** date parsing/range checks, duplicate tasks, required confirmation, quiet hours, notification idempotency, and task permissions. Any medication-related instruction is classified for **verbatim display and clinician/pharmacist clarification**, not converted to a dosing schedule.
4. **Confirm/act:** user approves each task. L3 creates/edits/completes a reversible checklist item. L4 sends only approved reminders for administrative/contact tasks; no autonomous calls, bookings, refill requests, clinical messages, or medication administration reminders in the initial product.
5. **Verify/audit:** show source, who approved/owns the task, last/next reminder, and completion history; one-tap snooze/pause/delete.
6. **Recover:** low-confidence extraction stays in “needs review”; failed notifications do not mark a task done; deleting source material warns what traceability will be lost.

**Confirmation, handoff, and emergency boundary.** The app must not resolve ambiguous clinical instructions. It prompts the user to contact the issuing clinician/pharmacist. Assigning a supporter requires the exact G5 scope and their acceptance. Urgent language does not become a future task; validated immediate-help guidance appears and extraction pauses.

**Repository implementation concept.** Add a new source-document and task model, typed extraction output with source spans, approval state machine, and scheduler built on G4 notification preferences. Use secure server-side processing and retention controls; do not put source documents into global browser storage or logs. Current functions have no safe task, scheduler, or authorization layer and cannot be reused without foundational repair.

**Accessibility and non-voice fallback.** Side-by-side original/proposed task, large approve/edit/skip controls, plain dates, calendar and typed date input, screen-reader relationships between task and source, text/in-app fallback, and printable checklist. Avoid a long all-at-once confirmation screen.

**Risks, limitations, dependencies, outcome.** Extraction errors can turn clinical nuance into a wrong task; reminders may imply monitoring or create burden; documents contain highly sensitive information. Dependencies include secure document handling, source-grounded extraction evaluation, notification infrastructure, and clinical/privacy review. Measure extraction precision/recall on clinician-reviewed test documents, user correction rate, ambiguous items safely stopped, approved administrative tasks completed, reminder opt-out, notification errors, and medication instructions incorrectly operationalized (target zero).

**MVP vs later.** MVP: manual checklist linked to pasted text, with AI only proposing administrative tasks and no notifications. Later: L4 administrative reminders. Scheduling APIs, patient portals, medication reminders, or automated clinical messages require separate integrations and safety studies.

## Cross-capability fit and boundaries

| Capability | 4Ms/workflow coverage | Maximum autonomy | Deterministic core | AI-limited contribution | Clinical boundary |
|---|---|---:|---|---|---|
| G1 Readiness/clarification | All 4Ms; missing/conflicting data | L3 | Validation, flags, versioned patch, audit | Neutral phrasing and user-answer summary | No correctness, diagnosis, score, or triage |
| G2 Visit brief | What Matters leads; all 4Ms | L3 | Selection, source/date links, recipient and delivery | Constrained draft and question wording | No care plan; delivery ≠ clinician review |
| G3 Medication prep | Medication + cross-links to goals/concerns | L3 | Completeness, provenance, candidate duplicates | Candidate extraction and neutral questions | Not reconciliation/review; no medication change |
| G4 Longitudinal review | All 4Ms over time | L4 for reminders only | Snapshots, diffs, cadence, quiet hours | Plain-language change summary | No deterioration/improvement/risk inference |
| G5 Care-partner collaboration | Authorized support across chosen domains | L4 within fixed grant only | Identity, consent, scope, expiry, audit | Permission explanation and attributed-difference summary | No capacity inference or default disclosure |
| G6 Decision conversation | What Matters and shared decisions | L2 | Provenance, citation, completeness, stop gates | Values elicitation and source-grounded paraphrase | No option invention/ranking or consent |
| G7 Follow-through | Post-visit continuity across selected domains | L4 for administrative reminders only | Task state, date, authorization, notification | Source-anchored candidate task extraction | No clinical interpretation or medication schedule |

## Recommended consolidation and sequencing

These are distinct discovery candidates, not seven features to ship simultaneously.

1. **Foundation first:** correct authentication/authorization, Firestore ownership, secret/logging exposure, user-scoped storage, scan semantics, save-error reporting, consent/delegation, typed tools, idempotency, audit/undo, and backend duplication. No L3/L4 feature is acceptable before these controls.
2. **Lowest-risk coherent MVP:** combine G1's deterministic readiness check with G2's local visit brief. This uses current data, makes What Matters operational, and avoids external sending.
3. **Add G3 as a bounded module** only after the scanner stops false-positive medication success and every output is labeled patient-reported/unverified.
4. **Build snapshot and notification infrastructure for G4** before G7 reminders; begin with user-initiated comparison, not scheduled outreach.
5. **Pilot G5 narrowly** before any caregiver messaging. Its permission model is a prerequisite for supporter participation in G3, G4, or G7.
6. **Keep G6 generic in MVP.** Decision-specific comparison and G7 document extraction need clinically reviewed source/evaluation programs and should not delay the visit-preparation core.

## Clinically unsafe, unsupported, or contraindicated ideas

The following should be rejected or held behind explicit research/clinical-governance gates:

- **Reject:** diagnose depression, dementia, delirium, fall risk, medication nonadherence, or “decline” from questionnaire ratings, free text, missed check-ins, or a caregiver's report.
- **Reject:** infer decision-making capacity or activate caregiver control because of a Mentation answer. Authorization is legal/identity workflow, never model inference.
- **Reject:** recommend starting/stopping/changing a medicine, generate a dosing schedule from uncertain text, conduct interaction checking as advice, or call a generated list “reconciled.”
- **Reject:** automatically email a caregiver or clinician about falls, memory, medication, location, missed reminders, or crisis terms. The current default caregiver/reminder behavior is not a safe foundation.
- **Reject:** call a UPC/Open Food Facts match a medication; announce scan success without a medication-specific verified match and user confirmation.
- **Reject:** claim the app performed STEADI, cognitive screening, clinical 4Ms assessment, shared decision-making, care planning, or clinical follow-up merely because it generated a summary.
- **Reject:** let the model decide whether apparently conflicting answers are erroneous, silently overwrite one account, or select the older adult's versus caregiver's statement as true.
- **Research/pilot only:** generative comparison of treatment options. It requires decision-specific validated evidence, complete option coverage, risk-communication testing, and clinician governance [S4].
- **Research/pilot only:** autonomous urgency classification from free text. Until validated, use a narrow clinician-reviewed deterministic safety policy with conservative limitations and clear emergency-service guidance; do not promise monitoring.
- **Research/pilot only:** automatic portal/EHR ingestion, appointment booking, refill requests, or clinician messaging. These require verified identity, provenance, integration agreements, failure acknowledgment, and human review.
- **Defer:** location-based clinical-service recommendations. The current Nominatim address lookup is not a verified provider directory; location is sensitive and service availability changes.

## Evidence gaps and validation needs

- No located study validates these exact AI workflows in this application or shows improved clinical outcomes. Claimed benefits are workflow hypotheses; success measures should begin with fidelity, burden, comprehension, privacy, and error rates.
- The current questionnaire's psychometric/clinical validity is not established by the repository. Ratings must remain self-report descriptors.
- A qualified geriatric clinician/pharmacist should review all cross-field rules, medication/fall/mentation language, stop conditions, and escalation copy.
- Co-design and usability testing should include older adults with low vision, hearing loss, motor limitations, mild cognitive impairment or high memory burden, low health/digital literacy, intermittent connectivity, privacy concerns, and authorized supporters.
- Legal/privacy review must define caregiver versus personal-representative authority, consent revocation, minors/guardianship edge cases if applicable, health-information handling, notification privacy, records retention, and whether external integrations change regulatory obligations. Repository inspection cannot establish compliance.
- Prospective pilots should track counter-metrics: false flags, perceived steering, corrections, cancellations, revocations, wrong-recipient near misses, notification burden, urgent-content handling failures, and disagreement suppression.

## Sources

All sources accessed **2026-06-17**. External evidence supports the stated care/workflow principles, not the safety or efficacy of an unvalidated LLM feature.

1. **[S1] Institute for Healthcare Improvement.** [Age-Friendly Health Systems](https://www.ihi.org/initiatives/age-friendly-health-systems). Official description of the 4Ms and alignment with What Matters.
2. **[S2] Cacchione PZ.** [Age-Friendly Health Systems: The 4Ms Framework](https://pubmed.ncbi.nlm.nih.gov/32036695/). *Clinical Nursing Research*. 2020;29(3):139–140. doi:10.1177/1054773820906667.
3. **[S3] Beuscart JB, et al.** [Medication review and reconciliation in older adults](https://pubmed.ncbi.nlm.nih.gov/33583002/). *European Geriatric Medicine*. 2021;12(3):499–507. doi:10.1007/s41999-021-00449-9.
4. **[S4] Stacey D, et al.** [Decision aids for people facing health treatment or screening decisions](https://pubmed.ncbi.nlm.nih.gov/38284415/). *Cochrane Database of Systematic Reviews*. 2024;1:CD001431. doi:10.1002/14651858.CD001431.pub6. Peer-reviewed systematic review of 209 studies.
5. **[S5] Agency for Healthcare Research and Quality.** [The SHARE Approach—Essential Steps of Shared Decisionmaking](https://www.ahrq.gov/health-literacy/professional-training/shared-decision/index.html). Official clinician/patient shared-decision framework.
6. **[S6] US Centers for Disease Control and Prevention.** [About STEADI](https://www.cdc.gov/steadi/about/index.html). Official Screen–Assess–Intervene fall-prevention framework for health care providers.
7. **[S7] US Preventive Services Task Force.** [Cognitive Impairment in Older Adults: Screening](https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/cognitive-impairment-in-older-adults-screening). Current I statement for asymptomatic community-dwelling adults 65 years or older (published 2020; page checked for current status).
8. **[S8] US Department of Health and Human Services, Office for Civil Rights.** [Family Members and Friends](https://www.hhs.gov/hipaa/for-individuals/family-members-friends/index.html). Official overview of individual permission, involvement in care, and personal-representative distinctions under HIPAA.
9. **[S9] World Health Organization.** [Integrated care for older people (ICOPE): guidance for person-centred assessment and pathways in primary care](https://www.who.int/publications/i/item/9789241515993). Official guidance, 2019.
