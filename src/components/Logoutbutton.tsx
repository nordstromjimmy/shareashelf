"use client";
import { createBrowserClient } from "@/lib/supabaseBrowser";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createBrowserClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <button
      onClick={logout}
      className="bg-orange-600 hover:bg-orange-700 py-2 px-4 text-lg rounded-lg font-semibold transition shadow hover:shadow-orange-600/40 cursor-pointer"
    >
      Logout
    </button>
  );
}
