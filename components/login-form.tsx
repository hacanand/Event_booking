'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { useAuth } from '../contexts/auth-context'
import { LinkedinIcon } from 'lucide-react'
import { motion } from 'framer-motion'

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()
  const [role, setRole] = useState<'salesperson' | 'customer'>('customer')

  const sharedLink = searchParams.get('link')

  const handleLinkedInLogin = () => {
    login('user@example.com', role)
    if (role === 'salesperson') {
      router.push('/onboarding')
    } else {
      if (sharedLink) {
        router.push(`/book/${sharedLink}`)
      } else {
        router.push('/customer-dashboard')
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="mt-6 text-3xl font-extrabold text-[#14144B]">
          Welcome to hiiTech
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Sign in with LinkedIn to get started
        </p>
      </div>
      <RadioGroup
        value={role}
        onValueChange={(value: 'salesperson' | 'customer') => setRole(value)}
        className="flex justify-center space-x-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="salesperson" id="salesperson" />
          <Label htmlFor="salesperson">Salesperson</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="customer" id="customer" />
          <Label htmlFor="customer">Customer</Label>
        </div>
      </RadioGroup>
      <Button
        onClick={handleLinkedInLogin}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0A66C2] hover:bg-[#0A66C2]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0A66C2]"
      >
        <LinkedinIcon className="w-5 h-5 mr-2" />
        Sign in with LinkedIn
      </Button>
    </motion.div>
  )
}

