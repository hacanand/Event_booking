import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  try {
     const { userId, role } = await request.json();

  const client = await clerkClient();

   await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      role: role,
    },
  });
    return NextResponse.json({
      message: "User role updated successfully",
      status: 200
    });
    
  } catch (error) {
    console.error("Error in route handler:", error);
    return NextResponse.json({
      message: "Failed to update user role",
      error: (error as Error).message,
      status: 500,
    });
    
  }
}