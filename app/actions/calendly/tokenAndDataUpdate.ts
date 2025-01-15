'use server'

import axios, { AxiosInstance } from "axios";
// Create a pre-configured Axios instance
const calendlyApiClient: AxiosInstance = axios.create({
  baseURL: "https://api.calendly.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to fetch the authenticated Calendly user
export const saveCalendlyUserAndUrlData = async (
  userId: string,
  accessToken: string
): Promise<any> => {
  try {
    const userResponse = await fetchCalendlyUser(accessToken);
    const userUri = userResponse.resource.uri;

    const eventTypes = await getCalendlyEventTypes(userUri, accessToken);
    const scheduledEventUrls = eventTypes?.collection.map(
      (event: { scheduling_url: string }) => event.scheduling_url
    );

    // Save the data to your server
    await updateUserData(userId, { scheduledEventUrls });

    return userResponse.resource; // Return the user data if needed
  } catch (error) {
    console.error("Error saving Calendly user and event URLs:", error);
    throw new Error("Failed to save Calendly user and event URL data.");
  }
};

// Fetch Calendly user
const fetchCalendlyUser = async (accessToken: string): Promise<any> => {
  try {
    const response = await calendlyApiClient.get("/users/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching Calendly user:",
      error.response?.data || error.message
    );
    throw new Error("Failed to fetch Calendly user.");
  }
};

// Fetch event types for the given user
export const getCalendlyEventTypes = async (
  userUri: string,
  accessToken: string
): Promise<any> => {
  try {
    const response = await calendlyApiClient.get("/event_types", {
      params: { user: userUri },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching Calendly event types:",
      error.response?.data || error.message
    );
    throw new Error("Failed to fetch Calendly event types.");
  }
};

// Update user data on your server
const updateUserData = async (
  userId: string,
  data: { scheduledEventUrls: string[] }
) => {
  try {
    await axios.put(`/api/users/${userId}`, data); // Assuming axiosInstance is pre-configured
  } catch (error: any) {
    console.error(
      "Error updating user data on the server:",
      error.response?.data || error.message
    );
    throw new Error("Failed to update user data.");
  }
};
