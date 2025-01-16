import { NextRequest, NextResponse } from "next/server";
import Event from '@/models/eventModel'  

export async function GET() {
  try {
    // Fetch all events from the database
    const events = await Event.find();
    return NextResponse.json({ success: true, data: events });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate required fields
    const requiredFields = [
      "clerkId",
      "eventType",
      "eventName",
      "startTime",
      "endTime",
      "eventStatus",
      "eventUri",
      "timezone",
      "createdAt",
      "updatedAt",
    ];
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Missing required fields: ${missingFields.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Create a new event document
    const newEvent = await Event.create(body);

    return NextResponse.json(
      { success: true, data: newEvent },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create event" },
      { status: 500 }
    );
  }
}
