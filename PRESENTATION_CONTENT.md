# 4Ms Health Questionnaire Platform

## 10-Slide Presentation Outline

## Presentation Style Guide

**Overall Style:**  
Use a clear professional minimal slide design. The presentation should look polished, academic, and modern without feeling decorative or crowded.

**Layout Rules:**  
- one main idea per slide
- short title at the top
- 2 to 4 concise bullet points or a short paragraph plus bullets
- one main figure per slide
- generous white space
- avoid dense text blocks

**Typography:**  
- use a clean sans-serif font such as Aptos, Calibri, Inter, or Helvetica
- title size should be clearly larger than body text
- use bold only for emphasis, not for every line
- keep text left-aligned for readability

**Color Direction:**  
- use a white or very light background
- use restrained healthcare-style accent colors such as blue, teal, and soft green
- avoid dark backgrounds unless required by a template
- avoid highly saturated gradients or flashy effects

**Bullet Style:**  
- use bullets when they improve scanability
- keep bullets short and direct
- do not overload a slide with too many bullets
- prefer 3 bullets when possible, 4 only if needed

**Figure Style:**  
- figures should be clean and readable at presentation size
- real website screenshots should be cropped neatly
- AI-generated figures should look like product visuals or diagrams, not generic AI art
- each slide should clearly reference its figure as `Figure X`

**Tone:**  
- professional
- concise
- informative
- not sales-heavy
- suitable for an academic, capstone, or product presentation

---

## Slide 1: Title and Product Overview

**Title:** 4Ms Health Questionnaire Platform  
**Subtitle:** AI-Supported Health Assessment for Older Adults and Caregivers

**Content:**  
- Organizes health information around What Matters, Medications, Mind, and Mobility.
- Supports older adults and caregivers through a structured digital workflow.
- Combines questionnaire data, saved progress, caregiver support, and AI assistance.

**Figure to Use:**  
Use a real screenshot from the landing page hero section.

**Exact Figure Reference:**  
Capture from page: `/`  
Include: logo, headline, subtitle text, and main call-to-action buttons.

**Figure Caption:**  
`Figure 1. Landing page of the 4Ms Health Questionnaire Platform.`

---

## Slide 2: Problem, Need, and 4Ms Framing

**Content:**  
- Health information is often fragmented across memory, notes, medications, and conversations.
- That makes it harder to track priorities, risks, and changes over time.
- The 4Ms framework gives the platform a simple structure for organizing care information clearly.

**Figure to Use:**  
Prefer a real screenshot from the landing page 4Ms section.

**Exact Figure Reference:**  
Capture from page: `/`  
Include: the 4Ms framework image and, if possible, the four informational cards below it.

**If screenshot is not clean enough:**  
AI-generate a presentation-quality infographic showing four labeled pillars: What Matters, Medications, Mind, and Mobility.  
Style instructions:
- clean healthcare presentation style
- white or very light background
- no futuristic art style
- use icons for heart, pill bottle, brain, and walking/mobility
- make it look like a slide infographic, not a webpage

**Figure Caption:**  
`Figure 2. The 4Ms framework used to organize the assessment experience.`

---

## Slide 3: Main User Flow

**Content:**  
- Users create an account and sign in securely.
- They return to a dashboard with saved progress and continue the assessment over time.
- The workflow is persistent, making the system practical for real ongoing use.

**Figure to Use:**  
Use a 3-image composite made from real website screenshots.

**Exact Figure Reference:**  
Use screenshots from:
- `/signup`
- `/signin`
- `/home`

**Composition Instructions:**  
Arrange left to right:
1. sign-up page
2. sign-in page
3. home dashboard with progress bar

**Figure Caption:**  
`Figure 3. User flow from account access to personalized dashboard and continued assessment.`

---

## Slide 4: Core Questionnaire Experience

**Content:**  
- The questionnaire is the core workflow of the platform.
- It organizes responses across the 4Ms and a final review stage.
- Progress is tracked and responses are saved so users can resume later.

**Figure to Use:**  
Use a real screenshot from the questionnaire page.

**Exact Figure Reference:**  
Capture from page: `/questionnaire`  
Include: section tabs and the top progress bar.  
If possible, use a screen where multiple section tabs are visible at once.

**Figure Caption:**  
`Figure 4. Guided questionnaire workflow with section navigation and progress tracking.`

---

## Slide 5: Key Input and Accessibility Features

**Content:**  
- Users can enter structured responses and add free-text notes.
- Voice input and read-aloud tools reduce friction for older adults and caregivers.
- Medication barcode and QR scanning supports faster medication capture.

**Figure to Use:**  
Use a 2-image composite from real website screenshots if available.

**Exact Figure Reference:**  
Use screenshots from page: `/questionnaire`

**Preferred Composition:**  
Left image:
- a question card showing voice input or read-aloud support

Right image:
- medication scanner modal open from the Medication section

**If you cannot capture a clean accessibility screenshot from the live site:**  
Keep the medication scanner as a real screenshot, and AI-generate a clean UI concept for voice input/read-aloud.  
AI-generation instructions:
- create a realistic web-app question card
- show a question, a text area, a "Voice Input" button, and a small "Listen" button
- match the style of a modern Ant Design health app
- avoid generic smartphone mockups

**Figure Caption:**  
`Figure 5. Accessibility and low-friction input features, including voice tools and medication scanning.`

---

## Slide 6: Review, Completion, and Saved Progress

**Content:**  
- The review screen summarizes responses and completion status.
- Users can check their answers before saving.
- Saved data remains available for later updates rather than ending as a one-time submission.

**Figure to Use:**  
Use a real screenshot from the review page.

**Exact Figure Reference:**  
Capture from page: `/questionnaire`  
Navigate to the `Review & Save` tab.  
Include: the overall progress summary and at least one section summary card.

**Figure Caption:**  
`Figure 6. Review-and-save experience showing completion status and assessment summary.`

---

## Slide 7: AI Assistant and Personalized Support

**Content:**  
- The AI assistant supports conversational health questions and quick prompts.
- It can use questionnaire context to make responses more personalized.
- Voice input, saved chat history, and location-aware context add useful functionality.

**Figure to Use:**  
Use a real screenshot from the AI chatbot page.

**Exact Figure Reference:**  
Capture from page: `/ai-chatbot`  
Include: chat interface and the quick questions panel if both fit cleanly in one screenshot.

**If one screenshot is too crowded:**  
Create a 2-image composite from the same page:
- top: chatbot conversation area
- bottom: quick questions section

**Figure Caption:**  
`Figure 7. AI assistant interface with personalized chat and quick-question prompts.`

---

## Slide 8: Current System Architecture and Value

**Content:**  
- The platform already includes authentication, saved questionnaire data, and AI support.
- Backend services also support caregiver communication, prompts, and reminders.
- This gives the system a real operational foundation for growth.

**Figure to Use:**  
AI-generate this figure.

**AI Figure Instructions:**  
Generate a clean architecture diagram with these exact labeled blocks:
- `User Web App`
- `Firebase Auth`
- `Firestore`
- `AI Backend`
- `OpenRouter Models`
- `Caregiver Email Support`

Show these relationships:
- User Web App connects to Firebase Auth and Firestore
- User Web App connects to AI Backend
- AI Backend connects to OpenRouter Models
- AI Backend connects to Caregiver Email Support

Style instructions:
- simple boxes and arrows
- white background
- professional academic presentation style
- no 3D effects
- use blue/green healthcare color accents

**Figure Caption:**  
`Figure 8. High-level architecture of the current platform and service integrations.`

---

## Slide 9: Future Work - Agentic AI Expansion

**Content:**  
- The next step is to move from AI answers to AI actions.
- Future agents could help with appointments, medication follow-up, and caregiver coordination.
- The long-term goal is to help users act on recorded information, not just store it.

**Figure to Use:**  
AI-generate this figure.

**AI Figure Instructions:**  
Generate a product-roadmap style visual with three stages:
1. `Assessment Platform`
2. `Context-Aware AI Assistant`
3. `Agentic Care Companion`

Under the final stage, include these exact capability labels:
- `Appointment Support`
- `Medication Follow-Up`
- `Caregiver Coordination`
- `Task Reminders`

Style instructions:
- horizontal roadmap
- polished healthcare product style
- light background
- restrained, professional colors
- no fantasy visuals

**Figure Caption:**  
`Figure 9. Roadmap from structured questionnaire system to agentic care companion.`

---

## Slide 10: Future Work - Local Resource Discovery and Closing Vision

**Content:**  
- The platform could recommend nearby gyms, museums, therapy services, and community resources.
- Recommendations could be based on mobility, goals, and location.
- The long-term vision is a platform that helps users identify and act on the right next steps.

**Figure to Use:**  
AI-generate this figure unless you have a custom mockup.

**AI Figure Instructions:**  
Generate a realistic web-app concept screen showing:
- a small map panel
- nearby results for `Gym`, `Museum`, `Community Center`, and `Physical Therapy`
- a side panel labeled `Recommended for You`
- a subtitle indicating recommendations are based on mobility, goals, and location

Style instructions:
- realistic web dashboard concept
- clean and minimal
- match a healthcare-tech product, not a travel app
- avoid generic clip-art map pins

**Figure Caption:**  
`Figure 10. Concept for location-aware community resource discovery and next-step support.`

---

## Screenshot Capture Checklist

Use real screenshots from these exact pages where noted:
- `/`
- `/signup`
- `/signin`
- `/home`
- `/questionnaire`
- `/ai-chatbot`

## Rule for Building the Slides

- Prefer real website screenshots wherever the current product already shows the feature.
- Only use AI-generated figures for architecture, roadmap, or future-state concepts that do not yet exist as website screens.
- Keep visuals clean and readable at slide size.
- Do not add extra figures beyond the ten listed above unless needed for layout.
- Follow the professional minimal style guide above across all ten slides.
