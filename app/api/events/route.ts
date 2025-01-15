 import { NextRequest, NextResponse } from "next/server";
 import mongoose from "mongoose";
 // Adjust the path to your token schema
 import axios from "axios";
import Token from "@/models/tokenModel";

 const CALENDLY_TOKEN_ENDPOINT = "https://auth.calendly.com/oauth/token";

 export async function POST(req:NextRequest) {
   try {
     // Connect to the database
     //get cookies from the request
     const cookies = req.cookies;
      console.log(cookies);
    //  console.log(res);
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
