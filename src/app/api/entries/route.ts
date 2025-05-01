// src/app/api/entries/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

export async function POST(request: Request) {
  const supabase = createClient();
  const { habitId, value } = await request.json();
  const today = new Date().toISOString().slice(0, 10);

  // Use onConflict as a comma-separated string, not an array
  const { error } = await supabase
    .from("entries")
    .upsert(
      { habit_id: habitId, date: today, value },
      { onConflict: "habit_id,date" }    // ← string, not string[]
    );

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
