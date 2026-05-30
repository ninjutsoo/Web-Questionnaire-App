# Phase 2 Clustered Implementation Plan

## 1. Purpose

This document is the implementation-ready Phase 2 plan for the Web Questionnaire App accessibility, mobile, web, and questionnaire redesign work.

The plan is organized by systemic issue clusters, not by raw issue order. The goal is to solve groups of spreadsheet and slide issues through shared design, shared components, and flow-level fixes rather than isolated one-off patches.

No implementation has been performed as part of this file creation.

## 2. Sources Reviewed

### Workbook

Source file: `C:/Users/mrosh/Downloads/RME WS Issue List.xlsx`

Sheets reviewed:

| Sheet | Rows reviewed | Notes |
|---|---:|---|
| `Mobile` | 30 issue rows | Main mobile issue list. Some issue IDs are malformed Excel date serials. |
| `Web` | 20 issue rows | Main web issue list. |
| `Relevant literature` | 9 reference rows | Supports button size, spacing, outlines, wizard flows, contrast, dropdown avoidance, icon labels, and safe exits. |
| `421 Key Discussions` | 6 discussion rows | Captures unresolved product decisions such as tap/click labels, caregiver terms, text sizing, listen controls, and bottom navigation. |

### Web Deck

Source file: `C:/Users/mrosh/Downloads/WS Web.pptx`

Slides reviewed: 23 slides.

Major topic areas:

| Slides | Topic |
|---|---|
| 1-2 | Intro and review assumptions. |
| 3-5 | Older-adult cognitive, physical, eyesight, peripheral-vision, and dexterity considerations. |
| 6-9 | Button, text, layout, wizard, safe-exit, and color guidance. |
| 11-12 | Landing page, CTA wording, repeated content, image readability, and 4M card layout. |
| 13-14 | Signup wizard and text size adjustment. |
| 15-18 | Section color consistency, questionnaire navigation, listen placement, dropdown replacement, and wizard examples. |
| 19-20 | AI assistant controls: more questions, dictation, send. |
| 21 | Signup error persistence and placement. |
| 22 | Terminology, text size, non-color differentiation, listen, and dictation discussion. |
| 23 | Blank. |

### Mobile Deck

Source file: `C:/Users/mrosh/Downloads/RME WS Mobile.pptx`

Slides reviewed: 36 slides. Slides 35-36 are blank.

Major topic areas:

| Slides | Topic |
|---|---|
| 1-3 | Intro and Mind vs Mentation discussion. |
| 4-8 | Intro screen, share proposal, mobile readability, tappable affordances. |
| 9-14 | Login, split login proposal, signup wizard, persistent signup errors. |
| 15-16 | Home screen, burger menu labeling, drawer safe-out, menu/logout contrast. |
| 17-20 | Matters section navigation, listen, voice input, edit button, safe exits, bottom controls. |
| 21-26 | Medication dropdown difficulty, medication wizard proposal, dictation, edit, safe exits. |
| 27-31 | Mentation and Mobility wizard/button proposals and safe exits. |
| 32 | Review screen contrast and section color consistency. |
| 33 | Voice input timeout and clearer `Tap to stop` button. |
| 34 | AI screen: remove tip, label more questions, dictation, and send. |

### Codebase

Repository: `C:/Users/mrosh/OneDrive/Documents/GitHub/Web-Questionnaire-App`

Primary files inspected:

| Area | Files |
|---|---|
| Routing | `src/App.jsx` |
| Shared authenticated layout | `src/components/AppLayout.jsx` |
| Landing | `src/views/Landing.jsx`, `src/views/Landing.css` |
| Auth | `src/views/login/Signin.jsx`, `src/views/Signup/Signup.jsx`, `src/services/authService.js`, `src/components/ProfileModal.jsx` |
| Home | `src/views/Home.jsx` |
| Questionnaire | `src/views/Questionnaire/Questionnaire.jsx`, `src/views/Questionnaire/4msSection.jsx`, `src/views/Questionnaire/ReviewSubmit.jsx`, `src/services/questionnaireService.js` |
| Voice/read aloud | `src/components/SpeechReader.jsx`, speech recognition logic in `4msSection.jsx` and `AIChatbot.jsx` |
| AI chat | `src/components/AIChatbot.jsx`, `src/services/apiClient.js`, `functions/index.js` |
| Medication scanning | `src/components/MedicationScanner.jsx`, `src/services/drugLookupService.js` |
| Global styles | `src/index.css`, `src/App.css` |

Routes inspected:

| Route | Surface |
|---|---|
| `/` | Landing |
| `/signin` | Returning-user sign in |
| `/signup` | New-user signup |
| `/home` | Dashboard |
| `/questionnaire` | 4Ms questionnaire and review |
| `/migration` | Migration page |
| `/ai-chatbot` | AI assistant |

## 3. Locked User Decisions

The user answered the Phase 1 questions as follows. These decisions are binding for the implementation plan.

| Decision area | User answer | Applied interpretation |
|---|---|---|
| Questionnaire model | `B`, if it addresses all issues | Use a hybrid guided questionnaire: section-level sequence plus bottom navigation and question-level simplification. Do not keep the current top-tab-only model. |
| Web/mobile relationship | `A` | Share behavior and data model. Use responsive platform-specific layouts because web has more space and mobile must be efficient for older adults. |
| Color/format/size | Follow exact coloring, format, and size mentioned in slides | Use slide 7 and slide 9 as design-system requirements: 7:1 target, outlined interactables, visible labels, 11.5mm/44px minimum targets, preferred spacing, and the slide color palette. |
| Slide proposals | `B` | Treat mockups as strong examples, not pixel-perfect mandates. Also use workbook and literature evidence. |
| Share model | `B` | Use native share when supported, with print/download fallback. Do not build provider portal or backend sending in this pass. |
| Medication specificity | `C` | Category-first medication flow with optional exact name/dose/frequency details. |
| Dropdowns | Choose best because dropdowns are hard for older adults | Remove dropdowns/selects from questionnaire interactions. Replace with large buttons/chips and step-by-step patterns. |
| Persistent controls | Use best decision based on all slides and knowledge | Persistent questionnaire bottom controls should include `Back`, `Next`, `Save`, and `Home`. `Share` should be prominent on review/report screens, not always present in the main action bar. |
| Dictation auth | Not for login or signup. Use for questions, especially medication part-by-part. | Do not add login/signup dictation. Add dictation to questionnaire free-text fields and medication wizard steps. |
| Voice timeout/testing | Thorough plan and testing | Add explicit `Tap to stop`, longer idle timeout, unsupported-browser messaging, and a detailed test matrix. |
| Terminology | `mentation` and `caregiver` | Use `Mentation` and `Caregiver` in user-facing UI. Preserve internal keys if possible. |
| Redesign depth | `B`, but address all medium/important and simple requested removals | Medium clustered redesign. Address all critical, high, and medium workbook rows. Also handle simple low issues when bundled with clusters. Remove unused/confusing icons/buttons. |

## 4. Decision-Complete Design Rules

### 4.1 Color Token Map

The slides contain one important color conflict:

| Evidence | Text |
|---|---|
| Web workbook issue 10 and web slide 15 | Matters should be blue and Medication should be green. |
| Mobile slide 32 | Review colors should align with previous colors, examples include Green for Mind and Blue for Mobility. |
| Web slide 9 | Provides accessible palette: Medium Blue `#003366`, Clinical Green `#005522`, Deep Maroon `#8B0000`, Royal Plum `#4B0082`, Dark Teal `#005A5A`, Burnt Orange `#8B4000`, followed by labels `Mind Matters Mobility Medication Alerts Buttons`. |

Final implementation decision:

| Semantic use | Token | Reason |
|---|---|---|
| What Matters | `#003366` Medium Blue | Directly required by web issue 10: Matters blue. |
| Medication | `#005522` Clinical Green | Directly required by web issue 10: Medication green. |
| Mentation | `#4B0082` Royal Plum | Best accessible match for mental/cognitive section and current app's purple mental-wellbeing association. User selected `Mentation`, not `Mind`. |
| Mobility | `#8B4000` Burnt Orange | Best accessible warm movement/action color from slide palette. |
| Review/Share | `#005A5A` Dark Teal | Distinct review/report action color from slide palette. |
| Alerts/errors | `#8B0000` Deep Maroon | Explicit alert-like accessible color from slide palette. |
| Primary buttons | Use section color for section actions; use `#005A5A` for global review/share; use dark neutral for utility actions | Avoid low-contrast bright AntD defaults. |

Rules:

- Use white text only where contrast meets the slide target.
- Do not use color alone to indicate completion, selection, errors, or section identity.
- Selected states must include at least two cues: outline, check/label, text, icon, or shape.
- Existing bright colors such as `#1890ff`, `#52c41a`, `#13c2c2`, and `#fa541c` should not be used as white-text backgrounds for normal text unless contrast passes.

### 4.2 Typography and Touch Rules

Use slide 7 as the governing rule set.

| Item | Required behavior |
|---|---|
| Body text | Minimum 16px; prefer 18px on task-critical questionnaire/auth text. |
| Helper/explainer text | Minimum 16px if it must be read; otherwise remove/simplify. |
| Button/control text | Minimum 16px. |
| Tiny labels | Avoid 10-13px labels currently used in listen/chat/helper text. |
| Touch target | Minimum 44px or 11.5mm equivalent. |
| Spacing | Minimum 3.17mm equivalent; prefer 6mm equivalent between controls on touch surfaces. |
| Focus | Visible `:focus-visible` ring for keyboard users. |
| Icons | All icons/symbols must be labeled with text or have an accessible name. For older-adult task flows, visible label is preferred. |

### 4.3 Interaction Rules

| Pattern | Final rule |
|---|---|
| Dropdowns | Do not use for questionnaire choices. Use chips/buttons and wizard steps. |
| Auth dictation | Do not provide dictation for login/signup credentials or profile fields. |
| Questionnaire dictation | Provide on free-text questionnaire fields and medication wizard steps. |
| Listen/read aloud | Place before or near the question text, not after a dense title, and keep visible label `Listen`. |
| Safe exit | `Home` must be available in the same bottom position during questionnaire flow. Drawer must have visible close/back safe-out. |
| Save | Always visible in questionnaire bottom action bar. Save feedback must persist long enough to be noticed. |
| Share | Available from review/report screen. Use native share if supported; otherwise print/download. |
| Edit | Direct edit buttons must navigate to the relevant section/question, not just show a message. |

## 5. Architecture Summary

### Current State

- Vite React app using Ant Design.
- Most page styling is inline or in `Landing.css`.
- Auth uses Firebase Auth and Firestore `Users`.
- Questionnaire source data loads from Firestore `Questions/4ms_health`.
- User answers persist to Firestore `Answers/{uid}_4ms_health`.
- Questionnaire section components keep local state and expose `getCurrentData()` through refs.
- AI chat uses local state/localStorage, questionnaire context, and Firebase Functions API calls.

### Key Existing Risks

| Risk | Current evidence | Plan response |
|---|---|---|
| `ReviewSubmit` save prop mismatch | Parent passes `onSave`; child expects `onFinalSubmit`. | Fix as part of review/save cluster. |
| Unsaved local changes may not appear in review | Parent review receives `responses`, but live child refs may contain newer data. | Collect current ref data before review and before share/save. |
| Inline styles make global accessibility hard | Many colors/sizes are local inline styles. | Add shared tokens/helpers first, then refactor high-impact surfaces. |
| Dropdowns are embedded in generic `tag_text` renderer | `4msSection.jsx` uses AntD `Select`. | Replace generic rendering with chip/button component for all questionnaire choices. |
| Voice code duplicated | Speech recognition exists in `4msSection.jsx` and `AIChatbot.jsx`. | Extract or at minimum align constants/behavior for timeout, stop, and labels. |
| Internal labels differ from requested terms | `mind` key and `Mind` label exist. | Keep internal key; show `Mentation` user-facing. |

## 6. Implementation Clusters

## Cluster 1: Global Accessibility and Design-System Baseline

### User Decision Applied

Follow slide color, format, and size requirements. Medium redesign is allowed. All simple requested accessibility fixes are in scope.

### Underlying Problem

The app lacks a coherent accessibility/design system. Colors, button affordances, text sizes, focus states, icon labels, spacing, and touch target sizes are defined ad hoc across inline styles. This creates many repeated issues: contrast complaints, unlabeled buttons, small labels, unclear button affordance, and color inconsistency.

### Related Workbook Issues

- Web: 1, 4, 10, 11, 12, 15, 17, 18, 19
- Mobile: 20, 22, 23, 26, 27, 31, 32, 50, 75
- Relevant literature: Button size, button spacing, outlining buttons, text contrast, icon labels
- 421 Key Discussions: Text size adjuster, listen button, bottom navigation buttons

### Related Slides

- Web: 7, 9, 11, 12, 15, 16, 20, 22
- Mobile: 4, 5, 8, 15, 16, 17, 21, 32, 34

### Affected Surfaces

- Landing
- Auth pages
- App header and drawer
- Home
- Questionnaire
- Review
- AI chat
- Share/report screen

### Affected Files

| File | Planned changes |
|---|---|
| `src/index.css` | Add design tokens, focus styles, global button/control target rules, utility classes. |
| `src/App.css` | Keep root layout only unless global app styles are needed. |
| `src/views/Landing.css` | Replace low-contrast purple/blue defaults with accessible tokens. |
| `src/components/AppLayout.jsx` | Use accessible header/drawer colors, labeled menu button, larger targets. |
| `src/views/Home.jsx` | Replace low-contrast text/colors and emoji/mojibake if visible. |
| `src/views/Questionnaire/Questionnaire.jsx` | Use section token map for navigation/progress/action bar. |
| `src/views/Questionnaire/4msSection.jsx` | Use tokens for section headers, cards, chips, voice/listen controls. |
| `src/views/Questionnaire/ReviewSubmit.jsx` | Use section token map and non-color-only status. |
| `src/components/AIChatbot.jsx` | Replace icon-only/small controls with labeled accessible buttons. |
| `src/components/SpeechReader.jsx` | Enforce minimum size and visible label. |

### Final Behavior

- All user-facing task controls are visibly labeled.
- All interactive controls have a visible outline or clear button boundary.
- Minimum touch target is 44px.
- Main task text is 16-18px minimum.
- Focus ring is visible and high-contrast.
- Color is never the only meaning carrier.
- Section colors are consistent across header, questionnaire, review, and share/report.

### Technical Implementation Steps

1. Define CSS custom properties in `src/index.css`:
   - `--rme-matters: #003366`
   - `--rme-medication: #005522`
   - `--rme-mentation: #4B0082`
   - `--rme-mobility: #8B4000`
   - `--rme-review: #005A5A`
   - `--rme-alert: #8B0000`
   - neutral text/background/border tokens
   - focus ring token
   - minimum tap size token
2. Add global utility classes:
   - `.rme-button`
   - `.rme-button-secondary`
   - `.rme-button-danger`
   - `.rme-chip`
   - `.rme-chip-selected`
   - `.rme-action-bar`
   - `.rme-visually-hidden`
3. Add global focus styling:
   - `button:focus-visible`
   - `a:focus-visible`
   - `[role="button"]:focus-visible`
   - `.ant-btn:focus-visible`
   - `.ant-tabs-tab:focus-visible`
4. Replace bright low-contrast button backgrounds in high-impact files.
5. Create a local section config object with final token map and reuse in `Questionnaire.jsx`, `4msSection.jsx`, and `ReviewSubmit.jsx`.
6. Check all controls currently smaller than 44px:
   - AI chat action buttons currently shrink to 32px on narrow screens.
   - Listen button has small text and no explicit 44px min-height.
   - Drawer logout is text-style and should become a full-width button.
   - Quick-question tags are clickable tags and should become buttons.

### Accessibility Requirements

- Contrast: verify white text on every section color.
- Keyboard: every interactive control reachable by Tab and has visible focus.
- Screen reader: controls have accessible names; progress and save status use `aria-live`.
- Touch: controls >= 44px with sufficient spacing.
- Error/status: never toast-only for task-critical validation.

### Responsive/Mobile Requirements

- Use one-column layouts on mobile.
- Avoid text embedded in images.
- Avoid small inline controls next to dense copy.
- Sticky bottom action bar must not cover content; add bottom padding equal to action bar height.

### Risks

- Ant Design inline styles may override CSS tokens.
- Some contrast fixes require changing existing visual style more than small patches.
- Overriding AntD globally can have broad effects; prefer scoped class names for app-specific controls.

### Verification Steps

- Run contrast checks on landing hero, section nav, questionnaire cards, review cards, drawer, AI buttons.
- Keyboard walkthrough:
  - Landing CTA
  - Signin
  - Signup wizard
  - Drawer
  - Questionnaire chips/action bar
  - Review edit/share
  - AI chat controls
- Mobile viewport checks:
  - 320px, 375px, 390px, 414px, 768px.
- Confirm no icon-only controls remain in older-adult task flows unless space requires it and `aria-label` exists.

### Expected Issues Resolved

W1, W4, W10, W11, W12, W15, W17, W18, W19, M20, M22, M23, M26, M27, M31, M32, M50, M75.

---

## Cluster 2: Landing, Branding, and First-Time vs Returning-User Entry

### User Decision Applied

Use slide proposals as strong examples and implement edits that make sense based on evidence. Keep shared behavior but responsive layouts.

### Underlying Problem

The landing page does not clearly distinguish first-time and returning users. The framework image and 4M cards create repeated content and eye-path issues, especially on mobile. Some hover behavior implies interactivity when content is informational.

### Related Workbook Issues

- Web: 2, 3, 4, 5, 6
- Mobile: 9, 46314, 36 partially

### Related Slides

- Web: 11, 12
- Mobile: 4, 5, 6, 7, 8, 9

### Affected Surfaces

- `/`
- `/signin`
- `/signup`
- `/home`
- App header branding

### Affected Files

| File | Planned changes |
|---|---|
| `src/views/Landing.jsx` | CTA labels, remove/de-emphasize redundant image, revise 4M card content. |
| `src/views/Landing.css` | Mobile layout, contrast, button outlines, remove non-action hover motion. |
| `src/views/login/Signin.jsx` | Consistent logo/branding and returning-user framing. |
| `src/views/Signup/Signup.jsx` | Consistent logo/branding and first-time-user framing. |
| `src/components/AppLayout.jsx` | Header/drawer branding consistency. |
| `src/views/Home.jsx` | Branding consistency and accessible welcome/dashboard text. |

### Final Behavior

- Landing page primary choice:
  - `I'm New: Start Here`
  - `Returning User: Sign In`
- Buttons are large, outlined, high-contrast, and clearly clickable.
- 4M informational cards do not move on hover unless they are links/buttons.
- Image with small embedded text is removed on mobile or replaced with text cards.
- Branding/logo appears consistently on landing, signin, signup, and authenticated layout.

### Technical Implementation Steps

1. Update `Landing.jsx` CTA button text:
   - `Get Started` -> `I'm New: Start Here`
   - `Sign In` -> `Returning User: Sign In`
2. Add explanatory helper text under each CTA:
   - New users: create account and start assessment.
   - Returning users: continue or review saved assessment.
3. Replace the image-dependent `What are the 4Ms?` section with text-first cards on mobile.
4. Keep a desktop image only if:
   - It is not required to understand the page.
   - It has descriptive adjacent text.
   - It does not duplicate small unreadable text.
5. Remove hover `transform` from informational cards and framework image.
6. If a card is made interactive, convert it to a real button/link and outline it.
7. Add consistent logo sizing and alt text on signin/signup/home.

### Accessibility Considerations

- CTA buttons should be first meaningful actions after page heading.
- Button text must make destination clear without surrounding context.
- Image alt text should not replace necessary visible text.
- No small text inside required images.

### Responsive/Mobile Considerations

- Mobile landing should prioritize:
  - App name
  - One-sentence purpose
  - New/returning choice
  - Simple 4M explanation
  - Share/report promise
- Cards stack vertically.
- Buttons full width or near full width with at least 44px height.

### Risks

- Removing/de-emphasizing the image changes visual identity. Keep logo/branding to compensate.

### Verification Steps

- Confirm mobile landing does not require pinch/zoom to read image text.
- Confirm CTA labels match user request and slides.
- Confirm non-interactive 4M cards do not animate like buttons.
- Keyboard test CTA order.

### Expected Issues Resolved

W2, W3, W4, W5, W6, M9, M46314. M36 is partially supported through report/share entry points; full handling is in Cluster 7.

---

## Cluster 3: Auth Flow, Signup Density, and Persistent Error Recovery

### User Decision Applied

No dictation for login or signup. Keep `Caregiver`. Medium redesign is acceptable.

### Underlying Problem

Signup is dense and scroll-heavy. Login can be clearer on mobile. Errors are transient and may appear away from the user's point of focus. Auth fields rely heavily on placeholders instead of persistent visible labels.

### Related Workbook Issues

- Web: 7, 8, 9
- Mobile: 46340, 12
- 421 Key Discussions: text size adjuster, caregiver/care partner decision

### Related Slides

- Web: 13, 14, 21, 22
- Mobile: 10, 11, 12, 13, 14

### Affected Surfaces

- `/signin`
- `/signup`
- Firebase user profile creation

### Affected Files

| File | Planned changes |
|---|---|
| `src/views/login/Signin.jsx` | Improve labels, persistent errors, optional mobile sequential panels, no dictation. |
| `src/views/Signup/Signup.jsx` | Convert to wizard, persistent validation, visible labels, no dictation. |
| `src/services/authService.js` | Keep payload compatibility; improve error messages if needed. |
| `src/components/ProfileModal.jsx` | Keep `Caregiver` wording and consistent field labeling. |

### Final Behavior

#### Signin

- Returning-user screen shows:
  - Logo
  - Heading: `Returning User Sign In`
  - Field 1: `Email or Username`
  - Field 2: `Password`
  - Actions: `Sign In`, `Forgot Password`, `I'm New: Create Account`
- Mobile may use two visual panels if needed:
  - Step 1: Email or username
  - Step 2: Password
- No dictation buttons.
- Errors persist inline until corrected.

#### Signup

Signup becomes a step-based form:

| Step | Fields | Notes |
|---|---|---|
| 1. Your Name | First name, last name | Visible labels and short helper text. |
| 2. Contact | Email, phone | Persistent validation. |
| 3. Account | Username, password, confirm password | Password rules visible before error. |
| 4. Profile | Age, caregiver email optional | Use `Caregiver Email (Optional)`. |
| 5. Review | Summary and create account | Edit step links. |

Navigation:

- `Back`
- `Next`
- `Create Account` on final step
- `Already have an account? Sign In`

### Technical Implementation Steps

1. Replace single dense `LoginForm` signup layout with local step state.
2. Keep using existing `signUpWithEmail(payload)`.
3. Preserve validation rules:
   - required fields
   - email format
   - 10-digit phone
   - age 1-120
   - password min 6
   - password match
4. Replace `ToastContainer autoClose=3000` dependency for validation with:
   - persistent inline field errors
   - step-level error summary
   - `aria-live="assertive"` for validation summary
5. Keep success toast/message acceptable after account creation, but also show persistent success if navigation is delayed.
6. Do not add dictation controls.
7. Ensure `Caregiver` label is consistent.

### Accessibility Considerations

- Every field must have a visible label.
- Error text must be next to field and summarized at step top.
- Focus moves to first invalid field on failed submit.
- Wizard step indicator must announce current step.

### Responsive/Mobile Considerations

- One field group per mobile screen.
- Sticky bottom auth wizard controls only if they do not cover fields.
- Avoid background image if it reduces readability.

### Risks

- Ant Design Pro `LoginForm` may be less suitable for custom wizard. If necessary, use AntD `Form` directly for signup.
- Firebase uniqueness checks happen at final submit; if a duplicate is found, focus should return to the relevant step.

### Verification Steps

- Signup incomplete fields.
- Password mismatch.
- Invalid email.
- Invalid phone.
- Duplicate username/email/phone, if test data allows.
- Mobile keyboard does not hide active buttons.
- No dictation buttons on auth.

### Expected Issues Resolved

W7, W8, W9, M46340, M12.

---

## Cluster 4: Hybrid Questionnaire Navigation, Orientation, and Safe Exits

### User Decision Applied

Use hybrid model. Choose best control set based on all slides: persistent `Back`, `Next`, `Save`, and `Home`; `Share` on review/report.

### Underlying Problem

The current questionnaire is a top-tabbed interface with a floating save button. On mobile, users may not realize sections can be swiped or selected, and users reaching the bottom must scroll back to navigate. Safe exits are inconsistent.

### Related Workbook Issues

- Web: 13, 14
- Mobile: 25, 28, 34, 201, 65, 68
- Relevant literature: Use a wizard, safe exits
- 421 Key Discussions: Move navigation buttons to bottom

### Related Slides

- Web: 8, 16, 17, 18
- Mobile: 16, 17, 18, 19, 20, 26, 27, 29, 31

### Affected Surfaces

- `/questionnaire`
- Drawer navigation
- Review screen

### Affected Files

| File | Planned changes |
|---|---|
| `src/components/AppLayout.jsx` | Drawer `Back/Close Menu`, `Home`, labeled menu button. |
| `src/views/Questionnaire/Questionnaire.jsx` | Section index state, bottom action bar, save-before-navigation, section indicator. |
| `src/views/Questionnaire/4msSection.jsx` | Accept focus target/question target props, simplify content for guided flow. |
| `src/views/Questionnaire/ReviewSubmit.jsx` | Direct edit actions and save/share integration. |

### Final Behavior

Questionnaire sections:

1. `Matters`
2. `Medication`
3. `Mentation`
4. `Mobility`
5. `Review`

Header/orientation:

- Desktop: section steps visible with labels and numbers.
- Mobile: compact indicator such as `2. Medication` with left/right arrows and progress.

Bottom action bar:

| Button | Behavior |
|---|---|
| `Back` | Moves to previous section or previous question group where applicable. Disabled on first section or returns to Home depending final route context. |
| `Next` | Saves/stages current section and moves forward. On last section, moves to Review. |
| `Save` | Saves all current section refs and displays persistent confirmation. |
| `Home` | Safe exit. Saves first or asks user to save/discard if unsaved changes are detected. |

Review/report actions:

- `Edit`
- `Save Assessment`
- `Share Report`
- `Home`

Drawer:

- Menu button visibly labeled `Menu`.
- Drawer top includes `Close Menu` or `Back`.
- Drawer includes `Home`.
- Logout is high contrast and full-width.

### Technical Implementation Steps

1. In `Questionnaire.jsx`, replace `activeTab`-only model with a section sequence array:
   - `matters`
   - `medication`
   - `mind`
   - `mobility`
   - `review`
2. Continue using key `mind` internally, but display `Mentation`.
3. Create helper functions:
   - `getCurrentLiveResponses()`
   - `saveAllCurrentResponses()`
   - `goToSection(sectionKey)`
   - `goNext()`
   - `goBack()`
   - `goHomeSafely()`
4. Before moving to review, collect current child refs so review reflects unsaved local edits.
5. Add sticky/fixed bottom action bar for questionnaire sections.
6. Add content bottom padding to avoid overlap.
7. Keep progress but make text clearer:
   - `Section 2 of 5: Medication`
   - `3 of 5 questions answered`
8. Replace current top tab card styling with accessible step buttons on desktop and compact section switcher on mobile.
9. Remove or label random star in section header:
   - If decorative, remove.
   - If section icon, label through visible section title and hide icon from screen reader.

### Accessibility Considerations

- Section changes should move focus to the new section heading.
- Step controls must be keyboard reachable.
- Current section must be announced with text, not only color.
- Save status must use `aria-live="polite"`.

### Responsive/Mobile Considerations

- Bottom action bar uses 2x2 grid if four buttons do not fit in one row.
- Avoid horizontal scrolling tabs on mobile.
- Section stepper should not require swipe discovery.

### Risks

- Saving on navigation can increase Firestore writes. Mitigate by saving only changed sections or retaining manual Save while staging local state.
- Fixed bottom bar can cover content if bottom padding is missed.

### Verification Steps

- Mobile: navigate from Matters to Review without scrolling to top.
- Desktop: navigate by section stepper and bottom controls.
- Save, then reload and confirm answers persist.
- Home safe exit from middle section.
- Drawer open/close with keyboard and touch.

### Expected Issues Resolved

W13, W14, M25, M28, M34, M201, M65, M68.

---

## Cluster 5: Questionnaire Input Redesign Without Dropdowns

### User Decision Applied

Remove dropdowns because they are hard for older adults. Medication is category-first with optional exact details. Use dictation for questionnaire fields, especially medication part-by-part.

### Underlying Problem

The current `FourMSection` renderer uses Ant Design `Select` for multiple tag questions and mobility type. Dropdowns hide options, create small targets, and are difficult on mobile. Medication needs a structured but low-burden entry path.

### Related Workbook Issues

- Web: 16
- Mobile: 51, 72
- Related: M68 because wizard-like inputs reduce cognitive load
- Relevant literature: Difficulty of dropdown menus

### Related Slides

- Web: 16, 18
- Mobile: 21, 22, 23, 24, 25, 26, 30

### Affected Surfaces

- Matters questions
- Medication questions
- Mentation questions
- Mobility questions

### Affected Files

| File | Planned changes |
|---|---|
| `src/views/Questionnaire/4msSection.jsx` | Replace `Select` with chip/button groups and medication wizard. |
| `src/services/questionnaireService.js` | Adjust default question metadata only if needed for medication exact details. |
| `src/components/MedicationScanner.jsx` | Ensure scanner output populates medication detail step, not a dense free-text field only. |
| `src/services/drugLookupService.js` | No required change unless exact medication lookup is integrated more deeply. |

### Final Behavior

#### Generic `tag_text` Questions

- Options render as large chips/buttons.
- Multi-select by tapping chips.
- Selected chips show:
  - thick outline
  - selected label
  - check icon or `Selected` text
  - accessible `aria-pressed`
- `Other` chip reveals an additional text field.
- Additional detail text field remains available where clinically useful.

#### Mobility Type

- Replace dropdown with single-choice buttons:
  - `Bedrest`
  - `Walker`
  - `Wheelchair`
  - `Independent`
- Selected mobility type reveals tips below in readable large text.

#### Medication

Medication becomes a category-first mini-flow:

| Medication step | UI | Stored data |
|---|---|---|
| Overview | Existing medication entries list, `Add Medication`, `Remove Medication` | Medication list or existing category response. |
| Category | Large chips: Blood Pressure, Diabetes, Heart, Pain, Dementia Medication, Mental Health, Other | Category tag. |
| Name | Optional text field plus `Dictate`, scanner if applicable | Optional exact medication name. |
| Dose | Optional text field plus `Dictate` | Optional dose. |
| Frequency | Optional text field plus `Dictate` | Optional frequency. |
| Notes | Optional notes/concerns, side effects, cost, missed doses | Existing `tag_text` concerns plus details. |

Minimum viable implementation:

- Preserve existing broad question structure.
- Add optional detail inputs inside medication question cards.
- Avoid a backend migration unless a nested medication list is explicitly needed.

Better medium implementation:

- Store medication entries under an optional medication-specific response object:
  - `responses.medication.medicationEntries = [{ category, name, dose, frequency, notes }]`
- Keep old category questions for compatibility and display both old and new answers in review.

### Technical Implementation Steps

1. Create reusable `ChoiceButtonGroup` inside `4msSection.jsx` or a new component file if implementation scope allows.
2. Replace `Select mode="multiple"` for `tag_text` with `ChoiceButtonGroup multiple`.
3. Replace `Select` for `mobility_type` with `ChoiceButtonGroup single`.
4. Add `aria-pressed` to choice buttons.
5. Add keyboard support:
   - Tab to buttons.
   - Enter/Space toggles.
6. Add medication-specific renderer:
   - Detect `section === "medication"`.
   - Render category-first flow for medication questions.
7. Add `Dictate` buttons to medication name/dose/frequency/notes fields.
8. Review screen must render chips and medication details clearly.

### Accessibility Considerations

- Use real `<button>` elements for choices.
- Avoid clickable `Tag` components unless rendered as buttons.
- Field groups should have headings/legends.
- Selected state must be announced.

### Responsive/Mobile Considerations

- Chips wrap vertically.
- On narrow screens, each chip can become full-width.
- Medication wizard steps use one main task per screen/card.

### Risks

- Changing response shape can affect saved answer review and AI context.
- If a new `medicationEntries` shape is added, `getUserQuestionnaireContext` must be updated.
- Backward compatibility must render old saved data.

### Verification Steps

- Select/deselect multiple tags with mouse, keyboard, and touch.
- Confirm no questionnaire dropdown remains.
- Add medication category only.
- Add medication with category, name, dose, frequency.
- Use dictation in medication fields.
- Review displays medication details.
- Save/reload keeps medication entries.

### Expected Issues Resolved

W16, M51, M72, and part of M68.

---

## Cluster 6: Voice, Listen, Dictation, and AI Control Affordances

### User Decision Applied

No auth dictation. Add dictation to questionnaire questions, especially medication steps. Add thorough testing for voice behavior.

### Underlying Problem

Voice and listening features exist but are inconsistent. Current dictation auto-stops after 4 seconds of idle time, which the mobile deck says is too short. AI chat controls are icon-only. Listen is small and visually secondary.

### Related Workbook Issues

- Web: 15, 17, 18, 19
- Mobile: 12, 29, 30, 80
- Slide-only: Mobile slide 33 issue 81, clearer `Tap to stop`
- 421 Key Discussions: Listen button, listen and response option

### Related Slides

- Web: 16, 19, 20, 22
- Mobile: 10, 17, 23, 24, 25, 33, 34

### Affected Surfaces

- Questionnaire questions
- Medication wizard
- AI chat
- Signin/signup by exclusion

### Affected Files

| File | Planned changes |
|---|---|
| `src/components/SpeechReader.jsx` | Larger `Listen` button, placement support, visible label, accessible name. |
| `src/views/Questionnaire/4msSection.jsx` | Add/standardize `Dictate` and `Tap to Stop`, longer timeout, free-text fields. |
| `src/components/AIChatbot.jsx` | Label `Dictate`, `Send`, `More Questions`; remove tip of day; align timeout. |

### Final Behavior

#### Listen

- Button text: `Listen`.
- Placement: before or left of question text where feasible.
- Minimum 44px target.
- Reads question text aloud.
- If speech synthesis unsupported, show persistent inline message.

#### Dictation in Questionnaire

- Button text when idle: `Dictate`.
- Button text while recording: `Tap to Stop`.
- Uses continuous recognition when supported.
- Uses longer idle timeout: 10-15 seconds.
- Explicit tap-to-stop always works.
- Transcript appends to active field without overwriting existing text.
- Unsupported browsers show persistent message.

#### Dictation in Medication

- Add to:
  - medication name
  - dose
  - frequency
  - notes/concerns
- Do not add to login/signup.

#### AI Chat

- Replace icon-only voice/send buttons with visible labels:
  - `Dictate`
  - `Send`
- Rename refresh quick questions action to visible `More Questions`.
- Remove `Health Tip of the Day`.

### Technical Implementation Steps

1. Define shared constants:
   - `VOICE_IDLE_STOP_MS = 12000` or similar.
   - If not extracted to utility, duplicate consciously in both files with same value and comment.
2. Update `4msSection.jsx` recognition:
   - Existing 4000ms timer becomes longer.
   - While active, button label changes to `Tap to Stop`.
   - Add stop handler separate from start handler.
   - Keep final transcript accumulation behavior.
3. Update `AIChatbot.jsx` recognition:
   - Same timeout.
   - Visible labels.
   - `aria-live` status for recording.
4. Update `SpeechReader.jsx`:
   - larger button
   - stronger outline
   - visible label
   - optional prop for compact/full placement
5. Add persistent status areas:
   - `Recording... tap to stop`
   - `Voice input is not supported in this browser`
   - `Microphone permission is needed`
6. Remove browser `alert()` for normal unsupported voice cases where possible.

### Accessibility Considerations

- Recording state must be visually and programmatically clear.
- Dictation buttons need accessible names with target question context.
- Do not use color alone to show recording.
- Provide keyboard equivalent to start/stop.

### Responsive/Mobile Considerations

- Dictate button can be full width below text field on narrow screens.
- Medication wizard should place Dictate close to the active field.
- AI input controls may stack below textarea on narrow screens with labels.

### Voice Test Matrix

| Test | Expected result |
|---|---|
| Start dictation and speak one sentence | Text appears in active field. |
| Pause 3 seconds | Recording does not stop. |
| Pause 8 seconds | Recording should continue if timeout set above 10 seconds. |
| Pause beyond timeout | Recording stops gracefully and keeps text. |
| Tap `Tap to Stop` | Recording stops immediately and keeps text. |
| Resume dictation | New text appends, does not overwrite. |
| Deny mic permission | Persistent message explains how to enable mic. |
| Unsupported browser | Persistent message explains dictation unavailable. |
| Multiple fields | Dictation writes only to the active field. |
| AI chat dictation | Dictated text appears in chat input and can be sent. |
| Auth pages | No dictation controls present. |

### Risks

- Web Speech API support varies, especially iOS Safari.
- Microphone permissions require HTTPS.
- Continuous recognition can behave differently across browsers.

### Expected Issues Resolved

W15, W17, W18, W19, M12 by exclusion, M29, M30, M80, slide-only M81.

---

## Cluster 7: Review, Edit, Save, Share, and Report Lifecycle

### User Decision Applied

Use native share with print/download fallback. Add edit buttons. Address review colors. Use safe exits.

### Underlying Problem

The review screen summarizes responses but edit behavior is not direct. The save prop appears mismatched. Share/report functionality is requested repeatedly but not implemented as a coherent lifecycle.

### Related Workbook Issues

- Mobile: 5, 36, 53, 69, 75, 101, 34, 65, 201

### Related Slides

- Mobile: 6, 7, 17, 19, 20, 21, 26, 27, 29, 31, 32

### Affected Surfaces

- Questionnaire review
- Share/report
- Save confirmation
- Edit path

### Affected Files

| File | Planned changes |
|---|---|
| `src/views/Questionnaire/Questionnaire.jsx` | Save all current data, route edit targets, pass correct props. |
| `src/views/Questionnaire/ReviewSubmit.jsx` | Review cards, edit buttons, save/share actions, report rendering. |
| `src/services/questionnaireService.js` | No required backend change unless report metadata is stored. |

### Final Behavior

Review screen:

- Shows each section in correct section color and label:
  - Matters
  - Medication
  - Mentation
  - Mobility
- Each answered question has an `Edit` button.
- Section cards include:
  - answered count
  - clear status text
  - non-color completion cue
- `Edit` navigates directly to relevant section and, if feasible, scrolls/focuses the relevant question.
- `Save Assessment` saves current live responses.
- `Share Report` opens report action options:
  - `Share` using `navigator.share` if available
  - `Print`
  - `Download` fallback
- `Home` safe exit remains visible.

### Technical Implementation Steps

1. Fix prop mismatch:
   - Either parent passes `onFinalSubmit={handleSave}` or child expects `onSave`.
2. Add `onEdit(sectionKey, questionKey)` prop.
3. In parent `Questionnaire.jsx`, implement:
   - set active section
   - store focus target question key
   - pass target into `FourMSection`
4. In `FourMSection`, if `focusQuestionKey` matches, scroll/focus the card or field.
5. Before rendering review, collect latest local data from refs.
6. Add report builder function in `ReviewSubmit.jsx`:
   - Create plain-text summary for native share.
   - Create printable HTML section within page for print.
   - Create downloadable `.txt` or simple HTML file via Blob for download.
7. Add print styles if needed in `index.css`.
8. Ensure share/report excludes hidden internal keys and uses user-facing labels.

### Accessibility Considerations

- Review cards should be semantic sections with headings.
- Edit buttons must include target context, e.g. `Edit Medication: prescribed medications`.
- Share action sheet/modal must be keyboard navigable.
- Save/share status must be persistent and announced.

### Responsive/Mobile Considerations

- Review cards stack.
- Action buttons are full width or 2-column grid.
- Report/share controls appear at bottom and are easy to reach.

### Risks

- Browser `navigator.share` support varies.
- Download/print formatting can become large if answers are long.
- PHI/privacy: native share lets users choose destination, but copy should clarify that user controls sharing.

### Verification Steps

- Save from review actually persists.
- Edit from review returns to correct section.
- Share button appears on supported browsers and fallback appears otherwise.
- Print preview includes all answers and section labels.
- Download includes all answers.
- Mobile review does not rely on color-only section differences.

### Expected Issues Resolved

M5, M36, M53, M69, M75, M101, M34, M65, M201.

---

## Cluster 8: Terminology and Content Consistency

### User Decision Applied

Use `Mentation` and `Caregiver`.

### Underlying Problem

The app currently mixes `Mind` and `Mentation`, and the discussion raised caregiver/care partner/provider/giver terminology. The user selected `Mentation` and `Caregiver`.

### Related Workbook Issues

- Web: 8, 20
- 421 Key Discussions: Care partner vs caregiver, terminology

### Related Slides

- Web: 22
- Mobile: 3

### Affected Surfaces

- Landing 4M cards
- Questionnaire section labels
- Review labels
- AI context section labels
- Signup/profile caregiver field

### Affected Files

| File | Planned changes |
|---|---|
| `src/views/Landing.jsx` | Use `Mentation`; keep `Caregiver` only where relevant. |
| `src/views/Signup/Signup.jsx` | Ensure `Caregiver Email (Optional)`. |
| `src/views/login/Signin.jsx` | No caregiver terms likely needed. |
| `src/components/ProfileModal.jsx` | Use `Caregiver`. |
| `src/views/Questionnaire/Questionnaire.jsx` | Display `Mentation` for internal key `mind`. |
| `src/views/Questionnaire/4msSection.jsx` | Section config title `Mentation`. |
| `src/views/Questionnaire/ReviewSubmit.jsx` | Review section title `Mentation`. |
| `src/services/questionnaireService.js` | Question text only if it exposes `Mind`; internal key can remain `mind`. |

### Final Behavior

- User-facing section label is `Mentation`.
- Internal response key remains `mind` to avoid migration.
- User-facing caregiver label remains `Caregiver`.
- Firestore field remains `caregiverEmail`.

### Technical Implementation Steps

1. Add a section label helper:
   - `matters` -> `Matters`
   - `medication` -> `Medication`
   - `mind` -> `Mentation`
   - `mobility` -> `Mobility`
2. Replace hardcoded `Mind` labels in UI.
3. Update review and AI context formatting.
4. Keep data keys stable.

### Verification Steps

- Search user-facing source for `Mind` and confirm only internal keys/comments remain.
- Search user-facing source for `care partner` and confirm not used unless explanatory/historical.
- Existing saved responses still load.

### Expected Issues Resolved

W8 and W20 according to final user terminology decision.

---

## Cluster 9: AI Assistant Simplification and Affordance Cleanup

### User Decision Applied

Simple requested things that have no use or are requested for removal should be removed. AI tip is extraneous per slide.

### Underlying Problem

The AI screen includes extra content and icon-only controls that increase cognitive load and reduce clarity.

### Related Workbook Issues

- Web: 17, 18, 19
- Mobile slide-only: 76, 77, 78, 79 from mobile slide 34

### Related Slides

- Web: 19, 20
- Mobile: 34

### Affected Files

| File | Planned changes |
|---|---|
| `src/components/AIChatbot.jsx` | Remove health tip, label controls, improve mobile layout. |

### Final Behavior

- Remove `Health Tip of the Day`.
- Quick question refresh is visible text button: `More Questions`.
- Voice input is visible text button: `Dictate` and `Tap to Stop`.
- Send is visible text button: `Send`.
- Mobile layout may stack input and buttons for clarity.

### Technical Implementation Steps

1. Remove the `Health Tips` card.
2. Replace small reload icon in Quick Questions card with a labeled button.
3. Replace circular icon-only voice/send buttons with labeled buttons.
4. Keep cooldown behavior but show text clearly.
5. Ensure quick-question clickable tags become buttons or button-like controls with keyboard support.

### Verification Steps

- AI screen has no health tip card.
- `More Questions`, `Dictate`, and `Send` labels visible.
- Keyboard can activate quick questions and controls.
- Mobile 320px layout remains usable.

### Expected Issues Resolved

W17, W18, W19, Mobile slide 34 issues 76-79.

---

## Cluster 10: QA, Regression, and Issue Coverage Audit

### User Decision Applied

Every Excel issue must be listed and mapped to whether and how it was addressed. An audit agent/pass must make sure coverage is real, not just claimed.

### Underlying Problem

The issue list is broad and includes overlapping symptoms. Implementation could easily miss rows unless every row is mapped and audited.

### Final QA Deliverables After Implementation

After code implementation, produce a final coverage report with these columns:

| Column | Meaning |
|---|---|
| Source sheet | `Web`, `Mobile`, `Relevant literature`, or `421 Key Discussions`. |
| Issue ID/topic | Workbook ID or discussion topic. |
| Priority | If present. |
| Original issue text | Short original description. |
| Cluster | Cluster resolving it. |
| Status | `Resolved`, `Partially resolved`, `Deferred`, or `Not applicable`. |
| How addressed | Short implementation summary. |
| Pages changed | Routes/surfaces affected. |
| Files edited | Actual edited files. |
| Verification | Test/manual check confirming it. |
| Auditor result | `Pass`, `Needs follow-up`, or `Blocked`. |

### Auditor Role

Create a final `Issue Coverage Auditor` pass after implementation.

Responsibilities:

1. Re-read the workbook extraction or workbook itself.
2. Re-read the implementation diff.
3. Check every workbook row exists in the final coverage table.
4. Verify every `Resolved` claim maps to actual file changes.
5. Verify every `Deferred` row has a concrete reason.
6. Verify no critical/high/medium row is deferred without explicit approval or clear technical blocker.
7. Verify slide-only issues 76-81 are included because they are not all clean workbook rows.

### Required Commands

Run after implementation:

```bash
npm run lint
npm run build
```

If browser verification is available, run:

- Desktop viewport: 1366x768
- Tablet viewport: 768x1024
- Mobile viewports: 320x568, 375x667, 390x844, 414x896

### Manual Flow Tests

| Flow | Required checks |
|---|---|
| Landing | New/returning CTAs, contrast, no misleading hover, mobile readability. |
| Signin | Visible labels, persistent errors, no dictation. |
| Signup | Wizard steps, field validation, duplicate errors, no dictation, caregiver wording. |
| Home/Header | Logo, menu label, accessible contrast. |
| Drawer | Visible close/back, Home, logout contrast, keyboard escape/click outside if supported. |
| Matters | Chips/buttons, listen, dictate, bottom nav, save, edit later. |
| Medication | Category-first flow, optional exact details, dictate each part, save/review. |
| Mentation | Correct terminology, choice buttons, section color, review display. |
| Mobility | No dropdown, large mobility buttons, tips readable. |
| Review | Correct colors, direct edit, save works, share/report actions. |
| AI | No tip card, More Questions label, Dictate label, Send label, mobile layout. |
| Voice | Timeout, tap-to-stop, transcript append, unsupported fallback. |

## 7. Exhaustive Workbook Issue Coverage Plan

### Web Sheet

| Issue ID | Priority | Original issue | Cluster | Planned status | How it will be addressed | Pages/routes | Files expected |
|---:|---|---|---|---|---|---|---|
| 1 | Medium | Text size/contrast issue | 1 | Resolved | Apply slide palette, 7:1 target, larger text and button styles. | `/` | `Landing.css`, `index.css` |
| 2 | Low | Get started and sign in can be vague | 2 | Resolved | Rename CTAs to `I'm New: Start Here` and `Returning User: Sign In`. | `/` | `Landing.jsx` |
| 3 | Low | M blocks shift dynamically when moused over | 2 | Resolved | Remove hover movement unless element is a real link/button. | `/` | `Landing.css` |
| 4 | Medium | Links/buttons need outlining | 1, 2 | Resolved | Outline all interactables; informational cards remain non-button-like. | `/`, global | `Landing.css`, `index.css` |
| 5 | High | Image has contrast/text size/eye pathing issues | 2 | Resolved | Remove/de-emphasize framework image on mobile; use text-first cards. | `/` | `Landing.jsx`, `Landing.css` |
| 6 | Medium | 4x4 boxes confusing eye path | 2 | Resolved | Stack/number 4M cards with clearer hierarchy. | `/` | `Landing.jsx`, `Landing.css` |
| 7 | High | Signup form is very dense | 3 | Resolved | Convert signup into step-based wizard. | `/signup` | `Signup.jsx` |
| 8 | Low | `caregiver` terminology | 8 | Resolved per user decision | Keep `Caregiver` consistently because user selected it. | `/signup`, profile | `Signup.jsx`, `ProfileModal.jsx`, `authService.js` |
| 9 | Medium | Custom text sizing | 1, 3 | Resolved or partially resolved | Implement larger default text. Add optional text size setting only if feasible after core flow changes. | Global/signup | `index.css`, `Signup.jsx` |
| 10 | Low | Mixed section colors | 1, 8 | Resolved | Apply section token map: Matters blue, Medication green, Mentation plum, Mobility orange. | `/questionnaire`, review | `Questionnaire.jsx`, `4msSection.jsx`, `ReviewSubmit.jsx` |
| 11 | High | Assessment header contrast/text size | 1 | Resolved | Larger header text, accessible section colors, non-color labels. | `/questionnaire` | `Questionnaire.jsx`, `4msSection.jsx` |
| 12 | High | Buttons not outlined | 1, 4 | Resolved | Outlined section controls and bottom action bar buttons. | `/questionnaire` | `Questionnaire.jsx`, `index.css` |
| 13 | Critical | Assessment navigation challenge | 4 | Resolved | Hybrid section sequence with bottom Back/Next/Save/Home and section numbering. | `/questionnaire` | `Questionnaire.jsx`, `4msSection.jsx` |
| 14 | Low | Random star | 4 | Resolved | Remove if decorative; label if functional. | `/questionnaire` | `4msSection.jsx` |
| 15 | Medium | Listen button small/location issue | 6 | Resolved | Move/enlarge `Listen`; place near left/before question; improve contrast. | `/questionnaire` | `SpeechReader.jsx`, `4msSection.jsx` |
| 16 | High | Dropdown difficult to navigate | 5 | Resolved | Replace questionnaire dropdowns with large chips/buttons and medication flow. | `/questionnaire` | `4msSection.jsx`, `questionnaireService.js` |
| 17 | Medium | Refresh button unlabeled | 9 | Resolved | Replace with visible `More Questions` button. | `/ai-chatbot` | `AIChatbot.jsx` |
| 18 | Medium | Dictation button unlabeled | 6, 9 | Resolved | Label as `Dictate`; recording state `Tap to Stop`. | `/ai-chatbot` | `AIChatbot.jsx` |
| 19 | Medium | Send button unlabeled | 9 | Resolved | Label as `Send`. | `/ai-chatbot` | `AIChatbot.jsx` |
| 20 | Low | Mind or mentation | 8 | Resolved per user decision | Use `Mentation` user-facing; preserve internal `mind` key. | Global 4M surfaces | `Landing.jsx`, `Questionnaire.jsx`, `4msSection.jsx`, `ReviewSubmit.jsx`, `questionnaireService.js` |

### Mobile Sheet

| Issue ID | Priority | Original issue | Cluster | Planned status | How it will be addressed | Pages/routes | Files expected |
|---:|---|---|---|---|---|---|---|
| 5 | Medium | Share button | 7 | Resolved | Add `Share Report` on review/report with native share and print/download fallback. | `/questionnaire` review | `ReviewSubmit.jsx`, `Questionnaire.jsx` |
| 9 | High | Login button proposal | 2 | Resolved | Explicit first-time/returning-user entry choices. | `/`, `/signin` | `Landing.jsx`, `Signin.jsx` |
| 46314 | Low | Add branding/logo | 2 | Resolved | Consistent logo on sign-in, signup, home/header. | `/signin`, `/signup`, `/home` | `Signin.jsx`, `Signup.jsx`, `AppLayout.jsx`, `Home.jsx` |
| 46340 | Medium | Separate username/password screens | 3 | Resolved or partially resolved | Mobile-friendly sequential signin panels if it improves readability; desktop remains simple. | `/signin` | `Signin.jsx` |
| 12 | Medium | Dictation button for login? | 3, 6 | Resolved by exclusion | Do not add auth dictation due to reliability/security; add dictation to questionnaire only. | `/signin`, `/signup` | No auth dictation; `4msSection.jsx` for questionnaire dictation |
| 20 | Medium | Burger menu unlabeled, unoutlined | 1, 4 | Resolved | Button visibly labeled `Menu`, outlined, 44px target. | Header | `AppLayout.jsx` |
| 22 | Low | Unlabeled button | 1 | Resolved | Remove if inactive; otherwise label with visible text and accessible name. | Home/header | `AppLayout.jsx`, `Home.jsx` |
| 23 | High | Contrast/text size concern | 1 | Resolved | Apply global text/contrast tokens. | Home/assessment | `index.css`, `Home.jsx`, `Questionnaire.jsx` |
| 25 | High | Side menu needs safe out | 4 | Resolved | Add visible `Close Menu`/`Back` and `Home` in drawer. | Drawer | `AppLayout.jsx` |
| 26 | Medium | Highlighted menu text contrast | 1, 4 | Resolved | Use outline/selected marker rather than low-contrast highlight. | Drawer | `AppLayout.jsx`, `index.css` |
| 27 | Medium | Logout contrast concern | 1, 4 | Resolved | Full-width high-contrast logout button. | Drawer | `AppLayout.jsx` |
| 28 | Critical | M assessments navigation issue | 4 | Resolved | Numbered section indicator with arrows and bottom navigation. | `/questionnaire` | `Questionnaire.jsx` |
| 29 | Low | Listen button location | 6 | Resolved | Move/enlarge `Listen` control to better hierarchy. | `/questionnaire` | `SpeechReader.jsx`, `4msSection.jsx` |
| 30 | Medium | Good voice input | 6 | Resolved | Add consistent dictation to every questionnaire free-text input. | `/questionnaire` | `4msSection.jsx` |
| 31 | Medium | Contrast concern | 1 | Resolved | Apply accessible section text/background colors. | `/questionnaire` | `4msSection.jsx`, `index.css` |
| 101 | High | Add edit button | 7 | Resolved | Direct edit buttons for answered/filled responses. | Review/questionnaire | `ReviewSubmit.jsx`, `Questionnaire.jsx` |
| 32 | Medium | Contrast concern | 1 | Resolved | Same global/section contrast fix. | `/questionnaire` | `4msSection.jsx`, `index.css` |
| 33 | Medium | Text explainer too much info | 4, 5 | Resolved | Simplify or remove dense explainer text; reveal help only when useful. | `/questionnaire` | `4msSection.jsx`, `questionnaireService.js` |
| 34 | Critical | Save/Share/Home/Next buttons | 4, 7 | Resolved | Bottom Back/Next/Save/Home; Share on review/report. | `/questionnaire` | `Questionnaire.jsx`, `ReviewSubmit.jsx` |
| 201 | Critical | Mobile navigation | 4 | Resolved | Persistent bottom nav prevents scroll-to-top navigation burden. | `/questionnaire` | `Questionnaire.jsx` |
| 50 | Medium | Contrast concerns | 1 | Resolved | Medication/questionnaire contrast fixes. | `/questionnaire` | `4msSection.jsx`, `index.css` |
| 51 | Critical | Dropdown box difficulty | 5 | Resolved | Medication category-first wizard; no dropdown. | `/questionnaire` | `4msSection.jsx`, `questionnaireService.js` |
| 53 | High | Add edit button | 7 | Resolved | Edit buttons on fulfilled answers and review rows. | Review | `ReviewSubmit.jsx`, `Questionnaire.jsx` |
| 65 | High | Safe exits for questionnaires | 4, 7 | Resolved | Persistent Home safe exit and Save in bottom action bar. | `/questionnaire` | `Questionnaire.jsx` |
| 68 | Critical | Consider wizard for all questionnaires | 4, 5 | Resolved | Hybrid guided flow for all sections with simplified question cards. | `/questionnaire` | `Questionnaire.jsx`, `4msSection.jsx` |
| 69 | High | Add edit button | 7 | Resolved | Direct edit buttons for answered responses. | Review | `ReviewSubmit.jsx` |
| 72 | High | Tricky dropdown | 5 | Resolved | Mobility type becomes large single-choice buttons. | `/questionnaire` | `4msSection.jsx` |
| 75 | Low | Review color scheme inaccurate | 1, 7 | Resolved | Review colors use final section color token map and labels. | Review | `ReviewSubmit.jsx` |
| 80 | Medium | Blank workbook row, slide says dictation timeout too short | 6 | Resolved using slide evidence | Longer timeout, explicit `Tap to Stop`, test matrix. | Questionnaire/AI | `4msSection.jsx`, `AIChatbot.jsx` |
| 36 | Medium | Example share button screen | 7 | Resolved | Report action sheet/screen with share, print, download, home. | Review/report | `ReviewSubmit.jsx` |

### Relevant Literature Sheet

| Topic | Cluster | Planned status | Handling |
|---|---|---|---|
| Button size | 1 | Resolved | Minimum 44px/11.5mm equivalent for all controls. |
| Button spacing | 1 | Resolved | Minimum and preferred spacing in action bars/chips. |
| Outlining buttons | 1 | Resolved | Outlined interactables and selected states. |
| Use a wizard | 3, 4, 5 | Resolved | Signup wizard and hybrid questionnaire. |
| Text contrast | 1 | Resolved | Slide palette and contrast verification. |
| Difficulty of dropdown menus | 5 | Resolved | Remove questionnaire dropdowns. |
| Icon labels | 1, 6, 9 | Resolved | Visible labels for menu/listen/dictate/send/more questions. |
| Icon labels duplicate row | 1, 6, 9 | Resolved | Same as above; auditor should retain duplicate row in final coverage. |
| Safe exits | 4, 7 | Resolved | Home/back/save controls and drawer safe-out. |

### 421 Key Discussions Sheet

| Topic | Cluster | Planned status | Handling |
|---|---|---|---|
| Get started/sign in buttons; click vs tap on mobile | 2 | Resolved | Use clear labels not dependent on click/tap. |
| Care partner vs caregiver/caretaker | 8 | Resolved per user decision | Use `Caregiver`. |
| Is text size adjuster an option? | 1, 3 | Partially resolved unless time allows setting | Larger default text required; optional adjuster only if feasible after core issues. |
| Listen button | 6 | Resolved | Larger, labeled, better placement. |
| Listen and response option | 6 | Resolved | Listen plus Dictate pattern across questions. |
| Move navigation buttons to bottom; shade completed or bold next | 4 | Resolved | Bottom navigation, current/complete text indicators, not color-only. |

## 8. Slide/Proposal Coverage Matrix

### Web Deck

| Slide | Evidence | Cluster | Implementation handling |
|---:|---|---|---|
| 3 | Cognitive changes and cognitive load | 4, 5 | Hybrid flow, fewer choices per screen, wizard signup. |
| 4 | Eyesight, contrast, dexterity | 1 | 7:1 target, 44px controls, spacing. |
| 5 | Peripheral vision | 2, 4 | Clear eye path, bottom controls, no tiny image text. |
| 6 | Usability first, predictable patterns | 1, 4 | Shared controls and consistent nav. |
| 7 | Button labels/outlines/size/spacing/text/contrast | 1 | Design-system requirements. |
| 8 | Wizards, safe exits, reduce alternatives | 3, 4, 5 | Signup wizard, hybrid questionnaire, bottom safe exits. |
| 9 | Color scheme | 1 | Final color token map. |
| 11 | CTA wording | 2 | New/returning CTA labels. |
| 12 | Landing motion/image/4M layout | 2 | Remove misleading motion, simplify image/cards. |
| 13 | Signup wizard | 3 | Step-based signup. |
| 14 | Dynamic text option | 1, 3 | Larger default; optional text adjuster if feasible. |
| 15 | Section colors | 1, 8 | Matters blue, Medication green, full token map. |
| 16 | Questionnaire contrast/buttons/dropdown/listen/nav | 1, 4, 5, 6 | Global fixes, bottom nav, chips/buttons, listen placement. |
| 17 | Hierarchy break | 4 | Section numbering and guided nav. |
| 18 | Activity buttons and wizard | 5 | Choice buttons, no dropdown. |
| 19 | AI more questions | 9 | Visible `More Questions` button. |
| 20 | AI dictate/send labels | 9 | Visible `Dictate` and `Send`. |
| 21 | Signup errors | 3 | Persistent inline errors. |
| 22 | Caregiver, text size, color differentiation, Mind/Mentation | 1, 8 | User selected Caregiver and Mentation; non-color cues. |

### Mobile Deck

| Slide | Evidence | Cluster | Implementation handling |
|---:|---|---|---|
| 3 | Mind vs Mentation | 8 | Use `Mentation`. |
| 4 | Intro screen text/contrast/image | 1, 2 | Contrast, larger text, de-emphasize image. |
| 5 | Tappable affordances | 1, 2 | Outline if tappable. |
| 6 | Share buttons | 7 | Share report from review/report. |
| 7 | Share screen proposal | 7 | Report action sheet with share/print/download/home. |
| 8 | Login wording/contrast/text size | 2, 3 | Explicit new/returning, accessible text/contrast. |
| 9 | Login proposal/branding | 2, 3 | Branding and clearer entry. |
| 10 | Separate forms/dictation question | 3, 6 | Optional mobile split; no auth dictation. |
| 11 | Login password step | 3 | Mobile-friendly signin if chosen during implementation. |
| 12 | Signup wizard | 3 | Step signup. |
| 13 | Signup wizard example | 3 | Use as pattern. |
| 14 | Signup error persistence | 3 | Persistent field errors. |
| 15 | Home/menu labels/branding | 1, 2, 4 | Label menu, remove/label unused button, branding. |
| 16 | Side menu safe out/contrast | 1, 4 | Drawer close/back/home and contrast. |
| 17 | Matters nav/listen/voice/edit/contrast | 1, 4, 6, 7 | Section arrows, listen, dictation, edit, contrast. |
| 18 | Explainer/safe exits | 4, 5 | Simplify copy and bottom controls. |
| 19 | Save/Home/Share proposal | 4, 7 | Back/Next/Save/Home in flow; Share on review. |
| 20 | Bottom nav proposal | 4 | Persistent bottom nav. |
| 21 | Medication dropdown/edit | 5, 7 | Medication wizard and edit. |
| 22 | Medication list proposal | 5 | Add/remove medication pattern. |
| 23 | Medication name/dictate | 5, 6 | Name step with dictate. |
| 24 | Medication dosage/dictate | 5, 6 | Dose step with dictate. |
| 25 | Medication frequency/dictate | 5, 6 | Frequency step with dictate. |
| 26 | Medication safe exits | 4, 7 | Bottom controls and report share. |
| 27 | Mentation wizard/edit | 4, 7, 8 | Mentation label, guided flow, edit. |
| 28 | Mentation button options | 5 | Large choice buttons. |
| 29 | Mentation safe exits | 4, 7 | Bottom controls. |
| 30 | Mobility wizard/no dropdown | 5 | Mobility buttons, no select. |
| 31 | Mobility safe exits | 4, 7 | Bottom controls. |
| 32 | Review colors | 1, 7 | Section color consistency in review. |
| 33 | Dictation timeout/tap stop | 6 | Longer timeout and `Tap to Stop`. |
| 34 | AI screen cleanup | 9 | Remove tip, label more/dictate/send. |

## 9. Implementation Order and Dependencies

### Phase A: Foundation

1. Add global design tokens and accessibility utilities.
2. Add final section label/color helpers.
3. Verify no obvious contrast regression.

Dependencies:

- None.

Why first:

- All later clusters depend on these tokens and control rules.

### Phase B: Navigation and Shared Controls

1. Update `AppLayout` drawer/menu.
2. Build questionnaire bottom action bar and section sequence.
3. Add safe save/home handling.

Dependencies:

- Phase A tokens.

Why second:

- Questionnaire input/review changes depend on section navigation and edit targets.

### Phase C: Inputs and Voice

1. Replace dropdowns with choice buttons.
2. Build medication category-first flow.
3. Standardize listen/dictate behavior and timeout.

Dependencies:

- Phase A tokens.
- Phase B section flow.

Why third:

- These are high-risk interactions and need the navigation structure.

### Phase D: Review, Share, and AI

1. Fix review save/edit.
2. Add share/print/download.
3. Update AI screen labels and remove tip.

Dependencies:

- Phase B edit targets.
- Phase C data shapes if medication detail changes.

### Phase E: Landing/Auth

1. Landing CTA and content simplification.
2. Signup wizard.
3. Persistent auth errors.

Can run earlier if implementation is split, but should use Phase A tokens.

### Phase F: QA and Coverage Audit

1. Lint/build.
2. Browser/mobile testing.
3. Voice test matrix.
4. Final workbook issue coverage audit.

## 10. Backend, API, and Firebase Impact

### Required Backend Changes

None required for the selected share model.

### Possible Frontend Data Shape Changes

| Change | Required? | Notes |
|---|---|---|
| Keep `responses.mind` key | Yes | User-facing label becomes `Mentation`; internal key stable. |
| Keep `Users.caregiverEmail` | Yes | User-facing label remains `Caregiver Email`. |
| Add `responses.medication.medicationEntries` | Optional but recommended for clean medication wizard | Must preserve old medication question responses. |
| Update AI questionnaire context labels | Yes | Show `Mentation`, not `mind`, in AI context. |

### Firebase Security

Security rules were noted as broad during codebase mapping, but not directly requested by spreadsheet/deck issues. Do not change rules in this pass unless implementation introduces new report/email behavior.

### API Functions

`functions/index.js` changes are not required unless:

- AI context formatting is moved server-side.
- Future email/share sending is implemented.

For this pass, native share/print/download should be frontend-only.

## 11. Risks and Conflict Resolutions

| Conflict/risk | Resolution |
|---|---|
| Color mapping conflict between web and mobile evidence | Use explicit web issue for Matters/Medication, slide palette for final token map, and ensure review is internally consistent. |
| Full wizard could be too large a rewrite | Use hybrid guided flow to solve navigation/cognitive issues while preserving data shape. |
| Removing all dropdowns may increase vertical length | Use chips/buttons with wrapping and progressive sections; mobile can show fewer cards per screen. |
| Medication exact details may require new data shape | Use category-first optional details with backward-compatible rendering. |
| Native share support varies | Provide print/download fallback. |
| Voice API support varies | Add unsupported fallback and test matrix; do not make dictation required to complete flow. |
| Text size adjuster might expand scope | Required baseline text increase first; optional setting only after critical/medium items. |
| AntD style overrides could be brittle | Prefer app-specific classes and inline token usage in touched components. |

## 12. Final Acceptance Criteria

Implementation is complete only when:

1. All critical, high, and medium workbook issues are resolved or explicitly justified.
2. All low issues are either resolved if simple/bundled or marked with a reason.
3. No questionnaire dropdown remains.
4. Mobile questionnaire can be completed without returning to top navigation.
5. Auth has no dictation controls.
6. Questionnaire free-text fields have dictation controls.
7. Dictation has longer timeout and `Tap to Stop`.
8. AI screen has no Health Tip card and has visible `More Questions`, `Dictate`, and `Send`.
9. Review has direct edit buttons.
10. Share/report supports native share where available and print/download fallback.
11. Menu button and drawer safe-out are visible and labeled.
12. User-facing terms are `Mentation` and `Caregiver`.
13. Lint and build pass.
14. Final issue coverage table is produced and audited against actual file changes.

