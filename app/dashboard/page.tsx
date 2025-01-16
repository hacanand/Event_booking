"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import axiosInstance from "../utils/axiosInstance";
import {Loader} from 'lucide-react'
export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { userId } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updateUserRoleAndRedirect = async () => {
      if (!isLoaded) return;

      if (!user) {
        router.push("/sign-in");
        return;
      }

      try {
        // Fetch role from localStorage or a default role (if needed)
        let role = localStorage.getItem("role");
        if (!role) {
          // If no role is found in localStorage, fetch the role via API
          await axiosInstance.post("/api/clerk/role-assign", {
            userId,
          });
        }
        // Redirect based on role
        if (role === "salesperson") {
          router.push("/salesperson-dashboard");
        } else {
          router.push("/customer-dashboard");
        }
      } catch (error) {
        console.error("Error updating role:", error);
        router.push("/error"); // Redirect to an error page
      } finally {
        setLoading(false);
      }
    };

    updateUserRoleAndRedirect();
  }, [user, isLoaded, userId, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        < Loader size={48} />
      </div>
  );
  }

  return null; // Component doesn't render any visible UI
}
