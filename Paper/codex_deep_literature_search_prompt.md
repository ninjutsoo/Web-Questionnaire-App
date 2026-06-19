# Codex Deep Literature Search Prompt

Copy the instruction below into a new Codex task when you want a bounded, multi-agent literature search for the paper.

```text
You are Codex acting as a multi-agent research coordinator for a paper literature review.

Workspace context:
- Repo: Web-Questionnaire-App
- Seed paper text is available locally at:
  - Paper/Patient-Simulation-Papers/patient-sim1.txt
- Additional related patient simulation papers are available at:
  - Paper/Patient-Simulation-Papers/patient-sim2.txt
  - Paper/Patient-Simulation-Papers/patient-sim3.txt
- Existing project analysis is available at:
  - Paper/patient_simulation_project_analysis.md
  - Paper/paper_planning_blueprint.md
  - Paper/venue_and_paper_search.md

Our work:
We are building a web-based 4Ms-oriented older-adult questionnaire and AI support system. The possible paper contribution is not only the app itself, but a simulation-based evaluation framework using synthetic older-adult patient profiles to test whether questionnaire-grounded AI support remains safe, understandable, personalized, and consistent across variation in medical status, cognition, communication style, health literacy, behavior, accessibility needs, and caregiver context.

Seed paper:
Use Paper/Patient-Simulation-Papers/patient-sim1.txt as the main seed paper. Treat it as the methodological anchor. It appears to describe a patient simulator for evaluating conversational AI decision aids using medical, linguistic, and behavioral profiles, with risk-aware generation and validation.

Main goal:
Conduct a deep literature search to find the gap at the intersection of:
1. Patient simulation.
2. Synthetic patient profiles/personas.
3. AI agents and multi-agent clinical simulation.
4. Healthcare prediction or decision support.
5. Profile-based testing, stress testing, or evaluation of AI systems.
6. Older-adult, 4Ms, caregiver, accessibility, and patient-facing AI contexts where relevant.

Important: The final result should help us decide what is novel for our paper and how to position our work.

Hard limits:
- Search at least 40 candidate papers.
- Include 20-30 papers in the final ranked table.
- Include at least 8 papers from 2024-2026 if verifiable and relevant.
- Include foundational older papers only if they are clearly important.
- Do not spend effort on papers that are only about generic medical education simulation unless they connect to patient profiles, LLMs, agents, prediction, or AI evaluation.
- Do not invent citations. Every final-table paper must have a DOI, PubMed page, arXiv page, ACM/IEEE/ACL/Semantic Scholar page, official proceedings page, or official project/code page.
- Clearly mark papers as "direct", "near", or "background" relevance.
- If a claim cannot be verified, mark it as uncertain rather than presenting it as fact.

Search sources:
- Local files in Paper/ first.
- Google Scholar or Semantic Scholar.
- PubMed.
- arXiv and medRxiv.
- ACM Digital Library.
- IEEE Xplore.
- ACL Anthology.
- NeurIPS, ICML, ICLR, CHI, CSCW, AMIA, JMIR, npj Digital Medicine, Nature Digital Medicine, Lancet Digital Health, JBI, Artificial Intelligence in Medicine, and relevant medical informatics venues.

Suggested search strings:
- "patient simulation" "large language model" healthcare
- "synthetic patient" "LLM" "profile"
- "virtual patient" "AI agent" healthcare
- "simulated patient" "clinical decision support" "evaluation"
- "patient simulator" "conversational agent" medical
- "multi-agent" "hospital" "LLM" "patient"
- "AI agent" "clinical prediction" "patient simulation"
- "synthetic EHR" "patient profiles" "prediction"
- "standardized patient" "LLM" "simulation"
- "doctor patient interaction" "LLM" "simulator"
- "profile-based testing" "clinical AI"
- "stress testing" "clinical AI" "synthetic patients"
- "older adults" "conversational agent" healthcare
- "4Ms" "older adults" digital health AI
- "health literacy" "patient simulation" "LLM"
- "caregiver" "older adult" "AI assistant" health

Use the following agent structure. If actual subagents are available, launch them. If not, simulate the roles sequentially and keep each role's notes separate.

Agent 1: Local Seed and Citation Expansion Agent
Tasks:
- Read patient-sim1.txt, patient-sim2.txt, patient-sim3.txt, and patient_simulation_project_analysis.md.
- Extract each seed paper's title, authors, year, venue, method, dataset, evaluation, limitations, and future work.
- Extract citations from the local seed papers.
- Search for papers that cite patient-sim1, patient-sim2, and patient-sim3.
- Identify the key terms the papers use for patient simulation, personas, profiles, medical grounding, linguistic variation, behavioral profiles, risk assessment, and validation.

Output:
- Short seed-paper summaries.
- Backward citation list.
- Forward citation list where available.
- Initial candidate paper list.
- Vocabulary/search terms discovered from the seed papers.

Agent 2: Patient Simulation Systems Agent
Tasks:
- Find patient simulation, virtual patient, simulated patient, digital patient, synthetic patient, and clinical dialogue simulation papers.
- Prioritize systems that generate patient profiles, use EHR data, support multi-turn interactions, or evaluate AI systems.

For each paper, extract:
- What is simulated.
- Whether profiles are generated.
- Whether patient behavior or language varies.
- Whether clinical realism is validated.
- Whether longitudinal disease progression is modeled.
- Whether the simulator is used for training, prediction, decision support, or AI evaluation.

Agent 3: AI Agents for Prediction and Clinical Decision Support Agent
Tasks:
- Find papers using AI agents, LLM agents, or multi-agent systems for healthcare prediction, triage, diagnosis, care planning, treatment selection, outcome forecasting, or decision support.
- Include multi-agent clinical environments such as AI hospitals, agent clinics, or simulated hospital workflows if relevant.

For each paper, extract:
- Agent role: patient, clinician, planner, evaluator, predictor, supervisor, or environment.
- Prediction or decision task.
- Input data.
- Output.
- Whether it uses simulated patients or real patient profiles.
- Whether it evaluates safety, uncertainty, bias, robustness, or clinical validity.

Agent 4: Synthetic Patient Profile and Testing Agent
Tasks:
- Find papers on synthetic patient generation, synthetic EHR, patient personas, patient avatars, case vignettes, standardized patients, counterfactual patient profiles, rare-case generation, edge-case generation, and benchmark patient cases.
- Focus on whether generated profiles are used to test AI systems, stress-test decision support, or evaluate behavior under controlled patient variation.

For each paper, extract:
- Profile schema.
- Profile source: EHR, expert-authored, rules, LLM, simulation model, real cases, or hybrid.
- Profile dimensions: demographics, medications, conditions, symptoms, labs, cognition, mobility, behavior, health literacy, social determinants, caregiver context, accessibility needs.
- Validation method.
- Whether profiles are static or adaptive.

Agent 5: Verification Agent
Tasks:
- Verify every candidate paper before it enters the final table.
- Confirm title, authors, year, venue, DOI/arXiv/PubMed/proceedings link.
- Remove duplicates.
- Flag weakly related papers.
- Separate direct evidence from background evidence.
- Prefer primary papers over blog posts, news articles, or unsupported claims.

Output:
- Verified bibliography.
- Excluded paper list with reason for exclusion.

Agent 6: Gap and Novelty Analysis Agent
Tasks:
- Compare every verified paper against our proposed work.
- Identify which prior works are closest.
- Identify what combination of capabilities is missing in the literature.
- Propose concrete novel directions for our paper.

Evaluate these attributes for each paper:
- Patient simulation.
- Synthetic patient/profile generation.
- AI agent.
- Multi-agent system.
- Prediction or decision-support task.
- Profile-based testing of another AI system.
- Patient-clinician interaction.
- Older-adult relevance.
- 4Ms relevance.
- Health literacy or communication variation.
- Behavioral/persona variation.
- Accessibility or caregiver context.
- Longitudinal disease or patient journey modeling.
- Real clinical data.
- Synthetic data.
- Clinical validation.
- Bias/fairness/safety/robustness evaluation.
- Reusable dataset or code.

Final deliverable:
Create a markdown report at:
Paper/deep_literature_gap_search_report.md

The report must include:

1. Executive Summary
- Closest prior work.
- Main gap.
- Why our work may be novel.
- How our work can build on patient-sim1.

2. Search Methodology
- Databases searched.
- Exact search strings used.
- Inclusion criteria.
- Exclusion criteria.
- Date range.
- Verification method.

3. Seed Paper Analysis
- Summaries of patient-sim1, patient-sim2, and patient-sim3.
- Citation-network notes.
- Key terms and concepts.

4. Categorized Literature Review
Group papers into:
- Directly related to patient-sim1.
- Patient simulation systems.
- Synthetic patient/profile generation.
- AI agents for healthcare prediction or decision support.
- Multi-agent healthcare simulation.
- Profile-based testing and stress-testing frameworks.
- Older-adult, 4Ms, caregiver, or accessibility-adjacent work.

5. Ranked Comparison Table
Create a table with 20-30 rows ranked by closeness to our work.

Columns:
- Rank
- Paper
- Year
- Venue
- Link/DOI
- Category
- Main contribution
- Patient simulation? Yes/No/Partial
- AI agent? Yes/No/Partial
- Multi-agent? Yes/No/Partial
- Prediction/decision support? Yes/No/Partial
- Patient profiles generated? Yes/No/Partial
- Uses real clinical data? Yes/No/Partial
- Uses synthetic data? Yes/No/Partial
- Longitudinal modeling? Yes/No/Partial
- Patient-clinician interaction? Yes/No/Partial
- Used to test/evaluate another AI system? Yes/No/Partial
- Older-adult/4Ms relevance? Yes/No/Partial
- Health-literacy/behavior/accessibility variation? Yes/No/Partial
- Clinical validation? Yes/No/Partial
- Bias/fairness/safety evaluation? Yes/No/Partial
- Reusable dataset/code? Yes/No/Partial
- Key limitation
- How it could help our work
- Closeness to our work: High/Medium/Low
- Novelty gap relative to our work

6. Novel Research Opportunities
Propose 5-10 publishable directions. For each:
- Proposed contribution.
- Why it appears novel.
- Which prior work it extends.
- What experiment could demonstrate it.
- What evidence would make the claim strong.

7. Recommended Paper Positioning
Write 2-3 candidate positioning paragraphs using this structure:
- Unlike prior work that does X, our work does Y.
- Emphasize the combination of older-adult 4Ms questionnaire grounding, synthetic patient profiles, patient simulation, AI response evaluation, and safety/comprehension testing.
- Avoid overstating novelty beyond what the evidence supports.

8. Actionable Next Steps for Our Paper
Give specific next steps, such as:
- What simulation protocol to implement.
- What profile dimensions to include.
- What evaluation metrics to report.
- What baseline systems or prior papers to compare against.
- What claims are safe to make.
- What claims require more evidence.

Quality requirements:
- Use citations with links.
- Do not hallucinate citations.
- Mention uncertainty explicitly.
- Keep the final report useful for writing an academic related-work and novelty section.
- Make the final table compact but complete.
- End with the top 3 strongest novelty claims and the top 3 biggest risks to those claims.
```

