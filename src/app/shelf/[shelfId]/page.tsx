import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { notFound } from "next/navigation";
import BottleCard from "@/components/BottleCard";
import { Bottle } from "@/types/bottle";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default async function ShelfPage({
  params,
}: {
  params: Promise<{ shelfId: string }>;
}) {
  const { shelfId } = await params;

  const supabase = createSupabaseServerClient();

  const { data: shelf } = await supabase
    .from("shelves")
    .select("*")
    .eq("id", shelfId)
    .single();

  if (!shelf) notFound();

  const { data: bottles } = await supabase
    .from("bottles")
    .select("*")
    .eq("shelf_id", shelf.id)
    .order("created_at", { ascending: false });

  bottles as Bottle[];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-zinc-900 text-white px-6 py-12 flex flex-col items-center">
        <div className="w-full max-w-5xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold">
              {shelf.name}
            </h1>
            <Link
              href={`/edit-shelf/${shelf.id}`}
              className="text-zinc-400 hover:text-orange-400 text-2xl"
              title="Edit shelf"
            >
              ✏️
            </Link>
          </div>
          <Link
            href="/new"
            className="bg-orange-600 hover:bg-orange-700 py-2 px-6 rounded-xl text-lg font-semibold transition shadow hover:shadow-orange-600/40"
          >
            ➕ Add new bottle
          </Link>
        </div>

        {bottles && bottles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl">
            {bottles.map((bottle) => (
              <BottleCard key={bottle.id} bottle={bottle} />
            ))}
          </div>
        ) : (
          <p className="text-zinc-400">This shelf has no bottles yet.</p>
        )}
      </main>
    </>
  );
}
