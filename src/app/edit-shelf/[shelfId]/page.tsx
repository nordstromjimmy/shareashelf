import EditShelfForm from "@/components/EditShelfForm";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { notFound } from "next/navigation";

export default async function EditShelfPage({
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

  return (
    <main className="min-h-screen bg-zinc-900 text-white px-6 py-12 flex flex-col items-center">
      <h1 className="text-3xl font-extrabold mb-6">Edit shelf</h1>
      <EditShelfForm shelf={shelf} />
    </main>
  );
}
