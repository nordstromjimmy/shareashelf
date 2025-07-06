"use client";
import { supabase } from "@/lib/supabaseBrowser";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <button
      onClick={logout}
      className="text-md text-orange-200 hover:underline cursor-pointer"
    >
      Logout
    </button>
  );
}
