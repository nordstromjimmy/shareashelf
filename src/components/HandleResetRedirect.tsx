"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HandleResetRedirect() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) {
      router.replace(`/auth/update-password?code=${code}`);
    }
  }, [router]);

  return null;
}
