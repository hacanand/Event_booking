import { getGoogleAuthClient } from "@/lib/google";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function CallbackPage({
  searchParams,
}: {
  searchParams: { code: string };
}) {
  const code = searchParams.code;

  if (!code) {
    return <p>Authorization code not found.</p>;
  }

  const client = getGoogleAuthClient();
  const { tokens } = await client.getToken(code);

  const cookieStore = await cookies();
  cookieStore.set("google-access-token", tokens.access_token || "", {
    httpOnly: true,
  });
  cookieStore.set("google-refresh-token", tokens.refresh_token || "", {
    httpOnly: true,
  });

  redirect("/dashboard");
}
