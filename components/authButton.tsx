'use client'
import { signIn, signOut, useSession } from "next-auth/react";

const AuthButton: React.FC = () => {
  const { data: session } = useSession();

  if (session) {
    return (
      <div>
        <p>Welcome, {session.user?.name}</p>
        <button onClick={() => signOut()}>Sign Out</button>
      </div>
    );
  }

  return (
    <button onClick={() => signIn("linkedin")}>Sign In with LinkedIn</button>
  );
};

export default AuthButton;
