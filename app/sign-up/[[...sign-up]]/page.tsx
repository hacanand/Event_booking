'use client'

import { useState } from 'react'
import { SignUp } from "@clerk/nextjs"
import Image from "next/image"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useRouter } from 'next/navigation'

const fadeIn = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 }
}

export default function SignUpPage() {
  const [role, setRole] = useState<'salesperson' | 'customer'>('customer')
  const router = useRouter()

  const handleComplete = async (createdUser: any) => {
    try {
      // Update the user's metadata with their role
      await createdUser.update({
        publicMetadata: { role: role }
      });

      // Redirect based on the selected role
      if (role === 'salesperson') {
        router.push('/onboarding')
      } else {
        router.push('/customer-dashboard')
      }
    } catch (error) {
      console.error("Error updating user metadata:", error);
      // Handle the error (e.g., show an error message to the user)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#14144B] to-[#0A0A2A] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
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
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Create your account
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
            <div className="mb-6">
              <RadioGroup
                value={role}
                onValueChange={(value: 'salesperson' | 'customer') => setRole(value)}
                className="flex justify-center space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="salesperson" id="salesperson" />
                  <Label htmlFor="salesperson" className="text-white">Salesperson</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="customer" id="customer" />
                  <Label htmlFor="customer" className="text-white">Customer</Label>
                </div>
              </RadioGroup>
            </div>
            <SignUp
              path="/sign-up"
              routing="path"
              signInUrl="/login"
              afterSignUpUrl="/dashboard"
              redirectUrl={role === 'salesperson' ? '/onboarding' : '/customer-dashboard'}
              appearance={{
                elements: {
                  formButtonPrimary: 
                    "bg-[#00FF8C] text-[#14144B] hover:bg-[#00FF8C]/90",
                  socialButtonsBlockButton: 
                    "bg-white text-[#14144B] border border-gray-300 hover:bg-gray-50",
                  socialButtonsBlockButtonText: 
                    "text-[#14144B] font-semibold",
                  formFieldInput: 
                    "bg-white/5 border-gray-300 text-white placeholder-gray-400",
                  formFieldLabel: 
                    "text-white",
                  footerActionLink: 
                    "text-[#00FF8C] hover:text-[#00FF8C]/90",
                }
              }}
            />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

