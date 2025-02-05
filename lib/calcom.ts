import axiosInstance from "@/app/utils/axiosInstance";
import axios from "axios";

export const getCalComAuthUrl = (): string => {
  const clientId = process.env.NEXT_PUBLIC_CALCOM_CLIENT_ID!;
  const redirectUri = process.env.NEXT_PUBLIC_CALCOM_REDIRECT_URI!;
  const responseType = "code";

  return `https://app.cal.com/auth/oauth2/authorize?client_id=${clientId}&response_type=${responseType}&redirect_uri=${redirectUri}`;
};

export const exchangeCodeForToken = async (code: string) => {
  const response = await axios.post("https://api.cal.com/oauth/token", {
    grant_type: "authorization_code",
    client_id: process.env.NEXT_PUBLIC_CALCOM_CLIENT_ID!,
    client_secret: process.env.CALCOM_CLIENT_SECRET!,
    redirect_uri: process.env.NEXT_PUBLIC_CALCOM_REDIRECT_URI!,
    code,
  });

  return response.data; // Contains access_token, refresh_token, and expires_in
};

export const refreshAccessToken = async (refreshToken: string) => {
  const response = await axios.post("https://api.cal.com/oauth/token", {
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  return response?.data; // Contains new access_token, refresh_token, and expires_in
};

export const saveCalComUserAndUrlData = async (
  userId: string,
  accessToken: string
) => {
  const response = await axios.get("https://api.cal.com/v1/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const userIdFromApi = response.data.id;
  const eventTypes = await getCalComEventTypes(userIdFromApi, accessToken);
  const scheduledEventUrls = eventTypes.map(
    (event: any) => event.scheduling_url
  );

  await axiosInstance.put(`/api/users/${userId}`, {
    scheduledEventUrls: scheduledEventUrls,
  });

  return response.data;
};

export async function getCalComEventTypes(userId: string, accessToken: string) {
  try {
    const response = await axios.get(`https://api.cal.com/v1/event-types`, {
      params: {
        userId: userId,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data; // Return event types
  } catch (error: any) {
    console.error(
      "Error fetching Cal.com event types:",
      error.response?.data || error.message
    );
    throw error;
  }
}

// Fetch scheduled events from Cal.com
export async function getCalComEvents(): Promise<any> {
  const response = await axios.get("https://api.cal.com/v1/scheduled-events", {
    headers: {
      Authorization: `Bearer ${process.env.CALCOM_ACCESS_TOKEN}`,
    },
  });
  return response.data;
}
