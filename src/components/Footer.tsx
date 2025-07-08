"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-zinc-900 text-zinc-400 py-6 border-t border-zinc-700">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
        {/* Left: copyright */}
        <p className="text-sm">
          &copy; {new Date().getFullYear()} topshelfy.com - All rights reserved.
        </p>

        {/* Center: image */}
        <div className="flex-shrink-0">
          <Image
            src="/navlogo.png" // your logo or bottle image here
            alt="TopShelfy Logo"
            width={48}
            height={48}
            className="opacity-80 hover:opacity-100 transition"
          />
        </div>

        {/* Right: links */}
        <div className="flex space-x-6">
          <Link href="/contact" className="hover:text-orange-400 transition">
            Contact
          </Link>
          <Link href="/privacy" className="hover:text-orange-400 transition">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-orange-400 transition">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
