import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { LogoutButton } from "@/components/Logoutbutton";
import Link from "next/link";
import Navbar from "@/components/Navbar";

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
    // no rows found
    throw new Error(error.message);
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-zinc-900 text-white p-8 flex flex-col items-center">
        <h1 className="text-xl font-extrabold mb-6">Signed in, {user.email}</h1>
        <LogoutButton />

        {!shelf ? (
          <>
            <p className="text-zinc-400 mb-6">You don’t have a shelf yet.</p>
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
                className="block w-full p-3 bg-zinc-800 border border-zinc-700 rounded"
              />
              <button
                type="submit"
                className="bg-orange-600 hover:bg-orange-700 py-3 px-6 rounded-xl text-xl font-semibold transition shadow"
              >
                Create your shelf
              </button>
            </form>
          </>
        ) : (
          <>
            <p className="text-zinc-400 mb-8">
              You have a shelf named{" "}
              <span className="text-orange-400">{shelf.name}</span>.
            </p>
            <Link
              href={`/shelf/${shelf.id}`}
              className="bg-orange-600 hover:bg-orange-700 py-3 px-8 rounded-xl text-xl font-semibold transition shadow"
            >
              View your shelf
            </Link>
          </>
        )}
      </main>
    </>
  );
}
