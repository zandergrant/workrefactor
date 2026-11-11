# How to Stop Duplicate Data Entry Between Business Systems

**How Work Runs · Operational Friction Atlas**
https://howworkruns.com/friction-atlas/duplicate-data-entry/

This worksheet describes a fictional process and a possible redesign. It is not a measured case study or a prediction of time saved. Replace these assumptions with observations from your own team.

## Recognize the symptoms
- [ ] Employees say they always compare two screens before making a decision.
- [ ] A change made in one system routinely creates a follow-up message.
- [ ] The team cannot explain which application owns a customer's latest address.

## Current state: trace the work
1. **Customer**: Submits job form. Customer address entered.
2. **Dispatcher**: Copies details into sheet. Second address copy.
3. **Coordinator**: Re-enters delivery tool. Third address copy.
4. **Anyone**: Updates whichever record is open. Versions diverge.
What happened in three recent cases? Who was waiting, who decided, and where did the information change?
Case 1:
Case 2:
Case 3:

## Possible future state
1. **Customer**: Submits structured request. Creates one request ID.
2. **Shared record**: Validates core fields. Authoritative address stored.
3. **Integration**: Passes ID and required fields. Downstream record linked.
4. **Owner**: Corrects source record. Downstream update is checked.

Why the redesign might help: I'd start by giving each field one authoritative home, then linking the records through stable IDs. The other tools can still display the information, but there's a clear place to correct it; when something goes wrong, the team can trace which update failed.

## Investigation
I'd take five customer records that changed recently and follow each field from the original submission through every update. Who changed it, in which system, and why? Once you see the sequence, it's easier to tell whether the real issue is repeated entry, unclear ownership or both.

## Changes to test
1. **Name the authority**: Choose one system that owns each field, such as customer contact details or job status. Different fields can have different owners, but each field needs a defined rule.
2. **Use stable identifiers**: Join records with a unique ID rather than comparing names or email addresses. Decide what happens when an old record has no ID.
3. **Connect one direction first**: Start with a single, observable transfer of the fields another tool needs. Record successful, rejected and repeated attempts instead of assuming delivery.
4. **Rehearse corrections**: Change a sample address, remove a required value and submit the same event twice. Make sure the destination either updates predictably or tells someone what failed.

## Baseline and measures
- **Repeat entry:** Count how often a person retypes a field that already exists in another system.
  Baseline: _______    After test: _______
- **Mismatch rate:** Sample records with recent changes and count conflicting values across tools.
  Baseline: _______    After test: _______
- **Recovery effort:** Track the time required to identify and repair a failed or duplicated transfer.
  Baseline: _______    After test: _______

## An experiment
Track a week's requests, including how often people retype details or correct conflicting records. Then connect one handoff using stable IDs and a visible exception log, and compare the number of accurate records and the effort required to fix mistakes.

Start date: _______   Review date: _______
Owner: _______
What would convince us to keep, adjust or stop the change?
_________________________________________________

## Risks and exceptions to check
Bidirectional synchronization is not automatically better. Without a conflict rule, two employees can overwrite each other, and a failed webhook can leave the systems inconsistent. If the software has no dependable integration or access permissions are unclear, a structured export and scheduled reconciliation may be the safer first step.

## A smaller alternative
A small team may be perfectly well served by one carefully designed spreadsheet. What matters is that people know where to make a change and can trust that the next person will see it, whether the underlying system is a sheet or a database.

**Source:** How Work Runs, The Operational Friction Atlas, published November 11, 2026.
