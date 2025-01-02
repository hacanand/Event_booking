'use client'
import { signIn, signOut, useSession } from "next-auth/react";

const AuthButton: React.FC = () => {
  const { data: session } = useSession();

  if (session) {
    return (
      <div>
        <p>Welcome, {session.user?.name}</p>
        <button
          className="p-2 border-2 m-2 border-green-400 "
          onClick={() => signOut()}
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button className="p-2 border-2 border-green-400  m-2" onClick={() => signIn("linkedin")}>Sign In with LinkedIn</button>
  );
};

export default AuthButton;
