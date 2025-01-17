"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import axiosInstance from "../utils/axiosInstance";
import { Loader } from "lucide-react";
import { isAllConnected } from "../actions/google-calendar/tokenData";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { userId } = useAuth();
  // const [loading, setLoading] = useState(true);

useEffect(() => {
  const updateUserRoleAndRedirect = async () => {
    if (!isLoaded || !user || !userId) return; // Ensure user data is fully loaded

    try {
      const localRole = localStorage.getItem("role");
      let isCalConnected = localStorage.getItem("isCalConnected");

      // Check and update calendar connectivity for salesperson
      if (
        localRole === "salesperson" &&
        (isCalConnected === null || isCalConnected === "false")
      ) {
        const calendarStatus = await isAllConnected({ clerkId: userId });
        isCalConnected = calendarStatus ? "true" : "false";
        localStorage.setItem("isCalConnected", isCalConnected);
      }

      const isCalConnectedBool = isCalConnected === "true";

      if (localRole) {
        // Update role if it exists in user metadata and is different from local storage
        if (
          user.publicMetadata.role &&
          user.publicMetadata.role !== localRole
        ) {
          const response = await axiosInstance.post("/api/clerk/role-assign", {
            userId,
            role: user.publicMetadata.role,
          });
          localStorage.setItem("role", response.data.role);
        }

        const userRole = user.publicMetadata.role;

        // Redirect based on role and calendar connectivity
        if (userRole === "salesperson") {
          if (isCalConnectedBool) {
            router.push("/salesperson-dashboard");
          } else {
            router.push("/connect-calendly");
          }
        } else if (userRole === "customer") {
          router.push("/customer-dashboard");
        }
      }
    } catch (error) {
      console.error("Error during redirection:", error);
      router.push("/error"); // Fallback to error page on failure
    } 
  };

  updateUserRoleAndRedirect();
}, [isLoaded, user, userId, router]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader size={48} className="animate-spin" />
      </div>
    );
  }

  return null; // The component does not render any visible UI after routing
}
