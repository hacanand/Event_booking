
import { exchangeCodeForToken } from "@/lib/calendly";
import axios from "axios";
import { redirect } from "next/navigation";

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
    // const response = await axios.post("/api/auth/calendly/refresh-token", { code });
    const res = await exchangeCodeForToken(code);
    const { access_token, refresh_token } = res;
      const options = {
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/calendly/set-cookies`,
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        data: {
          access_token: access_token,
          refresh_token:refresh_token,
        },
      };

      try {
        const { data } = await axios.request(options);
        console.log(data);
        return <p>calendly cookies set</p>
        // redirect("/?calendly-auth=success");
      } catch (error) {
        console.error(error);
        return <p>Failed to set cookies. Please try again.</p>;
      }
  
    // redirect("/?calendly-auth=success");
  } catch (error) {
    console.error("Error exchanging code for token:", error);
    return <p>Error during authentication.</p>;
  }
}
