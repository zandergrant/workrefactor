# When a Spreadsheet Becomes an App: Signs and Better Options

**How Work Runs · Operational Friction Atlas**
https://howworkruns.com/friction-atlas/spreadsheet-becomes-an-app/

This worksheet describes a fictional process and a possible redesign. It is not a measured case study or a prediction of time saved. Replace these assumptions with observations from your own team.

## Recognize the symptoms
- [ ] A spreadsheet depends on cell color or tab position to define important business rules.
- [ ] Different users need genuinely different permissions or editing rights.
- [ ] Employees avoid a sheet because a mistake can break unrelated work.

## Current state: trace the work
1. **Employee** — Adds a row to regional tab. Fields vary by region.
2. **Formula** — Infers status from cells. One edit can break rule.
3. **Manager** — Copies rows into report. Parallel truth.
4. **Colleague** — Asks what changed. No clear audit history.
What happened in three recent cases? Who was waiting, who decided, and where did the information change?
Case 1:
Case 2:
Case 3:

## Possible future state
1. **Employee** — Uses clear input form. Required fields validated.
2. **Shared data** — Stores stable records. One ID and defined statuses.
3. **Role-based view** — Shows appropriate actions. Permissions enforced in app.
4. **Manager** — Reads decision dashboard. Changes and exceptions visible.

Why the redesign might help: A focused application is most useful when it improves the interaction around reliable records, not when it hides the same fragile spreadsheet behind a prettier screen. Stable fields, ownership and change history come before visual polish.

## Investigation
Choose three ordinary tasks and ask a new colleague to complete them while you observe. Note when they need verbal instructions, inspect hidden columns, copy data between tabs or ask permission to edit. That reveals the specific interface problem more clearly than the total number of rows.

## Changes to test
1. **Simplify the record** — Define columns, field types, required values, stable identifiers and a small status model. Remove unused tabs and ambiguous colors.
2. **Separate data from workflow** — Decide which steps need validation, access control, an approval or a documented exception rather than another formula.
3. **Compare options** — Test whether a protected sheet, form or configured platform solves the need before estimating a custom interface.
4. **Pilot with real cases** — If building a web app, test simultaneous edits, permissions, invalid values, failures and recovery before replacing the familiar tool.

## Baseline and measures
- **Time to complete a task:** How long a new or occasional user needs to update a record correctly.
  Baseline: _______    After test: _______
- **Correction effort:** Frequency and cost of fixing edits, formulas or copied information.
  Baseline: _______    After test: _______
- **Support burden:** How often an expert has to explain the sheet or repair it.
  Baseline: _______    After test: _______

## An experiment
Create a cleaned-up version of one workflow tab with standard fields, validation and a simple form. Ask two occasional users to complete real cases, then compare mistakes, time and questions with the current sheet. Consider an app only if meaningful friction remains.

Start date: _______   Review date: _______
Owner: _______
What would convince us to keep, adjust or stop the change?
_________________________________________________

## Risks and exceptions to check
A web front end does not automatically create secure permissions, an audit trail or dependable synchronization. When using Sheets and Apps Script, check execution quotas, account access, backups and concurrency expectations. For confidential or high-volume data, a database-backed design may be more appropriate.

## A smaller alternative
Some teams genuinely benefit from spreadsheets because the workflow changes frequently and the data needs to be inspected directly. A simpler workbook with protected calculations and a form can be the right answer, even when a custom app is technically possible.

**Source:** How Work Runs, The Operational Friction Atlas, published November 11, 2026.
