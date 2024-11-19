import * as xlsx from 'xlsx';

function getSizeId(size) {
  return size === 'S' ? 1 : size === 'M' ? 2 : size === 'L' ? 3 : size === 'XL' ? 4 : null;
}

function convertExcelDate(serial) {
  const excelBaseDate = new Date(Date.UTC(1899, 11, 30));
  const date = new Date(excelBaseDate.getTime() + (serial * 86400 * 1000));
  return date;
}

function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function convertData(data) {
  return data
    .filter(item => item.PATTERN_ID)
    .map(item => {
      const sizeId = getSizeId(item.SIZE);
      const reasonParts = item.Reasons ? item.Reasons.split(',') : [];
      const [selectedPart, selectedMeasurement, selectedIssue] = reasonParts;

      return {
        pattern_number: String(item.PATTERN_ID),
        size_id: sizeId,
        approval_state: String(item['Status']).toLowerCase(),
        reason: `${selectedPart || ''},${selectedMeasurement || ''},${selectedIssue || ''}`,
        
      };
    });
}

function saveJSONToFile(data, filename) {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function getDataFromExcel() {
  try {
    const response = await fetch('/data.xlsx');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const arrayBuffer = await response.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);
    const workbook = xlsx.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets['Revisions'];

    if (!worksheet) {
      throw new Error('Could not find the worksheet');
    }

    const jsonData = xlsx.utils.sheet_to_json(worksheet, { defval: '' });
    const convertedData = convertData(jsonData);
    saveJSONToFile(convertedData, 'revisions.json');
  } catch (error) {
    console.error('Error accessing the file:', error);
  }
}

export const getExcelDataRevisons = getDataFromExcel;

async function getJsonData() {
  try {
    const response = await fetch('files/revisions.json');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching JSON data:', error);
    return null;
  }
}

export const getDataFromExcelRevisons = getJsonData;
