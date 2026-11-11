# How to Prevent Scheduling Conflicts Across Teams and Time Zones

**How Work Runs · Operational Friction Atlas**
https://howworkruns.com/friction-atlas/global-scheduling-chaos/

This worksheet describes a fictional process and a possible redesign. It is not a measured case study or a prediction of time saved. Replace these assumptions with observations from your own team.

## Recognize the symptoms
- [ ] Calendar invitations and planning sheets disagree after an assignment change.
- [ ] The same session appears twice under slightly different names.
- [ ] Coordinators manually compare schedules before trusting them.

## Current state: trace the work
1. **Coordinator** — Changes delivery spreadsheet. Assignment updated.
2. **Employee** — Manually edits old event. May miss one calendar.
3. **Another employee** — Creates new invitation. Duplicate session possible.
4. **Facilitator** — Sees conflicting schedule. Manual clarification.
What happened in three recent cases? Who was waiting, who decided, and where did the information change?
Case 1:
Case 2:
Case 3:

## Possible future state
1. **Plan** — Keeps stable session ID. Time zone and owner explicit.
2. **Validator** — Checks changes and collisions. Flags incomplete assignment.
3. **Sync process** — Updates existing event ID. No duplicate creation.
4. **People** — Review exception log. Calendar views reconcile.

Why the redesign might help: The redesign separates the planning decision from the mechanical propagation of that decision. Session IDs anchor the records, time zones are stored deliberately, and changes update existing events rather than creating parallel versions.

## Investigation
Select a dozen recently moved, canceled or reassigned sessions. Trace the original ID, source time zone, current assigned facilitator, calendar event ID and history of updates. Note whether the mismatch came from missing IDs, unclear ownership or an unsupported change type.

## Changes to test
1. **Define event identity** — Give every unique session a stable ID that does not change when the title, host or start time changes.
2. **Normalize time zones** — Record the session start with an explicit time zone or UTC equivalent, and distinguish the event's home zone from the viewer's display zone.
3. **Make updates idempotent** — A repeated synchronization run should find and update the corresponding calendar event rather than creating another one.
4. **Track exceptions** — Record failures, conflicts and canceled sessions in a reviewable queue. Include a safe manual recovery procedure.

## Baseline and measures
- **Mismatch count:** Number of planned sessions whose calendar details disagree with the authoritative plan.
  Baseline: _______    After test: _______
- **Duplicate events:** Sessions with more than one active invitation when only one is expected.
  Baseline: _______    After test: _______
- **Change handling effort:** Time spent reconciling reassignment, postponement or cancellation.
  Baseline: _______    After test: _______

## An experiment
Create a sandbox with ten fictional sessions, then move, cancel and reassign several of them. Run the sync twice, including after a simulated failure, and verify that exactly the expected event records remain. This tests correctness before anyone trusts the automation with a live schedule.

Start date: _______   Review date: _______
Owner: _______
What would convince us to keep, adjust or stop the change?
_________________________________________________

## Risks and exceptions to check
Calendar APIs, invitation ownership, external attendees and time-zone transitions introduce edge cases. Daylight saving changes and recurring events need explicit tests, and an automated sync must not overwrite a legitimate human adjustment without a defined ownership rule. A published schedule may also require a notification protocol when it changes.

## A smaller alternative
For a handful of events, a careful checklist may be enough. As volume increases, the value of synchronization rises, but only if the team is prepared to maintain event identity, permissions, quotas and failure monitoring.

**Source:** How Work Runs, The Operational Friction Atlas, published November 11, 2026.
