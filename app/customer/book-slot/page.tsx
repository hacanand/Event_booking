"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/app/contexts/toast-context";
import { PageTransition } from "@/app/components/page-transition";
import { motion } from "framer-motion";
import { MeetingScheduledSuccess } from "@/app/components/meeting-scheduled-success";

export default function BookSlotPage() {
  const router = useRouter();
  const { user } = useUser();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    undefined
  );
  const [isBooked, setIsBooked] = useState(false);
  const { showToast } = useToast();

  const availableTimeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
  ];

  const handleBookMeeting = () => {
    if (!selectedDate || !selectedTime) {
      showToast("Please select both a date and time.", "error");
      return;
    }

    // Here you would typically make an API call to book the meeting
    console.log("Booking meeting:", {
      customerId: user?.id,
      date: selectedDate,
      time: selectedTime,
    });

    setIsBooked(true);

    // Redirect to customer dashboard after a short delay
    setTimeout(() => {
      router.push("/dashboard");
    }, 3000);
  };

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-[#14144B] to-[#0A0A2A] py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-white/10 backdrop-blur-lg border-none">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white">
                Book a Meeting with a Salesperson
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-lg font-medium text-white mb-2">
                  Select a Date
                </h3>
                <Calendar
                  // mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border-none bg-white/5 text-white"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h3 className="text-lg font-medium text-white mb-2">
                  Select a Time
                </h3>
                <Select onValueChange={setSelectedTime}>
                  <SelectTrigger className="w-full bg-white/5 text-white border-none">
                    <SelectValue placeholder="Select a time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTimeSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Button
                  onClick={handleBookMeeting}
                  className="w-full bg-[#00FF8C] text-[#14144B] hover:bg-[#00FF8C]/90"
                >
                  Book Meeting
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </div>
      </div>
      {isBooked && selectedDate && selectedTime && (
        <MeetingScheduledSuccess
          isOpen={isBooked}
          onClose={() => setIsBooked(false)}
          date={selectedDate}
          time={selectedTime}
        />
      )}
    </PageTransition>
  );
}
