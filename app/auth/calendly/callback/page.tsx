
// import { routeChange } from "@/app/actions/redirect";
import { registerCalendlyWebhook } from "@/app/scripts/registerWebhook";
import axiosInstance from "@/app/utils/axiosInstance";
import { exchangeCodeForToken, saveCalendlyUserAndUrlData } from "@/lib/calendly";
import { currentUser } from "@clerk/nextjs/server";
import { access } from "fs";
 

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
      const res = await exchangeCodeForToken(code);
        const { data } = await axiosInstance.post("/api/auth/calendly/set-cookies", {
          access_token: res?.access_token,
          refresh_token: res?.refresh_token,
        });
        
        // console.log(data);
        // console.log(access_token,"refreshToken:-",refresh_token)
          const user=await currentUser()
         if (user?.id) {
           const response= await saveCalendlyUserAndUrlData(
             user?.id,
             res?.access_token
           );
            const regWebhook = await registerCalendlyWebhook(
              res?.access_token,
              response?.resource?.current_organization
            );
           console.log("webhook console :-", regWebhook);
         } else {
           return <p>User ID not found.</p>;
         }
        return <p>calendly cookies set</p>
    // redirect("/?calendly-auth=success");
  } catch (error) {
    console.error("Error exchanging code for token:", error);
    return <p>Error during authentication.</p>;
  }
}
