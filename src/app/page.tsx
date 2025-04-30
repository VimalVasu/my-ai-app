// src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import Card from "@/app/(components)/Card";

interface Habit {
  id: number;
  question: string;
  today: boolean;
  count: number;
  window: number;
}

export default function Home() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  // Fetch habits with a given window; default to 1 on first load
  const fetchHabits = async (windowSize = 1) => {
    const res = await fetch(`/api/habits?window=${windowSize}`);
    const data: Habit[] = await res.json();
    setHabits(data);
  };

  useEffect(() => {
    fetchHabits(1).then(() => setLoading(false));
  }, []);

  const handleAddSave = async (question: string): Promise<void> => {
    const res = await fetch("/api/habits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    const newHabit: Habit = await res.json();
    setHabits((prev) => [...prev, newHabit]);
    setAdding(false);
  };

  const handleAddCancel = (): void => {
    setAdding(false);
  };

  // Now include windowSize so we can re-fetch with the same period
  const handleToggle = async (
    id: number,
    yes: boolean,
    windowSize: number
  ): Promise<void> => {
    await fetch("/api/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ habitId: id, value: yes ? 1 : 0 }),
    });
    await fetchHabits(windowSize);
  };

  const handleWindowChange = async (
    id: number,
    windowSize: number
  ): Promise<void> => {
    // Just re-fetch with the new window for all cards
    await fetchHabits(windowSize);
  };

  const handleDelete = async (id: number): Promise<void> => {
    await fetch("/api/habits", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  if (loading) return <div>Loading…</div>;

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Habit Glance</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {habits.map((h) => (
          <Card
            key={h.id}
            question={h.question}
            initialYes={h.today}
            statCount={h.count}
            initialPeriod={h.window}
            // pass the card's current window so toggle knows which window to re-fetch
            onToggle={(yes) => handleToggle(h.id, yes, h.window)}
            onPeriodChange={(win) => handleWindowChange(h.id, win)}
            onDelete={() => handleDelete(h.id)}
          />
        ))}

        {adding ? (
          <Card
            isNew
            editing
            onSave={handleAddSave}
            onCancel={handleAddCancel}
          />
        ) : (
          <Card isNew onClick={() => setAdding(true)} />
        )}
      </div>
    </div>
  );
}
