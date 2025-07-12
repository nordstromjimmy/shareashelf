import EditBottleForm from "@/components/EditBottleForm";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { notFound, redirect } from "next/navigation";

export default async function EditBottlePage({
  params,
}: {
  params: Promise<{ bottleId: string; shelfId: string }>;
}) {
  const supabase = createSupabaseServerClient();
  const { bottleId, shelfId } = await params;

  // get signed in user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const { data: bottle } = await supabase
    .from("bottles")
    .select(
      `
      *,
      shelf:shelf_id ( user_id )
    `
    )
    .eq("id", bottleId)
    .single();

  if (!bottle || bottle.shelf.user_id !== user.id) {
    notFound();
  }
  return (
    <main className="min-h-screen bg-zinc-900 text-white px-6 py-12 flex flex-col items-center">
      <h1 className="text-3xl font-extrabold mb-6">Edit bottle</h1>
      <EditBottleForm bottle={bottle} />
    </main>
  );
}
