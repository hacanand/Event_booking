import { NextResponse } from "next/server";
import { getGoogleAuthClient } from "@/lib/google";
import { isGoggleCalLoggedIn, updateGoogleCalendarToken } from "@/app/actions/google-calendar/tokenData";
import { currentUser } from "@clerk/nextjs/server";
import { createRedirectResponse } from "@/lib/redirectHelper";
 
import { Credentials } from "google-auth-library";

// Handle token exchange
async function exchangeAuthorizationCode(code: string) {
  const client = await getGoogleAuthClient();
  const response = await client.getToken(code);
  return response?.tokens || null;
}

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

  try {
    // Fetch the current user
    const user = await currentUser();
    if (!user?.id) {
      return createRedirectResponse(
        "/salesperson/onboarding/connect-google-calendar",
        {
          title: "User not found",
          description: "Please try again.",
          variant: "destructive",
        }
      );
    }

    // Check if Google Calendar is already connected using server action
    const isConnected = await isGoggleCalLoggedIn({ clerkId: user.id });
    if (isConnected) {
      return createRedirectResponse("/salesperson/onboarding/share-link", {
        title: "Google Calendar already connected",
        description:
          "You can now share your Calendly link with your customers.",
        variant: "default",
      });
    }

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
    await updateUserTokens(tokens);

    // Redirect to the next step on success
    return createRedirectResponse("/salesperson/onboarding/share-link", {
      title: "Google Calendar connected successfully",
      description: "You can now share your Calendly link with your customers.",
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
