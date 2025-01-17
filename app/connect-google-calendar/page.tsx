'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from "next/image"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from '../contexts/toast-context'

const fadeIn = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 }
}

export default function ConnectGoogleCalendarPage() {
  const [isConnecting, setIsConnecting] = useState(false)
  const router = useRouter()
 const {showToast} = useToast()
  const searchParams = useSearchParams();

  const success = searchParams.get("response");
  const status = searchParams.get("status");
useEffect(() => {
  if (success && status) {
    showToast(success, status as any);
  }
}, [success, status]);
  const handleConnectGoogleCalendar = () => {
    setIsConnecting(true)
    setTimeout(() => {
      setIsConnecting(false)
      router.push('/salesperson-dashboard')
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-white text-black flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="sm:mx-auto sm:w-full sm:max-w-md"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hiipitch-nSS262YxQ47CjsI2Du1QfvET8Ik6l6.png"
          alt="hiipitch logo"
          width={120}
          height={40}
          className="mx-auto"
          unoptimized
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-black">
          Connect Google Calendar
        </h2>
      </motion.div>

      <motion.div 
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-white/10 backdrop-blur-lg">
          <CardContent className="pt-6">
            <motion.p 
              className="text-center mb-6 text-black"
              variants={fadeIn}
              transition={{ delay: 0.3 }}
            >
              Connect your Google Calendar to sync your appointments and availability.
            </motion.p>
            <motion.div variants={fadeIn} transition={{ delay: 0.4 }}>
              <Button
                onClick={handleConnectGoogleCalendar}
                disabled={isConnecting}
                className="w-full bg-[#00FF8C] text-[#14144B] hover:bg-[#00FF8C]/90 transition-colors duration-300"
              >
                {isConnecting ? 'Connecting...' : 'Connect Google Calendar'}
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

