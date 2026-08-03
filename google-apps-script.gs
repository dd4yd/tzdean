function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ message: 'RSVP endpoint is ready.' }))
    .setMimeType(ContentService.MimeType.JSON);
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

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
