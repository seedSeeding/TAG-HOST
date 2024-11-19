import { getSizeID } from "../dataTools";
import apiService from "../services/apiService";

// HatAPI class handles all the operations related to hats (creating, updating, and saving from Excel).
export class HatAPI {
    constructor() {
        // Initializing the API service instance for making HTTP requests.
        this.api = apiService;
    }

    // Saves or updates hat records from Excel data.
    async saveFromExcel(records) {
        try {
            // Sending a POST request to update or create hat records from Excel data.
            const response = await this.api.post('hats/update-create', records);
            if (response.status === 201) {
                // If the response is successful, return the response data.
                return response.data;
            }
        } catch (error) {
            // Log and throw any errors.
            console.error(error);
            throw error;
        }
    }

    // Updates an existing hat with new pattern and parts data for the specified size.
    async updateHat(pattern, parts, currentSize, submit, hat_id) {
        console.log("request to ", submit);
        // Getting the size ID based on the current size.
        const sizeID = getSizeID(currentSize);
        // Organizing the data to send for updating the hat.
        const data = {
            id: pattern.id,
            name: currentSize.toLowerCase(),
            size_to_save: sizeID,
            submit: submit,
            hat_id,
            strap: parts.strap,
            body_crown: parts.body_crown,
            crown: parts.crown,
            brim: parts.brim,
            bill: parts.bill,
        };

        try {
            // Sending a PUT request to update the hat with the provided data.
            const response = await this.api.put(`hats/${pattern.id}`, data);
            if (response.status === 201) {
                // Return the success message if the update is successful.
                return response.data.message;
            }
        } catch (error) {
            // Handle any errors that occur during the update process.
            throw error;
        }
    }

    // Creates a new hat with pattern data, parts, size, and image.
    async createHat(pattern, parts, currentSize, submit, image) {
        // Convert the current size to lowercase.
        currentSize = currentSize.toLowerCase();
        // Get the size ID based on the current size.
        const sizeID = getSizeID(currentSize);
        const sizes = ["small", "medium", "large", "x-large"];
        
        // Mapping over sizes to prepare measurement data for each size.
        const measurementsBySize = sizes.map(size => {
            const data = currentSize === size ? parts : createDefault();
            return {
                name: size,
                measurements: data
            };
        });

        // Creating a FormData object to send the hat data as multipart/form-data.
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

        // Appending size-specific measurements to the FormData.
        measurementsBySize.forEach((size, index) => {
            formData.append(`sizes[${index}][name]`, size.name);
            Object.entries(size.measurements).forEach(([part, measurement]) => {
                if (part === "crown" || part === "brim") {
                    formData.append(`sizes[${index}][measurements][${part}][circumference]`, measurement.circumference || '');
                    formData.append(`sizes[${index}][measurements][${part}][diameter]`, measurement.diameter || '');
                } else if (part === "bill") {
                    formData.append(`sizes[${index}][measurements][${part}][length]`, measurement.length || '');
                    formData.append(`sizes[${index}][measurements][${part}][width]`, measurement.width || '');
                } else {
                    formData.append(`sizes[${index}][measurements][${part}][height]`, measurement.height || '');
                    formData.append(`sizes[${index}][measurements][${part}][width]`, measurement.width || '');
                }
            });
        });

        try {
            // Sending a POST request to create the new hat.
            const response = await this.api.post('hats', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 201) {
                // Return the success message if the creation is successful.
                return response.data.message;
            }
        } catch (error) {
            // Log and return the error message in case of failure.
            console.error(error);
            throw new Error('An error occurred while creating the hats pattern.');
        }
    }
}

// Helper function to create default measurement values if no specific values are provided.
function createDefault() {
    const measurementKeys = {
        bill: { length: '', width: '' },
        strap: { height: '', width: '' },
        body_crown: { height: '', width: '' },
        crown: { circumference: '', diameter: '' },
        brim: { circumference: '', diameter: '' }
    };

    return measurementKeys;
}
