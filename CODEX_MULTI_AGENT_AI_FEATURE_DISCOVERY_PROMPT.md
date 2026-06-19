# Codex Multi-Agent Instruction: AI Agent Capabilities for the 4Ms Health Questionnaire

## Your assignment

Act as the lead research-and-product architect for this repository. Use multiple Codex subagents to discover, challenge, rank, and roadmap the best AI-agent capabilities for this specific application and its older-adult users.

This is a research, product-definition, and implementation-planning task. Do **not** implement the proposed product features in this run. Your final deliverable is a single decision-ready Markdown report written to:

`AI_AGENT_CAPABILITIES_RESEARCH_AND_ROADMAP.md`

Do not merely produce a list of chatbot ideas. Determine what an AI **agent** could safely and usefully do inside this application: understand user goals and questionnaire data, guide workflows, propose actions, execute permitted low-risk actions, request confirmation for consequential actions, follow up over time, coordinate with caregivers when authorized, and explain what it did.

## Non-negotiable operating rules

1. Inspect the repository before proposing features. Treat code and configuration as the source of truth; documentation can be stale.
2. Use subagents in several waves. Run independent work in parallel when possible, but never exceed the concurrency available in the Codex environment.
3. Give every subagent the repository context report produced in Phase 1, plus the outputs relevant to its role.
4. Require disagreement. Agents must identify weak assumptions, duplicate ideas, unsafe automation, missing data, and features that sound impressive but would not improve the older adult's experience.
5. Use current external research. Search the web and cite direct links to authoritative, primary, or high-quality sources. Prefer peer-reviewed research, government health agencies, standards bodies, official accessibility guidance, and official technical documentation. Clearly separate research evidence from inference.
6. Do not expose secrets or reproduce credentials found in the repository. Note the security issue and redact the value.
7. Do not edit application code, schemas, dependencies, or configuration. Only create/update the requested final report and temporary research notes if needed.
8. Do not ask the user routine questions. Make reasonable, clearly labeled assumptions. Ask only if a missing choice makes a responsible result impossible.
9. Complete every phase. If a subagent fails, retry its bounded assignment or have another agent cover it; document any remaining evidence gap.
10. Recommendations must fit this project, not an imaginary enterprise platform. Distinguish MVP work from later integrations and research-dependent concepts.

## Known starting context — verify all of it

The repository appears to be a React/Vite/Firebase 4Ms health assessment for older adults. The four domains are What Matters, Medications, Mentation/Mind, and Mobility. It appears to include:

- Firebase authentication and Firestore user/questionnaire/session data.
- A guided 4Ms questionnaire with autosave, progress, review, and submission.
- Inputs including selected tags, free text, Likert-style ratings for happiness, memory, and sleep, medication details, mobility type/aids/challenges, fall concerns, and caregiver email.
- Medication scanning, speech input/recognition, optional browser location, and caregiver mobility-tip email.
- An AI assistant that sends chat history plus selected questionnaire context to an OpenRouter-backed model, generates personalized quick questions, and stores some client-side chat state.
- Backend implementations in both `chat-backend/` and Firebase `functions/`, which may have drifted.
- Existing reminder/email logic that must be verified for production readiness, consent, authentication, scheduling, and safety.

Confirm, correct, and expand this context from the actual code. Identify what is genuinely active, duplicated, incomplete, unsafe, or documented but not implemented.

## Core design principles

Every candidate feature must be evaluated against these principles:

- **Older-adult usefulness:** reduces effort, confusion, anxiety, memory burden, or barriers to completing meaningful health tasks.
- **Autonomy and dignity:** supports the older adult rather than infantilizing, coercing, surveilling, or silently handing control to a caregiver.
- **Accessibility:** accounts for visual, hearing, motor, speech, literacy, cognitive, language, and technology-confidence differences. Use WCAG 2.2 and relevant older-adult HCI evidence.
- **Safety:** the system is not a clinician, must not diagnose, must not silently change medication behavior, and must correctly escalate urgent warning signs.
- **Consent and agency:** disclose data use; obtain granular, revocable permission; distinguish the patient, caregiver, and clinician roles; confirm consequential actions.
- **Privacy and security:** data minimization, least privilege, secure logging, retention limits, auditability, prompt-injection resistance, and authorization for every tool/action.
- **Reliability:** deterministic checks around model outputs, idempotent actions, retry behavior, monitoring, fallbacks, and clear uncertainty.
- **Project fit:** buildable with the current React/Firebase/Node architecture or with explicitly justified additions.
- **Measurable value:** has observable success metrics beyond engagement or message count.

## Phase 1 — Repository forensics and detailed context report

Create one **Repository Analyst** subagent. Its output must be detailed enough that agents in later phases do not need to rediscover the basics.

The analyst must inspect at minimum:

- `README.md`, `AI_SETUP.md`, `package.json`, environment examples, Firebase rules/indexes, and deployment configuration.
- `src/components/AIChatbot.jsx`, `SpeechReader.jsx`, scanning components, app layout/routes, profile/auth flows, dashboard, and all questionnaire views.
- `src/services/questionnaireService.js`, API client, Firebase service, medication/drug lookup, and related constants.
- `chat-backend/server.js`, `functions/index.js`, `functions/aiModelRouter.js`, and backend package/configuration files.
- Existing project/paper planning documents when relevant, without assuming they describe current runtime behavior.

The context report must contain:

1. Product purpose, intended users, stakeholders, and current user journeys.
2. A complete inventory of current inputs, outputs, stored fields, derived context, communications, and device capabilities.
3. Current AI behavior: prompts, context assembly, model routing, conversation storage, quick questions, voice/location behavior, fallbacks, rate limits, and current action capabilities.
4. Architecture and data-flow description with important file references.
5. Current accessibility and older-adult design provisions.
6. Current safety, privacy, consent, security, and reliability controls—and gaps.
7. Confirmed technical constraints, duplicate implementations, stale documentation, unfinished code, and integration seams.
8. A strict classification of each statement as **Implemented**, **Partially implemented**, **Documented only**, **Inferred**, or **Unknown**.
9. A concise list of reusable assets and blockers that later agents must respect.

The lead agent must review the report against the repository and correct unsupported claims before using it.

## Phase 2 — Independent capability discovery

Using the validated Phase 1 context, create the following specialist subagents. If concurrency is limited, run them in waves. Each specialist must propose 5–8 distinct capabilities, merge obvious variants, and provide a short implementation concept for each.

### A. Older-Adult Experience and Accessibility Designer

Focus on low-friction interaction, cognitive load, voice and multimodal use, readability, error recovery, confidence, progressive disclosure, low digital literacy, accessibility, and preserving dignity. Consider a spectrum of older-adult needs rather than one stereotype.

### B. Geriatric 4Ms and Care-Workflow Specialist

Focus on the four Ms, longitudinal follow-up, preparing for clinical visits, identifying missing or conflicting questionnaire information, supporting shared decision-making, and appropriate caregiver involvement. This agent must not claim clinical authority it does not possess.

### C. Practical Agentic-Workflow Product Designer

Focus on tasks an agent can perform inside the app instead of merely answering questions. For every task, specify the trigger, data required, tools/integrations, action steps, confirmation boundary, result shown to the user, failure recovery, and audit trail.

### D. “Wow but Useful” Innovation Scout

Explore differentiated features that could make the product unusually valuable while remaining plausible. Reject novelty that lacks a clear older-adult outcome. Mark ideas requiring new sensors, EHR access, pharmacy data, calendars, messaging, wearables, or third-party services.

Each proposed capability must include:

- Name and one-sentence value proposition.
- Primary user and concrete user story.
- Problem solved and why AI/agent behavior is warranted instead of ordinary UI/business logic.
- Existing inputs used and any proposed new inputs, with whether each is required or optional.
- Exact agent actions and autonomy level using this scale:
  - **L0:** explain or summarize only;
  - **L1:** recommend an action;
  - **L2:** prepare/draft an action for explicit approval;
  - **L3:** execute a reversible, low-risk action after explicit approval;
  - **L4:** execute a pre-authorized recurring action with easy pause/revoke and audit history.
- User confirmation, caregiver/clinician handoff, and emergency boundary.
- High-level implementation approach tied to this repository.
- Accessibility behavior and non-voice fallback.
- Risks, limitations, dependencies, and measurable outcome.
- MVP slice versus later version.

## Phase 3 — Persona council: judge from older adults' perspectives

Create a **Persona Council** subagent. It must evaluate the combined candidate pool through at least these evidence-informed lenses:

1. Independent older adult, comfortable with technology, managing several medications.
2. Older adult with low vision and reduced fine-motor control.
3. Older adult with hearing loss who cannot rely on audio.
4. Older adult with mild cognitive impairment or high memory burden.
5. Older adult with low health literacy and low technology confidence.
6. Rural or low-income user with intermittent connectivity and limited services.
7. Older adult who values privacy and does not want automatic caregiver disclosure.
8. Authorized family caregiver supporting an older adult without replacing their autonomy.

These are design lenses, not claims that an AI can literally speak for all older people. For each feature, the council must state who benefits, who may be excluded or harmed, what friction remains, and what design adjustment is necessary.

Score each candidate from 1–5 on:

- Immediate usefulness.
- Ease of learning and use.
- Accessibility and inclusive reach.
- Autonomy/dignity.
- Trust and transparency.
- Likelihood of repeated real-world value.

Include short first-person walkthroughs for the strongest candidates showing exactly how an older adult would experience the feature, including mistakes, confirmation, cancellation, and recovery.

## Phase 4 — Feasibility, clinical safety, and adversarial review

Run these reviews independently so one concern is not diluted by group consensus.

### A. Engineering Feasibility Architect

For every surviving candidate, assess:

- Fit with current React/Vite, Firebase Auth/Firestore/Functions, Node/Express, OpenRouter, SendGrid, browser APIs, and existing data model.
- Frontend, backend, schema/index, security rules, prompt/tool orchestration, scheduler/queue, notification, and observability changes.
- Whether deterministic logic should replace or constrain model output.
- External services, costs, vendor lock-in, availability, latency, offline behavior, testing burden, and ongoing maintenance.
- Dependencies and estimated effort as S/M/L/XL plus an approximate engineer-week range. State staffing assumptions.
- Technical unknowns requiring a spike.

### B. Clinical Safety, Privacy, Security, and Ethics Reviewer

For every candidate, assess:

- Foreseeable harm, medical overreach, hallucination, false reassurance, alert fatigue, bias, loss of autonomy, caregiver abuse/misuse, and emergency failure.
- Consent, authorization, data minimization, retention, audit, access control, secrets, logging, and sensitive-data exposure.
- Prompt injection and tool misuse, including malicious content in questionnaire free text, model messages, scanned medication data, email content, or third-party responses.
- Required guardrails, human review, contraindicated actions, escalation copy, and stop conditions.
- Regulatory/compliance questions that need qualified legal or clinical review. Do not declare compliance merely from code inspection.

Assign each feature a safety disposition:

- **Proceed** — manageable with normal controls.
- **Proceed with mandatory safeguards** — valuable but only if named controls are implemented first.
- **Research/pilot only** — evidence, clinical validation, or integration is not ready for broad use.
- **Reject** — risk or mismatch outweighs likely value.

### C. Red-Team Product Critic

Attack the proposal set. Identify:

- Features that are generic chatbot functions disguised as agents.
- Features better solved by a simple form, reminder, rules engine, or accessibility improvement.
- Duplicate or mutually dependent features.
- Hidden workflow burden placed on the older adult or caregiver.
- Unrealistic integrations, unjustified assumptions, and costs omitted by proponents.
- “Wow” concepts likely to be demos rather than durable value.
- Cases where false positives/negatives could cause harm.

The critic must recommend **keep**, **merge**, **defer**, or **reject** for every candidate and explain why.

## Phase 5 — Structured debate and synthesis

The lead agent must create a comparison matrix combining all candidate ideas and all reviews. Normalize duplicate names before scoring.

Have the discovery agents receive the feasibility, persona, safety, and red-team findings and write one rebuttal/ revision each. They may narrow or withdraw ideas; they may not dismiss a concern without evidence.

Then have a **Portfolio Judge** independently rank the revised candidates using this 100-point weighted rubric:

| Criterion | Weight |
|---|---:|
| Older-adult usefulness and burden reduction | 20 |
| Accessibility and inclusion | 12 |
| Autonomy, dignity, trust, and consent | 10 |
| Clinical/safety appropriateness | 15 |
| Fit with the current 4Ms app and available data | 12 |
| Engineering feasibility within 6–12 months | 12 |
| Agentic advantage over non-AI alternatives | 8 |
| Measurable health/workflow value | 6 |
| Differentiation / responsible “wow” value | 5 |
| **Total** | **100** |

For scoring:

- Give a 1–5 raw score for each criterion, calculate the weighted total correctly, and show the formula.
- Apply a **safety veto** to any “Reject” disposition.
- A feature cannot enter the final portfolio if accessibility, autonomy/consent, or safety scores below 3/5 unless the roadmap includes a prerequisite that directly corrects it; explain the exception.
- Penalize features that require unavailable data or partnerships unless an earlier phase explicitly establishes them.
- Include confidence (High/Medium/Low) and evidence strength for each total.
- Provide the full ranked list, not only the winners.

The lead agent makes the final decision but must document where it agrees or disagrees with the Portfolio Judge.

## Phase 6 — Select the portfolio and build the roadmap

Select **3–5 capabilities** for a coherent portfolio. Do not simply choose the highest individual scores: account for dependencies, shared infrastructure, coverage across the 4Ms, accessibility, risk, and cumulative user burden.

Choose either a 6-month or 12-month roadmap based on realistic effort. A 12-month plan is preferable if clinical review, external integrations, longitudinal evaluation, or foundational agent infrastructure is required. State the assumed team composition and capacity.

For each selected capability, provide:

1. Precise scope and explicit non-goals.
2. End-to-end user flow, including consent, confirmation, cancellation, failure, and escalation.
3. Existing data used and proposed new fields/inputs, each with purpose, sensitivity, retention, and user control.
4. Agent tools/actions and their autonomy level.
5. Architecture and component-level implementation outline with relevant repository paths.
6. Deterministic guardrails surrounding the model.
7. Accessibility requirements and fallback interaction modes.
8. Safety/security/privacy requirements and review checkpoints.
9. Dependencies and sequencing.
10. MVP acceptance criteria and test strategy.
11. Success, safety, accessibility, and adoption metrics. Include counter-metrics such as overrides, cancellations, false alerts, and caregiver-sharing revocations.
12. Estimated effort, operating cost considerations, and major uncertainties.

Also provide a shared platform plan covering, where warranted:

- Typed tool/action registry and strict server-side authorization.
- Consent and delegated-caregiver permission model.
- Action confirmation and undo/revoke patterns.
- Audit history visible to the older adult.
- Structured outputs and deterministic validation.
- Safety triage and emergency handling reviewed by qualified professionals.
- Prompt-injection defenses and separation of instructions from untrusted user/external content.
- Notification preferences, quiet hours, timezone, channel choice, and rate limits.
- Data minimization, retention, deletion, export, and redacted logging.
- Evaluation datasets, simulations, usability testing with older adults, and staged rollout/feature flags.
- Monitoring, model/provider failure fallback, cost controls, and incident response.

## Required Gantt chart

The final report must include both:

1. A Mermaid `gantt` diagram covering the chosen 6- or 12-month period.
2. A Markdown milestone table usable if Mermaid rendering is unavailable.

The Gantt must:

- Use relative labels such as Month 1–Month 12 unless a real project start date is known.
- Show foundational work, each selected feature, dependencies, clinical/safety/privacy reviews, older-adult co-design/usability studies, accessibility audits, security testing, pilot rollout, evaluation, and production hardening.
- Separate discovery/spikes, design, implementation, verification, pilot, and rollout.
- Show parallel work only when staffing assumptions support it.
- Identify decision gates and milestones, not only continuous bars.
- Avoid false precision; explain the confidence and contingency buffer.

## Final report structure

Write `AI_AGENT_CAPABILITIES_RESEARCH_AND_ROADMAP.md` with this exact top-level structure:

1. **Executive Decision**
2. **Repository and Current-AI Assessment**
3. **Older-Adult Needs and Evidence Base**
4. **Candidate Capability Catalog**
5. **Persona Council Findings**
6. **Engineering Feasibility Analysis**
7. **Clinical Safety, Privacy, Security, and Ethics Review**
8. **Red-Team Critique and Agent Rebuttals**
9. **Scoring Method and Full Ranked Matrix**
10. **Selected 3–5 Feature Portfolio**
11. **Detailed Implementation Blueprints**
12. **Shared Agent Platform and Data Changes**
13. **6- or 12-Month Roadmap and Gantt Chart**
14. **Validation, Metrics, and Rollout Gates**
15. **Rejected or Deferred Features**
16. **Open Questions, Assumptions, and Decision Log**
17. **Sources**

## Quality bar for the final report

The report is complete only when:

- All important claims about the current application cite repository paths and, where useful, line numbers.
- All time-sensitive external claims have direct citations and access dates.
- The current system is clearly separated from proposals.
- Every selected feature has a concrete agent loop: observe → reason within policy → propose/confirm → act through an authorized tool → verify → record → follow up.
- Every consequential action has an explicit confirmation and authorization model.
- The roadmap includes prerequisites, dependencies, testing, clinical/safety/privacy gates, and older-adult usability validation.
- The full score math is visible and internally consistent.
- Rejected ideas and dissent are preserved rather than hidden.
- Recommendations name what should remain deterministic and what genuinely benefits from AI.
- No feature depends on an unstated data source or integration.
- The prose is concrete, concise, and understandable to product, engineering, clinical, and research readers.

## Start now

Begin by creating the Repository Analyst subagent. Validate its output yourself, then execute the remaining phases. Continue until `AI_AGENT_CAPABILITIES_RESEARCH_AND_ROADMAP.md` is complete and internally checked. In your final chat response, link to that file and briefly state the selected portfolio, roadmap duration, and any material evidence limitations.
