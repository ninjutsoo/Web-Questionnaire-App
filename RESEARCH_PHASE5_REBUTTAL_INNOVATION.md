# Phase 5 Rebuttal and Revision — “Wow but Useful” Innovation Scout

**Prepared:** 2026-06-17  
**Inputs reviewed:** `RESEARCH_PHASE3_PERSONA_COUNCIL.md`, `RESEARCH_PHASE4_ENGINEERING.md`, `RESEARCH_PHASE4_SAFETY.md`, `RESEARCH_PHASE4_RED_TEAM.md`, and `RESEARCH_NORMALIZED_CANDIDATES.md`  
**Scope:** Revision of the seven Phase 2D innovation proposals; no application changes.

## Revised position

The original innovation set was too broad for this repository and risked turning one questionnaire into seven overlapping agents, several duplicate reminder systems, and a large new sensitive-data estate. The reviews correctly identify that the durable near-term value is simpler:

1. reliable, accessible completion and recovery (**N2**, mostly non-AI);
2. a canonical source-linked review layer (**N3**, supplied by the wider portfolio); and
3. one older-adult-controlled, local visit artifact (**N4**).

Of the original seven ideas, only Quiet Rescue and Appointment-Aware Visit Pack contribute to that near-term flow, and both are materially narrowed. Medication comparison, longitudinal review, care-circle delegation, and after-visit extraction become separately gated research. Door-to-Door Mobility Planning is withdrawn as a standalone agent.

This is not a retreat from useful innovation. It is a correction from “many impressive automations” to one coherent, testable older-adult outcome: **complete the assessment reliably, understand what the app recorded, and bring a concise What-Matters-led packet to a visit without the app sending or interpreting clinical information.**

No revised MVP uses L4. The current application is not a safe execution substrate for L2–L4 until the Phase 1 blockers and Phase 4 common gates are complete.

## Decision summary

| Phase 2D proposal | Normalized ID | Revised position | Revised product boundary |
|---|---|---|---|
| Quiet Rescue Mode | N2 | **KEEP, merged and de-AI’d** | Deterministic, user-invoked completion/recovery foundation; AI survives only after comparative evidence |
| Appointment-Aware Visit Pack | N4 | **KEEP core; merge; withdraw appointment automation** | Local What-Matters-led packet after N3; no calendar, send, or L4 |
| Medication Truth Table | N5 | **DEFER to research/pilot; rename and narrow** | Patient-reported list quality check and question preparation; no “truth,” OCR, imports, or medication advice |
| Four-M Change Lens | N6 | **DEFER standalone; later merge output into N4** | Immutable snapshots and raw user-initiated two-date diff first; no AI trend narrative |
| Consent Capsule Care Circle | N7 | **DEFER outside core roadmap** | Separate abuse-aware delegation research program; fixed permissions, no generated consent, no L4 |
| After-Visit Closed Loop | N9 | **DEFER to controlled research** | Pasted-text administrative checklist only; no clinical operationalization, OCR, integrations, or recurring reminders |
| Door-to-Door Mobility Plan | N11 | **WITHDRAW as agent; merge a fixed checklist into N4** | User-entered access/logistics needs and questions only; no route data, safety claim, location, or automation |

## Response to portfolio-level criticism

### One canonical record and one outward artifact

**Concern accepted.** N5, N6, N9, and N11 could each create another paraphrased representation of the user's health information. The red team is correct that generated prose must not become a competing health record.

**Revision:** The questionnaire answers and immutable snapshots remain canonical. N3 owns the single source/provenance/correction pattern. N4 is the only near-term outward artifact. Any later N5, N6, or N9 output is a source-linked proposal and can enter N4 only after the user confirms it. There is no independent agent inbox or competing “approved summary.”

### Confirmation burden is a safety and accessibility metric

**Concern accepted.** “Human in the loop” can transfer model-verification labor to the older adult, especially for low vision, reduced dexterity, mild cognitive impairment/high memory burden, or low health literacy. Persona scores for N5, N7, N9, and N11 reflect this burden.

**Revision:** Use one item at a time, source in place, explicit Keep/Change/Not sure/Stop, verified save state, and resume without repeating unchanged confirmations. Each pilot must measure correction time and cognitive/interaction burden against the ordinary deterministic workflow. If verification consumes as much or more effort, the model portion is removed. A technically accurate model is not sufficient if users cannot efficiently detect its mistakes.

### One deterministic reminder service, but not in the first innovation MVP

**Concern accepted.** N2, N4, N7, and N9 originally implied separate reminders or recurring actions, while the repository's current reminder implementation is unsafe.

**Revision:** The near-term N2/N4 flow has no recurring reminder and no L4. If reminders are later approved, N8 contributes one shared deterministic service with one preference center, queue, rate limit, quiet-hours policy, audit, and cancellation truth. The first allowed uses are one-time “resume my questionnaire” and “review my packet”; no goal coaching, medication-dose reminders, caregiver copy, or nonresponse escalation.

### Supporter involvement is not a near-term shared dependency

**Concern accepted.** Caregiver paths across the portfolio could become a de facto caregiver dashboard and shift value away from the older adult. Shared-access research documents both support value and privacy/equity risk; it does not validate default delegation ([Wolff et al., 2022](https://pubmed.ncbi.nlm.nih.gov/35507405/)).

**Revision:** No near-term candidate depends on N7 or the existing caregiver email. N4 is owner-private and local by default. N7 is a separate safeguarding and authorization research program. “No supporter access” is a successful outcome, not a failure to engage.

### Honest unresolved and no-result states

**Concern accepted.** Medication conflicts, incompatible snapshots, ambiguous instructions, and unknown access facts are normal outcomes. Optimizing for completed actions would pressure a model to invent certainty.

**Revision:** `Not sure`, `Keep my wording`, `Incomparable`, `Needs professional clarification`, `Unknown—verify`, and `Cancel` are first-class results and success metrics. No feature is evaluated only by packets created, messages sent, or tasks completed.

### Data and external workload must earn their cost

**Concern accepted.** The original proposals accumulated label images, calendar metadata, supporter identities, documents, destinations, derived summaries, and audit events while creating work for clinicians, pharmacists, and caregivers.

**Revision:** Near-term work adds only the minimum state needed for verified save/recovery, source-linked review, and an optional packet revision/hash. No calendar OAuth, EHR/pharmacy/claims import, OCR image, supporter account, destination history, clinical messaging, or server-retained exported file is included. A “sent” or “exported” artifact never counts as clinician receipt, review, or action.

## Candidate revisions

## 1. Quiet Rescue Mode → N2 Guided Completion and Recovery Companion

**Revised position: KEEP, merge, and remove AI from the MVP.**

### Concerns addressed

- Persona Council: strongest cross-persona usefulness, but unsolicited help can annoy, mode changes can disorient, model dependence harms intermittent-connectivity users, and behavioral signals can become surveillance.
- Engineering: excellent fit at **M, 4–7 engineer-weeks**, but the real work is revision-safe save/read-back, exact checkpoints, conflict handling, focus, and offline/pending states—not a model.
- Safety: false “saved” status, overwrites, paternalism, and cognitive inference are the controlling harms.
- Red team: most value is ordinary accessible UX; AI must demonstrate incremental value over fixed help.

I accept all four findings. The Phase 2 framing made coarse friction sensing sound more agentic than it is. Reliable state and accessible recovery are the product.

### Revised MVP boundary

- **Included:** user-invoked one-question mode; deterministic remaining-item count; exact resume point; persistent Back/Save/Stop/Return controls; fixed four-choice help; `Not sure`; explicit optional/required labels; visible pending/failed/last-verified-save state; revision-safe server save and read-back; Retry/Copy/Return recovery; predictable focus; typed/touch/keyboard/screen-reader parity; deterministic offline help.
- **Excluded:** proactive “you seem stuck” prompts, persistent interaction timing, raw keystrokes, a confusion/frustration score, cognitive inference, caregiver status, auto-answer, auto-submit, silent validation bypass, and model-generated help.
- **Autonomy:** L0 fixed explanation; L1 deterministic recovery recommendation; L3 only for the user's explicit reversible navigation/save request after preview. No L2 model draft and no L4.
- **Kill test for AI:** Only after the deterministic MVP succeeds may a constrained paraphrase experiment run. Remove it unless it improves task completion or comprehension without increasing errors, correction time, discomfort, or subgroup disparity. The no-AI path remains first-class even if the test succeeds.

### Measurable decision gate

Proceed if save/read-back mismatch and unconfirmed writes are zero in the governed test set, recovery works across network loss and revision conflicts, and diverse older adults can stop/return/resume without mode disorientation. Model language has no roadmap dependency.

## 2. Appointment-Aware Visit Pack → N4 What-Matters-Led Visit Preparation Packet

**Revised position: KEEP the local packet, merge with N3/N12/N11, and withdraw calendar automation from the MVP.**

### Concerns addressed

- Persona Council: tangible value across personas, but the user must select the priority; output needs accessible HTML/plain text and large print; email, portal, and calendar access should not be initial dependencies.
- Engineering: strong fit after N3 at **M, 5–8 engineer-weeks**; current report/export seams are reusable, while accessible PDF and native-share success cannot be assumed.
- Safety: generated priorities/questions can steer, polished output can imply clinic review, and print/share can disclose sensitive information.
- Red team: the current app already exports a report, so the packet must prove better visit preparation rather than merely prettier prose. N4 must not wait for N5–N8, EHR, or calendar integrations.

I accept the criticism that “appointment-aware” overstates the safe differentiator. The useful capability is a user-curated visit packet, not calendar detection.

### Revised MVP boundary

- **Prerequisite:** N3's source-linked readback/correction pattern and a current verified answer revision.
- **Included:** accessible HTML/plain-text one-page packet; one user-selected What Matters priority; user-confirmed 4Ms statements; current medication entries labeled **patient-reported, not clinician-reconciled**; up to three user-written or editable drafted questions; optional communication/access needs; a small fixed Mobility Visit Checklist; blank notes; date/version and source links; include/exclude and remove/restore; local print/download after exact preview.
- **Merged content:** N12 contributes only a fixed private “What matters / What I do not understand / Questions I want to ask” section. N11 contributes only user-entered transport, entrance, seating/rest, communication needs, a question to verify, and an optional backup contact. Neither remains a separate agent.
- **Excluded:** calendar OAuth, event classification, scheduled packet generation, L4, email, EHR/portal send, automatic sharing, automatic appointment booking, automatic urgency ranking, generated treatment options, risk comparison, clinician-approved appearance, route/maps/weather/transit data, destination storage, and route-safety language.
- **Autonomy:** L0 source-linked preview; L1 no model priority recommendation; L2 bounded editable question draft only if source grounded; L3 local print/download after exact approval. No send and no L4.

### Measurable decision gate

Do not use download count as proof of value. Proceed only if older adults can identify and include their chosen priority, exclude sensitive fields, understand that the packet was not clinic-reviewed, and report using selected topics during a visit. Compare against the current report. If source checking or editing adds more burden without better preparedness, keep the simpler deterministic report template.

## 3. Medication Truth Table → N5 Patient-Reported Medication List Quality Check

**Revised position: DEFER to pharmacist-governed research/pilot and retire the “truth table” name.**

### Concerns addressed

- Persona Council: high value for multi-medication users, but dense comparisons, cameras, similar names, and per-field verification reduce inclusive reach and can create false certainty.
- Engineering: technically feasible but **L/XL, 10–16 engineer-weeks after foundations**, with Low/Medium confidence and ongoing terminology/source maintenance.
- Safety: Research/pilot only. Misidentification can change medication behavior; the output must never imply reconciliation, correctness, interaction checking, or safety.
- Red team: the current scanner's food/UPC false-success behavior makes it an unsafe foundation; most safe checks are deterministic; claims/EHR/pharmacy feeds would still not prove current use.
- Evidence: reconciliation research supports discrepancy reduction as a possible workflow target but does not establish that this app can determine a correct regimen or improve clinical outcomes ([Cochrane review](https://pubmed.ncbi.nlm.nih.gov/30136718/)).

I accept that “Truth Table” is misleading. No source available to this app is ground truth.

### Revised research MVP boundary

- **Preconditions:** scanner false-success fixed independently; pharmacist owns terminology rules, copy, evaluation corpus, error thresholds, and stop conditions; Phase 4 security gates complete.
- **Included:** manual entry first; missing name/dose-text/frequency checks; original wording, author, source, and date preserved; conservative exact/normalized duplicate candidates; one medicine at a time; `Not sure`, `Keep my wording`, and unresolved states; printable questions for a pharmacist/clinician.
- **Labels:** “Patient-reported,” “Confirmed by you,” and “Needs professional verification.” Never “verified,” “correct,” “safe,” “reconciled,” or “interaction checked.”
- **Excluded:** OCR, label-image retention, UPC/Open Food Facts as medication proof, regimen selection, dose/frequency inference, interaction or appropriateness checking, adherence inference, claims/EHR/pharmacy import, refill or substitution, reminders, and autonomous outreach.
- **Autonomy:** L0 provenance display; L1 deterministic incompleteness/duplicate-candidate notice; L2 neutral question draft; L3 only a separately confirmed correction to the user's own list in the controlled pilot. No L4.

### Measurable decision gate

Pharmacist-adjudicated false match/merge/split, user correction burden, unresolved rate, subgroup coverage, and any self-reported medication behavior change are controlling metrics. Any dangerous merge, unsupported implied certainty, or user change based on the app stops expansion. If normalization cannot meet the agreed conservative threshold, retain manual provenance and question preparation only.

## 4. Four-M Change Lens → N6 Longitudinal 4Ms Change Review

**Revised position: DEFER as a standalone feature; build data prerequisites first and later merge useful output into N4.**

### Concerns addressed

- Persona Council: useful second-wave continuity support, but only after immutable snapshots; exact dates, raw values, and `No meaningful change` are essential.
- Engineering: **M/L, 6–10 engineer-weeks** after snapshot/data foundations. The current mutable `Answers` record cannot support valid history.
- Safety: proceed only with mandatory safeguards; ordinary variation or schema changes can be misframed as decline, improvement, risk, or cause.
- Red team: deterministic comparison does the real work, the feature duplicates N3 and feeds N4, and longitudinal retention expands privacy and deletion complexity.

I accept that the original “Change Lens” invited AI salience and causal grouping before the repository even had reliable snapshots.

### Revised MVP boundary

- **Foundation first:** explicit completion, immutable server-created snapshot with schema version and provenance, owner-controlled retention/export/delete, visible sync truth, revision-safe amendments, and no fabricated backfill from mutable history.
- **First user-facing slice:** user manually selects exactly two compatible snapshots; deterministic text-first old value/date → new value/date display; one change at a time; exact source; `No meaningful change`, `Not sure`, correction through a linked amendment, and optional user annotation.
- **Excluded:** AI summary in the first slice, hidden ranking, clinical thresholds, trend or decline labels, causal grouping, risk score, charts as the only representation, scheduled check-ins, caregiver alerts, reminder loop, or automatic packet insertion.
- **Later merge:** Only if usability evidence shows the raw diff is difficult may a source-cited neutral condensation be tested. User-selected, confirmed changes may then appear as an optional section in N4; N6 does not create a second outward brief.
- **Autonomy:** L0 raw comparison; L2 user-authored annotation draft; L3 confirmed local export or inclusion in N4. No L4.

### Measurable decision gate

Require snapshot atomicity/version compatibility, zero evaluative language, user comprehension of old/new dates, low false-salience/anxiety, and demonstrated repeated-assessment demand. If users do not have meaningful history or prefer the raw review, do not add AI summarization.

## 5. Consent Capsule Care Circle → N7 Consent-Governed Care Circle Task

**Revised position: DEFER outside the core roadmap as a separate abuse-aware authorization research program.**

### Concerns addressed

- Persona Council: meaningful for some users but the most governance-intensive; permission complexity, identity, coercion, shared devices, and digital access can exclude or harm the people it aims to support.
- Engineering: **XL, 18–28 engineer-weeks including delegated-access foundation**, Low confidence, plus material ongoing policy/support operations.
- Safety: Research/pilot only; risks include coercive control, impersonation, medication/financial abuse, disputed authority, and confusing personal-representative status.
- Red team: AI is unnecessary for granting authority; the existing caregiver email confers no authorization; professionally authored permission copy is safer than generated consent.

I accept that the original AI-generated “capsule” language was misplaced. Least-privilege authorization is valuable, but it is primarily security, consent, safeguarding, and operations—not an AI capability.

### Revised research boundary

- **Separate program prerequisites:** independent privacy/legal review; elder-abuse/safeguarding expertise; verified supporter identity; full authorization matrix and penetration testing; account recovery and disputed-access operations; accessible private revoke; co-design with older adults and supporters.
- **Prototype only:** one owner-selected verified supporter; one predefined task; one low-sensitivity domain; read/comment or propose-only; fixed 14-day expiry; exact supporter-view preview; professionally authored permission text; active-access indicator; complete audit; owner approval for every proposal.
- **Excluded:** Mentation, chat, location, broad medication access, direct edits, shared credentials, generated consent language, inferred relationship/capacity/authority, recurring access, L4 reminders, caregiver dashboards, inactivity/fall alerts, and inheritance from the profile caregiver email.
- **Autonomy:** L0 fixed explanation; L2 deterministic grant preview; L3 create/revoke only after explicit owner confirmation and live authorization checks. No model in the authorization path and no L4.

### Measurable decision gate

Any scope violation, wrong identity, unclear comprehension, inaccessible revoke, stale post-revoke access, or inadequate coercion response stops the pilot. Measure users who decline access as a valid outcome. This program must not delay N2–N4.

## 6. After-Visit Closed Loop → N9 After-Visit Follow-Through Organizer

**Revised position: DEFER to a controlled pasted-text administrative-task study; withdraw the “closed loop” claim.**

### Concerns addressed

- Persona Council: potentially useful for memory burden, but source acquisition, side-by-side verification, and item-by-item confirmation can be harder than the original document.
- Engineering: feasible only as a pasted-text administrative pilot at **L, 8–13 engineer-weeks after foundation/source-ingestion work**, Low/Medium confidence; reminders add another shared platform dependency.
- Safety: Research/pilot only. Negation, conditional instructions, dates, medication directions, and clinical intent can be silently changed.
- Red team: clean-document demos hide real tables, contradictions, templated warnings, and unclear actor/date; confirmation does not make a confusing source understandable.

I accept that “closed loop” falsely implies task completion, clinical receipt, and outcome verification. The defensible research question is much narrower: can a source-anchored extractor reduce effort for plainly administrative text without operationalizing clinical content?

### Revised research MVP boundary

- **Included:** pasted or manually entered text only; explicit processing consent; one proposed task at a time; exact original sentence always adjacent; a small clinician-authored allowlist such as “call this named office” or “bring this named document”; Approve/Edit/Needs clarification/Skip; printable/manual checklist; short retention and deletion controls.
- **Fail-closed:** medication, symptom-conditional, laboratory-result, wound-care, `as needed`, negated, conflicting-date, unclear-actor, or low-confidence content remains verbatim and is labeled “Ask the issuing clinic/pharmacist.” It is not converted into a task.
- **Excluded:** OCR/images, EHR import, clinical portal messaging, calendar events, booking, refill, medication scheduling, caregiver assignment, automatic send, recurring reminders, and claims that a clinic acted.
- **Autonomy:** L0 source display; L2 administrative checklist proposal; L3 local save/print after item approval only. No external action and no L4.

### Measurable decision gate

Clinician-reviewed dangerous operationalization must be zero in the governed corpus. Also measure correction time, omitted administrative tasks, changed dates/negation, subgroup burden, deletion success, and whether the manual checklist is easier. If safe recall is poor or verification exceeds manual entry effort, withdraw model extraction and retain only a source-linked manual checklist.

## 7. Door-to-Door Mobility Plan → fixed Mobility Visit Checklist within N4

**Revised position: WITHDRAW as a standalone agent and merge only a small deterministic checklist into N4.**

### Concerns addressed

- Persona Council: value is limited to a mobility subgroup; manual addresses/maps can be inaccessible; rural data gaps and a polished “safe route” interpretation remain likely.
- Engineering: a manual template is **M, 4–7 engineer-weeks**, while external automation becomes **XL, 12–20 engineer-weeks plus provider/data costs**, with Low confidence.
- Safety: Research/pilot only even at the normalized scope because unknown venue/accessibility/transport facts can create physical harm and destination data are sensitive.
- Red team: once unsafe external facts are removed, the honest MVP is a fixed form and printable checklist with little AI advantage.

I agree. The original proposal does not survive the agentic-advantage test.

### Merged checklist boundary

- **Included in N4:** optional user-entered transport mode; entrance, stairs/elevator, seating/rest, communication/access needs; one or two questions to verify with the venue; optional backup contact; Known/User entered/Unknown labels; printable text.
- **Excluded:** separate mobility plan collection, precise destination retention, geolocation, maps, weather, transit/paratransit feeds, live availability, route scoring, fall-risk inference, `safe`/`approved` route language, autonomous replanning, tracking, arrival alert, caregiver “peace of mind,” transport booking, and reminders.
- **Autonomy:** L0 fixed explanation; L2 user-edited checklist; L3 local inclusion in the approved N4 packet. No standalone agent and no L4.

### Measurable decision gate

Test whether users with mobility, vision, hearing, and dexterity barriers can express access needs and use the checklist at a visit. Do not measure routing success because the product makes no route claim. If the section adds burden for users without access needs, it remains optional and collapsed by default.

## Revised innovation contribution to the portfolio

### Near-term contribution

1. **N2 deterministic completion/recovery foundation** — keep; prerequisite rather than an AI showcase.
2. **N3 canonical source-linked review** — accept as the shared layer even though it originated outside Phase 2D.
3. **N4 local What-Matters-led packet** — keep as the single outward artifact, incorporating only a fixed values/questions section and optional mobility/access checklist.

### Separately gated research, not portfolio dependencies

- **N5** patient-reported medication list quality check: pharmacist-governed pilot only.
- **N6** raw longitudinal snapshot comparison: second wave after real immutable history exists.
- **N7** consent-governed care-circle task: separate safeguarding/security program.
- **N9** pasted-text administrative extraction: controlled study only.

### Withdrawn/de-scoped

- N11 standalone mobility agent.
- Calendar-aware packet generation and all L4 behavior.
- OCR, EHR, pharmacy/claims, clinical messaging, portal send, route/weather/transit automation, direct caregiver workflows, and external action execution.

## Shared prerequisites and stop rules

Before any revised capability handles real user data:

1. Rotate/remove the exposed credential; owner-scope Firestore; authenticate/authorize every endpoint; narrow CORS; remove sensitive logs and origin-global cross-user browser state.
2. Consolidate backends; separate untrusted data from instructions; use strict structured outputs; prohibit direct model writes.
3. Fix save error propagation, add revision-safe verified persistence and true draft/completed state, and correct scanner false-success semantics.
4. Implement typed server-side actions, idempotency, exact confirmation, user-visible audit, undo/cancel/revoke where applicable, retention/deletion/export, and deterministic clinician-reviewed emergency boundaries.
5. Test every correction, cancellation, failure, offline, and recovery path with diverse older adults and assistive technology. WCAG conformance is necessary but not evidence of usable burden.

Portfolio stop rules:

- A model does not outperform the deterministic alternative on user outcome and correction burden → **remove the model**.
- Unsupported source claim, changed medication/clinical meaning, wrong-field write, unconfirmed external action, or authorization scope failure → **stop release/pilot**.
- A feature increases subgroup burden or exclusion without a workable equivalent path → **narrow or withdraw**.
- External data lack a named owner, freshness standard, correction path, and equity coverage evidence → **do not integrate**.
- A user cannot understand, cancel, or recover from an action as easily as initiating it → **do not ship the action**.

## Final revised stance

The defensible “wow” is not breadth or autonomy. It is the moment an older adult sees that the app reliably preserved their words, lets them correct the record without hunting through the form, and produces a concise packet led by what matters to them—while refusing to send, infer, monitor, or act beyond permission.

The Innovation Scout therefore supports **N2 + N3 + N4 as the coherent near-term core**, with N5/N6/N7/N9 held behind explicit research gates and N11 withdrawn as a standalone capability. This position aligns with the persona evidence, engineering estimates, Phase 4 safety dispositions, and red-team critique without treating any concern as solvable by disclaimer alone.
