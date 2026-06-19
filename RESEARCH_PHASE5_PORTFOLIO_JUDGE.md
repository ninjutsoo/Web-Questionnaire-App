# Phase 5 Portfolio Judge — Independent Ranking of Revised N1–N12

**Prepared:** 2026-06-17  
**Role:** Independent Portfolio Judge  
**Scope:** Revised N1–N12 only; no application changes

## Decision

The strongest coherent portfolio is **N2 Completion and Recovery Mode**, **N3 Review My Answers**, and **N4 What-Matters-Led Visit Packet**, in that dependency order. N2 is primarily deterministic accessibility and reliability work, not an AI feature. N3 and N4 should also launch with deterministic fallbacks; their model-assisted portions survive only if comparative testing shows lower burden without loss of fidelity.

This is deliberately not the four highest-scoring candidates. **N8 ranks fourth but should not be a standalone feature**: its useful residue is a later shared one-time reminder utility, and adding it now would require a 5–8 engineer-week notification foundation, an unresolved active-channel decision, and another confirmation surface. N1 should remain a later experiment inside N2/N3. N12's generic values/questions and N11's small mobility/access checklist are absorbed into N4 rather than counted as separate capabilities.

No candidate receives a formal safety veto because the Phase 4 Safety Reviewer assigned no **Reject** disposition. N11 was **Reject** only in the Red-Team product review; that is a strong portfolio exclusion, but it is not the rubric's safety veto.

## Method

I reviewed the master prompt, validated repository context, normalized candidates, Persona Council, Engineering, Safety, and Red-Team reviews, and all four Phase 5 rebuttals. Scores apply to the **revised, narrowed boundary**, not the broader Phase 2 concept. A merged or withdrawn concept is still ranked so dissent is preserved; its usefulness, fit, agentic advantage, and differentiation are reduced when its safe residue belongs inside another feature.

Weights are exactly those in the master prompt:

| Abbreviation | Criterion | Weight |
|---|---|---:|
| U | Older-adult usefulness and burden reduction | 20 |
| A | Accessibility and inclusion | 12 |
| D | Autonomy, dignity, trust, and consent | 10 |
| S | Clinical/safety appropriateness | 15 |
| F | Fit with the current 4Ms app and available data | 12 |
| E | Engineering feasibility within 6–12 months | 12 |
| G | Agentic advantage over non-AI alternatives | 8 |
| M | Measurable health/workflow value | 6 |
| W | Differentiation / responsible “wow” value | 5 |

For every candidate:

`Total = (U/5×20) + (A/5×12) + (D/5×10) + (S/5×15) + (F/5×12) + (E/5×12) + (G/5×8) + (M/5×6) + (W/5×5)`

The accessibility/autonomy/safety eligibility check is **A ≥ 3, D ≥ 3, and S ≥ 3**. “Pass” does not waive the common F0 security, privacy, save-truth, action-boundary, accessibility, and evaluation prerequisites. A failed threshold receives no portfolio exception unless a roadmap prerequisite directly corrects the failing dimension.

### Explicit dependency penalties

- N5 is penalized because RxNorm/openFDA are terminology references, not a current patient-specific pharmacy record; pharmacy, EHR, claims, OCR, and pharmacist validation are unavailable.
- N6 is penalized because the repository has one mutable answer record, not two trustworthy immutable snapshots.
- N7 is penalized for unresolved identity, representative authority, coercion/safeguarding policy, support operations, and a separate 18–28 engineer-week program.
- N8 is penalized for the missing consent-aware scheduler and unresolved reliable notification channel.
- N9 is penalized because governed source ingestion, OCR, EHR/portal access, and a validated administrative/clinical classifier do not exist.
- N10 receives the largest data penalty: no funded regional directory partner, contract, coverage evidence, freshness operation, accessibility-channel data, or human navigation fallback exists.
- N11 is scored only at its revised manual-checklist boundary; reliable route, venue-accessibility, transit, and weather data are unavailable.
- N12 is scored only as a generic values/questions residue because no governed decision-aid catalog, content owner, or validated decision-specific source exists.

## Full ranked matrix

All nine criterion cells are raw **1–5** scores.

| Rank | ID | Revised candidate | U | A | D | S | F | E | G | M | W | Total /100 | Confidence | Evidence strength |
|---:|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|---|
| 1 | N2 | Deterministic Completion and Recovery Mode | 5 | 5 | 5 | 5 | 5 | 5 | 1 | 5 | 2 | **90.6** | High | Moderate–strong |
| 2 | N4 | What-Matters-Led Visit Preparation Packet | 5 | 5 | 5 | 4 | 5 | 4 | 3 | 4 | 4 | **89.2** | Medium–High | Moderate |
| 3 | N3 | Review My Answers / Source-Linked Readiness | 5 | 5 | 5 | 4 | 5 | 4 | 2 | 5 | 3 | **87.8** | Medium–High | Moderate |
| 4 | N8 | Shared One-Time Reminder Utility | 4 | 4 | 5 | 4 | 4 | 3 | 1 | 4 | 2 | **72.8** | Medium | Moderate–low |
| 5 | N1 | Typed Narrative-to-Form Experiment | 3 | 3 | 4 | 3 | 4 | 3 | 4 | 4 | 4 | **68.2** | Medium | Low–moderate |
| 6 | N6 | Deterministic Two-Snapshot 4Ms Diff | 3 | 4 | 5 | 4 | 2 | 4 | 1 | 3 | 2 | **65.2** | Medium | Moderate–low |
| 7 | N5 | Patient-Reported Medication List Quality Check | 5 | 3 | 4 | 2 | 3 | 2 | 2 | 4 | 3 | **64.2** | Low–Medium | Low–moderate |
| 8 | N9 | Pasted-Text Administrative Task Study | 4 | 3 | 4 | 2 | 3 | 2 | 4 | 3 | 3 | **62.2** | Low | Low |
| 9 | N12 | Generic Values and Questions Residue | 2 | 4 | 5 | 2 | 3 | 5 | 1 | 2 | 1 | **57.8** | Medium | Low–moderate |
| 10 | N10 | Regional Support Navigator Pilot | 4 | 2 | 4 | 2 | 1 | 1 | 3 | 3 | 4 | **52.0** | Low | Low |
| 11 | N11 | Manual Mobility Visit Checklist Residue | 2 | 3 | 4 | 2 | 3 | 4 | 1 | 2 | 1 | **51.0** | Medium | Low–moderate |
| 12 | N7 | Care-Partner Delegation Research Prototype | 3 | 2 | 2 | 2 | 2 | 1 | 1 | 3 | 3 | **42.2** | Low | Low–moderate |

“Moderate–strong” evidence for N2 means strong repository evidence of save/recovery defects plus consistent accessibility guidance and cross-review agreement; it does **not** mean direct evidence of improved health outcomes. No candidate has direct efficacy evidence in this application.

## Candidate judgments and score math

### 1. N2 — Deterministic Completion and Recovery Mode — 90.6

**Formula:** `(5/5×20) + (5/5×12) + (5/5×10) + (5/5×15) + (5/5×12) + (5/5×12) + (1/5×8) + (5/5×6) + (2/5×5) = 20 + 12 + 10 + 15 + 12 + 12 + 1.6 + 6 + 2 = 90.6`.

**Safety:** Proceed with mandatory safeguards. **Safety veto:** No.  
**Threshold:** A=5, D=5, S=5 — **Pass**. No exception needed. F0 runtime/data repairs, truthful read-back, and older-adult accessibility testing remain mandatory prerequisites.  
**Confidence/evidence:** High confidence; moderate–strong evidence.

It directly addresses confirmed save-error, progress, completion, focus, and recovery defects and benefits all eight persona lenses. The 1/5 agentic score is intentional: the revised MVP is better as deterministic state and accessible interaction. Its high total should not be misrepresented as evidence for an AI agent.

### 2. N4 — What-Matters-Led Visit Preparation Packet — 89.2

**Formula:** `(5/5×20) + (5/5×12) + (5/5×10) + (4/5×15) + (5/5×12) + (4/5×12) + (3/5×8) + (4/5×6) + (4/5×5) = 20 + 12 + 10 + 12 + 12 + 9.6 + 4.8 + 4.8 + 4 = 89.2`.

**Safety:** Proceed with mandatory safeguards. **Safety veto:** No.  
**Threshold:** A=5, D=5, S=4 — **Pass**. No exception needed. F0 and N3's source/provenance contract are prerequisites.  
**Confidence/evidence:** Medium–High confidence; moderate evidence.

This is the most tangible outward outcome and uses questionnaire, report, print, and download seams already present. The user selects the priority and final content; accessible HTML/plain text and local export avoid unavailable EHR, calendar, clinician-delivery, and caregiver workflows. AI advantage is bounded to source-linked condensation or question drafting and must beat the existing deterministic report.

### 3. N3 — Review My Answers / Source-Linked Readiness — 87.8

**Formula:** `(5/5×20) + (5/5×12) + (5/5×10) + (4/5×15) + (5/5×12) + (4/5×12) + (2/5×8) + (5/5×6) + (3/5×5) = 20 + 12 + 10 + 12 + 12 + 9.6 + 3.2 + 6 + 3 = 87.8`.

**Safety:** Proceed with mandatory safeguards. **Safety veto:** No.  
**Threshold:** A=5, D=5, S=4 — **Pass**. No exception needed. F0, revision-safe writes, source coverage, and zero-tolerance fidelity tests are prerequisites.  
**Confidence/evidence:** Medium–High confidence; moderate evidence.

N3 creates the canonical review/correction layer reused by N4 and possible later experiments. Most value is deterministic missing/format/duplicate/scanner-status checking and direct correction. Model use earns only 2/5 because it is optional free-text compression; unsupported facts, altered negation/numbers/dates, or higher review burden should remove it.

### 4. N8 — Shared One-Time Reminder Utility — 72.8

**Formula:** `(4/5×20) + (4/5×12) + (5/5×10) + (4/5×15) + (4/5×12) + (3/5×12) + (1/5×8) + (4/5×6) + (2/5×5) = 16 + 9.6 + 10 + 12 + 9.6 + 7.2 + 1.6 + 4.8 + 2 = 72.8`.

**Safety:** Proceed with mandatory safeguards. **Safety veto:** No.  
**Threshold:** A=4, D=5, S=4 — **Pass**. No exception needed. F1 consent-aware scheduling, one verified channel, quiet hours, delivery truth, and verified cancellation are prerequisites.  
**Confidence/evidence:** Medium confidence; moderate–low evidence.

The narrowed resume/packet-review reminder has repeat value and preserves autonomy, but it is deterministic infrastructure, not a Goal Steward. The current reminder system is unsafe and must be replaced. It is excluded from the initial portfolio to avoid premature notification burden and a 9–15 engineer-week program total; it may be added later as one shared utility.

### 5. N1 — Typed Narrative-to-Form Experiment — 68.2

**Formula:** `(3/5×20) + (3/5×12) + (4/5×10) + (3/5×15) + (4/5×12) + (3/5×12) + (4/5×8) + (4/5×6) + (4/5×5) = 12 + 7.2 + 8 + 9 + 9.6 + 7.2 + 6.4 + 4.8 + 4 = 68.2`.

**Safety:** Proceed with mandatory safeguards. **Safety veto:** No.  
**Threshold:** A=3, D=4, S=3 — **Pass at the floor**. No exception needed, but entry requires N2/N3 controls, typed/pasted input only, What Matters/Mobility only, one proposal at a time, per-field confirmation, and a comparative burden study.  
**Confidence/evidence:** Medium confidence; low–moderate evidence.

Semantic mapping is a genuine model task and offers responsible differentiation, but transcript/proposal review may cost more than direct form entry. The revised concept is not a standalone product. Excluding voice and medication reduces risk but also narrows immediate benefit. Remove it if target users do not complete tasks faster with no increase in wrong-field saves or corrections.

### 6. N6 — Deterministic Two-Snapshot 4Ms Diff — 65.2

**Formula:** `(3/5×20) + (4/5×12) + (5/5×10) + (4/5×15) + (2/5×12) + (4/5×12) + (1/5×8) + (3/5×6) + (2/5×5) = 12 + 9.6 + 10 + 12 + 4.8 + 9.6 + 1.6 + 3.6 + 2 = 65.2`.

**Safety:** Proceed with mandatory safeguards. **Safety veto:** No.  
**Threshold:** A=4, D=5, S=4 — **Pass**. No exception needed, but two real immutable, version-compatible snapshots are a hard data prerequisite.  
**Confidence/evidence:** Medium confidence; moderate–low evidence.

Exact user-selected comparison is understandable, private, and feasible, but the necessary history does not exist and value is delayed until repeated assessments occur. Its first slice is deterministic and should feed N4 only when the user chooses; causal, decline, risk, and alert language remain prohibited.

### 7. N5 — Patient-Reported Medication List Quality Check — 64.2

**Formula:** `(5/5×20) + (3/5×12) + (4/5×10) + (2/5×15) + (3/5×12) + (2/5×12) + (2/5×8) + (4/5×6) + (3/5×5) = 20 + 7.2 + 8 + 6 + 7.2 + 4.8 + 3.2 + 4.8 + 3 = 64.2`.

**Safety:** Research/pilot only. **Safety veto:** No.  
**Threshold:** A=3, D=4, S=2 — **Fail safety**. **No portfolio exception claimed.** A future reconsideration requires the directly corrective prerequisite: pharmacist-led rules/corpus/adjudication, scanner false-success repair, conservative unresolved states, and evidence of no medication-behavior harm.  
**Confidence/evidence:** Low–Medium confidence; low–moderate evidence.

The user need is high, but the app cannot verify or reconcile a regimen. Dense comparison creates accessibility burden, and public terminology sources do not supply current patient truth. The safe near-term residue—verbatim patient-entered list, missing-field labels, and questions for a professional—belongs in N3/N4; matching remains a controlled pilot.

### 8. N9 — Pasted-Text Administrative Task Study — 62.2

**Formula:** `(4/5×20) + (3/5×12) + (4/5×10) + (2/5×15) + (3/5×12) + (2/5×12) + (4/5×8) + (3/5×6) + (3/5×5) = 16 + 7.2 + 8 + 6 + 7.2 + 4.8 + 6.4 + 3.6 + 3 = 62.2`.

**Safety:** Research/pilot only. **Safety veto:** No.  
**Threshold:** A=3, D=4, S=2 — **Fail safety**. **No portfolio exception claimed.** A clinician-authored administrative allowlist, governed source ingestion, exact anchors, harm-case corpus, and zero dangerous operationalization are direct prerequisites for reconsideration.  
**Confidence/evidence:** Low confidence; low evidence.

Task extraction is a real model advantage, but clinical/administrative boundaries, negation, dates, and conditions make errors consequential. Pasting and checking source text can add more work than a manual checklist. OCR, EHR, messaging, and reminders are unavailable and correctly excluded; without them the concept remains a narrow study, not a “closed loop.”

### 9. N12 — Generic Values and Questions Residue — 57.8

**Formula:** `(2/5×20) + (4/5×12) + (5/5×10) + (2/5×15) + (3/5×12) + (5/5×12) + (1/5×8) + (2/5×6) + (1/5×5) = 8 + 9.6 + 10 + 6 + 7.2 + 12 + 1.6 + 2.4 + 1 = 57.8`.

**Safety:** Research/pilot only. **Safety veto:** No.  
**Threshold:** A=4, D=5, S=2 — **Fail safety**. **No standalone exception claimed.** The generic deterministic prompts can be safely absorbed into N4 only with fixed neutral wording and no treatment options, comparison, risk calculation, recommendation, consent, or send. A decision-specific product would require a governed complete decision aid and fresh clinical review.  
**Confidence/evidence:** Medium confidence; low–moderate evidence.

The safe generic residue strongly supports autonomy and is easy to build, but it duplicates N4 and has almost no agentic or differentiated value. The clinically differentiated version lacks governed content and can steer decisions. Its low standalone usefulness and “wow” scores reflect the Phase 5 merge, not dismissal of shared decision-making as a goal.

### 10. N10 — Regional Support Navigator Pilot — 52.0

**Formula:** `(4/5×20) + (2/5×12) + (4/5×10) + (2/5×15) + (1/5×12) + (1/5×12) + (3/5×8) + (3/5×6) + (4/5×5) = 16 + 4.8 + 8 + 6 + 2.4 + 2.4 + 4.8 + 3.6 + 4 = 52.0`.

**Safety:** Research/pilot only. **Safety veto:** No.  
**Threshold:** A=2, D=4, S=2 — **Fail accessibility and safety**. **No portfolio exception claimed.** A funded named regional partner, maintainable directory, freshness/correction owner, accessible-channel fields, rural/equity coverage, and human fallback would directly address the failures before a bounded pilot.  
**Confidence/evidence:** Low confidence; low evidence.

The need and potential differentiation are real, but the scarce asset is a maintained directory and operations program, not an LLM. The repository's geocoder is not a service directory. Rural no-result rates, inaccessible channels, false eligibility, and stale data could concentrate harm among users with the highest need, warranting F=1 and E=1.

### 11. N11 — Manual Mobility Visit Checklist Residue — 51.0

**Formula:** `(2/5×20) + (3/5×12) + (4/5×10) + (2/5×15) + (3/5×12) + (4/5×12) + (1/5×8) + (2/5×6) + (1/5×5) = 8 + 7.2 + 8 + 6 + 7.2 + 9.6 + 1.6 + 2.4 + 1 = 51.0`.

**Safety:** Research/pilot only. **Safety veto:** No. **Red-Team disposition:** Reject as a standalone AI feature.  
**Threshold:** A=3, D=4, S=2 — **Fail safety**. **No standalone exception claimed.** The small user-entered access/logistics checklist can enter N4 as a deterministic optional section precisely because it removes destination retention, external facts, route claims, tracking, booking, and separate-agent status.  
**Confidence/evidence:** Medium confidence; low–moderate evidence.

The honest revised implementation is feasible but narrow and non-agentic. The richer version depends on unavailable and geographically unequal route, venue, transit, and weather facts and can imply safety. Absorption into N4 avoids a duplicate artifact and confirmation workflow.

### 12. N7 — Care-Partner Delegation Research Prototype — 42.2

**Formula:** `(3/5×20) + (2/5×12) + (2/5×10) + (2/5×15) + (2/5×12) + (1/5×12) + (1/5×8) + (3/5×6) + (3/5×5) = 12 + 4.8 + 4 + 6 + 4.8 + 2.4 + 1.6 + 3.6 + 3 = 42.2`.

**Safety:** Research/pilot only. **Safety veto:** No.  
**Threshold:** A=2, D=2, S=2 — **Fail all three thresholds**. **No portfolio exception claimed.** A separate identity, authorization, elder-abuse/safeguarding, representative-authority, accessible-consent, support, and private-revocation program is required before even a narrow prototype; professionally authored permissions and deterministic authorization leave little necessary AI role.  
**Confidence/evidence:** Low confidence; low–moderate evidence.

Least-privilege support could be valuable, but nominal granular consent does not resolve coercion, impersonation, shared devices, disputed authority, or inaccessible permission flows. The existing caregiver email grants nothing. This is the largest governance program and the weakest 6–12 month project fit; it must not delay older-adult-controlled core work.

## Recommended three-capability portfolio

### 1. N2 Completion and Recovery Mode

Build first as the shared deterministic substrate: truthful pending/saved/failed state, exact resume, one-question mode, fixed help, predictable focus, Not sure/Skip/Stop, and accessible recovery. It reduces burden before any model call and makes later confirmation trustworthy.

### 2. N3 Review My Answers

Build on N2 and make it the only canonical source/provenance/correction layer. Begin with deterministic field rendering and checks. Test source-bound What Matters/Mobility condensation against templates; remove the model wherever it does not reduce comprehension burden. No separate generated health record is retained.

### 3. N4 What-Matters-Led Visit Packet

Build on N3 and make it the only outward artifact. The older adult selects the lead priority, included fields, and up to three questions. Render accessible HTML/plain text with large-print styling and local print/download only. Absorb fixed values/questions from N12 and an optional user-entered mobility/access checklist from N11. Do not add sending, calendar, EHR, booking, external mobility facts, or caregiver access.

### Portfolio dependency and burden controls

`F0 secure/reliable foundation → N2 → N3 → N4`

- Complete F0 before real-user L2/L3 work: rotate the exposed secret; owner-scope Firestore; authenticate/authorize endpoints; consolidate backends; redact logs; user-scope storage; fix save/progress/completion and scanner truth; isolate untrusted content; add typed actions, revision checks, idempotency, audit/undo, retention/deletion, deterministic emergency boundaries, tests, and monitored rollout.
- Keep one canonical assessment revision, one source display, one correction mechanism, and one packet renderer.
- Never require reapproval of unchanged facts. Show one derived item at a time when requested, cap N3 clarifications and N4 drafted questions at three, and provide Stop/Keep as written/Cancel/Resume everywhere.
- Launch without proactive reminders. Reconsider N8 later as one shared utility only after the core flow demonstrates value and F1 passes delivery, privacy, DST, duplicate, quiet-hour, and cancellation tests.
- Pilot N1 only inside N2/N3 after the core correction contract exists. Do not add N5, N7, N9, or N10 to the same pilot; their professional, safeguarding, source, and partnership dependencies would multiply consent and verification burden.
- Selected candidates all pass A/D/S thresholds. F0 is a release prerequisite, not an exception used to rescue a below-threshold score.

## Final judgment

The full ranking favors a modest sequence over a broad cast of agents. N2–N4 cover completion, trustworthy review, and visit preparation using data and UI seams the repository already has. They share infrastructure, avoid unavailable partnerships, and impose one correction path and one export decision. The responsible “wow” is fidelity and restraint: the app preserves the older adult's words, makes correction easy, and creates a useful What-Matters-led artifact without silently interpreting, sharing, monitoring, or acting on clinical information.
