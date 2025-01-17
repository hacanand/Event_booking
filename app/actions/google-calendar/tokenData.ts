"use server";
import Token from "@/models/tokenModel";
import { Credentials } from "google-auth-library";
import { isCalendlyLoggedIn } from "../calendly/tokenAndDataUpdate";
import dbConnect from "@/app/utils/dbConnect";
export async function createToken(clerkId: string, calendlyRefreshToken:string) {
  if (!clerkId || !calendlyRefreshToken) {
    throw new Error("clerkId and calendlyToken are required.");
  }

  try {
    // Create a new token document
    await dbConnect()
    const newToken = await Token.create({
      clerkId,
      calendlyRefreshToken,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    // Optionally redirect or return the created token
    return { message: "Token document created successfully", token: newToken };
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred while creating the token document.");
  }
}

// Server Action to update the Google Calendar token using clerkId
export async function updateGoogleCalendarToken(clerkId: string, googleToken: Credentials) {
  if (!clerkId || !googleToken) {
    throw new Error("clerkId and google Calendar RefreshToken are required.");
  }

  try {
     await dbConnect();
    // Find the token document by clerkId and update the Google Calendar token
    const updatedToken = await Token.findOneAndUpdate(
      { clerkId },
      { googleToken, updatedAt: new Date() }, // Update Google Calendar token and set updatedAt to current time
      { new: true, runValidators: true } // Return the updated document
    );

    if (!updatedToken) {
      throw new Error("Token document not found.");
    }

    // Optionally redirect or return the updated token
    return {
      message: "Google Calendar token updated successfully",
      token: updatedToken,
    };
  } catch (error) {
    console.error(error);
    throw new Error(
      "An error occurred while updating the Google Calendar token."
    );
  }
}

export async function getGoogleToken({
  clerkId,
}: {
  clerkId: string;
}) {
  if (!clerkId) {
    throw new Error("clerkId is required.");
  }

  try {
     await dbConnect();
    // Find the token document by clerkId
    const tokenDocument = await Token.findOne({ clerkId });

    if (!tokenDocument) {
      throw new Error("Token document not found.");
    }

    // Return the Google Calendar token
    return {
      googleToken: tokenDocument.googleToken,
    };
  } catch (error) {
    console.error(error);
    throw new Error(
      "An error occurred while fetching the Google Calendar token."
    );
  }
}

// Server Action to get the Calendly token using clerkId


//if calendly is logged in or not


export async function isGoggleCalLoggedIn({ clerkId }: { clerkId: string }) {
  if (!clerkId) {
    throw new Error("clerkId is required.");
  }

  try {
     await dbConnect();
    // Find the token document by clerkId
    const tokenDocument = await Token.findOne({ clerkId });

    if (!tokenDocument?.googleToken) {
      throw new Error("Token document not found.");
    }
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

 
export async function isAllConnected({ clerkId }: { clerkId: string }) {
  if (!clerkId) {
    throw new Error("clerkId is required.");
  }
  try {
    const googleCalLoggedIn = await isGoggleCalLoggedIn({ clerkId });
    const calendlyLoggedIn = await isCalendlyLoggedIn({ clerkId });
    return googleCalLoggedIn && calendlyLoggedIn;
  } catch (error) {
    console.error(error);
    return false;
  }
  }
