import axios from "axios";

// const CALENDLY_API_KEY = "YOUR_API_KEY"; // Replace with your Calendly API  

export const registerCalendlyWebhook = async (access_token:string,orgURI:string) => {
  try {
    const response = await axios.post(
      "https://api.calendly.com/webhook_subscriptions",
      {
        url: "https://3838-2409-40e4-2051-92a2-90c5-e45a-5fb2-f786.ngrok-free.app/api/webhook",
        //   `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhook`,
        events: ["invitee.created", "invitee.canceled"], // Events to subscribe to
        organization: orgURI, // Replace ORG_ID with your organization ID
        scope: "organization",
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Webhook registered successfully:", response.data);
  } catch (error:any) {
    console.error(
      "Failed to register webhook:",
      error.response?.data || error.message
    );
  }
};

 
