# How to Automate Weekly Reports Without Losing Trust in the Data

**How Work Runs · Operational Friction Atlas**
https://howworkruns.com/friction-atlas/manual-weekly-reporting/

This worksheet describes a fictional process and a possible redesign. It is not a measured case study or a prediction of time saved. Replace these assumptions with observations from your own team.

## Recognize the symptoms
- [ ] A report requires someone to fix the same naming issues each week.
- [ ] Stakeholders debate totals before discussing decisions.
- [ ] Nobody can reproduce last week's reported number from the available source files.

## Current state: trace the work
1. **Analyst**: Downloads three exports. Inconsistent labels.
2. **Spreadsheet**: VLOOKUPs and manual cleanup. Unmatched rows.
3. **Lead**: Questions totals. Reconciliation round.
4. **Team**: Receives slide summary. Data already aging.
What happened in three recent cases? Who was waiting, who decided, and where did the information change?
Case 1:
Case 2:
Case 3:

## Possible future state
1. **Sources**: Publish defined extracts. Each field has an owner.
2. **Validation**: Checks IDs and expected totals. Exceptions isolated.
3. **Shared view**: Calculates agreed measures. Refresh time visible.
4. **Lead**: Reviews outliers and decisions. No rebuild from scratch.

Why the redesign might help: Before building the report, I'd document which records belong in it, how they're identified, when the data is refreshed and who investigates a surprising number. Once that is agreed, the repetitive preparation can be automated without hiding the exceptions people still need to review.

## Investigation
Take the last two reports and list the manual changes made before they were sent. Was someone formatting, matching records, fixing source errors, applying a rule or exercising judgment? Formatting and stable transformations are candidates for automation; arguments about what the numbers mean need to be settled first.

## Changes to test
1. **Write metric definitions**: For each measure, specify the numerator, denominator, filters, exclusion rules and refresh frequency.
2. **Give entities stable keys**: Prefer IDs that survive renaming, especially for clients, projects, events and employees.
3. **Validate before publishing**: Check counts, missing matches, duplicates and unusual jumps. A failed validation should be visible, not silently ignored.
4. **Separate data from narrative**: Let the data pipeline prepare a repeatable view while the accountable lead explains what changed and what action is needed.

## Baseline and measures
- **Preparation time:** Hours spent gathering, cleaning and reconciling before publication.
  Baseline: _______    After test: _______
- **Correction rate:** Number of reported figures revised after stakeholder review.
  Baseline: _______    After test: _______
- **Decision latency:** Time from data availability to a meaningful action or escalation.
  Baseline: _______    After test: _______

## An experiment
For the next two reports, use one set of metric definitions and a short validation checklist. Keep a visible list of exceptions rather than correcting them silently; if the definitions remain consistent, automate the repeated preparation and compare the time spent and corrections required.

Start date: _______   Review date: _______
Owner: _______
What would convince us to keep, adjust or stop the change?
_________________________________________________

## Risks and exceptions to check
Automating reports can create false confidence when upstream systems change fields or data arrives late. Display the last refresh, define acceptable lag and preserve an easy way to inspect the underlying rows. For scripts, check product limits and execution quotas before relying on scheduled refreshes.

## A smaller alternative
If the team only produces an occasional report, a consistent export format and a validation tab might be enough. I'd consider a full dashboard when people need the information frequently enough that rebuilding it has become a real burden.

**Source:** How Work Runs, The Operational Friction Atlas, published November 11, 2026.
