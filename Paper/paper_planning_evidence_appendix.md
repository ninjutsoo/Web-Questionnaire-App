# Paper Planning Evidence Appendix

## Repo-grounded contribution boundaries

### What is clearly implemented

- route-based web app with landing, sign-in, sign-up, home, questionnaire, migration, and AI chat
- Firebase-backed authentication and persistence
- four 4Ms questionnaire sections
- progress tracking and save workflow
- speech playback for questions
- speech-to-text for free-text answers
- mobility-type-specific safety guidance
- medication barcode/QR scanning with public drug/product lookup services
- questionnaire-contextualized AI prompting
- quick AI question generation/storage
- caregiver email storage in user profile
- backend reminder and caregiver-tip email endpoints
- legacy data migration tooling

### What is only partial or fragile

- caregiver support is backend/profile adjacent, not a full caregiver-facing workflow
- medication scanning depends on public external services and proxies
- AI behavior depends on prompt logic and external model APIs
- geolocation-aware chat is optional and browser dependent
- there are two backend paths in the repo, which complicates architecture narrative

### What is not implemented enough to be a paper claim

- clinician portal
- clinician export/share workflow
- real dyad co-use interface
- outcome tracking
- validated research logging pipeline
- role-based access control suitable for strong workflow claims

## Strongest defensible contribution statement

The strongest defensible contribution is:

> an implemented 4Ms-oriented older-adult self-report web system that integrates structured assessment, multimodal accessibility-oriented interaction, mobility-tailored guidance, and questionnaire-contextualized AI assistance

The weakest possible contribution statement, which should be avoided, is:

> an AI-powered caregiver-clinician coordination platform that improves older-adult health outcomes

## Seed paper section maps

### Aging 2019

High-level structure:

- Abstract
- Introduction
- Methods
  - Study Population
  - Approach
  - Usability Evaluation
  - Study Measures
  - Statistical Analysis
- Results
- Discussion
  - Principal Findings
  - embedded limitations
- Conclusions

Best reusable features:

- caregiver burden framing
- practical support needs
- phase-oriented early evaluation logic

Main danger:

- makes dyad framing look easier to justify than it is for your current repo

### Formative 2024

High-level structure:

- Abstract
- Introduction
- Methods
  - Ethical Considerations
  - Sample
  - Procedure
  - Measures
  - instrument subsections
  - Analysis
- Results
  - Overview
  - Psychometric Properties
  - Usability
  - Free-Response Feedback
- Discussion
  - Principal Findings
  - Limitations
  - Comparisons With Prior Work
- Conclusions

Best reusable features:

- narrow pilot framing
- explicit research questions
- disciplined claims
- clearer limitations

Main danger:

- invites psychometric/validation language that your app cannot currently support

## Recommended study emphasis by feature

| Feature | Include in paper? | Include in study? | How to frame it |
| --- | --- | --- | --- |
| 4Ms questionnaire structure | Yes | Yes | Core system |
| Voice playback | Yes | Yes | Accessibility support |
| Speech-to-text | Yes | Yes | Accessibility / reduced typing burden |
| Mobility-type safety guidance | Yes | Yes | Tailored informational support |
| AI quick questions | Yes | Yes | Contextual prompting support |
| AI chat | Yes | Yes | Supportive conversational feature, not diagnostic |
| Medication scanning | Yes | Optional | Exploratory convenience feature |
| Caregiver email storage | Yes | Maybe | Caregiver-adjacent support |
| Caregiver tip email workflow | Only cautiously | Not as a core task | Partial support, not central claim |
| Migration tooling | No, unless appendix | No | Administrative implementation detail |

## Recommended figure set

1. System architecture diagram
2. End-to-end user workflow diagram
3. Screenshot of one questionnaire section with voice support
4. Screenshot of mobility guidance state
5. Screenshot of AI chat with contextual suggestions

## Recommended table set

1. System feature table: implemented vs partial vs unsupported
2. 4Ms section/question-type table
3. Participant characteristics table
4. Task completion/usability outcomes table
5. Claims-and-evidence table

## One-paragraph positioning summary

This repo supports a credible paper if the manuscript stays disciplined: it is an implemented digital health system for older-adult 4Ms self-report and supportive interaction, not a validated screener, not a clinician-integrated workflow, and not yet a true caregiver co-use platform. The paper should therefore foreground system design and formative usability evidence, using the 2024 JMIR Formative paper as the main structural model and the 2019 JMIR Aging paper only as context for older-adult and caregiver need.
