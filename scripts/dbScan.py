import time
from datetime import datetime, timedelta
import os
from pymongo import MongoClient


MONGO_URI = os.getenv("MONGO_URI")
# MongoDB connection setup
client = MongoClient(MONGO_URI)  # Update with your DB URI
db = client["test"]  # Replace with your database name
event_collection = db["events"]  # Replace with your collection name

def get_upcoming_events():
    try:
        # Get current time and calculate 90-minute window
        now = datetime.utcnow()
        next_90_minutes = now + timedelta(minutes=90)

        # Query to find events within the next 90 minutes
        events = event_collection.find({
            "startTime": {
                "$gte": now.isoformat(),
                "$lte": next_90_minutes.isoformat()
            }
        })

        # Convert the events to a list of dictionaries
        event_list = []
        for event in events:
            event_list.append({
                "eventType": event.get("eventType"),
                "eventName": event.get("eventName"),
                "startTime": event.get("startTime"),
                "endTime": event.get("endTime"),
                "eventStatus": event.get("eventStatus"),
                "eventUri": event.get("eventUri"),
                "googleCalendarEventId": event.get("googleCalendarEventId"),
                "invitee": event.get("invitee"),
                "cancelUrl": event.get("cancelUrl"),
                "rescheduleUrl": event.get("rescheduleUrl"),
                "rescheduled": event.get("rescheduled"),
                "timezone": event.get("timezone"),
                "createdAt": event.get("createdAt"),
                "updatedAt": event.get("updatedAt"),
            })

        return event_list
    except Exception as e:
        print(f"Error fetching events: {e}")
        return []

def main():
    while True:
        print("Checking for upcoming events...")
        events = get_upcoming_events()

        if events:
            print(f"Upcoming events in the next 90 minutes: {events}")
        else:
            print("No events found in the next 90 minutes.")

        # Wait for 15 minutes before the next scan
        time.sleep(15 * 60)

if __name__ == "__main__":
    main()
