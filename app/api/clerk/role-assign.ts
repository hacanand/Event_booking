import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { userId, role } = await req.json();

  if (!userId || !role) {
    return NextResponse.json(
      { error: "Missing userId or role" },
      { status: 400 }
    );
  }

  try {
    // Update user's metadata with the selected role
    const client = await clerkClient();
    await client.users.updateUser(userId, {
      publicMetadata: { role },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error assigning role:", error);
    return NextResponse.json(
      { error: "Failed to assign role" },
      { status: 500 }
    );
  }
}
