import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { code, state } = req.query;

    if (!code) {
      return res.status(400).json({ error: "Authorization code is missing" });
    }

    // Forward the code and state back to the frontend
    res.status(200).json({ code, state });
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
