import { CalendarConnect } from "./calendar-connect";
import { getGoogleAuthUrl } from "@/lib/google";
import { getCalendlyAuthUrl } from "@/lib/calendly";

export default async function CalendarConnectWrapper() {
  const calendlyAuthUrl = getCalendlyAuthUrl(); // Server-side function
  const googleAuthUrl = getGoogleAuthUrl(); // Server-side function

  return (
    <CalendarConnect
      calendlyAuthUrl={calendlyAuthUrl}
      googleAuthUrl={googleAuthUrl}
    />
  );
}
