import { getUpdatedAuthClient } from "@/lib/google";
import Event from "@/models/eventModel";
import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

const validateEventData = (data: any) => {
  const errors: string[] = [];

  if (!data.createrId) errors.push("Creator ID is required.");
  if (!data.eventName) errors.push("Event name is required.");
  if (!data.eventDuration || data.eventDuration <= 0)
    errors.push("Event duration must be greater than 0.");
  if (!data.startTime) errors.push("Start time is required.");
  if (!data.endTime) errors.push("End time is required.");

  if (data.startTime && data.endTime) {
    const startTime = new Date(data.startTime);
    const endTime = new Date(data.endTime);
    if (startTime >= endTime) {
      errors.push("Start time must be before end time.");
    }

    const durationInMinutes =
      (endTime.getTime() - startTime.getTime()) / (1000 * 60);
    if (data.eventDuration !== durationInMinutes) {
      errors.push(
        "Event duration must match the difference between startTime and endTime."
      );
    }
  }

  return errors;
};

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Validate data
    const validationErrors = validateEventData(data);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { success: false, errors: validationErrors },
        { status: 400 }
      );
    }
    const newEvent = await Event.create(data);
    return NextResponse.json(
      { success: true, event: newEvent },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

 
export async function GET() {
  try {
    const authClient = await getUpdatedAuthClient(); // Ensure this works
    console.log("AuthClient:", authClient.credentials);

    const calendar = google.calendar({ version: "v3", auth: authClient });

    const events = await calendar.events.list({
      calendarId: "primary", // Ensure 'primary' or other calendar ID is specified
      maxResults: 10, // Optional: limit results for testing
      singleEvents: true, // Optional: expand recurring events into single instances
      orderBy: "startTime", // Optional: sort events by start time
    });

    console.log("Events:", events.data.items);
    return NextResponse.json(events.data.items); // Adjust response format as needed
  } catch (error: any) {
    console.error("Error:", error.response?.data || error.message);
    return NextResponse.json({ error: error.message });
  }
}
