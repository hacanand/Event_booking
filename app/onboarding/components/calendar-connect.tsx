'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface CalendarConnectProps {
  onComplete: () => void
}

export function CalendarConnect({ onComplete }: CalendarConnectProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#14144B]">Connect Your Calendar</h2>
        <p className="text-gray-500 mt-2">Choose your preferred calendar service</p>
      </div>
      
      <div className="grid gap-4">
        <Card className="p-4 cursor-pointer hover:shadow-lg transition-shadow">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => {
              // Add Calendly integration logic here
              onComplete()
            }}
          >
            Connect with Calendly
          </Button>
        </Card>
        
        <Card className="p-4 cursor-pointer hover:shadow-lg transition-shadow">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => {
              // Add Google Calendar integration logic here
              onComplete()
            }}
          >
            Connect with Google Calendar
          </Button>
        </Card>
      </div>
    </div>
  )
}

