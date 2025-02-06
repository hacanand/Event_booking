"use client";

import { useState, useEffect } from "react";
import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function LoginPage() {
  const [role, setRole] = useState<string>("customer"); // Default to "customer"
  const router = useRouter();
  const { isSignedIn, isLoaded, user } = useUser();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("role", role);
    }
  }, [role]);

  useEffect(() => {
    if (isSignedIn && isLoaded) {
      const storedRole = user.unsafeMetadata.role;
      if (storedRole === "salesperson") {
        router.push("/salesperson/onboarding");
      } else {
        const redirectUrl = userId
          ? `/customer-dashboard?userId=${userId}`
          : "/customer-dashboard";
        router.push(redirectUrl);
      }
    }
  }, [isSignedIn, isLoaded, user, router, userId]);

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
              defaultValue="customer"
              className="w-full"
              onValueChange={(value) =>
                setRole(value as "salesperson" | "customer")
              }
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger key="customer" value="customer">
                  Customer
                </TabsTrigger>
                <TabsTrigger key="salesperson" value="salesperson">
                  Salesperson
                </TabsTrigger>
              </TabsList>
              <TabsContent value="customer">
                <SignIn
                  key={1}
                  path="/sign-in"
                  routing="path"
                  fallbackRedirectUrl={
                    userId
                      ? `/customer-dashboard?userId=${userId}`
                      : "/customer-dashboard"
                  }
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
                  key={2}
                  path="/sign-in"
                  routing="path"
                  fallbackRedirectUrl="/salesperson/onboarding"
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
