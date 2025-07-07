"use client";

import { useState } from "react";

export default function ShareShelf({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-3 mt-4">
      <span className="text-zinc-400">Share your shelf:</span>
      <button
        onClick={handleCopy}
        className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg font-semibold transition"
      >
        {copied ? "Copied!" : "Copy Link"}
      </button>
    </div>
  );
}
