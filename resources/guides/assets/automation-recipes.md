# Ten automations worth building for a small team

These are implementation recipes. Test against your systems and access policies before using real data.

## 01. Route incoming requests

**Trigger:** New form submission

**Inputs:** Intake form response with request type, contact and requested date

**Workflow:**
1. Validate required fields and create one stable request ID.
2. Apply agreed category-to-owner rules; unrecognized categories go to a triage queue.
3. Write the request to the shared tracker and acknowledge receipt with the ID.

**Guardrails:** Duplicate submissions; missing owner rule; inconsistent dates.

**Measure:** Share of requests assigned correctly without manual intervention.

## 02. Keep two systems in sync

**Trigger:** Approved change to an authoritative record

**Inputs:** Record ID, changed fields and source system

**Workflow:**
1. Confirm which system owns each field.
2. Update only allowed fields on the destination using the stable record ID.
3. Log the outcome; queue conflicts for a person instead of silently overwriting.

**Guardrails:** Circular updates; missing IDs; simultaneous edits.

**Measure:** Number of corrections or mismatches per week.

## 03. Send targeted overdue nudges

**Trigger:** Scheduled daily check

**Inputs:** Open requests, due dates, owners, current status

**Workflow:**
1. Select open requests whose due date has passed.
2. Group them by accountable owner; send one concise digest rather than a message per item.
3. Exclude paused or blocked requests when the owner is already handling the exception.

**Guardrails:** Incorrect due dates; noisy reminders; wrong recipient.

**Measure:** Overdue items resolved and messages sent per owner.

## 04. Start onboarding from one approved trigger

**Trigger:** Signed agreement recorded

**Inputs:** Client ID, scope, start date, delivery owner

**Workflow:**
1. Check whether the client setup already exists.
2. Create the appropriate checklist from an approved template.
3. Ask the delivery owner to accept the handoff before any client-facing action.

**Guardrails:** Scope mismatch; duplicate client; missing agreement.

**Measure:** Time from accepted handoff to ready-for-delivery.

## 05. Prepare a weekly exceptions digest

**Trigger:** Friday reporting cut-off

**Inputs:** Open, blocked, overdue and unassigned requests

**Workflow:**
1. Pull the agreed fields from the shared record.
2. Group exceptions with owner and next action; include source links.
3. Have a team lead approve the message before distribution.

**Guardrails:** Stale data; missing owner; incorrect timezone.

**Measure:** Minutes spent preparing weekly status updates.

## 06. Create tasks from structured intake

**Trigger:** Approved project request

**Inputs:** Request ID, template type, priority, due date

**Workflow:**
1. Map the request type to a known task list.
2. Create tasks using the request ID plus step ID as a deduplication key.
3. Return created task links to the original request.

**Guardrails:** Template drift; missing assignee; repeated webhook events.

**Measure:** Tasks created accurately on first pass.

## 07. Check the completeness of handoffs

**Trigger:** Owner marks a handoff ready

**Inputs:** Required document links, scope, dates and responsible team

**Workflow:**
1. Check that required fields are present and linked files are accessible to the next team.
2. Highlight conflicts and missing information for the sender.
3. Only mark accepted when the receiving owner confirms readiness.

**Guardrails:** Links behind permission walls; stale contract version.

**Measure:** Handoffs accepted without clarification and time spent chasing.

## 08. Convert meeting commitments into draft tasks

**Trigger:** Meeting recap approved

**Inputs:** Reviewed notes with action, one owner and due date

**Workflow:**
1. Extract potential tasks into a draft list, keeping the source passage.
2. Have the meeting owner correct the list and confirm disputed items.
3. Create tasks with a stable meeting-item ID and link the source.

**Guardrails:** AI-invented commitments; private meeting content; missing owners.

**Measure:** Accepted task accuracy and follow-up clarification messages.

## 09. Flag likely duplicates before they create work

**Trigger:** New contact, request or vendor record

**Inputs:** Normalized name, email, reference number and date

**Workflow:**
1. Compare stable identifiers first, then optional fuzzy matches.
2. Suggest possible duplicates to a human reviewer; do not delete automatically.
3. Record the merge decision and preserve an audit trail.

**Guardrails:** Different people with similar names; changed emails; irreversible merges.

**Measure:** Verified duplicates caught and false-positive rate.

## 10. Triage customer feedback into accountable follow-up

**Trigger:** Feedback form or survey response

**Inputs:** Feedback text, account ID, severity and consent/access rules

**Workflow:**
1. Apply a simple rule-based severity classification before considering AI.
2. Create a follow-up item with owner and required response date.
3. Escalate sensitive or ambiguous language to a person for review.

**Guardrails:** Private customer data; inaccurate severity; missing context.

**Measure:** Time to first response and correctly routed cases.
