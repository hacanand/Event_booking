import axios from "axios";

export const getCalendlyAuthUrl = (): string => {
  const clientId = process.env.NEXT_PUBLIC_CALENDLY_CLIENT_ID!;
  const redirectUri = process.env.NEXT_PUBLIC_CALENDLY_REDIRECT_URI!;
//   const scope = "scheduler.me:read scheduler.appointments:read";
  const responseType = "code";

  return `https://auth.calendly.com/oauth/authorize?client_id=${clientId}&response_type=${responseType}&redirect_uri=${redirectUri} `;
};

export const exchangeCodeForToken = async (code: string) => {
  console.log(code)
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
    client_id: process.env.NEXT_PUBLIC_CALENDLY_CLIENT_ID!,
    client_secret: process.env.CALENDLY_CLIENT_SECRET!,
    refresh_token: refreshToken,
  });

  return response.data; // Contains new access_token, refresh_token, and expires_in
};

