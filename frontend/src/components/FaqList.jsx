import { useState } from "react";
import { ChevronDown } from "lucide-react";

export const FaqList = ({ items, testid = "faq" }) => {
  const [open, setOpen] = useState(0);
  return (
    <div className="divide-y" style={{ borderColor: "var(--z-border)" }} data-testid={testid}>
      {items.map((f, i) => (
        <div key={f.q} className="border-b" style={{ borderColor: "var(--z-border)" }}>
          <button
            type="button"
            aria-expanded={open === i}
            data-testid={`${testid}-q-${i}`}
            onClick={() => setOpen(open === i ? -1 : i)}
            className="flex w-full items-center justify-between gap-6 py-5 text-left transition-colors duration-300 hover:text-[var(--z-purple-soft)]"
          >
            <span className="font-display text-base font-semibold sm:text-lg">{f.q}</span>
            <ChevronDown size={18} className="shrink-0 transition-transform duration-300" style={{ transform: open === i ? "rotate(180deg)" : "none", color: "var(--z-purple-soft)" }} />
          </button>
          {open === i && (
            <p data-testid={`${testid}-a-${i}`} className="pb-6 pr-8 text-sm leading-relaxed" style={{ color: "var(--z-text-2)" }}>
              {f.a}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};
