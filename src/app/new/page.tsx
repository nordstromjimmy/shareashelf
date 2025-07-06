"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseBrowser";

export default function NewBottlePage() {
  const router = useRouter();
  const [shelfId, setShelfId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Common fields
  const [name, setName] = useState("");
  const [distillery, setDistillery] = useState("");
  const [vintage, setVintage] = useState("");
  const [notes, setNotes] = useState("");

  // More details
  const [abv, setAbv] = useState<number | "">("");
  const [bottleSize, setBottleSize] = useState<number | "">("");
  const [region, setRegion] = useState("");
  const [caskType, setCaskType] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [bottlingYear, setBottlingYear] = useState<number | "">("");
  const [pricePaidValue, setPricePaidValue] = useState<number | "">("");
  const [pricePaidCurrency, setPricePaidCurrency] = useState<string | "">("");
  const [rating, setRating] = useState<number | "">("");
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    const loadShelf = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data: shelf } = await supabase
        .from("shelves")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (!shelf) {
        setErrorMsg("No shelf found. Please create one first.");
      } else {
        setShelfId(shelf.id);
      }
    };
    loadShelf();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shelfId) {
      setErrorMsg("No shelf selected.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("bottles").insert({
        shelf_id: shelfId,
        name,
        distillery,
        vintage,
        notes,
        image_url: "/bottle.png",
        abv: abv === "" ? null : abv,
        bottle_size: bottleSize === "" ? null : bottleSize,
        region,
        cask_type: caskType,
        age: age === "" ? null : age,
        bottling_year: bottlingYear === "" ? null : bottlingYear,
        price_paid_value: pricePaidValue === "" ? null : pricePaidValue,
        price_paid_currency:
          pricePaidCurrency === "" ? null : pricePaidCurrency,
        rating: rating === "" ? null : rating,
        favorite,
      });

      if (error) throw error;

      router.push(`/shelf/${shelfId}`);
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-900 text-white px-6 py-12 flex flex-col items-center">
      <h1 className="text-3xl font-extrabold mb-6">Add a new bottle</h1>

      {errorMsg && <p className="text-red-500 mb-4">{errorMsg}</p>}

      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
        {/* Primary fields */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full p-3 bg-zinc-800 border border-zinc-700 rounded"
            required
          />
          <input
            type="text"
            placeholder="Distillery"
            value={distillery}
            onChange={(e) => setDistillery(e.target.value)}
            className="block w-full p-3 bg-zinc-800 border border-zinc-700 rounded"
          />
          <input
            type="text"
            placeholder="Vintage"
            value={vintage}
            onChange={(e) => setVintage(e.target.value)}
            className="block w-full p-3 bg-zinc-800 border border-zinc-700 rounded"
          />
          <textarea
            placeholder="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="block w-full p-3 bg-zinc-800 border border-zinc-700 rounded"
            rows={3}
          />
        </div>

        {/* More details */}
        <div className="pt-6 mt-6 border-t border-zinc-700 space-y-4">
          <h2 className="text-xl font-bold mb-2">Additional details</h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              step="0.1"
              placeholder="ABV (%)"
              value={abv}
              onChange={(e) =>
                setAbv(e.target.value === "" ? "" : parseFloat(e.target.value))
              }
              className="p-3 bg-zinc-800 border border-zinc-700 rounded"
            />
            <input
              type="number"
              placeholder="Size (ml)"
              value={bottleSize}
              onChange={(e) =>
                setBottleSize(
                  e.target.value === "" ? "" : parseInt(e.target.value)
                )
              }
              className="p-3 bg-zinc-800 border border-zinc-700 rounded"
            />
            <input
              type="text"
              placeholder="Region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="p-3 bg-zinc-800 border border-zinc-700 rounded"
            />
            <input
              type="text"
              placeholder="Cask type"
              value={caskType}
              onChange={(e) => setCaskType(e.target.value)}
              className="p-3 bg-zinc-800 border border-zinc-700 rounded"
            />
            <input
              type="number"
              placeholder="Age"
              value={age}
              onChange={(e) =>
                setAge(e.target.value === "" ? "" : parseInt(e.target.value))
              }
              className="p-3 bg-zinc-800 border border-zinc-700 rounded"
            />
            <input
              type="number"
              placeholder="Bottling year"
              value={bottlingYear}
              onChange={(e) =>
                setBottlingYear(
                  e.target.value === "" ? "" : parseInt(e.target.value)
                )
              }
              className="p-3 bg-zinc-800 border border-zinc-700 rounded"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Price paid"
              value={pricePaidValue}
              onChange={(e) =>
                setPricePaidValue(
                  e.target.value === "" ? "" : parseFloat(e.target.value)
                )
              }
              className="p-3 bg-zinc-800 border border-zinc-700 rounded"
            />
            <input
              type="text"
              placeholder="Currency (e.g. SEK, USD)"
              value={pricePaidCurrency}
              onChange={(e) => setPricePaidCurrency(e.target.value)}
              className="p-3 bg-zinc-800 border border-zinc-700 rounded"
            />
            <input
              type="number"
              min="0"
              max="100"
              placeholder="Rating"
              value={rating}
              onChange={(e) =>
                setRating(e.target.value === "" ? "" : parseInt(e.target.value))
              }
              className="p-3 bg-zinc-800 border border-zinc-700 rounded"
            />
          </div>
          <label className="inline-flex items-center mt-2">
            <input
              type="checkbox"
              checked={favorite}
              onChange={(e) => setFavorite(e.target.checked)}
              className="mr-2"
            />
            <span className="text-zinc-300">Mark as favorite ⭐</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-600 hover:bg-orange-700 py-3 px-6 rounded-xl text-xl font-semibold transition shadow hover:shadow-orange-600/40"
        >
          {loading ? "Saving..." : "Save bottle"}
        </button>
      </form>
    </main>
  );
}
