"use client";

import { useState } from "react";
import { SignIn } from "@clerk/nextjs";
import { useSearchParams, useRouter } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Label } from "../../components/ui/label";
import { motion } from "framer-motion";

export default function LoginForm() {
  const [role, setRole] = useState<"salesperson" | "customer">("customer");
  const searchParams = useSearchParams();
  const router = useRouter();
  const sharedLink = searchParams.get("link");

  const handleOAuthCallback = (redirectUrl: string) => {
    const url = new URL(redirectUrl);
    url.searchParams.append("role", role);
    if (sharedLink) {
      url.searchParams.append("link", sharedLink);
    }
    return url.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="mt-6 text-3xl font-extrabold text-[#14144B]">
          Welcome to hiipitch
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Sign in with LinkedIn to get started
        </p>
      </div>
      <RadioGroup
        value={role}
        onValueChange={(value: "salesperson" | "customer") => setRole(value)}
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
      <div>
        <SignIn
          appearance={{
            layout: {
            
            }
          }}
          path="/"
          routing="path"
          redirectUrl={handleOAuthCallback("/")}
          signUpUrl="/sign-up"
        />
      </div>
    </motion.div>
  );
}
