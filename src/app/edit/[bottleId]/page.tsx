import EditBottleForm from "@/components/EditBottleForm";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { notFound } from "next/navigation";

export default async function EditBottlePage({
  params,
}: {
  params: Promise<{ bottleId: string }>;
}) {
  const supabase = createSupabaseServerClient();
  const { bottleId } = await params;

  const { data: bottle } = await supabase
    .from("bottles")
    .select("*")
    .eq("id", bottleId)
    .single();

  if (!bottle) notFound();

  return (
    <main className="min-h-screen bg-zinc-900 text-white px-6 py-12 flex flex-col items-center">
      <h1 className="text-3xl font-extrabold mb-6">Edit bottle</h1>
      <EditBottleForm bottle={bottle} />
    </main>
  );
}
