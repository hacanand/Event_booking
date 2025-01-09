import axiosInstance from "@/app/utils/axiosInstance";
import axios from "axios";

export const getCalendlyAuthUrl = (): string => {
  const clientId = process.env.NEXT_PUBLIC_CALENDLY_CLIENT_ID!;
  const redirectUri = process.env.NEXT_PUBLIC_CALENDLY_REDIRECT_URI!;
//   const scope = "scheduler.me:read scheduler.appointments:read";
  const responseType = "code";

  return `https://auth.calendly.com/oauth/authorize?client_id=${clientId}&response_type=${responseType}&redirect_uri=${redirectUri} `;
};

export const exchangeCodeForToken = async (code: string) => {
  // console.log(code)
  const response = await axios.post("https://auth.calendly.com/oauth/token", {
    grant_type: "authorization_code",
    client_id: process.env.NEXT_PUBLIC_CALENDLY_CLIENT_ID!,
    client_secret: process.env.CALENDLY_CLIENT_SECRET!,
    redirect_uri: process.env.NEXT_PUBLIC_CALENDLY_REDIRECT_URI!,
    code,
  });

  return response.data; // Contains access_token, refresh_token, and expires_in
};

export const refreshAccessToken = async (refreshToken: string) => {
  const response = await axios.post("https://auth.calendly.com/oauth/token", {
    grant_type: "refresh_token",
    // client_id: process.env.NEXT_PUBLIC_CALENDLY_CLIENT_ID!,
    // client_secret: process.env.CALENDLY_CLIENT_SECRET!,
    refresh_token: refreshToken,
  });

  return response.data; // Contains new access_token, refresh_token, and expires_in
};

export const saveCalendlyUserAndUrlData = async (userId:string,accessToken: string) => {
  const response = await axios.get("https://api.calendly.com/users/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const uri = response.data.resource.uri;
  const eventTypes = await getCalendlyEventTypes(uri, accessToken);
  console.log(eventTypes);
  const scheduled_url = eventTypes.collection[0]?.scheduling_url;
  const updateUser = await axiosInstance.put("/api/users", {
    clerkId: userId,
    schedulesEventUrl: scheduled_url,
    calendlyUserUrl: uri,
  });
  return updateUser; 
};

export async function getCalendlyEventTypes(uri: string, accessToken: string) {
  try {
    const response = await axios.get("https://api.calendly.com/event_types", {
      params: {
        user: uri, // Construct the user URL dynamically
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`, // Use the provided API key
      },
    });

    return response.data; // Return the data on success
  } catch (error : any) {
    console.error(
      "Error fetching Calendly event types:",
      error.response?.data || error.message
    );
    throw error; // Throw error for further handling if needed
  }
}

 