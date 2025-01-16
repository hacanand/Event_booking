import { registerCalendlyWebhook } from "@/scripts/registerWebhook";
import {
  exchangeCodeForToken,
  saveCalendlyUserAndUrlData,
} from "@/lib/calendly";
import { currentUser } from "@clerk/nextjs/server";
import { createToken } from "@/app/actions/google-calendar/tokenData";
import axiosInstance from "@/app/utils/axiosInstance";
// import { redirect } from "next/navigation";

export default async function CallbackPage({
  searchParams,
}: {
  searchParams: { code: string };
}) {
  const code = (await searchParams).code;
  if (!code) {
    return <p> Authorization code not found.</p>;
  }
  try {
    console.time("calendly-auth");
    const res = await exchangeCodeForToken(code);
    await axiosInstance.post("/api/auth/calendly/set-cookies", {
      access_token: res?.access_token,
      refresh_token: res?.refresh_token,
    });
    console.timeLog("calendly-auth");
    // console.log(data);
    // console.log( "refreshToken:-",res.refresh_token)

    const user = await currentUser();

    if (user?.id) {
      await createToken(user.id, res?.refresh_token);
      const response = await saveCalendlyUserAndUrlData(
        user?.id,
        res?.access_token
      );
      const regWebhook = await registerCalendlyWebhook(
        res?.access_token,
        response?.resource?.current_organization
      );
      console.log("webhook console :-", regWebhook);
      console.timeLog("calendly-auth");
    } else {
      return <p>User ID not found.</p>;
    }
    console.timeEnd("calendly-auth");

    return <p>calendly cookies set</p>;

    // redirect("/?calendly-auth=success");
  } catch (error) {
    console.error("Error exchanging code for token:", error);
    console.timeEnd("calendly-auth");
    return <p>Error during authentication.</p>;
  }
}
