'use server'

import User from "@/models/userModel";
 import { Credentials } from "google-auth-library";
export const getUserToken = async (clerkId: string) => {
  const user = await User.findOne({ clerkId });
  if (user) {
    return user.googleCalendarToken;
  }
  throw new Error("User not found");
};

export const updateUserToken = async (clerkId: string, token: Credentials) => {
  const user = await User.findOneAndUpdate(
    { clerkId },
    { googleCalendarToken: token }
  );
  if (user) {
    return user.googleCalendarToken;
  }
  throw new Error("User not found");
};


