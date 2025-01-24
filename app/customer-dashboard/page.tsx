"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PopupButton } from "react-calendly";
import { CalendarIcon } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import axiosInstance from "../utils/axiosInstance";

const fadeIn = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};

interface Meeting {
  id: string;
  salespersonName: string;
  date: Date;
  time: string;
}

export default function CustomerDashboardPage() {
  const router = useRouter();
  const { user } = useUser();
  const [sharedUserData, setSharedUserData] = useState<any>(null);
  const searchParams = useSearchParams();
  const sharedUserId = searchParams.get("userId");

  const fetchSharedData = useCallback(
    async (sharedUserId: string) => {
      try {
        const res = await axiosInstance.get(`/api/users/${sharedUserId}`);
        if (res.data.success) {
          const sharedUser = res.data.data;
          // console.log("Shared user data res.data.data:", sharedUser);
          if (
            !sharedUser.scheduledEventUrls ||
            sharedUser.scheduledEventUrls.length === 0
          ) {
            console.warn("No scheduled event URLs available for this user.");
          }

          setSharedUserData(sharedUser);
          console.log("Shared user data checked:", sharedUser);
        } else {
          console.error("Failed to fetch shared user data:", res.data.message);
        }
      } catch (error) {
        console.error("Error fetching shared user data:", error);
      }
    },
    [sharedUserId]
  );
  console.time("fetchUserData");
  useEffect(() => {
    if (sharedUserId) {
      fetchSharedData(sharedUserId); // Fetch shared user data
    }
  }, [sharedUserId, fetchSharedData]);
  console.timeEnd("fetchUserData");
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="text-3xl font-bold mb-8"
        >
          Welcome, {user?.firstName || "Guest"}!
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ delay: 0.2 }}
            className="col-span-full"
          >
            <Card className="bg-white backdrop-blur-lg border-neutral-300 h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarIcon className="mr-2 text-[#00FF8C]" />
                  Schedule a Meeting
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mt-2 text-sm text-gray-600">
                  Ready to book a meeting with {sharedUserData?.firstName}!
                </p>
                {sharedUserData?.scheduledEventUrls?.length ?? 0 > 0 ? (
                  <PopupButton
                    key={1}
                    className="mt-4 p-2 rounded-md bg-[#00FF8C] text-[#14144B] hover:bg-[#00FF8C]/90"
                    url={sharedUserData?.scheduledEventUrls?.[0] || ""}
                    text="Book Now"
                    rootElement={document.body}
                    prefill={{
                      name: user?.firstName! + " " + user?.lastName!,
                      email: user?.emailAddresses?.[0]?.emailAddress!,
                    }}
                    pageSettings={{
                      backgroundColor: "ffffff",
                      hideEventTypeDetails: false,
                      hideLandingPageDetails: false,
                      primaryColor: "00FF8C",
                      textColor: "14144B",
                    }}
                  />
                ) : (
                  <p key={2} className="mt-4 text-sm text-red-500">
                    No available meeting links. Please check back later.
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
