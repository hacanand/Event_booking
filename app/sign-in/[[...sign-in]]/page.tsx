"use client";
import { useState, useEffect } from "react";
import { SignIn} from "@clerk/nextjs";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
// import axiosInstance from "@/app/utils/axiosInstance";

export default function LoginPage() {
  const [role, setRole] = useState<string>("");
  const router = useRouter();
  const { isSignedIn, isLoaded, user } = useUser();
  // const { userId } = useAuth();
    useEffect(() => {
      localStorage.setItem('role', role);
      if (isSignedIn && isLoaded) {
        if (user?.unsafeMetadata?.role === 'salesperson') {
          router.push('/salesperson/dashboard');
        } else {
          router.push('/customer-dashboard');
        }
      }
    }, [ user, router]);

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hiipitch-nSS262YxQ47CjsI2Du1QfvET8Ik6l6.png"
          alt="hiipitch logo"
          width={120}
          height={40}
          className="mx-auto"
          unoptimized
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="bg-white shadow-lg">
          <CardContent className="pt-6">
            <Tabs
              // defaultValue="customer"
              className="w-full"
              onValueChange={(value) =>
                setRole(value as "salesperson" | "customer")
              }
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="customer">Customer</TabsTrigger>
                <TabsTrigger value="salesperson">Salesperson</TabsTrigger>
              </TabsList>
              <TabsContent value="customer">
                <SignIn
                  path="/sign-in"
                  routing="path"
                  signInUrl="/sign-in"
                  fallbackRedirectUrl="/customer-dashboard" // Fallback redirect
                  appearance={{
                    elements: {
                      formButtonPrimary:
                        "bg-[#00FF8C] text-[#14144B] hover:bg-[#00FF8C]/90",
                      socialButtonsBlockButton:
                        "bg-white text-[#14144B] border border-gray-300 hover:bg-gray-50",
                      socialButtonsBlockButtonText: "font-semibold",
                      formFieldInput:
                        "bg-white border-gray-300 text-gray-900 focus:ring-[#00FF8C] focus:border-[#00FF8C]",
                      formFieldLabel: "text-gray-700",
                      footerActionLink:
                        "text-[#00FF8C] hover:text-[#00FF8C]/90",
                    },
                  }}
                />
              </TabsContent>
              <TabsContent value="salesperson">
                <SignIn
                  path="/sign-in"
                  routing="path"
                  signInUrl="/sign-in"
                  fallbackRedirectUrl="/onboarding" // Fallback redirect
                  appearance={{
                    elements: {
                      formButtonPrimary:
                        "bg-[#00FF8C] text-[#14144B] hover:bg-[#00FF8C]/90",
                      socialButtonsBlockButton:
                        "bg-white text-[#14144B] border border-gray-300 hover:bg-gray-50",
                      socialButtonsBlockButtonText: "font-semibold",
                      formFieldInput:
                        "bg-white border-gray-300 text-gray-900 focus:ring-[#00FF8C] focus:border-[#00FF8C]",
                      formFieldLabel: "text-gray-700",
                      footerActionLink:
                        "text-[#00FF8C] hover:text-[#00FF8C]/90",
                    },
                  }}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
