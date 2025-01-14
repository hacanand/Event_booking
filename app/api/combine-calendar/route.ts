import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { google } from "googleapis";
import { getGoogleAuthClient } from "@/lib/google";
 
 
interface CalendlyEvent {
  uri: string;
  name: string;
  start_time: string;
  end_time: string;
}

interface GoogleCalendarEvent {
  id: string;
  summary: string;
  start: { dateTime: string };
  end: { dateTime: string };
}

interface CombinedEvent {
  calendlyEvent?: CalendlyEvent;
  googleCalendarEvent?: GoogleCalendarEvent;
}

const CALENDLY_API_BASE = "https://api.calendly.com";
const CALENDLY_ACCESS_TOKEN = process.env.CALENDLY_ACCESS_TOKEN;

// Fetch events from Calendly
const fetchCalendlyEvents = async (): Promise<CalendlyEvent[]> => {
  if (!CALENDLY_ACCESS_TOKEN) {
    throw new Error("Missing Calendly Access Token");
  }

    const response = await axios.get(`${CALENDLY_API_BASE}/scheduled_events`, {
      params: {
        user: "https://api.calendly.com/users/82d3f20e-56d7-47fd-9b92-14d9566f5434",
      },
      headers: {
        Authorization: `Bearer ${CALENDLY_ACCESS_TOKEN}`,
      },
    });

  return response.data.collection.map((event: any) => ({
    uri: event.uri,
    name: event.name,
    start_time: event.start_time,
    end_time: event.end_time,
  }));
};

// Fetch events from Google Calendar using authClient
const fetchGoogleCalendarEvents = async (
  authClient: any,
  timeMin: string,
  timeMax: string
): Promise<GoogleCalendarEvent[]> => {
  const calendar = google.calendar({ version: "v3", auth: authClient });

  const response = await calendar.events.list({
    calendarId: "primary",
    timeMin,
    timeMax,
  });

  return (
    response.data.items?.map((event: any) => ({
      id: event.id,
      summary: event.summary,
      start: event.start,
      end: event.end,
    })) || []
  );
};

// Combine events from Calendly and Google Calendar
const combineEvents = (
  calendlyEvents: CalendlyEvent[],
  googleEvents: GoogleCalendarEvent[]
): CombinedEvent[] => {
  const combined: CombinedEvent[] = [];

  calendlyEvents.forEach((calendlyEvent) => {
    const matchingGoogleEvent = googleEvents.find(
      (googleEvent) =>
        googleEvent.start.dateTime === calendlyEvent.start_time &&
        googleEvent.end.dateTime === calendlyEvent.end_time
    );

    combined.push({
      calendlyEvent,
      googleCalendarEvent: matchingGoogleEvent,
    });
  });

  // Add Google Calendar events not in Calendly
  googleEvents.forEach((googleEvent) => {
    if (
      !combined.some(
        (combinedEvent) =>
          combinedEvent.googleCalendarEvent?.id === googleEvent.id
      )
    ) {
      combined.push({
        googleCalendarEvent: googleEvent,
      });
    }
  });

  return combined;
};

// API handler
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { googleAccessToken } = req.query;

  if (!googleAccessToken) {
    return res.status(400).json({ error: "Missing Google Access Token" });
  }

  try {
    // Initialize Google OAuth client with the provided access token
     const authClient = getGoogleAuthClient();
    // Fetch events from Calendly and Google Calendar
    const calendlyEvents = await fetchCalendlyEvents();
    const googleCalendarEvents = await fetchGoogleCalendarEvents(
      authClient,
      new Date().toISOString(), // Current time as the minimum time
      new Date(new Date().setDate(new Date().getDate() + 30)).toISOString() // 30 days from now
    );

    // Combine events
    const combinedEvents = combineEvents(calendlyEvents, googleCalendarEvents);

    res.status(200).json({ events: combinedEvents });
  } catch (error) {
    console.error("Error in /api/combined-calendar:", error);
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
}
