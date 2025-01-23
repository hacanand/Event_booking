"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import axiosInstance from "@/app/utils/axiosInstance";

export default function SalespersonOnboardingPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded, user } = useUser();

  const updateUserData = useCallback(async () => {
    const role = localStorage.getItem("role");

    if (!user) {
      console.error("User is not defined");
      return;
    }

    try {
      // Update Clerk user metadata
      await user.update({
        unsafeMetadata: {
          role: role,
        },
      });

      // Send data to your backend
      await axiosInstance.post("/api/users", {
        clerkId: user.id,
        userType: role,
        email: user.emailAddresses[0]?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.imageUrl,
      });

      console.log("User data updated successfully");
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  }, [user]);

  useEffect(() => {
    const handleRouting = async () => {
      if (isSignedIn && isLoaded && user) {
        await updateUserData();

        const updatedRole =
          user.unsafeMetadata.role || localStorage.getItem("role");
        if (updatedRole === "salesperson") {
          router.push("/salesperson/onboarding/connect-calendly");
        } else if (updatedRole === "customer") {
          router.push("/customer-dashboard");
        } else {
          console.error("Invalid role:", updatedRole);
        }
      }
    };

    handleRouting();
  }, [isLoaded, isSignedIn, user, router, updateUserData]);

  return null;
}
