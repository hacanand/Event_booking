import { NextResponse } from "next/server";
import { registerCalendlyWebhook } from "@/scripts/registerWebhook";
import {
  exchangeCodeForToken,
  saveCalendlyUserAndUrlData,
} from "@/lib/calendly";
import { currentUser } from "@clerk/nextjs/server";
// import axiosInstance from "@/app/utils/axiosInstance";
import { createRedirectResponse } from "@/lib/redirectHelper";
import { createToken } from "@/app/actions/google-calendar/tokenData";
 

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");

    if (!code) {
      return createRedirectResponse(
        "/salesperson/onboarding/connect-calendly",
        {
          title: "Code is not Valid",
          description: "Please try again.",
          variant: "destructive",
        }
      );
    }

    // console.time("calendly-auth");

    // Exchange authorization code for tokens
    const res = await exchangeCodeForToken(code);

    // Set cookies for Calendly tokens
    // await axiosInstance.post("/api/auth/calendly/set-cookies", {
    //   access_token: res?.access_token,
    //   refresh_token: res?.refresh_token,
    // });
    const user = await currentUser();

    if (!user?.id) {
      return createRedirectResponse(
        "/salesperson/onboarding/connect-calendly",
        {
          title: "User not found",
          description: "Please try again.",
          variant: "destructive",
        }
      );
    }

    // Save token and user data

    await createToken(user.id, res?.refresh_token);
    const response = await saveCalendlyUserAndUrlData(
      user.id,
      res.access_token
    );

    // Register Calendly webhook
    // await registerCalendlyWebhook(
    //   res.access_token,
    //   response?.resource?.current_organization
    // );

    // console.timeEnd("calendly-auth");

    // Redirect to success page with query params
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
    console.error("Error in Calendly OAuth callback:", error);
    console.timeEnd("calendly-auth");
    return createRedirectResponse("/salesperson/onboarding/connect-calendly", {
      title: "Error",
      description: "Please try again.",
      variant: "destructive",
    });
  }
}
