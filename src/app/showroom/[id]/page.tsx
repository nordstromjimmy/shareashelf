import { createSupabaseServerClient } from "@/lib/supabaseServer";
import Showroom from "@/components/Showroom";

export default async function ShowroomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = createSupabaseServerClient();
  const { id } = await params;
  const { data: shelf } = await supabase
    .from("shelves")
    .select("*")
    .eq("id", id)
    .single();

  const { data: bottles } = await supabase
    .from("bottles")
    .select("*")
    .eq("shelf_id", id);

  if (!shelf) {
    return (
      <div className="p-6 text-center text-zinc-400">Shelf not found.</div>
    );
  }

  const topShelfBottles = bottles?.filter((b) => b.top_shelf) ?? [];
  const favoriteBottles =
    bottles?.filter((b) => b.favorite && !b.top_shelf) ?? [];
  const regularBottles =
    bottles?.filter((b) => !b.top_shelf && !b.favorite) ?? [];

  return (
    <Showroom
      topShelfItems={topShelfBottles}
      favoriteItems={favoriteBottles}
      otherItems={regularBottles}
      background={shelf.background_theme ?? "dark_wood"}
      ownerName={shelf.owner_name ?? "Collector"}
      showDetails
    />
  );
}
