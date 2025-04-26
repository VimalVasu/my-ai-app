"use client";
import { Switch } from "@/components/ui/switch";  // shadcn switch once generated
import { useState } from "react";

export default function Card({
  question = "Did you run this morning?",
  initialYes = false,
  stat = "You ran 5 of the last 7 days",
}) {
  const [yes, setYes] = useState(initialYes);

  return (
    <div className="rounded-2xl shadow p-6 bg-white w-full max-w-sm">
      <div className="flex items-start justify-between">
        <p className="font-medium">{question}</p>
        <Switch checked={yes} onCheckedChange={setYes} />
      </div>

      <div className="mt-4 text-sm text-muted-foreground">{stat}</div>
    </div>
  );
}
