import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import Seo from "@/components/Seo";
import { Section, SectionHead, Glow, Badge, EmptyState, Disclaimer } from "@/components/Primitives";
import { PairCard, ProductCard } from "@/components/Cards";
import { PairShowcase } from "@/components/PairShowcase";
import { WaitlistSection } from "@/components/Shared";
import { useCatalog } from "@/context/CatalogContext";
import { PAIRS, PRODUCTS, OCCASIONS, COLORS, findPair, inr } from "@/data/catalog";

const GROUPS = ["Featured", "Occasion", "Trending", "Colour", "Premium", "Seasonal"];

export default function Pairs() {
  const { pairs: PAIRS } = useCatalog();
  const [sort, setSort] = useState("Trending");
  const [occasion, setOccasion] = useState("");
  const [color, setColor] = useState("");
  const [style, setStyle] = useState("");
  const [maxPrice, setMaxPrice] = useState(20000);

  const filtered = useMemo(() => {
    let list = PAIRS.filter(
      (p) =>
        (!occasion || p.occasion === occasion) &&
        (!color || p.colors.includes(color)) &&
        (!style || p.style === style) &&
        p.price <= maxPrice
    );
    if (sort === "Price") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "Occasion") list = [...list].sort((a, b) => a.occasion.localeCompare(b.occasion));
    if (sort === "New") list = [...list].reverse();
    if (sort === "Trending") list = [...list].sort((a, b) => Number(b.featured) - Number(a.featured));
    return list;
  }, [sort, occasion, color, style, maxPrice]);

  const styles = [...new Set(PAIRS.map((p) => p.style))];

  return (
    <>
      <Seo title="ZYRA Pairs — Curated Fashion Looks Without the Guesswork"
        description="Explore ZYRA PAIRS: complementary fashion pieces brought together into one ready-to-shop combination for weddings, work, interviews, dates and travel."
        path="/pairs" />

      <Section className="relative overflow-hidden pt-36 z-grain" label="Pairs hero">
        <Glow className="-right-32 top-10" size={520} />
        <div className="relative max-w-3xl">
          <p className="z-eyebrow">Signature experience</p>
          <h1 className="font-display mt-4 text-4xl font-extrabold leading-[0.98] sm:text-5xl lg:text-6xl">
            Don't Just Buy Pieces. <span style={{ color: "var(--z-purple-soft)" }}>Build the Look.</span>
          </h1>
          <p className="mt-6 text-sm leading-relaxed sm:text-base" style={{ color: "var(--z-text-2)" }}>
            Every ZYRA Pair is a complete decision — two or more pieces that already work together, plus the accessories that
            finish them. Below is a preview collection, not confirmed inventory.
          </p>
        </div>
      </Section>

      <Section label="Pair of the moment">
        <SectionHead eyebrow="Pair of the moment" title="Midnight Formal" />
        <PairShowcase pair={findPair("pair-midnight-formal")} />
      </Section>

      <Section label="All pairs" className="border-y" style={{ background: "var(--z-bg-2)" }}>
        <SectionHead eyebrow="Preview collection" title="Every Sample Pair" />

        <div className="z-card mb-9 grid gap-4 rounded-2xl p-5 sm:grid-cols-2 lg:grid-cols-5" data-testid="pair-filters">
          <label className="block">
            <span className="mb-1.5 block text-[0.66rem] uppercase tracking-[0.16em]" style={{ color: "var(--z-text-3)" }}>Sort</span>
            <select className="z-input" value={sort} onChange={(e) => setSort(e.target.value)} data-testid="pair-sort">
              {["Trending", "New", "Price", "Occasion"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[0.66rem] uppercase tracking-[0.16em]" style={{ color: "var(--z-text-3)" }}>Occasion</span>
            <select className="z-input" value={occasion} onChange={(e) => setOccasion(e.target.value)} data-testid="pair-filter-occasion">
              <option value="">All</option>{OCCASIONS.map((o) => <option key={o}>{o}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[0.66rem] uppercase tracking-[0.16em]" style={{ color: "var(--z-text-3)" }}>Colour</span>
            <select className="z-input" value={color} onChange={(e) => setColor(e.target.value)} data-testid="pair-filter-colour">
              <option value="">All</option>{COLORS.map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[0.66rem] uppercase tracking-[0.16em]" style={{ color: "var(--z-text-3)" }}>Style</span>
            <select className="z-input" value={style} onChange={(e) => setStyle(e.target.value)} data-testid="pair-filter-style">
              <option value="">All</option>{styles.map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[0.66rem] uppercase tracking-[0.16em]" style={{ color: "var(--z-text-3)" }}>Max price {inr(maxPrice)}</span>
            <input type="range" min={3000} max={20000} step={500} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[var(--z-purple)]" data-testid="pair-filter-price" aria-label="Maximum price" />
          </label>
        </div>

        {filtered.length === 0 ? (
          <EmptyState title="We couldn't find that look yet." copy="Try another occasion or style."
            action={<button type="button" className="z-btn z-btn-ghost" onClick={() => { setOccasion(""); setColor(""); setStyle(""); setMaxPrice(20000); }}>Reset Filters</button>} />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" data-testid="pair-grid">
            {filtered.map((p) => <PairCard key={p.id} pair={p} />)}
          </div>
        )}

        <div className="mt-10 space-y-6">
          {GROUPS.map((g) => {
            const list = PAIRS.filter((p) => p.group === g);
            if (!list.length) return null;
            return (
              <div key={g}>
                <h3 className="font-display mb-4 text-lg font-bold">{g} Pairs</h3>
                <div className="z-scroll-x pb-2">
                  {list.map((p) => <PairCard key={p.id} pair={p} className="w-[74vw] max-w-[300px]" />)}
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      <WaitlistSection />
    </>
  );
}

export function PairDetail() {
  const { id } = useParams();
  const { pairs } = useCatalog();
  const pair = pairs.find((p) => p.id === id) || findPair(id);
  if (!pair)
    return (
      <Section className="pt-36">
        <EmptyState title="We couldn't find that look yet." copy="Try another occasion or style."
          action={<Link to="/pairs" className="z-btn z-btn-primary">All Pairs</Link>} />
      </Section>
    );

  const related = PRODUCTS.filter((p) => p.occasion.includes(pair.occasion)).slice(0, 4);

  return (
    <>
      <Seo title={`${pair.name} — ZYRA Pair`} description={`${pair.description} A ZYRA sample pair for ${pair.occasion}.`} path={`/pairs/${pair.id}`} image={pair.image} />
      <Section className="pt-36" label={`${pair.name} pair`}>
        <Link to="/pairs" className="text-[0.72rem] uppercase tracking-[0.16em]" style={{ color: "var(--z-purple-soft)" }}>← All Pairs</Link>
        <h1 className="font-display mt-4 mb-8 text-3xl font-extrabold sm:text-5xl">{pair.name}</h1>
        <PairShowcase pair={pair} />
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button type="button" data-testid="pair-add-cta" className="z-btn z-btn-primary"
            onClick={() => toast.info("ZYRA is currently preparing for launch. Join the waitlist to be among the first to shop.")}>
            Add to ZYRA Bag
          </button>
          <Badge tone="grey">Preview Collection</Badge>
        </div>
        <div className="mt-4"><Disclaimer>Sample pair. Availability, pricing and fit services are confirmed by participating ZYRA Partners.</Disclaimer></div>
      </Section>
      <Section label="Related pieces" className="border-t" style={{ background: "var(--z-bg-2)" }}>
        <SectionHead eyebrow="Complete the look" title="Pieces That Work With This Pair" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{related.map((p) => <ProductCard key={p.id} product={p} />)}</div>
      </Section>
    </>
  );
}
