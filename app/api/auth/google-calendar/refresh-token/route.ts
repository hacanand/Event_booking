 import { google } from "googleapis";
 import type { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

export default async function
    POST(
   req: NextRequest,
   res: NextResponse
 ) {
   const refreshToken = req.cookies.get("google-refresh-token")?.value;

   if (!refreshToken) {
     return NextResponse.json({ error: "No refresh token found" }, { status: 401 });
   }

   const client = new google.auth.OAuth2();
   client.setCredentials({ refresh_token: refreshToken });

   try {
     const { credentials } = await client.refreshAccessToken();
     if (credentials.access_token) {
       res.cookies.set("google-access-token", credentials.access_token, {
         httpOnly: true,
         path: "/",
       });
     }
     return NextResponse.json({ accessToken: credentials.access_token }, { status: 200 });
   } catch (error) {
     return NextResponse.json({ error: "Failed to refresh token" }, { status: 500 });
   }
 }
