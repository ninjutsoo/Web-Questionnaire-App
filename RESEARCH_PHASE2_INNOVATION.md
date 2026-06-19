# Phase 2D — “Wow but Useful” Innovation Scout

**Research date:** 2026-06-17  
**Repository basis:** `RESEARCH_PHASE1_REPOSITORY_CONTEXT.md`, validated 2026-06-17  
**Scope:** Discovery only. These are candidate capabilities, not clinical claims, implementation approval, or evidence that the current application is production-ready.

## Scout position

The strongest differentiation is not an all-knowing health chatbot. It is a consent-driven agent that turns the older adult's own 4Ms answers into a small, verifiable next step: notice a meaningful change, reconcile conflicting records, prepare for an appointment, or ask an authorized supporter for one bounded task. That direction fits the 4Ms emphasis on What Matters, Medication, Mentation, and Mobility [S1].

Evidence and inference are separated below:

- **Research evidence:** Medication reconciliation can reduce discrepancies, but systematic reviews report low-certainty or inconsistent evidence for downstream clinical outcomes [S3, S4]. Question-prompt interventions have been tested with older adults, but their effects are context-specific and do not establish that AI-generated questions improve outcomes [S5]. Shared portal access can help care partners, while also creating privacy and digital-equity concerns [S6, S7]. CDC STEADI and the USPSTF support structured fall-risk assessment and selected interventions; neither supports consumer AI fall prediction from questionnaire answers [S10, S11].
- **Product inference to validate:** An agent that prepares, confirms, records, and follows up on bounded actions may reduce memory burden and make 4Ms answers more useful between visits. This must be tested with diverse older adults; the repository contains no such outcome evidence.
- **Hard constraint:** Phase 1 found broad Firestore access, unauthenticated APIs, unsafe reminder defaults, unscoped local storage/logging, no consent or delegation model, no authorized tool layer, and no audit/undo mechanism. Therefore all L3/L4 concepts are **blocked from deployment** until those foundations are repaired.

### Autonomy scale used in every concept

- **L0 — Explain/summarize:** read-only; no external effect.
- **L1 — Recommend:** propose a next step; no artifact or action is sent.
- **L2 — Prepare:** create a draft, checklist, or pending action for explicit approval.
- **L3 — Execute after explicit approval:** perform a reversible, low-risk action, verify the result, and make an audit entry.
- **L4 — Pre-authorized recurring action:** act only inside a narrow, revocable permission (channel, recipient, purpose, frequency, quiet hours, and expiry), with visible history and pause/revoke.

No capability may diagnose, calculate individualized medication changes, tell a user to start/stop/change a medicine, silently disclose information, or present itself as emergency monitoring.

## Dependency map

“New” means not currently available as a safe, production-ready integration in this repository. Existing camera, geolocation, speech, SendGrid, and scheduled-function code still require the Phase 1 safety/security repairs.

| Capability | New sensors | EHR | Pharmacy | Calendar | Messaging | Wearables | Other third party |
|---|---|---|---|---|---|---|---|
| 1. Four-M Change Lens | No | No | No | No | Optional export later | No | No |
| 2. Medication Truth Table | Existing camera; no new hardware | Optional later | Optional later | No | Optional pharmacist draft | No | Optional OCR/document extraction |
| 3. Appointment-Aware Visit Pack | No | Optional appointment metadata later | No | **New, optional for MVP; required for L4** | Optional | No | Calendar provider OAuth |
| 4. Consent Capsule Care Circle | No | Optional later | No | Optional | **New permissioned workflow; required for remote task** | No | Email/SMS delivery provider; identity verification |
| 5. After-Visit Closed Loop | Existing camera; no new hardware | Optional import later | Optional later | Optional for MVP; required for calendar actions | Optional | No | Optional OCR/document extraction |
| 6. Door-to-Door Mobility Plan | Existing one-time geolocation only | No | No | Optional | Optional | **No** | Maps/weather/transit/accessibility data later |
| 7. Quiet Rescue Mode | No; local interaction events are not sensors | No | No | No | No | No | No |

## 1. Four-M Change Lens

**Value proposition.** Convert repeated 4Ms assessments into a plain-language “what changed, what stayed important, and what I want to discuss” view, so the questionnaire becomes useful over time rather than a one-time form.

**Primary user and concrete story.** An independently living older adult completes the questionnaire again before a primary-care visit. The agent says, “You still value gardening; you now report more concern about falling and lower sleep. Is that accurate?” The user corrects one item, approves three questions, and saves a one-page visit brief.

**Problem and why an agent is warranted.** Comparing many structured responses, free-text answers, dates, and user corrections is cognitively expensive. Deterministic code should calculate field-level differences; an agent is warranted only to group related changes across the four Ms, translate them into neutral language, ask disambiguating questions, and produce a user-directed agenda. A fixed “changed fields” screen cannot infer that a new mobility concern may threaten a stated What Matters goal, but the model must label that connection as a suggestion, not a fact.

**Inputs.** Required new input: immutable, timestamped assessment snapshots and explicit “compare with” selection. Existing inputs: What Matters tags/notes, medication entries, happiness/memory/sleep ratings, mobility aids/challenges/fall concern, and profile display preferences. Optional new inputs: user significance marker (“important to me”), correction reason, and visit date. It must not infer deterioration from typing speed or voice characteristics.

**Exact actions and autonomy.**

1. **L0:** Retrieve two user-owned snapshots; deterministic code produces typed diffs; the model summarizes only those diffs and quotes the source fields behind each statement.
2. **L1:** Suggest up to three discussion topics, each linked to the relevant 4M answers and marked “You decide whether this matters.”
3. **L2:** Draft a visit brief with What Matters first, changes, unchanged concerns, questions, and an uncertainty/correction section.
4. **L3:** After preview and explicit approval, save a versioned brief or invoke native print/download/share; verify creation and log input snapshot IDs, approved text, time, and channel. Sharing to another person requires a separate recipient confirmation.
5. **L4:** **Not allowed for interpretation or sharing.** A future pre-authorization may generate a private draft before a scheduled visit, but it may never send it automatically.

**Confirmation, handoff, emergency boundary.** The user confirms each material change and the final brief. Caregiver or clinician handoff is optional and recipient-specific; no default caregiver copy. Deterministic urgent-language screening may show clinician-reviewed emergency instructions, but the change comparison itself does not assess urgency and must never delay calling emergency services.

**Repository-tied implementation.** Add immutable snapshots alongside the mutable `Answers/{uid}_4ms_health` model; reuse `getUserQuestionnaireContext`, the Review/Submit report builder, native share/print/download, and Firebase Auth. Put comparison and authorization in one hardened Firebase Functions backend, not the duplicated Express implementation. Use structured model output whose claims reference exact field IDs; validate that the model introduces no new clinical facts. Prerequisites are user-owned Firestore rules, authenticated endpoints, corrected save failures, secret/log remediation, versioned prompts, and a visible action audit.

**Accessibility and non-voice fallback.** Default to a short change list with “show source answer,” large targets, persistent Back/Undo, no color-only meaning, screen-reader headings and live status, and a print-friendly high-contrast version. Every voice operation has identical typed/touch controls. Meet WCAG 2.2 focus, target-size, redundant-entry, status-message, and error-prevention expectations [S2].

**Risks, limitations, dependencies, measurable outcome.** Risks include false causal links, overemphasizing numeric changes, anxiety, and loss of history control. Require neutral wording, source citations, correction, deletion, and “no meaningful change” as a valid output. **Dependencies:** no new sensor/EHR/pharmacy/calendar/wearable/third-party service; optional later messaging. **Measures:** percentage of generated statements confirmed or corrected; unsupported-claim rate; brief completion time; number of user-selected agenda items discussed at a visit (self-report); anxiety/trust score; share cancellation rate. Do not count messages as value.

**MVP vs later.** **MVP:** compare two snapshots, deterministic diffs, confirmation, and local print/download; L0-L2 plus approved in-app save. **Later:** appointment-linked private draft, longitudinal trend view, permissioned sharing, and evaluation of whether users report better visit preparedness.

## 2. Medication Truth Table

**Value proposition.** Put “what I take,” “what the label says,” and optional clinical/claims records side by side, highlight only factual mismatches, and prepare questions for a pharmacist or clinician without recommending a medication change.

**Primary user and concrete story.** An older adult managing several medicines scans a bottle and sees: “Your list says once daily; this label was read as twice daily. I may have read it incorrectly. Please check the bottle. Do not change how you take it based on this app.” After correcting an OCR error, the user approves a concise pharmacist question.

**Problem and why an agent is warranted.** Medication names, abbreviations, brands/generics, duplicate sources, and unstructured directions are hard to align. Deterministic normalization via RxNorm and exact comparison should do the safety-critical matching. An agent is useful for asking one clarification at a time, explaining the provenance of each value, and drafting a reconciliation question. Reviews support discrepancy reduction as a realistic target, not improved clinical outcomes or medication appropriateness [S3, S4].

**Inputs.** Required for MVP: existing structured medication entries plus user-confirmed transcription of a current bottle/medication list. Existing optional input: barcode/camera lookup, only after fixing its false-success semantics. Proposed optional inputs: bottle image, OCR text, prescriber/pharmacy name, “actually taking” schedule, last verified date, and document provenance. Later optional: user-authorized EHR FHIR medication records, Medicare claims through CMS Blue Button, or pharmacy fill history. Claims indicate dispensing/billing, not necessarily current use; Blue Button is an available beneficiary-authorized claims API, not a comprehensive medication truth source [S8]. FHIR is an interoperability standard and still requires a real health-system authorization/connection [S9].

**Exact actions and autonomy.**

1. **L0:** Normalize candidate names with deterministic services; show a row per source, timestamp, confidence, and “confirmed by me” state. Never silently merge.
2. **L1:** Flag exact conflicts (name, dose text, frequency, status) and stale/unknown fields; suggest verifying with the bottle, pharmacist, or clinician.
3. **L2:** Draft a correction to the app's list and/or a pharmacist/clinician question. The draft includes the conflicting source text and excludes recommendations.
4. **L3:** After item-by-item approval, update only the user's app list or send/export the approved question; verify persistence/delivery and record before/after, source, confidence, approver, and undo where possible.
5. **L4:** **Prohibited** for medication-list changes and outreach. A later recurring action may privately remind the user that a list is stale, with easy pause; it may not infer adherence or contact others automatically.

**Confirmation, handoff, emergency boundary.** Every OCR result and each changed field requires confirmation. Handoff contains “reconciliation question—not medical advice.” The app must never resolve a discrepancy by selecting one source, and never tell the user to change dosing. A clinician-reviewed deterministic rule handles statements such as suspected overdose or severe reaction by directing the user to emergency/poison resources appropriate to locale; the model is bypassed for emergency copy.

**Repository-tied implementation.** Reuse `MedicationScanner.jsx`, `drugLookupService.js`, structured medication entries, RxNorm/openFDA adapters, questionnaire context, and report export. First remove food/UPC false-positive success, represent provenance and verification status, authenticate server calls, and ensure AI sees untrusted scan/OCR text as data rather than instructions. Introduce a server-side typed `compareMedicationSources` tool and strict schemas; do not let the model write Firestore directly.

**Accessibility and non-voice fallback.** Offer manual entry and “I cannot scan this” paths; avoid forcing camera, fine alignment, or speech. Read differences row by row with explicit labels (“Your entry,” “Bottle label”), plain-language expansions, large controls, zoom/reflow, and an easy “not sure” choice.

**Risks, limitations, dependencies, measurable outcome.** OCR/lookup errors, stale claims, brand/generic confusion, false reassurance, privacy exposure, and user-initiated unsafe changes are material risks. **Dependencies:** existing camera sensor; optional new OCR third party; later **EHR**, **pharmacy**, CMS/third-party claims; no calendar/wearable. **Measures:** confirmed discrepancy rate; OCR correction rate; false-match/false-conflict rate against pharmacist review; time to produce a verified list; user changes made without clinician/pharmacist consultation (counter-metric); successful question handoffs; aborted sends.

**MVP vs later.** **MVP:** compare user entry with a user-confirmed label transcription; draft/print questions; no EHR, pharmacy, OCR, or autonomous outreach. **Later:** constrained OCR, then one read-only FHIR/claims pilot with provenance and clinical/pharmacy validation. Broad release remains research-dependent.

## 3. Appointment-Aware Visit Pack

**Value proposition.** With narrow calendar permission, prepare the right 4Ms brief and questions before a real appointment, reducing the chance that What Matters or a new concern is forgotten.

**Primary user and concrete story.** A user authorizes read access only to events they select. Two days before “Dr. Lee—primary care,” the app prepares a private draft: top goal, changes since last assessment, medication questions, and accessibility needs. The user can edit, dismiss, or approve a reminder; nothing is sent to the clinician automatically.

**Problem and why an agent is warranted.** The difficult part is not creating a reminder; deterministic calendar logic should handle time, quiet hours, recurrence, and delivery. The agent earns its place by selecting and compressing relevant user-confirmed 4Ms content for the appointment type, asking what the user wants from the visit, and revising the pack. Question-prompt interventions make visit preparation plausible, but one older-adult surgery RCT does not justify general claims of improved outcomes [S5].

**Inputs.** Required MVP: user-entered appointment date/time, appointment type, preferred lead time, timezone, quiet hours, channel, and selected 4Ms snapshot. Optional: specific clinician name, access/transport need, user goal, and chosen contacts. Later optional: calendar OAuth with event-level selection and, separately, EHR appointment metadata. The agent must not read unrelated event descriptions, attendees, or location unless individually authorized.

**Exact actions and autonomy.**

1. **L0:** Summarize the selected assessment and show what content could enter a pack.
2. **L1:** Suggest agenda items and a preparation time based on the user-entered appointment.
3. **L2:** Prepare a private pack and pending reminder for preview.
4. **L3:** After explicit approval, save/export the pack and create one reversible reminder; verify it appears and provide undo.
5. **L4:** Under a granular, expiring authorization, detect only selected calendar events and prepare private drafts/reminders using stated lead time, quiet hours, and frequency limits. L4 may not send health content to clinicians/caregivers or edit clinical appointments. Each action appears in history and supports one-tap pause/revoke.

**Confirmation, handoff, emergency boundary.** User confirms appointment, content, channel, and each recipient. A caregiver can receive logistics only or a user-selected subset, never the whole pack by default. The pack explicitly says it is not reviewed by the clinic. Newly entered urgent language invokes deterministic clinician-reviewed guidance; pack generation is not emergency triage.

**Repository-tied implementation.** Reuse questionnaire context, report generation, browser share, Firebase scheduled functions, and SendGrid adapter only after replacing unsafe global reminders. Add authenticated typed tools for `prepareVisitPack`, `createReminder`, `cancelReminder`, and `getActionStatus`; store timezone, quiet hours, scope, expiry, idempotency key, and audit. Calendar integration belongs behind server-side OAuth token isolation, never in the model prompt.

**Accessibility and non-voice fallback.** A single “next appointment” card, large calendar controls, natural-language date repeated in full, confirmation of timezone, printable checklist, screen-reader order, and text/touch parity with voice. Reminder controls must not rely on swipe, drag, or audio.

**Risks, limitations, dependencies, measurable outcome.** Wrong event classification, calendar overcollection, stale answers, reminder fatigue, time-zone errors, and implied clinician receipt. **Dependencies:** new **calendar** provider for L4; optional messaging and EHR; no sensors/pharmacy/wearables. **Measures:** packs reviewed before appointments; reminder dismiss/disable rate; agenda items user reports discussing; preparation time; wrong-event rate; calendar permission revocations; missed/late notifications; accidental disclosure count.

**MVP vs later.** **MVP:** manual appointment entry, private pack, native export, and one app reminder (L0-L3). **Later:** read-limited calendar integration and L4 draft preparation only after consent, scheduler, notification, and audit controls pass accessibility/security review.

## 4. Consent Capsule Care Circle

**Value proposition.** Let an older adult ask a supporter for one clearly bounded task—such as checking medication spellings or helping plan transportation—without surrendering broad account access.

**Primary user and concrete story.** An older adult wants a daughter to check medication names but not see Mentation responses. The app translates that wish into a capsule: “May view these five medication names and suggest spelling corrections until June 30; cannot see doses, notes, chat, or other 4Ms; cannot submit changes.” The user reviews it, sends an invite, and later revokes it.

**Problem and why an agent is warranted.** Shared credentials and all-or-nothing caregiver access undermine autonomy. Authorization itself must be deterministic role/attribute-based access control. The agent is warranted to turn plain-language intent into a proposed minimal scope, explain consequences, collect the supporter's response, and summarize conflicting suggestions. Research on shared portal access explicitly identifies privacy and equity implications; recent multisite work demonstrates a practical shared-access workflow but does not prove that any delegation design is safe for every relationship [S6, S7]. Legal authority, caregiver status, and HIPAA personal-representative rights are not interchangeable [S13].

**Inputs.** Required: user-selected task, exact fields, allowed actions, recipient identity/channel, expiry, revocation method, and whether the recipient can respond. Optional: relationship label, preferred reminder frequency, accessible explanation, and emergency-contact status (informational only). New supporter authentication is required; an email address alone is not authority. No inferred caregiver access from the existing profile email.

**Exact actions and autonomy.**

1. **L0:** Explain available permissions and simulate exactly what the recipient would see.
2. **L1:** Recommend the least-privilege capsule matching the user's stated task and warn about sensitive fields.
3. **L2:** Draft the invitation, scope, expiry, and plain-language consent receipt.
4. **L3:** After a final “who/what/can do/until when” confirmation, create a revocable grant and send an invite. Verify recipient acceptance before sharing; record every view/suggestion and notify the user in-app. Recipient suggestions remain pending until user approval.
5. **L4:** Only if pre-authorized, send bounded task reminders to the recipient within frequency/quiet-hour limits until completion or expiry. No scope expansion, clinical communication, emergency escalation, or new recipient is permitted. Pause/revoke is immediate and visible.

**Confirmation, handoff, emergency boundary.** Use double confirmation for sensitive domains and a “show me as recipient” preview. The older adult remains the decision-maker unless independently verified legal authority requires a different workflow; that workflow needs qualified legal/privacy design. A caregiver cannot mark an emergency resolved. The system is not monitored and must display deterministic emergency instructions when relevant.

**Repository-tied implementation.** The current caregiver email and SendGrid code are reusable only as delivery plumbing after remediation. Add `Users`, grants, invitations, task responses, and append-only audit collections with owner-scoped rules and server-side authorization on every read/write. Build one canonical Functions backend with typed tools and idempotent invites. The model outputs only a proposed scope from an allowlist; policy code intersects it with user choices and can only reduce, never expand, access.

**Accessibility and non-voice fallback.** Plain-language permission cards, one concept per screen, examples of visible/hidden data, read-aloud plus full text, large revoke button, no time pressure, printable consent receipt, and assisted setup that never hides the user's confirmation step. Supporters receive an accessible web view rather than requiring the older adult to troubleshoot an app install.

**Risks, limitations, dependencies, measurable outcome.** Coercion, abusive relationships, recipient misidentification, accidental oversharing, confusing legal status, and digital exclusion are central risks. Add private revoke, suspicious-activity alerts, no covert access, recipient verification, scope expiry, and research with privacy-sensitive users. **Dependencies:** new permissioned **messaging** and identity workflow; optional later EHR/calendar; no sensor/pharmacy/wearable. **Measures:** task completion with no scope violations; grants narrowed before approval; revocation time; unauthorized-access attempts; recipient identity failures; user comprehension of scope; oversharing incidents; percentage choosing no caregiver access (a valid success outcome).

**MVP vs later.** **MVP:** one medication-spelling or transportation-planning task, read/suggest only, authenticated recipient, 14-day maximum, in-app audit/revoke; no L4. **Later:** more task types and bounded reminders only after abuse-safety, legal/privacy, accessibility, and authorization testing. EHR proxy access is a separate future program, not inherited from this capsule.

## 5. After-Visit Closed Loop

**Value proposition.** Turn a user-provided after-visit summary into a verified “what I understood, what I need to do, and what I need to ask” checklist, then follow up without changing clinical instructions.

**Primary user and concrete story.** After a visit, a user photographs a printed summary. The agent extracts three candidate items but shows the source text beside each. The user fixes a date, marks one instruction unclear, approves a calendar reminder for a lab, and drafts a clarification message rather than guessing.

**Problem and why an agent is warranted.** Long, inconsistent documents and multiple instructions impose memory and literacy burden. Deterministic document parsing, dates, and reminder rules should control actions; an agent is useful for structuring varied language, asking for confirmation, translating to plain language without changing meaning, and identifying ambiguities for human clarification. This is document assistance, not clinical interpretation.

**Inputs.** Required: user-uploaded/photo document or pasted text, source/date/clinic, explicit permission to process, and confirmation of every extracted item. Optional: preferred language, due dates, appointment information, and selected supporter. Later optional: read-only EHR document import, pharmacy information, calendar, and secure clinical messaging. Images should be deleted after verified extraction by default; retention requires a separate choice.

**Exact actions and autonomy.**

1. **L0:** Extract candidate tasks, dates, contacts, and unclear passages with page/line provenance and extraction confidence; summarize only user-confirmed items.
2. **L1:** Suggest clarifying a missing/contradictory date or asking the clinician/pharmacist; never choose a clinical interpretation.
3. **L2:** Draft checklist items, calendar events, and a clarification message with source text attached.
4. **L3:** After per-item approval, save tasks/create reversible reminders/export or send the approved message; verify each action independently and show failures without marking them complete.
5. **L4:** Pre-authorized reminders may recur for confirmed non-medication tasks inside an expiry and quiet hours. L4 may not alter directions, infer adherence, escalate to a caregiver, or repeatedly message a clinic. Missed medication-related tasks prompt the user to contact a professional; they do not trigger dosing advice.

**Confirmation, handoff, emergency boundary.** Side-by-side source verification is mandatory; low-confidence extraction cannot become an action. Recipient and content are confirmed immediately before sending. The agent never converts “as needed,” conditional, or medication instructions into a schedule without explicit professional clarification. Deterministic emergency guidance bypasses the model; this is not an emergency or adherence monitor.

**Repository-tied implementation.** Reuse camera patterns, report/checklist UI, speech reader, Firebase Auth/Functions, scheduled-function seam, and SendGrid only after security remediation. Create typed `extractDocument`, `confirmTask`, `createReminder`, `cancelReminder`, and `sendApprovedDraft` tools. Isolate untrusted document text from system instructions, use malware/type/size checks, structured extraction with provenance, per-item confirmation, short retention, and redacted logs.

**Accessibility and non-voice fallback.** Camera is optional; paste, upload, manual entry, and supporter-assisted scanning are equivalent paths. Provide zoomable source image, high-contrast extracted text, screen-reader alternative, language-preserving plain-language explanation, keyboard navigation, and printed checklist. Never require audio.

**Risks, limitations, dependencies, measurable outcome.** OCR errors, changed meaning, wrong dates, document prompt injection, privacy exposure, reminder fatigue, and duplicate tasks. **Dependencies:** existing camera; optional/new document OCR third party; later **EHR**, **pharmacy**, **calendar**, and **messaging**; no wearable. **Measures:** extraction correction rate by field; source-provenance coverage; confirmed tasks completed or clarified; wrong/duplicate reminder rate; message cancellation rate; user comprehension via teach-back question; document deletion success; any unapproved external action (must be zero).

**MVP vs later.** **MVP:** pasted text/manual task capture, source-linked draft checklist, local reminder after approval; no OCR, EHR, or clinical messaging. **Later:** constrained photo extraction pilot, then read-only EHR import and user-approved messaging only with partner and clinical validation.

## 6. Door-to-Door Mobility Plan

**Value proposition.** Translate the user's mobility preferences and a specific destination into a practical access checklist—transport, walking distance, rest stops, entrance questions, and backup plan—without scoring fall risk or continuously tracking them.

**Primary user and concrete story.** A user who uses a walker and worries about uneven surfaces is going to a clinic. They enter the address and choose “avoid stairs” and “I need a place to sit.” The agent drafts questions to call the clinic, a leave-by reminder, and a printable backup checklist. It does not claim the route is safe.

**Problem and why an agent is warranted.** Generic directions omit personal access constraints, while the present questionnaire captures mobility aids/challenges/fall concerns. Deterministic map and schedule data should supply facts; the agent is useful for turning user preferences and incomplete third-party data into a cautious plan, exposing unknowns, and drafting verification questions. CDC STEADI and USPSTF guidance reinforce that fall prevention involves structured assessment and interventions, not an AI “safe route” prediction [S10, S11].

**Inputs.** Required MVP: manually entered destination/date, mobility aid/challenges, transport mode, maximum comfortable walking segment (user preference, not clinical limit), steps/curb/seating preferences, and backup contact choice. Optional one-time location, appointment time, weather sensitivity, and user-confirmed venue facts. Later optional: maps, transit accessibility, paratransit, weather, and venue accessibility data. No background location, gait inference, accelerometer, fall detection, or wearable feed.

**Exact actions and autonomy.**

1. **L0:** Summarize the user's selected constraints and distinguish known, inferred, and unknown route facts.
2. **L1:** Suggest a checklist and verification questions (“Is the accessible entrance open at 3 PM?”), plus conservative timing options.
3. **L2:** Draft a plan, call script/message, backup plan, and reminder.
4. **L3:** After approval, save/print/share the plan or create a reminder; verify the artifact/action and provide undo. The agent cannot book paid transport in the MVP.
5. **L4:** **Deferred.** A future narrow authorization could refresh weather/transit facts and notify the user of a material change. It may not track the user, declare a route safe, contact a caregiver, or purchase/rebook transport.

**Confirmation, handoff, emergency boundary.** The user confirms destination, route facts, recipient, and any reminder. If a supporter receives the plan, only logistics selected by the user are shared. The plan states that accessibility data can be stale and does not replace professional fall assessment. It is not fall detection or emergency response; urgent or post-fall language invokes reviewed deterministic guidance.

**Repository-tied implementation.** Reuse Mobility responses, optional one-time geolocation, report export, and notification seams. MVP uses manual venue facts and no external route service. Later put maps/weather/transit calls behind authenticated Functions adapters, minimize coordinates, avoid model access to raw OAuth/API credentials, attach source timestamps, and expire location data. A deterministic rules layer prevents words such as “safe,” “risk-free,” or “approved route” in generated plans.

**Accessibility and non-voice fallback.** Make a linear, printable plan with large targets, full keyboard/touch controls, no map-only presentation, written turn/access descriptions, adjustable detail, and explicit “unknown—call venue” states. Do not require speech, geolocation, smartphone use while walking, or color perception.

**Risks, limitations, dependencies, measurable outcome.** Stale/incomplete accessibility data, false confidence, location privacy, rural service gaps, weather changes, and burden of verification. **Dependencies:** existing optional geolocation; later maps/weather/transit third parties and optional calendar/messaging; explicitly **no wearable or new sensor**. **Measures:** plans that expose unknowns rather than invent facts; venue facts verified; reported confidence without increased unsafe-route claims; appointment arrival/missed-visit self-report; geolocation opt-out and deletion; stale-data incidents; user cancellations due to plan burden.

**MVP vs later.** **MVP:** user-entered destination and constraints, verification checklist, print/share, no route claims and no external data. **Later:** sourced accessibility/weather/transit facts and L4 material-change alerts after a limited geographic pilot. Do not build continuous tracking or automatic fall detection.

## 7. Quiet Rescue Mode

**Value proposition.** When a user appears stuck inside the questionnaire, quietly offer a smaller, reversible path—explain, show an example, save for later, or switch input mode—without analyzing behavior outside the session.

**Primary user and concrete story.** A user repeatedly opens and closes a medication-frequency field. A small card asks, “Would one of these help?” They choose “Show an example,” then “I’m not sure—save for later.” The form preserves progress and explains what remains; no caregiver is notified.

**Problem and why an agent is warranted.** Abandonment can reflect confusing language, motor difficulty, uncertainty, or interruption. Deterministic rules should detect only coarse in-session friction (repeated validation error, long idle time, repeated backtracking) and should first offer fixed accessible controls. The agent's narrow role is to explain the specific question using the schema and existing answers, adapt detail, and summarize a bookmark. If testing shows fixed help performs as well, remove AI; this concept must not become generic chat or covert cognitive assessment.

**Inputs.** Required: current field/schema, validation state, save status, and local session event counters. Optional: user-selected help style, text size, speech preference, and “do not offer again.” No raw keystroke logging, voice/acoustic analysis, camera, health inference, cross-site behavior, or persistent “confusion score.” Event counters expire at session end unless the user saves a bookmark.

**Exact actions and autonomy.**

1. **L0:** Explain the current question, why it is asked, accepted response forms, and existing answer, using only approved schema content.
2. **L1:** Recommend one of four deterministic recovery options: example, simpler wording, alternate input, or save/skip for now.
3. **L2:** Prepare a bookmark with the unresolved question and a user-editable note, or a draft answer only when the user explicitly dictates/types its content.
4. **L3:** After approval, save the bookmark/draft and return the user to the chosen location; verify persistence and show Undo. It may not invent an answer, mark a section complete, or dismiss validation silently.
5. **L4:** **Not allowed.** No recurring monitoring, behavioral profiling, caregiver alert, or inferred cognitive-status action.

**Confirmation, handoff, emergency boundary.** The offer is dismissible and can be disabled. User confirms any saved content. There is no caregiver/clinician handoff unless the user separately chooses share/export. The mode does not detect cognitive impairment or emergencies; explicit urgent text uses the same reviewed deterministic emergency boundary as the rest of the app.

**Repository-tied implementation.** Reuse generic question rendering, speech input/read-aloud, section navigation, focus movement, and live regions. First make saving reliable and add true draft/completion semantics. Build deterministic friction triggers and fixed recovery UI before any model call; a constrained server prompt can paraphrase only approved field help. Store neither raw interaction traces nor model-derived user traits.

**Accessibility and non-voice fallback.** This is itself an accessibility feature: one help choice per large button, consistent placement, no countdown, text and speech parity, preserved focus, error summary, “not sure” option, and offline fixed-help fallback. Validate with screen readers, 200–400% zoom/reflow, hearing loss, reduced dexterity, low literacy, and cognitive accessibility—not just automated WCAG checks [S2, S14].

**Risks, limitations, dependencies, measurable outcome.** Patronizing prompts, false “stuck” detections, distraction, sensitive interaction telemetry, and AI added where ordinary UX is enough. Default to low frequency, local counters, clear disclosure, no profiling, and A/B comparison against non-AI help. **Dependencies:** no new sensors/EHR/pharmacy/calendar/messaging/wearable/third party. **Measures:** task completion and time after rescue; prompt dismissal/disable rate; wrong-trigger rate; save recovery success; answer correction rate; perceived dignity/control; model-vs-fixed-help incremental benefit. If AI shows no material benefit, retain only deterministic help.

**MVP vs later.** **MVP:** fixed contextual help, save-for-later, input switching, reliable persistence, and anonymous aggregate evaluation—no AI. **Later:** a constrained paraphrase/clarification agent only if co-design and controlled testing demonstrate added value without increased errors or discomfort.

## Portfolio-level filters and explicit rejections

### Recommended discovery order

1. **Four-M Change Lens** — strongest project fit and no external dependency; begin only after immutable snapshots and security foundations.
2. **Appointment-Aware Visit Pack (manual appointment MVP)** — tangible outcome with low integration burden; calendar L4 later.
3. **Medication Truth Table (manual, source-provenance MVP)** — high value but requires clinical/pharmacy validation and stronger safety controls.
4. **Quiet Rescue Mode (deterministic MVP)** — directly addresses completion burden; AI is conditional on incremental evidence.
5. **Consent Capsule Care Circle** — differentiated and autonomy-preserving, but authorization, identity, coercion, and legal design make it later-stage.
6. **After-Visit Closed Loop** — promising but OCR/EHR/message actions create a broad safety and integration surface; start with pasted text in a research pilot.
7. **Door-to-Door Mobility Plan** — useful for a subset of users, but third-party accessibility data are incomplete; manual checklist first and geographically bounded later pilot.

This is an innovation shortlist, not a final portfolio ranking. Phase 3–5 review should be free to merge, defer, or reject any item.

### Rejected novelty

- **Passive gait/fall prediction from phone or wearable data — reject.** It adds surveillance, new sensors/wearables, validation burden, false reassurance/alarms, and an emergency-response expectation the app cannot meet. Evidence for fall-prevention interventions does not validate this product as a predictor [S10, S11].
- **Voice-based cognitive or mood diagnosis — reject.** Acoustic inference is invasive, bias-prone, clinically overreaching, and unrelated to reliable questionnaire completion. Speech remains an input/output accommodation only.
- **Always-on location or “caregiver peace-of-mind” tracking — reject.** It shifts value from the older adult to a watcher, creates coercion/abuse risk, and is unnecessary for a user-requested trip plan.
- **AI chooses which medicine record is correct or adjusts a regimen — reject.** Source conflict is a reason for pharmacist/clinician clarification, not model arbitration [S3, S4].
- **Autonomous EHR messaging/appointment booking/transport purchasing — reject for this roadmap.** These actions carry cost, clinical/workflow, identity, and cancellation consequences; a draft-plus-confirm pattern captures most value with less risk.
- **Emotion/avatar companion, streaks, badges, and synthetic “family voice” — reject.** These are engagement demonstrations without a defined 4Ms outcome and can manipulate or infantilize users.
- **Digital twin or “future decline” score — reject.** The repository has sparse self-report snapshots and no validated model or clinically governed response pathway.

## Cross-cutting MVP gates

No innovation above should reach user data until all of the following are complete:

1. Revoke the exposed credential; remove sensitive values from history where feasible; redact logs.
2. Replace deployed Firestore rules with owner-scoped rules; authenticate and authorize every endpoint/tool call; remove the public all-user reminder trigger.
3. Consolidate the two backends; separate untrusted questionnaire/document text from model instructions; validate structured outputs and prohibit direct model writes.
4. Add granular consent/delegation, recipient verification, timezone/quiet hours, rate limits, idempotency, action status, undo/revoke, append-only user-visible audit, retention/deletion/export, and incident controls.
5. Fix swallowed save errors, establish immutable assessment snapshots and true draft/completion state, user-scope local storage, and correct medication-scan semantics.
6. Create deterministic, clinician-reviewed emergency and medication boundaries; test prompt injection from free text, scans, documents, email, and third-party responses.
7. Co-design and usability test with diverse older adults, including low vision, hearing loss, reduced dexterity, mild cognitive impairment/high memory burden, low health/technology literacy, intermittent connectivity, and privacy-sensitive users. WCAG 2.2 is a floor, not proof of usability [S2].

## Sources

All web sources were accessed **2026-06-17**. Direct links are provided; statements above do not extend a source beyond the population, intervention, or outcome it studied.

- **[S1]** Institute for Healthcare Improvement. [Age-Friendly Health Systems](https://www.ihi.org/partner/initiatives/age-friendly-health-systems). Official 4Ms framework overview.
- **[S2]** W3C. [Web Content Accessibility Guidelines (WCAG) 2.2](https://www.w3.org/TR/WCAG22/). Normative accessibility recommendation.
- **[S3]** Redmond P, et al. [Impact of medication reconciliation for improving transitions of care](https://pubmed.ncbi.nlm.nih.gov/30136718/). *Cochrane Database of Systematic Reviews*. 2018.
- **[S4]** Anderson LJ, et al. [Effect of medication reconciliation interventions on outcomes: A systematic overview of systematic reviews](https://pubmed.ncbi.nlm.nih.gov/31789354/). *American Journal of Health-System Pharmacy*. 2019.
- **[S5]** Schwarze ML, et al. [Effectiveness of a Question Prompt List Intervention for Older Patients Considering Major Surgery: A Multisite Randomized Clinical Trial](https://pubmed.ncbi.nlm.nih.gov/31664452/). *JAMA Surgery*. 2020.
- **[S6]** Wolff JL, et al. [Shared Access to Patient Portals for Older Adults: Implications for Privacy and Digital Health Equity](https://pubmed.ncbi.nlm.nih.gov/35507405/). *JMIR Aging*. 2022.
- **[S7]** Gleason KT, et al. [A Multisite Demonstration of Shared Access to Older Adults' Patient Portals](https://pubmed.ncbi.nlm.nih.gov/39998827/). *JAMA Network Open*. 2025.
- **[S8]** Centers for Medicare & Medicaid Services. [Blue Button 2.0](https://bluebutton.cms.gov/). Official beneficiary-authorized Medicare Part A, B, and D claims API overview.
- **[S9]** Office of the National Coordinator for Health Information Technology. [Health Level 7 (HL7) Fast Healthcare Interoperability Resources (FHIR)](https://www.healthit.gov/topic/standards-technology/standards/fhir). Official interoperability overview.
- **[S10]** Centers for Disease Control and Prevention. [About STEADI](https://www.cdc.gov/steadi/about/index.html). Official older-adult fall-prevention framework.
- **[S11]** U.S. Preventive Services Task Force. [Falls Prevention in Community-Dwelling Older Adults: Interventions](https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/falls-prevention-community-dwelling-older-adults-interventions). 2024 recommendation.
- **[S12]** National Institute of Standards and Technology. [AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework). Official AI risk-governance framework; supports the proposed validation, monitoring, and accountability posture.
- **[S13]** U.S. Department of Health and Human Services. [Personal Representatives](https://www.hhs.gov/hipaa/for-individuals/personal-representatives/index.html). Official overview of HIPAA personal representatives; applicability requires qualified legal/privacy review.
- **[S14]** Office of Disease Prevention and Health Promotion. [Health Literacy in Healthy People 2030](https://odphp.health.gov/healthypeople/priority-areas/health-literacy-healthy-people-2030). Official definitions emphasizing people's ability to find, understand, and use information and organizations' responsibility to support that ability.

