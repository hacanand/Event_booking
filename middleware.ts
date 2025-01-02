import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const isAuthPage = req.url.includes("/api/auth/signin");

  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/api/auth/signin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/protected/:path*"], // Apply to protected routes
};
