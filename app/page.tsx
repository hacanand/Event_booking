 'use client'
// src/app/page.tsx
import React, { useState } from 'react';
import LoginButton from '@/components/LoginButton';
import { useClerk, UserButton } from '@clerk/nextjs';
  

export default function Home() {
const { redirectToSignIn,user } = useClerk();
  const [selectedRole, setSelectedRole] = useState<
    "salesman" | "customer" | null
    >(null);
  const handleRoleSelection = async (role: "salesman" | "customer") => {
    setSelectedRole(role);

    // Pass role as metadata during the sign-in process
    redirectToSignIn({
      redirectUrl: `/?role=${role}`,
    });
  };

  return (
    <main>
      <h1>Calendly OAuth with App Router</h1>
      <LoginButton />
      <br />
       
    {!user? <div>
        <h1>Select Your Role</h1>
        <button onClick={() => handleRoleSelection("salesman")}>
          Login as Salesman
        </button>
        <button onClick={() => handleRoleSelection("customer")}>
          Login as Customer
        </button>

        {selectedRole && (
          <p>
            Redirecting to LinkedIn for <strong>{selectedRole}</strong> login...
          </p>
        )}
      </div>:<UserButton/>}
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
