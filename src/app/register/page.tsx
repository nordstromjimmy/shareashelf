"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { createBrowserClient } from "@/lib/supabaseBrowser";
import Link from "next/link";

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    const supabase = createBrowserClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  const handleSignUp = async () => {
    const supabase = createBrowserClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      setErrorMsg(error.message);
    } else {
      router.refresh();
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-900 px-4 py-8">
      <Link href="/">
        <Image
          src="/logo.png"
          className="mx-auto mb-8 transition-transform duration-300 hover:scale-105"
          width={160}
          height={160}
          alt="TopShelfy logo"
        />
      </Link>
      <div className="w-full max-w-md bg-zinc-800/60 backdrop-blur-md rounded-xl p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-8">
          Create a free account
        </h1>

        <button
          onClick={handleGoogleSignIn}
          className="flex items-center justify-center gap-3 bg-white text-zinc-900 font-semibold py-3 px-6 rounded-lg hover:bg-zinc-100 transition w-full mb-6 shadow cursor-pointer"
        >
          <Image src="/google-icon.svg" alt="Google" width={24} height={24} />
          Sign in with Google
        </button>

        <div className="text-center text-zinc-400 mb-6">or use your email</div>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded bg-zinc-800 border border-zinc-700 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-600"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded bg-zinc-800 border border-zinc-700 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-600"
          />
        </div>
        {errorMsg && (
          <div className="text-red-500 mb-4 mt-4 text-center">{errorMsg}</div>
        )}
        <button
          onClick={handleSignUp}
          className="mt-6 w-full bg-orange-600 hover:bg-orange-700 py-3 px-6 rounded-lg text-xl font-semibold transition shadow cursor-pointer"
        >
          Create account
        </button>
        <div className="mt-6 text-center text-zinc-400">
          Already registered?{" "}
          <a
            href="/login"
            className="text-orange-400 hover:text-orange-500 font-semibold"
          >
            Log in
          </a>
        </div>
      </div>
    </div>
  );
}
