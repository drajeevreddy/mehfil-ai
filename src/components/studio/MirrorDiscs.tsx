"use client";

import { cn } from "@/lib/utils";

/**
 * Intensity as five mirror discs that ignite in sequence (the nixie
 * challenger's discipline donated to the chamber). Not a chip row.
 */
export function MirrorDiscs({
  value,
  onChange,
  disabled,
  labels = ["Soft and tender", "Melancholic", "Deeply emotional", "Intense and restless", "Powerful and dramatic"],
}: {
  value: number;
  onChange?: (v: number) => void;
  disabled?: boolean;
  labels?: string[];
}) {
  return (
    <div
      role={onChange ? "slider" : undefined}
      tabIndex={onChange ? 0 : undefined}
      aria-label={`Emotional intensity: ${value} of 5 — ${labels[value - 1]}`}
      aria-valuemin={1}
      aria-valuemax={5}
      aria-valuenow={value}
      onKeyDown={(e) => {
        if (!onChange || disabled) return;
        if (e.key === "ArrowRight" || e.key === "ArrowUp") {
          e.preventDefault();
          onChange(Math.min(5, value + 1));
        } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
          e.preventDefault();
          onChange(Math.max(1, value - 1));
        }
      }}
      className={cn("flex items-center gap-3", onChange && !disabled && "cursor-pointer")}
    >
      {[1, 2, 3, 4, 5].map((n) => {
        const on = n <= value;
        const next = n === value + 1;
        return (
          <button
            key={n}
            type="button"
            disabled={disabled || !onChange}
            onClick={() => onChange?.(n)}
            aria-label={`Intensity ${n}: ${labels[n - 1]}`}
            aria-pressed={on}
            className={cn(
              "group relative h-7 w-7 rounded-full transition-all duration-500",
              disabled || !onChange ? "cursor-default" : "cursor-pointer hover:scale-110"
            )}
            style={{
              background: on
                ? "radial-gradient(circle at 34% 30%, #f2e0b6, #c8a25e 55%, #8a6a45)"
                : "radial-gradient(circle at 34% 30%, rgba(217,203,178,0.18), rgba(26,22,19,0.9))",
              boxShadow: on
                ? "0 0 0 1px rgba(242,224,182,0.8), 0 0 18px rgba(217,154,61,0.55), inset 0 0 6px rgba(11,10,8,0.5)"
                : "0 0 0 1px rgba(200,162,94,0.28), inset 0 1px 4px rgba(0,0,0,0.6)",
            }}
          >
            {next && !disabled && (
              <span
                aria-hidden
                className="absolute inset-0 rounded-full"
                style={{ background: "rgba(237,184,95,0.25)" }}
              />
            )}
          </button>
        );
      })}
      <span
        aria-hidden
        className="hidden font-body text-[13px] italic text-ivory-500 transition-opacity duration-500 sm:inline"
        style={{ opacity: 0.9 }}
      >
        {labels[value - 1]}
      </span>
    </div>
  );
}
