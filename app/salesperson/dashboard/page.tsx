// "use client"

// import { useRouter } from "next/navigation"
// import { useEffect } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { PageTransition } from "@/components/page-transition"
// import { useUser } from "@clerk/nextjs"
// // import { useAuth } from "@/components/auth-context"
 
// export default function SalespersonDashboardPage() {
//   const router = useRouter()
//   const { user } = useUser()

//   useEffect(() => {
//     if (!user || user.unsafeMetadata.role !== "salesperson") {
//       router.push("/sign-in")
//     }
//   }, [user, router])

//   if (!user) return null

//   return (
//     <PageTransition>
//       <div className="min-h-screen bg-gray-50 py-12">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <h1 className="text-3xl font-bold text-[#14144B] mb-8">
//             Salesperson Dashboard
//           </h1>
//           <Card>
//             <CardHeader>
//               <CardTitle>Welcome, {user?.emailAddresses[0].emailAddress}</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p>
//                 This is your salesperson dashboard. More features coming soon!
//               </p>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </PageTransition>
//   );
// }



"use client";

// import {   useState } from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
 
import {
  CalendarIcon,
  CheckCircle,
  CalendarPlus2Icon as CalendarIcon2,
  LinkIcon,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
// import axiosInstance from "@/app/utils/axiosInstance";

const fadeIn = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};
 

export default function SalespersonDashboardPage() {
  // const router = useRouter();
  const { user } = useUser();
   
 
  const shareableLink = `${
    process.env.NEXT_PUBLIC_BASE_URL
  }/customer-dashboard?userId=${user?.id ?? ''}&role=customer`;
  
 
  return (
    <div className="min-h-screen bg-white text-black">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="text-3xl font-bold mb-8"
        >
          Welcome, {user?.firstName }!
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white/10 backdrop-blur-lg border-neutral-500 shadow-lg h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarIcon2 className="mr-2 text-[#00FF8C]" />
                  Calendly
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-[#00FF8C]">
                  <CheckCircle className="mr-2" />
                  <span>Connected</span>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Your Calendly account is successfully linked.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white/10 backdrop-blur-lg border-neutral-500 shadow-lg h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarIcon className="mr-2 text-[#00FF8C]" />
                  Google Calendar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-[#00FF8C]">
                  <CheckCircle className="mr-2" />
                  <span>Connected</span>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Your Google Calendar is successfully synced.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-white/10 backdrop-blur-lg border-neutral-500 shadow-lg h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LinkIcon className="mr-2 text-[#00FF8C]" />
                  Booking Link
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-[#00FF8C]">
                  <CheckCircle className="mr-2" />
                  <span>Active</span>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Your booking link is ready to be shared.
                </p>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(shareableLink);
                  }}
                  variant="outline"
                  className="mt-4 text-[#00FF8C] border-[#00FF8C] hover:bg-[#00FF8C] hover:text-[#14144B]"
                >
                  Copy Link
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

