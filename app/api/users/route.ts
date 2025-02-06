// import {   NextApiResponse } from "next";
 
import User from "../../../models/userModel";
import dbConnect from "@/app/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function GET( ) {
  try {
    await dbConnect();
    const users = await User.find({});
    return NextResponse.json({
      data: users,
      success: true,
      response: "All users fetched successfully",
      status: 200,
    });
  } catch (error  ) {
    return NextResponse.json({
      error: error as Error,
      success: false,
      response: "Failed to fetch users",
      status: 500,
    });
  }
}
export async function POST(req: NextRequest ) {
  try {
    await dbConnect();
    const body = await req.json();

    const {
      clerkId,
      userType,
      email,
      schedulesEventUrl,
      firstName,
      lastName,
      profilePicture,
    } = body;

    if (!clerkId || !userType || !email) {
      return NextResponse.json(
        {
          success: false,
          message: "clerkId, userType, and email are required",
        },
        { status: 400 }
      );
    }

    // Create the user object explicitly to ensure it matches the schema
    const userObj = {
      clerkId,
      userType,
      email,
      schedulesEventUrl: schedulesEventUrl || [],
      firstName: firstName || null,
      lastName: lastName || null,
      profilePicture: profilePicture || null,
    };

    const user = await User.create(userObj);

    return NextResponse.json({
      data: user,
      success: true,
      response: "User created successfully",
      status: 201,
    });
  } catch (error ) {
    return NextResponse.json({
      error: error ,
      success: false,
      status: 500,
    });
  }
}

 
// export async function PUT(req: NextRequest) {
//   try {
//     await dbConnect(); // Ensure database connection
//     const body = await req.json();

//     const { clerkId, ...updateFields } = body;

//     if (!clerkId) {
//       return NextResponse.json(
//         {
//           success: false,
//           response: "clerkId is required to identify the user",
//         },
//         { status: 400 }
//       );
//     }

//     // Perform findOneAndUpdate using $set to update only provided fields
//     const user = await User.findOneAndUpdate(
//       { clerkId }, // Query to find the user by clerkId
//       { $set: updateFields }, // Updates the fields provided in the body
//       { new: true } // Return the updated document
//     );

//     if (!user) {
//       return NextResponse.json(
//         { success: false, response: "User not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({
//       data: user,
//       success: true,
//       response: "User updated successfully",
//       status: 200,
//     });
//   } catch (error: any) {
//     return NextResponse.json(
//       {
//         error: error.message,
//         success: false,
//         response: "Failed to update user",
//       },
//       { status: 500 }
//     );
//   }
// }
