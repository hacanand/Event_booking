import { getGoogleAuthClient } from "@/lib/google";
import axios from "axios";
import { routeChange } from "@/app/actions/redirect"; // Assume this is the server-side `redirect` function
import { cookies } from "next/headers";
import { currentUser } from "@clerk/nextjs/server";
import axiosInstance from "@/app/utils/axiosInstance";

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

  try {
    const response = await client.getToken(code);
    const tokens = response?.tokens;
    // console.log(tokens);

    // const options = {
    //   method: "POST",
    //   url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/google-calendar/set-cookies`,
    //   headers: {
    //     Accept: "*/*",
    //     "User-Agent": "Thunder Client (https://www.thunderclient.com)",
    //     "Content-Type": "application/json",
    //   },
    //   data: {
    //     access_token: tokens.access_token,
    //     refresh_token: tokens.refresh_token,
    //   },
    //   withCredentials: true,
    // };

    try {
      // const response = await axios.request(options);
      const resp = await axiosInstance.post("/api/auth/google-calendar/set-cookies", {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      });
      console.log(resp);
      const user = await currentUser()
      const user_id = user?.id;
      const updatedUser = axiosInstance.put('/api/users', {
        clerkId: user_id,
        google_refresh_token: tokens.refresh_token,
      });
      // console.log(updatedUser)
      // console.log(response.headers);
      const cookieStore = await cookies();
      const res = cookieStore.get("google-access-token");
      return <p>Google cookies set{ res?.value}</p>;


    } catch (error) {
      console.error("Error setting cookies:", error);
      return <p>Failed to set cookies. Please try again.</p>;
    }
  } catch (error) {
    console.error("Error fetching tokens:", error);
    return <p>Failed to fetch tokens. Please try again.</p>;
  }
}
