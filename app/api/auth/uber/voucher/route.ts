// app/api/voucher/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import {getUberAccessToken} from "@/lib/uber";
import { NextApiRequest } from "next";
 

export async function POST(request: NextRequest) {
  const { name, amount, startDate, endDate } = await request.json();

  try {
    const token = await getUberAccessToken();
    console.log("token", token);
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_UBER_API_BASE_URL}/vouchers`,
      {
        name,
        type: "fixed_value",
        value: { amount: amount, currency_code: "USD" },
        usage_limit: 1,
        redemption_methods: ["pickup"],
        start_date: startDate,
        end_date: endDate,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json({ voucher:' response.data '});
  } catch (error) {
    console.error("Error creating Uber voucher:", error);
    return NextResponse.json(
      { error: "Failed to create Uber voucher" },
      { status: 500 }
    );
  }
}

// app/api/organization/route.ts
 
import { getOrganizationId } from "@/lib/uber";

export async function GET() {
  try {
    const organizationId = await getOrganizationId();

    return NextResponse.json({ organizationId });
  } catch (error) {
    console.error("Error in GET /api/organization:", error);
    return NextResponse.json(
      { error: "Failed to fetch organization ID" },
      { status: 500 }
    );
  }
}
