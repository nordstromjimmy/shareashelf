"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@/lib/supabaseBrowser";
import toast from "react-hot-toast";
import { Eye, EyeOff, CheckCircle } from "lucide-react";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createBrowserClient();

  const getStrength = () => {
    if (password.length > 9) return "strong";
    if (password.length > 6) return "medium";
    if (password.length > 0) return "weak";
    return "";
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      console.error("Update error:", error.message);
      toast.error("Failed to update password.");
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-zinc-900 text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-zinc-800/70 p-8 rounded-xl shadow-xl">
        {success ? (
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500 animate-ping-once" />
            <h2 className="text-2xl font-bold">Password updated!</h2>
            <p className="text-zinc-300">Redirecting you to login...</p>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-6 text-center">
              Set New Password
            </h1>
            <form onSubmit={handleUpdatePassword} className="space-y-6">
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded focus:outline-none focus:ring-2 focus:ring-orange-600"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-3 top-3 text-zinc-400 hover:text-white"
                >
                  {show ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {getStrength() && (
                <div
                  className={`text-sm font-semibold ${
                    getStrength() === "strong"
                      ? "text-green-500"
                      : getStrength() === "medium"
                      ? "text-yellow-400"
                      : "text-red-400"
                  }`}
                >
                  Password strength: {getStrength()}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-600 hover:bg-orange-700 py-3 px-6 rounded-xl text-xl font-semibold transition shadow hover:shadow-orange-600/40 cursor-pointer"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
