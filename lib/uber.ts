// lib/uber.ts
import axios from "axios";

export const getUberAccessToken = async () => {
  const { NEXT_PUBLIC_UBER_CLIENT_ID,  UBER_CLIENT_SECRET } =
    process.env;

  try {
    const response = await axios.post(
      "https://login.uber.com/oauth/v2/token",
      new URLSearchParams({
        client_id: NEXT_PUBLIC_UBER_CLIENT_ID!,
        client_secret: UBER_CLIENT_SECRET!,
        grant_type: "client_credentials",
        scope: "vouchers",
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    return response.data.access_token;
  } catch (error: any) {
    console.error(
      "Error getting Uber access token:",
      error.response?.data || error
    );
    throw new Error("Unable to authenticate with Uber API");
  }
};

 
export const getOrganizationId = async (): Promise<string> => {
  const { NEXT_PUBLIC_UBER_API_BASE_URL } = process.env;

  try {
    const token = await getUberAccessToken();

    const response = await axios.get(`${NEXT_PUBLIC_UBER_API_BASE_URL}/v1/businesses/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Extract the organization ID from the response
    const organizationId = response.data.organization_uuid;

    console.log("Organization ID:", organizationId);

    return organizationId;
  } catch (error: any) {
    console.error(
      "Error fetching organization ID:",
      error.response?.data || error
    );
    throw new Error("Unable to fetch organization ID");
  }
};