# Phase 5 Rebuttal and Revision — Older-Adult Experience and Accessibility

**Role:** Older-Adult Experience and Accessibility Designer  
**Prepared:** 2026-06-17  
**Inputs:** `RESEARCH_NORMALIZED_CANDIDATES.md`, `RESEARCH_PHASE3_PERSONA_COUNCIL.md`, `RESEARCH_PHASE4_ENGINEERING.md`, `RESEARCH_PHASE4_SAFETY.md`, and `RESEARCH_PHASE4_RED_TEAM.md`

## Revised position

I accept the central criticism: the Phase 2 accessibility catalog was too easily read as six separate agents when the older adult needs one coherent path—complete, review, prepare—and most accessibility value comes from deterministic product engineering. The evidence cited in Phase 2 supports multimodal, plain-language, error-tolerant interaction and co-design; it does not show that an LLM improves this 4Ms workflow. AI therefore remains only where a controlled comparison can test a semantic task that rules/templates do not perform well.

The revised accessibility portfolio is:

1. **N2 Completion and Recovery Mode** as a required **non-AI foundation**, not an agent capability.
2. **N3 Source-Linked Review** as the canonical correction layer; AI is optional and limited to free-text compression.
3. **N4 What-Matters Visit Packet** as the single outward artifact; local print/download only.
4. **N1 typed narrative capture** merged as a later experiment inside N2/N3, not a standalone agent.
5. **N8 one-time reminders** merged into the common workflow as deterministic scheduling, not a goal coach.
6. **N7 support-person delegation** removed from the near-term portfolio and deferred to an independently governed safeguarding research program.

### Disposition table

| Phase 2 accessibility concept | Normalized ID | Revised position | Revised MVP status |
|---|---|---|---|
| Say It Once | N1 | **Merge and defer model pilot** | Optional typed narrative experiment inside N2/N3 only after their correction controls exist |
| My Pace Guide | N2 | **Keep as non-AI foundation** | Deterministic completion, save/resume, and recovery; withdraw AI from MVP |
| My Words Review | N3 | **Keep, narrow** | Deterministic readiness plus optional source-bound free-text shortening |
| Visit Ready | N4 | **Keep, narrow** | User-selected, editable local HTML/plain-text visit packet; no sending/integrations |
| Help on My Terms | N7 | **Defer / withdraw from near-term portfolio** | Safeguarding research prototype only; no production MVP in this roadmap |
| Remember My Plan | N8 | **Merge, narrow** | One shared deterministic one-time reminder mechanism for resume/packet review |

## Responses and revisions by capability

### N1 — Assisted Narrative-to-Form Draft

**Concern accepted.** The Persona Council found uneven accessibility and trust because transcript correction plus field-by-field confirmation can erase the promised time saving. Engineering found a bounded implementation feasible only after the shared proposal/write platform, at an incremental 7–11 engineer-weeks. Safety identified negation, temporality, speech bias, prompt injection, and fabricated/wrong-field facts as material risks. The red team correctly observed that N1 duplicates N2's write/recovery controls and N3's provenance/correction pattern.

**Response.** I do not defend N1 as a standalone capability. The fact that semantic mapping is a real model task does not establish net user benefit. Voice also cannot be its default: Phase 2 evidence was task-dependent, and the Phase 3 lenses show that hearing-independent interaction, transcript editing, motor effort, connectivity, and privacy all affect who benefits. Per-field confirmation is necessary for safety but is also the feature's main burden; that tradeoff must be measured rather than assumed away.

**Revised position: MERGE, with the model portion deferred to a bounded pilot.** N1 becomes one optional input route feeding the same canonical source/proposal component used by N3. It does not create a second record, summary, or review workflow.

**Revised MVP boundary.**

- No narrative model in the first production MVP. Ordinary form entry and N2 recovery ship first.
- A later experiment accepts **typed or pasted text only**, one proposal at a time, in **What Matters and Mobility only**.
- Each proposal displays exact source words, destination field, current value, proposed value, and **Keep / Change / Do not add**. No confidence percentage and no blanket approval.
- Deterministic code supplies allowlisted paths/types, blocks unsupported values, enforces expected revision/idempotency, performs the confirmed write, reads it back, and offers Undo.
- Exclude medication, Mentation interpretation, dates derived from vague relative language, caregiver-authored input, raw audio retention, learning across users, sharing, and emergency classification.
- Preserve an adjacent ordinary form and a copyable local draft. Cloud extraction waits for connectivity and must never be labeled saved.

**Evidence and kill decision.** Advance only if a representative, subgroup-reported study shows lower total time or interaction burden than direct form entry **without more wrong-field saves, corrections, distress, or abandonment**. Required safety results are zero writes without matching confirmation and zero out-of-schema fields. If correction burden is not materially lower for the users intended to benefit, withdraw the model path rather than expanding it to voice.

### N2 — Guided Completion and Recovery Companion

**Concern accepted.** Every review agreed that N2 has the broadest benefit while most of that benefit is ordinary accessibility and reliability. Calling it an adaptive AI companion would obscure the real work and invite behavioral profiling. The current repository makes save truth especially consequential because save errors can be swallowed, progress can be incorrect, and completion semantics are incomplete.

**Response.** I withdraw “adaptive” AI help from the MVP. Reliable state, predictable focus, one-question presentation, consistent help, error recovery, and explicit preferences are not personalization problems for a model to solve. Interaction speed, repeated actions, inactivity, voice, or mistakes must never become a confusion/cognition score or transfer control to a caregiver.

**Revised position: KEEP AS NON-AI FOUNDATION.** N2 is a prerequisite for N1, N3, and N4, but it should not receive agentic-advantage credit unless a later natural-language help experiment proves incremental value.

**Revised MVP boundary.**

- Fully deterministic, user-invoked **Completion and Recovery Mode** with remaining-item count, required/optional state, one-question view, **Not sure**, Skip where allowed, Save, Stop, Retry, Copy answer, and Return to full view.
- Show exact resume point and last **verified** server save; distinguish local draft, pending, saved online, conflict, and failed. Never claim cloud persistence before read-back.
- Keep Back/Save/Stop visible with predictable focus restoration, live status, 400% reflow, keyboard/switch/touch/screen-reader support, and hearing-independent feedback.
- Provide fixed plain-language examples and persistent **Stop helping / Do not offer again**. No chat dependency or provider call in a recovery path.
- If coarse triggers are tested later, process them locally, expire them at session end, state why the offer appeared, and do not retain a behavior profile. User-invoked help remains the default.
- No auto-answer, auto-submit, validation bypass, forced completion, caregiver completion status, clinical inference, or emergency inference from inactivity/navigation.

**Evidence and kill decision.** Test saved-state truth under network loss, two tabs/devices, stale revisions, sign-out/shared device, and corrupted checkpoints. Compare any later AI paraphrase with fixed help on task success, errors, time, dismissals, dignity, and subgroup burden. If it does not outperform fixed copy, remove it. N2 remains valuable without any model.

### N3 — Plain-Language Readback and Readiness Check

**Concern accepted.** Review fatigue can make a second representation of every answer more burdensome than the original form. Fluent summaries can omit uncertainty, change emphasis or negation, stigmatize Mentation content, or look clinically validated. False conflict flags may pressure users to erase two compatible facts. Storing generated prose also expands the health-data footprint. N3 and N4 would conflict if both owned their own summaries.

**Response.** N3 must be the **single canonical review and correction layer**, not a second health record. Most readiness work is deterministic. Model use is justified only when shortening free text measurably improves comprehension without losing meaning. N4 consumes a version-matched, user-selected view of N3's source data; it does not generate a competing summary.

**Revised position: KEEP, NARROW.** Start deterministic. Introduce model-assisted compression only by domain and only after extractive/template comparison.

**Revised MVP boundary.**

- First release: deterministic field list, missing/format/duplicate/progress/scanner-status checks, source-linked **Change this answer**, exact return-to-sentence focus, answer revision/time, and field-list fallback.
- Medication names/doses remain verbatim and deterministic. The system does not explain medical meaning.
- Optional pilot: shorten free text in **What Matters and Mobility only**. Every sentence must cite all supporting field IDs/source spans and preserve negation, numbers, dates, uncertainty, and the person's preferred words.
- Label the view **“Summary of what you entered—not medical interpretation or clinician review.”** Ask **“Did the app get this right?”**, not a teach-back question about the person's comprehension.
- Show source and paraphrase together, one item at a time; allow **Keep as written, Skip, Do not ask again, Stop and resume**. Cap clarifications at three per review.
- Deterministic rules identify only a small clinically reviewed set of possible tensions and must say that both answers may be true. No readiness/quality score, diagnosis, normal/safe/no-concern language, trend, capacity inference, or resolution of disagreement.
- Regenerate rather than retain duplicate full-health prose where feasible; persist only minimal version/confirmation/correction metadata under a disclosed schedule.

**Evidence and kill decision.** Unsupported claims, altered negation/number/date, and softened urgent wording are severity-zero-tolerance failures in the governed evaluation set. Test source-review time, correction success, omissions, perceived judgment, and subgroup burden against the deterministic field review. For any domain where templates are as understandable or the model increases errors/time, keep the deterministic version only.

### N4 — What-Matters-Led Visit Preparation Packet

**Concern accepted.** The existing app already exports a report, so a new packet is valuable only if it helps the older adult raise chosen priorities. Generated questions can steer, omissions can suppress concerns, polished output can imply clinician authorship, and export/share can disclose sensitive data. Requiring many inclusion and confirmation decisions can become another questionnaire. Tagged PDF, email, EHR, calendar, clinician messaging, and recipient workflows are not available or justified prerequisites.

**Response.** N4 should be the portfolio's **only outward artifact** and consume N3's canonical source/provenance components. The older adult, not the model, selects the lead priority and final content. Local use avoids the false claim that a provider received or reviewed anything. N4 does not depend on N5–N12.

**Revised position: KEEP, NARROW.** The MVP is an editable local preparation artifact, not a communication or interoperability agent.

**Revised MVP boundary.**

- Produce one accessible HTML/plain-text packet, with an accessible large-print style. Do not promise tagged PDF; browser print-to-PDF is not evidence of PDF accessibility.
- Require one user-selected What Matters priority. Include only user-selected, version-matched 4Ms statements; the medication list is labeled **patient-entered, not reconciled or verified**.
- Add up to three editable questions, optional communication/access needs, a small ordinary Mobility visit checklist (transport/entrance/seating questions and backup contact), and blank notes space.
- Merge N12's safe residue as fixed **Values and Questions** prompts: what matters, what is unclear, and what the person wants to ask. No option comparison or treatment recommendation.
- Every generated/condensed item links to its N3 source. The user can include, exclude, edit, reorder with buttons, or keep original wording. No opaque importance ranking.
- Preview the exact artifact and label it **“My notes for discussion—not medical instructions; not reviewed by the clinic.”** Local print/download only; native share may remain an OS-controlled optional convenience but is not recorded as successful delivery.
- No email, caregiver copy, EHR/portal send, appointment booking, calendar OAuth, automatic urgency ranking, external mobility/map data, or server retention of exported files by default.

**Evidence and kill decision.** Compare against the existing report on whether participants can identify and raise their chosen priority, understand provenance/disclaimers, exclude sensitive content, and use the artifact with assistive technology. Download count is not success. If packet review burden exceeds the benefit or users commonly mistake it for clinician-approved advice, revert to the deterministic report plus fixed preparation template.

### N7 — Consent-Governed Care Circle Task

**Concern accepted.** N7 is not mainly an AI feature. It is a high-risk identity, authorization, safeguarding, elder-abuse, accessible-consent, legal-authority, account-recovery, and support-operations program. The existing caregiver email proves neither identity nor permission. Generated wording cannot make coerced consent valid, and a polished granular-permission UI cannot by itself resolve shared devices, impersonation, incapacity, disputed authority, or private revocation.

**Response.** I withdraw N7 from the near-term product portfolio. Least-privilege delegation may ultimately be safer than shared credentials, but that comparative possibility is not evidence that this repository can safely ship it. Keeping caregiver participation absent from the first portfolio better protects P7 and prevents supporter infrastructure from delaying older-adult-controlled N2–N4.

**Revised position: DEFER; SAFEGUARDING RESEARCH ONLY.** AI has no role in identity, authority, scope, permission text, or grant execution. Any later language assistance may explain a professionally authored permission but cannot change it.

**Revised research boundary.**

- One authenticated supporter, one predefined medication-name-checking task, one domain, read/comment or propose-only, fixed 14-day expiry.
- No Mentation, chat, location, full dashboard, direct edits, recurring access, missed-response/fall alerts, medication decisions, or authority inferred from profile data.
- Professionally authored concrete permission receipt and supporter-view preview; no prechecked sharing; step-up authentication; attributed access/proposals; older-adult approval for every change; private immediate revoke.
- Treat **no supporter access** as a valid successful outcome. Do not disclose to the proposed supporter why a flow stopped.
- Independent privacy/legal, safeguarding/elder-abuse, security, clinical, and accessibility review plus abuse-response operations are hard gates.

**Evidence and stop decision.** Any scope violation, wrong identity, unclear authorship/revocation, inaccessible consent, coercion signal without a safe private exit, or inability to wipe revoked cached data stops the prototype. Production expansion requires a fresh review; usability satisfaction is insufficient. This work is not on the MVP roadmap.

### N8 — What-Matters Goal and Reminder Steward

**Concern accepted.** The broad “goal steward” can become a generic coaching chatbot that proposes infeasible or moralizing actions without knowing finances, restrictions, transport, support, or context. Its useful actions—create, schedule, deliver, pause, delete—are deterministic and duplicate N2 resume and N4 preparation. Multiple reminder surfaces would create competing queues, quiet-hour conflicts, alert fatigue, and surveillance risk. The current blanket email scheduler is unsafe and must be replaced, not extended.

**Response.** I withdraw open-ended goal decomposition and recurring coaching. Natural-language time interpretation is optional convenience, not the schedule source of truth. There should be one shared notification preference surface, queue, rate limit, privacy-safe template system, history, and cancellation mechanism across the app.

**Revised position: MERGE INTO N2/N4; NARROW TO ONE-TIME DETERMINISTIC REMINDERS.** Do not score it as a separate near-term AI capability.

**Revised MVP boundary.**

- Initial purposes only: **resume my questionnaire** and **review my visit packet**.
- Default to a one-time reminder. The accessible date/time picker is authoritative. If language parsing is later tested, it may fill a proposal but the user confirms absolute date, time, timezone, channel, and lock-screen-safe message.
- One verified channel chosen during the scheduler spike; no assumption that in-app, email, push, or SMS is universally suitable. Show prepared/queued/delivered/failed truth without equating delivery with reading.
- Enforce timezone/DST normalization, quiet hours, expiry, idempotency, duplicate prevention, bounded retry, no recovery burst, visible next action/history, and large Pause/Stop/Delete controls with verified cancellation.
- Generic notification text by default. No health domain, goal detail, caregiver copy, recurrence, medication-dose reminder, streak, adherence/welfare inference, escalating frequency, or nonresponse escalation.
- Offline view may show the plan/history but cannot claim that a server schedule or cancellation succeeded.

**Evidence and kill decision.** Test DST/timezone changes, duplicate clicks/tasks, cancel-versus-dispatch races, provider outage/bounce, quiet-hour crossings, shared-device privacy, notification accessibility, and user comprehension of delivery status. Any duplicate/quiet-hour violation, unverified cancellation, or health-detail lock-screen leak blocks release. If no reliable active channel is available, retain an on-device visible plan without promising proactive delivery.

## Portfolio-level response

### One canonical source and correction contract

The red-team concern about parallel representations is decisive. Questionnaire fields remain the canonical user record. N1 creates only short-lived proposals. N3 owns source-linked review and correction. N4 renders a selected, version-matched artifact from those fields. Generated prose never becomes an independent authoritative record. Every component uses the same source identifiers, revision checks, before/after display, and correction route.

### Confirmation budget

“Human in the loop” can transfer model risk into user burden. The portfolio will set and test a confirmation budget:

- one item at a time for N1/N3 corrections;
- at most three N1 proposals or N3 clarifications in one session;
- no repeated approval of unchanged facts when moving from N3 to N4;
- source and proposed effect in the same viewport, with 400% reflow rather than a desktop-only side-by-side requirement;
- Stop/save/resume on every review surface;
- **Keep as written / No result / Not sure / Cancel** counted as valid outcomes, not failures;
- subgroup-reported time, corrections, abandonment, Undo, and distress thresholds defined before rollout.

If the combined review burden is not lower than the direct deterministic workflow for the intended users, model assistance is removed or narrowed.

### Accessibility is a release gate, not a workstream after AI

WCAG 2.2 is necessary but insufficient. Every primary and failure path—correction, stale revision, provider/model outage, save conflict, export failure, notification cancellation, and later revocation—must work by keyboard, touch, switch, screen reader, zoom/reflow, and without hearing or speech. Voice remains optional and does not confirm disclosure, permissions, recurring actions, or writes. Testing must include the Phase 3 lenses and intersections rather than reporting only aggregate usability.

### Foundation and sequencing accepted

No L2–L4 work starts on the current substrate. The Phase 4 security/safety gates are prerequisites: rotate/scrub exposed credentials; owner-scope Firestore; authenticate and authorize every endpoint; narrow CORS; consolidate backends; redact logs; user-scope browser state; fix save/scanner truth; separate hostile data from instructions; and implement typed schemas, source revisions, idempotency, exact confirmation, read-back, audit, retention/deletion, Undo/Revoke, deterministic emergency handling, provider fallback, and automated security/accessibility tests.

The revised sequence is:

1. Security, save/scanner truth, privacy, accessible interaction, and test foundations.
2. N2 deterministic Completion and Recovery Mode.
3. N3 deterministic readiness/correction; only then test bounded free-text compression.
4. N4 local accessible visit packet reusing N3 sources.
5. Shared one-time reminder service for N2/N4 if the channel/scheduler safety spike succeeds.
6. Optional N1 typed narrative comparative pilot.
7. N7 remains outside this roadmap.

## Final revised recommendation

The accessibility discovery agent supports a portfolio of **one non-AI foundation and two narrowly AI-assisted outcomes**: deterministic N2, source-linked N3, and local N4. N1 is an experiment inside that workflow, not another agent. N8 is shared scheduling infrastructure, not a coach. N7 is deferred research, not a feature awaiting implementation.

This revision preserves the original goals—lower interaction burden, readable review, dignified control, multimodal parity, and practical visit preparation—while accepting that ordinary accessible design is often the correct technology. The remaining model calls must earn their place through comparative evidence, source fidelity, subgroup accessibility, and measurable burden reduction; otherwise the deterministic path is the product.
