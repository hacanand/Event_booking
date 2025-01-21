'use client'

import { useEffect, useState } from 'react'
 
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CalendarIcon, Clock, PlusCircle } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
 
import { motion } from 'framer-motion'
import Link from 'next/link'
import { PageTransition } from '@/components/page-transition'
import { useAuth } from '@/components/auth-context'

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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

  let user;
  try {
    const { user: authUser } = useAuth()
    user = authUser
  } catch (error) {
    console.error("Auth context not available:", error)
    useEffect(() => {
      router.push('/login')
    }, [router])
    return null
  }

  useEffect(() => {
    if (!user) {
      router.push('/login')
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

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    const selectedMeeting = date ? meetings.find(meeting => meeting.date === date.toISOString().split('T')[0]) : undefined
    if (selectedMeeting) {
      setSelectedMeeting(selectedMeeting)
      setIsDetailsOpen(true)
    }
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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <CardTitle>Your Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 bg-white">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => handleDateSelect(date)}
                  className="w-full"
                />
              </div>
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
                <h3 className="text-base font-semibold text-[#14144B] mb-1">Salesperson</h3>
                <p className="text-gray-600">{selectedMeeting.salespersonName}</p>
              </div>
              <DialogFooter>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => handleCancelMeeting(selectedMeeting.id)}
                >
                  Cancel Meeting
                </Button>
              </DialogFooter>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </PageTransition>
  )
}

