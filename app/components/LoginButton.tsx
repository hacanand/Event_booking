// src/components/LoginButton.tsx
"use client";

import React from "react";
// import { env } from "../utils/env";

const LoginButton: React.FC = () => {
  const handleLogin = () => {
    const authorizationUrl = `https://auth.calendly.com/oauth/authorize?client_id=${process
      .env
      .NEXT_PUBLIC_CALENDLY_CLIENT_ID!}&response_type=code&redirect_uri=${encodeURIComponent(
      process.env.NEXT_PUBLIC_CALENDLY_REDIRECT_URI!
    )}`;
    window.location.href = authorizationUrl;
  };

  return <button onClick={handleLogin}>Login with Calendly</button>;
};

export default LoginButton;
