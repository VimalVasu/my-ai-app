// src/app/api/habits/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

// Typed shape for each joined entry
type Entry = { value: number; date: string };

// Typed shape for each habit row including its entries
type HabitWithEntries = {
  id: number;
  question: string;
  entries: Entry[];
};

export async function GET(request: Request) {
  const supabase = createClient();
  
  // 1) Read window size from ?window=N (default 7)
  const url = new URL(request.url);
  const windowSize = parseInt(url.searchParams.get("window") ?? "7", 10);

  // 2) Compute today and the start date
  const today = new Date().toISOString().slice(0, 10);
  const start = new Date();
  start.setDate(start.getDate() - windowSize + 1);
  const startDate = start.toISOString().slice(0, 10);

  // 3) Fetch habits + their entries
  const { data: rawData, error } = await supabase
    .from("habits")
    .select("id, question, entries (value, date)");

  if (error || !rawData) {
    return NextResponse.json(
      { error: error?.message ?? "Unknown error" },
      { status: 500 }
    );
  }

  // 4) Cast and map into the UI shape
  const typedData = rawData as HabitWithEntries[];
  const habits = typedData.map((h) => {
    // only "yes" entries within our window
    const recentYes = h.entries.filter(
      (entry: Entry) =>
        entry.value === 1 && entry.date >= startDate
    );

    return {
      id: h.id,
      question: h.question,
      today: recentYes.some((entry: Entry) => entry.date === today),
      count: recentYes.length,
      window: windowSize,
    };
  });

  return NextResponse.json(habits);
}

export async function POST(request: Request) {
  const supabase = createClient();
  const { question } = await request.json();
  const { data, error } = await supabase
    .from("habits")
    .insert({ question })
    .select("id, question")
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message ?? "Insert failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    id: data.id,
    question: data.question,
    today: false,
    count: 0,
    window: 7,
  });
}

export async function DELETE(request: Request) {
  const supabase = createClient();
  const { id } = await request.json();
  const { error } = await supabase
    .from("habits")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
