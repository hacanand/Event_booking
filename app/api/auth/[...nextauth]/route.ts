// import NextAuth from "next-auth";
// import { NextAuthOptions } from "next-auth";
// import axios from "axios";

// const authOptions: NextAuthOptions = {
//   providers: [
//     {
//       id: "calendly",
//       name: "Calendly",
//       type: "oauth",
//       version: "2.0",
//       scope: "user:read_schedules",
//       params: { grant_type: "authorization_code" },
//       accessTokenUrl: "https://auth.calendly.com/oauth/token",
//       requestTokenUrl: "https://auth.calendly.com/oauth/authorize",
//       authorizationUrl:
//         "https://auth.calendly.com/oauth/authorize?response_type=code",
//       profileUrl: "https://api.calendly.com/users/me",
//       clientId: process.env.NEXT_PUBLIC_CALENDLY_CLIENT_ID!,
//       clientSecret: process.env.CALENDLY_CLIENT_SECRET!,
//       profile: (profile) => ({
//         id: profile.id,
//         name: profile.name,
//         email: profile.email,
//         image: null,
//       }),
//     },
//   ],
//   callbacks: {
//     async jwt({ token, account, user }) {
//       if (account) {
//         token.accessToken = account.access_token;
//         token.refreshToken = account.refresh_token;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       session.user.accessToken = token.accessToken;
//       return session;
//     },
//   },
// };

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };
