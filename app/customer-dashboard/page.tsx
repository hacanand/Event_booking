'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CalendarIcon, Clock, User, PlusCircle } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { PageTransition } from '@/components/page-transition'
import { useClerk } from '@clerk/nextjs'


interface Meeting {
  id: string
  salespersonName: string
  date: string
  time: string
}

export default function CustomerDashboardPage() {
  const router = useRouter()
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const { user } = useClerk()
  useEffect(() => {
    if (!user) {
      router.push('/sign-in')
    } else {
      const mockMeetings: Meeting[] = [
        { id: '1', salespersonName: 'John Doe', date: '2024-12-31', time: '10:00 AM' },
        { id: '2', salespersonName: 'Jane Smith', date: '2025-01-02', time: '2:00 PM' },
        { id: '3', salespersonName: 'Mike Johnson', date: '2025-01-03', time: '11:30 AM' },
      ]
      const storedMeetings = JSON.parse(localStorage.getItem('customerMeetings') || '[]')
      setMeetings([...mockMeetings, ...storedMeetings])
    }
  }, [user, router])

  const handleViewDetails = (meeting: Meeting) => {
    setSelectedMeeting(meeting)
    setIsDetailsOpen(true)
  }

  const handleCancelMeeting = (meetingId: string) => {
    setMeetings(meetings.filter(meeting => meeting.id !== meetingId))
    setIsDetailsOpen(false)
    const storedMeetings = JSON.parse(localStorage.getItem('customerMeetings') || '[]')
    const updatedStoredMeetings = storedMeetings.filter((meeting: Meeting) => meeting.id !== meetingId)
    localStorage.setItem('customerMeetings', JSON.stringify(updatedStoredMeetings))
  }

  if (!user) return null

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center mb-8"
          >
            <h1 className="text-3xl font-bold text-[#14144B]">
              Customer Dashboard
            </h1>
            <Button asChild className="bg-[#00FF8C] text-[#14144B] hover:bg-[#00FF8C]/90 transition-colors duration-200">
              <Link href="/customer/book-slot">
                <PlusCircle className="mr-2 h-4 w-4" />
                Book New Meeting
              </Link>
            </Button>
          </motion.div>
          <Card>
            <CardHeader>
              <CardTitle>Your Scheduled Meetings</CardTitle>
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
                                <p className="font-semibold text-[#14144B]">{meeting.salespersonName}</p>
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
            <DialogTitle className="text-[#14144B] text-xl font-semibold">Meeting Details</DialogTitle>
          </DialogHeader>
          {selectedMeeting && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-base font-semibold text-[#14144B] mb-1">Date and Time</h3>
                <div className="flex items-center space-x-2 text-gray-600">
                  <CalendarIcon className="h-4 w-4" />
                  <span>{selectedMeeting.date}</span>
                  <Clock className="h-4 w-4 ml-2" />
                  <span>{selectedMeeting.time}</span>
                </div>
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#14144B] mb-3">Calendar</h3>
                <div className="border rounded-lg p-4 bg-white">
                  <Calendar
                    mode="single"
                    selected={new Date(selectedMeeting.date)}
                    defaultMonth={new Date(selectedMeeting.date)}
                    className="w-full [&_.rdp-day]:!p-0 [&_.rdp-day]:!w-auto [&_.rdp-day]:!h-auto [&_.rdp-button]:!p-2 [&_.rdp-button]:!w-auto [&_.rdp-button]:!h-auto [&_.rdp-button]:!rounded-none [&_.rdp-button]:!bg-transparent [&_.rdp-button]:hover:!bg-transparent"
                    footer={null}
                  />
                </div>
              </div>
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => handleCancelMeeting(selectedMeeting.id)}
              >
                Cancel Meeting
              </Button>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </PageTransition>
  )
}

