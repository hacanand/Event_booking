import mongoose, { Schema, Document } from "mongoose";
import axios from "axios";

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
    // Retrieve the token from the Token schema
    const Token = mongoose.model("Token"); // Assuming Token schema is defined elsewhere
    const tokenDoc = await Token.findOne(); // Retrieve the token document
    const token = tokenDoc?.token; // Assuming token field is stored as `token`

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
    const googleCalendarEventId = response.data.resource.google_event_id; // Replace with correct key from API response

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
