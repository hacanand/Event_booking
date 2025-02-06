"use client";

import React from "react";
import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

const SwaggerDocs = () => {
  return <SwaggerUI url="/api/docs" />;
};

export default SwaggerDocs;
