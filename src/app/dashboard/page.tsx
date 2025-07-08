import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { LogoutButton } from "@/components/Logoutbutton";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ResetToast from "@/components/ResetToast";
import ResetPasswordButton from "@/components/ResetPasswordButton";

export default async function DashboardPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch their shelf
  const { data: shelf, error } = await supabase
    .from("shelves")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error && error.code !== "PGRST116") {
    throw new Error(error.message);
  }

  // Determine if signed in with Google
  const isGoogleUser = user.app_metadata?.provider === "google";

  return (
    <>
      <ResetToast />
      <Navbar />
      <main className="min-h-screen bg-zinc-900 text-white p-8 flex flex-col items-center">
        {/* Shelf section */}
        <div className="w-full max-w-2xl bg-zinc-800/60 rounded-xl p-6 mb-10 shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Your Shelf</h2>

          {!shelf ? (
            <>
              <p className="text-zinc-400 mb-6">
                You don’t have a shelf yet. Create your first one below.
              </p>
              <form
                action="/api/create-shelf"
                method="POST"
                className="space-y-4"
              >
                <input
                  type="text"
                  name="name"
                  placeholder="Shelf name"
                  required
                  className="block w-full p-3 bg-zinc-900 border border-zinc-700 rounded"
                />
                <button
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-700 py-3 px-6 rounded-xl text-xl font-semibold transition shadow cursor-pointer"
                >
                  Create your shelf
                </button>
              </form>
            </>
          ) : (
            <>
              <p className="text-zinc-400 mb-6">
                You have a shelf named{" "}
                <span className="text-orange-400">{shelf.name}</span>.
              </p>
              <Link
                href={`/shelf/${shelf.id}`}
                className="bg-orange-600 hover:bg-orange-700 py-3 px-8 rounded-xl text-xl font-semibold transition shadow hover:shadow-orange-600/40"
              >
                View your shelf
              </Link>
            </>
          )}
        </div>
        {/* Profile section */}
        <div className="w-full max-w-2xl bg-zinc-800/60 rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Profile</h2>
          <p className="mb-2">
            <span className="font-semibold">Email:</span> {user.email}
          </p>
          <p className="mb-6">
            <span className="font-semibold">Provider:</span>{" "}
            {isGoogleUser ? "Google" : "Email / Password"}
          </p>
          <p className="mb-6">
            <span className="font-semibold">Account created:</span>{" "}
            {new Date(user.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          {!isGoogleUser && <ResetPasswordButton />}

          <div className="mt-6">
            <LogoutButton />
          </div>
        </div>
      </main>
    </>
  );
}
