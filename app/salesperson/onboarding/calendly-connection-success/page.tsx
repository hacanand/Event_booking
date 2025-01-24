"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Steps } from "@/components/steps";

export default function CalendlyConnectionSuccess() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false); // Button loading state

  function handleNext() {
    setLoading(true); // Show loading state
    setTimeout(() => {
      router.push("/salesperson/onboarding/check-connection");
      setLoading(false); // Reset loading after navigation
    }, 1000); // Simulate loading delay
  }

  // Get response query parameters from URL
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

  const steps = [
    { id: 1, title: "Connect Calendly" },
    { id: 2, title: "Check Connection" },
    { id: 3, title: "Connect Google Calendar" },
    { id: 4, title: "Share Link" },
  ];

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
            className="space-y-6 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <CheckCircle className="w-24 h-24 text-green-500 mx-auto" />
            </motion.div>
            <h2 className="text-2xl font-bold text-[#14144B]">
              Calendly Connected Successfully!
            </h2>
            <p className="text-gray-500">
              Your Calendly account has been successfully connected. You can now
              manage your appointments and schedule meetings effortlessly.
            </p>
            <Button
              onClick={handleNext}
              className="w-full bg-[#00FF8C] text-[#14144B] hover:bg-[#00FF8C]/90"
              disabled={loading} // Disable button when loading
            >
              {loading ? (
                <>
                  <div className="loader mr-2"></div> Processing...
                </>
              ) : (
                <>Continue to Next Step</>
              )}
            </Button>
          </motion.div>
        </Card>
      </div>
    </div>
  );
}
