// src/app/api/habits/route.ts
import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function GET(request: Request) {
  // 1) Read window from ?window=N (default 7)
  const url = new URL(request.url);
  const windowSize = parseInt(url.searchParams.get("window") ?? "7", 10);

  // 2) Compute date range
  const today = new Date().toISOString().slice(0, 10);         // "YYYY-MM-DD"
  const start = new Date();
  start.setDate(start.getDate() - windowSize + 1);
  const startDate = start.toISOString().slice(0, 10);

  // 3) Fetch habits WITH their entries
  const { data: raw, error } = await supabase
    .from("habits")
    .select(`id, question, entries (value, date)`);
  if (error) return NextResponse.json({ error }, { status: 500 });

  // 4) Build the response
  const habits = raw.map((h) => {
    // only “yes” entries within the window
    const recentYes = h.entries.filter(
      (e: { value: number; date: string }) =>
        e.value === 1 && e.date >= startDate
    );

    return {
      id: h.id,
      question: h.question,
      today: recentYes.some((e: any) => e.date === today),
      count: recentYes.length,
      window: windowSize,
    };
  });

  return NextResponse.json(habits);
}

export async function POST(request: Request) {
  const { question } = await request.json();
  const { data, error } = await supabase
    .from("habits")
    .insert({ question })
    .select("id, question")
    .single();
  if (error) return NextResponse.json({ error }, { status: 500 });

  return NextResponse.json({
    id: data.id,
    question: data.question,
    today: false,
    count: 0,
    window: 7,
  });
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  const { error } = await supabase.from("habits").delete().eq("id", id);
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ success: true });
}
