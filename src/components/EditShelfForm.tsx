"use client";
import ConfirmModal from "@/components/ConfirmModal";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createBrowserClient } from "@/lib/supabaseBrowser";

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
    const supabase = createBrowserClient();
    try {
      const { error } = await supabase
        .from("shelves")
        .update({ name })
        .eq("id", shelf.id);

      if (error) throw error;

      router.push(`/shelf/${shelf.id}`);
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Something went wrong.");
      }
    }
  };

  const handleDelete = async () => {
    const supabase = createBrowserClient();
    try {
      const { error } = await supabase
        .from("shelves")
        .delete()
        .eq("id", shelf.id);

      if (error) throw error;

      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Something went wrong.");
      }
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
      <ConfirmModal
        onConfirm={handleDelete}
        title="Delete shelf"
        message="Are you sure you want to delete this shelf? All bottles inside will also be deleted."
      >
        <button
          type="button"
          className="w-full bg-red-600 hover:bg-red-700 py-3 px-6 mb-4 rounded-xl text-xl font-semibold transition shadow hover:shadow-red-600/40 cursor-pointer"
        >
          Delete shelf
        </button>
      </ConfirmModal>
      <button
        type="submit"
        className="w-full bg-orange-600 hover:bg-orange-700 py-3 px-6 rounded-xl text-xl font-semibold transition shadow hover:shadow-orange-600/40 cursor-pointer"
      >
        Save changes
      </button>
    </form>
  );
}
