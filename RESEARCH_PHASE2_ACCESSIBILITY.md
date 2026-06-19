# Phase 2A — Older-Adult Experience and Accessibility Capability Discovery

**Role:** Older-Adult Experience and Accessibility Designer  
**Repository basis:** Validated Phase 1 context, reviewed 2026-06-17  
**Evidence access date:** 2026-06-17 for every external source below

## Design position

The app should not treat “older adult” as a disability category or presume low confidence, cognitive impairment, caregiver dependence, or a preference for voice. It should let each person choose pace, modality, level of help, and whether anyone else is involved. The strongest AI role is to translate flexible human expression into a **draft**, explain the person's own information in a usable form, and prepare bounded actions. Deterministic UI and policy must retain control of saving, validation, consent, permissions, emergency messaging, and delivery.

Current assets that make these concepts plausible include the generic four-section renderer (`src/views/Questionnaire/4msSection.jsx`), questionnaire/session services (`src/services/questionnaireService.js`), speech input and synthesis (`src/components/AIChatbot.jsx`, `src/components/SpeechReader.jsx`), report generation (`src/views/Questionnaire/ReviewSubmit.jsx`), Firebase Auth/Firestore/Functions, and SendGrid. None should become agentic until the Phase 1 blockers—authorization, API authentication, consent/delegation, scoped storage, redacted logging, prompt-injection separation, save-error propagation, and typed/audited tools—are corrected.

## Evidence translated into requirements

- WCAG 2.2 is the conformance baseline, including visible focus, target size, consistent help, avoiding redundant entry, and accessible authentication. These are product requirements, not model features ([W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/); [Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html); [Consistent Help](https://www.w3.org/WAI/WCAG22/Understanding/consistent-help.html); [Redundant Entry](https://www.w3.org/WAI/WCAG22/Understanding/redundant-entry.html); [Accessible Authentication](https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html); accessed 2026-06-17).
- W3C explicitly frames older users' needs as overlapping with accessibility needs and recommends involving older people and people with disabilities in design and testing. The W3C cognitive guidance emphasizes clear purpose, familiar language, help, feedback, error prevention, and support for attention and memory ([WAI: Older People and Web Accessibility](https://www.w3.org/WAI/older-users/); [Making Content Usable for People with Cognitive and Learning Disabilities](https://www.w3.org/TR/coga-usable/); accessed 2026-06-17).
- A 2025 systematic review of 132 studies identified simplified navigation, enlarged text/touch targets, voice interaction, error tolerance, and participatory design as recurring age-friendly strategies, while cognitive overload and low digital literacy remained barriers. This supports configurable multimodal design and co-design, but does **not** establish that AI personalization improves outcomes ([PubMed 40804492](https://pubmed.ncbi.nlm.nih.gov/40804492/); accessed 2026-06-17).
- An updated systematic review found digital literacy, physical/cognitive challenges, infrastructure, usability, privacy, and mistrust could impede older adults' adoption; tailored training, accessible design, hybrid care, and co-design could facilitate it. Rural evidence was limited. This supports visible help, graceful network failure, and optional human support rather than forced automation ([PubMed 40934502](https://pubmed.ncbi.nlm.nih.gov/40934502/); accessed 2026-06-17).
- A systematic review/meta-synthesis of older adults with multimorbidity found technical barriers, need for support, and burden alongside benefits for communication and self-management. It calls for comprehensive, usable, less burdensome technology and support services ([PubMed 40387399](https://pubmed.ncbi.nlm.nih.gov/40387399/); accessed 2026-06-17).
- Voice is an option, not an accessibility shortcut. In a controlled consumer-health experiment, speech recognition increased cognitive load and was less usable than keyboard/mouse for tasks involving recall and problem solving; the sample was not limited to older adults. Conversely, a small randomized study with adults aged 60–90 found voice-only food reporting faster and less error-prone than a voice-plus-button prototype, while incomprehensible speech remained a notable error. The responsible inference is to test voice task by task and always preserve equivalent text/touch interaction ([PubMed 32442129](https://pubmed.ncbi.nlm.nih.gov/32442129/); [PubMed 32985999](https://pubmed.ncbi.nlm.nih.gov/32985999/); accessed 2026-06-17).
- Evidence for voice agents among people with memory impairment remains small and short-term; one systematic review found only eight experimental studies, generally about brief, constrained dialogues. This rules out claims that a conversational agent is validated cognitive assistance ([PubMed 35468084](https://pubmed.ncbi.nlm.nih.gov/35468084/); accessed 2026-06-17).
- Plain language improves access to health information, and comprehension checks can outperform passive disclosure in some contexts. The app can use read-back/confirmation to verify its own draft, but it must not turn a supportive interaction into a test of the older adult ([CDC Plain Language Materials & Resources](https://www.cdc.gov/health-literacy/php/develop-materials/plain-language.html); [AHRQ Teach-Back](https://www.ahrq.gov/health-literacy/improve/precautions/tool5.html); [systematic review, PubMed 31948345](https://pubmed.ncbi.nlm.nih.gov/31948345/); accessed 2026-06-17).

**Evidence limitation:** The sources strongly support accessible, multimodal, low-burden interaction. They do not prove that the proposed AI agents will improve 4Ms completion, comprehension, or care. Each AI-specific benefit is therefore a product hypothesis requiring co-design and comparative usability testing with diverse older adults, including assistive-technology users.

## Candidate 1 — Say It Once: Assisted Narrative-to-Form Draft

**Name and value proposition.** **Say It Once** lets a person describe a concern naturally by speech or text and produces a small, reviewable draft for the relevant 4Ms fields, reducing typing and repeated entry without silently changing the record.

**Primary user and story.** An older adult with hand tremor says or types, “I use a cane outdoors, the stairs worry me, and I fell last winter.” The app proposes entries for mobility aid, challenge/fall concern, and a note. The person corrects “last winter” to “February,” approves each item, and sees exactly what was saved.

**Problem and why AI rather than ordinary UI/rules.** Long free-form accounts can span fields and use personal wording that fixed keyword rules handle poorly. Constrained language extraction can map that account to the mutable questionnaire schema and ask about genuine ambiguity. AI is warranted only for semantic interpretation; recording, validation, and writes remain deterministic. A standard form must always remain available.

**Inputs.**

- **Existing, required:** a user-provided speech transcript or typed narrative; current questionnaire schema from `Questions/4ms_health`; authenticated user/session.
- **Existing, optional:** current answers, selected section/question, structured medication entries, and user edits made during this draft.
- **New, required:** per-proposed-field provenance (`source=narrative`, source span, model confidence/uncertainty), approval/rejection state, and idempotency key.
- **New, optional:** preferred input mode, language, “show one proposal at a time” preference, and a user-supplied medication photo only in a later clinically reviewed scanner flow.

**Exact actions and autonomy.**

1. Capture speech locally through the existing browser API or accept typed text; always show the editable transcript (**L0**).
2. Send only the needed schema/answer subset to a server-side structured-output extractor; treat narrative as untrusted data, not instructions (**L0**).
3. Display no more than three proposed mappings at once, each with “Keep,” “Change,” and “Do not add,” plus a plain reason when uncertain (**L2: prepare a draft**).
4. After explicit approval, call a typed `updateQuestionnaireFields` tool with field allowlist, version check, and idempotency key; show before/after values and Undo (**L3: approved reversible write**).
5. Verify the persisted Firestore values, record a user-visible audit item, and return focus to the changed field (**L3**).

**Confirmation, handoff, and emergency boundary.** Every field requires affirmative review; a blanket “save everything” appears only after all proposals are visible and remains reversible. No caregiver or clinician receives the narrative. If the text suggests immediate danger, self-harm, a recent serious fall, or an acute medication problem, extraction may continue preserving the user's words, but a deterministic, clinically approved urgent-help panel interrupts any reassuring model response and offers emergency/clinical contact options. The agent does not diagnose, rank urgency, or advise medication changes.

**Repository-tied approach.** Add a structured draft panel beside `FourMSection`; reuse Web Speech Recognition and typed fallback from `AIChatbot.jsx`; use the questionnaire schema and `saveSectionResponses` seam only after fixing swallowed errors. Implement extraction in the consolidated Firebase Functions backend with JSON schema validation, server token verification, field allowlists, and audit documents. Do not route writes through the current free-form chat endpoint.

**Accessibility and non-voice fallback.** Editable live transcript; visible recording state; no time limit; pause/resume; keyboard, switch, and touch operation; screen-reader announcement for each proposal; large targets; one-proposal mode; no color-only confidence cue. Full typed narrative and ordinary form entry are equivalent non-voice paths. Users can turn the feature off.

**Risks, dependencies, and outcome.** Risks are speech bias, incorrect mapping, fabricated details, excessive confirmation burden, disclosure of sensitive narrative, and prompt injection. Dependencies are authenticated tools, structured outputs, secure retention, user-scoped drafts, localization, and representative co-design. Measure median time/interaction count for a section, mapping acceptance after edit, wrong-field save rate, Undo rate, abandonment, speech-to-text correction burden, and parity by modality/disability group. **MVP:** text narrative for Mobility and What Matters, maximum three draft fields, field-by-field approval. **Later:** voice, multilingual extraction, all domains, and user-approved correction learning; medication extraction remains a separate clinically validated workstream.

## Candidate 2 — My Pace Guide: Adaptive, Resumable Completion

**Name and value proposition.** **My Pace Guide** notices when the current route is becoming burdensome and offers a one-question path, a break, or a precise resume point while leaving the user in charge.

**Primary user and story.** A person has skipped between sections, repeated a failed action, and paused for several minutes. The guide says, “You have seven answers left. Would you like one question at a time, save and stop, or keep this view?” They choose “save and stop” and later resume at the exact unanswered question with a short orientation.

**Problem and why AI rather than ordinary UI/rules.** A static progress bar does not explain what remains or adapt to natural-language requests such as “this page is too busy” or “help me do the shortest part first.” AI can interpret those requests and combine completion state with explicit preferences to propose a route. **Most detection must be rules-based** (save failures, unanswered counts, repeated clicks, inactivity); a model must not infer dementia, incapacity, frustration, or impairment from behavior.

**Inputs.**

- **Existing, required:** questionnaire schema, current answers, active section/question, save result, and authenticated session.
- **Existing, optional:** explicit chat/help request and current progress.
- **New, required:** chosen presentation mode, resume checkpoint, last verified save timestamp, and dismissed-offer state.
- **New, optional:** break preference, reduced-distraction mode, session-length goal, help-frequency preference, and coarse interaction events retained briefly (never raw keystrokes or covert behavioral profiling).

**Exact actions and autonomy.**

1. Deterministically calculate remaining questions and verified save state (**L0**).
2. Interpret an explicit help request or react to a bounded rule trigger; propose at most three choices and state why the offer appeared (**L1**).
3. On approval, switch to one-question/reduced-distraction mode, navigate to an unanswered field, or save a resume checkpoint (**L3, reversible UI/session action**).
4. Verify persistence before saying “saved,” provide Undo/return-to-full-view, and log only the choice, not an inferred condition (**L3**).
5. At return, orient with section, last saved time, and next choice; never auto-submit (**L0/L1**).

**Confirmation, handoff, and emergency boundary.** The user chooses every mode change; the guide stops offering after dismissal. No caregiver receives inactivity or completion information unless the user initiates Capability 5. The feature has no clinical interpretation and no emergency role; urgent content entered in answers follows the separate deterministic safety boundary, not “difficulty” signals.

**Repository-tied approach.** Extend `Questionnaire.jsx` section navigation, focus management, and progress calculation with deterministic `remainingItems` and checkpoint state. Add a presentation preference store under the authenticated user, not origin-global `localStorage`. Fix save error propagation first. Use AI only in a narrow Function that maps explicit requests to an allowlisted recommendation enum; rules create proactive offers.

**Accessibility and non-voice fallback.** The three choices are persistent buttons, not transient toast messages; focus moves predictably; status is announced once; the user can reduce motion and hide progress percentages; screen magnification and 400% reflow must retain controls. Voice may select an option, but identical touch/keyboard controls and a “Do not offer again” control are present.

**Risks, dependencies, and outcome.** Risks include annoyance, surveillance, incorrect assumptions, mode disorientation, and corrupted checkpoints. Dependencies are reliable saves, event minimization, preference sync, and tested focus restoration. Measure completion and return rate, median session length, offer accept/dismiss rate, repeated-help rate, save/resume failures, and mode-exit/Undo rate. **MVP:** deterministic remaining-items summary, user-selected one-question mode, verified save/resume. **Later:** natural-language preference interpretation and carefully tested rule-triggered suggestions; no opaque behavioral “cognitive score.”

## Candidate 3 — My Words Review: Plain-Language Read-Back and Clarification

**Name and value proposition.** **My Words Review** turns the person's answers into a short, editable plain-language read-back, flags uncertainty, and asks “Did I get that right?” before review or sharing.

**Primary user and story.** An older adult reaches Review and sees: “What matters most: staying independent and getting to church. Mobility: you use a walker at home and are worried about falling in the bathroom.” They notice the walker is only used outside, choose “Change,” and correct the source field without hunting through the form.

**Problem and why AI rather than ordinary UI/rules.** The existing report can concatenate structured values deterministically, but it cannot reliably condense varied free text, preserve the user's priorities, or identify ambiguous references across sections. AI is warranted for faithful summarization and narrowly phrased clarification; factual field lists, missing-answer counts, links back to fields, and all safety checks remain deterministic.

**Inputs.**

- **Existing, required:** authenticated user's four response maps and questionnaire labels.
- **Existing, optional:** free-text notes, selected tags, medication entries, and preferred reading level/summary length.
- **New, required:** source-field citations for every summary sentence, user confirmation/correction state, and summary version tied to answer version.
- **New, optional:** “brief” versus “more detail,” large-print preference, preferred term/name, language, and audio preference.

**Exact actions and autonomy.**

1. Generate a structured summary whose claims cite answer field IDs; reject any sentence without valid provenance (**L0**).
2. Deterministically show incomplete sections and possible structured conflicts; the model may phrase one neutral clarification at a time (**L1**).
3. Let the user jump to the cited field, edit it through the ordinary form, or mark the summary sentence wrong (**L1**).
4. Regenerate only affected sentences, display a change diff, and ask for final “This reflects my answers” confirmation (**L0/L2**).
5. Save confirmation metadata, not a claim of comprehension or clinical accuracy (**L3 after approval**).

**Confirmation, handoff, and emergency boundary.** Confirmation means the summary reflects the person's entries; it is not informed consent, a cognitive test, diagnosis, or clinician validation. Nothing is shared automatically. A caregiver/clinician handoff occurs only through Capability 4 or 5. Urgent-language rules show reviewed help options and prohibit the summary from minimizing the concern; the agent must never say an emergency is or is not present.

**Repository-tied approach.** Build on the current `ReviewSubmit.jsx` report view and `getUserQuestionnaireContext`, replacing free-form prompt interpolation with typed, untrusted payload data. Return `{sentence, sourceFieldIds, uncertainty}` records, validate them server-side, and link each to the existing `goToSection(section, question)` focus path. Keep a deterministic no-AI report fallback.

**Accessibility and non-voice fallback.** Short headings, one idea per sentence, expandable detail, user-controlled large print/spacing, no idioms, preserved preferred terms, source links with meaningful labels, screen-reader landmarks, and optional slowed speech synthesis. Full visible text, print, and download remain available without audio; audio never advances or confirms on the user's behalf.

**Risks, dependencies, and outcome.** Risks are omission, emphasis distortion, false reassurance, stigmatizing language, loss of nuance, reading-level mismatch, and users mistaking the summary for clinical advice. Dependencies are provenance validation, answer versioning, plain-language style evaluation, clinician review of safety copy, and representative comprehension testing. Measure correction rate, unsupported-claim rate (target zero), time to locate/correct a field, user-rated fidelity/confidence, Review completion, and disparities by literacy/modality. **MVP:** What Matters and Mobility read-back with citations and deterministic fallback. **Later:** all 4Ms, multilingual summaries, audio, and user-selected detail; never infer capacity or health literacy.

## Candidate 4 — Visit Ready: Accessible Agenda and Question Draft

**Name and value proposition.** **Visit Ready** converts confirmed questionnaire content into a concise, user-editable visit agenda centered on What Matters, helping the person raise priorities without presenting an AI care plan.

**Primary user and story.** Before an appointment, an older adult chooses “Help me prepare.” The agent drafts a large-print page with their top goal, medications to verify, two questions about memory/sleep concerns, mobility notes, and blank space for answers. They remove one question, reorder the rest, and download or print it.

**Problem and why AI rather than ordinary UI/rules.** A template can list all answers, but selecting and phrasing a manageable agenda from free text and multiple domains benefits from semantic summarization and personalization. AI must only draft from confirmed data; deterministic code controls sections, length, source links, warnings, format, and export.

**Inputs.**

- **Existing, required:** user-confirmed summary/current answers, questionnaire schema, and explicit “prepare” request.
- **Existing, optional:** medication entries, appointment purpose/date, clinician type, user's chosen top priority, and preferred format.
- **New, required:** per-item source fields and user approval state.
- **New, optional:** up to three questions the user already wants to ask, print size, language, appointment notes, and later calendar/EHR destination.

**Exact actions and autonomy.**

1. Ask the user to select or confirm the top priority rather than infer it solely from answer order (**L1**).
2. Draft a bounded agenda: one What Matters statement, verified medication list, up to three questions, mobility/mentation notes, and blank notes area; cite every source (**L2**).
3. Offer edit, reorder, remove, print, download, or native share preview (**L2**).
4. After explicit approval, generate/download/print locally or open the OS share sheet (**L3, user-controlled reversible preparation action**). Sending to a clinician is later and requires authenticated destination confirmation.
5. Record that a document was created; do not retain the exported file server-side by default (**L3**).

**Confirmation, handoff, and emergency boundary.** The user approves the complete preview and destination. The agenda is labeled “My notes for discussion—not medical instructions.” No clinician relationship is assumed and no appointment is booked. If urgent content is detected, the agent displays separate urgent-help copy immediately rather than placing it only on a future agenda. It never recommends stopping, starting, or changing medication.

**Repository-tied approach.** Extend `ReviewSubmit.jsx` share/print/download paths with a typed agenda object and accessible print stylesheet. Generate the draft in the secured consolidated Functions backend, validate source field IDs and maximum length, and provide a deterministic template when AI is unavailable. Native share should expose the OS chooser; SendGrid should not be the MVP path.

**Accessibility and non-voice fallback.** Large-print and standard-print templates, strong contrast, semantic heading/list structure, medication table that reflows, no tiny QR-only access, screen-reader-friendly preview, easy reorder buttons as well as drag alternatives, and plain text download. Speech can read the preview, while all edits and approval remain available by keyboard/touch/text.

**Risks, dependencies, and outcome.** Risks include omitted priorities, hallucinated questions, accidental disclosure through share, inaccessible print layout, and implying clinical endorsement. Dependencies are Capability 3-style provenance, secure export, destination preview, and clinical/plain-language review. Measure agenda creation completion, edits/removals before approval, unsupported claims, print/readability defects, self-reported ability to raise priorities, and accidental-share cancellations. **MVP:** preview/edit/print/download with deterministic fallback. **Later:** explicitly authorized clinician portal/EHR delivery, calendar linkage, and post-visit note capture; external integrations are not assumed available.

## Candidate 5 — Help on My Terms: Scoped Support-Person Handoff

**Name and value proposition.** **Help on My Terms** lets the older adult request a narrowly scoped task from a chosen support person without turning over the full questionnaire or silently notifying a caregiver.

**Primary user and story.** A user wants a daughter to check medication names but wants What Matters and memory answers private. The agent drafts: “Please help verify these three medication names and doses.” A permission preview says exactly what the daughter can see and edit, for seven days. The user approves, later reviews every proposed edit, and revokes access.

**Problem and why AI rather than ordinary UI/rules.** Permissions, expiry, authorization, and data filtering are strictly ordinary security logic. AI is useful only to translate a natural-language help goal into a draft task and explain the permission in plain language. It must not choose the helper, expand scope, or judge the older adult's capacity.

**Inputs.**

- **Existing, required:** authenticated user, explicit request for help, selected questionnaire fields/task, and a deliberately chosen recipient (the profile `caregiverEmail` is never sufficient consent by itself).
- **Existing, optional:** structured medication entries and current review state.
- **New, required:** verified support-person identity/invitation state; granular read/propose-edit scopes; expiry; communication channel; revocation; recipient acceptance; audit history; and per-change owner approval.
- **New, optional:** custom message, no-health-details notification preference, trusted-device preference, and recurring-helper relationship.

**Exact actions and autonomy.**

1. Interpret “what help do you want?” into an allowlisted task/scope draft, defaulting to the least data (**L2**).
2. Show a concrete permission preview: recipient, fields visible, permitted action, expiry, notification contents, and what remains private (**L2**).
3. After separate recipient and scope confirmation, create a revocable invitation and send a minimal notification through an authenticated, rate-limited tool (**L3**).
4. Let the helper propose—not directly commit—changes; show the older adult field-level diffs with Accept/Reject (**L2**, then older adult-approved **L3** write).
5. Display active access and history persistently; revoke immediately on request (**L3**). A later recurring relationship may be **L4** only for the pre-authorized scope, with easy pause/revoke.

**Confirmation, handoff, and emergency boundary.** Entering a caregiver email is not authorization. Sharing needs just-in-time confirmation and, for high-sensitivity domains such as mentation, separate confirmation. The older adult receives the final decision unless a legally established representative workflow is independently designed and reviewed. The helper cannot see chat history or location by default. The invitation is not an emergency service; urgent situations show emergency/clinical options to the current user and do not auto-alert the helper.

**Repository-tied approach.** Do not reuse the current unconsented daily SendGrid flow. Add a delegated-access collection, invitation/acceptance Function, per-field authorization middleware, short-lived links, rate limits, and owner-visible audit/revoke UI. Firestore rules must become owner/scope based before pilot. `ProfileModal.jsx` can display but must not imply authorization from `caregiverEmail`; `ReviewSubmit.jsx` can launch the task builder.

**Accessibility and non-voice fallback.** Permission preview uses concrete examples (“Maria can see medication names; Maria cannot see memory answers”), not legalistic abstractions. Scope checkboxes have labels and large targets; expiry is expressed as a date and duration; revoke is always visible; no color-only state. The entire flow works through text/touch/keyboard, with optional read-aloud. The helper-facing interface must meet the same standard.

**Risks, dependencies, and outcome.** Risks are coercion, family abuse, mistaken identity, oversharing, hidden proxy use, account takeover, inaccessible consent, and user confusion over who edited what. Dependencies are a qualified privacy/legal review, robust delegated authorization, identity verification, audit/revoke, safe notifications, and usability studies that include privacy-preferring adults and caregivers. Measure successful bounded tasks, rejected helper edits, permission comprehension, revocation rate/time, oversharing incidents (target zero), support burden, and whether users can correctly state what is shared. **MVP:** research prototype for medication-name verification with read/propose-only scope, expiry, and owner approval. **Later:** production delegation across user-selected fields; recurring permissions only after safety evidence. This should not ship on the current rules/API architecture.

## Candidate 6 — Remember My Plan: Private Resume and Reminder Steward

**Name and value proposition.** **Remember My Plan** helps a person make and maintain a simple completion or follow-up plan, then sends only the reminders they explicitly authorize, at chosen times and through chosen channels.

**Primary user and story.** After saving halfway through, a user says, “Remind me tomorrow after breakfast.” The agent proposes “9:00 a.m. tomorrow, app notification, says only ‘Your questionnaire is ready to continue.’” The user changes it to 10:00, approves it, and later pauses all reminders from a visible control.

**Problem and why AI rather than ordinary UI/rules.** Scheduling and delivery are deterministic. AI is warranted only to interpret flexible time phrases and help turn a broad goal into a small plan linked to verified incomplete work. A standard date/time picker is always available and is preferable when interpretation is uncertain.

**Inputs.**

- **Existing, required:** authenticated user, verified incomplete/completed state, timezone, and explicit reminder request or acceptance.
- **Existing, optional:** current section, existing profile email, and user wording.
- **New, required:** normalized time/timezone, channel, privacy-safe message preview, purpose, one-time/recurring status, consent timestamp, quiet hours, pause/revoke state, delivery/audit status, and deduplication key.
- **New, optional:** preferred routine cue (“after breakfast”), expiration, maximum frequency, app/push/SMS channel, and support-person recipient through Capability 5 only.

**Exact actions and autonomy.**

1. Deterministically identify whether a relevant task remains; interpret a time phrase and show the exact date, time, timezone, channel, and message (**L2**).
2. Require explicit approval before creating a reminder (**L3**).
3. Deliver one-time reminders or, only after granular standing authorization, recurring reminders within frequency/quiet-hour limits (**L4**).
4. Verify delivery outcome without claiming the person received/read it; avoid duplicates and show history (**L4**).
5. Let the user snooze, edit, pause, or delete in one step; auto-expire reminders when the task is complete (**L3/L4**).

**Confirmation, handoff, and emergency boundary.** “Daily reminder” requires a preview and standing-consent confirmation; default is one-time. No caregiver copy without a separate active Capability 5 permission. Messages reveal no 4Ms domain or health detail on a lock screen by default. Reminder nonresponse never triggers welfare surveillance. It is not emergency monitoring, medication adherence surveillance, or a dose reminder; urgent content follows a separate clinically approved boundary.

**Repository-tied approach.** Replace rather than extend the current unsafe blanket daily scheduler in `functions/index.js`. Add authenticated reminder CRUD tools, per-user consent/preferences, Cloud Tasks or an equivalent reliable scheduler, timezone/quiet-hour logic, idempotency, completion cancellation, and visible history. The current SendGrid adapter may support opted-in email after endpoint authentication and recipient verification; in-app reminder is safer for MVP.

**Accessibility and non-voice fallback.** Always pair natural-language interpretation with an accessible date/time picker; display absolute dates (“Thursday, June 18 at 10:00 AM Eastern”), avoid time-only ambiguity, support screen readers, and provide large Snooze/Pause/Stop controls. Text/touch/keyboard is complete without speech. Notifications link to the precise resume point and do not time out.

**Risks, dependencies, and outcome.** Risks are wrong time interpretation, alert fatigue, privacy leakage, repeated delivery, coercive adherence framing, inaccessible notification settings, and unreliable offline/network delivery. Dependencies are authenticated scheduler tools, verified saves, timezone and preference model, delivery observability, and consent records. Measure successful resume after reminder, wrong-time edits, opt-out/pause rate, duplicate/quiet-hour violations (target zero), notification complaints, completion after reminder, and disparities by channel/connectivity. **MVP:** one-time in-app/email reminder for questionnaire resumption with explicit preview. **Later:** opt-in recurring follow-up plans and more channels; medication-dose reminders and nonresponse escalation are out of scope without clinical governance and stronger evidence.

## Ordinary accessibility and reliability work — not AI

These items are prerequisites and should not be marketed as agent capabilities. A model would add unpredictability where standards, UI, or business rules are sufficient.

| Improvement | Why ordinary implementation is correct | Repository relevance |
|---|---|---|
| Programmatically associate every visible label, description, error, and required state | Semantic HTML/ARIA and tested component wiring are deterministic WCAG work | Fix gaps in `4msSection.jsx`; test Ant Design control names/descriptions |
| Validate WCAG 2.2 AA, keyboard, screen reader, 200%/400% zoom and reflow, contrast, focus order/visibility, reduced motion, and target size | Conformance cannot be generated or asserted by AI | App-wide audit; Phase 1 found no conformance evidence |
| Give camera/scanner errors visible, specific recovery text and never announce a non-medication match as “medication found” | Known error states and medication semantics require deterministic validation | `MedicationScanner.jsx`, `drugLookupService.js` |
| Stop speech-synthesis retry loops; expose pause/stop/rate and retain the same visible text | Media control and fallback behavior are deterministic | `SpeechReader.jsx` |
| Fix save error propagation, add a persistent saved/failed state, retry, offline draft, and precise resume point | Reliability and state machines, not language generation | `saveSectionResponses`, `Questionnaire.jsx` |
| Keep progress within 0–100%, explain optional questions, and do not equate completion with health quality | Counting and copy rules are deterministic | `Questionnaire.jsx`, `ReviewSubmit.jsx` |
| Offer user-controlled text size/spacing, high contrast, reduced-distraction/one-question view, and remember preferences per authenticated user | Explicit settings are more transparent than inferred “adaptive accessibility” | Layout/theme and questionnaire renderer; avoid global `localStorage` |
| Make help persistent and consistently located; add Back, Cancel, Undo, and “Do not ask again” | Predictable navigation and error prevention are established interaction patterns | Questionnaire, chatbot, scanner, sharing flows |
| Provide accessible authentication without memory/puzzle barriers and safe session recovery | Security plus WCAG, not AI | Firebase Auth/sign-in flows |
| Replace mojibake and use plain, non-patronizing copy; professionally translate/localize | Content quality needs editorial and localization governance | Current docs/prompts/UI strings contain mojibake |
| User-scope or remove chat/quick-question/location browser storage; support delete/export/retention controls | Privacy architecture, not personalization | `AIChatbot.jsx` origin-global keys |
| Conduct moderated co-design/usability testing with diverse older adults and assistive technologies | Models cannot stand in for affected users | Required before claiming older-adult usability or accessibility |

## Cross-capability safeguards and sequencing

1. **Foundation before agents:** rotate the exposed credential; authenticate Functions; restrict Firestore ownership; consolidate backends; redact logs; scope browser storage; fix save/scanner reliability; and establish emergency copy with qualified clinical review.
2. **Typed action boundary:** an allowlisted server-side tool registry validates user, field scope, consent, answer version, idempotency, and rate limits. Model output never directly mutates Firestore, sends messages, or schedules work.
3. **Accessible confirmation pattern:** show action, data, recipient/destination, timing, consequences, and Undo/Revoke in plain language. Confirmation is a real control, not a conversational “okay” inferred from unrelated text.
4. **Provenance and uncertainty:** every summary, extraction, or agenda item points to source fields; unverifiable output is blocked. Do not expose raw model confidence as if clinically meaningful.
5. **No capacity inference:** interaction speed, mistakes, voice characteristics, memory answers, or caregiver involvement never become a cognitive score, capacity judgment, or basis for reducing user control.
6. **Modality parity:** voice is optional enhancement. Every task—including correction, confirmation, cancel, and emergency access—must work visually by keyboard/touch and with assistive technology.
7. **Offline/low-bandwidth behavior:** ordinary forms, verified local draft status, deterministic report, and accessible recovery remain usable when AI/provider/network is unavailable. Clearly label the unavailable enhancement.
8. **Recommended discovery order:** first build ordinary accessibility/reliability foundations; then pilot Capability 3 (read-back) and Capability 4 (agenda) as L0/L2 drafts; next Capability 1 with tightly bounded fields; then Capability 2. Capability 6 requires scheduler consent infrastructure. Capability 5 requires the largest privacy/security/delegation program and should begin as research only.

## Merged and rejected variants

- “Voice questionnaire,” “smart form fill,” and “conversation capture” are merged into **Say It Once** because they share the same transcript-to-field draft and confirmation boundary.
- “Cognitive mode,” “senior mode,” and “AI detects confusion” are rejected. Use explicit preferences and bounded help triggers in **My Pace Guide**; never label or infer impairment.
- “AI explains my results,” “teach-back,” and “personalized summary” are narrowed into **My Words Review**. It explains the user's entries, not medical meaning, and tests the system's fidelity rather than the user's intelligence.
- “Caregiver copilot,” “family dashboard,” and automatic alerts are rejected in favor of **Help on My Terms**, with least-privilege task scope, expiry, and owner approval.
- “Daily health coach,” medication adherence monitoring, and missed-reminder escalation are rejected. **Remember My Plan** is private task resumption, not surveillance or clinical monitoring.
- Automated accessibility overlays, inferred font sizing from age/behavior, emotion recognition, and model-generated emergency triage should not be pursued.

## Shortlist judgment

The best near-term accessibility-led candidates are **My Words Review** and **Visit Ready**: both reduce review burden, use data the app already holds, remain useful with deterministic fallbacks, and can start at L0/L2. **Say It Once** has greater interaction benefit but needs stronger validation and field-level confirmation. **My Pace Guide** should begin mostly as ordinary UI/rules, with AI limited to interpreting explicit requests. **Remember My Plan** becomes appropriate only after consent-aware scheduling replaces the current blanket reminders. **Help on My Terms** could be valuable but is research-stage until granular delegation, identity, security rules, and abuse-aware consent are designed and tested.
