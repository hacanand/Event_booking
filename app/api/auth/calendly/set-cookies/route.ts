import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // console.log("Request Body:", body);

    const { access_token, refresh_token } = body;
    // console.log("Access Token:", access_token);
    // console.log("Refresh Token:", refresh_token);

    if (!access_token || !refresh_token) {
      return NextResponse.json(
        { success: false, message: "Tokens are missing" },
        { status: 400 }
      );
    }

    (await cookies()).set("calendly-access-token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    (await cookies()).set("calendly-refresh-token", refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 365 * 10,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
