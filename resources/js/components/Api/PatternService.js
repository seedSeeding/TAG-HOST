import apiService from "../services/apiService"; // Importing the apiService for making API requests

export class PatternApi {
  constructor() {
    this.api = apiService; // Initialize the apiService for API requests
  }

  // Update the brand name for a specific pattern based on its ID
  async updateBrandName(brand, id) {
    try {
      const response = await apiService.put(`patterns/update-brand-name/${id}`, { brand });

      if (response.status === 200) {
        return true; // Return true if the brand name was updated successfully
      }
    } catch (err) {
      // Handle errors based on response status
      if (err.response && err.response.status === 422) {
        throw err; // Rethrow error if validation fails (422 status)
      } else {
        console.error('Error updating brand name:', err); // Log other errors
        return 'An error occurred while updating the brand name.'; // Return a custom error message
      }
    }
  }

  // Update the image for a specific pattern
  async updateImage(formData) {
    try {
      const response = await apiService.post("patterns/update-image", formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Set the correct content type for form data
        },
      });

      if(response.status === 200){
        return true; // Return true if the image was updated successfully
      }
    } catch (err) {
      // Handle errors based on response status
      if (err.response && err.response.status === 422) {
        throw err; // Rethrow error if validation fails (422 status)
      } else {
        return 'An error occurred while updating the image.'; // Return a custom error message
      }
    }
  }

  // Fetch all pattern requests
  async getPatternRequests() {
    try {
      const response = await this.api.get("patterns/get-all");
      if (response.status === 200) {
        const data = response.data; // Store the fetched data
        return data; // Return the data if the request was successful
      }
      throw new Error("Failed to fetch patterns"); // Throw an error if the response status is not 200
    } catch (err) {
      throw err.error; // Handle errors by throwing the error object
    }
  }

  // Change the approval state of a pattern based on the provided data
  async setSizeStatus(data) {
    try {
      const response = await this.api.post("patterns/change-state", data);
      if (response.status === 200) {
        return response.data.message; // Return success message if status update is successful
      }
      throw new Error("Failed to update status"); // Throw error if the status update failed
    } catch (err) {
      throw err.error; // Handle errors by throwing the error object
    }
  }

  // Fetch the records for a specific maker based on their maker ID
  async getRecordsOfMaker(maker_id) {
    try {
      const res = await this.api.get(`patterns/maker/${maker_id}`);
      console.log("data::", res.data); // Log the fetched data (for debugging)
      if (res.status === 200) {
        return res.data; // Return the data if the request was successful
      }
    } catch (error) {
      throw error.error; // Handle errors by throwing the error object
    }
  }

  // Get the approval status for different sizes (small, medium, large, xLarge)
  getSizesStatus(pattern) {
    const data = pattern.gloves || pattern.scarves || pattern.hats || []; // Get the appropriate category data
    return {
      small: data.filter((elem) => elem.size_id === 1)[0]?.approval_state || null, // Get approval state for small size
      medium: data.filter((elem) => elem.size_id === 2)[0]?.approval_state || null, // Get approval state for medium size
      large: data.filter((elem) => elem.size_id === 3)[0]?.approval_state || null, // Get approval state for large size
      xLarge: data.filter((elem) => elem.size_id === 4)[0]?.approval_state || null // Get approval state for x-large size
    };
  }

  // Get the category of the pattern (gloves, scarves, or hats)
  getExistCategory(pattern) {
    return pattern.gloves || pattern.scarves || pattern.hats || []; // Return the appropriate category data
  }
}
