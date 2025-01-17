import { NextResponse } from "next/server";

export function createRedirectResponse(
  path: string,
  queryParams: Record<string, string | undefined> = {},
  baseUrl: string = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
) {
  const redirectUrl = new URL(path, baseUrl);

  // Append query parameters
  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== undefined) {
      redirectUrl.searchParams.append(key, value);
    }
  });

  // Return NextResponse.redirect
  return NextResponse.redirect(redirectUrl.toString());
}
