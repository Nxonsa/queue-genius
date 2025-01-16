import { google } from 'googleapis';

export const appendToSheet = async (
  sheetsUrl: string,
  data: { name: string; phone: string; timestamp: string }
) => {
  try {
    const spreadsheetId = extractSpreadsheetId(sheetsUrl);
    if (!spreadsheetId) {
      console.error('Invalid Google Sheets URL');
      return false;
    }

    // This would normally use OAuth2 credentials
    // For now, we'll just log the data
    console.log('Marketing data to be saved:', data);
    return true;
  } catch (error) {
    console.error('Error appending to sheet:', error);
    return false;
  }
};

const extractSpreadsheetId = (url: string): string | null => {
  const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
};