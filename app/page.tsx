// import AuthButton from "@/components/authButton";
// import { Button } from "@/components/ui/button";
// import Image from "next/image";

// export default function Home() {
//   return (
     
//     <div className="flex flex-col p-10 justify-center items-center">
//       <h1>Home</h1>
//       <Button>Click me</Button>
//       <AuthButton/>
//     </div>
//   );
// }


import { getServerSession } from "next-auth";

import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function ProtectedPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }

  return <h1>This is a protected page</h1>;
}
