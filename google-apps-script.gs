function doGet(e) {
  return HtmlService.createHtmlOutput('RSVP endpoint is ready.');
}

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1') || SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const row = [];

    const payload = e.postData && e.postData.contents ? JSON.parse(e.postData.contents) : (e.parameter || {});

    const values = {
      timestamp: new Date().toISOString(),
      name: payload.name || '',
      email: payload.email || '',
      attending: payload.attending || '',
      welcome_drinks: payload.welcome_drinks ? 'Yes' : 'No',
      sunday_beach_club: payload.sunday_beach_club ? 'Yes' : 'No',
      notes: payload.notes || ''
    };

    if (headers.length === 0) {
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

    return ContentService.createTextOutput(JSON.stringify({ success: true })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.message })).setMimeType(ContentService.MimeType.JSON);
  }
}
