# Request Desk — Apps Script starter setup

This is an internal, sheet-backed starter project. It is a functional example, not a production-ready application. Test with fictional data first.

## 1. Create the sheet
Create a new Google Spreadsheet. From **Extensions → Apps Script**, add:
- `Code.gs` (Apps Script server code)
- `Index.html` (HTML UI)
- `Styles.html` (separate stylesheet, including its `<style>` wrapper)
- `Client.html` (separate client JavaScript, including its `<script>` wrapper)

Paste the complete contents of the four included files.

## 2. Initialize
Choose `setupRequestSheet` in the Apps Script editor, run it, and grant only the permissions your team approves. It creates or validates a `Requests` tab with this exact column order:

`ID | Created At | Updated At | Request | Category | Owner | Priority | Status | Due Date | Next Action`

## 3. Test before deployment
1. Run `setupRequestSheet`, then inspect the sheet.
2. In Apps Script, use the built-in web app test deployment, and add a fictional request.
3. Change the owner or status and confirm the corresponding spreadsheet row changes.
4. Edit a field directly in the sheet. Refresh the web app and confirm the updated value appears.
5. Confirm invalid statuses and duplicate IDs are rejected.

## 4. Deploy securely
Use **Deploy → New deployment → Web app**. Prefer access limited to appropriate Google Workspace accounts. Do not allow public anonymous access to a spreadsheet containing business data. If you choose **Execute as me**, understand that visitors may be able to operate with the script owner's permissions. Review the organization's access policies before deploying.

## Limitations
- No row-level authorization, end-user identity audit, approval policy, or automated backup.
- Spreadsheet operations are not a substitute for a transactional database.
- Concurrent edits can overwrite changes if the team does not coordinate; the example uses a lock for server writes but does not implement version conflict checks.
- The code validates basic fields, but organizational security review and access controls are still required.
- The browser demo on the public guide page is separate and uses fictional in-memory data. It does not access this starter project.

Official references:
- https://developers.google.com/apps-script/guides/html
- https://developers.google.com/apps-script/guides/html/best-practices
- https://developers.google.com/apps-script/guides/web
