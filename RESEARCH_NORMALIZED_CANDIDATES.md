# Normalized Candidate Pool for Phases 3-5

Lead normalization on 2026-06-17. This preserves distinct user outcomes while merging naming variants across the four Phase 2 reports. Detailed fields, evidence, flows, and risks remain in `RESEARCH_PHASE2_ACCESSIBILITY.md`, `RESEARCH_PHASE2_GERIATRIC.md`, `RESEARCH_PHASE2_WORKFLOW.md`, and `RESEARCH_PHASE2_INNOVATION.md`.

## N1. Assisted Narrative-to-Form Draft

Maps an older adult's typed or spoken account into a small set of source-linked questionnaire field drafts, requiring per-field approval before reversible writes. L2 draft / L3 confirmed write. Source: Accessibility C1; Workflow C1 subset.

## N2. Guided Completion and Recovery Companion

Uses deterministic remaining-item/save/error signals plus optional language interpretation to offer one-question mode, reliable checkpoint/resume, precise recovery, and bounded confirmed edits. It must not infer cognitive impairment. Mostly ordinary UI/rules, with narrow L1/L2 AI phrasing and L3 reversible navigation/save. Source: Accessibility C2; Workflow C1; Innovation Quiet Rescue Mode.

## N3. Plain-Language Readback and Readiness Check

Produces source-cited summaries of the user's own answers, runs deterministic missing/format/duplicate/conflict checks, and asks neutral clarifications before review or sharing. It explains entries, not medical meaning. L0/L1 and L2 correction drafts. Source: Accessibility C3; Geriatric G1.

## N4. What-Matters-Led Visit Preparation Packet

Lets the user select priorities, then drafts an editable, source-cited agenda with a verified medication list, up to three questions, 4Ms notes, accessibility needs, and blank notes space. Print/download is L3 after preview; any send is a separate future confirmation. Manual appointment metadata/reminder may be an optional later slice. Source: Accessibility C4; Geriatric G2; Workflow C3; Innovation Appointment-Aware Visit Pack.

## N5. Medication List Verification and Question Prep

Builds a provenance-aware comparison of what the user entered, what a user-confirmed label/source says, and what the person reports taking; flags only factual mismatches or incompleteness and drafts questions for a pharmacist/clinician. It never chooses a correct regimen or recommends changes. L2 drafts / L3 confirmed record correction. Source: Geriatric G3; Workflow C2; Innovation Medication Truth Table.

## N6. Longitudinal 4Ms Change Review

Compares user-selected immutable snapshots, shows deterministic field-level changes and provenance, lets the user annotate them, and prepares a neutral change brief. No diagnosis, risk scoring, or hidden caregiver alert. L0/L1, with L2/L3 confirmed snapshot annotations/export. Source: Geriatric G4; Workflow C4; Innovation Four-M Change Lens.

## N7. Consent-Governed Care Circle Task

Translates an explicit help request into a least-privilege, time-limited task for a verified support person; previews exact fields and permissions, permits comment/propose-only changes, requires owner approval, and provides audit/revoke. No authorization arises from a stored caregiver email alone. L2/L3; L4 only in a later pre-authorized recurring scope. Source: Accessibility C5; Geriatric G5; Workflow C5; Innovation Consent Capsule.

## N8. What-Matters Goal and Reminder Steward

Turns one user-chosen goal or questionnaire-resumption need into a small plan and privacy-safe reminder preview; deterministic scheduling delivers only after explicit consent, with quiet hours, pause/delete, expiry, idempotency, and audit. No medication-dose instruction, adherence surveillance, or nonresponse escalation. L2/L3; bounded L4 recurring reminders later. Source: Accessibility C6; Workflow C6.

## N9. After-Visit Follow-Through Organizer

Converts user-pasted or manually entered after-visit text into a source-linked draft checklist of administrative follow-ups, requires item-by-item approval, and schedules optional reminders. Clinical instructions and medication changes are displayed as source text for verification, never interpreted into new advice. L2/L3, later bounded L4. Source: Geriatric G7; Innovation After-Visit Closed Loop.

## N10. Local Support Navigator and Warm Handoff

Matches an explicit user need and coarse/manual location to a curated, dated resource directory; explains eligibility/uncertainty, prepares a minimal contact draft, and contacts only after service/recipient/data confirmation. L1/L2/L3. No background location or autonomous booking. Source: Workflow C7.

## N11. Door-to-Door Mobility Plan

Combines user-entered destination, mobility preferences, transport/venue facts, and a backup plan into a source-stamped trip checklist. MVP uses manual facts and makes no safety claim; external maps/transit/weather are later, and no paid booking or continuous tracking occurs. L2/L3. Source: Innovation Door-to-Door Mobility Plan.

## N12. Shared-Decision Conversation Builder

Creates a values-and-questions worksheet from user-selected priorities and a qualified, clinically reviewed decision aid. MVP is generic and does not compare treatments; decision-specific option comparison is research-only pending source governance and evaluation. L0/L1/L2. Source: Geriatric G6.

## Explicit non-candidates retained for dissent

The discovery agents rejected: diagnosis or risk prediction; medication changes or an AI-selected “correct” regimen; autonomous emergency triage; voice-based mood/cognition inference; passive gait/fall detection; always-on location/caregiver surveillance; unverified web-resource search; autonomous EHR messaging/booking/purchases; emotion/avatar companionship; streaks/badges; synthetic family voices; and digital-twin/decline scores. Ordinary WCAG, labeling, save reliability, scanner correctness, authentication, consent, and privacy work are prerequisites, not AI features.
