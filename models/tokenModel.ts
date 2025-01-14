import mongoose, { Schema, Document } from "mongoose";
import { Credentials } from "google-auth-library";


// Define the Google Calendar token interface
// interface IGoogleCalendarToken {
//   access_token: string;
//   refresh_token: string;
//   scope: string;
//   token_type: string;
//   expiry_date: number; // Epoch timestamp for token expiration
// }

// Define the Calendly token interface
interface ICalendlyToken {
  access_token: string;
  refresh_token: string;
  expiry_date: Date;
}

// Define the main token document interface
export interface IToken extends Document {
  clerkId: string; // Clerk ID for user management
  calendlyToken: ICalendlyToken;
  googleCalendarToken: Credentials;
  updatedAt: Date;
}

// Google Calendar Token Schema
const GoogleCalendarTokenSchema = new Schema<Credentials>(
  {
    access_token: { type: String, required: true },
    refresh_token: { type: String, required: true },
    scope: { type: String, required: true },
    token_type: { type: String, required: true },
    expiry_date: { type: Number, required: true }, // Unix timestamp
  },
  { _id: false } // Disable _id for this nested schema
);

// Calendly Token Schema
const CalendlyTokenSchema = new Schema<ICalendlyToken>(
  {
    access_token: { type: String, required: true },
    refresh_token: { type: String, required: true },
    expiry_date: { type: Date, required: true },
  },
  { _id: false } // Disable _id for this nested schema
);

// Main Token Schema
const TokenSchema: Schema = new Schema(
  {
    clerkId: { type: String, required: true }, // Clerk ID for user identification
    calendlyToken: { type: CalendlyTokenSchema, required: true },
    googleCalendarToken: { type: GoogleCalendarTokenSchema, required: true },
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
