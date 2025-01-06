"use client";

import Link from "next/link";
import Image from "next/image";
import { UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/app/components/ui/button";

export default function Navbar() {
  const { isSignedIn, user } = useUser();

  return (
    <nav className="sticky top-0 z-10 border-b bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  href="/customer-dashboard"
                  className="text-[#14144B] hover:text-[#00FF8C]"
                >
                  Dashboard
                </Link>
                <Link
                  href="/about"
                  className="text-[#14144B] hover:text-[#00FF8C]"
                >
                  About Us
                </Link>
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <Button
                asChild
                className="bg-[#00FF8C] text-[#14144B] hover:bg-[#00FF8C]/90"
              >
                <Link href="/login">Login</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
