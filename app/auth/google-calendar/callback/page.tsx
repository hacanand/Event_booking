import { getGoogleAuthClient } from "@/lib/google";
import { routeChange } from "@/app/actions/redirect"; // Assume this is the server-side `redirect` function
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import axiosInstance from "@/app/utils/axiosInstance";
import { updateGoogleCalendarToken } from "@/app/actions/token/tokenData";
 

export default async function CallbackPage({
  searchParams,
}: {
  searchParams: { code: string };
}) {
  const code = (await searchParams).code;

  if (!code) {
    return <p>Authorization code not found.</p>;
  }

  const client = await getGoogleAuthClient();
  const clerk_client= await clerkClient();
  try {
    const response = await client.getToken(code);
    const tokens = response?.tokens;
    if (!tokens) {
      return <p>Failed to fetch tokens. Please try again.</p>;
    }

    try {
      // const response = await axios.request(options);
      await axiosInstance.post("/api/auth/google-calendar/set-cookies", {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      });
      // console.log(resp);
      const user = await currentUser()
      await updateGoogleCalendarToken(user?.id!, tokens?.refresh_token!);
      return <p>Google Calendar cookies set</p>;
    } catch (error) {
      console.error("Error setting cookies:", error);
      return <p>Failed to set cookies. Please try again.</p>;
    }
  } catch (error) {
    console.error("Error fetching tokens:", error);
    return <p>Failed to fetch tokens. Please try again.</p>;
  }
  
}
