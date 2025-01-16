"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useUser, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, isSignedIn } = useUser();
  const router = useRouter();

  return (
    <nav className="sticky top-0 z-10 bg-indigo-800 backdrop-blur-xl shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="relative flex items-center">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hiipitch-nSS262YxQ47CjsI2Du1QfvET8Ik6l6.png"
              alt="hiipitch logo"
              width={120}
              height={40}
              priority
              className="object-contain"
              unoptimized
            />
          </Link>

          <div className="flex items-center gap-6">
            {isSignedIn ? (
              <>
                <Link
                  href={
                    user.publicMetadata.role === "salesperson"
                      ? "/salesperson-dashboard"
                      : "/customer-dashboard"
                  }
                  className="text-white hover:text-green-500 font-medium"
                >
                  Dashboard
                </Link>
                {user.publicMetadata.role === "customer" && (
                  <Link
                    href="/customer/book-slot"
                    className="text-gray-800 hover:text-green-500 font-medium"
                  >
                    Book Meeting
                  </Link>
                )}
                <UserButton />
              </>
            ) : (
              <>
                <div className="flex items-center gap-4 text-xl font-bold bg-gradient-to-r from-[#FF00A6] to-[#FF7D00] px-4 py-2  text-transparent bg-clip-text">
                  Hi there! Please sign in to continue...
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
