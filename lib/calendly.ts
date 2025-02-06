import axiosInstance from "@/app/utils/axiosInstance";
import { CalendlyEventResponse, CalendlyEventType, CalendlyUserResponse } from "@/types/calendly";
import axios from "axios";
 
export const getCalendlyAuthUrl = (): string => {
  const clientId = process.env.NEXT_PUBLIC_CALENDLY_CLIENT_ID!;
  const redirectUri = process.env.NEXT_PUBLIC_CALENDLY_REDIRECT_URI!;
  const responseType = "code";

  return `https://auth.calendly.com/oauth/authorize?client_id=${clientId}&response_type=${responseType}&redirect_uri=${redirectUri}`;
};

export const exchangeCodeForToken = async (
  code: string
): Promise<{
  access_token: string;
  refresh_token: string;
  expires_in: number;
}> => {
  const response = await axios.post("https://auth.calendly.com/oauth/token", {
    grant_type: "authorization_code",
    client_id: process.env.NEXT_PUBLIC_CALENDLY_CLIENT_ID!,
    client_secret: process.env.CALENDLY_CLIENT_SECRET!,
    redirect_uri: process.env.NEXT_PUBLIC_CALENDLY_REDIRECT_URI!,
    code,
  });

  return response.data;
};

export const refreshAccessToken = async (
  refreshToken: string
): Promise<{
  access_token: string;
  refresh_token: string;
  expires_in: number;
}> => {
  const response = await axios.post("https://auth.calendly.com/oauth/token", {
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  return response?.data;
};

export const saveCalendlyUserAndUrlData = async (
  userId: string,
  accessToken: string
): Promise<CalendlyUserResponse> => {
  const response = await axios.get<CalendlyUserResponse>(
    "https://api.calendly.com/users/me",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const uri = response.data.resource.uri;
  const eventTypes = await getCalendlyEventTypes(uri, accessToken);
  const scheduledEventUrls = eventTypes?.collection.map(
    (event: CalendlyEventType) => event.scheduling_url
  );

  await axiosInstance.put(`/api/users/${userId}`, {
    scheduledEventUrls: scheduledEventUrls,
  });

  return response.data;
};

export async function getCalendlyEventTypes(
  uri: string,
  accessToken: string
): Promise<CalendlyEventResponse> {
  try {
    const response = await axios.get<CalendlyEventResponse>(
      "https://api.calendly.com/event_types",
      {
        params: {
          user: uri,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching Calendly event types:", error);
    throw error;
  }
}

// Fetch events from Calendly
export async function getCalendlyEvents(): Promise<CalendlyEventResponse> {
  const response = await axios.get<CalendlyEventResponse>(
    `${process.env.CALENDLY_API_BASE}/scheduled_events`,
    {
      params: {
        user: "https://api.calendly.com/users/82d3f20e-56d7-47fd-9b92-14d9566f5434",
      },
      headers: {
        Authorization: `Bearer ${process.env.CALENDLY_ACCESS_TOKEN}`,
      },
    }
  );
  return response.data;
}
