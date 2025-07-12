// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-zinc-900 text-white px-6">
      <h1 className="text-5xl font-bold mb-6 text-amber-400 drop-shadow">
        404 - Page Not Found
      </h1>
      <p className="text-lg text-zinc-300 mb-8 text-center max-w-md">
        Oops! Looks like this page doesn’t exist.
      </p>
      <Link
        href="/"
        className="bg-amber-600 hover:bg-amber-700 text-zinc-900 font-semibold py-3 px-8 rounded-lg shadow hover:shadow-amber-600/40 transition"
      >
        Go back home
      </Link>
    </main>
  );
}
