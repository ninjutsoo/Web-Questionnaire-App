# Phase 5 Rebuttal and Revision — Practical Agentic-Workflow Product Designer

**Prepared:** 2026-06-17  
**Inputs reviewed:** `RESEARCH_NORMALIZED_CANDIDATES.md`, `RESEARCH_PHASE3_PERSONA_COUNCIL.md`, `RESEARCH_PHASE4_ENGINEERING.md`, `RESEARCH_PHASE4_SAFETY.md`, and `RESEARCH_PHASE4_RED_TEAM.md`  
**Scope:** Revision of the Phase 2C workflow proposals only. No application code, schema, dependency, or configuration changes are made.

## Revised product position

The reviews are persuasive that the Phase 2 catalog is too broad for this repository and that several proposals called ordinary reliability, accessibility, scheduling, or form work “agentic.” I withdraw that framing.

The revised near-term product is one coherent older-adult-controlled workflow:

1. **Complete and recover reliably** through deterministic accessible UI and verified persistence (**N2**).
2. **Review one canonical record** with deterministic readiness checks and, only if proven beneficial, source-bound free-text condensation (**N3**).
3. **Create one local visit artifact** led by a user-selected What Matters priority, using only approved current data (**N4**).

N1 and N12 become optional inputs/sections inside that flow. N8 contributes only a shared one-time reminder utility after scheduling infrastructure exists. N5, N6, N7, N9, and N10 are separately gated research or later programs. N11 is withdrawn as an AI capability.

This revision accepts the Phase 4 conclusion that no L2–L4 action should run on the current application. The exposed credential, broad Firestore rules, unauthenticated endpoints, sensitive logs/storage, unsafe reminder job, backend drift, hidden save failures, scanner false-success path, and missing typed proposal/action/audit layer must be corrected first. Confirmation is not a substitute for a safe execution substrate.

## Response to the major review concerns

| Concern raised | Response and concrete revision | Evidence or decision gate |
|---|---|---|
| Most value in N2 is ordinary accessibility and save reliability, not AI. | **Agreed.** N2 is retained as a deterministic foundation and will not be branded as an agent. AI paraphrasing is an optional experiment, not an MVP dependency. | Persona Council scored N2 highest only under fixed-help, save-truth, offline, and no-profiling adjustments. Engineering rates a deterministic N2 as high-confidence, 4–7 EW after relevant foundation work. Kill AI if it does not improve comprehension, recovery, dignity, and burden versus fixed help. |
| Twelve candidates create too many representations, agents, confirmations, and histories. | **Agreed.** Establish one canonical assessment revision, one source/provenance pattern, one correction tool, one packet renderer, and one action history. Derived model prose is ephemeral and never becomes a second health record. | Red team identified duplicate summaries/actions across N1, N3, N4, N5, N6, N9, and N12. The revised portfolio keeps N3 as the only review representation and N4 as the only outward artifact. |
| “Human in the loop” may create more burden than the original task. | **Agreed.** Confirm only new derived content or a changed source value; never reapprove unchanged facts. Show one proposal at a time, cap N3 clarifications at three, support stop/resume, and set a measured correction-burden ceiling. | Persona findings for low vision, motor barriers, memory burden, and low health literacy repeatedly warn that transcript/source comparison can erase time savings. Each model path must beat its deterministic alternative for the intended users. |
| Voice, camera, PDFs, side-by-side tables, maps, and notifications are not inherently accessible. | **Agreed.** Typed/touch/keyboard/screen-reader interaction is the baseline. Voice and camera are optional inputs; accessible HTML and plain text precede PDF; list views precede maps; ordinary form/manual entry always remains available. | Persona Council requires complete non-voice parity and testing across all eight lenses. WCAG is a floor, not proof of usability. Cancellation, failure, correction, and revoke paths receive the same testing as the happy path. |
| Model summaries can omit, distort, overemphasize, or imply clinical validation. | **Agreed.** Deterministic checks and literal field rendering come first. Any model sentence must cite valid current source IDs/spans, preserve numbers/negation/uncertainty, and fail closed to the field list. Labels say “summary of what you entered,” not “accurate assessment.” | Safety review requires zero unsupported claims in the governed evaluation set and stops on altered negation, number, date, urgency wording, or missing coverage. N3’s model role narrows to selected What Matters/Mobility free text. |
| Medication presentation can change behavior even without explicit advice. | **Agreed.** N5 is deferred and renamed. It is not “reconciliation” or “verification.” The current scanner must first stop accepting food/generic UPC results as medications. No medication model extraction appears in N1/N3/N4. | Safety disposition is research/pilot only; engineering estimates 10–16 EW after foundation plus pharmacist review. Any regimen selection, dose inference, merge ambiguity, or unsafe behavioral response stops the pilot. |
| Caregiver authorization can enable coercion, abuse, or silent loss of autonomy. | **Agreed.** N7 leaves the product roadmap and becomes a separate abuse-aware research/security program. The stored caregiver email grants nothing. The near-term workflow has no caregiver dashboard, status alert, copy, or delegated edit. | Persona and safety reviews identify P7 as both possible beneficiary and highest-risk user. Engineering estimates an 18–28 EW delegated-access program including a new module, plus legal/safeguarding operations. Any scope bypass or unclear revoke stops use. |
| The broad goal steward is generic coaching and multiple reminder systems would compete. | **Agreed.** Withdraw open-ended goal decomposition and recurring coaching from N8. Merge one deterministic, one-time reminder mechanism into N2/N4 only after a single preference/queue/audit service exists. | Red team correctly notes that the app lacks finances, clinical restrictions, schedule, and service context to propose feasible plans. The revised reminder source of truth is an accessible date/time picker; natural language can only prefill a proposal. |
| External handoffs depend on data/operations the repository does not have. | **Agreed.** N10 remains deferred until a funded named regional partner provides terms, a maintained directory, accessibility/channel fields, correction route, freshness standard, coverage evidence, and human fallback. No broad web search or auto-send. | Engineering identifies ongoing directory operations—not model code—as the scarce asset and estimates 10–16 EW plus 0.2–0.5 operations FTE. Rural/no-result disparity is a go/no-go metric. |
| N11’s honest MVP is a deterministic checklist, while richer route claims are unsafe. | **Agreed; standalone proposal withdrawn.** A small user-entered Mobility Visit Checklist may be included in N4 without AI, external route data, or safety claims. | Red team rejects N11; engineering’s required spike asks whether a fixed template gives the same value; safety keeps automated mobility planning research-only. No reason remains for a separate agent. |
| Decision-specific N12 can steer treatment and lacks governed sources. | **Agreed.** Merge only a fixed private Values and Questions section into N4. Withdraw treatment comparison, option generation, individualized risk, recommendation, consent, and decision communication. | Decision-aid evidence applies to governed complete aids, not improvised model content. A future decision-specific study would require a qualified source, clinical owner, completeness/non-steering evaluation, and separate approval. |
| Sending/export can be mistaken for clinical receipt or action. | **Agreed.** N4 MVP is local accessible HTML/plain-text print/download only. No email, EHR, portal, native-send success claim, appointment booking, or automatic clinician/caregiver share. | The current app can already print/download locally. Engineering and safety both treat sending as a later separately confirmed integration with provider-state truth; it is unnecessary to prove the core user outcome. |
| Current free-first OpenRouter routing is not a dependable production basis. | **Agreed.** The deterministic flow works with the model off. Any retained model experiment uses a pinned paid structured-output-compatible provider/model, strict output validation, provider/privacy settings, cost/rate limits, and a no-model fallback. | Engineering cites free-model limits and provider variability, and requires paid compatible models, telemetry, regression sets, and a bounded timeout/retry policy. |
| Evidence supports design principles, not efficacy in this app. | **Agreed.** Claims are workflow hypotheses. Success is not messages, downloads, or sends. Every model use has a deterministic comparator, prespecified benefit threshold, subgroup results, and a kill/narrowing rule. | All reviews state that no located evidence validates these workflows or shows improved clinical outcomes. |

## Revised candidate dispositions

“Merge” removes the candidate as a standalone product and retains only the named bounded element. “Defer” means no production roadmap commitment; the stated prerequisite and research gate must be satisfied first. “Withdraw” means the proposed AI capability should not proceed.

| ID | Revised position | Revised role | Revised MVP boundary |
|---|---|---|---|
| **N1** | **Merge** | Optional typed narrative input inside N2/N3 after the canonical proposal/correction pattern exists. | One typed/pasted proposal at a time; What Matters and Mobility only; exact source span and destination; per-field approval/undo; no medication/Mentation extraction, voice requirement, batch approval, raw audio, or caregiver input. Remove if it does not reduce time and corrections versus direct form entry. |
| **N2** | **Keep** | Deterministic Completion and Recovery Mode; prerequisite, not an AI capability. | User-invoked one-question mode, remaining items, required/optional labels, exact verified save/resume point, pending/failed status, retry/copy/return, Skip/Not sure/Stop, predictable focus, and opt-out. No behavioral profiling, cognitive inference, auto-answer, auto-submit, caregiver alert, or model dependency. |
| **N3** | **Keep** | Canonical source-linked review and correction layer. | Deterministic missing/type/range/duplicate/scanner-status checks and field list. Optional model only for shortening selected What Matters/Mobility free text after source-span validation. At most three neutral clarifications; one at a time; Keep as written/Skip/Do not ask again; no medical meaning, readiness score, urgency conclusion, or medication paraphrase. |
| **N4** | **Keep** | Single outward artifact and primary bounded AI-assisted outcome. | Accessible editable HTML/plain-text one-page packet; one user-selected What Matters priority; approved self-reported 4Ms statements; patient-entered medication list rendered literally and labeled; up to three editable questions; optional communication/access needs; blank notes; local print/download only. No email, EHR, calendar, booking, urgency ranking, PDF dependency, or default sharing. |
| **N5** | **Defer** | Separate pharmacist-led research pilot: **Patient-Reported Medication List Quality Check**. | Manual entry first; missing-field checks; conservative duplicate candidates; original/label/external source kept separate; source/date; “confirmed by you” and “needs professional verification”; question list only. No OCR, “verified/reconciled” status, regimen choice, dose inference, interaction checking, reminders, import, or outreach. |
| **N6** | **Defer** | Later deterministic history feature after real immutable snapshots exist. | User explicitly selects two version-compatible snapshots; exact old/new values and dates; linked amendment; “No meaningful change/Not sure”; raw text-first diff. No AI ranking/grouping at first, scheduled check-in, trend/decline/risk language, caregiver alert, or clinical threshold. Test summary only if users cannot understand the raw diff. |
| **N7** | **Defer** | Separate delegated-access and safeguarding research program, not an email feature. | One verified supporter, one predefined nonclinical task, one domain, read/comment or propose-only, fixed 14-day expiry, owner approval for each proposal, active-access indicator, private revoke. No direct edits, recurrence, Mentation/location/chat access, broad dashboard, missed-response alerts, or inferred authority. |
| **N8** | **Merge** | One shared deterministic one-time reminder utility for N2/N4; broad Goal Steward withdrawn. | “Resume my questionnaire” or “Review my visit packet” only; accessible date/time picker is authoritative; absolute time/timezone/channel/privacy-safe text preview; confirm once; delivery truth; pause/delete. No open-ended coaching, recurring L4, medication reminders, streaks, caregiver copy, nonresponse escalation, or inferred completion. |
| **N9** | **Defer** | Controlled pasted-text administrative-task research pilot after the core visit flow proves useful. | No upload/OCR initially; exact source sentence; one allowlisted administrative proposal at a time; Approve/Edit/Needs clarification/Skip; printable manual checklist first. Medication, symptoms, tests, conditional/clinical instructions remain verbatim and route to the issuing clinician/pharmacist; no action/reminder until precision and harm gates pass. |
| **N10** | **Defer** | Partner-dependent regional resource-navigation pilot. | One funded region, two narrow need categories, manual ZIP, explicit constraints, up to three source-dated options, known/unknown fields, honest no-result, and copy/call script only. No broad web search, automatic send/booking, precise/background location, questionnaire disclosure, or eligibility/endorsement claim. |
| **N11** | **Withdraw** | Remove as standalone AI candidate; merge an ordinary Mobility Visit Checklist into N4 if user research supports it. | User-entered transport, entrance, seating/rest needs, questions to verify, backup contact, and print/download. No external maps/transit/weather, route safety, continuous tracking, arrival alerts, booking, purchase, or autonomous replanning. |
| **N12** | **Merge** | Fixed private Values and Questions section inside N4; decision-specific builder withdrawn. | User selects priorities, notes uncertainty, and writes/edits up to three questions. No generated treatment options, option comparison, individualized risk, ranking, recommendation, consent, or clinician/caregiver communication. |

## Revised integrated MVP

### A. Foundation and release gate

The MVP does not begin with a model. It begins with the shared foundation identified by all reviewers:

- rotate/scrub the exposed secret; move Functions to a supported, deploy-tested Node runtime;
- consolidate `functions/` and `chat-backend/`;
- owner-scope Firestore, authenticate/authorize every endpoint, narrow CORS, and user-scope browser state;
- remove public reminder/debug action surfaces and replace the unconditional daily email behavior;
- fix `saveSectionResponses` error suppression, progress/completion semantics, and medication scanner false-success behavior;
- add schema-versioned assessments, expected revisions, typed proposal/action schemas, confirmation tokens, idempotency, read-back verification, user-visible audit/undo, retention/deletion, redacted telemetry, model isolation, and deterministic emergency boundaries;
- test rules, tools, prompt injection, offline states, accessibility, failure, cancellation, and cross-user access before real-user pilot.

Engineering estimates F0 at **22–33 engineer-weeks**. This is not feature overhead to hide; it is the minimum execution boundary. N2/N3/N4 add approximately **15–24 engineer-weeks** after F0 before reuse savings, for a combined **37–57 engineer-weeks**, excluding elapsed recruitment, legal/clinical review, and older-adult studies. A one-time reminder module is not part of the first local-artifact MVP; adding it later requires the separate 5–8 EW scheduling foundation.

### B. One coherent user flow

1. The user completes the questionnaire normally or enters the deterministic N2 one-question mode.
2. Every save has a visible pending/saved/failed state; success appears only after server read-back.
3. At Review, N3 runs deterministic readiness checks and presents the canonical source-linked record. The user changes only items they choose; unchanged facts are not reconfirmed.
4. If the optional model is enabled and evaluated, it may shorten selected free text. Each derived sentence sits beside its source and can be kept, edited, or discarded. Failure returns to the ordinary field list.
5. The user chooses one What Matters priority and selects what to include in N4.
6. N4 creates a fixed-structure packet; optional model output is limited to source-bound free-text condensation and up to three editable question drafts.
7. The user previews the exact artifact, removes private items, and chooses local print or download. Nothing is sent.
8. The app verifies artifact revision/hash and records only the minimal export audit. The user can return to the canonical source record to correct an answer and intentionally regenerate a new packet revision.

### C. Revised agent/action boundaries

| Stage | N2/N3/N4 behavior |
|---|---|
| Observe | Read only the authenticated user's current verified assessment revision and explicit packet selections. Deterministic code computes form state and readiness. |
| Reason | Optional model condenses only selected free text or drafts questions constrained to cited source IDs. It receives no caregiver email, chat history, precise location, unrelated excluded fields, credentials, or action authority. |
| Propose/confirm | N3 shows source and derived wording together. A source-answer correction requires exact before/after confirmation. N4 shows the final artifact and local-export consequence. |
| Act | N3 may perform an **L3 reversible owner-only field correction** after per-field confirmation. N4 may perform **L3 local artifact creation/download** after final preview. No send, schedule, permission, clinical, or external contact tool exists in the MVP. |
| Verify | Field writes use expected revision, transaction, and read-back. Artifact revision/hash must match the approved preview. “Downloaded/print dialog opened” is not “clinician received.” |
| Record | Store minimal proposal/action IDs, source revision, changed field diff or artifact hash, confirmation, result, model/policy version, and undo link. Do not retain duplicate summary prose by default. |
| Follow up | Return focus to the exact source or packet item. There is no autonomous follow-up. A later one-time reminder is separately user-created through the shared deterministic service. |

### D. Cross-product confirmation budget

The reviews correctly challenge confirmation-heavy designs. The MVP therefore adopts these measurable limits:

- no approval of unchanged literal fields;
- at most one derived item on screen for users who choose reduced-distraction mode;
- at most three agent-generated clarifications or questions per review/packet session;
- one source correction confirmation per changed field and one final artifact confirmation;
- persistent Stop/Skip/Keep as written/Return controls;
- no recurring confirmation prompts after dismissal;
- no batch approval for narrative extraction;
- record correction time, reversals, abandonment, and perceived control by persona lens; remove the model path when it increases burden or error.

## Candidate-specific disagreements resolved

### N5: valuable need, but not a near-term workflow

I do not withdraw N5 because the reviewers consistently identify medication-list uncertainty as an important recurrent problem. I do accept the stricter **research/pilot only** disposition. The Phase 2 term “Medication Reconciliation Investigator” overstated authority; the revised name and output explicitly stop at patient-reported list quality and professional questions. The pilot cannot begin until scanner truth, server lookup adapters, pharmacist-owned rules/copy, and a pharmacist-adjudicated corpus exist. Any evidence that presentation changes medication-taking behavior unsafely is a hard stop, even if matching metrics look good.

### N6: safe concept, wrong time

The safety review allows an exact-diff N6 after safeguards, while engineering and red team recommend deferral because the repository has no real snapshots. I adopt **defer**, not withdraw. Building a summary agent before immutable history exists would manufacture its own evidence base and duplicate N3/N4. The first future release is deterministic two-date comparison only; model synthesis must earn a place through observed comprehension difficulty.

### N7: least privilege does not make consent simple

Phase 2 argued that a governed task is safer than the current caregiver-email behavior. That remains directionally true, but the reviews show that a polished grant UI can still mask coercion, mistaken identity, capacity disputes, or inaccessible revocation. I therefore remove N7 from the product sequence and treat it as a separate security/safeguarding program. No near-term feature depends on caregiver participation, and “no supporter access” is a successful outcome.

### N8: preserve prospective-memory support, withdraw coaching

The Persona Council sees repeated value in reminders, especially under high memory burden; the red team correctly rejects a broad goal coach. The compromise is not a smaller coach. It is a shared deterministic one-time reminder utility for two concrete user-owned artifacts. This preserves prospective-memory support without model-generated goals, parallel inboxes, surveillance, or open-ended L4 autonomy.

### N10: genuinely agentic, but data quality controls the answer

N10 still has a legitimate observe/filter/propose/contact/follow-up loop. I do not accept that it is intrinsically a generic chatbot. I do accept that without a maintained directory and human operations, the loop is performative and inequitable. Therefore it remains deferred behind a named one-region partner gate. A truthful “no maintained result” and subgroup no-result rate are core outputs; an automatic contact tool is removed from the first pilot.

## Revised success and kill criteria

| Capability | Evidence of value | Counter-metrics and hard stops |
|---|---|---|
| N2 | Higher verified completion/recovery, fewer lost answers, successful resume, lower burden across assistive modes. | Any false saved state; more disorientation or dismissals than full view; inferred cognitive label; cross-user checkpoint exposure. AI wording is removed if fixed help performs as well or better. |
| N3 | More user-detected source errors with equal or lower review time and higher comprehension/control than deterministic field review. | Any unsupported sentence in the release set; altered negation/number/date; more source-review errors or time; pressure to erase compatible answers; inaccessible correction path. Fall back to deterministic review. |
| N4 | Users raise their selected priority in a simulated/actual visit, understand the artifact's status, and can edit/export it across modalities. | Omitted selected priority, unsupported question, perceived clinician approval, private-field inclusion after exclusion, artifact/revision mismatch, inaccessible output, or measuring downloads as the outcome. Remove generated questions before abandoning the deterministic packet. |
| Merged N1 pilot | Less completion time and fewer interactions/corrections than direct form entry for intended users, including low vision/motor and low-literacy groups. | Wrong-field save, missing source span, medication/Mentation extraction, correction burden equal to or worse than direct entry, subgroup disparity, or blanket approval. |
| Merged N8 later | Correct one-time schedule, quiet-hour/timezone compliance, verified cancellation, truthful delivery state, and lower prospective-memory burden. | Duplicate, wrong-time, privacy-revealing text, cancellation race, backfill burst, caregiver copy, nonresponse escalation, or delivery presented as completion. |
| Deferred N5/N7/N9/N10 | Candidate-specific pilot protocol meets professional, safety, accessibility, subgroup, and operational gates. | N5 medication operationalization; N7 scope bypass/coercion/revoke failure; N9 changed clinical meaning; N10 stale/wrong recipient or material rural/accessibility disparity. Any such event pauses expansion. |

## Final revised recommendation

The workflow proposal should no longer compete as seven independent “agents.” The defensible portfolio is a reliable questionnaire-to-review-to-visit-packet journey with one canonical source model and tightly bounded optional AI. The app should first prove that source-linked review and a local What-Matters-led packet reduce effort and improve visit preparation compared with deterministic alternatives.

The broad Goal Steward is withdrawn, medication work is downgraded to pharmacist-led research, longitudinal work waits for real snapshots, care-circle delegation becomes a separate safeguarding program, local-resource navigation waits for a maintained partner directory, the mobility agent is withdrawn, and decision support becomes a fixed values/questions section. These are not concessions that remove useful agency; they put agency back with the older adult and reserve automation for places where it can be verified.
