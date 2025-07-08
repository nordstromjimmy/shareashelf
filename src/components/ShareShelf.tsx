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
    <div className="flex items-center gap-3">
      <span className="text-zinc-400">Share your shelf:</span>
      <button
        onClick={handleCopy}
        className="bg-amber-600 hover:bg-amber-700 px-6 py-3 rounded-lg font-semibold shadow hover:shadow-amber-600/40 transition cursor-pointer text-zinc-900"
      >
        {copied ? "Copied!" : "Copy Link"}
      </button>
    </div>
  );
}
