import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = await fetch("https://auth.uber.com/oauth/v2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_UBER_CLIENT_ID!,
        client_secret: process.env.UBER_CLIENT_SECRET!,
        grant_type: "client_credentials",
        scope: "organizations.voucher_programs", // Replace with actual scopes
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Uber OAuth error:", data);
      return NextResponse.json({ error: data }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Unexpected error in Uber OAuth:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
