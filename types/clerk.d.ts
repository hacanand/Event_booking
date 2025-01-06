import "@clerk/nextjs";

declare module "@clerk/nextjs" {
  interface UserPublicMetadata {
    role?: "salesman" | "customer";
  }
}
