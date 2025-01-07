
import { getGoogleAuthClient } from "@/lib/google";
import { redirect } from "next/navigation";
// import { setCookies } from "./setCookies";?
import axios from "axios";
import { access } from "fs";

export default async function CallbackPage({
  searchParams,
}: {
  searchParams: { code: string };
}) {
  const code = await searchParams.code;

  if (!code) {
    return <p>Authorization code not found.</p>;
  }
// console.log(code)
  const client = await getGoogleAuthClient();
  // let tokens;
  try {
    const response = await client.getToken(code);
    const tokens = response?.tokens;
    console.log(tokens);

    const options = {
      method: "POST",
      url:  `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/google-calendar/set-cookies`,
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      data: {
        access_token:tokens.access_token,
        refresh_token:tokens.refresh_token
     
      },
    };

    try {
      const { data } = await axios.request(options);
      console.log(data);
      redirect("/?google-auth=success");
    } catch (error) {
      console.error(error);
      return <p>Failed to set cookies. Please try again.</p>;
    }
  
  } catch (error) {
    console.error("Error fetching tokens:", error);
    return <p>Failed to fetch tokens. Please try again.</p>;
  }

  
   
  // redirect("/");
}
