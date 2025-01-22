'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CalendarIcon, Clock, User, X } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { motion, AnimatePresence } from 'framer-motion'
import { PageTransition } from '@/components/page-transition'
import { useClerk } from '@clerk/nextjs'

interface Meeting {
  id: string
  customerName: string
  date: string
  time: string
}

export default function DashboardPage() {
  const { user } = useClerk()
  const router = useRouter()
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push("/sign-in");
    } else {
      const mockMeetings: Meeting[] = [
        { id: '1', customerName: 'Alice Johnson', date: '2024-12-31', time: '10:00 AM' },
        { id: '2', customerName: 'Bob Smith', date: '2025-01-02', time: '2:00 PM' },
        { id: '3', customerName: 'Charlie Brown', date: '2025-01-03', time: '11:30 AM' },
      ]
      setMeetings(mockMeetings)
    }
  }, [user, router])

  const handleViewDetails = (meeting: Meeting) => {
    setSelectedMeeting(meeting)
    setIsDetailsOpen(true)
  }

  if (!user) return null

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-[#14144B] mb-8"
          >
            Salesperson Dashboard
          </motion.h1>
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Meetings</CardTitle>
            </CardHeader>
            <CardContent>
              {meetings.length === 0 ? (
                <p className="text-gray-500">No meetings scheduled yet.</p>
              ) : (
                <motion.ul className="space-y-4">
                  <AnimatePresence>
                    {meetings.map((meeting, index) => (
                      <motion.li
                        key={meeting.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card>
                          <CardContent className="flex items-center justify-between p-4">
                            <div className="flex items-center space-x-4">
                              <User className="h-6 w-6 text-[#14144B]" />
                              <div>
                                <p className="font-semibold text-[#14144B]">{meeting.customerName}</p>
                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                  <CalendarIcon className="h-4 w-4" />
                                  <span>{meeting.date}</span>
                                  <Clock className="h-4 w-4 ml-2" />
                                  <span>{meeting.time}</span>
                                </div>
                              </div>
                            </div>
                            <Button variant="outline" onClick={() => handleViewDetails(meeting)}>View Details</Button>
                          </CardContent>
                        </Card>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </motion.ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[425px]">
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
                <h3 className="font-semibold text-[#14144B]">Customer</h3>
                <p>{selectedMeeting.customerName}</p>
              </div>
              <div>
                <h3 className="font-semibold text-[#14144B] mb-2">Date and Time</h3>
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-4 w-4 text-[#14144B]" />
                  <span>{selectedMeeting.date}</span>
                  <Clock className="h-4 w-4 ml-2 text-[#14144B]" />
                  <span>{selectedMeeting.time}</span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-[#14144B] mb-2">Calendar</h3>
                <Calendar
                  mode="single"
                  selected={new Date(selectedMeeting.date)}
                  className="rounded-md border"
                />
              </div>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </PageTransition>
  )
}

