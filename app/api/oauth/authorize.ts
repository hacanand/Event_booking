import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { client_id, redirect_uri, state } = req.query;

    if (!client_id || !redirect_uri) {
      return res
        .status(400)
        .json({ error: "Missing client_id or redirect_uri" });
    }

    const authUrl = `https://auth.calendly.com/oauth/authorize?client_id=${client_id}&response_type=code&redirect_uri=${redirect_uri}&state=${
      state || ""
    }`;

    // Redirect the user to Calendly's authorization page
    res.redirect(authUrl);
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
