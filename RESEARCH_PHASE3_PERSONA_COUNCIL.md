# Phase 3 Persona Council

**Prepared:** 2026-06-17  
**Scope:** Evaluation of normalized candidates N1-N12 only; no application changes  
**Repository basis:** `RESEARCH_PHASE1_REPOSITORY_CONTEXT.md`, all four Phase 2 specialist reports, and `RESEARCH_NORMALIZED_CANDIDATES.md`

## Council method and limits

The eight personas below are evidence-informed design lenses, not demographic predictions and not claims that this council speaks for all older adults. A person may fit several lenses, none of them, or move between them over time. Scores represent the candidate **after the named adjustments**, but still assume the shared security, save-reliability, consent, accessibility, and action-audit prerequisites in the Phase 1 and Phase 2 reports. A high score is not permission to ship.

The council applied these lenses:

- **P1:** independent, technology-comfortable older adult managing several medications.
- **P2:** older adult with low vision and reduced fine-motor control.
- **P3:** older adult with hearing loss who cannot rely on audio.
- **P4:** older adult with mild cognitive impairment or a high memory burden.
- **P5:** older adult with low health literacy and low technology confidence.
- **P6:** rural or low-income user with intermittent connectivity and limited services.
- **P7:** privacy-valuing older adult who does not want automatic caregiver disclosure.
- **P8:** authorized family caregiver supporting an older adult without replacing that person's autonomy.

The evidence supports accessible, multimodal, low-burden design and co-design with affected users; it does not establish that these AI capabilities improve health outcomes. W3C treats many older-user needs as overlapping with disability accessibility and recommends involving older people and people with disabilities in design and testing ([WAI: Older People and Web Accessibility](https://www.w3.org/WAI/older-users/)). WCAG 2.2 and W3C cognitive-accessibility guidance support visible focus, adequate target size, consistent help, error prevention, clear purpose, familiar language, feedback, and memory support ([WCAG 2.2](https://www.w3.org/TR/WCAG22/); [Cognitive and Learning Disabilities Accessibility Guidance](https://www.w3.org/TR/coga-usable/)). Plain language and organizational responsibility for health literacy are also central requirements ([CDC Plain Language](https://www.cdc.gov/health-literacy/php/develop-materials/plain-language.html); [Healthy People 2030: Health Literacy](https://odphp.health.gov/healthypeople/priority-areas/health-literacy-healthy-people-2030)).

Voice is an option, not an accessibility shortcut: existing studies report mixed task-dependent results and limited evidence for voice agents used by people with memory impairment ([PubMed 32442129](https://pubmed.ncbi.nlm.nih.gov/32442129/); [PubMed 32985999](https://pubmed.ncbi.nlm.nih.gov/32985999/); [PubMed 35468084](https://pubmed.ncbi.nlm.nih.gov/35468084/)). Every feature therefore needs complete visual, keyboard, touch, and screen-reader paths, including correction, confirmation, cancellation, and recovery.

## Cross-cutting council conditions

These conditions apply to every candidate and are not optional feature enhancements:

1. Fix owner-scoped Firestore rules, API authentication/authorization, exposed credentials, sensitive logging, origin-global browser storage, save-error suppression, scanner false-success behavior, and backend drift before any pilot involving personal data.
2. Keep all writes, sends, reminders, permission grants, and exports behind typed server-side tools. Model output is a proposal, never authorization.
3. Show the exact content, destination, timing, and consequence before consequential actions. Provide **Change**, **Cancel**, and, where technically possible, **Undo**, **Pause**, or **Revoke**.
4. Preserve source provenance and original user wording. Do not infer capacity, diagnosis, adherence, urgency, or caregiver authority from age, behavior, questionnaire responses, voice, or mistakes.
5. Provide a deterministic, usable low-bandwidth/no-AI fallback. Never call an unsaved draft saved, a provider-accepted email read, or an unverified record correct.
6. Co-design and test with people represented by all eight lenses, including intersectional cases and users of assistive technology. Report results by lens/modality rather than only an overall average.

## Full score table

Scores use 1 (poor) to 5 (strong). **IU** = immediate usefulness; **Ease** = ease of learning/use; **AIR** = accessibility and inclusive reach; **AD** = autonomy/dignity; **TT** = trust/transparency; **RV** = repeated real-world value. The total out of 30 is only a compact comparison; the persona findings below control interpretation and expose who is not served by a high total.

| ID | Candidate | IU | Ease | AIR | AD | TT | RV | Total /30 |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| N1 | Assisted Narrative-to-Form Draft | 4 | 3 | 3 | 4 | 3 | 4 | 21 |
| N2 | Guided Completion and Recovery Companion | 5 | 5 | 5 | 5 | 5 | 5 | 30 |
| N3 | Plain-Language Readback and Readiness Check | 5 | 4 | 5 | 5 | 4 | 5 | 28 |
| N4 | What-Matters-Led Visit Preparation Packet | 5 | 4 | 5 | 5 | 4 | 5 | 28 |
| N5 | Medication List Verification and Question Prep | 5 | 3 | 3 | 4 | 3 | 5 | 23 |
| N6 | Longitudinal 4Ms Change Review | 4 | 4 | 4 | 5 | 4 | 4 | 25 |
| N7 | Consent-Governed Care Circle Task | 3 | 2 | 3 | 4 | 3 | 4 | 19 |
| N8 | What-Matters Goal and Reminder Steward | 4 | 4 | 4 | 5 | 4 | 5 | 26 |
| N9 | After-Visit Follow-Through Organizer | 4 | 3 | 3 | 4 | 3 | 4 | 21 |
| N10 | Local Support Navigator and Warm Handoff | 4 | 3 | 3 | 4 | 3 | 4 | 21 |
| N11 | Door-to-Door Mobility Plan | 3 | 3 | 3 | 4 | 3 | 3 | 19 |
| N12 | Shared-Decision Conversation Builder | 3 | 3 | 3 | 5 | 3 | 3 | 20 |

### Score rationales

- **N1:** Natural expression can reduce typing and repeated entry, but speech recognition, semantic mapping, and repeated field confirmations create uneven accessibility and trust. Value rises for users with motor barriers and falls when correction is harder than ordinary form entry.
- **N2:** A deterministic, user-invoked one-question path, reliable save/resume, clear errors, and offline fallback help nearly every lens. Its 5s depend on avoiding behavioral profiling and retaining the non-AI fixed-help MVP if AI adds no measured benefit.
- **N3:** Source-linked readback turns the user's own answers into a broadly useful correction loop. Remaining risks are summarization omission, misplaced emphasis, and treating confirmation as a comprehension test.
- **N4:** A What-Matters-led, editable, printable packet creates an immediate real-world artifact from data the app already holds. Trust is 4 because generated questions can mislead and sharing can expose sensitive content unless source links and separate destination confirmation are excellent.
- **N5:** Medication-list uncertainty is urgent and recurrent for P1 and many caregivers, but dense comparisons, scanner/OCR errors, terminology, and clinical overreliance lower ease, reach, and trust. It must remain a patient-reported verification aid, not medication reconciliation or advice ([medication review/reconciliation overview](https://pubmed.ncbi.nlm.nih.gov/33583002/)).
- **N6:** Neutral comparison of two user-selected snapshots supports continuity without surveillance. It is not immediately useful until multiple immutable assessments exist, and numeric/free-text changes can create anxiety or false causal narratives.
- **N7:** Least-privilege delegation could preserve autonomy better than shared credentials, but permission comprehension, identity verification, coercion, and digital access make the flow hard and potentially exclusionary. Research on shared portal access likewise identifies both support value and privacy/equity concerns ([JMIR Aging](https://pubmed.ncbi.nlm.nih.gov/35507405/)).
- **N8:** User-owned goals and explicit, privacy-safe reminders can provide repeated value, especially for memory burden. Wrong times, notification fatigue, unreliable delivery, and coercive adherence framing remain material risks.
- **N9:** Source-linked administrative task extraction can reduce post-visit memory burden, but confirmation load, sensitive document handling, and the danger of operationalizing ambiguous clinical or medication instructions limit reach and trust.
- **N10:** A warm handoff can address practical barriers, but directory freshness, rural service scarcity, eligibility complexity, and connectivity can produce unequal benefit. A no-result outcome must not pretend that useful help exists locally.
- **N11:** A manual, source-stamped mobility checklist helps a narrower group and responsibly avoids a “safe route” claim. Manual fact entry, changing conditions, rural gaps, and location sensitivity cap immediate and repeated value.
- **N12:** Values clarification strongly protects autonomy, but a safe generic MVP offers modest immediate value; decision-specific comparison requires governed, complete evidence and careful risk communication. Decision-aid evidence does not justify improvised model-generated options ([Cochrane review](https://pubmed.ncbi.nlm.nih.gov/38284415/)).

## Candidate-by-candidate persona findings

Each row states who benefits, who may be excluded or harmed, remaining friction, and the adjustment required for that lens.

### N1. Assisted Narrative-to-Form Draft

| Lens | Who benefits | Who may be excluded or harmed | Remaining friction | Required adjustment |
|---|---|---|---|---|
| P1 | Can describe several medications, goals, or mobility issues once instead of navigating many fields. | May trust a fluent but wrong mapping or accidentally approve a fabricated detail. | Reviewing each mapped field can erase the time saved. | Limit each batch to three proposals; show source words, destination field, before/after values, and per-field approval/undo. |
| P2 | Speech or a long typed/pasted narrative can reduce precise tapping and repetitive entry. | Speech errors, tiny transcript editing controls, or dense proposal cards can create more work. | Correcting a transcript still demands navigation and motor precision. | Offer one-proposal mode, large controls, keyboard/switch support, zoom/reflow, and ordinary form entry at every step. |
| P3 | Complete typed/pasted path can be efficient. | Audio prompts, tones, or spoken error recovery would exclude the user. | Recording state and misrecognition are irrelevant if the visual path is incomplete. | Make all states, explanations, corrections, and confirmations visible and screen-reader accessible; audio is optional. |
| P4 | Natural narration may lower working-memory demand by avoiding field-by-field recall. | Multiple extracted propositions can overload memory or obscure what has already been saved. | Remembering the original account while checking mappings is hard. | Repeat the exact source span beside one proposal, preserve a visible saved/pending state, allow a break, and never infer impairment. |
| P5 | Everyday words can replace form and medication vocabulary. | Field labels, confidence scores, and technical “mapping” language can be confusing or shaming. | The person must still understand what will enter the record. | Use concrete examples and “I heard / Add to” wording, include “Not sure,” and test with low-literacy users. |
| P6 | Local capture can preserve an account before a connection is available. | Cloud-only extraction can fail, consume data, or lose a long narrative. | Uncertainty about whether the account was uploaded or saved. | Keep an encrypted user-controlled local draft, show online status, provide retry/copy/manual fallback, and minimize payload size. |
| P7 | No caregiver is needed; field-level control can be privacy preserving. | Sensitive narrative may be sent to a model or retained beyond expectations. | Understanding what data leaves the device and how long it remains. | Just-in-time processing notice, minimum schema/context, no raw audio retention, delete control, provider/retention disclosure, and no automatic sharing. |
| P8 | With explicit authority, a caregiver can help enter facts the older adult supplies. | Caregiver wording may displace the older adult's account or appear to be self-report. | Distinguishing speaker, observer, and approver. | Default to no caregiver access; label authorship, permit proposals only, and require the older adult's approval unless a separately governed representative role applies. |

**Council judgment:** promising bounded pilot for What Matters and Mobility after N2/N3 foundations; do not begin with medication extraction or voice-only interaction.

### N2. Guided Completion and Recovery Companion

| Lens | Who benefits | Who may be excluded or harmed | Remaining friction | Required adjustment |
|---|---|---|---|---|
| P1 | Quickly sees what remains, resumes at the exact field, and resolves save conflicts. | Repeated unsolicited help may annoy a confident user. | Extra prompts can slow a person who already knows the form. | Make help user-invoked by default, show why an offer appeared, and provide persistent “Do not offer again.” |
| P2 | One-question mode, reliable focus, and fewer controls per screen reduce visual/motor load. | Hidden controls, transient toasts, or focus jumps can strand the user. | Switching modes may itself cause disorientation. | Persistent large Back/Save/Stop controls, predictable focus, 400% reflow, live status, and a visible return-to-full-view action. |
| P3 | Deterministic visual help works without sound. | Spoken-only orientation or success messages would hide critical state. | None if parity is complete; captions alone do not fix inaccessible controls. | Keep all guidance and status in persistent text with keyboard/touch parity; never use audio as the only alert. |
| P4 | Exact resume points, one item at a time, “not sure,” and verified saves directly reduce memory burden. | “Stuck” detection can feel like cognitive surveillance or produce a false label. | Reorientation after a break and remembering why a question remains. | Use local coarse triggers only, store no confusion score, state last verified save/time, and never infer cognition or notify others. |
| P5 | Plain explanations and fixed recovery choices can make the form learnable. | Too many modes or AI-generated wording can reduce confidence. | Knowing whether Skip is allowed and whether answers are final. | Use a fixed four-choice help pattern, plain optional/required labels, worked examples, and deterministic wording offline. |
| P6 | Save/resume and fixed help can remain useful with poor connectivity. | A model-dependent recovery path could fail exactly when help is needed. | Cross-device resume may not be available offline. | Make the MVP fully deterministic, cache approved help, queue only clearly pending local work, and never claim cloud persistence before read-back. |
| P7 | Private completion support avoids caregiver monitoring. | Behavioral event logging can become surveillance. | Trusting why the prompt appeared. | Process minimal counters locally, expire them at session end, disclose the trigger, and offer a permanent opt-out. |
| P8 | Can reduce the need for a caregiver to take over routine completion. | Caregiver may expect completion alerts or remote control. | Supporting without seeing private responses. | No silent caregiver status; allow only owner-initiated scoped assistance through N7 and keep the older adult's screen/control primary. |

**Council judgment:** strongest and broadest candidate, but most of its value is ordinary accessible interaction and reliable state management. AI survives only if comparative testing shows an incremental benefit.

### N3. Plain-Language Readback and Readiness Check

| Lens | Who benefits | Who may be excluded or harmed | Remaining friction | Required adjustment |
|---|---|---|---|---|
| P1 | Can catch omissions, duplicates, and wording errors across a complex assessment before a visit. | May mistake polished prose for clinical validation. | Reviewing source links for many entries. | Label as “summary of your entries,” use deterministic checks, cite every sentence, and cap clarifications. |
| P2 | Short readback and direct “Change this answer” links avoid hunting through the form. | Long cards, inaccessible source links, or speech-only readback can obstruct correction. | Navigating back and returning to the same summary sentence. | Large meaningful links, preserved focus, reflow, optional audio, and exact return after edit. |
| P3 | Visible plain text and source links are fully usable without audio. | Auto-reading or audio confirmation could cause missed information. | Dense medication tables may remain difficult. | Audio never advances or confirms; use headings, lists, expandable detail, and screen-reader table alternatives. |
| P4 | One-sentence-at-a-time confirmation reduces recall and supports error discovery. | A long global summary or repeated challenges can fatigue or feel like a test. | Remembering the source answer while evaluating the paraphrase. | Show source and summary together, ask “Did the app get this right?” rather than testing the user, and allow stop/resume. |
| P5 | Plain language can make the person's own record understandable. | Generated explanations may still use jargon or imply that disagreement is wrong. | Distinguishing “missing” from “optional” and “possible conflict” from error. | Professionally governed plain-language style, definitions on demand, concrete “both can be true” copy, and “Keep as is.” |
| P6 | Deterministic report and validation can work offline or at low bandwidth. | Cloud summarization may be unavailable. | Knowing whether an older cached summary matches current answers. | Version-stamp every sentence, show last updated time, and fall back to a deterministic field list. |
| P7 | Nothing leaves the app unless the user later chooses export/share. | Summary generation still exposes sensitive answers to a model. | Understanding processing and stored confirmation metadata. | Data minimization, clear processing/retention notice, local deterministic fallback, deletion, and no automatic caregiver/clinician handoff. |
| P8 | An authorized caregiver can help spot factual gaps without rewriting private priorities. | Caregiver may treat the summary as a definitive health status or pressure changes. | Separating caregiver observations from owner-confirmed answers. | Owner-first review, attributed caregiver suggestions, no direct edits, and per-domain permission. |

**Council judgment:** top-tier candidate. It should precede N4 and provide the provenance/correction pattern reused elsewhere.

### N4. What-Matters-Led Visit Preparation Packet

| Lens | Who benefits | Who may be excluded or harmed | Remaining friction | Required adjustment |
|---|---|---|---|---|
| P1 | Converts extensive 4Ms and medication information into a concise agenda led by the user's priority. | Generated questions or omissions may skew the visit. | Choosing what fits on one page. | Require user-selected top priority, source links, editable include/exclude controls, and maximum three generated questions. |
| P2 | Large-print, editable, printable output can reduce device use during a visit. | Tiny PDF text, drag-only ordering, or inaccessible preview/export can block use. | Printing or handling a file may still need assistance. | Accessible HTML/plain text first, large-print template, button-based reorder, printer guidance, and validated tagged PDF only later. |
| P3 | Visible packet supports a conversation without relying on hearing every spoken detail. | Audio-only review or clinic discussion still creates barriers. | Communicating accommodation needs. | Include a user-selected communication/accessibility-needs section and retain complete text/touch controls. |
| P4 | A short agenda and blank notes space reduce memory burden before and during a visit. | Too much content or automatic prioritization may suppress the person's main concern. | Remembering to bring/open the packet and capturing outcomes. | One-page default, What Matters first, manual appointment reminder only if requested, and no model-selected “most important” item. |
| P5 | Plain questions can make it easier to participate in a visit. | Clinical jargon and source metadata can overwhelm; a polished document may look clinician-approved. | Editing generated questions confidently. | Plain-language template, “My notes for discussion—not medical instructions,” examples, and easy remove/restore. |
| P6 | Print/download can work without live connectivity at the appointment. | No printer, limited storage/data, or no regular clinician access reduces value. | Getting the artifact onto a usable device or paper. | Lightweight plain-text download, offline access, local library/clinic print guidance where appropriate, and no dependence on email/EHR. |
| P7 | Per-field exclusion and local export support selective disclosure. | Native share or email can expose highly sensitive domains to the wrong recipient. | Understanding what metadata/files remain after sharing. | Preview exact final content and destination separately; default to local print/download; warn that sent copies cannot be recalled. |
| P8 | Can help an authorized caregiver support agenda use and note-taking. | Caregiver priorities may replace What Matters or private fields may be included by default. | Negotiating which items the older adult wants discussed. | Older adult selects lead priority and final content; caregiver additions are attributed and optional; no default copy. |

**Council judgment:** top-tier, tangible cross-persona value. Begin with editable local print/download and no email, portal, or automatic calendar access.

### N5. Medication List Verification and Question Prep

| Lens | Who benefits | Who may be excluded or harmed | Remaining friction | Required adjustment |
|---|---|---|---|---|
| P1 | High direct value from missing-dose, duplicate-candidate, and source-mismatch review across several medicines. | May change medication behavior based on a suggested match or conflict. | Checking every source and uncertainty can be laborious. | Preserve original values; use conservative deterministic matching; label “patient-reported, not clinician-reconciled”; draft questions, never choose a regimen. |
| P2 | Can reduce repetitive entry if label data are captured accurately. | Camera alignment, glare, small labels, dense comparison grids, and edit controls can exclude. | Manual correction remains substantial. | Fully equivalent manual/pasted path, row-by-row comparison, large controls, screen magnification support, and no forced camera. |
| P3 | Text comparison and printed pharmacist questions need no audio. | Scanner success/error tones or spoken labels alone are inaccessible. | Reading unfamiliar names remains difficult. | Persistent visual status, screen-reader pronunciation is optional, and every medication name remains visible/copyable. |
| P4 | A structured “confirmed / unsure / ask” list reduces memory burden. | Similar names, sources, and dose/frequency differences can confuse; false certainty can be dangerous. | Remembering which source was current. | One medicine at a time, explicit source/date, “Not sure,” no silent merge, and pharmacist/clinician verification banner. |
| P5 | Neutral question prompts can help ask a pharmacist for clarification. | Drug vocabulary, abbreviations, and numeric directions create high health-literacy burden. | Understanding why two entries differ without interpreting what to take. | Expand abbreviations, show exact source text, avoid interaction/appropriateness claims, and test comprehension without testing the person. |
| P6 | A portable self-reported list is useful where records are fragmented. | Lookup outages, limited pharmacies/clinicians, data costs, and stale databases may leave uncertainty unresolved. | Finding a professional to verify questions. | Manual/offline list first, cache source timestamps, retain unresolved state honestly, and provide low-bandwidth print/copy. |
| P7 | Local verification and selective packet inclusion can avoid caregiver disclosure. | Medication data and label images are highly sensitive. | Understanding third-party lookup/image retention. | Explicit per-source consent, short retention or local processing where possible, deletion, redacted logs, and no automatic outreach. |
| P8 | Authorized caregiver can help identify names and prepare pharmacist questions. | Caregiver may overrule the older adult or directly change the record. | Reconciling differing reports without declaring one true. | Attribute every source, allow caregiver proposals only, preserve disagreement, and require owner approval or a separately governed representative workflow. |

**Council judgment:** high-value but high-consequence. Pilot only after scanner correction and pharmacist/clinical review; success means better questions and provenance, not medication “accuracy” asserted by the app.

### N6. Longitudinal 4Ms Change Review

| Lens | Who benefits | Who may be excluded or harmed | Remaining friction | Required adjustment |
|---|---|---|---|---|
| P1 | Can prepare efficiently for recurring visits and notice self-reported changes across 4Ms. | May overinterpret numeric changes or model-suggested causal links. | Selecting meaningful comparison dates. | Compare only two user-selected immutable snapshots, show raw field diffs/source dates, and prohibit deterioration/risk language. |
| P2 | Short change list can avoid rereading whole assessments. | Trend charts, color coding, and small date controls may exclude. | Inspecting source answers behind a change. | Text-first list, large date selectors, no color-only meaning, accessible table alternative, and print view. |
| P3 | Fully visual comparison works well. | Audio summaries that omit visual provenance would not. | None beyond general content density. | Complete text path and optional audio that reads the same source-linked content. |
| P4 | Externalizes what changed and can reduce recall demands. | Dates, multiple versions, and “before/after” concepts may confuse or heighten anxiety. | Deciding whether a difference is meaningful. | Plain absolute dates, one change at a time, “No meaningful change” option, correction/annotation, and no cognitive inference. |
| P5 | Plain-language differences can support visit discussion. | Terms such as trend, decline, baseline, or risk can stigmatize and mislead. | Understanding that a rating difference is self-report, not a clinical finding. | Use “You entered X on [date] and Y on [date],” define scales, and avoid evaluative labels. |
| P6 | Deterministic snapshot diff and downloaded brief can be low bandwidth. | Snapshot creation/sync failure can create incomplete history. | Trusting which version is stored. | Verified immutable snapshots, visible sync status, offline queue with conflict handling, and local export. |
| P7 | User-selected comparisons with no hidden alerts preserve privacy. | Longitudinal data creates a larger sensitive record and temptation for automatic sharing. | Retention and deletion choices. | Explicit snapshot consent, configurable retention/export/delete, no caregiver alerts, and per-brief sharing approval. |
| P8 | Can help discuss changes the older adult chooses to share. | Caregiver may monitor or characterize change as decline. | Separating observations and avoiding pressure. | Older adult controls comparison/share; caregiver notes are attributed and optional; no passive access or score-triggered notification. |

**Council judgment:** strong second-wave candidate after immutable snapshots exist. Start with user-initiated comparison and no recurring check-in.

### N7. Consent-Governed Care Circle Task

| Lens | Who benefits | Who may be excluded or harmed | Remaining friction | Required adjustment |
|---|---|---|---|---|
| P1 | Can delegate one tedious task without surrendering the account. | Multi-step permissions may feel slower than simply sharing credentials. | Selecting fields, action, recipient, and expiry. | Provide task templates with least privilege, concrete preview, verified identity, fixed expiry, audit, and immediate revoke. |
| P2 | Remote help may reduce difficult data entry. | Complex scope grids, small checkboxes, authentication, and invite flows can be inaccessible. | Independently reviewing what the supporter sees. | Plain one-task flow, large labeled controls, supporter-view preview, printable receipt, and accessible revoke on every screen. |
| P3 | Text-based task and permission receipts are suitable. | Phone-only verification or audio notices can exclude. | Communication with the supporter if only voice channels exist. | Offer accessible text/email/in-app channels and never require a phone call or sound cue to manage access. |
| P4 | A trusted person can help with a bounded task. | Consent complexity, forgotten grants, coercion, or mistaken identity can cause serious harm. | Remembering duration/scope and reviewing proposed changes. | Short fixed grants, repeated plain summary, no recurring scope in MVP, visible active-access banner, and safeguarding/coercion testing. |
| P5 | Concrete task language may be clearer than broad account roles. | Security terms and abstract field-level permission can undermine informed choice. | Understanding “view” versus “comment” versus “change.” | Use examples (“Maria can see names; cannot see memory answers”), comprehension-oriented design, and no legalistic model-generated consent. |
| P6 | Family help may bridge distance and limited local services. | Supporter or user may lack reliable internet, email, devices, or identity documents. | Invitation expiry and asynchronous coordination. | Low-bandwidth interface, generous but clear expiry, offline-readable receipt, alternative human support, and no penalty for failed invites. |
| P7 | Least-privilege, time-limited access directly serves privacy preferences. | Any default caregiver email, opaque metadata sharing, or hard-to-revoke grant would be harmful. | Trusting enforcement rather than copy alone. | Default off; entering an email never authorizes; separate high-sensitivity confirmation; server-enforced scope; show audit and revoke immediately. |
| P8 | Gains a legitimate comment/propose channel and clear task boundaries. | May feel blocked by inability to directly fix errors or see broader context; could pressure for more access. | Waiting for owner approval and handling disagreement. | Explain supporter role, show proposal status, preserve both accounts, and provide escalation to the person—not silent scope expansion. |

**Council judgment:** meaningful but the most governance-intensive feature. Research prototype only until identity, abuse-aware consent, authorization, and revocation are independently validated. Shared-access evidence should inform testing, not justify default delegation.

### N8. What-Matters Goal and Reminder Steward

| Lens | Who benefits | Who may be excluded or harmed | Remaining friction | Required adjustment |
|---|---|---|---|---|
| P1 | Can turn a chosen goal or unfinished questionnaire into one concrete next step and reminder. | Over-frequent prompts may feel like nagging or adherence monitoring. | Choosing realistic timing and maintaining settings. | One goal/step in MVP, one-time default, full preview, capped cadence, quiet hours, easy edit/pause/delete, and no streaks. |
| P2 | Large persistent reminder controls can reduce navigation burden. | Small notification actions, swipe-only dismissal, or inaccessible time pickers can block control. | Returning from a notification to the exact task. | Large Snooze/Pause/Stop controls, accessible date/time picker, deep link to resume point, and no gesture-only action. |
| P3 | Visible notifications and in-app history work without audio. | Sound-only reminders are ineffective. | Missing alerts when visual notifications are unavailable. | Let the user choose visual/email/in-app channels; never treat notification delivery as reading or completion. |
| P4 | Directly supports prospective memory and reduces task load. | Wrong-time interpretation, duplicate reminders, or nonresponse pressure can increase confusion/anxiety. | Understanding recurring status and stopping it. | Repeat absolute date/time/timezone, one-time default, visible next reminder, no nonresponse escalation, and automatic expiry on task completion. |
| P5 | Natural language such as “tomorrow after breakfast” can be convenient. | Ambiguous interpretation and settings jargon can cause wrong schedules. | Checking time, channel, message, and recurrence. | Pair interpretation with a standard picker and plain full preview; require explicit approval of each normalized value. |
| P6 | Email or local in-app reminders may help when routine services are limited. | Intermittent delivery, shared devices, data costs, and provider outage reduce reliability/privacy. | Knowing whether the reminder was scheduled or delivered. | Offline-visible plan, queue status, no backfill burst, privacy-safe text, and downloadable alternative. |
| P7 | Private lock-screen-safe wording and no caregiver copy can preserve autonomy. | Current app reminder behavior creates a strong trust deficit; metadata can still reveal health activity. | Believing pause/delete/revoke actually works. | Replace the current blanket scheduler, default to generic text, show audit/status, and verify cancellation server-side. |
| P8 | Can participate only when the older adult explicitly assigns a step. | Automatic copies or missed-reminder alerts would turn support into surveillance. | Coordinating ownership and stopping reminders. | Separate owner/recipient confirmation, exact task scope, no nonresponse alert, and easy owner revocation. |

**Council judgment:** strong repeated-value candidate once consent-aware scheduling exists. Keep medication-dose reminders, adherence surveillance, and missed-response escalation out of scope.

### N9. After-Visit Follow-Through Organizer

| Lens | Who benefits | Who may be excluded or harmed | Remaining friction | Required adjustment |
|---|---|---|---|---|
| P1 | Can turn a complex after-visit text into a manageable administrative checklist. | A wrong extracted date or medication action may cause consequential error. | Item-by-item source verification is time consuming. | MVP uses pasted text, administrative tasks only, source anchors, per-item approval, and verbatim display/stop for clinical or medication instructions. |
| P2 | Structured tasks may be easier than rereading dense paperwork. | Photo capture, document upload, side-by-side views, and small source text can exclude. | Getting paper instructions into the app. | Manual/paste path first, zoomable source, reflowed text, large approval controls, and no camera requirement. |
| P3 | Visual checklist and reminders are useful without audio. | Spoken document summaries or reminder sounds alone exclude. | None if all source/task relationships are visual and programmatic. | Full text/keyboard/screen-reader path and visible notification history. |
| P4 | High benefit from externalizing tasks and dates. | Long confirmation screens, ambiguous instructions, and too many reminders can overload. | Remembering whether a task came from the clinic or the model. | One task at a time, original sentence always visible, “Needs clarification,” capped reminders, and stop/resume. |
| P5 | Plain administrative wording can clarify next steps. | Simplification may alter clinical meaning; source documents may remain difficult. | Knowing which tasks can safely be acted on without a clinician. | Limit MVP categories, retain original wording, define administrative versus clinical, and draft clarification questions instead of interpretation. |
| P6 | A printable checklist may help where follow-up systems are weak. | Upload/processing requires bandwidth; services named in instructions may be distant or unavailable. | Completing tasks with limited local capacity. | Low-bandwidth paste/manual mode, printable/offline list, flexible “could not access” outcome, and no blame. |
| P7 | User chooses the document, tasks, reminders, and retention. | After-visit documents contain highly sensitive data; model/document providers expand exposure. | Understanding deletion versus retained task provenance. | Short configurable retention, local/manual MVP, redacted logs, explicit processing consent, and explain traceability lost on deletion. |
| P8 | Can support an explicitly assigned administrative task. | May receive clinical details unnecessarily or assume ownership. | Distinguishing task owner, source, and permitted data. | N7 grant required, minimum necessary excerpt, supporter acceptance, owner approval, and no automatic document access. |

**Council judgment:** valuable later workflow, but source-grounded administrative extraction should remain a controlled pilot; no OCR, EHR import, clinical messaging, or medication scheduling in MVP.

### N10. Local Support Navigator and Warm Handoff

| Lens | Who benefits | Who may be excluded or harmed | Remaining friction | Required adjustment |
|---|---|---|---|---|
| P1 | Can compare a few services against cost, transport, language, and accessibility needs, then prepare contact. | Stale eligibility or availability can waste time or expose data. | Verifying a program and repeating details during contact. | Curated sources, freshness date, up to three options, minimal-data draft, recipient/content confirmation, and honest provider-status labels. |
| P2 | A list can replace inaccessible maps and reduce searching. | Map pins, long cards, inaccessible external sites, or phone-only providers can exclude. | Completing the handoff on a third-party service. | Text-first comparison, large call/copy controls, accessibility-channel fields, human navigation fallback, and no map-only information. |
| P3 | Written contact options and scripts can avoid phone dependence. | Many local services may only support voice calls. | Communicating when no text/email channel exists. | Clearly label channels, prioritize equivalent accessible contact where available, and never count an opened call link as completed contact. |
| P4 | A constrained shortlist reduces search and eligibility burden. | Multiple uncertain options, stale facts, and follow-up state can confuse. | Remembering whom the user contacted and the result. | Two or three comparable cards, source date, one chosen next step, simple history, and stop after dismissal. |
| P5 | Plain eligibility explanations and a draft inquiry can reduce intimidation. | Program jargon and conditional rules may still be difficult; AI may falsely imply eligibility. | Answering follow-up eligibility questions. | Quote source requirements, distinguish “may qualify” from confirmed eligibility, avoid endorsement, and offer a human line. |
| P6 | Potentially high need for transport, food, home, and social supports. | Rural service scarcity, outdated directories, broadband limits, and distance can yield no useful result and amplify inequity. | Acting on a result when transport or capacity is unavailable. | Measure no-result rates by rurality, use low-bandwidth/manual ZIP, show honest gaps, include regional/human directories, and pilot only where sources are maintainable. |
| P7 | Manual coarse location and minimum-data contact can limit disclosure. | Precise/background location or broad questionnaire sharing would be harmful. | Understanding what location and health details reach each service. | Location off by default, manual ZIP equal to geolocation, preview exact data/recipient, delete coordinates after query, and no recurring tracking. |
| P8 | With permission, can help evaluate or make a contact. | Could become a default recipient or learn needs the older adult kept private. | Coordinating who follows up. | Owner selects what is shared and task owner; N7 permission for caregiver involvement; no automatic copy. |

**Council judgment:** research/pilot only until a maintainable, region-specific directory exists. Inclusion must be measured by geography and channel, not just search success among well-served users.

### N11. Door-to-Door Mobility Plan

| Lens | Who benefits | Who may be excluded or harmed | Remaining friction | Required adjustment |
|---|---|---|---|---|
| P1 | Can prepare logistics and questions for a specific destination. | A polished plan may be mistaken for a safe-route guarantee. | Entering/confirming venue and transport facts. | Label known/unknown/user-entered facts, prohibit safety claims, include verification questions and a backup, and require destination confirmation. |
| P2 | Directly benefits users with mobility aids or visual/motor barriers when the plan covers entrances, seating, and rest. | Manual addresses, map interaction, and dense route steps may be inaccessible. | Using the plan while moving. | Linear printable checklist, no map-only view, large controls, written access descriptions, and no requirement to operate a phone while walking. |
| P3 | Written route/access plan is suitable. | Audio turn-by-turn assumptions or phone calls to venues may exclude. | Verifying venue details through inaccessible channels. | Text-first facts and scripts; label communication channels; audio is optional only. |
| P4 | Checklist and backup can reduce prospective-memory load. | Many changing steps, times, and unknowns can overwhelm or become stale. | Knowing which facts were checked and when. | One trip at a time, short sections, source timestamps, manual reconfirm prompt, and no autonomous replanning. |
| P5 | Plain questions can help verify entrances or seating. | Transit/accessibility terms and uncertainty labels may still be confusing. | Distinguishing a preference from a clinical/safety limit. | Use user-owned wording (“I prefer / I need”), define terms, avoid fall-risk scores, and never label a route safe. |
| P6 | Could help where trips require careful planning. | Rural transit/paratransit data and alternatives may be absent; data-heavy maps are impractical. | No viable backup when services do not exist. | Manual low-bandwidth MVP, explicit no-option state, printable phone numbers, and geographic pilot before broader claims. |
| P7 | Manual destination and local artifact can avoid precise tracking. | Destination/location reveals sensitive routines; future live updates invite surveillance. | Data retention and third-party map exposure. | No background location, one-time coarse/minimized query later, short retention/delete, and separate consent for every external source. |
| P8 | Can help with logistics if invited. | “Peace-of-mind” tracking can shift control to the caregiver. | Sharing only useful logistics without health details. | User-selected logistics subset, no tracking or automatic arrival alerts, and revocable N7 permission. |

**Council judgment:** useful to a narrower mobility subgroup, but the honest manual checklist may have little AI advantage. Defer external route/weather/transit automation until data quality and inclusion are proven.

### N12. Shared-Decision Conversation Builder

| Lens | Who benefits | Who may be excluded or harmed | Remaining friction | Required adjustment |
|---|---|---|---|---|
| P1 | Can connect a clinician-defined decision to personal priorities and prepare questions. | Incomplete or distorted option summaries can steer treatment choices. | Supplying a qualified decision aid and evaluating tradeoffs. | MVP asks values/questions only; no option comparison without allowlisted, versioned, complete sources and clinical governance. |
| P2 | One-tradeoff-at-a-time and printable worksheet can improve access. | Dense source documents, risk graphics, and inaccessible PDFs can exclude. | Reviewing original evidence alongside paraphrase. | Accessible HTML/plain text, source passage links, large controls, non-drag ordering, and alternative to visual risk charts. |
| P3 | Written worksheet can support communication in a visit. | Audio-only explanations or clinician conversation may remain inaccessible. | Capturing questions and accommodation needs. | Full visual path and a communication-needs field; optional audio reads identical content only. |
| P4 | Structured values prompts can externalize priorities. | Multi-option probability/tradeoff reasoning may overload memory and be susceptible to framing. | Remembering details across options. | Generic one-question MVP, save/return, “Not sure,” neutral ordering, no capacity inference, and supporter only by consent. |
| P5 | Plain-language questions can support participation. | Risk/benefit language and model paraphrase may produce misunderstanding or perceived recommendation. | Distinguishing personal values from medical evidence. | Separate “What matters to me” from “What the source says,” define terms, retain citations, and prohibit “best option” language. |
| P6 | Downloaded worksheet may help prepare when visit time is scarce. | Qualified decision aids, clinician access, and bandwidth may be limited. | Getting unanswered evidence questions resolved. | Lightweight generic worksheet, offline export, “ask clinician” stop state, and no broad web retrieval. |
| P7 | Private values work with selective export strongly supports autonomy. | Sensitive priorities may be exposed through model processing or caregiver access. | Deciding what to include in a packet. | Minimum-data processing, private-by-default worksheet, per-item inclusion, retention/delete controls, and no default supporter access. |
| P8 | Can help the person articulate questions if invited. | Caregiver preferences can steer values or pressure a choice. | Preserving the older adult's voice where views differ. | Older adult answers first; caregiver input is separately attributed; no option selection, consent, or communication on the person's behalf. |

**Council judgment:** preserve as a generic values-and-questions tool, not a treatment comparator. Decision-specific versions remain research-only because source completeness and non-steering are hard safety requirements.

## First-person walkthroughs for the strongest candidates

These walkthroughs illustrate interaction requirements, not validated user reactions.

### N2 walkthrough: recover without losing my place

> I return to the questionnaire and see, “Last verified save: Mobility, June 17 at 2:14 PM. Seven answers remain.” I choose **One question at a time**. I accidentally tap “No walking aid,” then notice the preview says that is what will be saved. I choose **Change it**, select “Cane,” and then press **Save this answer**. The app reads the field back from storage and says **Saved and verified**. On the next question I choose **Stop helping and save for later**. A confirmation shows my resume point; I choose **Cancel** because I want to answer one more item. When my connection drops during that answer, the app says **Not saved online**, keeps the draft visibly pending, and offers **Retry**, **Copy answer**, or **Return to the form**. It never marks the section complete or alerts my family.

### N3 walkthrough: the app corrects itself, not me

> At Review I choose **Read back my answers**. The first sentence says I use a walker at home and cites Mobility question 2. That is wrong; I use it outdoors. I choose **This is not right**, see my original answer beside the summary, and select **Change source answer**. Before writing, the app shows “At home” → “Outdoors.” I press **Save correction** and receive a verified before/after record with **Undo**. The next clarification feels unnecessary, so I choose **Keep both answers as written** and **Do not ask this again**. Before final confirmation I select **Cancel review**; nothing is shared or marked clinically accurate. When the model is unavailable, the app restores a deterministic field-by-field review with the same edit links.

### N4 walkthrough: prepare a visit packet without sending it

> I choose “Staying independent at home” as what I want first on my visit agenda. The draft adds four questions, but the packet limit is three and one question does not sound like me. I remove it, change another, and exclude my memory note from this packet. The preview shows every included source and says **My notes for discussion—not medical instructions**. I choose **Download**, review a confirmation that says “Save this exact one-page packet on this device,” and approve. I then try **Share**, notice the wrong contact in the operating-system chooser, and cancel; the app records no send. When printing fails, my approved packet remains available as accessible HTML and plain text, with **Retry print** and **Save for later**. No caregiver or clinic receives a copy unless I separately confirm a recipient and the final content.

### N8 walkthrough: a reminder that remains mine

> I type, “Remind me tomorrow after breakfast to finish What Matters.” The app interprets that as “Thursday, June 18, 2026 at 9:00 AM Eastern, one time, in-app notification,” and shows the lock-screen text: “Your saved questionnaire is ready.” Nine is too early, so I choose **Change**, set 10:30, and press **Create this reminder** only after the full preview is correct. I accidentally create a second proposal, but the idempotency check says an identical reminder already exists and does not duplicate it. Later I open Reminder History and choose **Pause**, then change my mind at the confirmation and press **Cancel**; the reminder remains active. When I finally choose **Delete future reminder**, the app verifies cancellation and shows the audit entry. If delivery fails, it says **Not delivered** rather than assuming I saw it, and it never contacts a caregiver because I did not respond.

## Council synthesis

The broadest persona support is **N2, N3, and N4**. N2 reduces completion and recovery burden across all lenses, but should begin as reliable deterministic UX. N3 supplies the source-linked fidelity and correction pattern needed by most later capabilities. N4 creates the clearest immediate bridge from the 4Ms questionnaire to a real visit while keeping What Matters under the older adult's control.

**N8** is the strongest repeated-action candidate once the current unsafe reminder implementation is replaced by explicit consent, quiet hours, delivery truth, pause/delete, and audit. **N6** is a strong second-wave capability after immutable snapshots exist. **N5** has high value for people managing several medications but materially lower inclusive reach and trust; it needs pharmacist/clinical review, conservative matching, accessible manual entry, and prominent unresolved states.

The aggregate table must not obscure the sharper disagreements:

- P6 may receive little or negative value from N10 and N11 where services/data are absent, even though better-served users benefit.
- P7 can benefit from N7's least-privilege model while also facing its greatest privacy/coercion risk; default-off, enforcement, and instant revocation determine which outcome occurs.
- P2 and P4 may benefit greatly from N1, N5, and N9 only if correction and confirmation are simpler than the original task. Camera, voice, and dense side-by-side review are not inherently accessible.
- P8 benefits when support is explicitly authorized, attributed, bounded, and proposal-only. A caregiver email, family relationship, missed reminder, or Mentation answer must never transfer control.
- N12 protects autonomy in principle, but decision-specific content can harm users with lower health literacy or high memory burden if the model paraphrase is incomplete or steering.

Across the council, the preferred product posture is consistent: begin with private, source-linked drafts; require explicit confirmation for each consequential step; provide cancellation and recovery at the same level of accessibility as the main path; and treat user control, no-result states, unresolved uncertainty, and provider failure as normal outcomes rather than exceptions.
