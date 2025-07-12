import { createSupabaseServerClient } from "@/lib/supabaseServer";
import Showroom from "@/components/Showroom";
import Link from "next/link";

export default async function ShelfByUsernamePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const supabase = createSupabaseServerClient();

  // Fetch shelf by username
  const { data: shelf } = await supabase
    .from("shelves")
    .select("*")
    .eq("username", username)
    .single();

  if (!shelf) {
    return (
      <main className="min-h-screen bg-zinc-900 text-white flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Shelf not found</h1>
          <p className="text-zinc-400">
            The shelf for <span className="text-orange-400">{username}</span>{" "}
            does not exist.
          </p>
        </div>
      </main>
    );
  }

  // Fetch bottles for that shelf
  const { data: bottles } = await supabase
    .from("bottles")
    .select("*")
    .eq("shelf_id", shelf.id);

  const topShelfBottles = bottles?.filter((b) => b.top_shelf) ?? [];
  const favoriteBottles =
    bottles?.filter((b) => b.favorite && !b.top_shelf) ?? [];
  const regularBottles =
    bottles?.filter((b) => !b.top_shelf && !b.favorite) ?? [];

  return (
    <>
      {/* Hero section above showroom */}
      <div className="bg-zinc-900 text-white py-8 px-6 flex flex-col items-center">
        <h1 className="text-3xl font-extrabold mb-4">
          Explore this collection
        </h1>
        <p className="text-zinc-400 mb-6 text-center max-w-2xl">
          Want to build your own digital shelf and share your whiskey, rum, or
          any collection? <br />
          It only takes a minute.
        </p>
        <Link
          href="/register"
          className="bg-orange-600 hover:bg-orange-700 py-3 px-4 rounded-lg text-lg font-semibold transition shadow hover:shadow-orange-600/40"
        >
          Create your own shelf
        </Link>
      </div>
      <Showroom
        topShelfItems={topShelfBottles}
        favoriteItems={favoriteBottles}
        otherItems={regularBottles}
        background={shelf.background_theme ?? "dark_wood"}
        ownerName={shelf.owner_name ?? "Collector"}
        allowViewToggle
        showDetails
      />
      <div className="bg-zinc-900 text-white py-8 px-6 flex flex-col items-center">
        <h1 className="text-3xl font-extrabold mb-4">
          Explore this collection
        </h1>
        <p className="text-zinc-400 mb-6 text-center max-w-2xl">
          Want to build your own digital shelf and share your whiskey, rum, or
          any collection? <br />
          It only takes a minute.
        </p>
        <Link
          href="/register"
          className="bg-orange-600 hover:bg-orange-700 py-3 px-4 rounded-lg text-lg font-semibold transition shadow hover:shadow-orange-600/40"
        >
          Create your own shelf
        </Link>
      </div>
    </>
  );
}
