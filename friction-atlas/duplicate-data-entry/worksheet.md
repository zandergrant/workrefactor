# How to Stop Duplicate Data Entry Between Business Systems

**How Work Runs · Operational Friction Atlas**
https://howworkruns.com/friction-atlas/duplicate-data-entry/

This worksheet describes a fictional process and a possible redesign. It is not a measured case study or a prediction of time saved. Replace these assumptions with observations from your own team.

## Recognize the symptoms
- [ ] Employees say they always compare two screens before making a decision.
- [ ] A change made in one system routinely creates a follow-up message.
- [ ] The team cannot explain which application owns a customer's latest address.

## Current state: trace the work
1. **Customer** — Submits job form. Customer address entered.
2. **Dispatcher** — Copies details into sheet. Second address copy.
3. **Coordinator** — Re-enters delivery tool. Third address copy.
4. **Anyone** — Updates whichever record is open. Versions diverge.
What happened in three recent cases? Who was waiting, who decided, and where did the information change?
Case 1:
Case 2:
Case 3:

## Possible future state
1. **Customer** — Submits structured request. Creates one request ID.
2. **Shared record** — Validates core fields. Authoritative address stored.
3. **Integration** — Passes ID and required fields. Downstream record linked.
4. **Owner** — Corrects source record. Downstream update is checked.

Why the redesign might help: The improvement is not simply fewer keystrokes. One record becomes the source of truth for each field, and the other tools use stable identifiers to reference it. That gives the team a way to distinguish a missing update from a genuine difference in the data.

## Investigation
Take five recently changed customer records and trace the exact point where each field was first captured. For every subsequent update, write down the person, system, reason and timestamp. The map will reveal whether you have a copying problem, an ownership problem, or both.

## Changes to test
1. **Name the authority** — Choose one system that owns each field, such as customer contact details or job status. Different fields can have different owners, but each field needs a defined rule.
2. **Use stable identifiers** — Join records with a unique ID rather than comparing names or email addresses. Decide what happens when an old record has no ID.
3. **Connect one direction first** — Start with a single, observable transfer of the fields another tool needs. Record successful, rejected and repeated attempts instead of assuming delivery.
4. **Rehearse corrections** — Change a sample address, remove a required value and submit the same event twice. Make sure the destination either updates predictably or tells someone what failed.

## Baseline and measures
- **Repeat entry:** Count how often a person retypes a field that already exists in another system.
  Baseline: _______    After test: _______
- **Mismatch rate:** Sample records with recent changes and count conflicting values across tools.
  Baseline: _______    After test: _______
- **Recovery effort:** Track the time required to identify and repair a failed or duplicated transfer.
  Baseline: _______    After test: _______

## An experiment
Run one week of requests through the current process, recording repeat entry and conflicting edits. Then connect a single downstream handoff with stable IDs and an exception log. Compare accepted records and correction effort, not just how many messages the automation sent.

Start date: _______   Review date: _______
Owner: _______
What would convince us to keep, adjust or stop the change?
_________________________________________________

## Risks and exceptions to check
Bidirectional synchronization is not automatically better. Without a conflict rule, two employees can overwrite each other, and a failed webhook can leave the systems inconsistent. If the software has no dependable integration or access permissions are unclear, a structured export and scheduled reconciliation may be the safer first step.

## A smaller alternative
For a very small team, a single well-designed sheet may be enough. The important choice is not whether the data lives in a spreadsheet or database, but whether employees can tell which record they should change and whether the next person sees that change.

**Source:** How Work Runs, The Operational Friction Atlas, published November 11, 2026.
