import mongoose, { Schema, Document } from "mongoose";
import { unique } from "next/dist/build/utils";

interface IToken extends Document {
  clerkId: string;
  calendlyRefreshToken: string;
  googleCalendarRefreshToken: string;
  updatedAt: Date;
}

// Main Token Schema
const TokenSchema: Schema = new Schema(
  {
    clerkId: { type: String, required: true, unique: true }, // Clerk ID for user identification
    calendlyRefreshToken: { type: String, required: true, default: null },
    googleCalendarRefreshToken: { type: String, default: null },
    updatedAt: { type: Date, default: Date.now }, // Automatically store the last update time
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

// Export the model
const Token =
  mongoose.models.Token || mongoose.model<IToken>("Token", TokenSchema);
export default Token;
