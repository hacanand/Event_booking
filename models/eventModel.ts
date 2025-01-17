import mongoose, { Schema, Document } from "mongoose";
import axios from "axios";
import axiosInstance from "@/app/utils/axiosInstance";
import { fetchGoogleCalendarEventId } from "@/app/actions/calendly/tokenAndDataUpdate";

// Define the interface for the schema
export interface IEvent extends Document {
  clerkId: string;
  eventType: string;
  eventName: string;
  startTime: string;
  endTime: string;
  eventStatus: string;
  eventUri: string;
  googleCalendarEventId: string | null; 
  timezone: string;
  createdAt: string;
  updatedAt: string;
}

// Create the schema
const EventSchema: Schema = new Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    eventType: { type: String, required: true },
    eventName: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    eventStatus: { type: String, required: true },
    eventUri: { type: String, required: true },
    googleCalendarEventId: { type: String, default: null }, // New field added
    timezone: { type: String, required: true },
    createdAt: { type: String, required: true },
    updatedAt: { type: String, required: true },
  },
  {
    timestamps: false, // Disable automatic timestamps as we are using the webhook timestamps
  }
);

EventSchema.post("save", async function (doc: IEvent) {
  try {
    const googleCalendarEventId = await fetchGoogleCalendarEventId(
      doc.eventUri
    );

    if (googleCalendarEventId) {
      // Update the document in MongoDB
      doc.googleCalendarEventId = googleCalendarEventId;
      await doc.save(); // Save the updated document
    }
  } catch (error) {
    console.error("Error in post-save middleware:", error);
  }
});

// Export the model
const Event =
  mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);
export default Event;
