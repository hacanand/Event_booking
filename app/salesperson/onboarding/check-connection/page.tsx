"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Steps } from "@/components/steps";
import { useEffect, Suspense } from "react";
import { useToast } from "@/hooks/use-toast";

function CheckConnectionContent() {
  const router = useRouter();
  const { toast } = useToast();

  const steps = [
    { id: 1, title: "Connect Calendly" },
    { id: 2, title: "Check Connection" },
    { id: 3, title: "Connect Google Calendar" },
    { id: 4, title: "Share Link" },
  ];

  const handleNextStep = () => {
    router.push("/salesperson/onboarding/connect-google-calendar");
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
            <Steps steps={steps} currentStep={2} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-[#14144B]">
                Check Calendly-Google Connection
              </h2>
              <p className="text-gray-500">
                Let&apos;s check if your Calendly is connected to Google
                Calendar
              </p>
              <Button
                onClick={handleNextStep}
                className="w-full bg-[#00FF8C] text-[#14144B] hover:bg-[#00FF8C]/90"
              >
                Check Connection
              </Button>
            </div>
          </motion.div>
        </Card>
      </div>
    </div>
  );
}

export default function CheckConnectionPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckConnectionContent />
    </Suspense>
  );
}
