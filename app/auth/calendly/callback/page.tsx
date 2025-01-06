// src/app/auth/callback/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

const CallbackPage: React.FC = () => {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get("code");

    if (!code) {
      setError("Authorization code is missing.");
      return;
    }

    axios
      .post("/api/auth/calendly/callback", { code })
      .then((response) => setAccessToken(response.data.accessToken))
      .catch((err) =>
        setError(err.response?.data?.error || "An error occurred.")
      );
  }, [searchParams]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!accessToken) {
    return <div>Loading...</div>;
  }

  return <div>Access Token: {accessToken}</div>;
};

export default CallbackPage;
