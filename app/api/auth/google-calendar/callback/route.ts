import { NextResponse } from "next/server";
import { getGoogleAuthClient } from "@/lib/google";
import axiosInstance from "@/app/utils/axiosInstance";
import { updateGoogleCalendarToken } from "@/app/actions/google-calendar/tokenData";
import { currentUser } from "@clerk/nextjs/server";
import { createRedirectResponse } from "@/lib/redirectHelper";
import { Credentials } from "google-auth-library";
import { title } from "process";
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
    return createRedirectResponse(
      "/salesperson/onboarding/connect-google-calendar",
      {
        title: "Code is not valid",
        description: "Please try again.",
        variant: "destructive",
      }
    );
  }

  try {
    // Exchange authorization code for tokens
    const tokens = await exchangeAuthorizationCode(code);

    if (!tokens) {
      return createRedirectResponse(
        "/salesperson/onboarding/connect-google-calendar",
        {
          title: "Failed to exchange code for tokens",
          description: "Please try again.",
          variant: "destructive",
        }
      );
    }

    // Save tokens and update user data
    // await saveTokensInCookies(tokens);
    await updateUserTokens(tokens);

    // Redirect to /customer-dashboard on success
      return createRedirectResponse("/salesperson/onboarding/share-link", {
        title: "Google Calendar connected successfully",
        description:
          "You can now share your Calendly link with your customers.",
        variant: "default",
      });
  } catch (error: any) {
    console.error("Error in Google Calendar callback:", error);

    // Redirect to /connect-google-calendar on any error
      return createRedirectResponse(
        "/salesperson/onboarding/connect-google-calendar",
        {
          title: "Failed to connect Google Calendar",
          description: "Please try again.",
          variant: "destructive",
        }
      );
  }
}
