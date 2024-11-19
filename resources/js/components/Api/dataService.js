import { getSizeID } from "../dataTools"; 
import apiService from "../services/apiService"; 

// DataApi class encapsulates various API calls to interact with the backend
export class DataApi {
  constructor() {
    this.api = apiService; // Initialize the apiService for making requests
  }

  // Fetch all records from the API
  async getAllRecords() {
    try {
      const response = await this.api.get("data/get-total-records"); // Make GET request to fetch total records
      if (response.status === 200) {
        return response.data; // Return data if the response is successful
      }
    } catch (err) {
      throw err.error; // Throw error if request fails
    }
  }

  // Fetch total states data from the API
  async getTotalStates() {
    try {
      const response = await this.api.get("data/get-total-states"); // Make GET request to fetch total states
      if (response.status === 200) {
        return response.data; // Return data if the response is successful
      }
    } catch (err) {
      throw err.error; // Throw error if request fails
    }
  }

  // Fetch time to approval data from the API
  async getTimeToApproval() {
    try {
      const response = await this.api.get("data/get-time-to-approval"); // Make GET request to fetch time to approval data
      if (response.status === 200) {
        return response.data; // Return data if the response is successful
      }
    } catch (err) {
      throw err.error; // Throw error if request fails
    }
  }

  // Fetch fit issues data from the API
  async getFitIssues() {
    try {
      const response = await this.api.get("data/get-fit-issues"); // Make GET request to fetch fit issues
      if (response.status === 200) {
        return response.data; // Return data if the response is successful
      }
    } catch (err) {
      throw err.error; // Throw error if request fails
    }
  }

  // Fetch brand list from the API
  async getBrandList() {
    try {
      const response = await this.api.get("data/get-brand-list"); // Make GET request to fetch the brand list
      if (response.status === 200) {
        return response.data; // Return data if the response is successful
      }
    } catch (err) {
      throw err.error; // Throw error if request fails
    }
  }

  // Fetch material popularity data based on brand and date
  async getMaterialPopularityALL(brand, date) {
    try {
      const response = await this.api.get("data/material-popularity", {
        params: {
          date: date, // Pass date as a parameter
          brand: brand, // Pass brand as a parameter
        }
      });
      if (response.status === 200) {
        return response.data; // Return data if the response is successful
      }
    } catch (err) {
      throw err.response?.data || err.message; // Return error data if available
    }
  }

  // Fetch the status of all patterns from the API
  async getStatusOfThePattern() {
    try {
      const response = await this.api.get("data/get-all-total"); // Make GET request to fetch pattern status
      if (response.status === 200) {
        return response.data; // Return data if the response is successful
      }
    } catch (err) {
      throw err.error; // Throw error if request fails
    }
  }

  // Fetch analysis report based on category and size
  async getAnalysisReport(category, size) {
    try {
      const data = {
        category: category.toLowerCase(), // Convert category to lowercase
        size_id: Number(getSizeID(size)), // Get size ID from utility function
      };
  
      const response = await this.api.get("data/get-analysis", { params: data }); // Make GET request to fetch analysis report
      if (response.status === 200) {
        return response.data; // Return data if the response is successful
      }
    } catch (err) {
      console.error("Error fetching analysis report:", err); // Log error message
      throw err; // Throw error if request fails
    }
  }

  // Fetch performance overview records from the API
  async getPerformanceOverviewRecords() {
    try {
      const response = await this.api.get("data/get-adjusment-acc"); // Make GET request to fetch adjustment accuracy data
      if (response.status === 200) {
        return response.data; // Return data if the response is successful
      }
    } catch (err) {
      throw err.error; // Throw error if request fails
    }
  }

  // Fetch all data records from the API
  async getAllDataRecords() {
    try {
      const response = await this.api.get("data/get-all-data"); // Make GET request to fetch all data records
      if (response.status === 200) {
        return response.data; // Return data if the response is successful
      }
    } catch (err) {
      throw err.error; // Throw error if request fails
    }
  }

  // Fetch all parts measurements data from the API
  async getALlPartsMeasurements() {
    try {
      const response = await this.api.get("data/get-parts-measurements"); // Make GET request to fetch parts measurements data
      if (response.status === 200) {
        return response.data; // Return data if the response is successful
      }
    } catch (err) {
      throw err.error; // Throw error if request fails
    }
  }
}
