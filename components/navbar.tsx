"use client";

// import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Loader, LogOut } from "lucide-react";
import { useClerk, useUser } from "@clerk/nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router=useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      localStorage.clear();
      await signOut();
     router.push('/sign-in');
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <nav className="sticky top-0 z-10 border-b bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hiipitch-nSS262YxQ47CjsI2Du1QfvET8Ik6l6.png"
            alt="hiipitch logo"
            width={120}
            height={40}
            priority
            className="object-contain"
            unoptimized // Added because we're using an external URL
          />

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <span className="text-[#14144B]">
                {user?.emailAddresses[0].emailAddress}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                disabled={isSigningOut} // Disable the button when signing out
                className={`text-[#14144B] hover:text-[#00FF8C] ${
                  isSigningOut ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSigningOut ? (
                  <span className=" ">
                    <Loader className="text-[#00FF8C]" />
                  </span>  
                ) : (
                  <LogOut className="h-5 w-5 text-red-500 hover:text-red-600" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
