'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Calendar } from 'lucide-react'
import { motion } from 'framer-motion'

export function CustomerOnboarding() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleViewCalendar = () => {
    setLoading(true)
    // Simulate API call or data fetching
    setTimeout(() => {
      router.push('/schedule')
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <Card className="p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-[#14144B]">Welcome to hiipitch</h2>
            <p className="text-gray-500">You're just one step away from scheduling a meeting with your salesperson.</p>
            <Button 
              onClick={handleViewCalendar}
              disabled={loading}
              className="w-full bg-[#00FF8C] text-[#14144B] hover:bg-[#00FF8C]/90"
            >
              <Calendar className="mr-2 h-4 w-4" />
              {loading ? 'Loading...' : 'View Salesperson\'s Calendar'}
            </Button>
          </motion.div>
        </Card>
      </div>
    </div>
  )
}

