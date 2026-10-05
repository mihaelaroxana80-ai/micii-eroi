"use client";

import type { Variant } from "@/lib/products";

type Props = {
  variants: Variant[];
  stock: Record<string, number>;
  selected: string | null;
  onSelect: (size: string) => void;
  // Compact pills for product cards; large pills with low-stock notes for the product page.
  compact?: boolean;
};

export function SizePicker({ variants, stock, selected, onSelect, compact }: Props) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Alege mărimea">
      {variants.map((v) => {
        const left = stock[v.size] ?? 0;
        const isSelected = selected === v.size;
        const label = v.cm ? `${v.size} · ${v.cm} cm` : v.size;
        return (
          <button
            key={v.size}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={left === 0}
            onClick={() => onSelect(v.size)}
            className={`flex min-h-11 flex-col items-center justify-center rounded-full border-2 leading-tight transition duration-300 ${
              compact ? "px-3 py-1 text-sm" : "px-5 py-2 text-base"
            } ${
              isSelected
                ? "border-brand bg-brand-tint text-brand"
                : "border-line bg-white text-ink hover:border-brand-light"
            } disabled:cursor-not-allowed disabled:border-line disabled:bg-stone-50 disabled:text-stone-400 disabled:line-through`}
          >
            <span className="font-bold">{label}</span>
            {compact ? (
              <span className="text-xs text-stone-500">{left === 0 ? "epuizat" : `${left} buc`}</span>
            ) : (
              left > 0 &&
              left <= 2 && <span className="text-xs font-bold text-orange-600">Ultimele {left} buc!</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
