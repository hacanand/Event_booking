// // app/api/calcom/createManagedUser/route.ts

// import { NextResponse } from "next/server";

// const CALCOM_CLIENT_ID = process.env.NEXT_PUBLIC_CALCOM_CLIENT_ID;
// const CALCOM_CLIENT_SECRET = process.env.CALCOM_SECRET_KEY;

// export async function POST(req: Request) {
//   try {
//     const email = "anandpromax@gmail.com";
//     const name="Anand";

//     if (!email) {
//       return NextResponse.json({ error: "Email is required" }, { status: 400 });
//     }

//     // Construct the API URL with Client ID
//     const apiUrl = `https://api.cal.com/v2/oauth-clients/${CALCOM_CLIENT_ID}/users`;

//     // Prepare the request headers
//     const headers = {
//       "Content-Type": "application/json",
//       "x-cal-secret-key": CALCOM_CLIENT_SECRET!, // Using secret key from env
//     };

//     // Prepare the request body
//     const requestBody = JSON.stringify({
//       email,
//       name,
//         // Optional: IANA format (e.g., "America/New_York")
//     });

//     // Make the API request to Cal.com
//     const response = await fetch(apiUrl, {
//       method: "POST",
//       headers: headers,
//       body: requestBody,
//     });

//     // Parse the response
//     const data = await response.json();

//     if (!response.ok) {
//       return NextResponse.json(
//         { error: data.message || "Failed to create managed user" },
//         { status: response.status }
//       );
//     }

//     return NextResponse.json(
//       { message: "Managed user created successfully", user: data },
//       { status: 201 }
//     );
//   } catch (error:any) {
//     return NextResponse.json(
//       { error: "Internal Server Error", details: error.message },
//       { status: 500 }
//     );
//   }
// }


// app/api/calcom/getEventTypes/route.ts

import { NextResponse } from "next/server";

const CALCOM_CLIENT_ID = process.env.NEXT_PUBLIC_CALCOM_CLIENT_ID;
const CALCOM_CLIENT_SECRET = process.env.CALCOM_SECRET_KEY;
const CALCOM_USER_ID = process.env.CALCOM_USER_ID; // If required

// app/api/calcom/checkAuthorization/route.ts
 

export async function GET() {
    try {
        const response = await fetch("https://api.cal.com/v1/oauth/token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                grant_type: "client_credentials",
                client_id: CALCOM_CLIENT_ID,
                client_secret: CALCOM_CLIENT_SECRET,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json({
                error: data.error_description || "Unauthorized. Invalid Client ID or Secret.",
                status: response.status,
            });
        }

        return NextResponse.json({
            message: "Client ID is authorized",
            accessToken: data.access_token,
            expires_in: data.expires_in,
        });
    } catch (error:any) {
        return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
    }
}
