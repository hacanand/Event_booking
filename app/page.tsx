 
import { currentUser } from "@clerk/nextjs/server";
import axiosInstance from "./utils/axiosInstance";
import { CalendarConnect } from "./onboarding/components/calendar-connect";
import { cookies } from "next/headers";
// axios.defaults;

export default async function Home() {
  const user = await currentUser();
  if (user) {
    //create user in db
    const res = await axiosInstance.post("/api/users", {
      clerkId: user?.id,
      userType: user?.publicMetadata?.role,
      email: user?.emailAddresses[0]?.emailAddress,
      firstName: user?.firstName,
      lastName: user?.lastName,
      profilePicture: user?.imageUrl,
    });
  //    const respo = await axiosInstance.get("/api/events");
  //    console.log(respo);
  }
 
//   const cookieStore = await cookies();
//   const res = cookieStore.get('google-access-token'
//   )
//  console.log(res?.value)
  return <CalendarConnect calendlyAuthUrl={""} googleAuthUrl={""} />;
}
