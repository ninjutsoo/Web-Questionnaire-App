# Paper Planning Blueprint

## 1. Executive recommendation

This paper should **not** be written as a clinical effectiveness paper, an AI validation paper, or a true dyadic caregiver system paper.

Based on the implemented repository, the most defensible paper is:

- a **formative system/usability paper**
- about a **web-based 4Ms self-report platform for older adults**
- with **accessibility-oriented interaction features**
- and **questionnaire-contextualized AI assistance**
- plus **caregiver-adjacent support**, not full caregiver co-use

The core story is not “we built an AI health platform that improves outcomes.” The core story is:

> We implemented a 4Ms-oriented digital self-report system for older adults that combines structured assessment, multimodal accessibility features, mobility-tailored guidance, and contextual AI assistance, and we can now evaluate whether older adults can use it, what parts are useful, and where the system breaks down.

The strongest structural model is the **2024 JMIR Formative Research paper**. The **2019 JMIR Aging paper** is useful mainly for problem framing around older adults, caregiving, and real-world support needs, but your current system does **not** support the same dyadic interaction model.

## 2. Best paper framing for this project

### Recommended framing

**Primary recommendation:** `formative usability / feasibility system paper`

Suggested one-sentence framing:

> A formative mixed-methods evaluation of a web-based 4Ms questionnaire system for older adults, featuring multimodal input and questionnaire-contextualized AI assistance.

### Why this framing fits

- The repo clearly implements a real system.
- The repo does **not** contain evidence of health outcomes.
- The repo does **not** contain a validated measurement instrument.
- The repo does **not** implement a true clinician workflow.
- The repo does **not** implement a true caregiver portal or bidirectional dyad workflow.
- The repo does support a credible **prototype/system contribution** and a credible **usability/feasibility study**.

### Framing options ranked

1. **Formative usability/system paper**
   Best fit.

2. **Pilot feasibility paper**
   Viable if you run a short live deployment and collect completion, usability, and qualitative feedback.

3. **Accessibility-oriented digital self-management paper**
   Viable if you foreground speech input/output, simplified structured entry, and older-adult usability barriers.

4. **Dyad usability paper**
   Not recommended as the primary framing because the code does not implement a real caregiver-facing co-use workflow.

5. **AI assistance paper**
   Not recommended as the primary framing because the AI component is supportive and contextual, but not independently validated.

### What the paper should actually be about

The paper should be about:

- the design and implementation of a **4Ms-based older-adult self-report web app**
- how it operationalizes 4Ms capture in a digital format
- how it uses **voice support, structured prompts, medication scanning, and mobility-specific guidance**
- how questionnaire data is used to personalize AI interaction
- whether older adults can use this system in a realistic formative evaluation

It should **not** be about:

- diagnosing conditions
- improving clinical outcomes
- proving medication safety
- proving caregiver coordination effectiveness
- validating AI advice
- validating the 4Ms questionnaire as a psychometric instrument

## 3. Comparative analysis of the 2 seed papers

### Primary structural template

**Use `formative-2024-1-e54299.pdf` as the primary structural template.**

Why:

- It is tighter and more reviewer-safe.
- Its claims are better aligned to pilot evidence.
- Its abstract, introduction, methods, results, and discussion all match the evidence level.
- It clearly separates what is shown now from what needs later validation.

### Secondary framing template

**Use `aging-2019-1-e12276.pdf` as a contextual framing template, not a direct structural template.**

Why:

- It is useful for motivating older-adult need, caregiver burden, and real-world support gaps.
- It is useful for showing how to talk about informal caregiving and practical use barriers.
- It is not a good direct model for your system because your app is not a real dyad platform.

### Section-by-section mapping against both seed papers

| Paper part | Aging 2019 | Formative 2024 | Reusable for you | Must change for your project |
| --- | --- | --- | --- | --- |
| Title positioning | Dyad usability of mobile support app | Remote self-administration pilot reliability/usability | Use Formative's tighter scope language | Avoid dyad and psychometric language unless supported |
| Abstract | Standard JMIR structured abstract, moderate claims | Standard JMIR structured abstract, disciplined pilot claims | Reuse Formative structure | Avoid outcome or validation claims |
| Introduction logic | Caregiving burden -> tech gap -> phase I usability | Clinical workflow problem -> remote mobile fit -> explicit pilot questions | Combine both | Replace cognitive-screening logic with 4Ms self-management/accessibility logic |
| App positioning | Patient-caregiver shared app | Candidate mobile screener | Use Aging for older-adult/caregiver context; Formative for scope discipline | Do not imply clinician-integrated screener |
| Methods framing | Observational usability, training, 1-month use | Pilot remote self-administration with explicit research questions | Use Formative's clearer RQs and method discipline | Do not copy psychometric/reliability framework |
| Results style | Descriptive, table-led, moderate depth | RQ-aligned, subheaded, quantitative + user feedback | Prefer Formative | Add stronger task-level usability evidence than Aging |
| Discussion | Principal findings + implementation reflections + embedded limitations | Principal findings + limitations + comparisons | Prefer Formative | Add explicit non-claims about AI/clinical impact |
| Limitations | Present but compressed | Explicit and reviewer-safe | Prefer Formative | Add repo-specific limitations: no clinician workflow, partial caregiver support, prototype backend dependencies |

### What to borrow from Aging 2019

- Problem framing around older adults living at home
- Informal caregiver burden
- Need for support outside clinical visits
- Importance of training and technical support
- Real-world friction as a legitimate finding

### What to avoid copying from Aging 2019

- Treating your system as a dyad platform when it is not
- Thin evaluation depth
- Overreliance on descriptive averages without task-level usability data
- Underdeveloped limitations language

### What to borrow from Formative 2024

- Explicit study objective and research questions
- Narrow, defensible pilot framing
- Results organized by what the study actually tests
- Discussion that converts findings into concrete next design changes
- Strong limitations section

### What to avoid copying from Formative 2024

- Psychometric language
- Reliability/validation framing
- Clinical screener rhetoric
- Any implication that your system is a clinically validated assessment instrument

## 4. Full paper blueprint

### Title direction

Recommended title directions:

1. **A Web-Based 4Ms Questionnaire System for Older Adults: Formative Usability Evaluation of Multimodal Self-Reporting and Contextual AI Assistance**
2. **Design and Formative Evaluation of a 4Ms Health Questionnaire App for Older Adults With Voice, Medication Scanning, and AI Support**
3. **A 4Ms-Oriented Digital Self-Management Tool for Older Adults: System Description and Formative Usability Study**

Avoid title terms like:

- validation
- reliability
- effectiveness
- impact on outcomes
- caregiver-coordination platform
- clinical decision support

### Contribution statement

Your contribution statement should have three parts:

1. **System contribution**
   A functional web-based 4Ms questionnaire platform for older adults.

2. **Design contribution**
   Integration of multimodal accessibility and support features:
   voice playback, speech-to-text, structured tag-plus-text input, medication scan lookup, mobility-specific guidance, and questionnaire-contextualized AI assistance.

3. **Evaluation contribution**
   A formative evaluation plan showing what aspects of usability, feasibility, and perceived usefulness can be credibly assessed now.

### Abstract structure

Use this five-part abstract plan:

- **Background**
  Older adults often need support capturing and communicating information aligned with the 4Ms, and existing digital tools inadequately address older-adult usability and caregiver-adjacent support needs.

- **Objective**
  Describe the system and evaluate feasibility/usability of completing 4Ms self-report tasks with multimodal support and contextual AI assistance.

- **Methods**
  Mixed-methods formative usability study with older adults, optionally with caregivers present or interviewed as support stakeholders.

- **Results**
  Report task completion, help required, usability scores, feature-specific observations, and qualitative themes.

- **Conclusions**
  State whether the system appears usable/promising for formative deployment, what barriers remain, and what needs to be improved before larger trials.

### Introduction

High-level structure:

1. Older-adult health management and communication burden
2. 4Ms as a meaningful geriatric organizing framework
3. Need for digital self-management and caregiver-adjacent support
4. Need for accessible/multimodal interaction
5. Opportunity and caution around AI assistance
6. Specific gap
7. Paper objective and research questions

### Related work / background

Organize into four subsections:

1. Older-adult self-management, home-based support, and 4Ms
2. Digital tools for older adults and caregiver support
3. Accessibility and multimodal interaction in gerontechnology
4. AI-assisted health interfaces for information support, not diagnosis

### Methods

Recommended subsections:

1. Study design
2. Participants and recruitment
3. System under evaluation
4. Study tasks and scenarios
5. Data collection
6. Quantitative measures
7. Qualitative data
8. Analysis
9. Ethics and safety considerations

### System / app description

Recommended subsections:

1. Design goals
2. User roles and intended use
3. Questionnaire structure across the 4Ms
4. Accessibility and multimodal interaction
5. AI assistant and contextual prompt flow
6. Architecture and data flow
7. Implemented features versus partial/unsupported workflows

### Evaluation / study plan

Recommended scope:

- task-based formative usability
- short pilot feasibility
- mixed methods

Do not make the evaluation hinge on:

- caregiver portal use
- clinician workflow use
- long-term adherence
- health outcomes

### Results plan

Organize results under:

1. Participant characteristics and technology readiness
2. Task completion and assistance required
3. Usability and perceived workload
4. Feature-specific findings
5. Qualitative themes
6. Design implications

### Discussion

Structure:

1. Principal findings
2. What the system currently supports well
3. What the system does not yet support
4. Comparison with prior digital health work
5. Implications for 4Ms-oriented digital support
6. Future system and study directions

### Limitations

Must include:

- prototype system status
- no clinician workflow
- partial caregiver support only
- AI not clinically validated
- likely small convenience sample
- possible digital literacy bias
- no outcome claims

### Conclusion

End with:

- what the system contributes now
- what a formative study could show
- what must happen before any stronger claims

## 5. Detailed introduction plan

### Paragraph-by-paragraph outline

#### Paragraph 1: older-adult health management burden

Purpose:

- Establish that older adults managing health at home often face fragmented communication, memory burden, medication complexity, mobility concerns, and changing priorities.

Evidence / citation type:

- aging population data
- home-based aging/caregiving burden literature
- geriatric care complexity

What this paragraph must accomplish:

- Make the problem clinically and practically important before mentioning the app.

#### Paragraph 2: why the 4Ms matter

Purpose:

- Introduce the 4Ms framework as a coherent geriatric lens for what should be discussed and tracked.

Evidence / citation type:

- 4Ms framework / Age-Friendly Health Systems citations
- geriatric care quality literature

What this paragraph must accomplish:

- Show that 4Ms gives the paper a meaningful organizing structure, not just a feature label.

#### Paragraph 3: digital self-management and caregiver-adjacent support gap

Purpose:

- Argue that older adults and informal caregivers often need lightweight tools to gather, remember, and communicate 4Ms-related information between visits.

Evidence / citation type:

- caregiver burden studies
- older-adult digital health support studies
- patient-generated health information / self-management literature

What this paragraph must accomplish:

- Position the need as a workflow/support problem, not just a survey problem.

Critical note:

- Do not oversell caregiver coordination, because your current repo stores caregiver email and supports reminders in the backend, but does not implement a robust caregiver co-use interface.

#### Paragraph 4: accessibility and multimodal interaction need

Purpose:

- Establish that older adults may benefit from interfaces that reduce typing burden, support listening and speaking, and simplify structured entry.

Evidence / citation type:

- accessibility/usability studies for older adults
- speech interaction / multimodal input literature
- digital literacy barrier studies

What this paragraph must accomplish:

- Justify the system’s voice playback, speech-to-text, and structured tag selection as design choices with a real usability rationale.

#### Paragraph 5: AI assistance opportunity and caution

Purpose:

- Introduce AI as a way to provide contextual information support, prompt generation, and conversational guidance after structured input is collected.

Evidence / citation type:

- recent literature on conversational agents in health support
- studies on trust, safety, and limitations of AI in patient-facing tools

What this paragraph must accomplish:

- Frame AI as supportive and contextual, not diagnostic or authoritative.

Critical note:

- Explicitly avoid suggesting that the AI gives clinically validated advice.

#### Paragraph 6: specific gap in existing tools

Purpose:

- State that existing tools often address isolated pieces of the problem:
  questionnaires without multimodal support, accessibility features without structured 4Ms framing, or chat interfaces without grounded user context.

Evidence / citation type:

- targeted digital health / older-adult app literature
- prior usability papers
- possibly the two seed papers as adjacent models of older-adult app evaluation

What this paragraph must accomplish:

- Define the exact gap your system fills:
  `an integrated 4Ms-oriented older-adult self-report system with accessibility-oriented interaction and questionnaire-grounded AI assistance`.

#### Paragraph 7: paper objective and study aim

Purpose:

- Introduce your system by name and state the paper objective narrowly.

Evidence / citation type:

- no citation needed beyond perhaps internal design rationale

What this paragraph must accomplish:

- State what you built.
- State what you are evaluating.
- State what you are not claiming.

Suggested closing objective sentence:

> The objective of this work is to describe the design and implementation of a web-based 4Ms questionnaire system for older adults and to evaluate the feasibility, usability, and perceived usefulness of its multimodal interaction and contextual AI support features in a formative study.

### Introduction transition chain

Use this exact logic:

`older-adult need -> 4Ms framework -> digital self-management and caregiver-adjacent support -> accessibility and multimodal interaction -> AI assistance as contextual support -> specific system gap -> objective`

### Gap statement

Recommended gap statement:

> Existing digital tools for older adults rarely combine structured 4Ms-oriented self-reporting, accessibility-oriented multimodal interaction, and questionnaire-grounded conversational support within a single system, and there is limited evidence about how older adults would use such an integrated workflow.

## 6. Detailed methods / evaluation plan

### Best-fit study design

**Best fit:** `mixed-methods formative usability study with a short pilot-feasibility component`

Why:

- It matches the maturity of the system.
- It supports concrete, publishable evidence.
- It does not require long-term outcome claims.
- It lets you evaluate the whole system, not just one widget.

### Recommended participant model

#### Primary participants

- older adults aged 65+
- community-dwelling
- able to use a smartphone, tablet, or laptop with minimal assistance

#### Secondary participants

- optional informal caregivers as support stakeholders
- use them for observation, co-completion context, or post-task interviews

Critical constraint:

- Do **not** design the study as a true dyad workflow study unless you first implement a real caregiver-facing interface.

### Recommended sample size

For a strong formative paper:

- **8-12 older adults** for intensive usability sessions is acceptable
- **12-20 older adults** is better if you want usable descriptive SUS data
- **4-8 caregivers** can be added as interview participants or optional observers

### Study setting

Best options:

- moderated lab or quiet community setting for first study
- or remote moderated sessions if device setup is manageable

Avoid starting with:

- unmoderated home deployment as the only method

### Study tasks / scenarios

Use tasks that map to implemented functionality only.

#### Core tasks

1. Create account or sign in
2. Navigate to home/dashboard
3. Complete at least one question in each 4Ms section
4. Use tag selection and free-text input
5. Use speech playback on a question
6. Use speech-to-text for a response
7. Choose a mobility type and review the tailored mobility guidance
8. Review saved responses and overall progress
9. Open AI chat and ask a custom question
10. Use or inspect AI quick questions

#### Optional task

11. Attempt medication scan if a suitable barcode and device camera are available

#### Do not make these core study tasks

- caregiver email tip sending as an end-to-end user task
- clinician sharing/export
- migration utilities

Reason:

- those workflows are partial, admin-oriented, or not fully integrated in the current app

### Quantitative measures

Recommended measures:

- task completion rate
- task success with / without moderator help
- time on task
- number of navigation errors or points of confusion
- System Usability Scale (SUS)
- single ease/confidence ratings per major task
- perceived usefulness ratings for:
  - voice playback
  - speech-to-text
  - mobility guidance
  - AI quick questions
  - AI chat

Optional:

- NASA-TLX short form or simple perceived workload items

### Qualitative data to collect

- think-aloud observations during tasks
- brief post-task probes
- semistructured exit interview

Key qualitative topics:

- clarity of questions
- comfort using voice features
- trust and confusion around AI responses
- usefulness of structured 4Ms organization
- perceived burden of typing
- reaction to medication scan workflow
- what they would want to share with family or clinicians
- what felt inaccessible or intimidating

### Feasibility / usability outcomes that are realistic

Reasonable outcomes to report:

- whether older adults can complete core tasks
- which features require assistance
- whether the 4Ms structure feels understandable
- whether multimodal features reduce friction
- whether AI support is perceived as helpful, confusing, or both
- what design revisions are needed before larger deployment

### What not to claim

Do not claim:

- improved health outcomes
- improved medication adherence
- reduced falls
- improved clinician communication
- validated AI advice
- validated 4Ms screening instrument
- robust caregiver collaboration

### Analysis plan

Quantitative:

- descriptive statistics only or mostly descriptive
- medians/means, ranges, proportions
- do not decorate a small study with weak inferential tests unless there is a real analytic reason

Qualitative:

- rapid thematic analysis or structured affinity coding
- produce 4-6 concise design themes

Suggested research questions:

1. Can older adults complete the core 4Ms questionnaire and AI-support tasks in the current system?
2. Which features are perceived as most and least useful?
3. What usability, accessibility, and trust barriers arise during use?
4. What changes are required before broader pilot deployment?

## 7. Claims-and-evidence matrix

| Claim | Evidence needed | Already in repo? | Needs study? | Risk if overstated |
| --- | --- | --- | --- | --- |
| The system implements a web-based 4Ms questionnaire workflow | Code inspection, route and data model review | Yes | No | Low |
| The system supports multimodal interaction through speech playback and speech-to-text | Component and browser API implementation | Yes | No | Low |
| The system offers mobility-type-specific guidance | Questionnaire schema and UI review | Yes | No | Low |
| The system can contextualize AI prompts using prior questionnaire responses | Backend prompt flow and context assembly | Yes | No | Low |
| The system includes medication scanning and lookup capability | Scanner component and lookup service review | Yes | No | Medium, because external APIs are fragile |
| The system supports caregiver collaboration | Requires real caregiver-facing workflow evidence | Partial only | Yes | High |
| Older adults can use the system independently | Observed task completion and usability evidence | No | Yes | High |
| Voice features improve accessibility or reduce burden | Comparative usability evidence or direct user feedback | No | Yes | High |
| Contextual AI assistance is helpful and understandable | Feature-specific ratings, interviews, usage observations | No | Yes | High |
| The app improves communication with clinicians | Clinician workflow and outcome evidence | No | Yes | Very high |
| The app improves medication safety or mobility safety | Behavioral or clinical outcome evidence | No | Yes | Very high |
| The app is secure and production-ready for health deployment | Security review, deployment hardening, governance evidence | No | Yes | Very high |

## 8. Missing pieces before drafting

### Missing evidence

- real participant usability data
- task completion metrics
- SUS or equivalent scores
- feature-level usefulness ratings
- qualitative themes
- evidence about AI trust/clarity

### Missing assets

- final architecture figure
- workflow figure
- screenshots of the strongest paper-relevant flows
- screenshot of mobility guidance state
- screenshot of AI chat with contextual quick questions
- table summarizing implemented vs partial vs missing features
- table summarizing 4Ms question structure and interaction types

### Missing study protocol details

- inclusion/exclusion criteria
- recruitment source
- moderator script
- task script
- interview guide
- safety language for AI use
- device/browser requirements

### Missing manuscript support materials

- age-friendly/4Ms citations
- digital self-management citations
- accessibility/multimodal interaction citations
- AI-in-health-support citations
- clear definitions of non-claims

### Repo-specific missing or partial implementation points you should disclose

- no clinician portal or export workflow
- no robust caregiver-facing interface
- frontend review/submit action currently miswired
- caregiver tip send is not clearly wired through the user flow
- dual backend architecture exists in repo
- security posture should not be oversold
- no research logging / analytics pipeline is evident

### Do not do this

1. Do not describe this as a dyad platform unless you add a true caregiver workflow.
2. Do not describe the AI as clinically validated or medically authoritative.
3. Do not describe the questionnaire as a validated screening instrument.
4. Do not claim outcome benefits from system design alone.
5. Do not copy the MyCog paper’s psychometric posture.
6. Do not copy the Aging paper’s dyad framing as if your system already supports the same use model.
7. Do not bury missing features; name them explicitly.
8. Do not make the migration tooling or admin utilities central to the paper.
9. Do not overinterpret a small convenience sample.
10. Do not let the paper drift into generic “apps for older adults are promising” language; keep it about this implemented system.

## 9. Recommended writing sequence

### Write first

These sections can be drafted immediately from the codebase:

1. system overview
2. architecture and data flow
3. implemented feature inventory
4. user roles and intended use
5. section skeleton for introduction
6. study rationale and proposed methods draft
7. limitations that are already visible from the repo

### Write second

These depend partly on literature review but not on study results:

1. polished introduction
2. related work/background
3. contribution statement
4. title and abstract shell

### Write after the study

These should wait for real data:

1. final abstract
2. participant characteristics
3. results
4. principal findings
5. evidence-based discussion
6. refined limitations

### Practical writing order

1. Create the paper architecture and subsection headings
2. Draft the system/app description from the repo
3. Draft methods and study protocol
4. Draft introduction with placeholders for citations
5. Run the formative study
6. Build tables and figures
7. Write results
8. Write discussion and limitations
9. Finalize abstract and title

## 10. Final roadmap

### Phase 1: tighten the paper target

- Commit to the paper as a **formative system/usability paper**
- Use the 2024 Formative paper as the structural model
- Use the 2019 Aging paper only for older-adult/caregiver motivation

### Phase 2: clean the study scope

- Define the current app as an older-adult primary-use system with caregiver-adjacent support
- Remove any study tasks that depend on nonimplemented clinician or caregiver workflows
- Decide whether medication scanning is a core or optional feature in the study

### Phase 3: prepare paper assets

- capture screenshots
- draw the architecture figure
- draw the task workflow figure
- produce implemented-vs-partial feature table
- produce claims matrix

### Phase 4: run the formative evaluation

- recruit older adults
- optionally include caregivers as observers/interviewees, not necessarily as co-users
- collect task-level data, SUS, feature ratings, and interview data

### Phase 5: write the manuscript in the right order

- system and methods first
- introduction second
- results after study completion
- discussion only after you see what users actually struggled with

### Final recommendation

If you want the cleanest and most defensible manuscript, write this as:

> a formative evaluation of an implemented 4Ms-oriented older-adult self-report system with multimodal accessibility features and contextual AI assistance

That framing is fully consistent with the repo, fits the stronger seed paper structurally, and gives you a credible path from codebase -> study -> manuscript without forcing claims the current system cannot support.

## Paper architecture outline

```text
1. Introduction
1.1 Older-adult health management burden
1.2 4Ms as a geriatric care framework
1.3 Digital self-management and caregiver-adjacent support gaps
1.4 Accessibility and multimodal interaction needs
1.5 AI assistance as contextual support
1.6 Study gap and objective

2. Related Work
2.1 Older-adult digital self-management tools
2.2 Caregiver support and coordination technologies
2.3 Accessibility and multimodal interfaces for older adults
2.4 Conversational AI in patient-facing health tools

3. System Design and Implementation
3.1 Design goals
3.2 User roles and intended use
3.3 4Ms questionnaire structure
3.4 Multimodal interaction features
3.5 AI assistant and contextual prompting
3.6 System architecture and data flow
3.7 Implemented versus partial functionality

4. Methods
4.1 Study design
4.2 Participants and recruitment
4.3 Study setting
4.4 Tasks and scenarios
4.5 Measures
4.6 Qualitative data collection
4.7 Analysis
4.8 Ethics and safety considerations

5. Results
5.1 Participant characteristics
5.2 Task completion and assistance required
5.3 Usability outcomes
5.4 Feature-specific findings
5.5 Qualitative themes

6. Discussion
6.1 Principal findings
6.2 Implications for 4Ms-oriented digital support
6.3 Accessibility and AI design implications
6.4 Comparison with prior work
6.5 Limitations
6.6 Future work

7. Conclusion
```
