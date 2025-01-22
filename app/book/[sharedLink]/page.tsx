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
import { CheckCircle } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { useToast } from '@/hooks/use-toast'
import { PageTransition } from '@/components/page-transition'

export default function CustomerBookingPage({ params }: { params: { sharedLink: string } }) {
  const router = useRouter()
  const { user } = useUser()
  const { toast } = useToast()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined)
  const [isBooked, setIsBooked] = useState(false)

  // Mock available time slots
  const availableTimeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
  ]

  const handleBookMeeting = () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Error",
        description: "Please select both a date and time.",
        variant: "destructive",
      })
      return
    }

    // Here you would typically make an API call to book the meeting
    console.log('Booking meeting:', {
      sharedLink: params.sharedLink,
      customerId: user?.id,
      date: selectedDate,
      time: selectedTime
    })

    setIsBooked(true)

    // Redirect to customer dashboard after a short delay
    setTimeout(() => {
      router.push('/customer-dashboard')
    }, 3000)
  }

  if (!user) {
    router.push('/sign-in')
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
                    Book a Meeting with Salesperson
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h3 className="text-lg font-medium text-[#14144B] mb-2">Select a Date</h3>
                    <div className="w-full flex justify-center">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="rounded-md border w-full [&_.rdp]:w-full [&_.rdp-table]:w-full [&_.rdp-caption]:w-full [&_.rdp-cell]:w-[14.28%] [&_.rdp-head_th]:w-[14.28%]"
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
            ) : (
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
                  className="mt-2 text-gray-600"
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

