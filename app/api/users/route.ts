import { NextRequest, NextResponse } from "next/server";
import User, { IUser } from "../../../models/userModel";
import dbConnect from "@/app/utils/dbConnect";

interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  success: boolean;
  response: string;
  status: number;
}
export async function GET(): Promise<NextResponse<ApiResponse<IUser[]>>> {
  try {
    await dbConnect();
    const users: IUser[] = await User.find({});
    return NextResponse.json({
      data: users,
      success: true,
      response: "All users fetched successfully",
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({
      error: (error as Error).message,
      success: false,
      response: "Failed to fetch users",
      status: 500,
    });
  }
}

interface UserRequestBody {
  clerkId: string;
  userType: string;
  email: string;
  scheduledEventUrls?: string[];
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
}

export async function POST(
  req: NextRequest
): Promise<NextResponse<ApiResponse<IUser>>> {
  try {
    await dbConnect();
    const body: UserRequestBody = await req.json();

    const {
      clerkId,
      userType,
      email,
      scheduledEventUrls,
      firstName,
      lastName,
      profilePicture,
    } = body;

    if (!clerkId || !userType || !email) {
      return NextResponse.json(
        {
          success: false,
          response: "clerkId, userType, and email are required",
          status: 400,
        },
        { status: 400 }
      );
    }

    const userObj = new User({
      clerkId,
      userType,
      email,
      scheduledEventUrls: scheduledEventUrls || [],
      firstName: firstName || "",
      lastName: lastName || "",
      profilePicture: profilePicture || "",
    });

    const user: IUser = await userObj.save();

    return NextResponse.json({
      data: user,
      success: true,
      response: "User created successfully",
      status: 201,
    });
  } catch (error) {
    return NextResponse.json({
      error: (error as Error).message,
      success: false,
      response: "Failed to create user",
      status: 500,
    });
  }
}
