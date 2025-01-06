"use client";
// src/app/page.tsx
import React, { useState } from "react";
import LoginButton from "@/components/LoginButton";
import { useClerk, UserButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import axios from "axios";

export default function Home() {
  const { user } = useUser();
  const { redirectToSignIn } = useClerk();
  const [selectedRole, setSelectedRole] = useState<
    "salesman" | "customer" | null
  >(null);
  const handleRoleSelection = async (role: "salesman" | "customer") => {
    setSelectedRole(role);
     await axios.post("/api/clerk/role-assign", {
      userId: user?.id,
      role,
    });
    redirectToSignIn({
      redirectUrl: `/?role=${role}`,
    });
  };
  
  return (
    <main>
      <h1>Calendly OAuth with App Router</h1>
      <LoginButton />
      <br />

      {!user ? (
        <div>
          <h1>Select Your Role</h1>
          <button onClick={() => 
            handleRoleSelection("salesman") 
          }>
            Login as Salesman
          </button>
          <button onClick={() => 
            handleRoleSelection("customer") 
            
          }>
            Login as Customer
          </button>

          {selectedRole && (
            <p>
              Redirecting to LinkedIn for <strong>{selectedRole}</strong>{" "}
              login...
            </p>
          )}
        </div>
      ) : (
        <>
          <UserButton />
          <div>
            {/* console.log(user); */}
            <h1>User Profile</h1>
            <p>
              <strong>ID:</strong> {user.id}
            </p>
            <p>
              <strong>Email:</strong> {user.primaryEmailAddress?.emailAddress}
            </p>
            <p>
              <strong>First Name:</strong> {user.firstName}
            </p>
            <p>
              <strong>Last Name:</strong> {user.lastName}
            </p>
            <p>
              <strong>Phone:</strong>{" "}
              {user.primaryPhoneNumber?.phoneNumber || "Not Provided"}
            </p>

            <h2>Public Metadata</h2>
            <h2></h2>
            <pre>{JSON.stringify(user.publicMetadata)}</pre>
            <h2>External Accounts</h2>
            {/* <pre>{JSON.stringify(user.externalAccounts, null, 2)}</pre> */}
          </div>
        </>
      )}
    </main>
  );
}

// import { getServerSession } from "next-auth";

// import { redirect } from "next/navigation";
// import { authOptions } from "./api/auth/[...nextauth]/route";

// export default async function ProtectedPage() {
//   const session = await getServerSession(authOptions);

//   if (!session) {
//     redirect("/api/auth/signin");
//   }

//   return <h1>This is a protected page</h1>;
// }
