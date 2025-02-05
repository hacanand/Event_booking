import { NextResponse } from "next/server";

export function createRedirectResponse(
  path: string,
  queryParams: Record<string, string | undefined> = {},
  baseUrl: string = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
) {
  const redirectUrl = new URL(path, baseUrl);

  // Append query parameters
  const uniqueParams = new Map<string, string>();
  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== undefined) {
      uniqueParams.set(key, value);
    }
  });
  uniqueParams.forEach((value, key) => {
    redirectUrl.searchParams.append(key, value);
  });

  // Return NextResponse.redirect
  return NextResponse.redirect(redirectUrl.toString());
}
