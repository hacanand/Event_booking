  import { NextRequest, NextResponse } from "next/server";
  import mongoose from "mongoose";
  // Adjust the path to your token schema
  import axios from "axios";
  import Token from "@/models/tokenModel";

  const CALENDLY_TOKEN_ENDPOINT = "https://auth.calendly.com/oauth/token";

  export async function POST(req: NextRequest) {
    try {
      if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGO_URI || "");
      }

      // Retrieve the current refresh token from the database
      const tokenDoc = await Token.findOne();
      if (!tokenDoc || !tokenDoc.calendlyRefreshToken) {
        return NextResponse.json(
          { message: "No refresh token found in the database" },
          { status: 400 }
        );
      }

      const currentRefreshToken = tokenDoc.calendlyRefreshToken;

      // Request a new access token using the refresh token
      const response = await axios.post(
        CALENDLY_TOKEN_ENDPOINT,
        {
          grant_type: "refresh_token",
          refresh_token: currentRefreshToken,
          client_id: process.env.NEXT_PUBLIC_CALENDLY_CLIENT_ID,
          client_secret: process.env.CALENDLY_CLIENT_SECRET,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { access_token, refresh_token, expires_in } = response.data;

      // Calculate the new expiration time
      //  const expiresAt = new Date(Date.now() + expires_in * 1000);

      // Update the token in the database
      //  tokenDoc.calendlyToken.accessToken = access_token;
      tokenDoc.calendlyRefreshToken = refresh_token;

      await tokenDoc.save();

      return NextResponse.json({
        message: "Calendly token updated successfully",
        data: {
          accessToken: access_token,
          refreshToken: refresh_token,
          expiresIn: expires_in,
        },
      });
    } catch (error: any) {
      console.error(
        "Error updating Calendly token:",
        error.response?.data || error.message
      );
      return NextResponse.json(
        {
          message: "Failed to update Calendly token",
          error: error.response?.data || error.message,
        },
        { status: 500 }
      );
    }
  }


// import { refreshAccessToken } from "@/lib/calendly";
// import { cookies } from "next/headers";
// import { NextRequest, NextResponse } from "next/server";
// // import { refreshAccessToken } from "@/lib/calendly";

// export async function POST(req: NextRequest) {
//   const refreshToken = req.cookies.get("calendly-refresh-token")?.value;
//   console.log("refreshToken", refreshToken);
//   if (!refreshToken) {
//     return NextResponse.json({ error: "No refresh token found" });
//   }

//   try {
//     const { access_token, refresh_token, expires_in } =
//      await refreshAccessToken(refreshToken);

//     const response = NextResponse.json({ accessToken: access_token });
//     response.cookies.set("calendly-access-token", access_token, { httpOnly: true, path: "/" });
//     response.cookies.set("calendly-refresh-token", refresh_token, { httpOnly: true, path: "/" });
//     response.cookies.set("calendly-token-expiry", (Date.now() + expires_in * 1000).toString(), { httpOnly: true, path: "/" });

//     return response;
//   } catch (error) {
//     console.error("Error refreshing token:", error);
//     return NextResponse.json({ error: "Failed to refresh token" }, { status: 500 });
//   }
// }
