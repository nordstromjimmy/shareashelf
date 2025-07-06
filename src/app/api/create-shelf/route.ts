import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export async function POST(request: Request) {
  const supabase = createSupabaseServerClient();
  const form = await request.formData();
  const name = form.get("name");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  await supabase.from("shelves").insert({
    name,
    user_id: user.id,
  });

  return NextResponse.redirect(new URL("/dashboard", request.url));
}
