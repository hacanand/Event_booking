"use client";
import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Calendar } from "../components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

export default function CustomerDashboardPage() {
  const { userId } = useAuth();

  if (!userId) {
    return (
      <div className="flex items-center justify-center h-[90vh]">
        <p className=" font-semibold text-xl">Loading...</p>
      </div>
    );
  }

  const availableTimeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#14144B] text-center">
            Book a Meeting
          </h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Select Date and Time</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-[#14144B] mb-3">
                Choose a Date
              </h3>
              <Calendar mode="single" className="rounded-md border w-full" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-[#14144B] mb-3">
                Choose a Time
              </h3>
              <Select>
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
            <Button className="w-full bg-[#00FF8C] text-[#14144B] hover:bg-[#00FF8C]/90">
              Book Meeting
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
