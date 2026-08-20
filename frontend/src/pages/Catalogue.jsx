import { useMemo, useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import Seo from "@/components/Seo";
import { Section, SectionHead, Glow, Badge, EmptyState, Disclaimer, CardSkeleton } from "@/components/Primitives";
import { ProductCard, LookCard } from "@/components/Cards";
import { WaitlistSection } from "@/components/Shared";
import { useCatalog } from "@/context/CatalogContext";
import { PRODUCTS, LOOKS, THEMES, OCCASIONS, COLORS, SIZES, findProduct, inr } from "@/data/catalog";

export function Looks() {
  const { looks: LOOKS } = useCatalog();
  const [occasion, setOccasion] = useState("");
  const list = LOOKS.filter((l) => !occasion || l.occasion === occasion);
  return (
    <>
      <Seo title="ZYRA Complete Looks — One Occasion. One Look. Zero Guesswork."
        description="Occasion-first ZYRA Complete Looks for weddings, interviews, office, date nights, parties, travel, festivals and college." path="/looks" />
      <Section className="relative overflow-hidden pt-36 z-grain" label="Looks hero">
        <Glow className="-left-32 top-10" size={500} />
        <div className="relative max-w-3xl">
          <p className="z-eyebrow">Complete Looks</p>
          <h1 className="font-display mt-4 text-4xl font-extrabold leading-[0.98] sm:text-5xl lg:text-6xl">
            One Occasion. One Look. <span style={{ color: "var(--z-purple-soft)" }}>Zero Guesswork.</span>
          </h1>
          <p className="mt-6 text-sm leading-relaxed sm:text-base" style={{ color: "var(--z-text-2)" }}>
            Tell ZYRA where you're going. We'll help you figure out what to wear — clothing plus the accessories that finish it.
          </p>
        </div>
      </Section>
      <Section label="All looks">
        <div className="mb-8 flex flex-wrap gap-2">
          <button type="button" onClick={() => setOccasion("")} aria-pressed={!occasion} data-testid="look-filter-all"
            className="rounded-full border px-4 py-2 text-[0.74rem]" style={{ borderColor: !occasion ? "var(--z-purple)" : "var(--z-border)", color: !occasion ? "#fff" : "var(--z-text-2)" }}>All</button>
          {OCCASIONS.map((o) => (
            <button key={o} type="button" onClick={() => setOccasion(o)} aria-pressed={occasion === o}
              data-testid={`look-filter-${o.toLowerCase().replace(/\s+/g, "-")}`}
              className="rounded-full border px-4 py-2 text-[0.74rem] transition-colors duration-300"
              style={{ borderColor: occasion === o ? "var(--z-purple)" : "var(--z-border)", color: occasion === o ? "#fff" : "var(--z-text-2)" }}>{o}</button>
          ))}
        </div>
        {list.length === 0 ? <EmptyState title="We couldn't find that look yet." copy="Try another occasion or style." /> : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" data-testid="look-grid">{list.map((l) => <LookCard key={l.id} look={l} />)}</div>
        )}
        <div className="mt-8"><Disclaimer>Demonstration catalogue content. Real merchant inventory is not yet connected.</Disclaimer></div>
      </Section>
      <WaitlistSection />
    </>
  );
}

export function Themes() {
  const { themes: THEMES } = useCatalog();
  return (
    <>
      <Seo title="ZYRA Themes — Wear the World You Love" description="ZYRA Themes bring together fashion collections inspired by moods, aesthetics, cultural moments and festivals — using original theme-inspired styling." path="/themes" />
      <Section className="relative overflow-hidden pt-36 z-grain" label="Themes hero">
        <Glow className="-right-32 top-10" size={500} />
        <div className="relative max-w-3xl">
          <p className="z-eyebrow">Theme specials</p>
          <h1 className="font-display mt-4 text-4xl font-extrabold leading-[0.98] sm:text-5xl lg:text-6xl">Wear the World You Love.</h1>
          <p className="mt-6 text-sm leading-relaxed sm:text-base" style={{ color: "var(--z-text-2)" }}>
            Collections inspired by moods, aesthetics, cultural moments, festivals, and entertainment-inspired styles.
          </p>
        </div>
      </Section>
      <Section label="All themes">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" data-testid="theme-grid">
          {THEMES.map((t) => (
            <article key={t.name} className="z-card group overflow-hidden rounded-2xl">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={t.image} alt={`${t.name} theme styling`} loading="lazy" className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.06]" />
              </div>
              <div className="p-5">
                <h2 className="font-display text-lg font-bold">{t.name}</h2>
                <p className="mt-2 text-sm" style={{ color: "var(--z-text-2)" }}>{t.note}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-10 max-w-2xl">
          <Disclaimer>
            ZYRA uses original theme-inspired styling and does not reproduce copyrighted movie, anime or web-series characters,
            logos or artwork. Any future licensed collaboration will carry a “Licensed Collection” label.
          </Disclaimer>
        </div>
      </Section>
      <WaitlistSection />
    </>
  );
}

export function ProductDetail() {
  const { id } = useParams();
  const product = findProduct(id);
  const [color, setColor] = useState(product?.colors[0]);
  const [size, setSize] = useState(product?.sizes[1] || product?.sizes[0]);

  if (!product)
    return (
      <Section className="pt-36">
        <EmptyState title="Not available nearby right now." copy="This piece isn't in the preview catalogue."
          action={<Link to="/search" className="z-btn z-btn-primary">Explore Similar</Link>} />
      </Section>
    );

  const pairs = PRODUCTS.filter((p) => p.id !== product.id && p.occasion.some((o) => product.occasion.includes(o))).slice(0, 4);
  const accessories = PRODUCTS.filter((p) => ["Belts", "Watches", "Footwear", "Wallets", "Fragrance"].includes(p.category) && p.id !== product.id).slice(0, 4);

  return (
    <>
      <Seo title={`${product.name} — ZYRA Preview Collection`} description={product.description} path={`/product/${product.id}`} image={product.image} />
      <Section className="pt-36" label={product.name}>
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
          <div className="overflow-hidden rounded-3xl border" style={{ borderColor: "var(--z-border)" }}>
            <img src={product.image} alt={`${product.name} — ZYRA Preview Collection`} className="aspect-[3/4] w-full object-cover" />
          </div>
          <div>
            <Badge tone="grey">Sample Product</Badge>
            <h1 className="font-display mt-4 text-3xl font-extrabold sm:text-4xl">{product.name}</h1>
            <p className="mt-2 text-[0.72rem] uppercase tracking-[0.18em]" style={{ color: "var(--z-text-3)" }}>{product.category} · {product.subcategory} · {product.gender}</p>
            <p className="font-display mt-4 text-2xl font-bold" style={{ color: "var(--z-purple-soft)" }}>{inr(product.price)}</p>
            <p className="mt-5 text-sm leading-relaxed" style={{ color: "var(--z-text-2)" }}>{product.description}</p>
            <dl className="mt-6 grid grid-cols-2 gap-3 text-[0.8rem]">
              <div><dt style={{ color: "var(--z-text-3)" }}>Material</dt><dd>{product.material}</dd></div>
              <div><dt style={{ color: "var(--z-text-3)" }}>Style</dt><dd>{product.style}</dd></div>
              <div><dt style={{ color: "var(--z-text-3)" }}>Fit</dt><dd>True to size</dd></div>
              <div><dt style={{ color: "var(--z-text-3)" }}>Occasion</dt><dd>{product.occasion.join(", ")}</dd></div>
            </dl>

            <fieldset className="mt-7">
              <legend className="text-[0.7rem] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--z-text-2)" }}>Colour</legend>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {product.colors.map((c) => (
                  <button key={c} type="button" onClick={() => setColor(c)} aria-pressed={color === c} data-testid={`product-color-${c.toLowerCase()}`}
                    className="rounded-full border px-3.5 py-2 text-[0.74rem] transition-colors duration-300"
                    style={{ borderColor: color === c ? "var(--z-purple)" : "var(--z-border)", color: color === c ? "#fff" : "var(--z-text-2)" }}>{c}</button>
                ))}
              </div>
            </fieldset>
            <fieldset className="mt-5">
              <legend className="text-[0.7rem] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--z-text-2)" }}>Size</legend>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {product.sizes.map((s) => (
                  <button key={s} type="button" onClick={() => setSize(s)} aria-pressed={size === s} data-testid={`product-size-${String(s).toLowerCase()}`}
                    className="min-w-[3rem] rounded-full border px-3.5 py-2 text-[0.74rem] font-semibold transition-colors duration-300"
                    style={{ borderColor: size === s ? "var(--z-purple)" : "var(--z-border)", color: size === s ? "#fff" : "var(--z-text-2)" }}>{s}</button>
                ))}
              </div>
            </fieldset>

            <p className="mt-6 rounded-xl px-4 py-3 text-[0.78rem]" data-testid="product-availability"
              style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(167,139,250,0.22)", color: "var(--z-text-2)" }}>
              {color} · {size} — availability will be confirmed by your nearest ZYRA Partner.
            </p>
            <div className="mt-4 z-card rounded-xl p-4">
              <p className="text-[0.7rem] uppercase tracking-[0.16em]" style={{ color: "var(--z-text-3)" }}>Service options</p>
              <p className="mt-2 text-sm" style={{ color: "var(--z-text-2)" }}>Optional Instant Fit at delivery · Scheduled Custom Tailoring</p>
              <Disclaimer>Subject to local tailor availability.</Disclaimer>
            </div>

            <button type="button" data-testid="add-to-bag" className="z-btn z-btn-primary mt-7"
              onClick={() => toast.info("ZYRA is currently preparing for launch. Join the waitlist to be among the first to shop.")}>
              Add to ZYRA Bag
            </button>
          </div>
        </div>
      </Section>

      <Section label="Pair recommendations" className="border-t" style={{ background: "var(--z-bg-2)" }}>
        <SectionHead eyebrow="Pair recommendations" title="Works Well With" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{pairs.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        <h3 className="font-display mt-14 mb-5 text-lg font-bold">Accessory Recommendations</h3>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{accessories.map((p) => <ProductCard key={p.id} product={p} />)}</div>
      </Section>
    </>
  );
}

export function SearchPage() {
  const { products: PRODUCTS } = useCatalog();
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";
  const [query, setQuery] = useState(q);
  const [filters, setFilters] = useState({ category: "", gender: "", occasion: "", colour: "", style: "", size: "", max: 15000 });
  const [loading, setLoading] = useState(false);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    return PRODUCTS.filter((p) => {
      const hay = [p.name, p.category, p.subcategory, p.style, p.material, p.gender, ...p.occasion, ...p.colors].join(" ").toLowerCase();
      return (
        (!term || hay.includes(term)) &&
        (!filters.category || p.category === filters.category) &&
        (!filters.gender || p.gender === filters.gender) &&
        (!filters.occasion || p.occasion.includes(filters.occasion)) &&
        (!filters.colour || p.colors.includes(filters.colour)) &&
        (!filters.style || p.style === filters.style) &&
        (!filters.size || p.sizes.includes(filters.size)) &&
        p.price <= filters.max
      );
    });
  }, [q, filters]);

  const onSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    setParams(query ? { q: query } : {});
    setTimeout(() => setLoading(false), 350);
  };

  const set = (k, v) => setFilters((p) => ({ ...p, [k]: v }));
  const categories = [...new Set(PRODUCTS.map((p) => p.category))];
  const styles = [...new Set(PRODUCTS.map((p) => p.style))];

  return (
    <>
      <Seo title="Search ZYRA — Preview Fashion Catalogue" description="Search the ZYRA preview catalogue: black shirt, wedding, office, sherwani, sneakers, date night, accessories and more." path="/search" />
      <Section className="pt-36" label="Search">
        <SectionHead eyebrow="Search" title="Find the Piece. Or the Moment." copy="Try “black shirt”, “wedding”, “office”, “sherwani”, “sneakers”, “date night” or “accessories”." />
        <form onSubmit={onSearch} className="flex flex-col gap-3 sm:flex-row" role="search">
          <label htmlFor="search-input" className="sr-only">Search the ZYRA catalogue</label>
          <input id="search-input" data-testid="search-input" className="z-input flex-1" placeholder="Search ZYRA…" value={query} onChange={(e) => setQuery(e.target.value)} />
          <button type="submit" className="z-btn z-btn-primary" data-testid="search-submit">Search</button>
        </form>

        <div className="z-card mt-6 grid gap-4 rounded-2xl p-5 sm:grid-cols-3 lg:grid-cols-4" data-testid="search-filters">
          {[["category", categories], ["gender", ["Men", "Women", "Unisex"]], ["occasion", OCCASIONS], ["colour", COLORS], ["style", styles], ["size", SIZES]].map(([key, opts]) => (
            <label key={key} className="block">
              <span className="mb-1.5 block text-[0.66rem] uppercase tracking-[0.16em]" style={{ color: "var(--z-text-3)" }}>{key}</span>
              <select className="z-input" value={filters[key]} onChange={(e) => set(key, e.target.value)} data-testid={`search-filter-${key}`}>
                <option value="">All</option>{opts.map((o) => <option key={o}>{o}</option>)}
              </select>
            </label>
          ))}
          <label className="block">
            <span className="mb-1.5 block text-[0.66rem] uppercase tracking-[0.16em]" style={{ color: "var(--z-text-3)" }}>Max price {inr(filters.max)}</span>
            <input type="range" min={1000} max={15000} step={500} value={filters.max} onChange={(e) => set("max", Number(e.target.value))} className="w-full accent-[var(--z-purple)]" data-testid="search-filter-price" aria-label="Maximum price" />
          </label>
        </div>

        <p className="mt-8 text-[0.75rem] uppercase tracking-[0.16em]" style={{ color: "var(--z-text-3)" }} data-testid="search-count">
          {results.length} preview {results.length === 1 ? "result" : "results"}
        </p>

        {loading ? (
          <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">{[0, 1, 2, 3].map((i) => <CardSkeleton key={i} />)}</div>
        ) : results.length === 0 ? (
          <div className="mt-5">
            <EmptyState title="We couldn't find that look yet." copy="Try another occasion or style."
              action={<button type="button" className="z-btn z-btn-ghost" onClick={() => { setFilters({ category: "", gender: "", occasion: "", colour: "", style: "", size: "", max: 15000 }); setQuery(""); setParams({}); }}>Reset Search</button>} />
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4" data-testid="search-results">
            {results.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </Section>
    </>
  );
}
