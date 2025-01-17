import { NextResponse } from "next/server";
import Event from "@/models/eventModel";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Log the webhook body for debugging purposes
    console.log("Webhook received:", body);

    // Check if it's a webhook verification event
    if (body.event === "webhook.verify") {
      return NextResponse.json({ message: "Webhook verified successfully" });
    }
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 401 }
      );
    }
    // Handle the "invitee.created" event
    if (body.event === "invitee.created") {
      const payload = body.payload;

      // Extract necessary fields from the payload
      const eventData = {
        clerkId: user.id, // Map Clerk ID from the email field or another identifier
        eventType: payload.scheduled_event.event_type,
        eventName: payload.scheduled_event.name,
        startTime: payload.scheduled_event.start_time,
        endTime: payload.scheduled_event.end_time,
        eventStatus: payload.scheduled_event.status,
        eventUri: payload.scheduled_event.uri,
        timezone: payload.timezone,
        createdAt: payload.created_at,
        updatedAt: payload.updated_at,
      };

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
      const missingFields = requiredFields.filter(
        (field) => !eventData[field as keyof typeof eventData]
      );

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
      const newEvent = await Event.create(eventData);

      return NextResponse.json({
        success: true,
        message: "Event created successfully",
        data: newEvent,
      });
    }

    // Handle unsupported events
    return NextResponse.json(
      {
        success: false,
        message: `Unhandled event type: ${body.event}`,
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { success: false, message: "Error processing webhook" },
      { status: 500 }
    );
  }
}
