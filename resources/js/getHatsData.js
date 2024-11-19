import * as xlsx from 'xlsx';


function getSize(size) {
  const sizes = {
    "small": ['Small', 'S', 's', 'SMALL', 'small'],
    "medium": ['Medium', 'M', 'm', 'MEDIUM', 'medium'],
    "large": ['Large', 'L', 'l', 'LARGE', 'large'],
    "x-large": ['X-Large', 'XL', 'xl', 'X-LARGE', 'x-large', 'XLARGE', 'xlarge'],
  };

  for (const [key, values] of Object.entries(sizes)) {
    if (values.includes(size)) {
      return String(key);
    }
  }

  return 'unknown'; 
}
function convertDate(value) {
  if (typeof value === 'number') {
    const excelBaseDate = new Date(Date.UTC(1899, 11, 30));
    const date = new Date(excelBaseDate.getTime() + (value * 86400 * 1000));
    return date;
  } else if (typeof value === 'string') {
    const [day, month, year] = value.split('/');
    return new Date(`${year}-${month}-${day}`);
  }
  return null;
}

function formatDate(date) {
  if (!date) return 'Invalid Date';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
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

function convertHatData(data) {
  return data
    .filter(item => item.ID)
    .map(item => ({
      pattern_number: String(item.ID),
      category: String(item.CATEGORY).toLowerCase(),
      brand: item.BRAND,
      name: item.NAME,
      outer_material: item["OUTER MATERIAL"],
      lining_material: item["LINING MATERIAL"],
      approval_state: String(item['Status']).toLowerCase(),
      submit_date: formatDate(convertDate(item["Submit Date"])),
      approval_time: formatDate(convertDate(item["Approval Date"])),
      size: getSize(item.SIZE),
      strap: {
        height: item["STRAP (HEIGHT)"],
        width: item["STRAP (WIDTH)"]
      },
      body_crown: {
        height: item["BODY CROWN (HEIGHT)"],
        width: item["BODY CROWN (WIDTH)"]
      },
      crown: {
        circumference: item["CROWN (CIRCUMFERENCE)"],
        diameter: item["CROWN (DIAMETER)"]
      },
      brim: {
        circumference: item["BRIM (CIRCUMFERENCE)"],
        diameter: item["BRIM (WIDTH)"]
      },
      bill: {
        length: item["BILL (LENGTH)"],
        width: item["BILL (WIDTH)"]
      }
    }));
}

async function getHatDataFromExcel() {
  try {
    const response = await fetch('/data.xlsx');
    if (!response.ok) throw new Error('Network response was not ok');
    
    const arrayBuffer = await response.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);
    const workbook = xlsx.read(data, { type: 'array' });
    
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets["Hats"];
    
    if (!worksheet) throw new Error('Could not find the worksheet');
    
    const jsonData = xlsx.utils.sheet_to_json(worksheet, { defval: '' });
    const convertedData = convertHatData(jsonData);
    saveJSONToFile(convertedData, 'hatsData.json');
  } catch (error) {
    console.error('Error accessing the file:', error);
  }
}

export const getHatsDataFromExcel = getHatDataFromExcel;

async function getJsonData() {
  try {
    const response = await fetch('files/hatsData.json');
    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching JSON data:', error);
    return null;
  }
}

export const getHatsData = getJsonData;
