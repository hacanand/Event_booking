"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { Steps } from "@/components/steps";
import { getCalendlyAuthUrl } from "@/lib/calendly";
import { useToast } from "@/hooks/use-toast";

function CalendlyContent() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const steps = [
    { id: 1, title: "Connect Calendly" },
    { id: 2, title: "Check Connection" },
    { id: 3, title: "Connect Google Calendar" },
    { id: 4, title: "Share Link" },
  ];

  const handleCalendlyConnection = async () => {
    try {
      setLoading(true);
      const authUrl = getCalendlyAuthUrl();
      if (!authUrl)
        throw new Error("Unable to get Calendly authorization URL.");
      toast({
        title: "Redirecting...",
        description: "Please wait while we redirect you to Calendly.",
        variant: "default",
      });
      router.push(authUrl);
    } catch (error) {
      console.error("Error connecting Calendly:", error);
      toast({
        title: "Error",
        description:
          "Failed to initiate Calendly connection. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const searchParams = useSearchParams();
  const title = searchParams.get("title");
  const description = searchParams.get("description");
  const variant = searchParams.get("variant") as
    | "default"
    | "destructive"
    | null
    | undefined;

  useEffect(() => {
    if (title && description && variant) {
      toast({
        title,
        description,
        variant,
      });
    }
  }, [title, description, variant, toast]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <Card className="p-8">
          <div className="mb-12">
            <Steps steps={steps} currentStep={1} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-[#14144B]">
                Connect Your Calendly
              </h2>
              <p className="text-gray-500">
                Connect your Calendly account to manage your appointments
              </p>
              <Button
                onClick={handleCalendlyConnection}
                className="w-full bg-[#00a3fa] hover:bg-[#00a3fa]/90 text-white"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="loader mr-2"></div> Connecting...
                  </>
                ) : (
                  <>
                    <Calendar className="mr-2 h-4 w-4" />
                    Connect with Calendly
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </Card>
      </div>
    </div>
  );
}

export default function ConnectCalendlyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CalendlyContent />
    </Suspense>
  );
}
