"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export default function ShareShelf({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col sm:items-center gap-2 sm:gap-3 w-full">
      <span className="text-zinc-200 text-sm sm:text-base text-center">
        Share your shelf:
      </span>
      <button
        onClick={handleCopy}
        className="flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-lg font-semibold shadow hover:shadow-amber-600/40 transition cursor-pointer text-zinc-900 w-full sm:w-auto"
      >
        {copied ? (
          <>
            <Check className="w-5 h-5" /> Copied!
          </>
        ) : (
          <>
            <Copy className="w-5 h-5" /> Copy Link
          </>
        )}
      </button>
    </div>
  );
}
