import mongoose, { Schema, Document } from "mongoose";
import { Credentials } from "google-auth-library";

interface IToken extends Document {
  clerkId: string;
  calendlyRefreshToken: string;
  googleToken: Credentials; // Updated to use Credentials type
  updatedAt: Date;
}

// Main Token Schema
const TokenSchema: Schema = new Schema(
  {
    clerkId: { type: String, required: true, unique: true }, // Clerk ID for user identification
    calendlyRefreshToken: { type: String, required: true, default: null },
    googleToken: {
      type: Schema.Types.Mixed, // Allows storage of any object shape (matches Credentials)
      default: null,
    },
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
