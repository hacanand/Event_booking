"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { LinkIcon } from "lucide-react"
import { motion } from "framer-motion"
// import { useAuth } from "@/components/auth-context"
import { Steps } from "@/components/steps"
import { CelebrationModal } from "@/components/celebration-modal"
import { useUser } from "@clerk/nextjs"
 

export default function ShareLinkPage() {
  const router = useRouter()
  const { user } = useUser()
  const [showCelebration, setShowCelebration] = useState(false)
  const [sharedLink, setSharedLink] = useState("")

  const steps = [
    { id: 1, title: "Connect Calendly" },
    { id: 2, title: "Check Connection" },
    { id: 3, title: "Connect Google Calendar" },
    { id: 4, title: "Share Link" },
  ]

  useEffect(() => {
    if (user && user.id) {
      setSharedLink(`${window.location.origin}/book/${user.id}`)
    }
  }, [user])

  const handleShareLink = () => {
    navigator.clipboard.writeText(sharedLink)
    setShowCelebration(true)
  }

  const handleNextStep = () => {
    router.push("/salesperson/dashboard")
  }

  useEffect(() => {
    if (showCelebration) {
      const timer = setTimeout(() => {
        setShowCelebration(false)
      }, 2500)

      return () => clearTimeout(timer)
    }
  }, [showCelebration])

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <Card className="p-8">
          <div className="mb-12">
            <Steps steps={steps} currentStep={4} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-[#14144B]">Your Booking Link</h2>
              <p className="text-gray-500">
                Your unique booking link has been generated. Click the button below to copy it.
              </p>
              <div className="p-4 bg-gray-100 rounded-md">
                <p className="text-sm font-mono break-all">{sharedLink}</p>
              </div>
              <Button onClick={handleShareLink} className="w-full bg-[#00FF8C] text-[#14144B] hover:bg-[#00FF8C]/90">
                <LinkIcon className="mr-2 h-4 w-4" />
                Copy Booking Link
              </Button>
              <Button onClick={handleNextStep} className="w-full bg-[#14144B] text-white hover:bg-[#14144B]/90">
                Complete Onboarding
              </Button>
            </div>
          </motion.div>

          <CelebrationModal isOpen={showCelebration} onClose={() => setShowCelebration(false)} />
        </Card>
      </div>
    </div>
  )
}

