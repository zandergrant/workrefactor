# When a Spreadsheet Becomes an App: Signs and Better Options

**How Work Runs · Operational Friction Atlas**
https://howworkruns.com/friction-atlas/spreadsheet-becomes-an-app/

This worksheet describes a fictional process and a possible redesign. It is not a measured case study or a prediction of time saved. Replace these assumptions with observations from your own team.

## Recognize the symptoms
- [ ] A spreadsheet depends on cell color or tab position to define important business rules.
- [ ] Different users need genuinely different permissions or editing rights.
- [ ] Employees avoid a sheet because a mistake can break unrelated work.

## Current state: trace the work
1. **Employee**: Adds a row to regional tab. Fields vary by region.
2. **Formula**: Infers status from cells. One edit can break rule.
3. **Manager**: Copies rows into report. Parallel truth.
4. **Colleague**: Asks what changed. No clear audit history.
What happened in three recent cases? Who was waiting, who decided, and where did the information change?
Case 1:
Case 2:
Case 3:

## Possible future state
1. **Employee**: Uses clear input form. Required fields validated.
2. **Shared data**: Stores stable records. One ID and defined statuses.
3. **Role-based view**: Shows appropriate actions. Permissions enforced in app.
4. **Manager**: Reads decision dashboard. Changes and exceptions visible.

Why the redesign might help: I'd start with clear fields, stable IDs, named owners and a history of important changes. If people still struggle to complete their tasks, a focused interface could make the work easier without replacing all the systems underneath it.

## Investigation
Ask an occasional user to complete three ordinary tasks while you watch, without explaining the workbook as they go. Notice when they have to inspect hidden columns, move between tabs or ask whether a change is allowed; those moments tell you much more than the number of rows in the file.

## Changes to test
1. **Simplify the record**: Define columns, field types, required values, stable identifiers and a small status model. Remove unused tabs and ambiguous colors.
2. **Separate data from workflow**: Decide which steps need validation, access control, an approval or a documented exception rather than another formula.
3. **Compare options**: Test whether a protected sheet, form or configured platform solves the need before estimating a custom interface.
4. **Pilot with real cases**: If building a web app, test simultaneous edits, permissions, invalid values, failures and recovery before replacing the familiar tool.

## Baseline and measures
- **Time to complete a task:** How long a new or occasional user needs to update a record correctly.
  Baseline: _______    After test: _______
- **Correction effort:** Frequency and cost of fixing edits, formulas or copied information.
  Baseline: _______    After test: _______
- **Support burden:** How often an expert has to explain the sheet or repair it.
  Baseline: _______    After test: _______

## An experiment
Clean up one part of the workbook, with consistent fields, validation and a simple input form, then ask two occasional users to complete real cases. Compare errors and questions with the current version; if the remaining problems are mostly about the interface or permissions, an app may be worth considering.

Start date: _______   Review date: _______
Owner: _______
What would convince us to keep, adjust or stop the change?
_________________________________________________

## Risks and exceptions to check
A web front end does not automatically create secure permissions, an audit trail or dependable synchronization. When using Sheets and Apps Script, check execution quotas, account access, backups and concurrency expectations. For confidential or high-volume data, a database-backed design may be more appropriate.

## A smaller alternative
A spreadsheet may still be the right choice when the process changes frequently and the team benefits from seeing the underlying records. A cleaner structure, protected formulas and a form may solve the problem without the cost of another application.

**Source:** How Work Runs, The Operational Friction Atlas, published November 11, 2026.
