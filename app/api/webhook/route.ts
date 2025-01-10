
import { NextResponse } from 'next/server';

interface CalendlyWebhookPayload {
  event: string;
  payload: any;
}

export async function POST(req: Request) {
  try {
    const body: CalendlyWebhookPayload = await req.json();

    if (body.event === "webhook.verify") {
      return NextResponse.json({ message: "Webhook verified successfully" });
    }

    console.log("Webhook received:", body);

    switch (body.event) {
      case "invitee.created":
        console.log("Event Created:", body.payload);
        break;
      case "invitee.scheduled":
        console.log("Event Scheduled:", body.payload);
        break;
      default:
        console.log("Unhandled event:", body.event);
    }

    return NextResponse.json({ message: "Webhook processed successfully" });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Error processing webhook" },
      { status: 500 }
    );
  }
}
