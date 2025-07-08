"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ResetToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const resetSent = searchParams?.get("reset") === "sent";

  useEffect(() => {
    if (resetSent) {
      toast.success("A password reset link has been sent to your email.");

      // clean up the URL so toast doesn’t show again on refresh
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("reset");
      router.replace(`?${newParams.toString()}`, { scroll: false });
    }
  }, [resetSent, searchParams, router]);

  return null;
}
