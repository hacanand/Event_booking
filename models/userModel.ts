import mongoose, { Document, Schema, Model } from "mongoose";


import {  Credentials } from 'google-auth-library';

// Define TypeScript interface for the token structure
// export interface IGoogleCalendarToken {
//   access_token: string;
//   refresh_token: string;
//   scope: string;
//   token_type: string;
//   expiry_date: number;
// }

// Define the IUser interface
interface IUser extends Document {
  clerkId: string; // Simplified type definitions for better readability
  userType: string;
  // schedulesEventUrl  array of strings
  schedulesEventUrl?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  calendlyUserUrl?: string;
  google_refresh_token?: string;
  googleCalendarToken?: Credentials;
  createdAt: Date;
  updatedAt: Date;
}



// Create the schema for the Google Calendar Token
const GoogleCalendarTokenSchema = new Schema<Credentials>(
  {
    access_token: {
      type: String,
      required: true,
    },
    refresh_token: {
      type: String,
      required: true,
    },
    scope: {
      type: String,
      required: true,
    },
    token_type: {
      type: String,
      required: true,
    },
    expiry_date: {
      type: Number,
      required: true,
    },
  },
  { _id: false } // Disable _id for the nested schema
);

// Define the schema for the User model
const userSchema: Schema<IUser> = new Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    userType: {
      type: String,
      required: true,
    },
    schedulesEventUrl: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      default: null,
    },
    lastName: {
      type: String,
      default: null,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    calendlyUserUrl: {
      type: String,
      default: null,
    },
    googleCalendarToken: {
      type: GoogleCalendarTokenSchema,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
    versionKey: false, // Remove __v field
  }
);

// Pre-save middleware to update the `updatedAt` field
userSchema.pre<IUser>("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Create the User model
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
