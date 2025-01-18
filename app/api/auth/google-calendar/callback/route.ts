import { NextResponse } from "next/server";
import { getGoogleAuthClient } from "@/lib/google";
import axiosInstance from "@/app/utils/axiosInstance";
import { updateGoogleCalendarToken } from "@/app/actions/google-calendar/tokenData";
import { currentUser } from "@clerk/nextjs/server";
import { createRedirectResponse } from "@/lib/redirectHelper";
import { Credentials } from "google-auth-library";
// Handle token exchange

async function exchangeAuthorizationCode(code: string) {
  const client = await getGoogleAuthClient();
  const response = await client.getToken(code);
  return response?.tokens || null;
}

// Save tokens in cookies
// async function saveTokensInCookies(tokens: {
//   access_token: string;
//   refresh_token: string;
// }) {
//   await axiosInstance.post("/api/auth/google-calendar/set-cookies", {
//     access_token: tokens.access_token,
//     refresh_token: tokens.refresh_token,
//   });
// }

// Update user tokens in the database
async function updateUserTokens(tokens: Credentials) {
  const user = await currentUser();
  if (!user?.id) {
    throw new Error("Failed to fetch the current user.");
  }
  await updateGoogleCalendarToken(user.id, tokens);
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return createRedirectResponse("/connect-google-calendar", {
      response: "Authorization code not found.",
      status: "error",
    });
  }

  try {
    // Exchange authorization code for tokens
    const tokens = await exchangeAuthorizationCode(code);

    if (!tokens) {
      return createRedirectResponse("/connect-google-calendar", {
        response: "Failed to fetch tokens.",
        status: "error",
      });
    }

    // Save tokens and update user data
    // await saveTokensInCookies(tokens);
    await updateUserTokens(tokens);

    // Redirect to /customer-dashboard on success
      return createRedirectResponse("/salesperson-dashboard", {
          response:"Google Calendar connected successfully.",
          status:"success"
  });
  } catch (error: any) {
    console.error("Error in Google Calendar callback:", error);

    // Redirect to /connect-google-calendar on any error
      return createRedirectResponse("/connect-google-calendar", {
          response:error.message || "An unknown error occurred.",
         status: "error"
   } );
  }
}
