# Phase 4C — Red-Team Product Critic

**Prepared:** 2026-06-17  
**Scope:** Normalized candidates N1–N12; product criticism only; no application changes  
**Inputs reviewed:** master discovery prompt, validated Phase 1 repository context, all four Phase 2 specialist reports, normalized candidate pool, and Phase 3 Persona Council

## Executive red-team verdict

The twelve-candidate catalog overstates the size of the useful portfolio. It is largely one missing product foundation, two plausible user outcomes, and several later workflows sharing the same summarization, confirmation, reminder, export, and permission machinery.

- **N2 is worth building, but principally as ordinary accessibility and reliability engineering, not as an AI agent.** Reliable save/resume, one-question mode, visible errors, predictable focus, and fixed contextual help are the broadest-benefit work.
- **N3 and N4 are the only defensible near-term AI-assisted product outcomes.** Even these should use AI narrowly: N3 may compress free text after deterministic checks; N4 may phrase a bounded agenda after the user chooses priorities. Neither should explain clinical meaning.
- **No L2–L4 capability is ready for current production data.** The repository has overly broad Firestore access, unauthenticated APIs, sensitive logging and browser storage, an exposed credential, suppressed save errors, scanner false-success behavior, unsafe default caregiver reminders, duplicate backends, and no typed action, consent, delegation, idempotency, audit, or undo layer (`firebase-security-rules.txt:5-15`; `functions/index.js:243-396,464-557`; `src/components/AIChatbot.jsx:45-65,518-570`; `src/services/questionnaireService.js:428-442`; `src/services/drugLookupService.js:151-198`).
- **Do not call foundational repairs “agent capabilities.”** Authentication, authorization, autosave/recovery, accessible controls, deterministic validation, notification scheduling, retention, and audit are product obligations. AI adds risk rather than value to most of them.
- **Do not use Phase 3 totals as evidence of efficacy.** The council explicitly scored adjusted concepts under assumed prerequisites. No source establishes that these AI workflows improve 4Ms completion, care quality, or health outcomes.

### Disposition summary

Each candidate receives exactly one portfolio disposition.

| ID | Candidate | Disposition |
|---|---|---|
| N1 | Assisted Narrative-to-Form Draft | **MERGE** |
| N2 | Guided Completion and Recovery Companion | **KEEP** |
| N3 | Plain-Language Readback and Readiness Check | **KEEP** |
| N4 | What-Matters-Led Visit Preparation Packet | **KEEP** |
| N5 | Medication List Verification and Question Prep | **DEFER** |
| N6 | Longitudinal 4Ms Change Review | **DEFER** |
| N7 | Consent-Governed Care Circle Task | **DEFER** |
| N8 | What-Matters Goal and Reminder Steward | **MERGE** |
| N9 | After-Visit Follow-Through Organizer | **DEFER** |
| N10 | Local Support Navigator and Warm Handoff | **DEFER** |
| N11 | Door-to-Door Mobility Plan | **REJECT** |
| N12 | Shared-Decision Conversation Builder | **MERGE** |

## Candidate-by-candidate attack

### N1. Assisted Narrative-to-Form Draft

**Disposition: MERGE**

**Why:** Semantic extraction from a narrative is a real model task, but the proposed standalone capability is optimized for a compelling demonstration rather than a proven reduction in work. The user first produces or corrects a transcript, then reviews source spans, field destinations, normalized values, and individual approvals. For short structured questions, that can require more attention, memory, and motor effort than answering the form. Speech is not a universal shortcut: the cited evidence is task-dependent, and evidence for voice agents supporting people with memory impairment remains limited ([speech-versus-keyboard study](https://pubmed.ncbi.nlm.nih.gov/32442129/); [voice-agent memory-impairment review](https://pubmed.ncbi.nlm.nih.gov/35468084/)).

The product also duplicates N2's confirmed answer-writing flow and N3's provenance/correction flow. Its durable components are an optional input method and a shared source-linked proposal card, not a separate agent. The current browser speech stack and cloud model path do not establish transcription accuracy across accent, speech impairment, language, device, or noise conditions. Supporting multilingual extraction, raw-audio policy, model retention disclosure, offline drafts, evaluation datasets, and error appeals introduces costs omitted by the attractive “say it once” story.

False positives can place an incorrect aid, fall concern, medication detail, or personal priority into the record; false negatives can silently omit context. Per-field confirmation reduces harm but also consumes the benefit. A fluent mapping and a high confidence label may still induce automation bias.

**Narrower revision:** Fold an opt-in **typed narrative draft** into N2/N3 after their correction pattern exists. Limit the first pilot to one proposal at a time in What Matters and Mobility; show the exact source span and destination; prohibit medication extraction, blanket approval, and raw-audio retention. Keep ordinary form entry adjacent. Run a comparative task study against direct form entry and remove the model path if it does not reduce completion time and corrections for the users intended to benefit.

### N2. Guided Completion and Recovery Companion

**Disposition: KEEP**

**Why:** The outcome is broadly useful, but calling it an AI companion obscures where the value comes from. Remaining-item counts, required/optional state, one-question presentation, checkpoints, last verified save, pending/offline state, retry, focus restoration, and resume are deterministic UI and state-machine work. The current app specifically needs that work: `saveSectionResponses` suppresses Firestore failures, the review screen does not complete a session, progress can exceed 100%, and the repository has no established offline or cross-device recovery (`src/services/questionnaireService.js:428-459`; `src/views/Questionnaire/Questionnaire.jsx:115-165`; `src/views/Questionnaire/ReviewSubmit.jsx:375-397`).

The hidden risk is “help” becoming behavioral surveillance. Repeated clicks, idle time, navigation patterns, or errors do not establish confusion or cognitive impairment. False-positive intervention is patronizing and disruptive; false-negative detection strands the user. Mode switching can itself disorient a person with low vision, motor limitations, or high memory burden. A chat exchange is also worse than persistent labeled controls when the user needs predictable recovery.

The proposed AI value—interpreting “this page is too busy” or paraphrasing a question—is narrow and unproven. It should not delay the fixed help flow and should not introduce a provider dependency into the recovery path. WCAG 2.2, cognitive-accessibility guidance, and older-adult co-design support clear purpose, consistent help, error prevention, focus, target size, and memory support; they do not support inferred cognitive profiles ([WCAG 2.2](https://www.w3.org/TR/WCAG22/); [W3C cognitive guidance](https://www.w3.org/TR/coga-usable/)).

**Narrower revision:** Ship a user-invoked, fully deterministic **Completion and Recovery Mode**: verified save status, exact resume point, one-question view, fixed help examples, “not sure,” skip, stop, retry, and return to full view. Process only coarse session counters locally, expire them, disclose any trigger, and provide “do not offer again.” Add AI paraphrase only after an A/B comparison shows better comprehension without more errors, time, or dismissals. Do not market the base feature as AI.

### N3. Plain-Language Readback and Readiness Check

**Disposition: KEEP**

**Why:** This has a defensible user outcome: catch errors before a person creates or shares a report, and make correction easier. It also supplies the provenance and correction pattern that N4 and most later concepts need. However, most “readiness” work—missing fields, type/range checks, exact duplicates, progress anomalies, unverified scans, and source links—is deterministic. A generic LLM summary is not an agent; it becomes product value only when every claim is source-bound and correction closes the loop.

The largest hidden burden is review fatigue. A second representation of every answer can double the work, particularly for users with low vision, high memory burden, or low health literacy. Repeated “conflict” questions can feel accusatory. False-positive conflict flags can pressure a person to erase two facts that are both true. False-negative summary omissions can create false confidence that the record is complete. A polished paraphrase may also look clinically validated when it is only a reformulation of self-report.

N3 overlaps heavily with N4. There must be one canonical confirmed-data representation: N3 owns review, sources, and correction; N4 consumes only the chosen, version-matched result. Parallel summaries would create disagreement about which wording is authoritative.

**Narrower revision:** Start with a deterministic field-by-field readiness list and no model requirement. Use AI only to shorten free text in What Matters and Mobility, with sentence-to-field/source-span validation. Ask at most three high-precision clarifications, always offer “keep both” and “do not ask again,” and say “summary of what you entered,” never “accurate assessment.” No score, medical meaning, diagnosis, urgency conclusion, or comprehension test. The no-AI view must remain the same first-class correction path.

### N4. What-Matters-Led Visit Preparation Packet

**Disposition: KEEP**

**Why:** This is the strongest durable output because it converts data already held by the app into an artifact the older adult can use outside the app. It fits the existing report, print, download, native-share, questionnaire-context, and 4Ms seams (`src/views/Questionnaire/ReviewSubmit.jsx:174-255`; `src/services/questionnaireService.js:555-663`). It also aligns with the 4Ms emphasis on What Matters without claiming that the app provides clinical care ([IHI Age-Friendly Health Systems](https://www.ihi.org/initiatives/age-friendly-health-systems)).

The red-team correction is that the existing app already exports a report. The incremental value must be proven as better preparation, not merely prettier generated prose. Generated questions can steer the visit; model-selected omissions can suppress what the person wanted to discuss; a polished page can imply clinician authorship. Editing, excluding private fields, checking sources, choosing a priority, choosing questions, and confirming export can become another form to complete.

N4 should not depend on N5 medication “verification,” N6 history, N7 delegation, N8 reminders, N12 decision aids, calendar OAuth, EHR delivery, or SendGrid. Making the flagship wait for those integrations would turn a plausible local artifact into an enterprise interoperability program. Direct clinician sending also creates wrong-recipient, delivery, record-ingestion, support, and compliance questions absent from the repository.

False positives include invented or overemphasized questions; false negatives include omitted priorities or concerns. Neither should be solved with opaque ranking. The person, not the model, chooses the lead priority and final content.

**Narrower revision:** Produce an editable accessible HTML/plain-text one-page packet only. Require one user-selected What Matters priority; include user-confirmed 4Ms statements, the current patient-entered medication list labeled as such, no more than three editable questions, optional access/communication needs, and blank notes space. Every generated item links to its source. Support local print/download; do not add email, EHR, calendar, automatic sharing, or automatic urgency ranking to the MVP. Measure whether users actually raised chosen topics, not downloads alone.

### N5. Medication List Verification and Question Prep

**Disposition: DEFER**

**Why:** The need is serious, but the name still risks promising verification the app cannot perform. Medication reconciliation and review are skilled clinical workflows using multiple sources; this app has only patient entry, uncertain lookup services, and no clinician/pharmacist role. The evidence supports discrepancy reduction as a possible workflow target, not a claim that the app determines a correct regimen or improves clinical outcomes ([medication review and reconciliation overview](https://pubmed.ncbi.nlm.nih.gov/33583002/); [Cochrane transitions-of-care review](https://pubmed.ncbi.nlm.nih.gov/30136718/)).

The repository's current scanner can return a non-medication UPC/Open Food Facts result and announce “Medication found and added” (`src/services/drugLookupService.js:151-198`; `src/components/MedicationScanner.jsx:137-141`). Building model normalization on that seam compounds rather than fixes the problem. Much of the safe MVP—missing name/dose/frequency, exact duplicate candidates, provenance labels, and “not sure”—is deterministic form validation.

The hidden user burden is substantial: similar names, formulations, strengths, source dates, dense comparisons, scanner correction, and field-level confirmation. Users with low vision, reduced dexterity, high memory burden, or low health literacy carry the most verification work. External RxNorm/openFDA availability, source licensing/terms, OCR, image retention, pharmacist review, evaluation datasets, incident handling, and ongoing data-source maintenance are real costs. EHR, claims, and pharmacy feeds are not present; claims or fill history would not prove current use even if acquired.

A false-positive match or duplicate may prompt unsafe self-change despite warnings. A false negative may leave a discrepancy unnoticed. A polished “confirmed” state creates false reassurance.

**Narrower revision:** After scanner correctness and clinical/pharmacy review, pilot a **Patient-Reported Medication List Quality Check**: manual entry first, missing-field checks, conservative exact/normalized duplicate candidates, source/date labels, original wording preserved, and a printable “questions for my pharmacist/clinician” list. Use “confirmed by you” and “needs professional verification,” never “verified” or “reconciled.” No OCR, interaction checking, regimen selection, dose inference, EHR/pharmacy import, reminders, or autonomous outreach.

### N6. Longitudinal 4Ms Change Review

**Disposition: DEFER**

**Why:** The repository currently stores one mutable `Answers/{uid}_4ms_health` record, so the feature's required evidence base—immutable, dated, version-compatible snapshots—does not exist (`src/services/questionnaireService.js:337-410,559-561`). Snapshot creation, retention, deletion, questionnaire-version mapping, offline conflict handling, and comparison are prerequisites, not implementation details.

The raw comparison is deterministic. AI summarization is generic and can create harmful salience by grouping unrelated changes or implying cause, decline, improvement, risk, or clinical significance. A change from 5 to 7 may reflect scale interpretation, mood, context, or entry error. A false positive can create anxiety or unnecessary escalation; a false negative can hide a change the user considered important. No model has evidence to decide which self-reported delta matters clinically.

This candidate depends on N3 for provenance/correction and largely feeds N4. A separate longitudinal agent, separate brief, and separate follow-up loop would duplicate representations and controls. Longitudinal storage also expands the privacy impact and deletion complexity. Repeated assessments and change confirmations add burden before recurring value is established.

**Narrower revision:** First build and validate explicit immutable snapshots and a user-initiated raw two-date diff. Show exact old/new values and dates, allow correction through linked amendments, and include “no meaningful change.” No scheduled check-in, trend score, chart-only view, risk language, caregiver alert, or AI causal grouping. Only after users have real history and demonstrate difficulty understanding the raw diff should a source-linked neutral summary be tested.

### N7. Consent-Governed Care Circle Task

**Disposition: DEFER**

**Why:** This is chiefly an identity, authorization, safeguarding, and support-operations program. AI is neither needed nor trustworthy for granting access. Translating “let my daughter help” into a scope may be convenient, but permission comprehension cannot be delegated to generated wording and the model must never expand authority.

The existing `caregiverEmail` is only a profile field, while current scheduled Functions send medication/mobility content without adequate opt-in, recipient scope, quiet hours, timezone, or revocation (`src/components/ProfileModal.jsx:65-72`; `functions/index.js:111-241,552-557`). There is no supporter account, verified identity, grant, expiry, per-field enforcement, attributed proposal queue, audit history, abuse report path, or lawful representative workflow. Implementing those safely requires new front- and back-office operations, privacy/legal/safeguarding review, security testing, account recovery, disputed-access handling, and accessible UX for both parties. Shared portal access literature identifies real support benefits and real privacy/equity concerns; it does not validate default delegation ([JMIR Aging shared-access review](https://pubmed.ncbi.nlm.nih.gov/35507405/)).

The older adult bears a long “who/what/action/expiry/recipient/review/revoke” flow, and the caregiver bears invitation, authentication, proposal, and status work. People with lower digital access may be most excluded. A false-positive sense of consent can disclose sensitive Mentation, medication, location, or narrative data; a false-negative authorization filter is a privacy incident. Coercion or a shared device can make nominal confirmation meaningless.

**Narrower revision:** Conduct an abuse-aware research prototype before production: one verified supporter, one predefined task, one domain, read/comment-only, fixed 14-day expiry, no recurring permission, no direct edit, no chat/location/Mentation access, and owner approval for every proposal. Permission text is professionally authored and tested, not generated. The product must treat “no supporter access” as a successful outcome and provide a private, immediate revoke path.

### N8. What-Matters Goal and Reminder Steward

**Disposition: MERGE**

**Why:** The broad concept is a generic coaching chatbot disguised as an agent. Turning “stay independent” into next steps can produce plausible but infeasible, moralizing, or service-dependent advice. The product does not know the person's finances, clinical restrictions, support availability, schedule, or local options. A reminder does not cure those gaps.

The useful part—create, schedule, deliver, pause, and delete a reminder—is deterministic and duplicates N2's resume workflow, N4's optional appointment preparation, and N9's future tasks. A separate steward creates another inbox, task state, audit history, cadence, and notification preference surface. The current scheduler is particularly unsafe as a starting point because it emails health content without adequate consent or recipient controls.

Natural-language time parsing can be useful but creates false-positive schedules (“after breakfast” interpreted at the wrong hour or timezone), duplicates, and quiet-hour violations. False negatives include undelivered reminders mistaken as received. Email/push/SMS provider costs, queue operations, deliverability, device permissions, timezone migration, customer support, and notification accessibility are omitted from the simple coach narrative. Repeated prompts place emotional and administrative burden on the older adult; copying a caregiver turns a reminder into surveillance.

**Narrower revision:** Merge one shared **deterministic task/reminder service** into N2 and N4. The initial use cases are one-time “resume my questionnaire” and “review my packet before my appointment.” Use an accessible date/time picker as the source of truth; an optional language parser may fill it, but the user confirms the absolute date, time, timezone, channel, and privacy-safe text. No open-ended goal decomposition, medication-dose reminder, streak, nonresponse escalation, caregiver copy, or recurring plan in the first release.

### N9. After-Visit Follow-Through Organizer

**Disposition: DEFER**

**Why:** Extracting actions from varied text is a legitimate model task, but the safe boundary between administrative and clinical instructions is not as clean as the proposal assumes. “Schedule lab,” “start therapy,” “return if symptoms worsen,” “take as needed,” and medication changes can combine dates, conditions, and clinical intent. The model can misclassify an item before the user even reaches confirmation.

The user must acquire, upload/paste, inspect, and retain the source; verify each extracted task and date; distinguish model wording from clinic wording; set reminders; and resolve ambiguity. That is a large post-visit burden for the people the feature claims to help. Side-by-side document review is also demanding for low vision, small screens, and high memory burden. New document storage, malware/file checks, OCR, provenance, retention/deletion, clinical evaluation sets, notification infrastructure, and support for changed instructions are substantial costs. EHR imports and clinical messaging are not available integrations.

The polished demo uses a clean document with obvious tasks. Real documents contain tables, templated advice, conditional instructions, medication lists, and contradictions. A false-positive date or action may cause harm; a false negative may omit a follow-up. Item confirmation cannot make a confusing source understandable, and a “plain language” paraphrase can change meaning.

N9 also duplicates N8's tasks/reminders and the visit lifecycle already centered on N4. It should not be added until the simpler workflow demonstrates use.

**Narrower revision:** Run a controlled pasted-text research pilot with an allowlist of purely administrative categories such as “call this office” or “bring this document.” Preserve the exact sentence, propose one task at a time, and route every medication, symptom-conditional, test-result, or unclear item to “ask the issuing clinic/pharmacist” without operationalizing it. Start with a printable manual checklist and no OCR, EHR, clinical messaging, caregiver assignment, or recurring reminders. Require clinician-reviewed precision/recall and harm-case evaluation before any action tool.

### N10. Local Support Navigator and Warm Handoff

**Disposition: DEFER**

**Why:** The scarce asset is not an agent; it is an accurate, maintained, regionally complete resource directory with eligibility, accessibility, cost, channel, hours, service area, and freshness data. The repository has browser geolocation and Nominatim reverse geocoding, not a provider directory or referral network (`src/components/AIChatbot.jsx:473-516`). Search and ranking on unreliable data create confident disappointment.

The largest costs are content operations and partnerships: data contracts or curation, listing verification, correction and quarantine, geographic coverage, language/accessibility metadata, human fallback, service-capacity changes, and outcome follow-up. Rural and low-income users may get the fewest or worst results, turning a seemingly inclusive feature into a disparity amplifier. Many services require phone contact, documents, repeated eligibility screening, transport, or waitlists; drafting one email does not complete a handoff.

The demo risk is very high: a hand-picked urban ZIP and cooperative services look impressive, while real no-result, stale-result, and inaccessible-channel rates remain hidden. False positives can expose sensitive information to an irrelevant service or falsely imply eligibility. False negatives can omit the only viable option. Ranking can encode geographic and socioeconomic bias.

**Narrower revision:** Only pilot with a funded regional partner that supplies a curated directory, named owner, freshness standard, correction route, and human navigation fallback. Ask for manual ZIP and explicit constraints; show no more than three source-dated options and honest “no maintained result.” Start with copy/call scripts, not automatic send, booking, or questionnaire disclosure. Measure no-result, stale-result, inaccessible-channel, and eligibility-failure rates by geography; stop expansion if disadvantaged users receive systematically poorer coverage.

### N11. Door-to-Door Mobility Plan

**Disposition: REJECT**

**Why:** The honest MVP is a fixed form and printable checklist. The user supplies destination, transport mode, mobility aid, walking preference, entrance facts, seating, and backup. Once external route facts are removed, AI has little to infer and no authority to declare the plan adequate. A well-designed Mobility checklist is useful, but it is not a distinct agent capability.

The richer version depends on maps, weather, transit/paratransit, venue accessibility, live availability, and potentially messaging or calendars. Those sources are incomplete, rapidly changing, geographically unequal, and often inaccessible themselves. They create vendor cost, location privacy, latency, outage, source reconciliation, and incident obligations. The current geolocation seam does not solve any of those problems.

The older adult must enter and verify many changing facts, contact venues, create a backup, keep the plan current, and potentially operate a device while traveling. Rural users may have no alternative route or service. A polished plan invites a “safe route” interpretation even with disclaimers. False-positive accessibility facts may expose a user to stairs, long walks, closed entrances, or missed care; false negatives may discourage a feasible trip.

**Narrower revision:** Do not build this as a standalone AI feature. Retain a small ordinary **Mobility Visit Checklist** inside N4: user-entered transport/entrance/seating needs, questions to verify, a backup contact, and print/download. Do not add live tracking, caregiver arrival alerts, route safety language, autonomous replanning, transport booking, or external maps/transit/weather automation in this roadmap.

### N12. Shared-Decision Conversation Builder

**Disposition: MERGE**

**Why:** The safe MVP—“what matters to me,” “what do I want to ask,” and “what do I not understand”—already belongs in N4. On its own, it is a generic conversational worksheet, not a distinct agent. The differentiated version, treatment-option comparison, requires complete, versioned, decision-specific evidence, risk communication, source governance, clinical ownership, accessibility of decision aids, and prospective evaluation. This project has none of that infrastructure.

Decision aids can improve knowledge and alignment, but that evidence applies to governed evidence-based aids, not model-invented options or paraphrases ([Cochrane decision-aid review](https://pubmed.ncbi.nlm.nih.gov/38284415/)). A model can omit an option, distort a probability, frame tradeoffs, or infer a preferred choice. False positives steer the user toward a perceived recommendation; false negatives hide a material harm or alternative. Users with low health literacy or high memory burden bear the greatest source-comparison work, while caregiver participation can displace the older adult's values.

Uploading or linking clinician materials also adds document security, licensing, versioning, citation alignment, and retention costs. “No source, no comparison” is safe, but leaves too little standalone value to justify another product surface.

**Narrower revision:** Merge a fixed, private **Values and Questions** section into N4. The older adult selects priorities, records uncertainties, and writes or edits up to three questions. Do not compare treatments, generate options, calculate individualized risks, rank choices, record consent, or send an acceptance. A future decision-specific integration should be a separately governed clinical research project using one qualified decision aid, not an extension of the general chatbot.

## Portfolio-level conflicts and cumulative burden

### One user, too many parallel representations

N1 drafts fields; N3 summarizes them; N4 summarizes them again for a visit; N5 normalizes medication entries; N6 summarizes changes; N9 extracts tasks; N12 summarizes values. If each creates its own wording and approval state, the user must decide which version is authoritative. The portfolio needs one canonical source model, one provenance display, one correction mechanism, and one approved packet renderer. Generated prose must never become a second health record.

### Confirmation can become the dominant task

“Human in the loop” is not automatically low burden. Across N1, N3, N4, N5, N7, N9, and N12, the older adult may review transcripts, mappings, summaries, conflicts, medication sources, packet inclusions, permissions, extracted tasks, times, recipients, and reminders. A portfolio that ships these together can require more verification than the original questionnaire. Set a cross-product confirmation budget: one item at a time, short batches, stop/resume, source shown in place, no repeated approval of unchanged facts, and a measured burden ceiling.

### Three reminder systems would compete for attention

N2 resume prompts, N4 appointment preparation, N6 check-ins, N8 goal reminders, N9 follow-up reminders, and N7 supporter reminders all target the same person. Independent cadences produce alert fatigue, quiet-hour conflicts, duplicates, and unclear ownership. There should be one preference center, one queue, one rate limit, one audit, and one privacy-safe notification template system. The portfolio should initially allow only one-time, user-created reminders.

### Caregiver value can quietly replace older-adult value

N7, N8, N9, N10, and N11 all offer paths to supporter participation. Together they can create a de facto caregiver dashboard despite each feature's local disclaimer. A caregiver email, missed response, Mentation answer, fall concern, or location must never create authority. Supporter involvement should remain absent from the near-term portfolio rather than becoming a shared dependency that delays the older-adult-controlled core.

### “No result” and failure states are the real product

N5 lookup disagreement, N6 incompatible snapshots, N9 ambiguous instructions, N10 no local service, N11 unknown accessibility, and N12 incomplete decision evidence are normal outcomes. If success metrics count only completed packets, sends, or contacts, product teams will pressure models to fill gaps. The system must reward unresolved, no-result, cancel, keep-as-written, and ask-a-professional outcomes when those are truthful.

### Data and operational scope accumulate faster than feature value

Taken together, the proposals add raw narratives, source spans, model outputs, snapshots, medication provenance, label images, appointment metadata, supporter identities and grants, reminders, after-visit documents, resource queries, destinations, decision materials, action proposals, and audit events. That materially expands breach impact, retention/deletion complexity, access-rule testing, model-provider exposure, and support obligations. “Data exists in the questionnaire” does not justify deriving and retaining every downstream artifact.

### Clinician and caregiver workload is externalized

Packets, pharmacist questions, supporter invitations, service inquiries, and clarification drafts create work for people outside the app. Provider acceptance does not mean reading or action. The roadmap lacks evidence that recipients want these artifacts, can ingest them, or can distinguish them from clinical records. Do not measure “sent” as a successful handoff.

### Accessibility cannot be an optional cross-cutting epic

Voice, camera, side-by-side comparisons, permissions, date pickers, PDFs, maps, and notifications each introduce distinct barriers. WCAG conformance alone will not establish usability for low vision, hearing loss, reduced dexterity, mild cognitive impairment/high memory burden, low literacy, or intermittent connectivity. Every cancellation, correction, failure, and revoke path must be as accessible as the primary path, with testing by affected users.

## What not to build

Do not build or brand the following in this roadmap:

1. A generic “medical advisor,” daily coach, or free-form chatbot with write/send/schedule tools.
2. AI-driven autosave, validation, accessibility adaptation, “stuck” or cognitive-state inference, or hidden behavioral scoring.
3. Medication reconciliation, interaction clearance, dose advice, regimen selection, adherence surveillance, OCR-driven medication scheduling, or autonomous pharmacy/clinician outreach.
4. Automatic caregiver emails, family dashboards, missed-response escalation, score-triggered sharing, or authority inferred from the existing caregiver email.
5. Model-only crisis, fall, or urgency classification; passive gait/fall detection; continuous location; “peace-of-mind” tracking; or route-safety claims.
6. EHR/pharmacy/claims imports, calendar OAuth, appointment booking, transport purchasing, clinical messaging, or broad resource search until a specific partner, owner, support model, and validation plan exist.
7. Treatment comparison, individualized risk calculation, “best option” recommendations, or model-generated decision aids.
8. Separate agents for form filling, review, visit prep, goals, follow-up, mobility, and decisions. Users need one coherent workflow, not a cast of agents.

## Minimal defensible portfolio

The red-team portfolio is deliberately smaller than the candidate catalog:

1. **N2 as non-AI foundation:** deterministic completion, one-question mode, verified save/resume, error recovery, accessible help, and no inferred impairment.
2. **N3 as the canonical review layer:** deterministic readiness checks, source-linked correction, and narrowly tested free-text compression with a no-AI fallback.
3. **N4 as the single outward artifact:** user-selected What Matters priority, confirmed statements, up to three questions, access needs, and local accessible print/download.

N1's text narrative input and N12's values/questions become optional parts of that flow. N8 contributes only the shared one-time reminder mechanism. N5, N6, N7, N9, and N10 remain separately gated future research. N11 is not a product candidate.

Before even this smaller portfolio handles real user data, complete the Phase 1 blockers: rotate/remove the exposed credential; owner-scope Firestore; authenticate and authorize every endpoint; narrow CORS; consolidate backends; redact logs; user-scope browser storage; fix save and scanner semantics; separate untrusted content from instructions; and add typed schemas, version checks, idempotency, consent, retention, audit, undo, and deterministic emergency boundaries.

## Evidence limits and decision tests

The cited research supports accessible, person-centered, source-aware design and strong clinical boundaries. It does not establish that these model-assisted features improve health outcomes or are superior to a well-designed form. The first evaluation question for every model call should therefore be: **does it outperform a deterministic alternative for the people who bear its correction burden?**

Required kill or narrowing tests:

- **N2:** if AI help does not beat fixed help on completion, error recovery, dignity, and burden, remove AI.
- **N3:** unsupported claims must be zero in the evaluation set; if source review takes longer or produces more errors than field review, retain deterministic review only.
- **N4:** require evidence that users raised their selected priorities and found the artifact usable; downloads, model ratings, and message count are insufficient.
- **N5/N9/N12:** any medication operationalization, omitted option, changed clinical meaning, or ungrounded source claim stops expansion.
- **N7:** any scope violation, unclear revocation, or inability to identify the acting party stops production use.
- **N10:** geographic, accessibility-channel, and rural no-result disparities must be visible and bounded before expansion.

The strongest product decision is restraint: repair the current app, prove that source-grounded review and one local visit artifact reduce burden, and decline the temptation to make every point in the care journey a separate AI agent.
