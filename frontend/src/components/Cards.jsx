import { Link } from "react-router-dom";
import { inr } from "@/data/catalog";
import { Badge } from "./Primitives";

export const ProductCard = ({ product, className = "" }) => (
  <article className={`z-card group overflow-hidden rounded-2xl ${className}`} data-testid={`product-card-${product.id}`}>
    <Link to={`/product/${product.id}`} className="block">
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={product.image}
          alt={`${product.name} — ZYRA Preview Collection`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(5,5,5,0.85), transparent 55%)" }} />
        <div className="absolute left-3 top-3"><Badge tone="grey">Preview</Badge></div>
      </div>
      <div className="p-4">
        <p className="text-[0.66rem] uppercase tracking-[0.18em]" style={{ color: "var(--z-text-3)" }}>{product.category}</p>
        <h3 className="font-display mt-1.5 text-base font-bold leading-snug">{product.name}</h3>
        <div className="mt-2.5 flex items-center justify-between">
          <p className="text-sm font-semibold" style={{ color: "var(--z-purple-soft)" }}>{inr(product.price)}</p>
          <p className="text-[0.68rem]" style={{ color: "var(--z-text-3)" }}>{product.sizes.slice(0, 4).join(" · ")}</p>
        </div>
        <p className="mt-3 text-[0.7rem] uppercase tracking-[0.16em]" style={{ color: "var(--z-text-3)" }}>ZYRA Preview Collection</p>
      </div>
    </Link>
  </article>
);

export const PairCard = ({ pair, className = "" }) => (
  <article className={`z-card group overflow-hidden rounded-2xl ${className}`} data-testid={`pair-card-${pair.id}`}>
    <Link to={`/pairs/${pair.id}`} className="block">
      <div className="relative aspect-[4/5] overflow-hidden">
        <img src={pair.image} alt={`${pair.name} sample pair for ${pair.occasion}`} loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(5,5,5,0.92), transparent 50%)" }} />
        <div className="absolute left-3 top-3 flex gap-2">
          <Badge>Sample Pair</Badge>
          {pair.featured && <Badge tone="grey">Featured</Badge>}
        </div>
        <div className="absolute inset-x-4 bottom-4">
          <p className="text-[0.66rem] uppercase tracking-[0.2em]" style={{ color: "var(--z-purple-soft)" }}>{pair.occasion}</p>
          <h3 className="font-display mt-1 text-xl font-bold">{pair.name}</h3>
        </div>
      </div>
      <div className="p-4">
        <ul className="space-y-1">
          {[...pair.components, ...pair.accessories].map((c) => (
            <li key={c.name} className="flex justify-between text-[0.78rem]">
              <span style={{ color: "var(--z-text-2)" }}>{c.name}</span>
              <span style={{ color: "var(--z-text-3)" }}>{inr(c.price)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-center justify-between border-t pt-3" style={{ borderColor: "var(--z-border)" }}>
          <span className="text-[0.66rem] uppercase tracking-[0.16em]" style={{ color: "var(--z-text-3)" }}>Total sample price</span>
          <span className="font-display text-base font-bold" style={{ color: "var(--z-purple-soft)" }}>{inr(pair.price)}</span>
        </div>
        <span className="z-btn z-btn-ghost mt-4 w-full !py-2.5 !text-[0.68rem]">View Pair</span>
      </div>
    </Link>
  </article>
);

export const LookCard = ({ look, className = "" }) => (
  <article className={`z-card group overflow-hidden rounded-2xl ${className}`} data-testid={`look-card-${look.id}`}>
    <div className="relative aspect-[3/4] overflow-hidden">
      <img src={look.image} alt={`${look.name} — a ZYRA complete look for ${look.occasion}`} loading="lazy"
        className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(5,5,5,0.94), transparent 45%)" }} />
      <div className="absolute inset-x-4 bottom-4">
        <p className="text-[0.64rem] uppercase tracking-[0.2em]" style={{ color: "var(--z-purple-soft)" }}>{look.occasion}</p>
        <h3 className="font-display mt-1 text-lg font-bold">{look.name}</h3>
        <p className="mt-1.5 text-[0.78rem]" style={{ color: "var(--z-text-2)" }}>{look.description}</p>
      </div>
    </div>
    <div className="p-4">
      <ul className="flex flex-wrap gap-1.5">
        {look.products.map((x) => (
          <li key={x} className="rounded-full px-2.5 py-1 text-[0.66rem]" style={{ background: "rgba(255,255,255,0.04)", color: "var(--z-text-2)" }}>{x}</li>
        ))}
      </ul>
      <p className="mt-3 text-[0.66rem] uppercase tracking-[0.16em]" style={{ color: "var(--z-text-3)" }}>Preview Collection</p>
    </div>
  </article>
);

export const CategoryCard = ({ category }) => (
  <Link to={`/search?q=${encodeURIComponent(category.name)}`} data-testid={`category-card-${category.name.toLowerCase()}`}
    className="z-card group relative block overflow-hidden rounded-2xl">
    <div className="aspect-[4/5] overflow-hidden">
      <img src={category.image} alt={`${category.name} fashion category`} loading="lazy"
        className="h-full w-full object-cover opacity-80 transition-all duration-[900ms] group-hover:scale-[1.07] group-hover:opacity-100" />
    </div>
    <div className="absolute inset-0 flex items-end p-4" style={{ background: "linear-gradient(to top, rgba(5,5,5,0.9), transparent 60%)" }}>
      <h3 className="font-display text-base font-bold uppercase tracking-[0.12em]">{category.name}</h3>
    </div>
  </Link>
);
