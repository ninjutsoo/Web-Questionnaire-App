# Phase 2C — Practical Agentic-Workflow Capability Discovery

**Role:** Practical Agentic-Workflow Product Designer  
**Repository reviewed:** `Web-Questionnaire-App`  
**Prepared:** 2026-06-17  
**Scope:** Product discovery only. No application, schema, dependency, or configuration changes are made here.

## Decision standard

An idea is included only if it closes a multi-step loop for the older adult: **observe → reason within policy → propose/confirm → act through an authorized tool → verify → record → follow up**. Model output may help interpret free text, rank relevant questions, or draft plain-language content. Identity, authorization, risk thresholds, data validation, sending, scheduling, writes, retries, and audit must remain deterministic server-side controls.

This is not a clinical system and the proposed agent must not diagnose, prescribe, tell a person to start/stop/change a medicine, promise that an email was read, or silently disclose information. The 4Ms remain anchored in What Matters, Medication, Mentation, and Mobility, consistent with IHI's framework. Accessibility requirements use WCAG 2.2 as a floor, including keyboard operation, visible/unobscured focus, labels and error assistance, status messages, reflow, and at least the 24-by-24 CSS-pixel minimum target-size criterion; the existing app's frequent 44-pixel controls should remain the preferred product target.

## Repository baseline that constrains every proposal

- The app already collects What Matters goals/support needs, structured medication entries, three 1–10 Mentation ratings and free text, and Mobility type/aids/challenges/fall concerns (`src/services/questionnaireService.js:187-250`).
- `getUserQuestionnaireContext` can assemble all four domains and structured medication details (`src/services/questionnaireService.js:555-663`), but interpolating that text directly into a model prompt is unsafe for tool use.
- Review can build, share, print, and download a plaintext report (`src/views/Questionnaire/ReviewSubmit.jsx:174-255`), providing a useful output seam for visit preparation.
- The profile stores one caregiver email (`src/components/ProfileModal.jsx:65-72`), but there is no consent grant, recipient verification, delegated role, scope, expiration, or revocation model.
- The deployed-oriented Functions backend has OpenRouter routing, SendGrid, and scheduled Functions, but HTTP routes are unauthenticated, CORS reflects all origins, and the daily scheduler sends health content without an adequate opt-in model (`functions/index.js:156-211,243-293,322-395,552-557`).
- `saveSectionResponses` suppresses Firestore failures (`src/services/questionnaireService.js:429-445`); no agent may claim an action succeeded until this behavior is replaced and the committed document is read back.
- The current answer ID (`${uid}_4ms_health`) represents one mutable assessment (`src/services/questionnaireService.js:559-561`), so longitudinal capabilities require immutable versioned snapshots.
- Current Firestore rules are not a safe tool boundary: the deployed rules allow public user reads and cross-user authenticated access elsewhere (`firebase-security-rules.txt:7-15`).

### Mandatory foundation before any L2–L4 pilot

1. Rotate the exposed credential noted in Phase 1; remove it from history where feasible.
2. Consolidate `chat-backend/server.js` and `functions/index.js` into one deployed source of truth.
3. Verify Firebase ID tokens on every endpoint, enforce ownership/delegation server-side, narrow CORS, enable App Check after monitored rollout, and replace the broad Firestore rules.
4. Add a typed tool registry with per-tool input schemas, policy checks, idempotency keys, least privilege, timeouts, and output validation. Model text is never itself authorization.
5. Store consent grants, action proposals, immutable action attempts/results, and user-visible audit events. Logs must redact questionnaire content, addresses, prompts, tokens, and recipient addresses.
6. Separate untrusted questionnaire, scan, model, email, and resource-directory content from system instructions. Treat every external string as data; never let it select a tool or recipient.
7. Fix save-error propagation and medication scan false-success behavior before an agent can edit answers.
8. Add qualified clinical, privacy/legal, security, and accessibility reviews plus automated policy/evaluation tests. The repository does not establish HIPAA applicability or compliance.

## Capability 1 — Guided Completion and Correction Agent

**Value proposition.** Help a person finish the 4Ms assessment with less memory and navigation burden by finding the smallest useful set of unanswered or apparently conflicting items, explaining why each matters, and saving only answers the person confirms.

**Primary user and story.** An older adult returns to a partly completed assessment and says, “Help me finish.” The agent identifies three unresolved items, presents one at a time, accepts typed/tapped/dictated input, shows the interpreted answer, and writes it only after confirmation.

**Problem and agentic justification.** Ordinary validation can determine empty or malformed fields and should do so. Agent behavior is warranted for interpreting free-text intent, recognizing that two answers may need clarification without declaring either wrong, choosing the next least-burdensome question across four domains, adapting wording to the user's prior confusion, and continuing until the user stops or reaches review. A fixed wizard cannot perform this context-sensitive cross-domain recovery as well.

**Trigger.** User selects “Help me finish,” returns to a draft, reaches Review with unresolved items, or receives a visible save-conflict/error. Never start an interrupting conversation merely because the form is incomplete.

**Data.** Required existing: authenticated user ID, current questionnaire schema/version, current draft responses, section progress, and last verified save state. Optional existing: speech transcript, display/voice preferences. Required new: draft revision/version and action proposal ID. Optional new: “skip for now,” preferred interaction mode, plain-language preference, and user-confirmed explanation of an apparent conflict. No caregiver data is needed.

**Tools/integrations.** Deterministic completeness/shape validator; read-current-draft; scoped `patch_answer` tool; focus/navigation tool; Firestore transaction/read-back; user-visible audit writer. Reuse `Questionnaire.jsx`, `4msSection.jsx`, `ReviewSubmit.jsx`, `SpeechReader.jsx`, and `questionnaireService.js`; do not give the model direct Firestore access.

### Agent loop and autonomy

| Stage | Exact behavior |
|---|---|
| Observe | Read the authenticated user's current revision and run deterministic empty/type/range checks. Label any cross-answer tension as “may need clarification,” never “incorrect.” |
| Reason | Rank at most three next questions by completion value, burden, prior skips, and safety policy. The model may paraphrase; it cannot invent required fields or clinical meaning. |
| Propose/confirm | Ask one question, then display the exact field and normalized value that would be saved. Offer **Save this answer**, **Change it**, **Skip**, and **Stop helping**. |
| Act | **L3:** after `Save this answer`, call `patch_answer(userId, assessmentId, expectedRevision, fieldPath, value, proposalId)`. A transaction rejects stale revisions or paths outside the user's assessment. |
| Verify | Read back the field/revision and announce success only when they match. Move focus to the status and next question. |
| Record | Append actor, tool, field path, before/after hashes or minimally necessary values, confirmation timestamp, revision, and result. Do not store raw voice audio. |
| Follow up | Offer the next unresolved item; never auto-answer. If the user stops, return to the exact section and preserve a verified resume point. |

**Autonomy and exact confirmation boundary.** L1 for suggesting the next question; L2 for preparing a normalized answer; L3 only for writing one displayed answer after the older adult activates “Save this answer.” A blanket “finish for me” is not consent to multiple writes. No L4 mode.

**Handoff and emergency boundary.** It neither sends nor exposes data to a caregiver or clinician. Mentation/fall language that matches a clinically reviewed deterministic urgent policy pauses the workflow and shows the appropriate emergency/crisis options; the generative model does not decide that an emergency exists.

**Result shown.** “Saved and verified” with the exact answer, progress recalculated from deterministic rules, and Undo. Unresolved items remain visibly optional unless the schema truly requires them.

**Failure recovery.** On offline/timeout, retain a clearly labeled local pending draft, not a success state; offer Retry or Copy answer. On revision conflict, show both versions and ask which to keep. On model failure, fall back to the ordinary form and deterministic missing-field list. Never silently overwrite.

**Audit.** User-visible history: time, field label, previous/new value, initiating device/session, confirmation, result, and undo. Security logs contain event IDs and error codes rather than health text.

**Accessibility and non-voice fallback.** One question per view; plain labels; no time limit; keyboard and switch access; 44-pixel preferred targets; 200–400% zoom/reflow; focus and live-region save/error status; replayable speech at adjustable rate; identical typed/tap flow when speech recognition is absent; transcript correction before confirmation. Avoid memory tests or patronizing copy.

**Risks, limitations, dependencies.** The model may overstate a “conflict,” and excessive prompting could feel coercive. Use deterministic field checks, uncertainty copy, a persistent Skip, and a maximum clarification count. Depends on the mandatory foundation and reliable save semantics.

**Measurable outcome.** Draft-to-review completion rate, median interactions/time to finish, save verification failure rate, corrections/undos, skips, abandonment after intervention, screen-reader completion, voice-transcript correction rate, and a post-task “I stayed in control” rating.

**MVP vs later.** MVP: user-invoked help, deterministic missing-field ranking, model paraphrase, one-field confirmed writes, verify/undo. Later: multilingual phrasing, cross-device conflict resolution, and personalization learned only from explicit preferences—not inferred impairment.

## Capability 2 — Medication Reconciliation Investigator

**Value proposition.** Turn scans and manual entries into a provenance-labeled medication list and a short set of unresolved questions for the user, pharmacist, or clinician—without giving medication-change advice.

**Primary user and story.** An older adult managing several medicines scans a bottle and types two others. The agent checks authoritative identifiers, notices two entries may be the same product and one lacks a dose, asks the person what the label says, and prepares a “please verify” list for the next visit.

**Problem and agentic justification.** The current scanner can treat a generic UPC or Open Food Facts match as a medication success (`src/services/drugLookupService.js:106-207`; `src/components/MedicationScanner.jsx:88-140`). Deterministic identifier validation and source precedence are essential, while an agent can coordinate multiple lookup sources, compare names/strengths/routes, explain uncertainty, ask the next disambiguating question, and maintain a resolution queue. A simple barcode lookup cannot close that loop.

**Trigger.** After a scan/manual medication entry, when Review opens with incomplete medication entries, or when the user explicitly selects “Check my medication list.”

**Data.** Required existing: medication category/name/dose/frequency/notes and scan code/result. Required new: source, normalized identifier, lookup timestamp, confidence category (`verified identifier`, `possible match`, `user entered`), and per-field confirmation. Optional new: route, prescriber/pharmacy as user-entered text, “actually taking”/“not sure” status, and label photo/OCR only in a later consented pilot with retention controls.

**Tools/integrations.** Server-side NDC/openFDA and RxNorm adapters; strict barcode/type validator; normalization and duplicate-candidate engine; scoped medication patch tool; question-list/report builder. Reuse `MedicationScanner.jsx`, `drugLookupService.js`, medication entries in `4msSection.jsx`, and report generation in `ReviewSubmit.jsx`. Remove food-product lookup from the medication-success path.

### Agent loop and autonomy

| Stage | Exact behavior |
|---|---|
| Observe | Load the current medication entries and lookup provenance; run deterministic format, required-field, exact-identifier, and possible-duplicate checks. |
| Reason | For each unresolved item, rank evidence sources and select one clarifying question. Never infer dose/frequency from common prescribing practice. |
| Propose/confirm | Show bottle/user text beside the candidate normalized record, source, lookup date, and uncertainty. Buttons: **Use these details**, **Edit**, **Keep my wording**, **Not sure**. |
| Act | **L3:** patch only the displayed medication fields after that entry's explicit confirmation. **L2:** draft a “questions for pharmacist/clinician” list. |
| Verify | Re-read the medication entry, rerun duplicate/missing-field checks, and keep unresolved warnings visible. |
| Record | Store source/version, identifier, original user text, confirmed normalized fields, actor, proposal ID, time, and result. Restrict audit visibility to the user and explicitly authorized delegates. |
| Follow up | At visit-packet generation, include unresolved items. On the next assessment, ask whether the list is still current; never assume continuity. |

**Autonomy and exact confirmation boundary.** L1 for flags, L2 for a proposed normalized entry and clinician questions, L3 for adding/changing one medication entry after the user confirms the exact name, dose, frequency, and source shown. No L4. The agent can never start/stop/substitute a medicine, calculate a dose, or mark a clinical interaction as safe.

**Handoff and emergency boundary.** The user can include unresolved medication questions in the visit packet. A pharmacist/clinician remains the authority. Clinically reviewed emergency language must direct the person to emergency services/poison resources as appropriate; it must not continue reconciliation or generate home-treatment advice.

**Result shown.** A three-state list: **Confirmed by you**, **Source match—please confirm**, and **Needs pharmacist/clinician review**, with source/date and a printable question list.

**Failure recovery.** If lookup services fail or disagree, retain the person's original entry, label external verification unavailable, and allow manual completion. A scan never auto-adds. Timeouts are retryable; repeated failures fall back to manual entry. Rollback restores the previous entry revision.

**Audit.** Per-entry evidence provenance, proposed and confirmed values, tool status, user choice, undo, and packet inclusion. Do not log raw bottle images or full medication lists in general application logs.

**Accessibility and non-voice fallback.** Large camera controls plus a fully equivalent manual path; camera permission explanation; high-contrast crop guidance; no color-only confidence; source/confidence read by screen readers; editable transcription before save; no requirement to hold a bottle steady or speak.

**Risks, limitations, dependencies.** Name normalization can merge different formulations or split equivalents; external data may be incomplete; health literacy burdens remain. Mandatory source provenance, conservative matching, per-field confirmation, and clinical review copy are prerequisites. This is **Proceed with mandatory safeguards**, not a clinical interaction checker.

**Measurable outcome.** Confirmed complete entries, unresolved items surfaced, duplicate suggestions accepted/rejected, scan false-success rate (target zero), correction/undo rate, lookup availability, time to produce a usable list, and pharmacist/clinician-rated list usefulness in a pilot.

**MVP vs later.** MVP: NDC/RxNorm/openFDA server lookup, conservative normalization, provenance, per-entry confirmation, unresolved-question export. Later: consented label OCR, pharmacy/EHR imports, and interaction support only after legal, clinical, interoperability, and validation work.

## Capability 3 — 4Ms Visit Preparation and Shared-Decision Packet Agent

**Value proposition.** Convert the person's confirmed assessment into a short, editable agenda that starts with What Matters, highlights unresolved medication and safety questions, and can be downloaded or shared only with explicit approval.

**Primary user and story.** Before an appointment, an older adult wants a one-page reminder of what to discuss. The agent asks which two issues matter most, drafts a packet, lets the person remove sensitive details, and produces the approved version.

**Problem and agentic justification.** The current report is a literal dump of answered fields. An agent can synthesize across domains, rank issues by the user's stated priorities, identify unresolved questions, compress the result to a visit-length agenda, and revise it interactively. Deterministic templates enforce sections, provenance, length, and safety disclaimers.

**Trigger.** User activates “Prepare for a visit” from Review/Home, or later supplies an optional appointment date. No packet is generated or sent merely because an assessment is complete.

**Data.** Required existing: confirmed 4Ms answers and medication-resolution states. Required new: user-selected top priorities, packet revision, inclusion/exclusion decisions, and approval timestamp. Optional new: appointment date/type, clinician name, accessibility/accommodation request, selected prior snapshot, and recipient address entered or selected at send time.

**Tools/integrations.** Read-only structured context tool; schema-constrained summarizer; packet renderer (accessible HTML plus tagged PDF after a PDF-specific accessibility review); existing print/download/native share; optional SendGrid send tool. Reuse `getUserQuestionnaireContext` and refactor `ReviewSubmit.jsx:174-255` report generation into a tested formatter.

### Agent loop and autonomy

| Stage | Exact behavior |
|---|---|
| Observe | Load only confirmed fields the user elects to consider and show the data date/source. |
| Reason | Draft a constrained packet: What Matters, changes/concerns, current medication list and uncertainties, questions, and requested support. Do not create diagnoses or urgency labels. |
| Propose/confirm | Present the full packet in an editable preview, with per-section include/exclude controls and “Why included.” |
| Act | **L2:** prepare preview. **L3:** after approval, generate/download/print; sending requires a second confirmation showing exact recipient, channel, and final content/hash. |
| Verify | Verify the file opens and matches the approved revision; for email, report provider acceptance separately from delivery/read status. |
| Record | Record source assessment IDs, included field paths, packet revision/hash, exclusions, export/send event, recipient ID/address hash, and result. |
| Follow up | After the appointment date, offer—not force—a private update: “Did anything change that you want to record?” No clinical inference from silence. |

**Autonomy and exact confirmation boundary.** L2 for drafting. L3 for file generation after “Create this packet.” Any external share has a separate final confirmation after recipient and content preview. A packet approval never authorizes a later send or a different recipient. No recurring L4 in MVP.

**Handoff and emergency boundary.** The packet is patient-reported information, not a clinical record or instruction. Clinician/caregiver access occurs only through the selected export/send action. If urgent-policy criteria are already active, show emergency guidance separately; do not hide it inside a packet.

**Result shown.** A dated, editable one-page agenda plus optional detailed appendix; clear labels distinguish “You reported,” “Source matched,” “Needs verification,” and “Question to discuss.”

**Failure recovery.** On model failure, use a deterministic section template populated with confirmed data. On render failure, provide accessible HTML/plain text. On send failure, preserve the approved draft, show no false success, and offer retry/download/copy. Idempotency prevents duplicate sends.

**Audit.** User-visible packet versions, included/excluded categories, exports, each recipient confirmation, send acceptance/failure, and delete/revoke options where technically possible; explain that a downloaded or delivered copy cannot be remotely erased.

**Accessibility and non-voice fallback.** Short headings, plain language, adjustable text, reflow, logical reading order, keyboard editing, accessible status messages, no drag-only ordering, print contrast, and typed/tap controls for every spoken interaction. Users can request a large-print version without changing content.

**Risks, limitations, dependencies.** Summarization can omit nuance or amplify model-selected issues. Constrain the schema, show source links/field values, require priority selection and final review, and always provide the literal appendix. Email is not automatically an appropriate secure clinical channel; qualified privacy/legal review determines deployment.

**Measurable outcome.** Packet completion/export rate, edit/deletion rate before approval, unsupported-claim rate, duplicate-send rate, user recall of top priorities, clinician-rated usefulness, large-print/screen-reader success, and share cancellation/revocation rate.

**MVP vs later.** MVP: editable deterministic-template summary, top-two priorities, accessible download/print, no direct clinician integration. Later: consented email, calendar-linked follow-up, FHIR/EHR export, and clinician receipt only with partnerships and interoperability review.

## Capability 4 — Longitudinal Change and Follow-Up Scout

**Value proposition.** Compare immutable 4Ms snapshots, ask whether apparent changes are real, and prepare a user-approved follow-up question or visit item without diagnosing the change.

**Primary user and story.** An older adult completes another assessment six weeks later. The agent shows that sleep rating and fall concern changed, asks the person to confirm the comparison, and offers to add those items to a visit agenda.

**Problem and agentic justification.** The current mutable document cannot show change. Once snapshots exist, deterministic comparison can compute differences; agent behavior is useful for translating field-level deltas into a manageable narrative, considering What Matters, asking one clarifying question, and routing a confirmed concern into another workflow. Static “changed/not changed” badges would not coordinate that follow-up.

**Trigger.** User explicitly compares two assessments, completes a new immutable snapshot, or opens a follow-up suggested by a user-approved action plan. No background caregiver/clinician alert.

**Data.** Required new: immutable assessment snapshot ID, questionnaire version, completion timestamp, field-level provenance, and selected baseline. Required existing: corresponding confirmed responses. Optional new: user annotation (“temporary,” “entered wrong,” “want to discuss”) and appointment/task linkage.

**Tools/integrations.** Snapshot creator; schema/version mapper; deterministic delta calculator and clinically reviewed display thresholds; scoped annotation tool; visit-packet/action-plan handoff. Reuse current `Answers` data only as the initial source; replace the single-document history design before launch.

### Agent loop and autonomy

| Stage | Exact behavior |
|---|---|
| Observe | Read two user-selected/version-compatible snapshots and calculate exact deltas with dates. |
| Reason | Group changes by 4M, rank a small number by magnitude and the user's priorities, and generate neutral wording. The model cannot label deterioration, improvement, cause, or diagnosis. |
| Propose/confirm | Show old/new values side by side and ask “Is this change accurate?” Choices: **Yes**, **No—correct it**, **Not sure**, **Don't track this item**. |
| Act | **L2:** draft a follow-up question/packet item. **L3:** add an annotation or approved packet/task item after the exact text is confirmed; historical snapshots remain immutable. |
| Verify | Read back the annotation/link and ensure both source snapshot IDs remain attached. |
| Record | Store comparison IDs, deterministic deltas, model/version used for wording, confirmation, correction linkage, action, and result. |
| Follow up | At the user-selected time, offer the approved question/task. Silence triggers nothing; repeated dismissal suppresses further suggestions for that item. |

**Autonomy and exact confirmation boundary.** L1 to surface a neutral comparison; L2 to draft; L3 to annotate or add to a packet/task after approval. It never edits history, messages another person, or creates a clinical alert. No L4 unless the user later pre-authorizes a specific action-plan check-in.

**Handoff and emergency boundary.** Only user-confirmed changes can enter a packet or care-circle message. Deterministic urgent policy may interrupt with emergency options, but a numeric change alone must not be treated as an emergency without clinically validated rules.

**Result shown.** A dated side-by-side change card with “reported by you,” confidence limited to data quality, the user's annotation, and next approved step.

**Failure recovery.** If schemas are incompatible or either snapshot is incomplete, explain which fields cannot be compared. If model synthesis fails, show raw deterministic deltas. Corrections create a linked amendment rather than rewriting history.

**Audit.** Snapshot creation, comparison inputs, every amendment, suppression preference, packet/task handoff, and who viewed it under a delegated grant.

**Accessibility and non-voice fallback.** Do not rely on charts, color, or trend arrows alone; state old value, new value, and dates in text. Support table/list switch, screen-reader headings, large text, and easy dismissal. Avoid language that tests memory or implies decline.

**Risks, limitations, dependencies.** Regression to the mean, different interpretation of scales, schema changes, and sparse history can create false salience. Use exact values/dates, version mapping, neutral language, user confirmation, and a clinical research pilot before interpreting change patterns.

**Measurable outcome.** Confirmed vs dismissed changes, corrections, packet/task conversions, false-salience reports, suppression use, time to understand comparison, and accessibility comprehension. Avoid a metric that rewards more alerts.

**MVP vs later.** MVP: immutable snapshots, raw/neutral comparisons, user annotations, packet handoff. Later: clinically validated thresholds, personalized follow-up cadence, and research-only risk modeling with prospective validation.

## Capability 5 — Consent-Governed Care Circle Coordinator

**Value proposition.** Let the older adult grant a named supporter narrowly scoped, revocable help and have the agent preview, send, verify, log, and follow up on only the approved information or request.

**Primary user and story.** An older adult wants a daughter to help arrange transportation but does not want Mentation or medication details shared. The agent creates a one-time Mobility/transport request, previews it and the recipient, sends only after approval, and exposes a revoke/history screen.

**Problem and agentic justification.** A single caregiver email field cannot represent authority. Agent behavior is useful for translating a natural-language support goal into a minimal scoped request, checking it against a deterministic grant, redacting unrelated information, coordinating send/retry/response status, and following up. Consent, recipient, and scopes remain ordinary policy—not model judgments.

**Trigger.** User selects “Ask someone for help,” chooses Share from a packet/action, or accepts a non-interrupting suggestion after explicitly reporting a support need. Never triggered solely by age, low scores, inactivity, or a caregiver's request.

**Data.** Required existing: authenticated user, intended recipient address entered/selected by the user, and selected content. Required new: recipient identity/verification state, relationship label, purpose, field/domain scopes, allowed actions, one-time or duration, expiration, channel, frequency, grant version, revocation timestamp, and recipient acknowledgement. Optional new: preferred name, quiet hours/timezone, and alternate channel. A caregiver account and delegated login are later features.

**Tools/integrations.** Consent/grant registry; minimum-necessary redactor; recipient verifier; preview; idempotent SendGrid tool; delivery-event ingestion; revoke/pause; audit viewer. Reuse `ProfileModal.jsx` only as a migration source for caregiver email and `functions/index.js` SendGrid wiring only after replacing its unauthenticated routes and unconditional scheduler.

### Agent loop and autonomy

| Stage | Exact behavior |
|---|---|
| Observe | Read the user's stated support need, selected content, recipient, and active grants; default to no sharing. |
| Reason | Draft the minimum information/request needed and test every field against deterministic scope. Untrusted content cannot modify recipient or grant. |
| Propose/confirm | Show recipient, purpose, exact message, included/excluded domains, channel, one-time/recurring status, expiry, and how to revoke. |
| Act | **L3:** send one approved message. **L4 later:** send only a pre-authorized message class at an approved cadence; new domain, recipient, purpose, or materially different content returns to preview/confirmation. |
| Verify | Report SendGrid acceptance, bounce/failure, or recipient acknowledgement separately. Never equate provider acceptance with reading or action. |
| Record | Store grant version, content hash/minimal retained copy, recipient ID, proposal/confirmation, send attempt, provider event, revocation, and access history. |
| Follow up | Ask the older adult whether help arrived; offer resend, another recipient, pause, or revoke. Do not pressure them to broaden sharing. |

**Autonomy and exact confirmation boundary.** L2 for drafting. L3 requires a final confirmation on the exact recipient and message. L4 requires a separate setup confirmation stating content class, frequency, channel, quiet hours, end date, and revoke method. Every scope/recipient change and any sensitive free text outside the approved template requires new confirmation.

**Handoff and emergency boundary.** A caregiver is not treated as a clinician or surrogate decision-maker. The older adult's authority prevails unless a legally established representative model is separately implemented and reviewed. Emergency guidance must direct the user to emergency/crisis services; the system must not rely on email to a caregiver as emergency response.

**Result shown.** “Accepted for delivery,” “Delivered” only when supported by a provider event, “Bounced,” or “Acknowledged,” plus what was shared and a prominent Revoke/Pause control.

**Failure recovery.** Invalid/unverified recipient blocks sending. Timeouts retain an unsent approved draft; idempotency prevents duplicates. Bounces prompt the user to correct/choose another address. Revocation stops future actions immediately but explains that already delivered copies cannot be recalled.

**Audit.** User-visible grants, previews, confirmations, exact scope/purpose, send attempts/results, recipient accesses, changes, pauses, revocations, and administrator/support access. Audit viewing must itself be authorized and logged.

**Accessibility and non-voice fallback.** Consent uses short layered screens, plain examples of included/excluded data, no prechecked sharing, persistent back/cancel, keyboard/screen-reader support, and a printable grant summary. Voice can fill a draft but cannot replace the visible final confirmation.

**Risks, limitations, dependencies.** Coercion, shared-device exposure, caregiver misuse, mistaken address, inference from redacted content, and alert fatigue are material risks. Require recipient verification, purpose limitation, granular grants, neutral private-mode UX, easy revoke, abuse reporting, rate limits, and qualified legal/privacy/ethics review. **Proceed with mandatory safeguards.**

**Measurable outcome.** Successful support requests, send/bounce/duplicate rates, response/acknowledgement rate, revocations and time-to-revoke, scope-change confirmations, caregiver-message burden, misdirected-content incidents, and older adult control/trust ratings.

**MVP vs later.** MVP: one-time, user-authored support request; verified email; per-message preview/confirmation; delivery state; audit/revoke future drafts. Later: delegated caregiver accounts, scoped read/action permissions, approved recurring check-ins, SMS/calendar, and legal-representative workflows.

## Capability 6 — What Matters Action Steward

**Value proposition.** Turn one user-chosen What Matters goal into a small, approved plan, carry out reversible scheduling/check-in actions, adapt after the person's feedback, and stop instantly when asked.

**Primary user and story.** An older adult chooses “stay independent” and says transportation is the main barrier. The agent proposes one concrete step—collect two accessible ride options by Friday—then, after approval, schedules one check-in and adapts based on whether cost or mobility remains a barrier.

**Problem and agentic justification.** A generic reminder is insufficient: the durable value is coordinating the person's own goal, barriers across 4Ms, an approved next step, a tool action, outcome verification, and adaptive replanning. The scheduler itself is deterministic. The model helps decompose an open-ended goal, phrase feasible options, and adjust after feedback; it never chooses a health goal for the person.

**Trigger.** User selects “Make a plan” from a What Matters answer, visit packet, or support need. Never auto-enroll from questionnaire tags.

**Data.** Required existing: one user-selected What Matters goal and relevant confirmed support/barrier answers the user elects to include. Required new: plan goal text, next step, owner, due window, status, cadence, channel, timezone/quiet hours, consent version, pause/end state, and outcome response. Optional new: accessibility/transport/cost preferences and care-circle participant covered by a valid grant.

**Tools/integrations.** Plan/task store; deterministic scheduler/queue with idempotency; notification preference checker; check-in response parser; care-circle or local-resource handoff. Firebase scheduled Functions are reusable only after user-level scheduling, timezone, preferences, and authorization replace the global 08:00 job.

### Agent loop and autonomy

| Stage | Exact behavior |
|---|---|
| Observe | Read only the selected goal, approved context, current plan state, prior response, and notification preferences. |
| Reason | Offer at most three small next steps that are reversible, non-clinical, and traceable to the user's goal; explain why each fits. |
| Propose/confirm | User chooses/edits the step, owner, date window, channel, and check-in frequency. Show a complete plan preview with Pause/Delete. |
| Act | **L3:** create/update one approved task. **L4:** after explicit recurring authorization, send the approved check-in class within quiet hours and route the response to replanning. |
| Verify | Read back task/schedule, verify queue registration, and display next contact time in the user's timezone. After a check-in, ask whether the step happened; do not infer completion from opening a message. |
| Record | Store plan revision, source goal, approved context fields, confirmation, queue/action IDs, send/result, user response, pauses, and deletion. |
| Follow up | Based on explicit response, offer celebrate/continue, adjust barrier/step, ask authorized help, or stop. Two non-responses pause suggestions rather than escalating. |

**Autonomy and exact confirmation boundary.** L1 options; L2 draft plan; L3 create/change a task after full preview; L4 only for the exact pre-authorized check-in class/cadence/channel/window. Any new goal, recipient, health instruction, increased frequency, or data scope requires new approval.

**Handoff and emergency boundary.** Caregiver participation requires Capability 5's active grant and message preview rules. Clinician tasks remain items for the user/packet, not direct orders. Urgent language routes to clinically reviewed emergency options; the plan pauses and is not presented as emergency care.

**Result shown.** A simple plan card: “My goal,” “Next small step,” “Who,” “When,” “Next check-in,” and Pause/Edit/Delete, with clear sent/confirmed states.

**Failure recovery.** Queue failure means no scheduled state; offer retry or a downloadable plan. Offline replies sync with conflict handling. Provider outage pauses rather than flooding on recovery. Missed check-ins are visible, rate-limited, and never backfilled in a burst.

**Audit.** Every plan revision, recurring authorization, notification, response, adaptive proposal, task state change, caregiver handoff, pause, and deletion. The user can export the plan history and remove future schedules.

**Accessibility and non-voice fallback.** One step at a time, no streaks/shame, flexible dates rather than precise times, large controls, calendar plus plain date text, typed/tap check-in choices with free text, screen-reader status, and no reliance on push/audio. Respect cognitive fatigue with a “not today” option.

**Risks, limitations, dependencies.** The agent could overburden, moralize, or recommend infeasible steps; notifications can become surveillance. The user owns the goal, every plan is editable, cadence is capped, nonresponse does not escalate, and success is self-reported. Depends on notifications/preferences and possibly resource navigation.

**Measurable outcome.** User-approved plans, first-step completion, edits/cancellations, notification opt-out, nonresponse, cadence reductions, burden/control ratings, goal relevance, and successful barrier handoffs—not raw notification engagement.

**MVP vs later.** MVP: one active goal, one next step, in-app/email check-in after approval, deterministic scheduling, pause/delete, manual replanning. Later: multiple goals, calendar integration, care-circle co-tasks, and adaptive cadence supported by usability evidence.

## Capability 7 — Local Support Navigation and Warm-Handoff Agent

**Value proposition.** Find a small set of current, vetted services that match a person’s stated need and constraints, then prepare and carry out one approved contact step while preserving source evidence and an easy fallback.

**Primary user and story.** An older adult reports transportation and cost barriers. With permission to use ZIP-level location, the agent finds two wheelchair-accessible programs, shows eligibility/source/update date and phone/email, and drafts a short inquiry. The user chooses whether to call, copy, or send.

**Problem and agentic justification.** A static link list cannot reconcile need, distance, accessibility, hours, cost, eligibility, and changing availability or coordinate a contact/follow-up. The agent can query a curated directory, compare options against explicit constraints, disclose uncertainty, draft a minimum-data inquiry, execute the chosen contact tool, verify, and revisit no-result cases. Search/ranking never substitutes for emergency or clinical advice.

**Trigger.** Explicit request for resources or user acceptance of a suggestion tied to a reported support, transportation, loneliness, home-help, or Mobility need. Location remains off by default.

**Data.** Required: user-stated need and service area (manual ZIP/city is sufficient). Optional existing: browser location after just-in-time permission. Optional new: distance, cost, language, accessibility, transportation, contact-channel, and eligibility preferences; chosen contact details; outcome. Do not send questionnaire/medical details unless separately selected and necessary.

**Tools/integrations.** Curated resource directory/API with provenance and freshness; geocoding behind a server proxy; constraint filter/ranker; browser tel link; minimum-data email draft/send; optional calendar later. Replace direct browser Nominatim use in `AIChatbot.jsx:473-516` with a consented, minimized, server-governed integration.

### Agent loop and autonomy

| Stage | Exact behavior |
|---|---|
| Observe | Ask the need, manual area, and only constraints required for useful results. Show what location will be sent and to whom. |
| Reason | Query approved sources, apply deterministic hard constraints, then rank up to three options. Quote no unsupported availability/eligibility; attach source and freshness. |
| Propose/confirm | Show comparable cards and why each matched, uncertainty, last verified date, phone/site, and alternatives. User selects an option and contact mode. |
| Act | **L2:** draft inquiry/call script. **L3:** after preview of recipient and exact data, send the inquiry or open a call/calendar handoff; the system cannot place or record a call autonomously. |
| Verify | Confirm navigation opened or email provider accepted; later ask the user whether contact/eligibility was successful. |
| Record | Store query category, coarse area, applied constraints, source/version, options shown, user choice, approved content hash, action result, and correction feedback; avoid precise coordinates after the query. |
| Follow up | If unavailable/ineligible/no response, offer the next source or a human navigation line. Stop after user dismissal; refresh stale results before retry. |

**Autonomy and exact confirmation boundary.** L1 for source-backed recommendations, L2 for draft contact, L3 only after the user confirms service/recipient, channel, and exact information shared. No L4 auto-contact or recurring location use in MVP.

**Handoff and emergency boundary.** Community resources are not emergency response. Urgent-policy flow shows 911 or 988 options where appropriate and does not wait for a resource email. The app must not imply endorsement or guaranteed eligibility.

**Result shown.** Two or three source-linked options with match reasons, accessibility/cost/eligibility fields, last verified date, chosen next step, and honest contact status.

**Failure recovery.** On no results/outage, preserve the user's constraints, provide source directories/human phone lines and retry later only if asked. Stale/conflicting records are labeled and excluded from auto-send. User feedback can quarantine a listing pending review.

**Audit.** Permission event, data sent to each provider, query/source timestamps, results shown, chosen option, confirmed contact content, result, location deletion, and listing correction.

**Accessibility and non-voice fallback.** Manual location is equal to geolocation; list view replaces maps; distance is not the only rank; phone/web/email labels are explicit; no small map pins; addresses and hours are screen-reader friendly; the full flow is operable without voice, camera, precise location, or broadband-heavy maps.

**Risks, limitations, dependencies.** Directories become stale, underserved/rural areas may return few results, and ranking can encode geographic/economic bias. Require vetted sources, visible freshness, no-result honesty, feedback/quarantine, representative evaluation, and partner/cost assessment. **Research/pilot only** until a maintainable directory source is contracted or curated.

**Measurable outcome.** Result coverage by geography/need, stale/incorrect listing rate, successful contact and eligibility outcomes, no-result rate, location-permission decline, manual-location success, action cancellation, and disparity by rurality/accessibility/language.

**MVP vs later.** MVP: one region and two need categories using a curated directory; ZIP/manual location; compare, call/copy; no automated booking. Later: broader vetted APIs, send/calendar actions, multilingual support, live availability, and partner-confirmed referral closure.

## Cross-capability confirmation, safety, and audit contract

| Concern | Required behavior |
|---|---|
| Identity | Verified Firebase ID token and server-derived UID on every read/action; never trust a UID supplied by the model/client. |
| Authorization | Tool policy checks ownership, active delegated grant, permitted field paths, purpose, recipient, expiry, and action level. Firestore rules mirror—not replace—server authorization. |
| Proposal | Persist short-lived proposal ID, exact normalized arguments, human-readable preview, policy version, and source revision. |
| Confirmation | Deliberate labeled control; proposal hash, user, time, and revision must match at execution. Voice alone cannot confirm external sharing or recurring actions. |
| Execution | Idempotency key, schema validation, least-privilege service account, timeout, bounded retries, rate/cost limit, and no model-generated URLs/recipients/tool names. |
| Verification | Read-after-write for state; provider acceptance/delivery/acknowledgement shown as distinct states; no success from lack of error. |
| Undo/revoke | Reversible local writes expose Undo; future schedules/grants expose Pause/Revoke. Explain what cannot be recalled. |
| Audit | Append-only, user-visible event trail plus redacted operational telemetry; retention/deletion policy and break-glass/admin access review. |
| Prompt injection | Keep instructions, policy, and tool schemas separate from untrusted content; allowlist tools/arguments; scan outputs; require confirmation; test direct and indirect injection. |
| Emergency | Clinically authored deterministic routing, locally appropriate 911/988 display, no diagnosis, no delayed email handoff, and ordinary app access remains available. |

## Relative priority and practical fit

| Rank | Capability | Agentic value | Current-repo fit | Safety/feasibility stance | Suggested sequence |
|---:|---|---|---|---|---|
| 1 | Guided Completion and Correction | High: interprets, patches, verifies, recovers | High after save/auth fixes | Proceed with mandatory platform safeguards | First pilot |
| 2 | Visit Preparation Packet | High: cross-domain synthesis to approved artifact | High; report/context seams exist | Proceed with review and provenance | First pilot |
| 3 | Medication Reconciliation Investigator | High: multi-source ambiguity resolution | Medium-high; scanner/structured entries exist | Mandatory safeguards and pharmacist/clinical review | Second pilot |
| 4 | What Matters Action Steward | High: plan-act-check-adapt loop | Medium; scheduler must be redesigned | Proceed after preferences/queue | Second pilot |
| 5 | Care Circle Coordinator | High: scoped delegation and verified communication | Medium; email/profile seams exist but unsafe | Mandatory privacy/abuse safeguards | After consent platform |
| 6 | Longitudinal Change Scout | Medium-high: compare-confirm-route-follow-up | Low-medium until snapshots exist | Pilot with neutral language | After immutable sessions |
| 7 | Local Support Warm Handoff | High but integration-heavy | Medium-low; only location exists | Research/pilot until directory quality proven | Later/partner pilot |

Shared platform work should precede feature ranking. A sensible product wedge is Capabilities 1 and 3 because they use current data, reduce immediate burden, and avoid external partnerships. Capability 2 then improves a risky existing seam. Capability 6 becomes meaningful only after a deterministic preference-aware scheduler exists; Capability 5 cannot safely reuse the current reminder job as-is.

## Explicit rejects and non-agent alternatives

- **Reject: generic “medical advisor” chatbot.** It explains but does not complete a governed action loop, encourages overreliance, and the current prompt claims inappropriate authority (`functions/index.js:50-80`). Retain only narrowly scoped explanation with clear uncertainty if chat remains.
- **Reject: autonomous medication advice, dose calculation, interaction clearance, refill, or start/stop actions.** Consequence and validation burden exceed this app's role and evidence.
- **Reject: silent caregiver alerts or score-triggered disclosures.** They violate autonomy and lack authorization, role, purpose, and emergency reliability.
- **Reject: current unconditional daily medication/mobility email as an “agent.”** It is a fixed scheduler, not agentic, and currently lacks consent, quiet hours, timezone choice, scope, and recipient controls.
- **Reject: model-only crisis/fall detection and automatic outreach.** False positives/negatives and delayed email are unsafe. Emergency routing must be deterministic, clinically reviewed, user-visible, and local.
- **Use ordinary engineering, not AI:** autosave, retry queues, progress calculation, field validation, authentication, access rules, consent enforcement, notification timing, rate limits, idempotency, report rendering, and delivery-state tracking.
- **Defer: EHR/pharmacy imports, autonomous appointment booking, wearable monitoring, and continuous background surveillance.** These require integrations, validation, legal agreements, support operations, and consent models absent from the repository.

## Evidence and source notes

External sources were searched and checked on **2026-06-17**. Evidence informs design boundaries; recommendations tied to this repository are product/engineering inferences and require user research and qualified review.

1. [Institute for Healthcare Improvement — Age-Friendly Health Systems](https://www.ihi.org/partner/initiatives/age-friendly-health-systems) (accessed 2026-06-17). Defines the 4Ms as What Matters, Medication, Mentation, and Mobility and emphasizes alignment with the older adult and family caregivers. Supports starting plans/packets with the person's priorities rather than model-selected goals.
2. [W3C — Web Content Accessibility Guidelines (WCAG) 2.2](https://www.w3.org/TR/WCAG22/) (W3C Recommendation, accessed 2026-06-17), especially [Target Size (Minimum)](https://www.w3.org/TR/WCAG22/#target-size-minimum), [Focus Not Obscured](https://www.w3.org/TR/WCAG22/#focus-not-obscured-minimum), [Error Prevention (All)](https://www.w3.org/TR/WCAG22/#error-prevention-all), and [Status Messages](https://www.w3.org/TR/WCAG22/#status-messages). Supports non-voice equivalence, review/confirmation, clear focus/status, and operable targets.
3. [NIST AI 600-1 — Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence) (accessed 2026-06-17). Supports lifecycle governance, documented risk controls, evaluation, monitoring, provenance, and explicit human oversight rather than treating model output as an action authority.
4. [OWASP GenAI Security Project — LLM01:2025 Prompt Injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/) (accessed 2026-06-17). Notes that direct/indirect inputs can alter model behavior and that RAG/fine-tuning do not fully mitigate injection. Supports instruction/data separation, least privilege, allowlisted tools, output validation, and human approval.
5. [Firebase — Firestore Security Rules conditions](https://firebase.google.com/docs/firestore/security/rules-conditions) (accessed 2026-06-17). Documents `request.auth`-based access control and that rules are not filters. Supports owner/delegate-aware queries and rules designed around the data model.
6. [Firebase — Enable App Check enforcement for Cloud Functions](https://firebase.google.com/docs/app-check/cloud-functions) (accessed 2026-06-17). Supports rejecting requests without valid app attestation as defense in depth after authentication; it does not replace user authorization.
7. [Firebase — Enqueue functions with Cloud Tasks](https://firebase.google.com/docs/functions/task-functions) (accessed 2026-06-17) and [Firestore transactions and batched writes](https://firebase.google.com/docs/firestore/manage-data/transactions) (accessed 2026-06-17). Support bounded retry/idempotent queued actions and revision-safe confirmed writes; product policy still must prevent unsafe retry or duplicate sends.
8. [SAMHSA — 988 Suicide & Crisis Lifeline](https://www.samhsa.gov/mental-health/988) (accessed 2026-06-17). Supports a direct crisis route in the United States. Exact emergency copy, international behavior, and clinical triggers require qualified review and locale-aware implementation.

## Phase 2C conclusion

The repository can support meaningful agentic workflows, but not safely by adding tools to the current chatbot. The practical path is a server-authorized action layer with per-action confirmation, verification, undo/revoke, and user-visible audit. Begin with guided completion and an editable visit packet; both use existing 4Ms data and UI seams. Medication reconciliation is the next high-value workflow once lookup semantics and clinical safeguards are corrected. Recurring action plans, care-circle coordination, longitudinal comparison, and resource handoffs should follow only after their specific consent, history, scheduler, and integration foundations exist.
