"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Calendar } from "../../components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Toast as toast } from "../../components/ui/toast";

export default function SchedulePage({
  params,
}: {
  params: { salesId: string };
}) {
  const router = useRouter();
  const { userId } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    undefined
  );

  // Mock available time slots
  const availableTimeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
  ];

  const handleScheduleMeeting = () => {
    if (!selectedDate || !selectedTime) {
      toast({
        message: "Error",
        description: "Please select both a date and time.",
        type: "error",
      });
      return;
    }

    // Here you would typically make an API call to save the meeting
    console.log("Scheduling meeting:", {
      salesId: params.salesId,
      customerId: userId,
      date: selectedDate,
      time: selectedTime,
    });

    toast({
      message: "Meeting Scheduled",
      description: `Your meeting has been scheduled for ${selectedDate.toDateString()} at ${selectedTime}.`,
    });

    router.push("/dashboard");
  };

  if (!userId) {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-[#14144B]">
              Schedule a Meeting with Salesperson
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 w-full">
            <div className="w-full flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border w-full [&_.rdp]:w-full [&_.rdp-table]:w-full [&_.rdp-caption]:w-full [&_.rdp-cell]:w-[14.28%] [&_.rdp-head_th]:w-[14.28%]"
              />
            </div>
            <div>
              <h3 className="text-lg font-medium text-[#14144B] mb-2">
                Select a Time
              </h3>
              <Select onValueChange={setSelectedTime}>
                <SelectTrigger className="w-full">
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
            </div>
            <Button
              onClick={handleScheduleMeeting}
              className="w-full bg-[#00FF8C] text-[#14144B] hover:bg-[#00FF8C]/90"
            >
              Schedule Meeting
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
