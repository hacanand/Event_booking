import mongoose, { Document, Schema, Model } from "mongoose";

export interface IUser extends Document {
  clerkId: string; // Simplified type definitions for better readability
  userType: string;
  userStatus?: "verified" | "unverified";
  scheduledEventUrls?: string[];
  email: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
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
    userStatus: {
      type: String,
      default: "unverified",
    },
    scheduledEventUrls: {
      type: [String],
      default: [],
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
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
    versionKey: false, // Remove __v field
  }
);

// Pre-save middleware to update the `updatedAt` field
userSchema.pre("save", function (next) {
  this.set("updatedAt", new Date());
  next();
});

// Create the User model
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
