import { height } from "@fortawesome/free-regular-svg-icons/faAddressBook";
const parseData = (data) => {
    return JSON.parse(data);
}
export const materialsObject = [{
    "leather": 0.197,
    "spandex": -0.459,
    "lycra": -0.459,
    "wool": 0.263,
    "canvas": 0.13,
    "silk": 0.13,
    "chiffon": 0.197,
    "denim": 0.263,
    "cordura": 0.067,
    "latex": -0.453,
    "nitrile": -0.442,
    "neoprene": -0.327,
    "vinyl": 0.197,
    "cotton": 0.327,
    "polyester": -0.13,
    "kevlar": 0,
    "polyurethane": -0.197,
    "rubber": -0.485,
    "syntheticLeather": 0.13,
    "microfiber": -0.13,
    "nylon": -0.197,
    "silicone": -0.525,
    "velvet": 0.197,
    "rayon": 0.263,
    "taffeta": 0.13,
    "tweed": 0.327,
    "fleece": 0.263,
    "goreTex": 0,
    "cashmere": 0.197,
    "fauxFur": 0.492
}];
export const materialList = [
    "Leather",
    "Spandex",
    "Lycra",
    "Wool",
    "Canvas",
    "Silk",
    "Chiffon",
    "Denim",
    "Cordura",
    "Latex",
    "Nitrile",
    "Neoprene",
    "Vinyl",
    "Cotton",
    "Polyester",
    "Kevlar",
    "Polyurethane",
    "Rubber",
    "Synthetic Leather",
    "Microfiber",
    "Nylon",
    "Silicone",
    "Velvet",
    "Rayon",
    "Taffeta",
    "Tweed",
    "Fleece",
    "Gore-Tex",
    "Cashmere",
    "Faux Fur"
];

// Function to get the size name based on the provided size_id
export const getSizeNameByID = (size_id) => {
    return size_id === 1 ? "Small" 
        : size_id === 2 ? "Medium" 
        : size_id === 3 ? "Large" 
        : "X-large";
}

export function saveJSONToFile(data, filename) {
    // Convert the JavaScript object to a JSON string with indentation for readability.
    const jsonString = JSON.stringify(data, null, 2);
    
    // Create a Blob object from the JSON string to facilitate the download.  The 'type' specifies the MIME type.
    const blob = new Blob([jsonString], { type: 'application/json' });
    
    // Create a temporary URL for the Blob object. This URL will be used as the download link's href.
    const url = URL.createObjectURL(blob);

    // Create a hidden anchor element (<a>).
    const a = document.createElement('a');
    
    // Set the download link and filename.
    a.href = url;
    a.download = filename;
    
    // Add the anchor element to the document body.  This is necessary for the click event to work.
    document.body.appendChild(a);
    
    // Simulate a click on the anchor element to trigger the download.
    a.click();
    
    // Remove the anchor element from the document body to clean up the DOM.
    document.body.removeChild(a);

    // Release the temporary URL to free up resources.
    URL.revokeObjectURL(url);
}


export const isNumeric = (value) => {
    // Matches optional negative sign, zero or more digits, optional decimal point, and zero or more digits. This regex ensures the input string represents a valid number.
    const numericRegex = /^-?\d*\.?\d*$/;

    // Validates the input value against the numeric regular expression. Returns the original value if it's numeric, otherwise returns an empty string. This ensures only valid numeric strings are passed through.
    return numericRegex.test(value) ? value : '';
};


// Function to check if length and width are numeric
export const check_LW = (value) => {
    return {
        // Check if length is a numeric value
        length: isNumeric(value.length),
        
        // Check if width is a numeric value
        width: isNumeric(value.width),
    }
}

// Function to check if circumference and diameter are numeric
export const check_CD = (value) => {
    return {
        // Check if circumference is a numeric value
        circumference: isNumeric(value.circumference),
        
        // Check if diameter is a numeric value
        diameter: isNumeric(value.diameter),
    }
}


// Function to check if height and width are numeric
export const check_HW = (value) => {
    return {
        // Check if height is a numeric value
        height: isNumeric(value.height),
        
        // Check if width is a numeric value
        width: isNumeric(value.width),
    }
}

export const measurementList = [
    'Length', 'Width', 'height', 'Circumference', 'Diameter'
];
export const materialAdjustments = {
    Leather: 0.197,
    Spandex: -0.459,
    Lycra: -0.459,
    Wool: 0.263,
    Canvas: 0.13,
    Silk: 0.13,
    Chiffon: 0.197,
    Denim: 0.263,
    Cordura: 0.067,
    Latex: -0.453,
    Nitrile: -0.442,
    Neoprene: -0.327,
    Vinyl: 0.197,
    Cotton: 0.327,
    Polyester: -0.13,
    Kevlar: 0,
    Polyurethane: -0.197,
    Rubber: -0.485,
    Synthetic_Leather: 0.13,
    Microfiber: -0.13,
    Nylon: -0.197,
    Silicone: -0.525,
    Velvet: 0.197,
    Rayon: 0.263,
    Taffeta: 0.13,
    Tweed: 0.327,
    Fleece: 0.263,
    Gore_Tex: 0,
    Cashmere: 0.197,
    Faux_Fur: 0.492,
};
export const partList = [
    "Palm Shell", "Back Shell", "Palm Thumb", "Back Thumb", "Index Finger", "Middle Finger",
    "Ring Finger", "Little Finger", "Wrist",
    "Body", "Fringes", "Edges",
    "Bill", "Strap", "Crown", "Brim", "Body Crown"
];
// Function to safely parse JSON data
export const safeParse = (data) => {
    // Check if the input data is a string
    if (typeof data === "string") {
        try {
            // Try parsing the JSON string
            return JSON.parse(data);
        } catch (e) {
            // Log an error if parsing fails
            console.error("JSON parsing error:", e);
            return null;  // Return null if there's an error
        }
    }
    // Return the data as is if it's not a string
    return data;
};

// Function to update length and width based on previous and current sizes
export const updateLengthWidth = (last, prev, measure, difference, fix) => {
    // Parse the length and width from the measure object as floats
    const length = parseFloat(measure.length);
    const width = parseFloat(measure.width);
    
    // Convert size labels (Small, Medium, Large) to numeric values for calculation
    last = last === "Small" ? 1 : last === "Medium" ? 2 : last === "Large" ? 3 : 4;
    prev = prev === "Small" ? 1 : prev === "Medium" ? 2 : prev === "Large" ? 3 : 4;

    // Store the difference for adjusting measurements
    const def = difference;
    
    // Calculate the difference between previous and last size
    const compute = prev - last;

    // If both width and length are not defined, return empty values
    if (!width && !length) {
        return {
            width: '',
            length: ''
        }
    }

    // Return updated length and width, rounded to the specified decimal places
    return {
        length: (length + def * compute).toFixed(fix),
        width: (width + def * compute).toFixed(fix)
    }
};



// Function to gracefully update circumference and diameter based on size differences
export const updateCircumDiam = (last, prev, measure, difference, fix) => {
    // Safely parse circumference and diameter as float values
    const circumference = parseFloat(measure.circumference);
    const diameter = parseFloat(measure.diameter);
    
    // Map size labels (Small, Medium, Large) to numeric values for comparison
    last = last === "Small" ? 1 : last === "Medium" ? 2 : last === "Large" ? 3 : 4;
    prev = prev === "Small" ? 1 : prev === "Medium" ? 2 : prev === "Large" ? 3 : 4;
    
    // Store the delightful difference to adjust measurements
    const def = difference;
    
    // Calculate the smooth difference between the previous and last size
    const compute = prev - last;

    // If neither diameter nor circumference is provided, return empty values
    if (!diameter && !circumference) {
        return {
            circumference: '',
            diameter: ''
        }
    }

    // Return the finely adjusted circumference and diameter, rounded with grace
    return {
        circumference: (circumference + def * compute).toFixed(fix),
        diameter: (diameter + def * compute).toFixed(fix)
    }
};


// Function to update height and width based on the difference between sizes
export const updateHeightWidth = (last, prev, measure, difference, fix) => {
    // Parse height and width from the measure object as float values
    const height = parseFloat(measure.height);
    const width = parseFloat(measure.width);

    // Convert size labels (Small, Medium, Large) to numeric values for calculation
    last = last === "Small" ? 1 : last === "Medium" ? 2 : last === "Large" ? 3 : 4;
    prev = prev === "Small" ? 1 : prev === "Medium" ? 2 : prev === "Large" ? 3 : 4;

    // Store the difference for adjusting measurements
    const def = difference;

    // Calculate the difference between previous and last size
    const compute = prev - last;

    // If both width and height are not defined, return empty values
    if (!width && !height) {
        return {
            width: '',
            height: ''
        }
    }

    // Return updated height and width, rounded to the specified decimal places
    return {
        height: (height + def * compute).toFixed(fix),
        width: (width + def * compute).toFixed(fix)
    }
};



export const getMaterialAdjusment = (material) => {
    material = material.replace(/\s/g, "_").replace(/-/g, "_");
    //console.log(materialAdjustments[material] );
    return materialAdjustments[material] || 0;
};

export const updateByMaterial_LW = (data, lastAdj, newAjd, fix) => {

    //console.log(`${data.length} - ${lastAdj} + ${newAjd} = ${(data.length - lastAdj) + newAjd}`);
    const adjustedLength = (data.length - lastAdj) + newAjd;
    const adjustedWidth = (data.width - lastAdj) + newAjd;
    //console.log("Adjusted length : ", (data.length - lastAdj), " AdjusteedWidth : ", (data.width - lastAdj));
    //console.log("Total of LastAdjusment: ", newAjd);
    //console.log("data", data);
    return {
        length: data.length ? adjustedLength.toFixed(fix) : '',
        width: data.width ? adjustedWidth.toFixed(fix) : '',
    };
};

// Function to update circumference and diameter based on material adjustment
export const updateByMaterial_CD = (data, lastAdj, newAjd, fix) => {
    // Calculate the adjusted circumference by subtracting the last adjustment and adding the new adjustment
    const adjustedCircumference = (data.circumference - lastAdj) + newAjd;
    
    // Calculate the adjusted diameter by subtracting the last adjustment and adding the new adjustment
    const adjustedDiameter = (data.diameter - lastAdj) + newAjd;
    
    // Return the adjusted circumference and diameter, rounded to the specified decimal places
    // If circumference or diameter is not provided, return an empty string
    return {
        circumference: data.circumference ? adjustedCircumference.toFixed(fix) : '',
        diameter: data.diameter ? adjustedDiameter.toFixed(fix) : '',
    };
};

// Function to update height and width based on material adjustment
export const updateByMaterial_HW = (data, lastAdj, newAjd, fix) => {
    // Calculate the adjusted height by subtracting the last adjustment and adding the new adjustment
    const adjustedHeight = (data.height - lastAdj) + newAjd;
    
    // Calculate the adjusted width by subtracting the last adjustment and adding the new adjustment
    const adjustedWidth = (data.width - lastAdj) + newAjd;
    
    // Return the adjusted height and width, rounded to the specified decimal places
    // If height or width is not provided, return an empty string
    return {
        height: data.height ? adjustedHeight.toFixed(fix) : '',
        width: data.width ? adjustedWidth.toFixed(fix) : '',
    };
};

// Function to get part names from an object and format them
export const getPartsName = (data) => {
    // Use Object.keys to get the keys from the data object, then map each key to a formatted string
    const partsName = Object.keys(data).map(key => {
        return key
            // Replace underscores with spaces
            .replace("_", " ")
            // Capitalize the first letter of each word
            .replace(/\b\w/g, char => char.toUpperCase());
    });
    
    // Return the formatted part names
    return partsName;
}


// Function to get the time to approval by year and brand from the data
export const getTimeToApprovalByYearBrand = (data, brand, year) => {
    try {
        // Find the brand record in the data
        const filteredByBrand = data.find((record) => record.brand === brand);
        
        // If the brand is not found, return an empty array
        if (!filteredByBrand) return [];

        // Convert year to a number
        year = Number(year);

        // Find the records for gloves, hats, and scarves in the specified year
        const gloves = filteredByBrand.gloves.find((record) => record.year === year);
        const hats = filteredByBrand.hats.find((record) => record.year === year);
        const scarves = filteredByBrand.scarves.find((record) => record.year === year);

        // List of months to map the approval data
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        // Map the data for each month, including approval data for gloves, hats, and scarves
        const approvalData = months.map((month) => ({
            name: month,
            hats: hats && hats.record ? (hats.record[month.toLowerCase()] || 0) : 0,
            gloves: gloves && gloves.record ? (gloves.record[month.toLowerCase()] || 0) : 0,
            scarves: scarves && scarves.record ? (scarves.record[month.toLowerCase()] || 0) : 0,
        }));

        // Log the approval data for debugging
        console.log(approvalData);

        // Return the formatted approval data
        return approvalData;
    } catch (error) {
        // Log the error if something goes wrong
        console.error("Error in getTimeToApprovalByYearBrand:", error);
        throw error;
    }
};

// Function to get fit issues by category and size
export const getFitIssueByCategorySize = (data, category, size) => {
    // Convert category to lowercase for case-insensitive matching
    category = category.toLowerCase();

    // Filter the data by category (gloves, hats, or scarves)
    const filteredByCategory = data.map(({ brand, gloves, hats, scarves }) => {
        // Select the item based on the category (gloves, hats, or scarves)
        const selectedItem = category === "gloves" ? gloves : category === "hats" ? hats : scarves;
        return {
            brand,         // Return the brand and the selected item for the category
            selectedItem   // selected item (gloves, hats, or scarves) based on category
        };
    });

    if (filteredByCategory) {
        // Filter the data by size (Small, Medium, Large, or X-Large)
        const filteredBySize = filteredByCategory.map((item) => {
            // Determine the index for the selected size (0 for Small, 1 for Medium, etc.)
            const selectedSize = size === "Small" ? 0 : size === "Medium" ? 1 : size === "Large" ? 2 : 3;

            // Get the selected item for the specified size
            const selectedItem = item.selectedItem[selectedSize];

            // If the selected item doesn't exist, return null
            if (!selectedItem) {
                //console.warn(`No item found for brand: ${item.brand}, size index: ${selectedSize}`);
                return null;
            }

            // Destructure the selected item to exclude size_id and return the rest of the item
            const { size_id, ...rest } = selectedItem;

            // Return the brand name along with the rest of the item details
            return {
                name: item.brand,
                ...rest
            };
        }).filter(Boolean);  // Remove null values from the array

        // console.log("filtered : ", filteredBySize);
        // Return the filtered data by size
        return filteredBySize;
    }
    // Return an empty array if no items were found
    return [];
};



// Function to get a list of unique brands from the data
export const getBrandList = (data) => {
    // Check if data is provided
    if (data) {
        // Create a set of unique brands from the data array by mapping the brand field
        const uniqueBrands = [...new Set(data.map((elem) => elem.brand))];

        // If there are any unique brands, return the list
        if (uniqueBrands.length > 0) return uniqueBrands;
    }
    // Return an empty array if no data or brands are found
    return [];
};


// Function to get size ID based on the size string (small, medium, large, or x-large)
export const getSizeID = (size) => {
    // Convert the size string to lowercase for case-insensitive comparison
    size = size.toLowerCase();

    // Return the corresponding size ID based on the size string
    return size === "small" ? 1 : size === "medium" ? 2 : size === "large" ? 3 : 4;
};

// Function to get size names based on the size ID (1, 2, 3, or 4)
export const getSizeName = (size) => {
    // Assign short size label based on the size ID (e.g., "S" for Small)
    const style1 = size === 1 ? "S" : size === 2 ? "M" : size === 3 ? "L" : "XL";
    
    // Assign full size name based on the size ID (e.g., "Small" for size 1)
    const style2 = size === 1 ? "Small" : size === 2 ? "Medium" : size === 3 ? "Large" : "X-Large";
    
    // Check if style2 matches the lowercase version of the size name
    const style3 = size === style2.toLowerCase();
    
    // Return an array with the three size labels
    return [style1, style2, style3];
};


// Function to generate a list of years from the current year back to 2000
export const generateYearList = () => {
    // Get the current year
    const currentYear = new Date().getFullYear();
    
    // Initialize an empty array to store the years
    const years = [];

    // Loop from the current year back to 2000, pushing each year to the array
    for (let year = currentYear; year >= 2019; year--) {
        years.push(year.toString());
    }

    // Return the list of years
    return years;
};


// Function to get a color code based on the status
export const getStatusColor = (status) => {
    // Determine the color based on the provided status
    const color = status === "pending" ? "#999999" :  // Grey for pending
        status === "approved" ? "#B2E87D" :  // Green for approved
            status === "dropped" ? "#E87D7D" :  // Red for dropped
                status === "revision" ? "#FFF96B" :  // Yellow for revision
                    "orange";  // Default orange for unknown status

    // Return the determined color
    return color;
};

export const inputChangeColor = (e) => {
    return e.target.style.color = "black";
}
// Function to format a date into "YYYY-MM-DD" format
export const formatDATEYYYMMDD = (date) => {
    // Parse the provided date
    const parsedDate = new Date(date);
    
    // Get the year in UTC
    const year = parsedDate.getUTCFullYear();
    
    // Get the month in UTC and pad it with a leading zero if necessary
    const month = String(parsedDate.getUTCMonth() + 1).padStart(2, '0');
    
    // Get the day in UTC and pad it with a leading zero if necessary
    const day = String(parsedDate.getUTCDate()).padStart(2, '0');

    // Return the formatted date as "YYYY-MM-DD"
    return `${year}-${month}-${day}`;
};


// Function to capitalize the first letter of each word in a string
export const capitalizeWords = (string) => {
    // Split the string into an array of words, capitalize the first letter of each word, and then join them back into a string
    return string.split(' ')  // Split the string by spaces into an array of words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))  // Capitalize the first letter of each word
        .join(' ');  // Join the words back into a single string with spaces
};

// Function to format a date into multiple formats
export const dateFormatter = (date) => {
    if(!date){
        return ['00/00/0000','--/--/----'];
    }
    // Parse the provided date
    const parsedDate = new Date(date);

    // Date Formats
    const format1 = parsedDate.toISOString().split('T')[0];  // 'YYYY-MM-DD'
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const format2 = parsedDate.toLocaleDateString('en-US', options);  // 'MMM D, YYYY'
    const format3 = format1.replace(/-/g, '/');  // 'YYYY/MM/DD'
    const format4 = parsedDate.toLocaleDateString('en-GB').replace(/\//g, '-');  // 'DD-MM-YYYY'

    // Time Formats
    const time24Hour = parsedDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });  // 'HH:MM'
    const time24HourWithSeconds = parsedDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });  // 'HH:MM:SS'
    const time12Hour = parsedDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });  // 'hh:MM AM/PM'

  
    return [format1, format2, format3, format4, time24Hour, time24HourWithSeconds, time12Hour];
};




// Function to convert a date string (MM/DD/YYYY) to an ISO format with microseconds
function convertToISO(dateString) {

    // Split the input date string by '/' and convert each part to a number (month, day, year)
    const [month, day, year] = dateString.split('/').map(Number);

    // Create a new Date object using the year, month (zero-indexed), and day
    const date = new Date(year, month - 1, day);

    // Convert the Date object to an ISO 8601 string
    const isoString = date.toISOString();

    // Add microseconds to the ISO string (replace 'Z' with '000Z' and ensure the milliseconds part is in the format '.000000')
    const isoWithMicroseconds = isoString.replace('Z', '000Z').replace(/\.(\d{3})000Z$/, ".$1000000Z");

    // Return the final ISO string with microseconds
    return isoWithMicroseconds;
}


/************************************************************************ */

// Function to fetch an image based on the pattern number
export const getImage = async (pattern_number) => {
    try {
        // Attempt to fetch the image file (JPG) based on the pattern number
        const response = await fetch(`hats/${pattern_number}.jpg`);

        // Check if the response is OK (status code 200-299), otherwise throw an error
        if (!response.ok) {
            throw new Error(`Error fetching image: ${response.statusText}`);
        }

        // Convert the response to a Blob object (binary data of the image)
        const imageBlob = await response.blob();

        // Return the image Blob
        return imageBlob;
    } catch (error) {
        // Log any errors that occur during the fetch operation
        console.error(error);

        // Return null in case of an error
        return null;
    }
};
