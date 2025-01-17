'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from "next/image"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CalendarIcon, Clock, User, CheckCircle, CalendarPlus2Icon as CalendarIcon2, LinkIcon } from 'lucide-react'
import { useUser } from "@clerk/nextjs"

const fadeIn = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 }
}

interface Meeting {
  id: string
  customerName: string
  date: Date
  time: string
}

export default function SalespersonDashboardPage() {
  const router = useRouter()
  const { user } = useUser()
  const [meetings, setMeetings] = useState<Meeting[]>([
    { id: '1', customerName: 'Alice Johnson', date: new Date(2023, 11, 15), time: '10:00 AM' },
    { id: '2', customerName: 'Bob Smith', date: new Date(2023, 11, 16), time: '2:00 PM' },
    { id: '3', customerName: 'Charlie Brown', date: new Date(2023, 11, 17), time: '11:30 AM' },
  ])
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const handleViewDetails = (meeting: Meeting) => {
    setSelectedMeeting(meeting)
    setIsDetailsOpen(true)
  }

  useEffect(() => {
    if (!user) {
      router.push('/sign-in')
    }
    
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="text-3xl font-bold mb-8"
        >
          Welcome, {user.firstName || user.username}!
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white/10 backdrop-blur-lg border-neutral-500 shadow-lg h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarIcon2 className="mr-2 text-[#00FF8C]" />
                  Calendly
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-[#00FF8C]">
                  <CheckCircle className="mr-2" />
                  <span>Connected</span>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Your Calendly account is successfully linked.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white/10 backdrop-blur-lg border-neutral-500 shadow-lg h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarIcon className="mr-2 text-[#00FF8C]" />
                  Google Calendar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-[#00FF8C]">
                  <CheckCircle className="mr-2" />
                  <span>Connected</span>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Your Google Calendar is successfully synced.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-white/10 backdrop-blur-lg border-neutral-500 shadow-lg h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LinkIcon className="mr-2 text-[#00FF8C]" />
                  Booking Link
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-[#00FF8C]">
                  <CheckCircle className="mr-2" />
                  <span>Active</span>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Your booking link is ready to be shared.
                </p>
                <Button
                  onClick={() => {
                    /* Add copy link functionality */

                  }}
                  variant="outline"
                  className="mt-4 text-[#00FF8C] border-[#00FF8C] hover:bg-[#00FF8C] hover:text-[#14144B]"
                >
                  Copy Link
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2"
          >
            <Card className="bg-white backdrop-blur-lg border-neutral-500">
              <CardHeader>
                <CardTitle>Upcoming Meetings</CardTitle>
              </CardHeader>
              <CardContent>
                {meetings.length === 0 ? (
                  <p className="text-gray-500">No meetings scheduled yet.</p>
                ) : (
                  <ul className="space-y-4">
                    {meetings.map((meeting, index) => (
                      <motion.li
                        key={meeting.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="bg-white/5 hover:bg-white/10 transition-colors border-neutral-300 duration-200">
                          <CardContent className="flex items-center justify-between p-4">
                            <div className="flex items-center space-x-4">
                              <User className="h-6 w-6 text-[#00FF8C]" />
                              <div>
                                <p className="font-semibold">
                                  {meeting.customerName}
                                </p>
                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                  <CalendarIcon className="h-4 w-4" />
                                  <span>
                                    {meeting.date.toLocaleDateString()}
                                  </span>
                                  <Clock className="h-4 w-4 ml-2" />
                                  <span>{meeting.time}</span>
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              onClick={() => handleViewDetails(meeting)}
                              className="text-[#00FF8C] border-[#00FF8C] hover:bg-[#00FF8C] hover:text-[#14144B]"
                            >
                              View Details
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ delay: 0.6 }}
          >
            <Card className="bg-white backdrop-blur-lg border-neutral-500">
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  selected={new Date()}
                  className="rounded-md border-none bg-transparent text-black"
                />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="bg-white text-black border-neutral-500">
          <DialogHeader>
            <DialogTitle>Meeting Details</DialogTitle>
          </DialogHeader>
          {selectedMeeting && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div>
                <h3 className="font-semibold text-[#00FF8C]">Customer</h3>
                <p>{selectedMeeting.customerName}</p>
              </div>
              <div>
                <h3 className="font-semibold text-[#00FF8C] mb-2">
                  Date and Time
                </h3>
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-4 w-4 text-[#00FF8C]" />
                  <span>{selectedMeeting.date.toLocaleDateString()}</span>
                  <Clock className="h-4 w-4 ml-2 text-[#00FF8C]" />
                  <span>{selectedMeeting.time}</span>
                </div>
              </div>
              {/* <div>
                <h3 className="font-semibold text-[#00FF8C] mb-2">Actions</h3>
                <div className="flex space-x-2">
                  <Button className="bg-[#00FF8C] text-[#14144B] hover:bg-[#00FF8C]/90">
                    Reschedule
                  </Button>
                  <Button
                    variant="outline"
                    className="text-[#00FF8C] border-[#00FF8C] hover:bg-[#00FF8C] hover:text-[#14144B]"
                  >
                    Cancel Meeting
                  </Button>
                </div>
              </div> */}
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

