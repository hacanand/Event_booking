import { registerCalendlyWebhook } from "@/scripts/registerWebhook";
import {
  exchangeCodeForToken,
  saveCalendlyUserAndUrlData,
} from "@/lib/calendly";
import { currentUser } from "@clerk/nextjs/server";
import { createToken } from "@/app/actions/google-calendar/tokenData";
import axiosInstance from "@/app/utils/axiosInstance";
import { redirect } from "next/navigation";

export default async function CallbackPage({
  searchParams,
}: {
  searchParams: { code: string };
}) {
  const code = searchParams?.code;

  if (!code) {
    redirect("/connect-google-calendar?error=missing_code");
    return null; // Prevent further execution
  }

  try {
    console.time("calendly-auth");

    const res = await exchangeCodeForToken(code);

    // Set cookies for Calendly tokens
    await axiosInstance.post("/api/auth/calendly/set-cookies", {
      access_token: res?.access_token,
      refresh_token: res?.refresh_token,
    });

    const user = await currentUser();

    if (user?.id) {
      // Save token and user data
      // await createToken(user.id, res?.refresh_token);
      const response = await saveCalendlyUserAndUrlData(
        user.id,
        res.access_token
      );

      // Register Calendly webhook
      await registerCalendlyWebhook(
        res.access_token,
        response?.resource?.current_organization
      );
    } else {
      redirect("/connect-google-calendar?error=user_not_found");
      return null; // Prevent further execution
    }

    console.timeEnd("calendly-auth");

    // Redirect to Google Calendar connection page after successful authentication
    redirect("/connect-google-calendar");
    return null; // Prevent further execution
  } catch (error) {
    console.error("Error exchanging code for token:", error);
    console.timeEnd("calendly-auth");
    redirect("/connect-google-calendar?error=auth_failed");
    return null; // Prevent further execution
  }
}
