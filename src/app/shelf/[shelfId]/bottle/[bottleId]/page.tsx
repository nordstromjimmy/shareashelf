import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Star } from "lucide-react";

export default async function BottleDetailsPage({
  params,
}: {
  params: Promise<{ shelfId: string; bottleId: string }>;
}) {
  const { bottleId, shelfId } = await params;
  const supabase = createSupabaseServerClient();

  // Fetch bottle
  const { data: bottle } = await supabase
    .from("bottles")
    .select("*")
    .eq("id", bottleId)
    .single();

  if (!bottle || bottle.shelf_id !== shelfId) notFound();

  return (
    <main className="min-h-screen bg-zinc-900 text-white px-6 py-12 flex flex-col items-center">
      <div className="max-w-2xl w-full">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <Link
            href={`/shelf/${shelfId}`}
            className="text-orange-400 hover:text-orange-500"
          >
            ← Back to shelf
          </Link>
          <Link
            href={`/edit/${bottle.id}`}
            className="inline-block bg-orange-600 hover:bg-orange-700 py-2 px-6 rounded-xl text-lg font-semibold transition shadow hover:shadow-orange-600/40"
          >
            Edit bottle
          </Link>
        </div>

        <div className="bg-zinc-800 p-6 rounded-xl shadow mb-6">
          <img
            src={bottle.image_url || "/bottle.png"}
            alt={bottle.name}
            className="w-full h-80 object-contain mb-6 rounded"
          />

          <h1 className="text-3xl font-extrabold mb-2 flex items-center gap-2">
            {bottle.name}

            {bottle.favorite && (
              <span className="text-yellow-400 text-2xl">
                <Star className="w-5 h-5 fill-yellow-400" />
              </span>
            )}
          </h1>

          <div className="space-y-1 text-zinc-400">
            {bottle.distillery && <p>Distillery: {bottle.distillery}</p>}
            {bottle.vintage && <p>Vintage: {bottle.vintage}</p>}
            {bottle.region && <p>Region: {bottle.region}</p>}
            {bottle.cask_type && <p>Cask type: {bottle.cask_type}</p>}
            {bottle.age && <p>Age: {bottle.age} years</p>}
            {bottle.abv && <p>ABV: {bottle.abv}%</p>}
            {bottle.bottle_size && <p>Bottle size: {bottle.bottle_size}ml</p>}
            {bottle.bottling_year && (
              <p>Bottling year: {bottle.bottling_year}</p>
            )}
            {bottle.price_paid_value && (
              <p>
                Price paid: {bottle.price_paid_value}{" "}
                {bottle.price_paid_currency}
              </p>
            )}
            {bottle.rating && (
              <p className="text-orange-400">Rating: {bottle.rating}/100</p>
            )}
          </div>

          {bottle.notes && (
            <div className="mt-6">
              <h2 className="text-xl font-bold mb-2">Notes</h2>
              <p className="text-zinc-300 whitespace-pre-line">
                {bottle.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
