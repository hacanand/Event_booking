import NextAuth, { AuthOptions } from "next-auth";
import LinkedInProvider from "next-auth/providers/linkedin";

export const authOptions: AuthOptions = {
  providers: [
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID || "",
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET, // Ensure you set a strong random secret
  callbacks: {
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.sub || "", // Include user ID in the session
      };
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
