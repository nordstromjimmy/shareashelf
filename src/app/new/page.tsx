"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseBrowser";

export default function NewBottlePage() {
  const router = useRouter();
  const [shelfId, setShelfId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [distillery, setDistillery] = useState("");
  const [vintage, setVintage] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
      <h1 className="text-3xl font-extrabold mb-6">Add a new bottle 🥃</h1>

      {errorMsg && <p className="text-red-500 mb-4">{errorMsg}</p>}

      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
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
          rows={4}
        />
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
