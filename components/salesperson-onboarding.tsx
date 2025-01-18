'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Calendar, LinkIcon } from 'lucide-react'
import { Steps } from './steps'
import { motion, AnimatePresence } from 'framer-motion'
import { CalendlyConnectionSuccess } from '../../components/calendly-connection-success'
import { CelebrationModal } from '../../components/celebration-modal'
import { useAuth } from '@/app/contexts/auth-context'

export function SalespersonOnboarding() {
  const router = useRouter()
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [calendlyConnected, setCalendlyConnected] = useState(false)
  const [googleCalendarConnected, setGoogleCalendarConnected] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [sharedLink, setSharedLink] = useState('')

  const steps = [
    { id: 1, title: 'Connect Calendly' },
    { id: 2, title: 'Check Connection' },
    { id: 3, title: 'Connect Google Calendar' },
    { id: 4, title: 'Share Link' },
  ]

  useEffect(() => {
    if (user) {
      // Generate a unique shared link for the salesperson
      setSharedLink(`${window.location.origin}/book/${user?.id || ''}`) // Updated line
    }
  }, [user])

  const handleNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    } else {
      router.push('/dashboard')
    }
  }

  const handleShareLink = () => {
    // Copy the link to clipboard
    navigator.clipboard.writeText(sharedLink)
    setShowCelebration(true)
  }

  useEffect(() => {
    if (showCelebration) {
      const timer = setTimeout(() => {
        setShowCelebration(false)
      }, 2500) // Close after 2.5 seconds

      return () => clearTimeout(timer)
    }
  }, [showCelebration])

  const handleCalendlyConnection = () => {
    setTimeout(() => {
      setCalendlyConnected(true)
    }, 1500)
  }

  const handleGoogleCalendarConnection = () => {
    setTimeout(() => {
      setGoogleCalendarConnected(true)
      handleNextStep()
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <Card className="p-8">
          <div className="mb-12">
            <Steps steps={steps} currentStep={currentStep} />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {currentStep === 1 && !calendlyConnected && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-[#14144B]">Connect Your Calendly</h2>
                  <p className="text-gray-500">Connect your Calendly account to manage your appointments</p>
                  <Button 
                    onClick={handleCalendlyConnection}
                    className="w-full bg-[#00a3fa] hover:bg-[#00a3fa]/90 text-white"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Connect with Calendly
                  </Button>
                </div>
              )}

              {currentStep === 1 && calendlyConnected && (
                <CalendlyConnectionSuccess onContinue={handleNextStep} />
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-[#14144B]">Check Calendly-Google Connection</h2>
                  <p className="text-gray-500">Let's check if your Calendly is connected to Google Calendar</p>
                  <Button 
                    onClick={handleNextStep}
                    className="w-full bg-[#00FF8C] text-[#14144B] hover:bg-[#00FF8C]/90"
                  >
                    Check Connection
                  </Button>
                </div>
              )}

              {currentStep === 3 && !googleCalendarConnected && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-[#14144B]">Connect Google Calendar</h2>
                  <p className="text-gray-500">Connect your Google Calendar to sync with Calendly</p>
                  <Button 
                    onClick={handleGoogleCalendarConnection}
                    className="w-full bg-[#4285F4] hover:bg-[#4285F4]/90 text-white"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Connect Google Calendar
                  </Button>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-[#14144B]">Your Booking Link</h2>
                  <p className="text-gray-500">Your unique booking link has been generated. Click the button below to copy it.</p>
                  <div className="p-4 bg-gray-100 rounded-md">
                    <p className="text-sm font-mono break-all">{sharedLink}</p>
                  </div>
                  <Button 
                    onClick={handleShareLink}
                    className="w-full bg-[#00FF8C] text-[#14144B] hover:bg-[#00FF8C]/90"
                  >
                    <LinkIcon className="mr-2 h-4 w-4" />
                    Copy Booking Link
                  </Button>
                  <Button 
                    onClick={handleNextStep}
                    className="w-full bg-[#14144B] text-white hover:bg-[#14144B]/90"
                  >
                    Complete Onboarding
                  </Button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <CelebrationModal isOpen={showCelebration} onClose={() => setShowCelebration(false)} />
        </Card>
      </div>
    </div>
  )
}

