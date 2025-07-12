import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import BottleCard from "@/components/BottleCard";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Settings } from "lucide-react";
import Showroom from "@/components/Showroom";

export default async function ShelfPage({
  params,
}: {
  params: Promise<{ shelfId: string }>;
}) {
  const { shelfId } = await params;

  const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: shelf } = await supabase
    .from("shelves")
    .select("*")
    .eq("id", shelfId)
    .eq("user_id", user.id) // <== super important
    .single();

  if (!shelf) {
    return (
      <div className="p-6 text-center text-zinc-400">
        Shelf not found or you do not have access.
      </div>
    );
  }

  /* const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/s/${shelf.username}`; */

  const { data: bottles } = await supabase
    .from("bottles")
    .select("*")
    .eq("shelf_id", shelf.id)
    .order("top_shelf", { ascending: false })
    .order("created_at", { ascending: false });

  const topShelfBottles = bottles?.filter((b) => b.top_shelf) ?? [];
  const favoriteBottles =
    bottles?.filter((b) => b.favorite && !b.top_shelf) ?? [];
  const regularBottles =
    bottles?.filter((b) => !b.top_shelf && !b.favorite) ?? [];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-zinc-900 text-white px-6 py-12 flex flex-col items-center">
        <div className="w-full max-w-5xl mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center sm:justify-start">
            <h1 className="text-3xl sm:text-4xl font-extrabold">
              {shelf.name}
            </h1>
            <Link
              href={`/edit-shelf/${shelf.id}`}
              className="text-zinc-400 hover:text-orange-400 text-2xl"
              title="Edit shelf"
            >
              <Settings className="w-6 h-6" />
            </Link>
          </div>
          <Link
            href="/new"
            className="bg-orange-600 hover:bg-orange-700 py-2 px-4 text-lg rounded-lg font-semibold transition shadow hover:shadow-orange-600/40"
          >
            Add new bottle
          </Link>
        </div>

        {/* Top shelf section */}
        {topShelfBottles.length > 0 && (
          <>
            <h2 className="text-2xl font-bold mb-4 w-full max-w-5xl text-center sm:text-left">
              Top shelf
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl mb-10">
              {topShelfBottles.map((bottle) => (
                <BottleCard key={bottle.id} bottle={bottle} />
              ))}
            </div>
          </>
        )}

        {/* Favorites section */}
        {favoriteBottles.length > 0 && (
          <>
            <h2 className="text-2xl font-bold mb-4 w-full max-w-5xl text-center sm:text-left">
              Favorites
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl mb-10">
              {favoriteBottles.map((bottle) => (
                <BottleCard key={bottle.id} bottle={bottle} />
              ))}
            </div>
          </>
        )}

        {/* Regular bottles */}
        {regularBottles.length > 0 ? (
          <>
            {(topShelfBottles.length > 0 || favoriteBottles.length > 0) && (
              <h2 className="text-2xl font-bold mb-4 w-full max-w-5xl text-center sm:text-left">
                Other bottles
              </h2>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl mb-10">
              {regularBottles.map((bottle) => (
                <BottleCard key={bottle.id} bottle={bottle} />
              ))}
            </div>
          </>
        ) : (
          topShelfBottles.length === 0 &&
          favoriteBottles.length === 0 && (
            <p className="text-zinc-400 mb-10">
              This shelf has no bottles yet.
            </p>
          )
        )}
      </main>

      <div className="bg-zinc-900 text-white px-6 py-6 flex flex-col items-center">
        <h2 className="text-3xl text-center font-semibold">
          Design and share your showroom below
        </h2>
      </div>
      <Showroom
        topShelfItems={topShelfBottles}
        favoriteItems={favoriteBottles}
        otherItems={regularBottles}
        background={shelf.background_theme ?? "dark_wood"}
        ownerName={shelf.owner_name ?? ""}
        username={shelf.username ?? ""}
        customizable
        allowViewToggle
        shelfId={shelf.id}
      />
    </>
  );
}
