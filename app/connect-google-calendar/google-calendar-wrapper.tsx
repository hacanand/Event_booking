'use server'
import { getGoogleAuthUrl } from "@/lib/google";
export   const googleAuthUrl = async () => {
   const googleAuthUrl =   getGoogleAuthUrl();
  return  googleAuthUrl;
};
