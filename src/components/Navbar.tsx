"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="w-full bg-zinc-900 border-b border-zinc-700 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold text-orange-500 hover:text-orange-600"
        >
          Whiskey Shelf
        </Link>

        <div className="flex items-center gap-6 text-lg">
          <Link
            href="/dashboard"
            className={"hover:text-orange-400 transition "}
          >
            Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
}
