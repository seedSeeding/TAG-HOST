import * as xlsx from 'xlsx';

function getSize(size) {
  return size === 'S' ? 'small' : size === 'M' ? 'medium' : size === 'L' ? 'large' : 'x-large'; 
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
    .map(item => ({
      pattern_number: String(item.PATTERN_ID),
      name: item["DESIGN NAME"],
      category: String(item.CATEGORY).toLowerCase(),
      brand: item.BRAND,
      outer_material: item["OUTER MATERIAL"],
      lining_material: item["LINING MATERIAL"],
      approval_state: String(item['Status']).toLowerCase(),
      submit_date: formatDate(convertExcelDate(item["Submit Date"])),
      approval_time: formatDate(convertExcelDate(item["Approval Date"])),
      size: getSize(item.SIZE).toLowerCase(),
      palm_shell: {
        length: item["Palm Shell (Length)"],
        width: item["Palm Shell (Width)"]
      },
      back_shell: {
        length: item["Back Shell (Length)"],
        width: item["Back Shell (Width)"]
      },
      palm_thumb: {
        length: item["Palm Thumb (Length)"],
        width: item["Palm Thumb (width)"]
      },
      back_thumb: {
        length: item["Back Thumb (Length)"],
        width: item["Back Thumb (Width)"]
      },
      index_finger: {
        length: item["Index Finger (Length)"],
        width: item["Index Finger (Width)"]
      },
      middle_finger: {
        length: item["Middle Finger (Length)"],
        width: item["Middle Finger (Width)"]
      },
      ring_finger: {
        length: item["Ring Finger (Length)"],
        width: item["Ring Finger (Width)"]
      },
      little_finger: {
        length: item["Little Finger (Length)"],
        width: item["Little Finger (Width)"]
      },
      wrist: {
        length: item["Wrist (Length)"],
        width: item["Wrist (Width)"]
      }
    }));
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
    const worksheet = workbook.Sheets[sheetName];

    if (!worksheet) {
      throw new Error('Could not find the worksheet');
    }

    const jsonData = xlsx.utils.sheet_to_json(worksheet, { defval: '' });
    const convertedData = convertData(jsonData);
    saveJSONToFile(convertedData,'glovesData');
    //return convertedData;
  } catch (error) {
    console.error('Error accessing the file:', error);
  }
}

export const getExcelDataGloves = getDataFromExcel;

async function getJsonData() {
  try {
    const response = await fetch('files/glovesData.json');
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

export const getDataFromExcelGloves = getJsonData;
