// schedulesEventUrl;

import axios from "axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const cookiesObject = await cookies();
  const calendly_token = cookiesObject.get("calendly-access-token");
  try {
    var options = {
      method: "GET",
      url: "https://api.calendly.com/event_types",
      params: {
        user: "https://api.calendly.com/users/82d3f20e-56d7-47fd-9b92-14d9566f5434",
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer  ${calendly_token}`, // "Bearer " + calendly_token,
      },
    };

    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  } catch (error) {
    console.error("Error in API handler:", error);
    return NextResponse.json({
      message: "Internal Server Error",
      error: (error as any).message,
    });
  }
}
