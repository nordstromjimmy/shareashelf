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

  // fetch the shelf, ensure it's owned by this user
  const { data: shelf, error } = await supabase
    .from("shelves")
    .select("*")
    .eq("id", shelfId)
    .eq("user_id", user.id) // 👈 this is critical
    .single();

  if (!shelf) {
    // either because no shelf or it's not theirs
    notFound();
  }

  // then load the bottle, or whatever
  const { data: bottle } = await supabase
    .from("bottles")
    .select("*")
    .eq("id", bottleId)
    .eq("shelf_id", shelfId) // just to be safe
    .single();

  if (!bottle) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-zinc-900 text-white px-6 py-12 flex flex-col items-center">
      <h1 className="text-3xl font-extrabold mb-6">Edit bottle</h1>
      <EditBottleForm bottle={bottle} />
    </main>
  );
}
