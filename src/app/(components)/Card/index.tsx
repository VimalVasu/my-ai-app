// src/app/(components)/Card/index.tsx
"use client";

import { Switch } from "@/components/ui/switch";
import { useState, useEffect, KeyboardEvent } from "react";

export interface CardProps {
  question?: string;
  initialYes?: boolean;
  statCount?: number;
  initialPeriod?: number;
  isNew?: boolean;
  editing?: boolean;
  onClick?: () => void;
  onSave?: (question: string) => void;
  onCancel?: () => void;
  onToggle?: (yes: boolean) => Promise<void>;
  onPeriodChange?: (win: number) => void;
  onDelete?: () => void;
}

export default function Card({
  question = "",
  initialYes = false,
  statCount = 0,
  initialPeriod = 1,
  isNew = false,
  editing = false,
  onClick,
  onSave,
  onCancel,
  onToggle,
  onPeriodChange,
  onDelete,
}: CardProps) {
  const [yes, setYes] = useState(initialYes);
  const [period, setPeriod] = useState(initialPeriod);
  const [draft, setDraft] = useState(question);

  useEffect(() => {
    setDraft(question);
  }, [question]);

  // 1) NEW-CARD “INPUT” MODE
  if (isNew && editing) {
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && draft.trim()) {
        onSave?.(draft.trim());
      }
      if (e.key === "Escape") {
        onCancel?.();
      }
    };

    return (
      <div className="rounded-2xl shadow p-6 bg-white w-full max-w-sm">
        <div className="flex items-center space-x-2">
          <span>Did you</span>
          <input
            type="text"
            autoFocus
            className="flex-1 border-b border-gray-300 focus:border-black outline-none px-1 py-0.5"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="…type habit…"
          />
          <span>today?</span>
        </div>
        <p className="mt-2 text-sm text-gray-500">(Enter to save, Esc to cancel)</p>
      </div>
    );
  }

  // 2) NEW-CARD “＋” PLACEHOLDER MODE
  if (isNew && !editing) {
    return (
      <div
        onClick={onClick}
        className="rounded-2xl shadow p-6 bg-white w-full max-w-sm flex items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 hover:border-gray-400"
      >
        <span className="text-3xl text-gray-300 select-none">＋</span>
      </div>
    );
  }

  // 3) NORMAL CARD MODE
  return (
    <div className="relative rounded-2xl shadow p-6 bg-white w-full max-w-sm flex flex-col justify-between">
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
          aria-label="Delete habit"
        >
          ×
        </button>
      )}

      <div className="flex items-start justify-between">
      <p className="font-medium text-lg">Did you {question} today?</p>

        <Switch
          checked={yes}
          onCheckedChange={async (newVal) => {
            setYes(newVal);
            if (onToggle) await onToggle(newVal);
          }}
        />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          You did this {statCount} out of the last
        </p>
        <select
          value={period}
          onChange={async (e) => {
            const w = Number(e.target.value);
            setPeriod(w);
            if (onPeriodChange) onPeriodChange(w);
          }}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value={1}>1 day</option>
          <option value={2}>2 days</option>
          <option value={3}>3 days</option>
          <option value={4}>4 days</option>
        </select>
      </div>
    </div>
  );
}
