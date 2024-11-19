import { getSizeID } from "../dataTools"; // Importing the getSizeID function to fetch the size ID based on the size name
import apiService from "../services/apiService"; // Importing the apiService to make API requests

export class GloveAPI {
    constructor() {
        this.api = apiService; // Initializing the API service to interact with backend
    }

    // Function to update the glove pattern data
    async updateGlove(pattern, parts, currentSize, submit, glove_id) {
        console.log("request to ", submit); // Log the action being performed
        const sizeID = getSizeID(currentSize); // Get the size ID based on the current size
        const data = { // Prepare data to be sent in the API request
            id: pattern.id,
            name: currentSize.toLowerCase(),
            size_to_save: sizeID,
            submit: submit,
            glove_id,
            palm_shell: parts.palm_shell,
            black_shell: parts.black_shell,
            palm_thumb: parts.palm_thumb,
            back_thumb: parts.back_thumb,
            index_finger: parts.index_finger,
            middle_finger: parts.middle_finger,
            ring_finger: parts.ring_finger,
            little_finger: parts.little_finger,
            wrist: parts.wrist
        };
        try {
            const response = await this.api.put(`gloves/${pattern.id}`, data); // Sending PUT request to update glove pattern
            if (response.status === 201) { // Check if the request was successful
                return response.data.message; // Return the success message
            }
        } catch (error) {
            throw error; // Throw error if the request fails
        }
    }

    // Function to save records from an Excel sheet
    async saveFromExcel(records) {
        try {
            const response = await this.api.post('gloves/update-create', records); // Sending POST request to save records
            if (response.status === 201) { // Check if the request was successful
                return response.data; // Return the response data
            }
        } catch (error) {
            console.error(error); // Log error if the request fails
            throw error; // Throw error if the request fails
        }
    }

    // Function to create a new glove pattern
    async createGlove(pattern, parts, currentSize, submit, image) {
        currentSize = currentSize.toLowerCase(); // Convert the size to lowercase
        const sizeID = getSizeID(currentSize); // Get the size ID based on the current size
      //  alert(sizeID + `${submit}`);
        const sizes = ["small", "medium", "large", "x-large"]; // Define possible glove sizes
        
        // Prepare measurements for each size
        const measurementsBySize = sizes.map(size => {
            const data = currentSize === size ? parts : createDefault(); // Use default data for other sizes
            return {
                name: size,
                measurements: data
            };
        });
    
        const formData = new FormData(); // Create FormData to send data with file
        formData.append('submit', submit ? 'true' : 'false');
        formData.append('maker_id', pattern.maker_id);
        formData.append('pattern_number', pattern.pattern_number || "");
        formData.append('name', pattern.name || "");
        formData.append('image', image); 
        formData.append('brand', pattern.brand || "");
        formData.append('category', pattern.category || "");
        formData.append('outer_material', pattern.outer_material || "");
        formData.append('lining_material', pattern.lining_material || "");
        formData.append('size_to_save', sizeID);
    
        // Append size measurements for each size in the glove
        measurementsBySize.forEach((size, index) => {
            formData.append(`sizes[${index}][name]`, size.name);
            Object.entries(size.measurements).forEach(([part, measurement]) => {
                formData.append(`sizes[${index}][measurements][${part}][length]`, measurement.length || '');
                formData.append(`sizes[${index}][measurements][${part}][width]`, measurement.width || '');
            });
        });
    
        try {
            const response = await this.api.post('gloves', formData, { // Sending POST request to create a new glove
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 201) { // Check if the request was successful
                return response.data.message; // Return the success message
            }
        } catch (error) {
            console.error(error); // Log error if the request fails
            throw new Error('An error occurred while creating the glove pattern.'); // Return error message
        }
    }
}

// Helper function to create default measurement values for glove parts
function createDefault() {
    const measurementKeys = ["palm_shell", "black_shell", "wrist", "palm_thumb", "back_thumb", "index_finger", "middle_finger", "ring_finger", "little_finger"];
    const result = {};
    measurementKeys.forEach(key => {
        result[key] = { // Set default values for length and width
            length: '',
            width: '',
        };
    });
    return result;
}

/*
Below are some commented-out helper functions that were possibly considered for managing measurements based on size adjustments:

- getMeasurementsBySize: Function to adjust measurements based on size (small, medium, large, x-large).
- resetMeasurements: Function to reset measurements to default values based on size adjustment.

These are not in use in the current code but may be useful for future changes or functionality.
*/
