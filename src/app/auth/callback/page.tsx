"use client";
import { createBrowserClient } from "@/lib/supabaseBrowser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthCallback() {
  useEffect(() => {
    const router = useRouter();

    const handleRedirect = async () => {
      const supabase = createBrowserClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        router.push("/dashboard");
      } else {
        router.push("/login?error=oauth-failed");
      }
    };

    handleRedirect();
  }, []);

  return <p className="text-white text-center mt-10">Signing in...</p>;
}
