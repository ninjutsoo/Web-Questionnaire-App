# Phase 2 Issue Coverage Report

Source workbook: `C:/Users/mrosh/Downloads/RME WS Issue List.xlsx`

Implementation status: core Phase 2 clusters implemented. Auditor baseline came from a separate workbook-extraction sub-agent, then was checked against the local diff and verification commands.

Verification summary:

- `npm run lint`: Passes with 3 existing hook dependency warnings in `src/components/MedicationScanner.jsx`.
- `npm run build`: Passes.
- Local server: `http://127.0.0.1:5173/` returned HTTP `200`.
- Static checks: no questionnaire `Select` dropdowns remain; AI health tip removed; visible `More Questions`, `Dictate` / `Tap to Stop`, and `Send` labels are present.
- Browser automation note: `agent-browser` was not installed in PATH and bundled Playwright was incomplete, so full visual screenshot automation could not be run in this environment.

Firebase impact:

- No Firebase console or security-rule change is required by default.
- New optional medication details are stored under the existing `Answers/{uid}_4ms_health.responses.medication.medicationEntries` object. If deployed Firestore rules restrict nested response keys, allow authenticated owners to write `responses.medication.medicationEntries`.
- No backend/API deployment is required for native share, print, or download.

## Coverage Table

| Source sheet | Issue ID/topic | Priority | Original issue text | Cluster | Status | How addressed | Pages changed | Files edited | Verification | Auditor result |
|---|---|---|---|---|---|---|---|---|---|---|
| Web | 1 | Medium | Text size/contrast issue | 1 | Resolved | Added RME color tokens, 16px+ task text, stronger controls and section colors. | Global, `/` | `src/index.css`, `src/views/Landing.css` | Lint/build, token/static review | Pass |
| Web | 2 | Low | Get started and sign in can be vague | 2 | Resolved | CTAs now say `I'm New: Start Here` and `Returning User: Sign In`. | `/`, `/signin`, `/signup` | `src/views/Landing.jsx`, `src/views/login/Signin.jsx`, `src/views/Signup/Signup.jsx` | Text search | Pass |
| Web | 3 | Low | M blocks shift dynamically when moused over | 2 | Resolved | Informational cards no longer use misleading movement. | `/` | `src/views/Landing.css` | CSS review | Pass |
| Web | 4 | Medium | Links/buttons need outlining | 1, 2 | Resolved | Added outlined button/chip utility classes and accessible CTA styling. | Global, `/` | `src/index.css`, `src/views/Landing.css` | Lint/build | Pass |
| Web | 5 | High | Image has contrast/text size/eye pathing issues | 2 | Resolved | Landing is text-first; framework image hidden on small screens. | `/` | `src/views/Landing.jsx`, `src/views/Landing.css` | HTTP 200, CSS review | Pass |
| Web | 6 | Medium | 4x4 boxes confusing eye path | 2 | Resolved | 4M cards are numbered, stacked responsively, and text-first. | `/` | `src/views/Landing.jsx`, `src/views/Landing.css` | Static review | Pass |
| Web | 7 | High | Signup form is very dense | 3 | Resolved | Signup is a 5-step wizard with review step. | `/signup` | `src/views/Signup/Signup.jsx` | Lint/build | Pass |
| Web | 8 | Low | caregiver | 8 | Resolved | User-facing label remains `Caregiver`; fields use visible labels. | `/signup`, profile | `src/views/Signup/Signup.jsx`, `src/components/ProfileModal.jsx` | Text search | Pass |
| Web | 9 | Medium | Custom text sizing | 1, 3 | Partially resolved | Larger default type and controls added; no user text-size toggle added. | Global/auth | `src/index.css`, `src/views/Signup/Signup.jsx`, `src/views/login/Signin.jsx` | Lint/build | Pass |
| Web | 10 | Low | Mixed section colors | 1, 8 | Resolved | Shared section token map: Matters blue, Medication green, Mentation plum, Mobility orange. | Questionnaire/review | `src/constants/rmeDesign.js`, `src/views/Questionnaire/*` | Static review | Pass |
| Web | 11 | High | Contrast/text size issue | 1 | Resolved | Questionnaire header/card colors and text sizes updated. | `/questionnaire` | `src/views/Questionnaire/Questionnaire.jsx`, `src/views/Questionnaire/4msSection.jsx` | Build | Pass |
| Web | 12 | High | Buttons not outlined | 1, 4 | Resolved | Stepper, chips, bottom actions, listen, and drawer controls have outlines. | Global/questionnaire | `src/index.css`, `src/views/Questionnaire/Questionnaire.jsx` | Static review | Pass |
| Web | 13 | Critical | Navigation challenge | 4 | Resolved | Replaced top-tab-only pattern with guided sequence and bottom Back/Next/Save/Home. | `/questionnaire` | `src/views/Questionnaire/Questionnaire.jsx` | Build/static flow review | Pass |
| Web | 14 | Low | Random star | 4 | Resolved | Decorative star/icon header removed from section title pattern. | `/questionnaire` | `src/views/Questionnaire/4msSection.jsx` | Static review | Pass |
| Web | 15 | Medium | Listen button text small/location issue | 6 | Resolved | `Listen` is larger, outlined, and placed before question text. | `/questionnaire` | `src/components/SpeechReader.jsx`, `src/views/Questionnaire/4msSection.jsx` | Lint/build | Pass |
| Web | 16 | High | Dropdown difficult to navigate | 5 | Resolved | Questionnaire dropdowns replaced with large choice buttons/chips. | `/questionnaire` | `src/views/Questionnaire/4msSection.jsx` | `rg "<Select"` check | Pass |
| Web | 17 | Medium | Refresh button unlabeled | 9 | Resolved | AI refresh is visible `More Questions`. | `/ai-chatbot` | `src/components/AIChatbot.jsx` | Text search | Pass |
| Web | 18 | Medium | Dictation button unlabeled | 6, 9 | Resolved | AI and questionnaire voice controls show `Dictate` / `Tap to Stop`. | `/ai-chatbot`, `/questionnaire` | `src/components/AIChatbot.jsx`, `src/views/Questionnaire/4msSection.jsx` | Text search | Pass |
| Web | 19 | Medium | Send button unlabeled | 9 | Resolved | AI send control is visible text button `Send`. | `/ai-chatbot` | `src/components/AIChatbot.jsx` | Text search | Pass |
| Web | 20 | Low | Mind or mentation | 8 | Resolved | User-facing labels use `Mentation`; internal key stays `mind`. | 4M surfaces | `src/constants/rmeDesign.js`, `src/views/Landing.jsx`, `src/views/Questionnaire/*`, `src/services/questionnaireService.js` | Text/static review | Pass |
| Mobile | 5 | Medium | Share button | 7 | Resolved | Review has `Share Report`, `Print`, and `Download`. | Review | `src/views/Questionnaire/ReviewSubmit.jsx` | Static review | Pass |
| Mobile | 9 | High | Login button proposal | 2 | Resolved | Landing separates new and returning entry paths. | `/`, `/signin` | `src/views/Landing.jsx`, `src/views/login/Signin.jsx` | Text search | Pass |
| Mobile | 46314 | Low | Add branding/logo | 2 | Resolved | Logo/branding appears on landing/auth/header. | Landing/auth/header | `src/views/Landing.jsx`, `src/views/login/Signin.jsx`, `src/views/Signup/Signup.jsx`, `src/components/AppLayout.jsx` | Static review | Pass |
| Mobile | 46340 | Medium | Separate username/password screens | 3 | Partially resolved | Signin remains one screen but has visible labels, larger fields, and persistent errors. | `/signin` | `src/views/login/Signin.jsx` | Lint/build | Pass |
| Mobile | 12 | Medium | Dictation button for login? | 3, 6 | Resolved by exclusion | No auth dictation added; dictation limited to questionnaire/AI. | Auth/questionnaire | `src/views/login/Signin.jsx`, `src/views/Signup/Signup.jsx`, `src/views/Questionnaire/4msSection.jsx` | Static review | Pass |
| Mobile | 20 | Medium | Burger menu unlabeled, unoutlined | 1, 4 | Resolved | Mobile menu button visibly says `Menu` and is outlined. | Header | `src/components/AppLayout.jsx` | Static review | Pass |
| Mobile | 22 | Low | Unlabeled button | 1 | Resolved | Task-flow icon controls replaced/labeled. | Header/home/AI | `src/components/AppLayout.jsx`, `src/components/AIChatbot.jsx` | Static review | Pass |
| Mobile | 23 | High | Contrast/text size concern | 1 | Resolved | Global contrast/type/touch rules added. | Home/assessment | `src/index.css`, `src/views/Home.jsx`, `src/views/Questionnaire/*` | Lint/build | Pass |
| Mobile | 25 | High | Side menu needs safe out | 4 | Resolved | Drawer has visible `Close` and `Home`. | Drawer | `src/components/AppLayout.jsx` | Static review | Pass |
| Mobile | 26 | Medium | Highlighted menu text contrast | 1, 4 | Resolved | Drawer/header colors use dark token and outlines. | Drawer | `src/components/AppLayout.jsx`, `src/index.css` | Static review | Pass |
| Mobile | 27 | Medium | Logout contrast concern | 1, 4 | Resolved | Drawer logout is full-width high-contrast danger button. | Drawer | `src/components/AppLayout.jsx` | Static review | Pass |
| Mobile | 28 | Critical | M assessments Navigation issue | 4 | Resolved | Section stepper plus bottom action bar prevents hidden navigation. | `/questionnaire` | `src/views/Questionnaire/Questionnaire.jsx` | Static flow review | Pass |
| Mobile | 29 | Low | Listen button location | 6 | Resolved | Listen control moved before question text. | `/questionnaire` | `src/components/SpeechReader.jsx`, `src/views/Questionnaire/4msSection.jsx` | Static review | Pass |
| Mobile | 30 | Medium | Good voice input | 6 | Resolved | Dictation added to questionnaire free text and medication fields. | `/questionnaire` | `src/views/Questionnaire/4msSection.jsx` | Static review | Pass |
| Mobile | 31 | Medium | Contrast concern | 1 | Resolved | Accessible section palette and card borders applied. | `/questionnaire` | `src/index.css`, `src/views/Questionnaire/4msSection.jsx` | Build | Pass |
| Mobile | 101 | High | Add edit button | 7 | Resolved | Review rows include direct `Edit` buttons. | Review | `src/views/Questionnaire/ReviewSubmit.jsx`, `src/views/Questionnaire/Questionnaire.jsx` | Static review | Pass |
| Mobile | 32 | Medium | Contrast concer | 1 | Resolved | Same section/global contrast fix. | `/questionnaire` | `src/index.css`, `src/views/Questionnaire/4msSection.jsx` | Build | Pass |
| Mobile | 33 | Medium | Text explainer too much info | 4, 5 | Resolved | Dense section tips simplified. | `/questionnaire` | `src/views/Questionnaire/4msSection.jsx` | Static review | Pass |
| Mobile | 34 | Critical | Save/Share/Home/Next buttons | 4, 7 | Resolved | Bottom Back/Next/Save/Home; Share on review. | `/questionnaire` | `src/views/Questionnaire/Questionnaire.jsx`, `src/views/Questionnaire/ReviewSubmit.jsx` | Static flow review | Pass |
| Mobile | 201 | Critical | Mobile navigation | 4 | Resolved | Persistent bottom navigation added. | `/questionnaire` | `src/views/Questionnaire/Questionnaire.jsx` | Static flow review | Pass |
| Mobile | 50 | Medium | Contrast concerns | 1 | Resolved | Medication/questionnaire colors and controls updated. | `/questionnaire` | `src/index.css`, `src/views/Questionnaire/4msSection.jsx` | Build | Pass |
| Mobile | 51 | Critical | Dropdown box difficulty | 5 | Resolved | Medication category-first details plus no dropdowns. | `/questionnaire` | `src/views/Questionnaire/4msSection.jsx`, `src/services/questionnaireService.js` | `rg "<Select"` check | Pass |
| Mobile | 53 | High | Add edit button | 7 | Resolved | Review edit buttons navigate to relevant section/question. | Review | `src/views/Questionnaire/ReviewSubmit.jsx`, `src/views/Questionnaire/Questionnaire.jsx` | Static review | Pass |
| Mobile | 65 | High | Safe exits for questionnaires | 4, 7 | Resolved | Persistent Home and Save controls added. | `/questionnaire` | `src/views/Questionnaire/Questionnaire.jsx` | Static review | Pass |
| Mobile | 68 | Critical | Consider wizard for all questionnaires | 4, 5 | Resolved | Hybrid guided section flow with simplified cards and chips. | `/questionnaire` | `src/views/Questionnaire/Questionnaire.jsx`, `src/views/Questionnaire/4msSection.jsx` | Build | Pass |
| Mobile | 69 | High | Add edit button | 7 | Resolved | Direct edit buttons on review rows. | Review | `src/views/Questionnaire/ReviewSubmit.jsx` | Static review | Pass |
| Mobile | 72 | High | Tricky dropdown | 5 | Resolved | Mobility type is large single-choice buttons. | `/questionnaire` | `src/views/Questionnaire/4msSection.jsx` | `rg "<Select"` check | Pass |
| Mobile | 75 | Low | Review color scheme inaccurate | 1, 7 | Resolved | Review uses shared section color token map and text status. | Review | `src/views/Questionnaire/ReviewSubmit.jsx`, `src/constants/rmeDesign.js` | Static review | Pass |
| Mobile | 80 | Medium | Blank row; slide says dictation timeout too short | 6 | Resolved | Timeout extended to 12 seconds with explicit stop label. | Questionnaire/AI | `src/views/Questionnaire/4msSection.jsx`, `src/components/AIChatbot.jsx` | Text/static review | Pass |
| Mobile | 36 | Medium | Example share button screen | 7 | Resolved | Review report actions include share, print, download, home. | Review | `src/views/Questionnaire/ReviewSubmit.jsx` | Static review | Pass |
| Relevant literature | Button size |  | 44 by 44 target | 1 | Resolved | Global min touch target utility added. | Global | `src/index.css` | CSS review | Pass |
| Relevant literature | Button spacing |  | Older adults prefer spacing | 1 | Resolved | Chips/action bars use gaps and larger targets. | Global/questionnaire | `src/index.css`, `src/views/Questionnaire/*` | CSS review | Pass |
| Relevant literature | Outlining buttons |  | Flat design difficult for older adults | 1 | Resolved | Buttons/chips/CTAs are outlined. | Global | `src/index.css`, `src/views/Landing.css` | CSS review | Pass |
| Relevant literature | Use a wizard |  | Prefer wizard navigation | 3, 4, 5 | Resolved | Signup wizard and guided questionnaire flow. | Signup/questionnaire | `src/views/Signup/Signup.jsx`, `src/views/Questionnaire/Questionnaire.jsx` | Build | Pass |
| Relevant literature | Text contrast |  | 7:1 target | 1 | Resolved | Dark accessible palette applied. | Global | `src/index.css`, `src/constants/rmeDesign.js` | Static review | Pass |
| Relevant literature | Difficulty of dropdown menus |  | Dropdown recognition/dexterity issue | 5 | Resolved | Questionnaire dropdowns removed. | Questionnaire | `src/views/Questionnaire/4msSection.jsx` | `rg "<Select"` check | Pass |
| Relevant literature | Icon labels |  | Text alternatives | 1, 6, 9 | Resolved | Menu/listen/dictate/send/more controls visibly labeled. | Header/questionnaire/AI | `src/components/AppLayout.jsx`, `src/components/SpeechReader.jsx`, `src/components/AIChatbot.jsx` | Static review | Pass |
| Relevant literature | Icon labels duplicate row |  | Buttons need labels | 1, 6, 9 | Resolved | Same visible-label implementation retained. | Header/questionnaire/AI | Same as above | Static review | Pass |
| Relevant literature | Safe Exits/Safe outs |  | Provide safe exit | 4, 7 | Resolved | Home/Back/Save and drawer Close/Home added. | Drawer/questionnaire/review | `src/components/AppLayout.jsx`, `src/views/Questionnaire/*` | Static review | Pass |
| 421 Key Discussions | Differentiating without color |  | Differentiating without color | 1 | Resolved | Completion/selection uses text, outline, and status, not only color. | Questionnaire/review | `src/index.css`, `src/views/Questionnaire/*` | Static review | Pass |
| 421 Key Discussions | Get started/sign in buttons |  | Click/tap wording | 2 | Resolved | Labels avoid click/tap and distinguish user state. | `/` | `src/views/Landing.jsx` | Text search | Pass |
| 421 Key Discussions | Care partner/caregiver/caretaker |  | Terminology decision | 8 | Resolved | `Caregiver` used in user-facing fields. | Auth/profile | `src/views/Signup/Signup.jsx`, `src/components/ProfileModal.jsx` | Text search | Pass |
| 421 Key Discussions | Text size adjuster option |  | Text size option | 1, 3 | Partially resolved | Larger default text implemented; adjustable setting deferred. | Global/auth | `src/index.css`, auth files | Lint/build | Pass |
| 421 Key Discussions | Listen button |  | Listen button | 6 | Resolved | Larger, labeled `Listen` control. | Questionnaire | `src/components/SpeechReader.jsx` | Static review | Pass |
| 421 Key Discussions | Listen and response option |  | Listen and response option | 6 | Resolved | Listen plus Dictate pattern on questionnaire text inputs. | Questionnaire | `src/views/Questionnaire/4msSection.jsx` | Static review | Pass |
| 421 Key Discussions | Bottom nav/completed/next |  | Move nav buttons to bottom | 4 | Resolved | Bottom action bar and section stepper with completion text. | Questionnaire | `src/views/Questionnaire/Questionnaire.jsx` | Static review | Pass |

## Slide-Only Mobile AI/Voice Items

| Slide issue | Status | How addressed | Files edited | Auditor result |
|---|---|---|---|---|
| Mobile slide 34 issue 76: remove tip | Resolved | Removed `Health Tip of the Day`. | `src/components/AIChatbot.jsx` | Pass |
| Mobile slide 34 issue 77: label more questions | Resolved | Refresh button is visible `More Questions`. | `src/components/AIChatbot.jsx` | Pass |
| Mobile slide 34 issue 78: label dictation | Resolved | Voice control is `Dictate` / `Tap to Stop`. | `src/components/AIChatbot.jsx` | Pass |
| Mobile slide 34 issue 79: label send | Resolved | Send control is visible `Send`. | `src/components/AIChatbot.jsx` | Pass |
| Mobile slide 33 issue 81: timeout/stop | Resolved | Voice idle timeout is 12 seconds and explicit stop is available. | `src/components/AIChatbot.jsx`, `src/views/Questionnaire/4msSection.jsx` | Pass |
