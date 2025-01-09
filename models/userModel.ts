import mongoose, { Document, Schema, Model } from "mongoose";

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
  createdAt: Date;
  updatedAt: Date;
}

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
    google_refresh_token: {
      type: String,
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
