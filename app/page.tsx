 
// src/app/page.tsx
import React from 'react';
import LoginButton from '@/components/LoginButton';

export default function Home() {
  return (
    <main>
      <h1>Calendly OAuth with App Router</h1>
      <LoginButton />
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
