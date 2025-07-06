"use client";
import ConfirmModal from "@/components/ConfirmModal";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabaseBrowser";

export default function EditShelfForm({
  shelf,
}: {
  shelf: { id: string; name: string };
}) {
  const router = useRouter();
  const [name, setName] = useState(shelf.name);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from("shelves")
        .update({ name })
        .eq("id", shelf.id);

      if (error) throw error;

      router.push(`/shelf/${shelf.id}`);
      router.refresh();
    } catch (err: any) {
      console.error("Update error:", err);
      setErrorMsg(err.message || "Something went wrong.");
    } finally {
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("shelves")
        .delete()
        .eq("id", shelf.id);

      if (error) throw error;

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      console.error("Delete error:", err);
      setErrorMsg(err.message || "Something went wrong.");
    } finally {
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
      {errorMsg && <p className="text-red-500">{errorMsg}</p>}

      <input
        type="text"
        placeholder="Shelf name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="block w-full p-3 bg-zinc-800 border border-zinc-700 rounded"
        required
      />
      <button
        type="submit"
        className="w-full bg-orange-600 hover:bg-orange-700 py-3 px-6 rounded-xl text-xl font-semibold transition shadow hover:shadow-orange-600/40 cursor-pointer"
      >
        Save changes
      </button>
      <ConfirmModal
        onConfirm={handleDelete}
        title="Delete shelf"
        message="Are you sure you want to delete this shelf? All bottles inside will also be deleted."
      >
        <button
          type="button"
          className="w-full bg-red-600 hover:bg-red-700 py-3 px-6 rounded-xl text-xl font-semibold transition shadow hover:shadow-red-600/40 cursor-pointer"
        >
          Delete shelf
        </button>
      </ConfirmModal>
    </form>
  );
}
