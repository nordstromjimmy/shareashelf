import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  try {
    await supabase.auth.getSession();
  } catch (error) {
    console.error("Auth middleware failed:", error);
    // fallback, e.g. clear cookies or redirect if needed
  }

  return res;
}
