// src/app/api/auth/calendly/callback.ts
import { NextResponse } from "next/server";
import axios from "axios";
// import { env } from "@/utils/env";

export async function POST(request: Request) {
  // const { searchParams } = new URL(request.url);
  // const code = searchParams.get("code");
  const { code } = await request.json();
  if (!code) {
    return NextResponse.json(
      { error: "Authorization code is missing" },
      { status: 400 }
    );
  }

  try {
    const response = await axios.post(
      "https://auth.calendly.com/oauth/token",
      {
        grant_type: "authorization_code",
        client_id: process.env.NEXT_PUBLIC_CALENDLY_CLIENT_ID,
        client_secret: process.env.CALENDLY_CLIENT_SECRET,
        redirect_uri: process.env.NEXT_PUBLIC_CALENDLY_REDIRECT_URI,
        code,
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const accessToken = response.data.access_token;
    return NextResponse.json({ accessToken: accessToken });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data || "Internal server error" },
      { status: 500 }
    );
  }
}
