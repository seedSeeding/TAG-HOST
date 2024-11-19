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


function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function convertScarfData(data) {
  return data
    .filter(item => item.ID)
    .map(item => ({
      pattern_number: String(item.ID),
      name: item.NAME,
      category: String(item.CATEGORY).toLowerCase(),
      brand: item.BRAND,
      outer_material: item.OUTER_MATERIAL,
      lining_material: item.LINING_MATERIAL,
      approval_state: String(item.STATUS).toLowerCase(),
      submit_date: formatDate(new Date(item["SUBMIT DATE"])),
      approval_time: formatDate(new Date(item["APPROVAL DATE"])),
      size: getSize(item.SIZE),
      body: {
        length: parseFloat(item.BODY_LENGTH),
        width: parseFloat(item.BODY_WIDTH)
      },
      fringers: {
        length: parseFloat(item.FRINGES_LENGTH),
        width: parseFloat(item.FRINGES_WIDTH)
      },
      edges: {
        length: parseFloat(item.EDGES_LENGTH),
        width: parseFloat(item.EDGES_WIDTH)
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

async function getScarfDataFromExcel() {
  try {
    const response = await fetch('/data.xlsx');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const arrayBuffer = await response.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);
    const workbook = xlsx.read(data, { type: 'array' });

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets['Scarves'];

    if (!worksheet) {
      throw new Error('Could not find the worksheet');
    }

    const jsonData = xlsx.utils.sheet_to_json(worksheet, { defval: '' });
    const convertedData = convertScarfData(jsonData);
    saveJSONToFile(convertedData, 'scarvesData.json');
  } catch (error) {
    console.error('Error accessing the file:', error);
  }
}

export const getScarfData = getScarfDataFromExcel;

async function getJsonData() {
  try {
    const response = await fetch('files/scarvesData.json');
    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching JSON data:', error);
    return null;
  }
}

export const getHatsDataFromExcelScarves = getJsonData;