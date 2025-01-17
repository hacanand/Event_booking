'use client'

import { useEffect, useState } from 'react'
import { SignIn, useAuth, useUser } from "@clerk/nextjs"
import Image from "next/image"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
// import router from 'next/navigation'
import { useRouter } from 'next/navigation'

const fadeIn = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 }
}

export default function LoginPage() {
  const [role, setRole] = useState<string>("");
  const { userId ,isSignedIn} = useAuth();
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    localStorage.setItem('role', role);
    if (isSignedIn && user) {
      if (user.publicMetadata.role === 'salesperson') {
        router.push('/salesperson-dashboard');
      } else {
        router.push('/customer-dashboard');
      }
    }
  }, [userId, user, role, router]);
  
  return (
    <div className="min-h-screen  bg-white text-black flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
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
          Sign in to your account
        </h2>
      </motion.div>

      <motion.div
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-white/15 backdrop-blur-lg border-neutral-500">
          <CardContent className="pt-6 ">
            <div className=" text-center text-black">
              <RadioGroup
                value={role}
                onValueChange={(value: "salesperson" | "customer") =>
                  setRole(value)
                }
                className="flex justify-center space-x-4  "
              >
                <div className="flex items-center space-x-2  ">
                  <RadioGroupItem value="salesperson" id="salesperson" />
                  <Label
                    htmlFor="salesperson"
                    className="text-black text-lg font-semibold "
                  >
                    Salesperson
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="customer" id="customer" />
                  <Label
                    htmlFor="customer"
                    className="text-black text-lg font-semibold"
                  >
                    Customer
                  </Label>
                </div>
              </RadioGroup>
            </div>
            {role && (
              <SignIn
                path="/sign-in"
                routing="path"
                // afterSignInUrl="/dashboard"
                fallbackRedirectUrl="/dashboard"
              
              />
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

