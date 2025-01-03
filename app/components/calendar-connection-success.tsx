"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { Button } from "./ui/button";

interface CalendarConnectionSuccessProps {
  onContinue: () => void;
}

export function CalendarConnectionSuccess({
  onContinue,
}: CalendarConnectionSuccessProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center space-y-6"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <CheckCircle className="w-24 h-24 text-green-500 mx-auto" />
      </motion.div>
      <h2 className="text-2xl font-bold text-[#14144B]">
        Calendar Connected Successfully!
      </h2>
      <p className="text-gray-500">
        Your calendar has been successfully connected. You can now manage your
        appointments and schedule meetings effortlessly.
      </p>
      <div className="space-y-2">
        <p className="font-medium text-[#14144B]">Connected Services:</p>
        <ul className="list-disc list-inside text-gray-600">
          <li>Google Calendar</li>
          <li>Calendly</li>
        </ul>
      </div>
      <Button
        onClick={onContinue}
        className="w-full bg-[#00FF8C] text-[#14144B] hover:bg-[#00FF8C]/90"
      >
        Continue to Next Step
      </Button>
    </motion.div>
  );
}
