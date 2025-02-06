import { Inter } from "next/font/google";
import "./globals.css";
// import { AnimatePresence } from "framer-motion";
import Navbar from "@/components/navbar";
// import { AuthProvider } from "@/components/auth-context";
import { Toaster } from "@/components/ui/toaster";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });
const localization = {
  socialButtonsBlockButton: "Sign In with {{provider|titleize}}",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider localization={localization}>
      <html lang="en">
        <body className={inter.className}>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Toaster />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
