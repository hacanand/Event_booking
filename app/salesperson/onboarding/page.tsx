"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import axiosInstance from "@/app/utils/axiosInstance";

export default function SalespersonOnboardingPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded,user } = useUser();

  const updateUserData = useCallback(async () => {
    if (!isLoaded || !isSignedIn || !user) return;

    // const role = localStorage.getItem("role");
    // if (!role) {
    //   router.push("/sign-in");
    //   return;
    // }

    try {
      await user.update({
        unsafeMetadata: {
          role:'salesperson',
        },
      });
      await axiosInstance.post("/api/users", {
        clerkId: user.id,
        userType: 'salesperson',
        email: user.emailAddresses[0]?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.imageUrl,
      });
      console.log("User data updated successfully");
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  }, [isLoaded, isSignedIn, user, router]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      router.push("/sign-in");
      return;
    }

    if (user?.unsafeMetadata.role !== "salesperson") {
      router.push("/sign-in");
      return;
    }

    updateUserData();
    router.push("/salesperson/onboarding/connect-calendly");
  }, [isLoaded, isSignedIn, user, router]);

  return null;
}
