import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoicmVmcmVzaF90b2tlbiIsImNsaWVudElkIjoiY202aTQ4b21kMDAxa3A4MWw1ZmNla3NneCIsIm93bmVySWQiOjEzNDg3MzMsImlhdCI6MTczODE3MDU3N30.nNjADPA_BJBiFHsXIW-lGMssExMJlzCv4Q-doFy2jKc";

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  const response = await fetch(
    `https://api.cal.com/v2/oauth/cm6i48omd001kp81l5fceksgx/refresh`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-cal-secret-key": process.env.CALCOM_SECRET_KEY!,
      },
      body: JSON.stringify({ refreshToken: token }),
    }
  );

  const data = await response.json();

  // if (!response.ok) {
  //   return NextResponse.json(
  //     { error: "Failed to refresh token" },
  //     { status: 500 }
  //   );
  // }

  return NextResponse.json({ accessToken: data  });
}
