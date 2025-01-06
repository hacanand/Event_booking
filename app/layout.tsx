import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        {/* <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        > */}
          {/* <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn> */}
          {/* {children} */}
          <body className={inter.className}>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">{children}</main>
            </div>
          </body>
      </html>
    </ClerkProvider>
  );

}

