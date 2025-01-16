import mongoose, { Schema, Document } from "mongoose";
import axios from "axios";
import axiosInstance from "@/app/utils/axiosInstance";

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

// Post-save middleware to fetch Google Calendar Event ID
EventSchema.post("save", async function (doc: IEvent) {
  try {
    
    const res = await axiosInstance.put('/api/auth/calendly/refresh-token');
    const token = res.data.data.accessToken;
    if (!token) {
      console.error("Google Calendar API token not found");
      return;
    }

    // API call to Calendly to retrieve event details
    const options = {
      method: "GET",
      url: `https://api.calendly.com/scheduled_events/${doc.eventUri
        .split("/")
        .pop()}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.request(options);
    const googleCalendarEventId =
      response.data.resource.calendar_event.external_id; // Replace with correct key from API response

    if (googleCalendarEventId) {
      // Update the document in MongoDB
      doc.googleCalendarEventId = googleCalendarEventId;
      await doc.save(); // Save the updated document
    }
  } catch (error) {
    console.error("Error fetching Google Calendar Event ID:", error);
  }
});

// Export the model
const Event =
  mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);
export default Event;
