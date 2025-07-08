"use client";

import React from "react";

type LoadingSpinnerProps = {
  size?: number; // e.g. 12 for w-12/h-12
  colorClass?: string; // e.g. "border-orange-600"
};

export default function LoadingSpinner({
  size = 12,
  colorClass = "border-orange-600",
}: LoadingSpinnerProps) {
  return (
    <div
      className={`w-${size} h-${size} border-4 ${colorClass} border-t-transparent rounded-full animate-spin`}
      style={{ minWidth: `${size * 0.25}rem`, minHeight: `${size * 0.25}rem` }}
    ></div>
  );
}
