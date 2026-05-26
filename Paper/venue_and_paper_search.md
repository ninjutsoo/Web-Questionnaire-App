# Publication and Related-Work Discovery Report for 4Ms-Based Elderly Care Application

## 0. Codebase-Derived Understanding of the Project

### Codebase-Derived Project Summary

The repository implements a working older-adult-facing web application organized around the Age-Friendly Health Systems 4Ms: What Matters, Medication, Mind, and Mobility. The core experience is a structured questionnaire with persistent saved progress, a home dashboard, a review/save flow, and an AI chatbot that uses questionnaire context to personalize responses. The app also includes accessibility-oriented interaction support such as read-aloud, speech input, and a medication barcode/QR scan flow.

The current implementation is narrower than a full caregiver-clinician coordination system. Caregiver support is present primarily through caregiver email capture and outgoing caregiver-oriented emails for mobility tips and reminders. The codebase does not currently implement a caregiver dashboard, clinician dashboard, clinician-facing summaries, role-separated clinician workflows, clinical decision support, or a validated medication-risk/prediction engine.

The code therefore supports an honest framing as a functional 4Ms prototype or MVP for older-adult self-report and support, with lightweight caregiver connection and applied AI assistance. It does not yet support strong claims about care-team integration, clinical workflow transformation, or validated AI-in-health performance.

### User Roles

- Older adult/patient: confirmed primary user.
- Caregiver: partial support through caregiver email storage and outgoing reminder/tip emails.
- Doctor/clinician: not implemented as an actual UI role.
- Admin: no true role model found; only a migration utility route exists.

### Technology Stack

- Frontend: React 18, Vite, Ant Design, React Router.
- Backend/API: Firebase Functions Express API; legacy parallel Express backend also exists.
- Database: Cloud Firestore.
- Authentication: Firebase Auth.
- AI/LLM providers: Google Gemini in Firebase Functions; legacy OpenRouter backend also present.
- Notifications/reminders: SendGrid email via Firebase Functions / legacy Express backend.
- Hosting/deployment: Firebase Hosting + Firebase Functions, with `/api/**` rewrites in `firebase.json`.

### Implemented Features

| Feature | File/module evidence | Status | Relation to 4Ms | Publication relevance |
|---|---|---|---|---|
| 4Ms questionnaire structure and persistence | `src/services/questionnaireService.js` | Implemented | All 4Ms | Core system contribution |
| Home dashboard with progress | `src/views/Home.jsx` | Implemented | All 4Ms | Supports longitudinal/self-management framing |
| Review and save flow | `src/views/Questionnaire/ReviewSubmit.jsx` | Implemented | All 4Ms | Strong for usability/system paper |
| Medication barcode/QR scanning | `src/components/MedicationScanner.jsx`, `src/services/drugLookupService.js` | Implemented | Medication | Practical differentiator |
| Speech input for questionnaire text | `src/views/Questionnaire/4msSection.jsx` | Implemented | Cross-cutting | Accessibility contribution |
| Read-aloud for questions | `src/components/SpeechReader.jsx` | Implemented | Cross-cutting | Accessibility contribution |
| AI chatbot with questionnaire context | `src/components/AIChatbot.jsx`, `functions/index.js` | Implemented | Cross-cutting | Human-centered AI framing |
| AI-generated quick questions | `src/components/AIChatbot.jsx`, `functions/index.js` | Implemented | Cross-cutting | Secondary AI feature |
| Mobility-type safety tips | `src/services/questionnaireService.js` | Implemented | Mobility | Strong 4Ms-specific feature |
| Caregiver email capture | `src/components/ProfileModal.jsx`, `src/views/Signup/Signup.jsx` | Implemented | Mobility/Medication support context | Supports limited caregiver story |
| Caregiver tip email sending | `functions/index.js` | Implemented | Mobility | Limited caregiver linkage |
| Scheduled reminder emails | `functions/index.js` | Partial | Medication/Mobility | Useful for future pilot framing |
| Caregiver dashboard | no code found | Missing | Cross-cutting | Important limitation |
| Clinician dashboard/summaries | no code found | Missing | Cross-cutting | Major limit for informatics framing |
| Medication risk alerts | no code found | Missing | Medication | Needed for stronger AI/clinical claim |
| Adherence prediction/anomaly detection | no code found | Missing | Medication/Mobility | Not currently defensible |
| Analytics/usability instrumentation | no code found | Missing | Cross-cutting | Important missing evidence |

### 4Ms Mapping

| 4M category | Features found in code | Evidence from files | Strength | What should be added before submission |
|---|---|---|---|---|
| What Matters | Goals, concerns, support needs, values-style questionnaire items | `src/services/questionnaireService.js` | Moderate | Export/share summary; validate wording with older adults |
| Medication | Med questions, tags/text, barcode/QR lookup, reminders scaffold | `src/services/questionnaireService.js`, `src/components/MedicationScanner.jsx`, `functions/index.js` | Strong | Evaluate scan success, comprehension, adherence usefulness |
| Mentation | Mood/memory/sleep sliders, stress/well-being questions, AI chat contextualization | `src/services/questionnaireService.js`, `src/components/AIChatbot.jsx` | Moderate | Usability validation, clearer escalation/safety language |
| Mobility | Mobility type, fall concerns, exercise routine, safety tips, caregiver mobility emails | `src/services/questionnaireService.js`, `functions/index.js` | Strong | Pilot real use of reminders/tips; caregiver usefulness feedback |

### AI Functionality

| AI component | What it does | Where it appears | Central or minor | Supports AI/HCI contribution? |
|---|---|---|---|---|
| Contextual chatbot | Uses questionnaire responses and optional location in LLM prompt to answer user questions | `functions/index.js`, `src/components/AIChatbot.jsx` | Central | Yes, for applied HCAI/usability, not novelty |
| AI quick questions | Generates suggested questions based on questionnaire context | `functions/index.js`, `src/components/AIChatbot.jsx` | Moderate | Yes, but secondary |
| Prompted personalization | Injects completed sections/responses into system prompt | `functions/index.js`, `chat-backend/server.js` | Moderate | Yes, as grounding strategy |
| Medication-risk alerts | Not found | N/A | Missing | No |
| Adherence prediction | Not found | N/A | Missing | No |
| Clinician summaries | Not found | N/A | Missing | No |
| Anomaly detection | Not found | N/A | Missing | No |
| Recommendation engine | Not found beyond prompt-based advice | N/A | Missing | No |

The AI layer is best described as applied, questionnaire-grounded LLM support. It is not yet a technically novel AI contribution.

### Data Flow

1. Older adult creates account and profile in Firebase Auth / Firestore.
2. App loads questionnaire schema from Firestore `Questions/4ms_health`.
3. User responses are saved into Firestore `Answers/{uid}_4ms_health`.
4. Home dashboard reads saved answers to calculate progress.
5. AI chatbot fetches questionnaire context from saved responses and sends it to backend API.
6. Firebase Functions call Gemini and return chat/quick-question outputs.
7. Caregiver email, if stored, is used by backend reminder/tip email flows.
8. Reminder/tip emails are sent via SendGrid.

### Publication Readiness

- Current stage: `working prototype / functional MVP / usability-test ready`.
- Not yet supported: clinical pilot claims, clinician workflow claims, AI efficacy claims, outcome claims.

### Missing Evidence for Publication

- Design/system paper: needs at least small formative evaluation to avoid reading like product documentation.
- HCI/usability paper: needs older-adult task-based usability data.
- AI-in-health paper: needs safety/helpfulness evaluation, likely clinician review.
- Medical informatics pilot paper: needs real pilot/deployment data and stronger care-team workflow.

### Revised One-Paragraph Project Description

This project is a web-based 4Ms health application for older adults that supports structured self-reporting of What Matters, Medication, Mind, and Mobility, while providing saved progress, accessible interaction modes such as read-aloud and speech input, medication barcode/QR lookup, and a questionnaire-grounded AI assistant for supportive health questions. The current implementation also supports lightweight caregiver connection through caregiver email capture and outgoing reminder or mobility-tip emails. Based on the codebase, the system is best characterized as a functional older-adult-facing 4Ms prototype or MVP rather than a fully clinician-integrated digital care coordination platform.

### Area Summary Table

| Area | Finding | Evidence from code/docs | Confidence |
|---|---|---|---|
| App purpose | Older-adult-facing 4Ms self-report and support app | `README.md`, `src/services/questionnaireService.js`, `src/components/AIChatbot.jsx` | High |
| Primary user | Older adult/patient | `src/views/Signup/Signup.jsx`, `src/views/Home.jsx` | High |
| Caregiver support | Email-based caregiver touchpoints only | `src/components/ProfileModal.jsx`, `functions/index.js` | High |
| Clinician support | No clinician UI/workflow | `src/App.jsx`, route scan | High |
| AI | Questionnaire-grounded chat + quick questions | `functions/index.js`, `src/components/AIChatbot.jsx` | High |
| Accessibility | Read-aloud, speech input, large/simple interface | `src/views/Questionnaire/4msSection.jsx`, `src/components/SpeechReader.jsx` | High |
| Deployment stage | MVP / usability-test ready, not pilot-validated | repo-wide inspection | High |

| Feature | Status | 4Ms category | Evidence from code/docs | Publication relevance |
|---|---|---|---|---|
| 4Ms questionnaire | Implemented | All | `src/services/questionnaireService.js` | Core contribution |
| AI chatbot | Implemented | Cross-cutting | `src/components/AIChatbot.jsx`, `functions/index.js` | Supports HCAI framing |
| Medication scan | Implemented | Medication | `src/components/MedicationScanner.jsx` | Practical differentiator |
| Speech/read-aloud | Implemented | Cross-cutting | `src/views/Questionnaire/4msSection.jsx`, `src/components/SpeechReader.jsx` | Accessibility angle |
| Caregiver dashboard | Missing | Cross-cutting | no code found | Limitation |
| Clinician dashboard | Missing | Cross-cutting | no code found | Major limitation |

## 1. Project Understanding

The project concept and the codebase align around a 4Ms-focused application for older adults, but the codebase shows a more concrete and narrower implementation than the high-level concept suggests. Confirmed features include a persistent 4Ms questionnaire, saved progress dashboard, medication scanning, accessibility-oriented voice/read-aloud tools, and a contextual AI chatbot. The system is already functional enough to support usability testing.

Planned or implied clinical-care coordination features are not yet implemented in the current repository. In particular, the app does not currently provide clinician dashboards, caregiver dashboards, clinician-facing summaries, or validated medication risk or adherence intelligence. Any publication should therefore distinguish clearly between implemented self-report/support functionality and future care-coordination ambitions.

## 2. Possible Contribution Framings

| Framing | What the paper would claim | Evidence needed | Best venue types | Risk |
|---|---|---|---|---|
| Design/system paper | A 4Ms-guided older-adult digital support prototype was designed and implemented | Architecture, feature rationale, small formative feedback | Formative digital health, gerontechnology | Too descriptive without user data |
| Usability study paper | Older adults can use the app and key multimodal features | Older-adult usability study with task performance | HCI/usability venues and journals | Needs real older-adult participants |
| Human-centered AI paper | Questionnaire-grounded AI adds useful support for older adults | Comparative or trust/safety-oriented AI evaluation | HCAI / IUI / AMIA / broad digital health | AI novelty is currently light |
| Digital health pilot paper | The app is feasible and acceptable in short-term use | Pilot data, engagement, retention, qualitative feedback | JMIR Aging / JMIR mHealth / Frontiers | No pilot exists yet |
| Medical informatics workflow paper | Patient-entered 4Ms data supports care-team workflows | Clinician integration, summaries, workflow study | AMIA / ACI / IJMI | Not supported yet |
| 4Ms framework implementation paper | A patient-facing tool operationalizes all four Ms in one digital system | Strong mapping to 4Ms + usability evidence | Aging / gerontechnology / formative journals | Must avoid implying full AFHS clinical implementation |

## 3. Candidate Conferences

| Rank | Conference | Area | Fit score 1 to 5 | Why it fits | Why it may not fit | Submission type | Deadline/status | Link |
|---|---|---|---:|---|---|---|---|---|
| 1 | AMIA Annual Symposium | Medical informatics / HCAI | 4 | Accepts posters, demos, preliminary systems, human-centered AI and usability | Full paper still needs stronger evaluation | Poster, system demo, paper | Verified manuscript deadline: March 10, 2026 | [Link](https://amia.org/education-events/amia-2026-annual-symposium/call-participation) |
| 2 | ASSETS 2026 | Accessibility / HCI | 4 | Strong aging and accessibility fit; speech/read-aloud/multimodal support are relevant | Must foreground accessibility contribution, not just health app | Technical paper | Verified submission: April 22, 2026 | [Link](https://assets26.sigaccess.org/technical_papers.html) |
| 3 | MobileHCI 2026 | Mobile HCI | 4 | Mobile/web interaction, speech, camera-based scanning, health use context | Needs real usability evidence | PACMHCI paper | Verified paper deadline: January 29, 2026 | [Link](https://mobilehci.acm.org/2026/submit/papers.html) |
| 4 | DIS 2026 | Interaction design | 4 | Good for design/system framing with empirical grounding | Needs more than product description | Paper / pictorial | Verified abstract/paper: January 9/19, 2026 | [Link](https://dis.acm.org/2026/papers/) |
| 5 | IUI 2026 | Intelligent user interfaces | 4 | Good fit for contextual AI assistant with user study | Requires stronger AI interaction evaluation | Full/short paper | Verified full paper deadline: October 10, 2025 | [Link](https://iui.acm.org/2026/call-for-papers/) |
| 6 | PervasiveHealth | Digital health / HCI | 4 | Strong fit for patient/caregiver digital health applications | 2026 deadline not verified | Conference paper | 2025 official cycle found; 2026 not verified | [Link](https://pervasivehealth.eai-conferences.org/2025/) |
| 7 | CHI 2026 | Flagship HCI | 2 | Topic is in scope, especially older adults and HCAI | Evidence bar too high for current stage | Paper | Verified paper deadline: January 22, 2026 | [Link](https://chi2026.acm.org/authors/papers/) |
| 8 | CSCW 2026 | Social/collaborative computing | 1 | Could fit only if caregiving coordination became central | Current system is not collaborative enough | PACMHCI paper | Verified cycle, but poor fit | [Link](https://cscw.acm.org/2026/papers.html) |
| 9 | GROUP 2027 | Collaboration/group work | 1 | Might fit future care-coordination workflows | Current app lacks collaborative workspace | PACMHCI paper | Verified second-wave deadline: March 24, 2026 | [Link](https://group.acm.org/conferences/group27/papers.php) |

### Conference Recommendations

- Best conference for current stage: `AMIA` poster or system demo.
- Best conference after usability testing: `ASSETS`, `MobileHCI`, or `DIS`.
- Best conference after stronger AI evaluation: `IUI`.
- Conferences that are probably too ambitious right now: `CHI`, `IMWUT/UbiComp`, and most clinician-heavy full-paper informatics tracks.

## 4. Candidate Journals

| Rank | Journal | Area | Fit score 1 to 5 | Why it fits | Why it may not fit | Article types accepted | Rolling or deadline-based | Link |
|---|---|---|---:|---|---|---|---|---|
| 1 | JMIR Formative Research | Formative digital health | 5 | Explicitly welcomes feasibility, formative, and preliminary studies | Still needs actual formative evidence | Original research, formative studies | Rolling | [Link](https://formative.jmir.org/about-journal/focus-and-scope) |
| 2 | Gerontechnology | Aging technology | 5 | Direct aging-in-place, caregiver, independence, accessibility fit | Lower visibility than JMIR family | Journal articles | Rolling / issue-based | [Link](https://journal.gerontechnology.org/Aim.aspx) |
| 3 | JMIR Aging | Older-adult digital health | 4 | Strong aging, caregiver, self-management, home care fit | Best after at least small usability study | Original research | Rolling | [Link](https://aging.jmir.org/about-journal/focus-and-scope) |
| 4 | JMIR Human Factors | Health UX/usability | 4 | Best journal fit for usability/accessibility angle | Not ideal before usability data exists | Original research, reviews | Rolling | [Link](https://humanfactors.jmir.org/about-journal/focus-and-scope) |
| 5 | JMIR mHealth and uHealth | mHealth / telehealth | 4 | Good for reminders, mobile interaction, medication support | Less aging-specific | Original research | Rolling | [Link](https://mhealth.jmir.org/about-journal/focus-and-scope) |
| 6 | Frontiers in Digital Health | Digital health / human factors | 4 | Broad digital health and HCAI fit | Needs stronger methodology than pure demo | Original research, brief report | Rolling | [Link](https://www.frontiersin.org/journals/digital-health/about) |
| 7 | BMC Geriatrics | Geriatrics | 3 | Good if focused on older-adult need and feasibility | Less HCI/system-oriented | Research article | Rolling | [Link](https://link.springer.com/journal/12877/aims-and-scope) |
| 8 | BMC Medical Informatics and Decision Making | Informatics | 3 | Accepts design/development/evaluation of health IT | Aging fit is indirect | Research article | Rolling | [Link](https://link.springer.com/journal/12911/aims-and-scope) |
| 9 | DIGITAL HEALTH | Broad digital health | 3 | Accepts digital health/usability/home monitoring work | Less targeted than JMIR Aging | Research article | Rolling | [Link](https://journals.sagepub.com/home/dhj) |
| 10 | International Journal of Medical Informatics | Health informatics | 3 | Better after pilot/deployment | Current evidence too early | Research article | Rolling | [Link](https://www.sciencedirect.com/journal/international-journal-of-medical-informatics) |
| 11 | Applied Clinical Informatics | Clinical informatics | 2 | Could fit later if clinician workflow is added | Current app is not clinician-integrated | Research article | Rolling | [Link](https://lp.thieme.de/open-access-files/174/author_instructions.pdf) |
| 12 | Journal of Medical Internet Research | Prestigious digital health | 2 | Broad topic fit | Too selective for current stage | Research article | Rolling | [Link](https://www.jmir.org/about-journal/focus-and-scope) |
| 13 | JAMIA | Top informatics | 1 | Domain relevance only | Too early, no workflow/pilot evidence | Research article | Rolling | [Link](https://academic.oup.com/jamia/pages/About) |
| 14 | npj Digital Medicine | Prestigious digital medicine | 1 | Broad digital med domain fit | Explicitly poor fit for small preliminary studies and off-the-shelf AI | Research article | Rolling | [Link](https://www.nature.com/npjdigitalmed/aims) |

### Journal Recommendations

- Best journal for current stage: `JMIR Formative Research`.
- Best journal after usability testing: `JMIR Human Factors` or `JMIR Aging`.
- Best journal after pilot deployment: `JMIR Aging` or `International Journal of Medical Informatics`.
- Prestigious but probably need stronger evidence: `JMIR`, `JAMIA`, `npj Digital Medicine`, `JBHI`, `Artificial Intelligence in Medicine`.

## 5. Best Realistic Venue Targets

### Best for current design/system stage

1. [JMIR Formative Research](https://formative.jmir.org/about-journal/focus-and-scope)  
Why it fits: explicit home for formative, feasibility, and early-stage digital health work.  
Evidence needed: at minimum, small formative/usability evidence.  
Paper angle: integrated 4Ms prototype for older adults with accessibility and lightweight AI support.

2. [Gerontechnology](https://journal.gerontechnology.org/Aim.aspx)  
Why it fits: very direct match to technology for older adults, independence, safety, and caregivers.  
Evidence needed: practical aging-tech rationale and at least limited formative evidence.  
Paper angle: aging-in-place and self-management support through a 4Ms interface.

3. [AMIA Annual Symposium](https://amia.org/education-events/amia-2026-annual-symposium/call-participation)  
Why it fits: posters and system demos explicitly welcome preliminary systems and human-centered AI.  
Evidence needed: bounded prototype story, demo, and ideally some formative feedback.  
Paper angle: age-friendly digital support system demo rather than workflow-impact paper.

### Best after usability testing

1. [JMIR Human Factors](https://humanfactors.jmir.org/about-journal/focus-and-scope)  
Why it fits: strongest health usability/HCI journal fit.  
Evidence needed: real older-adult task-based study.  
Paper angle: multimodal usability and accessibility of a 4Ms app.

2. [ASSETS 2026](https://assets26.sigaccess.org/technical_papers.html)  
Why it fits: if accessibility becomes the contribution center.  
Evidence needed: representative-user testing and explicit accessibility findings.  
Paper angle: read-aloud, speech, simplified navigation, and health interaction accessibility.

3. [MobileHCI 2026](https://mobilehci.acm.org/2026/submit/papers.html)  
Why it fits: mobile interaction, voice, camera scanning, older-adult use.  
Evidence needed: strong usability data and mobile-context framing.  
Paper angle: older-adult mobile health interaction design.

4. [DIS 2026](https://dis.acm.org/2026/papers/)  
Why it fits: design-system story with empirical grounding.  
Evidence needed: clear design goals, iteration, and findings.  
Paper angle: designing an age-friendly 4Ms digital experience.

5. [IUI 2026](https://iui.acm.org/2026/call-for-papers/)  
Why it fits: contextual AI assistant and user-facing AI support.  
Evidence needed: AI interaction evaluation and trust/usability evidence.  
Paper angle: questionnaire-grounded intelligent assistance for older adults.

### Best after pilot deployment

1. [JMIR Aging](https://aging.jmir.org/about-journal/focus-and-scope)  
Why it fits: older adult digital health, home care, caregiver relevance.  
Evidence needed: short pilot with feasibility and engagement data.  
Paper angle: 4Ms self-management support for older adults.

2. [JMIR mHealth and uHealth](https://mhealth.jmir.org/about-journal/focus-and-scope)  
Why it fits: good for reminder, mobile, and repeated-use stories.  
Evidence needed: pilot engagement and practical outcome proxies.  
Paper angle: feasibility of older-adult mobile/web 4Ms use.

3. [Frontiers in Digital Health](https://www.frontiersin.org/journals/digital-health/about)  
Why it fits: human factors, implementation, digital health.  
Evidence needed: mixed-methods pilot results.  
Paper angle: digital health deployment feasibility with human factors lens.

4. [International Journal of Medical Informatics](https://www.sciencedirect.com/journal/international-journal-of-medical-informatics)  
Why it fits: stronger informatics venue if deployment matures.  
Evidence needed: better implementation and pilot data.  
Paper angle: patient-generated 4Ms digital infrastructure and adoption.

5. [The Gerontologist](https://academic.oup.com/gerontologist/pages/instructions_to_authors)  
Why it fits: if framed around aging-in-place, caregiving, and gerontological implications.  
Evidence needed: mixed-methods and broader aging interpretation.  
Paper angle: technology and aging support rather than app engineering.

### Best if AI component becomes technically strong

1. [IUI](https://iui.acm.org/2026/call-for-papers/)  
Why it fits: strong HCAI venue for contextual assistance.  
Evidence needed: comparative AI user study, trust and usefulness data.  
Paper angle: grounded AI interaction.

2. [JAMIA Open](https://academic.oup.com/jamiaopen/pages/About)  
Why it fits: more realistic than JAMIA main for evaluated applied health AI.  
Evidence needed: clinician-rated safety/helpfulness and implementation relevance.  
Paper angle: evaluated questionnaire-grounded health AI support.

3. [AIME](https://aime25.aimedicine.info/call-for-submissions/)  
Why it fits: only if there is actual AI-method or substantial AI evaluation contribution.  
Evidence needed: more than LLM integration.  
Paper angle: explainable or clinically constrained AI support.

4. [PLOS Digital Health](https://journals.plos.org/digitalhealth/s/journal-information)  
Why it fits: broader digital health + AI + HCI acceptance.  
Evidence needed: meaningful AI evaluation and human-factor evidence.  
Paper angle: safe/helpful older-adult AI support in digital health.

5. [Frontiers in Digital Health](https://www.frontiersin.org/journals/digital-health/about)  
Why it fits: HCAI and usability evaluation welcome.  
Evidence needed: stronger AI methodology and mixed-methods validation.  
Paper angle: human factors of AI-supported 4Ms engagement.

## 6. Related Papers From Target Venues

| Paper title | Authors | Year | Venue | Link/DOI | Population | Technology | AI component | Evaluation | Relevance score 1 to 5 | Why it matters for our paper |
|---|---|---:|---|---|---|---|---|---|---:|---|
| A Prospective Study of Usability and Workload of Electronic Medication Adherence Products by Older Adults, Caregivers, and Health Care Providers | Patel et al. | 2020 | Journal of Medical Internet Research | [DOI](https://doi.org/10.2196/18073) | Older adults, caregivers, HCPs | Medication adherence products | None | Prospective mixed-methods | 5 | Strong comparator for medication usability and stakeholder scope |
| Mobile Support for Older Adults and Their Caregivers: Dyad Usability Study | Quinn et al. | 2019 | JMIR Aging | [DOI](https://doi.org/10.2196/12276) | Older adult-caregiver dyads | Mobile/web dyadic app | None | 1-month usability | 5 | Closest caregiver-linked comparator |
| Older Adults Can Successfully Monitor Symptoms Using an Inclusively Designed Mobile Application | Turchioe et al. | 2020 | Journal of the American Geriatrics Society | [DOI](https://doi.org/10.1111/jgs.16403) | Older adults | Symptom-monitoring app | None | Feasibility/usability | 5 | Strong self-report feasibility precedent |
| Remote Cognitive Screening of Healthy Older Adults for Primary Care With the MyCog Mobile App | Young et al. | 2024 | JMIR Formative Research | [Link](https://formative.jmir.org/2024/1/e54299) | Adults 65+ | Self-admin screening app | None | Pilot usability | 4 | Strong study design model for current stage |
| Creation of a Whole Health Age-Friendly Template and Dashboard Facilitates Implementation of 4Ms Into Primary Care | Powers & Penaranda | 2022 | Geriatrics | [DOI](https://doi.org/10.3390/geriatrics7050109) | Clinicians/older adults indirectly | EHR template + dashboard | None | QI implementation | 4 | Best explicit 4Ms comparator, clinician-side |
| The Age-Friendly Learning Healthcare System: Replicating electronic health record based documentation metrics for 4Ms care | Butler et al. | 2025 | Journal of the American Geriatrics Society | [DOI](https://doi.org/10.1111/jgs.19311) | Older adults indirectly | EHR metrics | None | Retrospective system evaluation | 4 | Shows existing 4Ms literature is mostly clinical infrastructure |
| Testing 3 Modalities (Voice Assistant, Chatbot, and Mobile App) to Assist Older African American and Black Adults | Huang et al. | 2024 | JMIR Formative Research | [Link](https://formative.jmir.org/2024/1/e60650) | Older adults | Voice assistant/chatbot/mobile app | Light AI | Modality evaluation | 4 | Useful for AI modality framing |
| Evaluating Older Adults’ Engagement and Usability With AI-Driven Interventions | Shade et al. | 2025 | JMIR Formative Research | [DOI](https://doi.org/10.2196/64763) | Older adults | Alexa-based intervention | Yes | Pilot | 4 | Good benchmark for AI + older-adult usability |
| A Hybrid Rule- and Large Language Model-Based Embodied Voice Assistant (GRACE) for Cognitive Stimulation in Older Adults | Vinay et al. | 2025 | JMIR Aging | [DOI](https://doi.org/10.2196/76489) | Older adults | Voice assistant | Yes | Usability study | 3 | Helps position AI as supportive, not clinically novel |
| AI conversational agents in older adults with chronic disease: a scoping review | Fiske et al. | 2026 | Geriatric Nursing | [PubMed](https://pubmed.ncbi.nlm.nih.gov/41576576/) | Older adults | Conversational agents | Yes | Review | 3 | Supports restrained AI claims |
| Technology to Support Aging in Place: Older Adults’ Perspectives | Peek et al. | 2019 | Healthcare | [Link](https://www.mdpi.com/2227-9032/7/2/60) | Older adults | Aging-in-place tech | None | Perspective/qualitative | 3 | Good framing background |

## 7. Deep Comparison Against Our Project

| Paper | 4Ms coverage | Medication tracking | Mentation tracking | Mobility tracking | What Matters tracking | Caregiver connection | Clinician connection | AI component | Evaluation level | Gap relative to our project |
|---|---|---|---|---|---|---|---|---|---|---|
| Patel 2020 | None | Strong | No | No | No | Yes | Yes | No | Usability | Strong medication usability evidence, but lacks integrated 4Ms self-report |
| Quinn 2019 | Indirect | Partial | Partial | Partial | Partial | Strong | Weak | No | Usability | Has dyadic/shared app; our caregiver support is much lighter |
| Turchioe 2020 | None | No | Symptom-focused | Partial | No | No | No | No | Feasibility | Strong self-report precedent, narrower than our 4Ms scope |
| Young 2024 | Partial | No | Strong | No | No | No | Primary care context | No | Pilot usability | Good self-admin model, but narrower domain |
| Powers 2022 | Strong | Partial | Partial | Partial | Strong | Indirect | Strong | No | QI implementation | Clinician-side 4Ms workflow, not patient-facing system |
| Butler 2025 | Strong | Partial | Partial | Partial | Partial | No | Strong | No | Health-system evaluation | Again clinician infrastructure, not self-management app |
| Shade 2025 | None | No | Partial | No | No | No | No | Yes | Pilot | Stronger AI evaluation than our current system |
| Vinay 2025 | Partial | No | Strong | No | No | No | No | Yes | Usability | Stronger AI interaction study, weaker 4Ms breadth |

### Strict Gap Analysis

- True gap we can plausibly claim: there is relatively little patient-facing, older-adult self-report work that integrates all four 4Ms in one system.
- Gap we cannot yet claim as current contribution: caregiver-clinician-older adult coordination, because the code does not implement it.
- Future opportunity, not current contribution: clinician summaries, medication risk alerts, adherence prediction, anomaly detection, and care-team dashboards.

## 8. Recommended Paper Strategy

### Track A: Early design/system paper

- Target venues: `JMIR Formative Research`, `Gerontechnology`, `AMIA` poster/demo.
- Recommended study design: one formative round with 8-12 older adults plus expert heuristic review.
- Minimum data needed: task completion, short usability instrument, qualitative feedback.
- Main contribution: integrated patient-facing 4Ms prototype with accessibility and lightweight caregiver/AI support.
- Suggested paper title: `Design and Early Formative Evaluation of a 4Ms-Guided Digital Health Application for Older Adults`.
- Suggested abstract angle: older adults need accessible, structured digital support around the 4Ms; describe the prototype and early formative findings.
- Main citations to use: Powers 2022, Quinn 2019, Turchioe 2020, Young 2024.
- Risk level: Moderate.
- What to build or evaluate next: export/shareable 4Ms summary; first usability study.

### Track B: HCI/usability paper

- Target venues: `JMIR Human Factors`, `ASSETS`, `DIS`, `MobileHCI`.
- Recommended study design: two-round think-aloud study with older adults.
- Minimum data needed: SUS or UMUX-Lite, task time/errors, accessibility observations, redesign log.
- Main contribution: age-friendly interaction patterns for multimodal health questionnaires and supportive AI.
- Suggested paper title: `Usability of a Multimodal 4Ms Health Assessment App for Older Adults`.
- Suggested abstract angle: multimodal interaction can reduce barriers in older-adult digital health; report barriers, redesigns, and usability outcomes.
- Main citations to use: Patel 2020, Turchioe 2020, usability evaluation reviews, aging-tech accessibility papers.
- Risk level: Moderate.
- What to build or evaluate next: more robust accessibility testing and scan/voice success measurement.

### Track C: AI-in-health paper

- Target venues: `IUI`, `JAMIA Open`, `AMIA`, later `AIME`.
- Recommended study design: prompt-set evaluation with clinician safety review plus older-adult trust/usability study.
- Minimum data needed: 50-100 prompts, grounded vs ungrounded baseline, clinician ratings for safety/helpfulness.
- Main contribution: evaluation of questionnaire-grounded AI support for older adults.
- Suggested paper title: `Evaluating Questionnaire-Grounded AI Support in a 4Ms Health App for Older Adults`.
- Suggested abstract angle: conversational AI is increasingly used for health questions; evaluate whether questionnaire grounding improves usefulness and safety.
- Main citations to use: Shade 2025, Vinay 2025, Fiske 2026, recent healthcare LLM evaluation papers.
- Risk level: High at current maturity.
- What to build or evaluate next: safety guardrails, refusal/escalation policy, clinician review workflow.

### Track D: Digital health / medical informatics pilot paper

- Target venues: `JMIR Aging`, `JMIR mHealth and uHealth`, `Frontiers in Digital Health`, later `IJMI`.
- Recommended study design: 4-8 week single-arm pilot with 15-30 older adults and optional caregiver subgroup.
- Minimum data needed: retention, repeated use, completion, caregiver feedback, feature-use logs, exit interviews.
- Main contribution: feasibility and acceptability of a 4Ms self-management support workflow for older adults.
- Suggested paper title: `Feasibility of a 4Ms-Based Digital Self-Management App for Older Adults: Pilot Study`.
- Suggested abstract angle: outside clinical visits, older adults need structured age-friendly self-management support; report pilot feasibility and engagement.
- Main citations to use: Quinn 2019, Young 2024, Powers 2022, Butler 2025.
- Risk level: Moderate to high.
- What to build or evaluate next: pilot instrumentation, caregiver usefulness metrics, optional clinician review of summaries.

## 9. What Data We Should Collect Before Submission

### Usability data

- SUS or UMUX-Lite
- task completion rate
- time on task
- error count / assistance needed
- qualitative feedback

### Older-adult accessibility data

- readability and visual comfort
- navigation difficulty
- usefulness of read-aloud
- usefulness of speech input
- cognitive burden

### Medication-management data

- scan success rate
- lookup comprehension
- reminder usefulness
- missed-medication logging, if later added

### Caregiver data

- perceived usefulness
- burden of reminder/tip emails
- trust in summaries or prompts
- actionability

### Clinician/doctor data

- only relevant after clinician-facing features exist
- potential future metrics: usefulness of summaries, workflow fit, safety concerns, alert burden

### AI-specific data

- correctness/helpfulness
- unsupported claim rate
- safety concerns
- trust and overreliance
- explainability / understanding of AI limits

| Data type | Metric/instrument | Who provides it | Why it matters | Needed for which venue type |
|---|---|---|---|---|
| Usability | SUS / UMUX-Lite | Older adults | Standard usability evidence | HCI, JMIR HF, formative journals |
| Task performance | Completion, time, errors | Older adults | Shows practical usability | HCI/usability |
| Accessibility | Assistance needed, readability, navigation issues | Older adults | Core aging-tech evidence | ASSETS, JMIR HF |
| Voice/read-aloud utility | Feature-specific ratings, observed failures | Older adults | Supports accessibility contribution | HCI/usability |
| Medication scan | Scan success, lookup accuracy, comprehension | Older adults | Validates one of the strongest practical features | HCI/digital health |
| Caregiver value | Perceived usefulness, burden, trust | Caregivers | Required for caregiver-related claims | Aging/digital health |
| Engagement | Repeat use, completion, retention | System logs / users | Needed for pilot feasibility | Digital health pilot |
| AI safety/helpfulness | Clinician or expert ratings | Clinicians/caregivers | Required for AI claims | AI-in-health |
| AI trust | Trust calibration, reuse intent | Older adults | Core HCAI measure | IUI/CHI/AIES |

## 10. Recommended Evaluation Design

### Option 1. Very small formative expert review

- Study type: heuristic/formative review.
- Participants: 3-5 gerontology, HCI, medication-management, or accessibility experts.
- Recruitment strategy: faculty/clinical contacts.
- Tasks: sign up, complete 4Ms sections, use voice/read-aloud, scan medication, review/save, use AI chat.
- Measures: severity-ranked usability issues, qualitative design critique.
- Procedure: moderated walkthrough with note capture.
- Analysis: affinity grouping and severity ranking.
- Ethical/IRB considerations: likely minimal risk, may still need institutional determination.
- Risks: no direct user evidence.
- Minimum viable version: existing MVP.

### Option 2. Usability study with older adults/caregivers

- Study type: task-based think-aloud usability study.
- Participants: 8-15 adults age 65+, varied digital literacy; optionally 3-5 caregivers.
- Recruitment strategy: senior centers, aging programs, clinics, community groups.
- Tasks: account creation, complete each 4Ms section, use voice/read-aloud, scan medication, use AI chat, save/review.
- Measures: SUS/UMUX-Lite, task completion, time, errors, verbalized confusion, post-task interview.
- Procedure: 45-60 minute moderated session.
- Data analysis plan: descriptive stats + thematic coding.
- Ethical/IRB considerations: privacy, non-clinical disclaimers, secure handling of transcripts/notes.
- Risks: convenience sample bias.
- Minimum viable version: existing MVP plus data collection sheet.

### Option 3. Pilot deployment with older adults and caregivers

- Study type: single-arm feasibility pilot.
- Participants: 15-30 older adults; optional caregiver subgroup.
- Recruitment strategy: community clinics, aging services, family caregiver networks.
- Tasks: repeated use over 4-8 weeks, reminders, AI chat, periodic updates to 4Ms responses.
- Measures: retention, completion, repeat use, caregiver email uptake, qualitative exit interview, AI trust/helpfulness.
- Procedure: onboarding session, periodic check-ins, end-of-study interview.
- Data analysis plan: feasibility metrics + descriptive engagement + thematic analysis.
- Ethical/IRB considerations: stronger consent/privacy process, clear safety boundary for AI.
- Risks: attrition, technical support burden, unclear clinical escalation paths.
- Minimum viable version: app + basic instrumentation + support workflow.

## 11. Search Queries Used

### 4Ms framework

- `"4Ms framework" older adults app medication mentation mobility`
- `"Age-Friendly Health Systems" digital health app older adults`
- `"4Ms" "digital tool" "older adults"`

### Older-adult medication apps

- `"older adults" medication adherence app caregiver`
- `"older adults" caregiver medication management mobile health`
- `"polypharmacy" "older adults" "mobile app" caregiver`

### Caregiver/clinician connection

- `"caregiver clinician communication" older adults digital health`
- `"caregiver dashboard" older adults medication adherence`
- `"clinician dashboard" geriatric remote monitoring`

### AI eldercare

- `"older adults" "AI" "caregiver" "health monitoring"`
- `"older adults" "conversational agent" medication management`
- `"human-AI interaction" older adults healthcare`

### HCI venues

- `site:chi2026.acm.org older adults health app`
- `site:mobilehci.acm.org healthcare older adults`
- `site:dl.acm.org older adults caregiver AI`

### Digital health journals

- `site:jmir.org older adults caregiver mobile app`
- `site:aging.jmir.org medication caregiver`
- `site:pubmed.ncbi.nlm.nih.gov "4Ms" "digital health"`

### Medical informatics venues

- `site:amia.org older adults medication app informatics`
- `site:sciencedirect.com older adults app caregiver medical informatics`
- `site:nature.com npj digital medicine small-scale preliminary studies`

## 12. Evidence Table

| Claim | Evidence source | Link | Confidence | Notes |
|---|---|---|---|---|
| App is patient-facing, not clinician-facing | Code routes/components | local codebase | High | No clinician UI found |
| 4Ms are fully represented in the questionnaire | Questionnaire schema | local codebase | High | Strongest core feature |
| AI is contextual chat + quick questions only | Functions/chatbot code | local codebase | High | No predictive or triage AI found |
| Caregiver support is email-based only | Profile + backend email flows | local codebase | High | No caregiver dashboard |
| Current stage is MVP/usability-test ready | Codebase inspection + no study code | local codebase | High | No formal evaluation data present |
| JMIR Formative Research is realistic | Official scope | [Link](https://formative.jmir.org/about-journal/focus-and-scope) | High | Explicitly welcomes formative/feasibility work |
| JMIR Human Factors fits after usability | Official scope | [Link](https://humanfactors.jmir.org/about-journal/focus-and-scope) | High | Best journal for usability framing |
| npj Digital Medicine is premature | Official aims | [Link](https://www.nature.com/npjdigitalmed/aims) | High | Says small-scale preliminary studies are typically not considered |
| CHI 2026 deadline | Official conference page | [Link](https://chi2026.acm.org/authors/papers/) | High | Verified during search |
| AMIA 2026 manuscript deadline | Official CFP | [Link](https://amia.org/education-events/amia-2026-annual-symposium/call-participation) | High | Verified during search |
| MobileHCI 2026 deadline | Official CFP | [Link](https://mobilehci.acm.org/2026/submit/papers.html) | High | Verified during search |
| ASSETS 2026 deadline | Official CFP | [Link](https://assets26.sigaccess.org/technical_papers.html) | High | Verified during search |

## 13. Final Recommendation

1. **Best current paper framing**  
   A `design/system + formative digital health prototype` paper centered on an older-adult-facing 4Ms app with accessibility support and lightweight applied AI.

2. **Best 3 target venues right now**  
   - [JMIR Formative Research](https://formative.jmir.org/about-journal/focus-and-scope)  
   - [Gerontechnology](https://journal.gerontechnology.org/Aim.aspx)  
   - [AMIA Annual Symposium](https://amia.org/education-events/amia-2026-annual-symposium/call-participation) as poster or system demo

3. **Most important missing evaluation**  
   A real older-adult usability study with task completion, errors, SUS/UMUX-Lite, and qualitative feedback.

4. **Most important missing feature, if any**  
   A shareable or exportable 4Ms summary for caregiver or clinician review. After that, a lightweight caregiver-facing view would materially strengthen the care-coordination story.

5. **Best title direction**  
   `Design and Early Evaluation of a 4Ms-Guided Digital Health Application for Older Adults`

6. **Best next 2-week plan to make the project submission-ready**  
   - Conduct one expert heuristic review and fix the highest-severity issues.  
   - Run 5-8 older-adult usability sessions on the current MVP.  
   - Capture task completion, errors, SUS/UMUX-Lite, and comments for scan, voice, read-aloud, AI chat, and save/review flows.  
   - Add a simple export/shareable 4Ms summary screen or PDF.  
   - Write a restrained paper around accessibility, integrated 4Ms structure, and formative findings rather than clinical effectiveness or AI novelty.
