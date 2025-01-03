"use client";

import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { CheckIcon } from "lucide-react";

interface ShareLinkProps {
  salesId: string;
}

export function ShareLink({ salesId }: ShareLinkProps) {
  const [copied, setCopied] = useState(false);
  const link = `hiitech.com/${salesId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#14144B]">Share Your Link</h2>
        <p className="text-gray-500 mt-2">
          Share this link with your customers
        </p>
      </div>

      <div className="flex gap-2">
        <Input value={link} readOnly className="bg-gray-50" />
        <Button
          onClick={copyToClipboard}
          className="bg-[#00FF8C] text-[#14144B] hover:bg-[#00FF8C]/90"
        >
          {copied ? <CheckIcon className="h-4 w-4" /> : "Copy"}
        </Button>
      </div>
    </div>
  );
}
