'use server'
import { google } from "googleapis";
const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];

export async function getGoogleAuthClient() {
  return new google.auth.OAuth2(
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!
  );
}

export async function getGoogleAuthUrl() {
  const oauth2Client = getGoogleAuthClient();
  return (await oauth2Client).generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
  });
}

export async function setCredentialsRefreshToken(req: any) {
  const oauth2Client = getGoogleAuthClient();
  const refreshToken = await req.cookies["google-refresh-token"];
  (await oauth2Client).setCredentials({ refresh_token: refreshToken });
  return oauth2Client;
}

  