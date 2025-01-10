// import axios from "axios";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { google } from "googleapis";
const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];

export function getGoogleAuthClient() {
  return new google.auth.OAuth2(
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!
  );
}

export function getGoogleAuthUrl() {
  const oauth2Client = getGoogleAuthClient();
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
  });
}

// import { google } from "googleapis";

export async function getUpdatedAuthClient() {
  try {
    const user = await currentUser();
    console.log("Current User:", user);

    if (!user) {
      throw new Error("No user logged in");
    }

    const tokenDoc = user?.publicMetadata.tokens as {
      accessToken: string;
      refreshToken: string;
      expiryDate: number;
    };
    console.log("Token Doc:", tokenDoc);

    if (
      !tokenDoc ||
      !tokenDoc.accessToken ||
      !tokenDoc.refreshToken ||
      !tokenDoc.expiryDate
    ) {
      throw new Error("Invalid or missing tokens in user metadata");
    }

    const { accessToken, refreshToken, expiryDate } = tokenDoc;

    const oAuth2Client = new google.auth.OAuth2(
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI
    );

    oAuth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
      expiry_date: expiryDate,
    });

    // Refresh token if expired
    if (Date.now() >= expiryDate) {
      console.log("Token expired, refreshing...");
      const tokens = await oAuth2Client.refreshAccessToken();
      console.log("Refreshed Tokens:", tokens);

      const newAccessToken = tokens.credentials.access_token!;
      const newExpiryDate = tokens.credentials.expiry_date!;

      // Update tokens in Clerk metadata
      await (await clerkClient()).users.updateUserMetadata(user.id, {
        publicMetadata: {
          tokens: {
            accessToken: newAccessToken,
            refreshToken: refreshToken, // Keep the same refresh token
            expiryDate: newExpiryDate,
          },
        },
      });

      oAuth2Client.setCredentials({
        access_token: newAccessToken,
        refresh_token: refreshToken,
        expiry_date: newExpiryDate,
      });
    }

    return oAuth2Client;
  } catch (error:any) {
    console.error("Error in getUpdatedAuthClient:", error.message);
    throw error;
  }
}
