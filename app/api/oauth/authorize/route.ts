import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const client_id = process.env.CALENDLY_CLIENT_ID;
    const redirect_uri = process.env.NEXT_PUBLIC_CALENDLY_REDIRECT_URI;

    if (!client_id || !redirect_uri) {
      return res
        .status(400)
        .json({ error: "Missing client_id or redirect_uri" });
    }
    const authUrl = `https://auth.calendly.com/oauth/authorize?client_id=${client_id}&response_type=code&redirect_uri=${redirect_uri} 
    }`;
    // https://auth.calendly.com/oauth/authorize?client_id=CLIENT_ID&response_type=code&redirect_uri=https://my.site.com/auth/calendly

    // Redirect the user to Calendly's authorization page
    res.redirect(authUrl);
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
