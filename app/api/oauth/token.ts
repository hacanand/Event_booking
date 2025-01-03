import type { NextApiRequest, NextApiResponse } from "next";

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { code, redirect_uri, client_id, client_secret } = req.body;

    if (!code || !redirect_uri || !client_id || !client_secret) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    try {
      const response = await fetch("https://auth.calendly.com/oauth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          client_id,
          client_secret,
          redirect_uri,
        }),
      });

      const data: TokenResponse = await response.json();

      if (response.ok) {
        res.status(200).json(data); // Return the token to the frontend
      } else {
        res.status(response.status).json(data); // Return Calendly's error
      }
    } catch (error) {
      console.error("Error exchanging token:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
