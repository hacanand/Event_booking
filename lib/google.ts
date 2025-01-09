// import axios from "axios";

import { google } from "googleapis";
// import { cookies } from "next/headers";s
const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];

export   function getGoogleAuthClient() {
  return new google.auth.OAuth2(
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!
  );
}

export   function getGoogleAuthUrl() {
  const oauth2Client = getGoogleAuthClient();
  return  oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
  });
}
// export async function getAccessToken() {
//   const accessToken = (await cookies()).get("google-access-token");
//   const refreshToken = (await cookies()).get("google-refresh-token");

//   if (!accessToken && refreshToken) {
//     const response = await axios.post("/api/auth/google-calendar/refresh-token");s
//     return response.data.accessToken;
//   }

//   if (!accessToken) {
//     throw new Error("Missing access token");
//   }

//   return accessToken;
// }
