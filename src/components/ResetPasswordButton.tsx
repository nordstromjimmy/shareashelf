"use client";

import { createBrowserClient } from "@/lib/supabaseBrowser";
import { useTransition } from "react";
import toast from "react-hot-toast";

export default function ResetPasswordButton() {
  const supabase = createBrowserClient();
  const [isPending, startTransition] = useTransition();

  const handlePasswordReset = () => {
    startTransition(async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || !user.email) {
        toast.error("Unable to find your email.");
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });

      if (error) {
        toast.error("Failed to send reset email.");
      } else {
        toast.success(
          "Password reset email sent! Make sure to check your spam folder"
        );
      }
    });
  };

  return (
    <button
      onClick={handlePasswordReset}
      disabled={isPending}
      className="bg-orange-600 hover:bg-orange-700 py-2 px-6 rounded-lg text-lg font-semibold transition shadow hover:shadow-orange-600/40 cursor-pointer"
    >
      {isPending ? "Sending..." : "Reset Password"}
    </button>
  );
}
