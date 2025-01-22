'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
 
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
 
 
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, CalendarIcon, Clock } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { useToast } from '@/hooks/use-toast'
// import { useAuth } from '@/components/auth-context'
import { PageTransition } from '@/components/page-transition'
import { useUser } from '@clerk/nextjs'

export default function BookSlotPage() {
  const router = useRouter()
  const { user } = useUser()
  const {toast}=useToast()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined)
  const [salespersonName, setSalespersonName] = useState('')
  const [isBooked, setIsBooked] = useState(false)
  const [bookedMeeting, setBookedMeeting] = useState<{ salespersonName: string; date: string; time: string } | null>(null)

  const availableTimeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
  ]

  const handleBookMeeting = () => {
    if (!selectedDate || !selectedTime || !salespersonName) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      })
      return
    }

    const newMeeting = {
      id: Date.now().toString(),
      salespersonName: salespersonName,
      date: selectedDate.toISOString().split('T')[0],
      time: selectedTime
    }

    const existingMeetings = JSON.parse(localStorage.getItem('customerMeetings') || '[]')
    localStorage.setItem('customerMeetings', JSON.stringify([...existingMeetings, newMeeting]))

    setBookedMeeting(newMeeting)
    setIsBooked(true)

    setTimeout(() => {
      router.push('/customer-dashboard')
    }, 3000)
  }

  if (!user) {
    router.push("/sign-in");
    return null
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {!isBooked ? (
              <Card key="booking-form">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-[#14144B]">
                    Book a Meeting with a Salesperson
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h3 className="text-lg font-medium text-[#14144B] mb-4">Select a Date</h3>
                    <div className="w-full">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="w-full [&_.rdp-day]:!p-0 [&_.rdp-day]:!w-auto [&_.rdp-day]:!h-auto [&_.rdp-button]:!p-2 [&_.rdp-button]:!w-auto [&_.rdp-button]:!h-auto [&_.rdp-button]:!rounded-none [&_.rdp-button]:!bg-transparent [&_.rdp-button]:hover:!bg-transparent"
                        footer={null}
                      />
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <h3 className="text-lg font-medium text-[#14144B] mb-2">Select a Time</h3>
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
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <h3 className="text-lg font-medium text-[#14144B] mb-2">Salesperson Name</h3>
                    <Input
                      type="text"
                      placeholder="Enter salesperson's name"
                      value={salespersonName}
                      onChange={(e) => setSalespersonName(e.target.value)}
                      className="w-full"
                    />
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
            ) : bookedMeeting && (
              <motion.div
                key="success-animation"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-lg"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                >
                  <CheckCircle className="w-24 h-24 text-green-500" />
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-6 text-2xl font-bold text-[#14144B]"
                >
                  Meeting Booked Successfully!
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-2 text-gray-600 text-center"
                >
                  Your meeting with {bookedMeeting.salespersonName} has been scheduled for {bookedMeeting.date} at {bookedMeeting.time}.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-4 text-gray-500"
                >
                  Redirecting to dashboard...
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  )
}

