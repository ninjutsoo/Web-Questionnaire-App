# Deep Literature Gap Search Report: 4Ms Questionnaire-Grounded AI Support and Patient Simulation

Search date: 2026-06-16  
Local anchor files: `Paper/Patient-Simulation-Papers/patient-sim1.txt`, `patient-sim2.txt`, `patient-sim3.txt`, `Paper/patient_simulation_project_analysis.md`

## 1. Executive Summary

The closest prior work is Shawon et al.'s 2026 patient-simulation risk-assessment paper, PatientSim, AIPatient, AgentClinic, CRAFT-MD, SAPS/AIE, HealthBench, MedAgentBench, SDBench, and AMIE. These works show that patient simulation, synthetic patient profiles, multi-turn clinical interaction, and rubric-based AI evaluation are active research areas. They are especially strong for diagnostic dialogue, ED history taking, medical education, synthetic EHR tasks, and general healthcare LLM evaluation.

The main gap is narrower and still defensible: I did not find a verified system that combines an older-adult 4Ms questionnaire workflow, accessibility-aware questionnaire completion, synthetic older-adult/caregiver profiles, health-literacy and recall variation, questionnaire-grounded AI response evaluation, and safety/comprehension stress testing in one reusable evaluation framework.

Our work may be novel if positioned as a simulation-based risk assessment layer for a 4Ms-oriented older-adult self-report and AI support system, not as a general medical diagnosis simulator. The strongest path is to build on patient-sim1's NIST AI RMF framing, traceable profile facts, health-literacy perturbations, and human/LLM judge validation, while changing the domain from antidepressant decision aid evaluation to older-adult 4Ms questionnaire-grounded AI support.

## 2. Search Methodology

Databases and sources searched:

- Local files in `Paper/` and `Paper/Patient-Simulation-Papers/`.
- arXiv, PubMed, JMIR, Nature / npj Digital Medicine / Nature Medicine / Communications Medicine.
- ACL Anthology, NeurIPS proceedings, ACM Digital Library, IEEE-indexed pages where available.
- Semantic Scholar and official project pages where proceedings or DOI pages were not enough.
- Google Scholar-like discovery was approximated through official pages, Semantic Scholar snippets, and citation links because direct Scholar access is unreliable in this environment.

Exact search strings used or delegated:

- `"patient simulation" "large language model" healthcare`
- `"synthetic patient" "LLM" "profile"`
- `"virtual patient" "AI agent" healthcare`
- `"simulated patient" "clinical decision support" "evaluation"`
- `"patient simulator" "conversational agent" medical`
- `"multi-agent" "hospital" "LLM" "patient"`
- `"AI agent" "clinical prediction" "patient simulation"`
- `"synthetic EHR" "patient profiles" "prediction"`
- `"standardized patient" "LLM" "simulation"`
- `"doctor patient interaction" "LLM" "simulator"`
- `"profile-based testing" "clinical AI"`
- `"stress testing" "clinical AI" "synthetic patients"`
- `"older adults" "conversational agent" healthcare`
- `"4Ms" "older adults" digital health AI`
- `"health literacy" "patient simulation" "LLM"`
- `"caregiver" "older adult" "AI assistant" health`
- Additional targeted strings: `"Advancing AI Trustworthiness Through Patient Simulation"`, `"PatientSim" "Persona-Driven Simulator"`, `"AIPatient" "EHRs" "LLM Powered Agentic Workflow"`, `"AgentClinic" "npj Digital Medicine"`, `"HealthBench" healthcare LLM`, `"MedAgentBench" NEJM AI`, `"Sequential Diagnosis with Language Models"`, `"Automatic Interactive Evaluation" "State Aware Patient Simulator"`.

Inclusion criteria:

- Direct: patient simulation, synthetic patient profiles, virtual patient systems, simulated patient-agent interaction, profile-based evaluation, or AI healthcare evaluation using controlled patient/user variation.
- Near: clinical AI agents, multi-agent clinical environments, synthetic EHR generation, or patient-facing healthcare chatbot evaluation that informs the proposed framework.
- Background: older-adult/health-literacy/accessibility/conversational-AI work or synthetic-data foundations that help frame but do not directly implement simulation-based AI evaluation.

Exclusion criteria:

- Generic medical education simulation without LLMs, patient profiles, AI evaluation, or decision-support relevance.
- News/blog posts unless used only to locate a primary source.
- Papers with no DOI, PubMed, arXiv, official proceedings, official dataset, or official project page.
- Duplicate preprints when a stronger peer-reviewed or official proceedings version exists.

Date range:

- Primary emphasis: 2024-2026.
- Foundational background retained where clearly important: Synthea 2018, synthetic patient data 2020-2023, DDXPlus 2022, EHR-Safe 2023.

Verification method:

- Every paper in the ranked table has a DOI, arXiv page, PubMed/JMIR/Nature page, ACL/NeurIPS proceedings page, PhysioNet page, or official project page.
- Claims about methods and validation were checked against abstracts, official pages, local seed text, or subagent-verified source summaries.
- Items marked "uncertain" need manual follow-up before being used as strong novelty evidence.

## 3. Seed Paper Analysis

### patient-sim1: Shawon et al., 2026

Title: [Advancing AI Trustworthiness Through Patient Simulation: Risk Assessment of Conversational Agents for Antidepressant Selection](https://arxiv.org/abs/2602.11391)  
Authors: Md Tanvir Rouf Shawon, Mohammad Sabik Irbaz, Hadeel R. A. Elyazori, Keerti Reddy Resapu, Yili Lin, Vladimir Franzuela Cardenas, Farrokh Alemi, Kevin Lybarger  
Venue/status: arXiv 2026  

Method: NIST AI RMF-aligned patient simulator for evaluating a conversational antidepressant decision aid. It combines EHR-grounded medical profiles from All of Us, linguistic profiles for health literacy and condition-specific communication, and behavioral profiles such as cooperative, distracted, and adversarial engagement. It uses traceable profile facts and evaluates retrieval/recommendation degradation across simulated patient variation.

Evaluation: 500 simulated conversations; human annotators and LLM judge; reported high medical concept fidelity and a monotonic health-literacy performance gradient.  
Limitations: no direct validation against real patient conversations yet; evaluated in one clinical domain; outputs depend on LLM simulator quality and profile assumptions.  
Value for our paper: methodological spine for a risk-assessment contribution.

### patient-sim2: PatientSim, Kyung et al., 2025

Title: [PatientSim: A Persona-Driven Simulator for Realistic Doctor-Patient Interactions](https://arxiv.org/abs/2505.17818) and [PhysioNet dataset](https://physionet.org/content/persona-patientsim/)  
Venue/status: NeurIPS Datasets and Benchmarks 2025 / PhysioNet dataset  

Method: ED-focused simulator using 170 MIMIC-IV/MIMIC-ED/MIMIC-IV-Note profiles, with 37 persona combinations across personality, language proficiency, medical history recall, and cognitive confusion.  
Evaluation: eight LLM backbones and clinician validation for factual accuracy, persona consistency, and realism.  
Limitations: ED history taking and diagnostic context; not older-adult 4Ms care; limited longitudinal/caregiver/accessibility modeling.  
Value for our paper: strong template for older-adult persona axes.

### patient-sim3: Elhilali et al., 2025

Title: [Large Language Model-Based Patient Simulation to Foster Communication Skills in Health Care Professionals](https://mededu.jmir.org/2025/1/e81271/)  
Venue/status: JMIR Medical Education 2025, DOI: 10.2196/81271  

Method: user-centered web prototype with LLM-generated vignettes and dynamic patient simulation. Vignette schema covers demographics, medical history, personality/communication, health literacy, social factors, and language proficiency.  
Evaluation: small usability study with medical students and physician ratings of model simulation quality.  
Limitations: formative sample, ceiling effects, limited discriminative reliability, missing automated feedback loop.  
Value for our paper: model for careful system-paper wording and small-study limitations.

### Citation-Network Notes

Backward citations from patient-sim1 emphasize user simulation, conversational healthcare agents, synthetic EHR, health literacy, NIST AI RMF, PatientSim, SAPS/AIE, AIPatient, SFMSS, AMIE, and LLM red-teaming. Forward citations for patient-sim1 are likely sparse because the arXiv version is from February 2026; no robust forward-citation claim should be made without a later Scholar/Semantic Scholar check.

Key terms discovered: patient simulation, virtual patient, standardized patient, synthetic patient, digital patient, patient persona, patient profile, health literacy, linguistic profile, behavioral profile, state-aware patient simulator, EHR-grounded simulation, NIST AI RMF, profile-based stress testing, rubric-based LLM evaluation, patient-facing AI safety.

## 4. Categorized Literature Review

### Directly Related to patient-sim1

- Shawon et al. 2026 directly integrates medical, linguistic, and behavioral variation to evaluate conversational healthcare AI risk.
- PatientSim adds persona axes, recall, language proficiency, and cognitive confusion for doctor-patient interaction.
- SAPS/AIE evaluates doctor LLMs through state-aware multi-turn patient simulation.
- CRAFT-MD, AgentClinic, MedAgentBench, HealthBench, and SDBench convert clinical AI evaluation from static QA toward interactive, realistic, rubric- or task-based evaluation.

### Patient Simulation Systems

The strongest patient simulation systems are PatientSim, AIPatient, SAPS/AIE, Virtual Patients Using LLMs, Holderried et al.'s simulated patient with feedback, Elhilali et al.'s web prototype, Luo et al.'s ophthalmology digital patients, SFMSS, Agent Hospital, and AMIE. Most focus on clinician training, diagnosis, or history taking. Few focus on patient-facing AI support after questionnaire completion.

### Synthetic Patient/Profile Generation

Synthea, DDXPlus, EHR-Safe, synthetic EHR benchmarks, AIPatient, PatientSim, and SimSUM show that synthetic profiles can be generated from rules, EHRs, benchmark cases, notes, or knowledge graphs. Their main gap for our purpose is that they usually model diagnosis, encounters, or records rather than older-adult self-report needs, caregiver context, accessibility, and 4Ms-specific variation.

### AI Agents for Healthcare Prediction or Decision Support

MedAgents, MDAgents, ClinicalAgent, AI Hospital, Agent Hospital, MedAgentBench, CARE-AD, and EvoMDT show rapid growth in clinical agent systems. These are useful comparators for agentic decision support, but most do not use synthetic older-adult personas to evaluate patient-facing response safety and comprehension.

### Multi-Agent Healthcare Simulation

AI Hospital, Agent Hospital, AIPatient, MedAgentSim, AgentClinic, and SynthAgent demonstrate multi-agent simulation involving patients, clinicians, measurement agents, supervisors, or retrieval/checker agents. Their relevance is high for architecture, but the domain is usually diagnosis, triage, training, or medical QA.

### Profile-Based Testing and Stress-Testing Frameworks

Shawon et al., HealthBench, CRAFT-MD, AgentClinic, SAPS/AIE, SDBench, and Templin et al.'s bias-evaluation framework provide the closest methodological base for profile-based testing. The gap is that older-adult 4Ms, caregiver context, accessibility needs, health-literacy adaptation, and questionnaire-grounding are not combined in one stress-testing protocol.

### Older-Adult, 4Ms, Caregiver, and Accessibility-Adjacent Work

The 4Ms/older-adult literature supports the clinical framing, while Nadarzynski et al. 2024 and older-adult conversational-agent reviews support inclusive design and health-equity framing. These works are important background but generally do not provide a reusable simulation benchmark for testing a questionnaire-grounded AI assistant.

## 5. Ranked Comparison Table

Legend: Y = Yes, P = Partial, N = No, U = Unclear/uncertain.

| Rank | Paper | Year | Venue | Link/DOI | Category | Main contribution | Patient simulation? | AI agent? | Multi-agent? | Prediction/decision support? | Patient profiles generated? | Uses real clinical data? | Uses synthetic data? | Longitudinal modeling? | Patient-clinician interaction? | Used to test/evaluate another AI system? | Older-adult/4Ms relevance? | Health-literacy/behavior/accessibility variation? | Clinical validation? | Bias/fairness/safety evaluation? | Reusable dataset/code? | Key limitation | How it could help our work | Closeness | Novelty gap relative to our work |
|---:|---|---:|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Advancing AI Trustworthiness Through Patient Simulation | 2026 | arXiv | [arXiv:2602.11391](https://arxiv.org/abs/2602.11391) | Direct | NIST-aligned simulator with medical, linguistic, behavioral profiles for antidepressant decision aid risk assessment | Y | P | N | Y | Y | Y | Y | P | Y | Y | P | Y | P | Y | Planned code/data | No real patient conversation validation; one domain | Use as methodological spine | High | Not 4Ms, older-adult questionnaire, caregiver, or accessibility focused |
| 2 | PatientSim | 2025 | NeurIPS D&B / PhysioNet | [arXiv](https://arxiv.org/abs/2505.17818), [PhysioNet DOI:10.13026/vq0d-v871](https://physionet.org/content/persona-patientsim/) | Direct | ED profiles with personality, language, recall, confusion personas | Y | Y | N | Y | Y | Y | Y | N | Y | Y | P | Y | Y | P | Y | ED diagnosis/history-taking scope | Reuse persona axes for 4Ms older adults | High | No 4Ms/caregiver/accessibility questionnaire workflow |
| 3 | AIPatient | 2026 | Communications Medicine | [DOI:10.1038/s43856-025-01283-x](https://www.nature.com/articles/s43856-025-01283-x) | Direct | EHR knowledge-graph patient simulation with multi-agent RAG | Y | Y | Y | P | Y | Y | Y | P | Y | P | P | P | P | P | Y | EHR/QA oriented; not patient-facing app evaluation | Model EHR-grounded profile architecture | High | Lacks 4Ms self-report and accessibility/caregiver stress tests |
| 4 | AgentClinic | 2026 | npj Digital Medicine | [DOI:10.1038/s41746-026-02674-7](https://www.nature.com/articles/s41746-026-02674-7) | Direct | Multimodal benchmark for tool-using clinical AI agents in simulated environments | Y | Y | Y | Y | P | Y | Y | P | Y | Y | P | P | P | Y | Y | Diagnosis/tool-use focus | Helps design interactive test environment and bias perturbations | High | Not patient-facing 4Ms questionnaire support |
| 5 | CRAFT-MD / evaluation framework for clinical LLM patient interaction tasks | 2025 | Nature Medicine | [DOI:10.1038/s41591-024-03328-5](https://www.nature.com/articles/s41591-024-03328-5) | Direct | Framework for evaluating LLMs in simulated patient interaction tasks | Y | Y | N | Y | P | P | Y | N | Y | Y | P | P | Y | P | U | Focuses clinical diagnosis/interaction tasks | Good rubric/evaluation comparator | High | No 4Ms/caregiver/accessibility evaluation |
| 6 | Automatic Interactive Evaluation with State-Aware Patient Simulator | 2024 | arXiv | [arXiv:2403.08495](https://arxiv.org/abs/2403.08495) | Direct | SAPS tests doctor LLMs in multi-turn clinical consultations | Y | Y | N | Y | P | P | Y | P | Y | Y | P | P | P | P | Y | Clinical consultation framing | Use state tracking and automatic metrics | High | Not older-adult 4Ms or questionnaire-grounded |
| 7 | MedAgentBench | 2025 | NEJM AI | [DOI:10.1056/AIdbp2500144](https://ai.nejm.org/doi/full/10.1056/AIdbp2500144) | Direct | Virtual EHR environment with patient-specific tasks for medical LLM agents | P | Y | P | Y | Y | Y | P | P | N | Y | P | N | P | P | Y | EHR-task benchmark, not dialogue with older adults | Strong benchmark design and FHIR-style task framing | Medium | Not conversational self-report or 4Ms support |
| 8 | HealthBench | 2025 | arXiv/OpenAI | [arXiv:2505.08775](https://arxiv.org/abs/2505.08775) | Direct | 5,000 healthcare conversations with physician-written rubrics | P | Y | N | P | P | P | Y | N | P | Y | P | P | Y | Y | Y | Broad benchmark, not a profile simulator | Rubric model for safety, context, communication | High | Does not control older-adult profile axes or questionnaire grounding |
| 9 | Sequential Diagnosis with Language Models / SDBench | 2025 | arXiv | [arXiv:2506.22405](https://arxiv.org/abs/2506.22405) | Direct | Stepwise diagnostic encounters from NEJM CPC cases | P | Y | Y | Y | P | P | Y | P | P | Y | N | N | P | P | U | Diagnostic benchmark; not patient-facing support | Shows value of sequential information seeking | Medium | No 4Ms/persona/accessibility variation |
| 10 | Towards Conversational Diagnostic AI / AMIE | 2025 | Nature | [DOI:10.1038/s41586-025-08866-7](https://www.nature.com/articles/s41586-025-08866-7) | Direct | Diagnostic dialogue AI evaluated in OSCE-style consultations | P | Y | N | Y | P | P | Y | N | Y | Y | P | P | Y | P | N | High-resource diagnostic focus | Comparator for patient-rated and specialist-rated evaluation | Medium | Does not evaluate questionnaire-grounded older-adult AI support |
| 11 | Virtual Patients Using Large Language Models | 2025 | JMIR | [DOI:10.2196/68486](https://www.jmir.org/2025/1/e68486/) | Direct | Contextualized virtual patient dialogue and feedback | Y | Y | N | P | P | P | Y | N | Y | P | P | P | P | P | U | Education/training rather than app risk testing | Feedback-loop design | Medium | No 4Ms/caregiver/accessibility focus |
| 12 | A Language Model-Powered Simulated Patient With Automated Feedback | 2024 | JMIR Med Educ | [DOI:10.2196/59213](https://mededu.jmir.org/2024/1/e59213/) | Direct | Simulated patient plus automated history-taking feedback | Y | Y | N | P | P | N | Y | N | Y | P | P | P | P | P | U | History-taking education scope | Automated feedback inspiration | Medium | Not patient-facing AI safety/comprehension testing |
| 13 | LLM-Based Patient Simulation to Foster Communication Skills | 2025 | JMIR Med Educ | [DOI:10.2196/81271](https://mededu.jmir.org/2025/1/e81271/) | Direct | Web simulator with vignette generator and dynamic patient simulation | Y | Y | N | P | Y | N | Y | N | Y | N | P | Y | P | P | U | Small formative evaluation; ceiling effects | Writing model for cautious system paper | Medium | Medical education, not older-adult questionnaire AI |
| 14 | SFMSS | 2025 | Findings NAACL | [ACL](https://aclanthology.org/2025.findings-naacl.259/) | Near/direct | Service-flow-aware medical scenario simulation for conversational data | Y | Y | Y | P | P | P | Y | P | Y | P | N | Y | P | P | Y | Data generation rather than deployed AI-risk evaluation | Workflow/control ideas | Medium | Not 4Ms or older adult support |
| 15 | AI Hospital | 2025 | COLING | [ACL](https://aclanthology.org/2025.coling-main.680/) | Direct | Multi-agent medical interaction simulator with doctor, patient, examiner, chief physician | Y | Y | Y | Y | P | P | Y | P | Y | Y | N | P | P | P | U | Diagnosis/hospital simulation | Multi-agent architecture comparator | Medium | Not patient-facing 4Ms questionnaire support |
| 16 | Agent Hospital | 2024 | arXiv | [arXiv:2405.02957](https://arxiv.org/abs/2405.02957) | Direct/near | Hospital simulacrum with patient, nurse, doctor agents and evolving doctors | Y | Y | Y | Y | P | N | Y | P | Y | Y | N | P | U | P | U | Synthetic validation limits | Shows simulated clinical environment scale | Medium | Not grounded in older-adult self-report or app responses |
| 17 | LLMs Can Simulate Standardized Patients via Agent Coevolution | 2025 | ACL | [ACL](https://aclanthology.org/2025.acl-long.846/) | Direct | EvoPatient coevolves standardized patient agents with doctor agents | Y | Y | Y | P | P | N | Y | N | Y | Y | P | Y | P | P | U | Standardized-patient education focus | Persona robustness ideas | Medium | No 4Ms/accessibility/caregiver dimensions |
| 18 | DDXPlus | 2022 | NeurIPS D&B | [NeurIPS](https://proceedings.neurips.cc/paper_files/paper/2022/hash/cae73a974390c0edd95ae7aeae09139c-Abstract-Datasets_and_Benchmarks.html) | Near | Large synthetic patient dataset for automatic diagnosis | P | N | N | Y | Y | N | Y | P | N | Y | N | N | P | P | Y | Static diagnostic profiles | Profile schema and evidence hierarchy | Medium | Not conversational, older-adult, or questionnaire-grounded |
| 19 | Synthea | 2018 | JAMIA | [DOI:10.1093/jamia/ocx079](https://academic.oup.com/jamia/article/25/3/230/4098271) | Background | Open-source synthetic patient and synthetic EHR generator | P | N | N | P | Y | N | Y | Y | N | P | P | N | P | P | Y | Rule-based population simulation, not dialogue | Synthetic profile data source pattern | Low/Medium | No AI response testing or communication variation |
| 20 | EHR-Safe | 2023 | npj Digital Medicine | [DOI:10.1038/s41746-023-00888-7](https://www.nature.com/articles/s41746-023-00888-7) | Background | High-fidelity privacy-preserving synthetic EHR generation | N | N | N | P | Y | Y | Y | P | N | P | P | N | P | P | N | EHR synthesis, not patient simulator | Synthetic-data validation framing | Low | No conversational or 4Ms evaluation |
| 21 | SimSUM | 2024 | arXiv | [arXiv:2409.08936](https://arxiv.org/abs/2409.08936) | Near | Benchmark linking structured and unstructured simulated medical records | P | N | N | P | Y | P | Y | P | N | P | N | N | P | P | Y | Records benchmark, not dialogue | Useful for structured/unstructured profile design | Low/Medium | No patient-facing AI or older-adult profiles |
| 22 | PATIENT-psi | 2024 | EMNLP | [ACL](https://aclanthology.org/2024.emnlp-main.711/) | Near/direct | CBT patient simulation using cognitive models | Y | Y | N | P | Y | N | Y | P | Y | P | P | Y | P | P | Y | Mental-health training scope | Behavioral/cognitive schema inspiration | Medium | Not 4Ms/caregiver/accessibility questionnaire |
| 23 | Sleepless Nights, Sugary Days | 2025 | Findings ACL | [arXiv:2502.13135](https://arxiv.org/abs/2502.13135) | Direct/near | Synthetic health users for realistic coaching-agent interactions | P | Y | P | P | Y | P | Y | P | P | Y | P | Y | P | P | U | Coaching domain, not older-adult 4Ms | Closest for patient-facing coaching simulation | High | Does not cover 4Ms/caregiver/accessibility evaluation |
| 24 | Framework for bias evaluation in LLMs in healthcare settings | 2025 | npj Digital Medicine | [DOI:10.1038/s41746-025-01786-w](https://www.nature.com/articles/s41746-025-01786-w) | Near | Five-step framework for healthcare LLM bias evaluation | N | Y | N | P | P | P | P | N | N | Y | P | P | P | Y | N | Framework, not simulator | Bias/fairness audit structure | Medium | Needs concrete 4Ms simulation instantiation |
| 25 | Standardizing and Scaffolding Health Care AI-Chatbot Evaluation | 2025 | JMIR AI | [DOI:10.2196/69006](https://ai.jmir.org/2025/1/e69006) | Near | HAICEF systematic review and evaluation construct hierarchy | N | Y | N | P | N | N | N | N | P | Y | P | P | P | Y | N | Review, not implementation | Evaluation-domain checklist | Medium | Does not generate older-adult profiles |
| 26 | Achieving Health Equity Through Conversational AI | 2024 | PLOS Digital Health | [DOI:10.1371/journal.pdig.0000492](https://journals.plos.org/digitalhealth/article?id=10.1371/journal.pdig.0000492) | Background | Roadmap for inclusive healthcare chatbots | N | Y | N | P | N | N | N | N | P | P | P | Y | P | Y | N | Roadmap, not simulator | Equity/accessibility framing | Low/Medium | No simulation or 4Ms-specific evaluation |

## 6. Novel Research Opportunities

1. 4Ms synthetic older-adult profile benchmark.  
Proposed contribution: release a structured benchmark of older-adult 4Ms profiles with questionnaire answers, free-text notes, caregiver context, accessibility needs, and risk flags.  
Why novel: existing simulators cover ED, diagnosis, therapy, or coaching, but not 4Ms questionnaire-grounded support.  
Extends: patient-sim1, PatientSim, HealthBench.  
Experiment: run profile variants through the app's AI chat and score safety, personalization, comprehension, and context use.  
Strong evidence: human-reviewed subset and inter-rater agreement with LLM judge.

2. Health-literacy and recall stress testing for questionnaire-grounded AI.  
Proposed contribution: evaluate whether equivalent 4Ms facts produce equivalent AI advice under plain, vague, anxious, distracted, or low-literacy wording.  
Why novel: patient-sim1 shows health-literacy degradation in antidepressant decision aid retrieval; the same concept has not been shown for older-adult 4Ms self-report support.  
Extends: patient-sim1, PatientSim, Nadarzynski et al.  
Experiment: controlled profile perturbations with identical ground truth and varied expression style.  
Strong evidence: statistically visible performance gradients plus qualitative failure taxonomy.

3. Caregiver-aware AI response evaluation.  
Proposed contribution: simulate older adults with no caregiver, nearby caregiver, remote caregiver, and caregiver conflict/privacy constraints.  
Why novel: caregiver context is underrepresented in patient simulation benchmarks.  
Extends: older-adult digital health and inclusive conversational AI literature.  
Experiment: compare AI escalation, consent, privacy, and support suggestions across caregiver variants.  
Strong evidence: clinician/gerontology review of caregiver-sensitive scenarios.

4. Accessibility-aware simulated app completion.  
Proposed contribution: simulate low vision, voice preference, typing difficulty, mobile-only use, and medication scanning uncertainty.  
Why novel: most clinical simulators model medical facts, not accessibility-mediated questionnaire completion.  
Extends: PatientSim persona axes and app-specific accessibility features.  
Experiment: generate questionnaire submissions with missing/uncertain fields caused by accessibility constraints, then test AI response robustness.  
Strong evidence: older-adult usability data confirming simulation-identified friction.

5. 4Ms safety escalation benchmark.  
Proposed contribution: define expected response requirements for falls, dizziness, medication interaction concerns, acute confusion, loneliness/depression, and urgent symptoms.  
Why novel: broad HealthBench-style safety rubrics exist, but not a compact 4Ms-specific risk rubric.  
Extends: HealthBench, HAICEF, patient-sim1.  
Experiment: score AI responses for escalation, non-overreach, clarity, and personalization.  
Strong evidence: physician/geriatrician rubric review.

6. Questionnaire-to-chat consistency audit.  
Proposed contribution: test whether the AI chat uses questionnaire context correctly and avoids hallucinating facts not present in the submitted 4Ms answers.  
Why novel: most simulators evaluate diagnostic elicitation; this evaluates downstream use of patient-entered structured context.  
Extends: MedAgentBench and HealthBench.  
Experiment: inject conflicting or sparse questionnaire data and measure contradiction, overreach, and clarifying-question behavior.  
Strong evidence: reproducible runs across multiple LLM backends.

7. Simulation plus formative older-adult usability triangulation.  
Proposed contribution: compare risks surfaced by simulated profiles with real older-adult usability observations.  
Why novel: few systems combine controlled synthetic stress tests with live formative validation for patient-facing AI.  
Extends: Elhilali et al. and patient-sim1.  
Experiment: Phase 1 simulation, Phase 2 small usability study, then map overlap.  
Strong evidence: simulation failures predict observed user confusion or trust barriers.

## 7. Recommended Paper Positioning

Option 1:

Unlike prior virtual-patient systems that primarily evaluate clinician diagnosis, history taking, or medical education, our work evaluates questionnaire-grounded AI support for older adults after structured 4Ms self-report. We introduce synthetic older-adult profiles that vary medical concerns, health literacy, recall, communication behavior, accessibility needs, and caregiver context, then use these profiles to test whether AI responses remain safe, understandable, personalized, and consistent.

Option 2:

Unlike general healthcare chatbot benchmarks that score broad model behavior, our framework grounds evaluation in the user's own 4Ms questionnaire data. This makes it possible to test whether AI support correctly uses reported medication, mentation, mobility, and personal-goal context, while avoiding overconfident clinical advice and preserving clear escalation behavior for safety-sensitive scenarios.

Option 3:

Building on NIST-aligned patient simulation for conversational healthcare AI risk assessment, we adapt profile-based stress testing to age-friendly digital health. Our contribution is not a diagnostic model; it is a reproducible evaluation protocol for identifying safety, comprehension, personalization, and equity risks in an older-adult 4Ms questionnaire and AI support system before clinical deployment.

## 8. Actionable Next Steps for Our Paper

Simulation protocol to implement:

- Create 40 base older-adult profiles across medication-heavy, fall-risk/mobility, mentation/memory/sleep, what-matters/caregiver, and mixed 4Ms cases.
- Cross each base profile with 4 expression variants: proficient/plain, limited health literacy, vague recall, anxious/distracted or reluctant.
- Generate 160 profile variants and 3-5 post-questionnaire chat prompts per variant.
- Submit questionnaire-compatible structured answers and chat prompts to the app/backend.
- Store responses, model metadata, prompt version, profile id, and rubric scores.

Profile dimensions to include:

- Demographics: age band, living situation, digital familiarity.
- 4Ms: What Matters goals, medications, mentation, mobility, falls, support needs.
- Communication: health literacy, recall, verbosity, anxiety, trust/mistrust, language complexity.
- Accessibility: voice preference, low vision, typing difficulty, mobile-only interaction.
- Caregiver: none, nearby, remote, caregiver conflict, privacy constraints.
- Risk flags: falls, dizziness, memory decline, medication confusion, loneliness/depression, urgent-care cues.

Metrics to report:

- Context use: relevant questionnaire facts referenced.
- Safety: no diagnosis/treatment overreach; appropriate disclaimers.
- Escalation: clinician/emergency referral when required.
- Clarity: readable at intended health-literacy level.
- Personalization: tailored to 4Ms profile and stated goals.
- Consistency: equivalent facts produce equivalent advice across wording variants.
- Robustness: adversarial/off-topic prompts do not derail safety.
- Hallucination: no invented user facts.
- Equity gap: performance difference across literacy/recall/behavior/accessibility groups.

Baselines and prior papers to compare against:

- Methodological baseline: patient-sim1.
- Persona/profile baseline: PatientSim.
- Evaluation/rubric baseline: HealthBench and HAICEF.
- Interactive clinical benchmark baseline: SAPS/AIE, CRAFT-MD, AgentClinic, SDBench.
- Synthetic health-user comparator: Sleepless Nights, Sugary Days.

Safe claims:

- The app implements a 4Ms-oriented self-report workflow with contextual AI support.
- A simulation protocol can expose safety, comprehension, personalization, and consistency risks before deployment.
- Controlled profile variation can test whether AI response quality changes across health literacy, recall, behavior, accessibility, and caregiver context.

Claims requiring more evidence:

- The app improves clinical outcomes.
- The AI advice is clinically validated.
- Synthetic profiles represent real older adults without live-user validation.
- The system is ready for clinical deployment.

## 9. Candidate Screening List

At least 47 candidate papers/resources were screened. Included or high-relevance candidates:

1. Shawon et al. 2026, Advancing AI Trustworthiness Through Patient Simulation.
2. Kyung et al. 2025, PatientSim.
3. Yu et al. 2026, AIPatient.
4. Schmidgall et al. 2026, AgentClinic.
5. Johri et al. 2025, CRAFT-MD / patient interaction evaluation framework.
6. Liao et al. 2024, SAPS/AIE.
7. Jiang et al. 2025, MedAgentBench.
8. Arora et al. 2025, HealthBench.
9. Nori et al. 2025, SDBench.
10. Tu et al. 2025, AMIE.
11. Cook et al. 2025, Virtual Patients Using LLMs.
12. Holderried et al. 2024, simulated patient with feedback.
13. Elhilali et al. 2025, LLM-based patient simulation web prototype.
14. Bao et al. 2025, SFMSS.
15. Fan et al. 2025, AI Hospital.
16. Li et al. 2024, Agent Hospital.
17. Du et al. 2025, EvoPatient.
18. Tchango et al. 2022, DDXPlus.
19. Walonoski et al. 2018, Synthea.
20. Yoon et al. 2023, EHR-Safe.
21. Rabaey et al. 2024, SimSUM.
22. Wang et al. 2024, PATIENT-psi.
23. Yun et al. 2025, Sleepless Nights, Sugary Days.
24. Templin et al. 2025, LLM healthcare bias evaluation framework.
25. Hua et al. 2025, HAICEF.
26. Nadarzynski et al. 2024, conversational AI health-equity roadmap.
27. Chen et al. 2023, LLM-empowered psychiatrist and patient simulation.
28. Luo et al. 2025, ophthalmology digital patient system.
29. Aghaee et al. 2026, SynthAgent.
30. Haider et al. 2025, synthetic patient-physician conversations.
31. Borg et al. 2025, virtual patient simulations with social robotics and LLMs.
32. Bodonhelyi et al. 2025, challenging patient interactions.
33. Emerson et al. 2025, automated evaluation of standardized patients with LLMs.
34. Oncu et al. 2025, AI-powered standardized patients for interns.
35. Li et al. 2024, CureFun / LLM simulated patients for clinical education.
36. Rashidian et al. 2025, AI agents for conversational patient triage.
37. Tang et al. 2024, MedAgents.
38. Kim et al. 2024, MDAgents.
39. Yue et al. 2024, ClinicalAgent.
40. Chen et al. 2025, multi-agent conversational LLMs for rare disease diagnosis.
41. Zuo et al. 2024, KG4Diagnosis.
42. Almansoori et al. 2025, MedAgentSim.
43. Ke et al. 2024, mitigating cognitive biases through multi-agent conversations.
44. Li et al. 2025, CARE-AD.
45. Liu et al. 2026, EvoMDT.
46. Klang et al. 2026, orchestrated multi agents under clinical-scale workloads.
47. Conversational agents for older adults' health systematic-review preprint.

Excluded or de-emphasized:

- Generic medical education simulation without AI/profile-testing relevance: excluded.
- Broad LLM-in-medicine reviews: used only for context, not in ranked table.
- Commercial synthetic-patient blog posts and product pages: excluded unless they pointed to primary literature.
- Duplicates where a peer-reviewed version existed: arXiv/preprint duplicates were de-emphasized in favor of DOI/proceedings versions.
- 2026 preprints from curated agent lists with no accessible primary page: excluded from final table unless official arXiv/DOI verification was available.

## 10. Top Novelty Claims and Risks

Top 3 strongest novelty claims:

1. A 4Ms-specific synthetic older-adult profile benchmark for questionnaire-grounded AI response evaluation appears underexplored relative to existing diagnostic, ED, and medical-education patient simulators.
2. Combining health literacy, recall, behavior, accessibility needs, caregiver context, and 4Ms risk flags into controlled simulation-based testing is a defensible contribution if implemented and validated.
3. Evaluating downstream AI responses grounded in completed questionnaire data is distinct from evaluating clinician-style diagnosis, history taking, or generic healthcare chatbot answers.

Top 3 biggest risks to those claims:

1. HealthBench, AgentClinic, CRAFT-MD, MedAgentBench, and patient-sim1 are broad enough that novelty must be framed as domain-specific integration, not as the first simulation-based healthcare AI evaluation.
2. Without human review or real older-adult formative validation, the simulator's ecological validity will be a major limitation.
3. If the app's AI response layer is not instrumented for reproducible runs, scoring, and traceable questionnaire context, the paper will look like a prototype description rather than a rigorous simulation-evaluation contribution.
