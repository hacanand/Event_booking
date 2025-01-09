import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  try {
    // Parse the JSON body
    const body = await req.json();
    const { refreshToken } = body;
 
    // Validate the input
    if (!refreshToken) {
      return NextResponse.json(
        { error: "No refresh token provided" },
        { status: 400 }
      );
    }

    // Create an OAuth2 client
    const client = new google.auth.OAuth2(
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID, // Make sure these env variables are set
      process.env.GOOGLE_CLIENT_SECRET
    );

    // Set the refresh token
    client.setCredentials({ refresh_token: refreshToken });

    // Refresh the access token
    const tokenResponse = await client.getAccessToken();
    const { token } = tokenResponse;

    if (!token) {
      return NextResponse.json(
        { error: "Failed to fetch access token" },
        { status: 500 }
      );
    }

    // Set the access token as a cookie
    const res = NextResponse.json({ accessToken: token }, { status: 200 });
    res.cookies.set("google-access-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 3600*24*7, // 1 hour
    });
    return res;
  } catch (error : any) {
    console.error("Error refreshing token:", error);
    return NextResponse.json(
      {
        error: "Failed to refresh token",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
