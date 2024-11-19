import apiService from "../services/apiService";

// NotificationAPi class handles all the notification-related API requests.
export class NotificationAPi {
  constructor() {
    // Initializing the API service instance for making HTTP requests.
    this.api = apiService;
  }

  // Fetches all notifications for the user.
  async getALlNotifications(){
    try {
      // Sending a GET request to fetch notifications.
      const res = await this.api.get("/notifications");
      if (res.status === 200) {
        // If response is successful, return the data.
        return res.data;
      }
    } catch (error) {
      // Handle errors and throw the error message.
      throw error.error;
    }
  }

  // Fetches all notifications for a specific user by userId.
  async getALlNotificationsByID(userId){
    try {
      // Sending a GET request to fetch user-specific notifications.
      const res = await this.api.get(`/maker_notifications/user/${userId}`);
      if (res.status === 200) {
        // If response is successful, return the data.
        return res.data;
      }
    } catch (error) {
      // Handle errors and throw the error message.
      throw error.error;
    }
  }

  // Marks all notifications as read.
  async markAllAsRead () {
    try {
      // Sending a POST request to mark all notifications as read.
      const res = await this.api.post("/notifications/mark-all-as-read");
      if (res.status === 200) {
        // If response is successful, return the data.
        return res.data;
      }
    } catch (error) {
      // Handle errors and throw the error message.
      throw error.error;
    }
  }

  // Marks all notifications as read for a specific user by userId.
  async markAllAsReadByID(userId){
    try {
      // Sending a POST request to mark all notifications for the specified user as read.
      const res = await this.api.post(`maker_notifications/mark-all/${userId}`);
      if (res.status === 200) {
        // If response is successful, return the data.
        return res.data;
      }
    } catch (error) {
      // Handle errors and throw the error message.
      throw error.error;
    }
  }
}
