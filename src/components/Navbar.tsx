"use client";

import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="w-full bg-zinc-900 border-b border-zinc-700 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/navlogo.png"
            alt="TopShelfy logo"
            width={32}
            height={32}
            className="transition-transform group-hover:scale-110"
          />
          <span className="text-2xl font-bold text-orange-500 group-hover:text-orange-600">
            TopShelfy.com
          </span>
        </Link>

        <div className="flex items-center gap-6 text-lg">
          <Link href="/dashboard" className="hover:text-orange-400 transition">
            Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
}
