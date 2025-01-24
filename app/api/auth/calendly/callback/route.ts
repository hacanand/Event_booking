import { NextResponse } from "next/server";
import { registerCalendlyWebhook } from "@/scripts/registerWebhook";
import {
  exchangeCodeForToken,
  saveCalendlyUserAndUrlData,
 
} from "@/lib/calendly";
import { currentUser } from "@clerk/nextjs/server";
import { createRedirectResponse } from "@/lib/redirectHelper";
import { createToken } from "@/app/actions/google-calendar/tokenData";
import { isCalendlyLoggedIn } from "@/app/actions/calendly/tokenAndDataUpdate";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");

    // Fetch the current user
    const user = await currentUser();
    if (!user?.id) {
      console.error("Error: User not found during Calendly connection");
      return createRedirectResponse(
        "/salesperson/onboarding/connect-calendly",
        {
          title: "User Not Found",
          description: "Unable to identify the user. Please log in again.",
          variant: "destructive",
        }
      );
    }

    // Check if Calendly is already connected
    const isConnected = await isCalendlyLoggedIn({ clerkId: user.id });
    if (isConnected) {
      return createRedirectResponse(
        "/salesperson/onboarding/calendly-connection-success",
        {
          title: "Calendly Already Connected",
          description:
            "Your Calendly account is already connected. Redirecting to the next step.",
          variant: "default",
        }
      );
    }

    if (!code) {
      console.warn("Error: Missing authorization code in request");
      return createRedirectResponse(
        "/salesperson/onboarding/connect-calendly",
        {
          title: "Authorization Code Missing",
          description: "Please try again by reconnecting Calendly.",
          variant: "destructive",
        }
      );
    }

    // Exchange authorization code for tokens
    let tokenResponse;
    try {
      tokenResponse = await exchangeCodeForToken(code);
    } catch (error) {
      console.error("Error exchanging code for token:", error);
      return createRedirectResponse(
        "/salesperson/onboarding/connect-calendly",
        {
          title: "Token Exchange Failed",
          description:
            "There was an issue exchanging the authorization code. Please try again.",
          variant: "destructive",
        }
      );
    }

    const { access_token, refresh_token } = tokenResponse || {};
    if (!access_token || !refresh_token) {
      console.error(
        "Error: Missing tokens in Calendly response",
        tokenResponse
      );
      return createRedirectResponse(
        "/salesperson/onboarding/connect-calendly",
        {
          title: "Invalid Calendly Response",
          description: "Tokens could not be retrieved. Please try again.",
          variant: "destructive",
        }
      );
    }

    // Save token and user data
    try {
      await createToken(user.id, refresh_token);
      const userCalendlyData = await saveCalendlyUserAndUrlData(
        user.id,
        access_token
      );

      // Optionally register a Calendly webhook
      // await registerCalendlyWebhook(
      //   access_token,
      //   userCalendlyData?.resource?.current_organization
      // );
    } catch (error) {
      console.error("Error saving Calendly user data or tokens:", error);
      return createRedirectResponse(
        "/salesperson/onboarding/connect-calendly",
        {
          title: "Data Saving Failed",
          description:
            "An error occurred while saving your Calendly data. Please try again.",
          variant: "destructive",
        }
      );
    }

    // Redirect to success page
    return createRedirectResponse(
      "/salesperson/onboarding/calendly-connection-success",
      {
        title: "Calendly Connected Successfully!",
        description:
          "Your Calendly account has been successfully connected. You can now manage your appointments and schedule meetings effortlessly.",
        variant: "default",
      }
    );
  } catch (error) {
    console.error("Unexpected error during Calendly OAuth callback:", error);
    return createRedirectResponse("/salesperson/onboarding/connect-calendly", {
      title: "Unexpected Error",
      description: "An unexpected error occurred. Please try again later.",
      variant: "destructive",
    });
  }
}
