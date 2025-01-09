import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { access_token, refresh_token } = body;
    if (!access_token || !refresh_token) {
      return NextResponse.json(
        { success: false, message: "Tokens are missing" },
        { status: 400 }
      );
    }
    const res = NextResponse.json({
      success: true,
      message: "Tokens are set",
      status: 200,
    });
    res.cookies.set("google-access-token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    res.cookies.set("google-refresh-token", refresh_token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 365 * 10,
    });

    return res;
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
