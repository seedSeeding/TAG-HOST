import apiService from "../services/apiService"; // Importing the apiService for making API requests

// UserAPI class for interacting with user-related data from the backend
export class UserAPI {
    constructor() {
        this.api = apiService; // Initialize the apiService for making requests
    }

    // Fetch users from the API
    async getUsers() {
        try {
            const response = await this.api.get('users'); // Make GET request to fetch users data
            if (response.status === 200) { // Check if the response status is 200 (OK)
                return response.data.users; // Return the users data if the response is successful
            } else {
                throw new Error('Failed to fetch users'); // Throw an error if the response is not successful
            }
        } catch (err) {
            throw err; // Throw any caught error
        }
    }
}
