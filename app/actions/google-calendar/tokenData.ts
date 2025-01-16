"use server";

import Token from "@/models/tokenModel";

export async function createToken(clerkId: string, calendlyRefreshToken:string) {
  if (!clerkId || !calendlyRefreshToken) {
    throw new Error("clerkId and calendlyToken are required.");
  }

  try {
    // Create a new token document
    const newToken = new Token({
      clerkId,
      calendlyRefreshToken,
    });
    // Save the document to the database
    await newToken.save();

    // Optionally redirect or return the created token
    return { message: "Token document created successfully", token: newToken };
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred while creating the token document.");
  }
}

// Server Action to update the Google Calendar token using clerkId
export async function updateGoogleCalendarToken(clerkId: string, googleCalendarRefreshToken: string) {
  if (!clerkId || !googleCalendarRefreshToken) {
    throw new Error("clerkId and google Calendar RefreshToken are required.");
  }

  try {
    // Find the token document by clerkId and update the Google Calendar token
    const updatedToken = await Token.findOneAndUpdate(
      { clerkId },
      { googleCalendarRefreshToken, updatedAt: new Date() }, // Update Google Calendar token and set updatedAt to current time
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

export async function getGoogleCalendarRefreshToken({
  clerkId,
}: {
  clerkId: string;
}) {
  if (!clerkId) {
    throw new Error("clerkId is required.");
  }

  try {
    // Find the token document by clerkId
    const tokenDocument = await Token.findOne({ clerkId });

    if (!tokenDocument) {
      throw new Error("Token document not found.");
    }

    // Return the Google Calendar token
    return {
      googleCalendarRefreshToken: tokenDocument.googleCalendarRefreshToken,
    };
  } catch (error) {
    console.error(error);
    throw new Error(
      "An error occurred while fetching the Google Calendar token."
    );
  }
}

// Server Action to get the Calendly token using clerkId
export async function getCalendlyToken({ clerkId }: { clerkId: string }) {
  if (!clerkId) {
    throw new Error("clerkId is required.");
  }

  try {
    // Find the token document by clerkId
    const tokenDocument = await Token.findOne({ clerkId });

    if (!tokenDocument) {
      throw new Error("Token document not found.");
    }

    // Return the Calendly token
    return { calendlyToken: tokenDocument.calendlyToken };
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred while fetching the Calendly token.");
  }
}
