import { getSizeID } from "../dataTools"; // Importing utility to fetch size ID from size
import apiService from "../services/apiService"; // Importing the apiService for making API requests

// ScarfAPI class for managing scarf-related data through API requests
export class ScarfAPI {
    constructor() {
        this.api = apiService; // Initialize the apiService for making requests
    }

    // Save records from an Excel file by sending them to the backend
    async saveFromExcel(records) {
        try {
            //console.log(records); // Debugging records data (if needed)
            // Sending a POST request to update or create scarf records
            const response = await this.api.post('scarves/update-create', records);
            if (response.status === 201) {
                return response.data; // Return the response data if successful
            }
        } catch (error) {
            console.error(error); // Log the error for debugging
            throw error; // Throw the error to be handled by the caller
        }
    }
    
    // Update an existing scarf pattern with new details
    async updateScarf(pattern, parts, currentSize, submit, scarf_id) {
        const sizeID = getSizeID(currentSize); // Get the size ID from the size string
        const data = {
            id: pattern.id,
            name: currentSize.toLowerCase(), // Use the lowercase size name
            size_to_save: sizeID, // The size ID to save
            submit: submit, // Submit status flag
            scarf_id: scarf_id, // ID of the scarf to update
            body: parts.body, // Body measurements
            fringers: parts.fringers, // Fringer measurements
            edges: parts.edges, // Edge measurements
        };

        try {
            // Sending a PUT request to update the scarf pattern with the new data
            const response = await this.api.put(`scarves/${pattern.id}`, data);
            if (response.status === 201) {
                return response.data.message; // Return the response message on success
            }
        } catch (error) {
            throw error; // Throw any error encountered during the request
        }
    }

    // Create a new scarf pattern with provided data
    async createScarf(pattern, parts, currentSize, submit, image) {
        currentSize = currentSize.toLowerCase(); // Ensure the size is in lowercase
        const sizeID = getSizeID(currentSize); // Get the size ID for the given size
        const sizes = ["small", "medium", "large", "x-large"]; // Size options for the scarf
        const measurementsBySize = sizes.map(size => {
            // Prepare measurements for each size
            const data = currentSize === size ? parts : createDefault(); // Use given parts for selected size, default for others
            return {
                name: size,
                measurements: data
            };
        });

        // Prepare form data for the request, including image and measurements for all sizes
        const formData = new FormData();
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

        measurementsBySize.forEach((size, index) => {
            formData.append(`sizes[${index}][name]`, size.name); // Append size name
            Object.entries(size.measurements).forEach(([part, measurement]) => {
                formData.append(`sizes[${index}][measurements][${part}][length]`, measurement.length || ''); // Append part length
                formData.append(`sizes[${index}][measurements][${part}][width]`, measurement.width || ''); // Append part width
            });
        });

        try {
            // Sending a POST request with the form data to create a new scarf pattern
            const response = await this.api.post('scarves', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Set the correct content type for form data
                },
            });
            if (response.status === 201) {
                return response.data.message; // Return success message on successful creation
            }
        } catch (error) {
            console.error(error); // Log the error for debugging
            throw new Error('An error occurred while creating the scarf pattern.'); // Throw a new error with a custom message
        }
    }
}

// Helper function to create default measurements for a scarf pattern
function createDefault() {
    const measurementKeys = {
        body: { length: '', width: '' }, // Default body measurements
        fringers: { length: '', width: '' }, // Default fringers measurements
        edges: { length: '', width: '' }, // Default edges measurements
    };
    return measurementKeys; // Return the default measurements
}
