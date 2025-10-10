# 4Ms Health Questionnaire Platform

Caregiver-friendly web experience for capturing the 4Ms (What Matters, Medications, Mind, Mobility) with a companion AI assistant, progress tracking, and caregiver email tips.

---

## Table of Contents
1. [Project Overview](#project-overview)  
2. [Architecture & Feature Highlights](#architecture--feature-highlights)  
3. [Tech Stack](#tech-stack)  
4. [Prerequisites](#prerequisites)  
5. [Local Setup](#local-setup)  
    - [Clone & Install](#clone--install)  
    - [Environment Variables](#environment-variables)  
    - [Run the App](#run-the-app)  
6. [Firebase & Data Expectations](#firebase--data-expectations)  
7. [Developer Commands](#developer-commands)  
8. [Manual QA Walkthrough](#manual-qa-walkthrough)  
    - [Pre-Test Checklist](#pre-test-checklist)  
    - [Step-by-Step Test Script](#step-by-step-test-script)  
9. [Feedback & Issue Reporting](#feedback--issue-reporting)  
10. [Deployment Notes](#deployment-notes)  
11. [Troubleshooting](#troubleshooting)  

---

## Project Overview
- Capture a participant’s 4Ms assessment via a guided questionnaire.  
- Keep responses in Firestore and surface progress on a personalized dashboard.  
- Provide an AI assistant that pulls questionnaire context into answers and suggests quick questions.  
- Offer caregiver engagement (mobility tips emailed via SendGrid).  
- Support admins with data migration utilities for legacy Firestore documents.

---

## Architecture & Feature Highlights
- **Frontend (React + Vite + Ant Design)**  
  - Auth (email/username, password reset) with Firebase Auth.  
  - Responsive layout (`src/components/AppLayout.jsx`) with tabs for Home, Questionnaire, AI Assistant.  
  - Questionnaire engine for 4Ms sections (`src/views/Questionnaire/`) with auto-saving, speech input, QR/UPC medication scanning, caregiver tip email trigger, review-and-submit workflow.  
  - AI assistant (`src/components/AIChatbot.jsx`) pulling quick prompts via backend `/api/quick-questions` and chatting via `/api/chat`.  
  - Profile management modal updating Firebase Auth + Firestore (`src/components/ProfileModal.jsx`).  
  - Admin-only migration view (`src/views/Migration.jsx`).

- **Backend (Express, `chat-backend/server.js`)**  
  - `/api/chat`: proxies to OpenRouter (DeepSeek) with user questionnaire context.  
  - `/api/quick-questions`: generates daily question suggestions.  
  - `/send-caregiver-tip`: emails a mobility tip via SendGrid.  
  - `/api/health`: health check for uptime monitoring.  
  - Ready for Firebase Functions deployment if desired.

---

## Tech Stack
- **Frontend:** React 18, Vite 6, Ant Design 5, React Router 7, React Toastify.  
- **Backend:** Node 20+, Express, Axios, SendGrid, Firebase Admin SDK.  
- **Auth & Data:** Firebase Auth, Cloud Firestore.  
- **Tooling:** ESLint, Tailwind (optional), Nodemon, dotenv.

---

## Prerequisites
- Node.js 20 or newer, npm 10 or newer.  
- Firebase project with Firestore + Email/Password Auth enabled.  
- SendGrid account with a verified sender address.  
- OpenRouter API key (or adjust backend to use a different AI provider).

---

## Local Setup

### Clone & Install
```bash
git clone https://github.com/<your-org>/New-Web_Questionnaire-App.git
cd New-Web_Questionnaire-App/Web-Questionnaire-App
npm install
cd chat-backend
npm install
```

### Environment Variables

1. **Frontend (`.env.development.local` at repo root)**  
   ```dotenv
   VITE_API_BASE_URL=https://localhost:5001
   ```
   **Note:** Use HTTPS (not HTTP) to avoid mixed content errors when accessing from network devices. Use your LAN IP with HTTPS if testing across devices.

2. **Backend (`chat-backend/.env`)**  
   ```dotenv
   PORT=5001
   FRONTEND_URL=https://localhost:5173
   OPENROUTER_API_KEY=replace_me
   SENDGRID_API_KEY=replace_me
   # Optional if running Firebase Admin locally
   # GOOGLE_APPLICATION_CREDENTIALS=C:\path\to\firebase-admin-key.json
   ```
   
   **⚠️ Important:** Set `FRONTEND_URL` to match your frontend's HTTPS URL (not HTTP). This ensures CORS works correctly with your HTTPS frontend.

3. **Firebase Config**  
   If you use a different Firebase project, update `src/services/firebase.js` with your credentials.

### Run the App
Open two terminals.

**Terminal 1 – Backend**
```bash
cd chat-backend
npm run dev        # or: npm start
```
Health check: http://localhost:5001/api/health

**Terminal 2 – Frontend**
```bash
npm run dev
```
Frontend opens at https://localhost:5173 (or the port shown in the terminal).

#### HTTPS Setup for Camera/Microphone Access

The app requires HTTPS to access camera, microphone, and geolocation APIs when accessed over the network (non-localhost). We use `vite-plugin-mkcert` for automatic trusted certificate generation.

**First-time setup (one-time per machine):**

1. **Install mkcert** (if not already installed):
   - **Windows (Chocolatey):** `choco install mkcert`
   - **Windows (Manual):** Download from [mkcert releases](https://github.com/FiloSottile/mkcert/releases)
   - **macOS:** `brew install mkcert`
   - **Linux:** `sudo apt install mkcert` or equivalent

2. **Install the local Certificate Authority:**
   ```bash
   mkcert -install
   ```
   This adds a trusted CA to your system and browsers.

3. **Run the dev server:**
   
   **Windows:** Use the helper script (adds mkcert to PATH automatically)
   ```bash
   start-dev-https.bat
   ```
   
   **Or manually:**
   ```bash
   # Add mkcert to PATH first, then run dev server
   set PATH=%PATH%;C:\Users\[YourUsername]\Downloads
   npm run dev
   ```
   
   **macOS/Linux:**
   ```bash
   npm run dev
   ```
   
   The `vite-plugin-mkcert` plugin will automatically generate trusted certificates.

**Accessing from other devices on your network:**

1. Find your machine's LAN IP (e.g., `192.168.1.100`)
2. Open `https://192.168.1.100:5173` (or your dev server port) on other devices
3. The certificate will be trusted if mkcert is installed on the host machine
4. Camera, microphone, and location permissions will work properly

**Note:** Certificate files (`*.pem`, `*.key`) are excluded from version control. Each developer needs to run mkcert setup locally.

---

## Firebase & Data Expectations
- Firestore collections: `Users`, `Questions`, `Sessions`, `Answers` (depending on migration progress).  
- Questionnaire schema lives in `Questions/4ms_health`. `questionnaireService.js` seeds a default if missing.  
- User sessions stored in `Sessions/{uid}_4ms_health`.  
- Profile updates sync to Firebase Auth + Firestore via `ProfileModal`.  
- AI assistant context assembled with `getUserQuestionnaireContext`.

---

## Developer Commands
| Command | Location | Description |
| --- | --- | --- |
| `npm run dev` | repo root | Start Vite dev server |
| `npm run build` | repo root | Production build |
| `npm run lint` | repo root | ESLint |
| `npm run preview` | repo root | Preview production build |
| `npm run dev` | `chat-backend` | Start backend with Nodemon |
| `npm start` | `chat-backend` | Start backend once |

---

## Manual QA Walkthrough

### Pre-Test Checklist
- Backend running on `http://localhost:5001`.  
- Frontend running at `http://localhost:5173` (or configured port).  
- Test account email inbox accessible (for password reset + SendGrid tip).  
- Feedback form link ready (replace `TODO_FEEDBACK_FORM_URL`).  
- Clear browser storage or use a fresh profile before a full regression.

### Step-by-Step Test Script
Add screenshots after each step using:
`![Step X – Description](docs/screenshots/step-x.png)`

#### 1. Launch & Landing
1. Open the frontend URL.  
2. Confirm redirect to `/signin`.  
3. Ensure logo and background render correctly.  
   - Expected: login form shows “Email or Username”, “Password”, and links to sign up/forgot password.

#### 2. Account Registration (`/signup`)
1. Click “Sign Up”.  
2. Fill first name, last name, email, phone, username, password, confirm password.  
3. Submit the form.  
   - Expected: toast success; redirect to `/signin`; Firebase Auth + Firestore `Users` contain new record.

#### 3. Sign In & Password Reset (`/signin`)
1. Sign in with the new email + password.  
2. Logout via avatar menu.  
3. Sign in with username + password.  
4. Click “Forgot password?”, enter email, confirm reset email arrives.  
   - Expected: login success to `/home`; toast confirms reset email.

#### 4. Home Dashboard (`/home`)
1. Verify greeting shows display name or email prefix.  
2. Check overall progress bar and “Last Updated” text.  
3. Click “Continue Assessment”.  
   - Expected: 0% for brand new accounts; button routes to `/questionnaire`.

#### 5. Questionnaire Navigation (`/questionnaire`)
1. Confirm tabs for What Matters, Medications, Mind, Mobility, Review & Submit.  
2. Switch tabs and observe progress bar color updates.  
3. Hover the floating “Save” button.  
   - Expected: tab headings styled with section colors; tooltip for save button.

#### 6. What Matters Section
1. Select tags for each question.  
2. Add personalized notes.  
3. (Optional) test speech input if available.  
4. Click floating “Save”.  
   - Expected: toast success; progress updates; reload retains responses.

#### 7. Medications Section
1. Add medication tags and notes.  
2. Launch QR/UPC scanner modal (if camera available).  
3. Save progress.  
   - Expected: scanner opens; invalid scans show toast error; data persists.

#### 8. Mind Section
1. Adjust sliders (Happiness, Memory, Sleep).  
2. Add tags/notes to remaining questions.  
3. Save progress.  
   - Expected: slider values persist after navigation.

#### 9. Mobility Section
1. Choose a mobility type; observe safety tip card update.  
2. Enter caregiver email (test inbox).  
3. Click “Send Mobility Tip to Caregiver”.  
4. Complete remaining questions and save.  
   - Expected: toast confirms email; SendGrid delivers tip; progress updates.

#### 10. Review & Submit
1. Open Review tab.  
2. Confirm each section summary shows answered/total counts with colored borders.  
3. Click “Submit Assessment”.  
   - Expected: warning if completion <25%, otherwise success message; responses remain editable later.

#### 11. Resume & Autosave Check
1. Refresh page.  
2. Sign out/in.  
   - Expected: `/home` progress reflects saved answers.

#### 12. AI Assistant (`/ai-chatbot`)
1. Click quick question chips and refresh suggestions.  
2. Send a custom message and note AI response.  
3. Toggle microphone (if browser supports).  
4. Toggle location and approve browser prompt; ensure response acknowledges location.  
5. Try rapid messages to hit rate limit.  
   - Expected: history persists in localStorage; AI references questionnaire context when available.

#### 13. Profile Modal
1. Open avatar menu → display name.  
2. Update first/last name and phone.  
3. Save and refresh.  
   - Expected: profile modal closes with success toast; Firebase reflects new data.

#### 14. Logout
1. Avatar menu → “Logout”.  
   - Expected: redirect to `/signin`; questionnaire progress remains after next login.

#### 15. Migration Tools (`/migration`)
1. Log in with account allowed to view migration page.  
2. Click “Preview Migration Data”; review totals.  
3. (Staging only) run “Run Migration” and “Verify Migration”.  
   - Expected: results alert details number of migrated users; spinner shows during operations.

#### 16. Backend Smoke Tests
1. Visit `http://localhost:5001/api/health`.  
2. Use Postman/cURL to call `/api/chat` with sample payload; inspect response.  
3. POST to `/send-caregiver-tip` with test email/mobility type.  
   - Expected: JSON success responses; emails delivered; server logs show requests.

#### 17. Submit Feedback
1. Record device, browser, OS, network.  
2. Note blockers or confusing steps.  
3. Submit to [Google Form](TODO_FEEDBACK_FORM_URL).  
   - Expected: confirmation message with instructions for urgent follow-up.

---

## Feedback & Issue Reporting
- Primary channel: Google Form (replace `TODO_FEEDBACK_FORM_URL`).  
- Critical issues: open a GitHub issue or ping maintainer directly.  
- Suggested GitHub issue template:
  ```
  Summary
  <one sentence>

  Steps to Reproduce
  1. …
  2. …

  Expected
  …

  Actual
  …

  Environment
  Browser, Device, OS, Timezone
  ```

---

## Deployment Notes
- Set production env vars for both frontend (`VITE_API_BASE_URL`) and backend (OpenRouter, SendGrid, `FRONTEND_URL`).  
- Verify SendGrid sender domain before emailing real caregivers.  
- Harden Firebase security rules to restrict access by authenticated UID.  
- Backend can be deployed as a Firebase Cloud Function; scheduler example is already scaffolded.

---

## Troubleshooting
| Symptom | Fix |
| --- | --- |
| 404 after login | Ensure Firebase user exists; check console for Firestore errors. |
| CORS errors | Verify `FRONTEND_URL` in backend `.env` matches the actual origin and restart the server. |
| Missing SendGrid emails | Confirm API key, verified sender, and mobility type value. |
| AI chat 401 | Ensure `OPENROUTER_API_KEY` is valid and not rate limited. |
| QR scanner fails | Browser may block camera; test in Chrome and ensure HTTPS in production. |
| Camera/mic blocked on network | App must run over HTTPS. Install `mkcert` and restart dev server. See [HTTPS Setup](#https-setup-for-cameramicrophone-access). |
| Certificate not trusted | Run `mkcert -install` to add the local CA to your system trust store. |
| Firestore permission denied | Update security rules to allow authenticated access to required collections. |

---

Happy testing! Replace `TODO_FEEDBACK_FORM_URL` and screenshot placeholders before sharing with your testers.
