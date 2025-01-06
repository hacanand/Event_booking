"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { SalespersonOnboarding } from "./components/salesperson-onboarding";
import { CustomerOnboarding } from "./components/customer-onboarding";
import { PageTransition } from "../components/page-transition";

export default function OnboardingPage() {
  const router = useRouter();
  const { userId } = useAuth();
  const [userRole, setUserRole] = useState<"salesperson" | "customer" | null>(
    null
  );

  useEffect(() => {
    if (userId) {
      //   setUserRole(userId.role);
    } else {
      router.push("/login");
    }
  }, [userId, router]);

  if (!userRole) {
    return null; // or a loading spinner
  }

  return (
    <PageTransition>
      {userRole === "salesperson" ? (
        <SalespersonOnboarding />
      ) : (
        <CustomerOnboarding />
      )}
    </PageTransition>
  );
}
