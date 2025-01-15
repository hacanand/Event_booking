import { google } from "googleapis";
import { getCalendlyAuthUrl } from "./calendly";
import {CalendarConnect} from "@/app/onboarding/components/calendar-connect"; // Adjust the path as necessary
const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];

export function getGoogleAuthClient() {
  return new google.auth.OAuth2(
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!
  );
}

export function getGoogleAuthUrl() {
  const oauth2Client = getGoogleAuthClient();
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
  });
}

export async function setCredentialsRefreshToken(req: any) {
  const oauth2Client = getGoogleAuthClient();
  const refreshToken = await req.cookies["google-refresh-token"];
  oauth2Client.setCredentials({ refresh_token: refreshToken });
  return oauth2Client;
}

 
// Fetch events from Google Calendar
// export async function getGoogleCalendarEvents(
//   calendarId: string,
//   timeMin: string,
//   timeMax: string
// ): Promise<any> {

//  const authClient = await setCredentialsRefreshToken(req, res);
//   const calendar = google.calendar({ version: "v3", auth: authClient });
//   const response = await calendar.events.list({
//     calendarId,
//     timeMin,
//     timeMax,
//   });
//   return response.data;
// }

// export const authorize = async (): Promise<Auth.OAuth2Client> => {
//   try {
//     // Get credentials from environment variables
//     const client_id = process.env.CLIENT_ID;
//     const client_secret = process.env.CLIENT_SECRET;
//     const redirect_uri = process.env.REDIRECT_URI;
//     const token = process.env.TOKEN;

//     if (!client_id || !client_secret || !redirect_uri || !token) {
//       throw new Error("Missing required environment variables.");
//     }

//     const oAuth2Client = new google.auth.OAuth2(
//       client_id,
//       client_secret,
//       redirect_uri
//     );

//     // Set credentials from environment variable
//     oAuth2Client.setCredentials(JSON.parse(token));
//     return oAuth2Client;
//   } catch (err) {
//     console.error("Error during authorization:", err);
//     throw err; // Propagate the error to the caller
//   }
// };
