"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCalendlyAuthUrl } from "@/lib/calendly";
import { useToast } from "@/app/contexts/toast-context";
import { isCalendlyLoggedIn } from "../actions/calendly/tokenAndDataUpdate";
import { useAuth } from "@clerk/nextjs";
import { Loader } from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};

export default function ConnectCalendlyPage() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const router = useRouter();
  const { showToast } = useToast();
  const searchParams = useSearchParams();
  const { userId, isLoaded } = useAuth(); // `isLoaded` indicates if the auth state is ready

  const success = searchParams.get("response");
  const status = searchParams.get("status");

  useEffect(() => {
    if (!isLoaded) return; // Wait for `useAuth` to load

    if (!userId) {
      // Handle the case where userId is missing
      setIsLoading(false);
      showToast("User authentication failed. Please log in.", "error");
      router.push("/login"); // Redirect to login if necessary
      return;
    }

    // Display toast messages if present
    if (success && status) {
      showToast(success, status as any);
    }

    // Check if Calendly is already connected
    const checkCalendlyConnection = async () => {
      try {
        const res = await isCalendlyLoggedIn({ clerkId: userId });
        if (res) {
          // Redirect to /connect-google-calendar with query params
          router.push(
            `/connect-google-calendar?response=Calendly+already+connected&status=success`
          );
        } else {
          setIsLoading(false); // Calendly is not connected; render the UI
        }
      } catch (error) {
        console.error("Failed to check Calendly connection status:", error);
        setIsLoading(false);
      }
    };

    checkCalendlyConnection();
  }, [isLoaded, userId, success, status, showToast, router]);

  const handleConnectCalendly = async () => {
    setIsConnecting(true);
    try {
      const url = getCalendlyAuthUrl();
      router.push(url);
    } catch (error) {
      console.error(error);
    } finally {
      setIsConnecting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size={48} className="text-[#00FF8C] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="sm:mx-auto sm:w-full sm:max-w-md"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hiipitch-nSS262YxQ47CjsI2Du1QfvET8Ik6l6.png"
          alt="hiipitch logo"
          width={120}
          height={40}
          className="mx-auto"
          unoptimized
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-black">
          Connect Your Calendly
        </h2>
      </motion.div>

      <motion.div
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-white/10 backdrop-blur-lg">
          <CardContent className="pt-6">
            <motion.p
              className="text-center mb-6 text-black"
              variants={fadeIn}
              transition={{ delay: 0.3 }}
            >
              Connect your Calendly account to start managing your appointments
              efficiently.
            </motion.p>
            <motion.div variants={fadeIn} transition={{ delay: 0.4 }}>
              <Button
                onClick={handleConnectCalendly}
                disabled={isConnecting} // Disable while connecting
                className="w-full bg-[#00FF8C] text-[#14144B] hover:bg-[#00FF8C]/90 transition-colors duration-300"
              >
                {isConnecting ? "Connecting..." : "Connect Calendly"}
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
