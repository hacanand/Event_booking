// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import {  useAuth, useUser } from "@clerk/nextjs";
// import axiosInstance from "../utils/axiosInstance";
// import { Loader } from "lucide-react";
// import { isAllConnected } from "../actions/google-calendar/tokenData";
// import { useToast } from "@/app/contexts/toast-context";
 

// export default function DashboardPage() {
//   const router = useRouter();
//   const { user, isLoaded } = useUser();
//   const {showToast} = useToast();
//   const { userId } = useAuth();
//   // const [loading, setLoading] = useState(true);

// useEffect(() => {
//   const updateUserRoleAndRedirect = async () => {
//     if (!isLoaded || !user || !userId) return; // Ensure user data is fully loaded

//     try {
//       const localRole = localStorage.getItem("role");
     
//       if (user?.publicMetadata?.role && localRole !== user?.publicMetadata?.role) {
//         showToast("Please Logout and Login with Valid role", "error");
//         return <div>Please Logout and Login with Valid role </div>;
//       }
//       else {
//          await axiosInstance.post("/api/clerk/role-assign", {
//            userId: userId,
//            role: localRole,
//          });
//       }
//       if (user?.publicMetadata?.role === 'salesperson') {
//         const isConnected = await isAllConnected({ clerkId: user.id });
//         if (isConnected) {
//           router.push("/salesperson-dashboard");
//         }
//         else {
//           router.push("/connect-calendly");
//         }
//       }
//       else {
//         router.push("/customer-dashboard");
//       }

//     } catch (error) {
//       console.error("Error during redirection:", error);
//       router.push("/error"); // Fallback to error page on failure
//     } 
//   };

//   updateUserRoleAndRedirect();
// }, [userId, router]);

//   if (!isLoaded) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <Loader size={48} className="animate-spin" />
//       </div>
//     );
//   }

//   return null; // The component does not render any visible UI after routing
// }
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import axiosInstance from "../utils/axiosInstance";
import { Loader } from "lucide-react";
import { isAllConnected } from "../actions/google-calendar/tokenData";
import { useToast } from "@/app/contexts/toast-context";

interface PublicMetadata {
  role?: string;
}

interface User {
  id: string;
  publicMetadata: PublicMetadata;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { showToast } = useToast();
  const { userId, signOut } = useAuth();

  useEffect(() => {
    const updateUserRoleAndRedirect = async () => {
      if (!isLoaded || !user || !userId) return;

      try {
        let cachedRole= localStorage.getItem("role");

        // Cache the user's role if not already cached
        if (!cachedRole && user.publicMetadata.role) {
          
          localStorage.setItem("role", user.publicMetadata.role as string)
        }

        // Handle role mismatch
        if (
          user.publicMetadata.role &&
          cachedRole !== user.publicMetadata.role
        ) {
          showToast("Please Logout and Login with Valid role", "error");

          // Clear localStorage and sign out the user
          localStorage.clear();
          await signOut();
          return;
        }

        // Assign role if not cached
        if (!cachedRole && user.publicMetadata.role) {
          await axiosInstance.post("/api/clerk/role-assign", {
            userId: userId,
            role: user.publicMetadata.role,
          });
          localStorage.setItem("role", user.publicMetadata.role as string); // Cache the role
        }

        // Redirect based on role and connection status
        if (cachedRole === "salesperson") {
          let isConnected = localStorage.getItem("isConnected");

          if (isConnected === null) {
            // Fetch connection status if not cached
            const connectionStatus: boolean = await isAllConnected({
              clerkId: user.id,
            });
            isConnected = JSON.stringify(connectionStatus);
            localStorage.setItem("isConnected", isConnected);
          }

          if (JSON.parse(isConnected)) {
            router.push("/salesperson-dashboard");
          } else {
            router.push("/connect-calendly");
          }
        } else {
          router.push("/customer-dashboard");
        }
      } catch (error) {
        console.error("Error during redirection:", error);
        router.push("/error"); // Fallback to error page on failure
      }
    };

    updateUserRoleAndRedirect();
  }, [isLoaded, user, userId, router, showToast]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader size={48} className="animate-spin" />
      </div>
    );
  }

  return null;
}
