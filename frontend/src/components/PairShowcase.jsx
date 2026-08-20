import { useState } from "react";
import { Link } from "react-router-dom";
import { COLORS, SIZES, inr } from "@/data/catalog";
import { Badge } from "./Primitives";

const SWATCH = { Black: "#0d0d10", White: "#eceaea", Navy: "#1b2440", Beige: "#cbb99b", Olive: "#4c5233" };

// Interactive PAIR display: colour + size selection with marketplace availability messaging.
export const PairShowcase = ({ pair }) => {
  const [color, setColor] = useState(pair.colors[0]);
  const [size, setSize] = useState("M");
  const offered = pair.colors.includes(color);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-12" data-testid="pair-showcase">
      <div className="relative overflow-hidden rounded-3xl border" style={{ borderColor: "var(--z-border)" }}>
        <img src={pair.image} alt={`${pair.name} — sample pair styled in ${color}`}
          className="aspect-[4/5] w-full object-cover transition-all duration-700"
          style={{ filter: color === "White" || color === "Beige" ? "brightness(1.08) saturate(0.9)" : "none" }} />
        <div className="absolute left-4 top-4"><Badge>Sample Pair</Badge></div>
      </div>

      <div>
        <p className="z-eyebrow">{pair.occasion} · Pair of the Moment</p>
        <h3 className="font-display mt-3 text-3xl font-bold sm:text-4xl">{pair.name}</h3>
        <p className="mt-4 text-sm leading-relaxed sm:text-base" style={{ color: "var(--z-text-2)" }}>{pair.description}</p>

        <div className="mt-7 space-y-2">
          {pair.components.map((c) => (
            <div key={c.name} className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: "var(--z-card)" }}>
              <span className="text-sm">{c.name}</span>
              <span className="text-sm" style={{ color: "var(--z-purple-soft)" }}>{inr(c.price)}</span>
            </div>
          ))}
          {pair.accessories.map((c) => (
            <div key={c.name} className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: "rgba(255,255,255,0.02)" }}>
              <span className="text-sm" style={{ color: "var(--z-text-2)" }}>{c.name} <span className="text-[0.62rem] uppercase tracking-[0.16em]" style={{ color: "var(--z-text-3)" }}>· accessory</span></span>
              <span className="text-sm" style={{ color: "var(--z-text-3)" }}>{inr(c.price)}</span>
            </div>
          ))}
        </div>

        <fieldset className="mt-8">
          <legend className="text-[0.7rem] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--z-text-2)" }}>Choose Colour</legend>
          <div className="mt-3 flex flex-wrap gap-2.5">
            {COLORS.map((c) => (
              <button key={c} type="button" onClick={() => setColor(c)} aria-pressed={color === c}
                data-testid={`pair-color-${c.toLowerCase()}`}
                className="flex items-center gap-2 rounded-full border px-3.5 py-2 text-[0.72rem] transition-colors duration-300"
                style={{ borderColor: color === c ? "var(--z-purple)" : "var(--z-border)", color: color === c ? "#fff" : "var(--z-text-2)", background: color === c ? "rgba(124,58,237,0.14)" : "transparent" }}>
                <span className="h-3 w-3 rounded-full border border-white/20" style={{ background: SWATCH[c] }} />
                {c}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-6">
          <legend className="text-[0.7rem] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--z-text-2)" }}>Choose Size</legend>
          <div className="mt-3 flex flex-wrap gap-2.5">
            {SIZES.map((s) => (
              <button key={s} type="button" onClick={() => setSize(s)} aria-pressed={size === s}
                data-testid={`pair-size-${s.toLowerCase()}`}
                className="min-w-[3rem] rounded-full border px-3.5 py-2 text-[0.75rem] font-semibold transition-colors duration-300"
                style={{ borderColor: size === s ? "var(--z-purple)" : "var(--z-border)", color: size === s ? "#fff" : "var(--z-text-2)", background: size === s ? "rgba(124,58,237,0.14)" : "transparent" }}>
                {s}
              </button>
            ))}
          </div>
        </fieldset>

        <p className="mt-6 rounded-xl px-4 py-3 text-[0.78rem]" data-testid="pair-availability"
          style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(167,139,250,0.22)", color: "var(--z-text-2)" }}>
          {offered
            ? `${pair.name} in ${color}, size ${size} — availability will be confirmed by your nearest ZYRA Partner.`
            : `${color} isn't part of this sample pair. Availability will be confirmed by your nearest ZYRA Partner.`}
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Link to={`/pairs/${pair.id}`} data-testid="pair-view-cta" className="z-btn z-btn-primary">View Pair</Link>
          <span className="font-display text-lg font-bold">{inr(pair.price)}</span>
        </div>
      </div>
    </div>
  );
};
