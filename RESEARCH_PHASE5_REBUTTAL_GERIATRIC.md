# Phase 5 — Geriatric 4Ms and Care-Workflow Rebuttal and Revision

**Reviewer:** Phase 2B Geriatric 4Ms and Care-Workflow Specialist  
**Date:** 2026-06-17  
**Inputs reviewed:** `RESEARCH_NORMALIZED_CANDIDATES.md`, `RESEARCH_PHASE3_PERSONA_COUNCIL.md`, `RESEARCH_PHASE4_ENGINEERING.md`, `RESEARCH_PHASE4_SAFETY.md`, and `RESEARCH_PHASE4_RED_TEAM.md`

## Revised position

I accept the central criticism that my Phase 2 set described a useful care journey but too many separate product surfaces. Seven individually bounded ideas would still create repeated summaries, repeated confirmations, multiple task/reminder states, excess sensitive data, and a de facto caregiver workflow. Those cumulative burdens are particularly misaligned with the users the app intends to support.

The revised geriatric recommendation is therefore:

1. **Keep N3** as the one canonical 4Ms review/correction layer, primarily deterministic.
2. **Keep N4** as the one outward artifact, local and user-controlled. It absorbs the safe generic portion of N12 and a small user-entered Mobility/access-needs checklist.
3. **Do not put N5, N6, N7, or N9 in the initial production portfolio.** Preserve them as separately gated research or second-wave concepts, with narrower scopes below.
4. **Withdraw N12 as a standalone feature.** Evidence for governed decision aids does not justify model-generated treatment comparison; its generic values/questions portion belongs in N4.
5. Treat N2's deterministic save/resume/accessibility work and the Phase 1 security/privacy repairs as prerequisites, not as optional supporting work or geriatric “features.”

This is not a dismissal of medication, longitudinal, caregiver, or post-visit needs. It recognizes that need alone does not establish a safe agentic solution in this repository. Medication reconciliation is a professional process, longitudinal comparison requires trustworthy snapshots, caregiver sharing requires a safeguarding program, and after-visit extraction can change clinical meaning. The current app has none of those foundations.

## Disposition summary

| Original Phase 2 idea | Normalized candidate | Revised position | Revised near-term boundary |
|---|---|---|---|
| G1 4Ms Readiness and Clarification Check | N3 | **KEEP, narrowed** | Deterministic field readback and high-precision readiness flags; optional source-cited compression of free text only if it beats a template. No clinical interpretation. |
| G2 What-Matters-Led Visit Brief and Agenda | N4 | **KEEP, narrowed** | User-selected, editable, local accessible HTML/plain-text packet. No send, EHR, booking, or model-selected priority. |
| G3 Medication List Verification and Conversation Prep | N5 | **DEFER / research pilot only** | Near term shows the user's list verbatim and flags missing fields; any matching/provenance pilot is pharmacist-led and cannot claim verification or reconciliation. |
| G4 Longitudinal 4Ms Change Review and Check-ins | N6 | **DEFER to second wave** | Build trustworthy snapshot semantics first. Later compare exactly two user-selected snapshots with a deterministic text diff; no scheduled check-ins or trend interpretation. |
| G5 Care-Partner Collaboration | N7 | **WITHDRAW from production roadmap; research only** | No caregiver data access in MVP. At most, later study one verified supporter, one predefined low-sensitivity task, comment/propose only, fixed expiry, and private revoke. |
| G6 Shared-Decision Conversation Builder | N12 | **MERGE into N4; withdraw standalone** | Fixed private Values and Questions section, up to three user-edited questions. No option generation/comparison, risk calculation, recommendation, consent, or send. |
| G7 Post-Visit Follow-Through Organizer | N9 | **DEFER / research pilot only** | No AI extraction in production MVP. A later pasted-text study may propose only allowlisted administrative tasks with exact source text and no reminders initially. |

## Cross-review concerns accepted

### One canonical source, not several generated health records

The red team correctly notes that N3, N4, N5, N6, N9, and N12 could each create another prose representation of the same self-report. That creates disagreement, retention, amendment, and user-verification problems. The revised architecture has one canonical assessment revision. N3 renders and corrects that source; N4 renders a selective artifact from it. Generated text is either ephemeral or stored only as an approved artifact linked to the exact source revision. It never becomes a second clinical record.

### Confirmation is burden, not a universal cure

The Persona Council shows that source review and confirmation can be especially demanding for people with low vision, fine-motor limitations, high memory burden, or low health literacy. Therefore, the portfolio needs a confirmation budget:

- one issue at a time;
- no repeated approval of unchanged facts;
- source and proposal together, not on separate screens;
- short batches, stop/resume, “Keep as written,” “Not sure,” and “Do not ask again”;
- correction and cancellation paths tested to the same accessibility standard as primary flows;
- measure time, corrections, abandonment, and discomfort by persona/modality rather than treating more confirmations as safer by definition.

### One-time reminders only, through one future service

My Phase 2 G4/G5/G7 concepts could have produced overlapping check-in, caregiver, and follow-up notifications. I accept the engineering and red-team objection. No revised geriatric MVP needs a scheduler. If a shared reminder service is later built for N2/N4, the first permitted geriatric use is a single user-created “review my packet before my appointment” reminder with an explicit absolute date/time/timezone and privacy-safe text. No recurrence, medication reminders, missed-response inference, or caregiver copy.

### Caregiver involvement is not a convenience toggle

N7 is an identity, authorization, safeguarding, support, and legal-policy program, not a normal feature extension. The Persona Council documents unequal access and consent-comprehension burdens; the engineering review estimates 18–28 engineer-weeks including delegated-access foundations at low confidence; and the safety review requires independent privacy, safeguarding, elder-abuse, clinical, security, and legal validation. Those concerns cannot be fixed with better generated permission copy. The near-term portfolio therefore has no remote caregiver role. “No supporter access” is a successful default.

### Local artifacts before external handoffs

The current app cannot establish that a clinician or caregiver read or acted on an email. Sending also adds wrong-recipient and sensitive-content risk. N4 is therefore local print/download in its first release. “Exported” means only that the app created the approved artifact; it does not mean submitted, received, reviewed, or clinically accepted.

## Candidate-specific rebuttals and revisions

### G1 / N3 — Plain-Language Readback and Readiness Check

**Concern accepted.** A fluent summary can omit uncertainty, alter emphasis or negation, soften urgent wording, stigmatize Mentation, and look clinically validated. “Conflict” questions can feel like a cognitive test. A source-cited summary can also take longer to review than the original form.

**Why a narrower version remains worth keeping.** The Persona Council ranks N3 28/30 and finds value across all eight lenses when source and correction are colocated. Engineering finds strong repository fit at 6–9 engineer-weeks after the shared foundation. Safety permits it only with mandatory safeguards, and the red team keeps it as the canonical review layer. This convergence supports the workflow, not unrestricted generative summarization.

**Revision.** Rename the user-facing surface **Review My Answers**. The default is a deterministic, sectioned rendering of every current answer. Deterministic code handles missing required fields, invalid formats, exact duplicates, progress anomalies, unverified scan provenance, and at most a small clinically reviewed set of “both may be true—would you like to add context?” prompts. It never marks an answer clinically correct or incorrect.

AI is optional and subordinate. It may shorten user-authored free text only. Every sentence must cite complete source field IDs from the same answer revision; code rejects changed numbers, dates, negation, new entities, causal language, diagnosis, “normal,” “safe,” “no concern,” urgency ranking, and uncited text. Medication names, doses, frequencies, ratings, and selected choices render deterministically. If template/extractive output is as understandable, the model is removed.

**Revised autonomy.** L0 deterministic readback; L1 neutral clarification; L2 proposed correction; L3 write only after the user sees before/after values and explicitly approves an owner-authorized, revision-checked, reversible patch. N3 never sends, schedules, alerts, or shares.

**Revised MVP boundary.** One current assessment revision; no historical comparison; no caregiver view; no model medical explanation; no clinical completeness score; no persistent duplicate summary; one clarification at a time with Keep as written / Edit / Skip / Do not ask again. A separate clinician-reviewed emergency component may appear beside explicit urgent content, but N3 does not classify urgency.

**Required decision tests.** Source coverage and unsupported clinical claims must be zero-failure gates on the governed test set, not average scores. Compare deterministic review versus model compression for comprehension, time, correction burden, omission, perceived judgment, and error by accessibility/language group. If model output is slower, less accurate, or less trusted, ship deterministic review only.

**Position: KEEP, narrowed.**

### G2 / N4 — What-Matters-Led Visit Preparation Packet

**Concern accepted.** A model can select the wrong priority, omit a concern, invent or steer questions, and produce a polished document that appears clinician-approved. Print/PDF flows can exclude users, and native share or email can disclose private Mentation or medication data. A one-page limit can itself suppress nuance.

**Why a narrower version remains worth keeping.** N4 also scores 28/30 in the Persona Council and produces the clearest real-world artifact from data the application already owns. Engineering rates the bounded implementation high/medium confidence at 5–8 engineer-weeks, with reuse from N3. Safety and red team both keep local, editable print/download after mandatory controls. The evidence supports agenda preparation as a workflow hypothesis; it does not establish clinical outcome benefit.

**Revision.** N4 becomes the **single outward artifact**. The older adult explicitly selects the lead What Matters priority and every included domain. A deterministic template controls section order, labels, source/date/version, medication rendering, uncertainty, access/communication needs, Mobility logistics questions, up to three questions, and blank notes. “One page” is a default compact view, not a rule that silently drops content; a detailed version remains available.

AI may propose question wording or compress selected free text only after N3 provenance controls pass. It cannot choose the priority, rank urgency, decide what fits, generate a diagnosis, presume insurance/family/transport, or add an excluded field. Every generated phrase is editable/removable and linked to source.

**Revised autonomy.** L0/L2 draft and preview; L3 creates a local artifact only after exact-content approval. No external action is part of the first release.

**Revised MVP boundary.** Accessible HTML and plain text first, large-print CSS, keyboard/button ordering, local print/download, and offline availability of the approved artifact. No server-stored PDF by default, no claim that browser print creates an accessible tagged PDF, no email/native-share requirement, no clinician portal/EHR, no calendar OAuth, no appointment booking, no delivery/read status, and no default caregiver copy. Copy states: “My notes for discussion—not medical instructions; not reviewed by the clinic.”

**Required decision tests.** Users must be able to identify and retain their selected priority, exclude private fields, correct questions, cancel export, and use the artifact with low vision, hearing loss, motor limitations, high memory burden, low literacy, and intermittent connectivity. Success is user-rated fidelity and whether the chosen topic was raised—not download count or model engagement.

**Position: KEEP, narrowed.**

### G3 / N5 — Medication List Verification and Question Prep

**Concern accepted.** “Verification” is too strong. Database, scan, name, brand/generic, formulation, route, dose, frequency, and duplicate matches can all be wrong. A polished comparison can change medication behavior even without an explicit recommendation. The current scanner already treats some non-medication product matches as success. External terminology services are not patient-specific pharmacy records. Dense source comparison also has substantial accessibility and confirmation burden.

**Evidence controlling the revision.** The medication review literature cited in Phase 2 describes reconciliation and review as skilled, coordinated clinical processes and emphasizes professional involvement ([Beuscart et al., 2021](https://pubmed.ncbi.nlm.nih.gov/33583002/)). The Persona Council calls N5 high-value but high-consequence. Engineering estimates 10–16 engineer-weeks with a pharmacist-led spike and low/medium confidence. Safety and red team both restrict it to research/pilot.

**Revision.** Remove “verification” from the near-term claim. N3/N4 may include a **Patient-Reported Medication List for Professional Review** that renders the user's entries verbatim, labels missing name/dose/frequency as unknown, preserves source and date, and lets the user draft “Please verify this” questions. It does not normalize, merge, deduplicate, or select an external candidate in production MVP.

A separate research pilot may compare user-entered text, user-confirmed label transcription, and conservative RxNorm/openFDA candidates under pharmacist governance. Sources remain side-by-side; unresolved disagreement is a valid and often preferred result. The model can phrase a neutral question only. No label-image AI, pharmacy/EHR import, interaction checking, or dosing reminders.

**Revised autonomy.** Near-term list is L0/L1 and ordinary L2 editing. Any later candidate patch is L2 until per-field user confirmation, then a reversible L3 correction of self-report only. No medication-related L4.

**Hard stops.** Any advice or UI that leads a user to start, stop, skip, split, combine, substitute, or change a dose; any food/UPC match presented as medicine; any silent merge; any “safe/correct/verified/reconciled” label; any dangerous merge/split or behavior-change incident stops expansion. A pharmacist-reviewed corpus and subgroup analysis are prerequisites, not post-launch monitoring.

**Position: DEFER / research pilot only.**

### G4 / N6 — Longitudinal 4Ms Change Review

**Concern accepted.** The current single mutable Answer document cannot support trustworthy history. Ordinary rating variation, changed understanding, schema changes, or incomplete sync can be miscast as improvement, decline, cause, or risk. Longitudinal storage increases privacy impact; repeated check-ins add anxiety, alert fatigue, and surveillance temptation. Immediate value is also low until multiple real snapshots exist.

**Why the exact-diff concept is preserved but deferred.** The Persona Council gives the narrowed N6 25/30 and finds memory-support value, while emphasizing anxiety and provenance. Engineering rates an immutable-snapshot implementation feasible at 6–10 engineer-weeks. Safety permits only exact user-selected comparison with mandatory safeguards. The red team nevertheless defers it because the prerequisite data does not yet exist. I agree with the red-team sequencing.

**Revision.** The foundation may create an immutable, schema-versioned snapshot only when the older adult explicitly completes an assessment. It must not fabricate historical snapshots from the current mutable record. No user-facing longitudinal claim is made until at least two trustworthy snapshots exist.

The later MVP compares exactly two user-selected snapshots. Code—not a model—aligns compatible fields and prints “You entered X on [absolute date] and Y on [absolute date].” Incompatible/missing fields say so. The user may annotate, suppress, correct the current record without rewriting history, or select “No meaningful change.” An AI narrative adds insufficient value at this stage and is removed from MVP.

**Revised autonomy.** L0 deterministic diff; L1 suggestion to place a user-selected difference in N4; L2 annotation/export draft; L3 approved annotation/export. No L4, scheduler, recurring check-in, hidden ranking, or alert.

**Hard stops.** No disease, decline, improvement, risk, causal, adherence, or urgency label; no missed-check-in inference; no caregiver/clinician notification; no comparison with incompatible schema or unverified sync. Test anxiety, false salience, comprehension, deletion, and schema migration before release.

**Position: DEFER to a second wave after real immutable snapshots.**

### G5 / N7 — Older-Adult-Controlled Care-Partner Collaboration

**Concern accepted.** Granular permission UI does not eliminate coercion, impersonation, elder abuse, shared-device compromise, low-literacy consent problems, disputed authority, incapacity, or revocation failure. A stored caregiver email proves neither identity nor authority. Support value and privacy/equity risk coexist in shared-access literature; that evidence does not validate default delegation ([Gleason et al., JMIR Aging shared-access review](https://pubmed.ncbi.nlm.nih.gov/35507405/)).

**Revision.** Remove remote care-partner access from the production roadmap. N4 may let the older adult print a plain supporter request or choose to hand a local packet to someone; the app grants no remote visibility, edit, notification, or status access. No supporter is a valid successful state.

If separately funded as research, the first prototype is one verified supporter, one owner-selected predefined low-sensitivity task, one minimum-necessary domain, comment/propose only, fixed 14-day expiry, no chat/location/Mentation access, no direct medication changes, no recurrence, and owner approval for every proposal. Permission copy is professionally authored and tested, not generated. Server authorization checks live grant version/scope on every read/action. The owner has a private immediate revoke path and visible audit. L4 is withdrawn.

**Why this is not merely “later engineering.”** Engineering estimates an 18–28 engineer-week program at low confidence plus policy and support operations. Safety requires legal/privacy/safeguarding/elder-abuse review and hard stops on identity uncertainty, coercion, scope confusion, or inaccessible consent. A small product team cannot responsibly hide that program inside a caregiver feature estimate.

**Hard stops.** Any cross-scope read, unclear actor, delayed revoke, hidden caregiver alert, direct answer change, capacity inference, authority inferred from email/relationship/emergency contact, unresolved coercion, or inability to support disputes stops production consideration.

**Position: WITHDRAW from production roadmap; research only.**

### G6 / N12 — Shared-Decision Conversation Builder

**Concern accepted.** The safe generic feature duplicates N4, while the differentiated version requires complete, versioned, decision-specific evidence, neutral risk communication, clinical content ownership, licensing, and prospective evaluation. Model ordering, omission, paraphrase, and framing can steer preferences. The Cochrane evidence concerns governed decision aids, not improvised model-generated options ([Stacey et al., 2024](https://pubmed.ncbi.nlm.nih.gov/38284415/)).

**Revision.** Merge a fixed **Values and Questions** section into N4. It asks what the person wants to be able to do, what they do not understand, what tradeoff they want to discuss, and up to three questions. The older adult edits or writes the answers and chooses packet inclusion. A generic deterministic prompt such as “What are my options?” is safer than model-generated treatment content.

No treatment option generation or comparison, personalized benefit/risk, “best choice,” recommendation, consent, order, appointment, clinician message, or caregiver decision is allowed. No document upload or external evidence catalog is needed for the merged MVP. The model has no necessary role.

A future decision-specific integration is not an expansion toggle for N4. It is a separate clinical research product for one qualified decision aid, with named content owner, complete option checks, citations, accessibility conversion, update/withdrawal process, non-steering evaluation, and new regulatory/safety review.

**Position: MERGE generic values/questions into N4; WITHDRAW as a standalone roadmap feature.**

### G7 / N9 — After-Visit Follow-Through Organizer

**Concern accepted.** The administrative/clinical boundary is not reliably clean. Negation, conditions, dates, “as needed,” medication changes, tests, and symptom instructions can be altered before the user reaches confirmation. Source comparison is burdensome on small screens and for low vision or high memory burden. The feature adds highly sensitive document handling, retention, prompt-injection exposure, evaluation data, and eventually notification infrastructure. Engineering estimates 8–13 engineer-weeks after foundations at low/medium confidence; safety and red team both restrict it to research.

**Revision.** Remove AI extraction from the production MVP. If users need follow-up notes, N4 provides blank notes and a manual “Questions or next steps I wrote down” list without claiming interpretation. No reminder is created from clinical text.

A later controlled study may accept pasted text only—no OCR, image, EHR, portal, or email import—and propose one source-linked task at a time from a clinician-approved allowlist of purely administrative categories such as “call the named office” or “bring the named document.” The exact source sentence stays visible. Any medication, test result, symptom condition, clinical instruction, unclear actor/date, negation, or uncertainty becomes “Ask the issuing clinic or pharmacist” and is not operationalized. Begin with printable tasks and no reminder/sending tool.

**Revised autonomy.** Research pilot is L2 extraction only. L3 task creation and L4 reminders are withheld until a clinician-reviewed corpus demonstrates required precision and zero dangerous operationalization in harm cases.

**Hard stops.** Any changed clinical meaning, medication operationalization, lost negation/condition, unsupported date, ambiguous actor, source omission, or user belief that the app interpreted clinician advice stops expansion.

**Position: DEFER / research pilot only.**

## Revised production MVP

The geriatric contribution to the smallest defensible portfolio is one coherent flow, not a set of agents:

1. **Complete reliably (N2 prerequisite):** deterministic one-question option, truthful save/pending/error state, exact resume, accessible recovery, and no inference about cognition or ability.
2. **Review once (N3/G1):** canonical deterministic readback, source-linked edits, a few high-precision clarification prompts, and optional free-text compression only if comparative testing supports it.
3. **Prepare one local artifact (N4/G2 + merged G6):** user-selected What Matters priority, verified-as-user-entered medication list, selected 4Ms notes, access/Mobility needs, fixed Values and Questions prompts, up to three user-edited questions, blank notes, and accessible local print/download.

Explicit non-goals for this MVP:

- no clinician, caregiver, pharmacy, EHR, calendar, or service-directory integration;
- no external sending, booking, refill, purchase, or notification requirement;
- no medication matching, reconciliation, interaction, regimen, adherence, or dose function;
- no longitudinal trend, check-in, risk score, or automatic alert;
- no caregiver account, dashboard, shared credentials, or inferred authority;
- no treatment comparison, personalized risk, recommendation, or consent;
- no after-visit document extraction;
- no model-only emergency classification;
- no claim of diagnosis, screening, clinical 4Ms assessment, clinical completeness, or improved health outcome.

## Prerequisites and portfolio kill criteria

No retained feature may pilot on real user data until the Phase 1 blockers are corrected: rotate/remove the exposed credential, owner-scope Firestore, authenticate/authorize every endpoint, narrow CORS, consolidate backends, redact logs, user-scope browser storage, fix save truth and scanner semantics, isolate untrusted content from instructions, and add typed schemas, revision checks, idempotency, consent/retention, audit, undo, and deterministic clinician-reviewed emergency boundaries.

The portfolio should be narrowed further or stopped if:

- deterministic N3/N4 performs as well as or better than model output on comprehension, fidelity, correction burden, and accessibility;
- any unsupported clinical claim, changed medication value, omitted selected priority, or unapproved external action occurs in governed release testing;
- users cannot distinguish self-report, generated wording, exported artifact, clinician review, and delivery state;
- confirmation/correction time exceeds the original form burden for target users;
- cancellation, exclusion, correction, and recovery are less accessible than generation;
- subgroup error or abandonment is materially worse for low vision, hearing loss, motor limitations, high memory burden, low literacy, language variation, or intermittent connectivity;
- privacy/security gates find cross-user access, wrong-recipient disclosure, sensitive logging, revocation failure, or prompt-to-tool escalation.

## Final revised recommendation

The 4Ms contribution should be modest and tangible: help the older adult verify what the app recorded, lead a visit packet with what matters to them, and preserve their exact control over inclusion and export. Medication normalization, longitudinal interpretation, caregiver delegation, treatment comparison, and after-visit extraction are not necessary to prove that core value and would expand risk and burden faster than this repository can responsibly support.

I therefore endorse the red team's minimal production portfolio of N2 + N3 + N4, with N1 text input and N8 one-time reminder considered only as later optional components. From the original geriatric set, N3 and N4 survive as production candidates; N12 is absorbed into N4; N5, N6, and N9 are separately gated future research; and N7 leaves the production roadmap.

