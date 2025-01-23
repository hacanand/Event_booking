"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LinkIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Steps } from "@/components/steps";
import { CelebrationModal } from "@/components/celebration-modal";
import { useUser } from "@clerk/nextjs";
import axiosInstance from "@/app/utils/axiosInstance";

export default function ShareLinkPage() {
  const router = useRouter();
  const { user } = useUser();
  const [showCelebration, setShowCelebration] = useState(false);
  const [sharedLink, setSharedLink] = useState<string[]>([]); // Initialize as an array

  const steps = [
    { id: 1, title: "Connect Calendly" },
    { id: 2, title: "Check Connection" },
    { id: 3, title: "Connect Google Calendar" },
    { id: 4, title: "Share Link" },
  ];

  const BaseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  function shareableLink(BaseUrl:string, userId: string) {
    if (!BaseUrl) {
      throw new Error("Base URL is not defined in the environment variables.");
    }

    if (!userId) {
      throw new Error("User ID is required.");
    }

    return sharedLink.map((_) => {
      const url = new URL(BaseUrl); // Construct the full
      url.searchParams.set("userId", userId);
      return url.toString(); // Return the complete URL as a string
    });
  }

  // useEffect(() => {
  //   const dataFetch = async () => {
  //     if (!user) {
  //       console.warn("User is not logged in or not loaded.");
  //       return;
  //     }
  //     try {
  //       const res = await axiosInstance.get(`/api/users/${user?.id}`);
  //       const eventUrls = res?.data?.data?.scheduledEventUrls; // Adjusted path if API structure is correct

  //       if (eventUrls && Array.isArray(eventUrls) && eventUrls.length > 0) {
  //         setSharedLink(eventUrls[0]); // Set the array of URLs
  //       } else {
  //         console.warn("No scheduled event URLs found for the user.");
  //         setSharedLink([]); // Set an empty array when no URLs are found
  //       }
  //     } catch (error: any) {
  //       console.error("Error fetching user data:", error.message || error);
  //       setSharedLink([]); // Clear the shared link on error
  //     }
  //   };

  //   dataFetch();
  // }, [user]);
  const handleShareLink = (link: string) => {
    if (sharedLink) {
      navigator.clipboard.writeText(link);
      setShowCelebration(true);
    } else {
      console.warn("No link to copy.");
    }
  };

  const handleNextStep = () => {
    router.push("/salesperson/dashboard");
  };

  useEffect(() => {
    if (showCelebration) {
      const timer = setTimeout(() => {
        setShowCelebration(false);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [showCelebration]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <Card className="p-8">
          <div className="mb-12">
            <Steps steps={steps} currentStep={4} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-[#14144B]">
                Your Booking Link
              </h2>
              <p className="text-gray-500">
                Your unique booking link has been generated. Click the button
                below to copy it.
              </p>
              <div className="p-4 w-full flex flex-col bg-gray-100 rounded-md space-y-4">
                {sharedLink.length > 0 ? (
                  <div className="w-full flex items-center justify-between p-2 bg-white shadow-sm rounded-md">
                    <p className="text-sm w-8/12 font-mono break-words">
                      {shareableLink(BaseUrl!, user?.id!)[0] ||
                        "Loading booking link..."}
                    </p>
                    <Button
                      onClick={() =>
                        handleShareLink(shareableLink(BaseUrl!, user?.id!)[0])
                      }
                      className="w-3/12 bg-[#00FF8C] text-[#14144B] hover:bg-[#00FF8C]/90"
                    >
                      <LinkIcon className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm font-mono text-center text-gray-500">
                    No booking links available.
                  </p>
                )}
              </div>

              <Button
                onClick={handleNextStep}
                className="w-full bg-[#14144B] text-white hover:bg-[#14144B]/90"
              >
                Complete Onboarding
              </Button>
            </div>
          </motion.div>

          <CelebrationModal
            isOpen={showCelebration}
            onClose={() => setShowCelebration(false)}
          />
        </Card>
      </div>
    </div>
  );
}
