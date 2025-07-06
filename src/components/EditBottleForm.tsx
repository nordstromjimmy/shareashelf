"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseBrowser";
import type { Bottle } from "@/types/bottle";
import ConfirmModal from "./ConfirmModal";

export default function EditBottleForm({ bottle }: { bottle: Bottle }) {
  const router = useRouter();
  const [name, setName] = useState(bottle.name);
  const [distillery, setDistillery] = useState(bottle.distillery ?? "");
  const [vintage, setVintage] = useState(bottle.vintage ?? "");
  const [notes, setNotes] = useState(bottle.notes ?? "");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMsg(null);

    try {
      const { error } = await supabase
        .from("bottles")
        .update({
          name,
          distillery,
          vintage,
          notes,
        })
        .eq("id", bottle.id);

      if (error) {
        console.error("Update error:", error);
        throw error;
      }

      router.refresh(); // revalidate server data
      router.push(`/shelf/${bottle.shelf_id}`);
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong.");
    } finally {
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("bottles")
        .delete()
        .eq("id", bottle.id);

      if (error) {
        console.error("Delete error:", error);
        throw error;
      }

      router.refresh();
      router.push(`/shelf/${bottle.shelf_id}`);
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong.");
    } finally {
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
      {errorMsg && <p className="text-red-500">{errorMsg}</p>}

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
        className="w-full bg-orange-600 hover:bg-orange-700 py-3 px-6 rounded-xl text-xl font-semibold transition shadow hover:shadow-orange-600/40"
      >
        Save changes
      </button>
      <ConfirmModal
        title="Delete bottle"
        message="Are you sure you want to delete this bottle?"
        onConfirm={handleDelete}
      >
        <button
          type="button"
          className="w-full bg-red-600 hover:bg-red-700 py-3 px-6 rounded-xl text-xl font-semibold transition shadow hover:shadow-red-600/40"
        >
          Delete bottle
        </button>
      </ConfirmModal>
    </form>
  );
}
