'use server'

import axiosInstance from "@/app/utils/axiosInstance";
import Token from "@/models/tokenModel";
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


export async function getCalendlyToken({ clerkId }: { clerkId: string }) {
  if (!clerkId) {
    throw new Error("clerkId is required.");
  }

  try {
    // Find the token document by clerkId
    const tokenDocument = await Token.findOne({ clerkId });

    if (!tokenDocument) {
      throw new Error("Token document not found.");
    }

    // Return the Calendly token
    return { calendlyRefreshToken: tokenDocument.calendlyRefreshToken };
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred while fetching the Calendly token.");
  }
}

 export async function isCalendlyLoggedIn({ clerkId }: { clerkId: string }) {
   if (!clerkId) {
     throw new Error("clerkId is required.");
   }

   try {
     // Find the token document by clerkId
     const tokenDocument = await Token.findOne({ clerkId });

     if (!tokenDocument?.calendlyRefreshToken) {
       throw new Error("Token document not found.");
     }
     return true;
   } catch (error) {
     console.error(error);
     return false;
   }
 }
    


 export async function fetchGoogleCalendarEventId(
   eventUri: string
 ): Promise<string | null> {
   try {
     const res = await axiosInstance.put("/api/auth/calendly/refresh-token");
     const token = res.data.data.accessToken;

     if (!token) {
       console.error("Google Calendar API token not found");
       return null;
     }

     const options = {
       method: "GET",
       url: `https://api.calendly.com/scheduled_events/${eventUri
         .split("/")
         .pop()}`,
       headers: {
         "Content-Type": "application/json",
         Authorization: `Bearer ${token}`,
       },
     };

     const response = await axios.request(options);
     return response.data.resource.calendar_event.external_id || null;
   } catch (error) {
     console.error("Error fetching Google Calendar Event ID:", error);
     return null;
   }
 }
