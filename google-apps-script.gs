function createResponsePage(title, message) {
  return HtmlService.createHtmlOutput(
    `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; color: #222; margin: 2rem; }
          h1 { color: #1a202c; }
          p { line-height: 1.6; }
          a { color: #1a73e8; text-decoration: none; }
          .card { max-width: 42rem; padding: 1.5rem; border: 1px solid #ddd; border-radius: 12px; background: #fff; box-shadow: 0 16px 32px rgba(0,0,0,.08); }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>${title}</h1>
          <p>${message}</p>
          <p><a href="https://thedeans.site/rsvp.html" target="_blank">Return to the RSVP page</a></p>
        </div>
      </body>
    </html>`
  );
}

function doGet(e) {
  return createResponsePage('RSVP endpoint is ready.', 'The RSVP endpoint is available. Submit the form from the wedding website.');
}

function doPost(e) {
  try {
    const spreadsheetId = '1MN8rDdoNkDo9166J5a-NoStxBghyxvqG04LdOv9GLhM';
    const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName('Sheet1') || SpreadsheetApp.openById(spreadsheetId).getSheets()[0];

    const payload = (() => {
      if (!e.postData || !e.postData.contents) {
        return e.parameter || {};
      }

      try {
        return JSON.parse(e.postData.contents);
      } catch (error) {
        return e.parameter || {};
      }
    })();

    const values = {
      timestamp: new Date().toISOString(),
      name: payload.name || '',
      email: payload.email || '',
      attending: payload.attending || '',
      welcome_drinks: payload.welcome_drinks ? 'Yes' : 'No',
      sunday_beach_club: payload.sunday_beach_club ? 'Yes' : 'No',
      notes: payload.notes || ''
    };

    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    if (headers.length === 0 || headers.every((value) => !value)) {
      sheet.appendRow(['Timestamp', 'Name', 'Email', 'Attending', 'Welcome Drinks', 'Sunday Beach Club', 'Notes']);
    }

    const rowValues = [
      values.timestamp,
      values.name,
      values.email,
      values.attending,
      values.welcome_drinks,
      values.sunday_beach_club,
      values.notes
    ];

    sheet.appendRow(rowValues);

    return createResponsePage('RSVP Submitted', 'Your RSVP has been received and the spreadsheet has been updated.');
  } catch (error) {
    return createResponsePage('Submission Error', `There was an issue saving your RSVP: ${error.message}`);
  }
}
