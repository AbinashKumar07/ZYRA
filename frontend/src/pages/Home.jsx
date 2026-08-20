import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Scissors, Truck, Store, TrendingUp } from "lucide-react";
import Seo from "@/components/Seo";
import { Section, SectionHead, Glow, Badge, Eyebrow, Disclaimer } from "@/components/Primitives";
import { ProductCard, PairCard, LookCard, CategoryCard } from "@/components/Cards";
import { PairShowcase } from "@/components/PairShowcase";
import { WaitlistSection } from "@/components/Shared";
import { FaqList } from "@/components/FaqList";
import { useCatalog } from "@/context/CatalogContext";
import {
  PRODUCTS, PAIRS, LOOKS, THEMES, CATEGORIES, ACCESSORY_CATEGORIES, TRENDING_IDS,
  OCCASION_PROMPTS, FAQS, IMAGES, BOOKS, FOUNDER_PHOTO, findProduct, inr,
} from "@/data/catalog";

const PRINCIPLES = [
  { icon: Sparkles, title: "Discover", copy: "Find what fits your moment." },
  { icon: ArrowRight, title: "Pair", copy: "Get complementary pieces without the guesswork." },
  { icon: TrendingUp, title: "Ready", copy: "Get everything together and get on with your day." },
];

const STEPS = [
  ["01", "Choose Your Moment", "Wedding, work, date, party, travel, or anything in between."],
  ["02", "Discover Your Look", "Browse individual pieces, PAIRS, Complete Looks and accessories."],
  ["03", "Make It Yours", "Choose colour, size and optional fit services."],
  ["04", "Get Ready", "Receive your fashion from participating local partners."],
];

const Hero = () => (
  <section className="relative flex min-h-[92vh] items-end overflow-hidden z-grain px-5 pb-16 pt-32 sm:px-8 lg:px-12" aria-label="ZYRA hero">
    <img src={IMAGES.heroMan} alt="A man in tailored white shirt seated in dramatic low light" className="absolute inset-0 h-full w-full object-cover object-[60%_center] opacity-[0.55]" />
    <div className="absolute inset-0" style={{ background: "linear-gradient(100deg, rgba(5,5,5,0.96) 0%, rgba(5,5,5,0.72) 45%, rgba(5,5,5,0.35) 100%)" }} />
    <Glow className="-left-32 bottom-10" size={560} />
    <div className="relative mx-auto w-full max-w-[1200px]">
      <div className="z-reveal max-w-3xl">
        <div className="flex flex-wrap items-center gap-2.5">
          <Badge>In Development</Badge>
          <span className="text-[0.7rem] uppercase tracking-[0.18em]" style={{ color: "var(--z-text-2)" }}>
            Preparing for launch in Delhi NCR — Delhi • Gurugram • Noida
          </span>
        </div>
        <h1 className="font-display mt-7 text-4xl font-extrabold uppercase leading-[0.95] sm:text-5xl lg:text-7xl">
          Look Your Best.<br />
          <span style={{ color: "var(--z-purple-soft)" }}>Today.</span>
        </h1>
        <p className="mt-7 max-w-xl text-sm leading-relaxed sm:text-base" style={{ color: "var(--z-text-2)" }}>
          Fashion, styled around you and designed for the moment. Discover premium clothing, curated pairs, complete looks,
          and accessories from the fashion ecosystem around you.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link to="/how-it-works" className="z-btn z-btn-primary" data-testid="hero-explore-cta">Explore ZYRA</Link>
          <Link to="/pairs" className="z-btn z-btn-ghost" data-testid="hero-pairs-cta">Shop Pairs</Link>
        </div>
        <div className="mt-5 flex flex-wrap gap-5">
          <Link to="/merchants" className="text-[0.75rem] uppercase tracking-[0.16em] underline decoration-white/20 underline-offset-[6px] transition-colors hover:text-[var(--z-purple-soft)]" data-testid="hero-merchant-cta">Become a Merchant</Link>
          <Link to="/investors" className="text-[0.75rem] uppercase tracking-[0.16em] underline decoration-white/20 underline-offset-[6px] transition-colors hover:text-[var(--z-purple-soft)]" data-testid="hero-invest-cta">Partner / Invest</Link>
        </div>
        <div className="mt-10">
          <Disclaimer>ZYRA is currently in development and we are preparing for launch.</Disclaimer>
        </div>
      </div>
    </div>
  </section>
);

const OccasionPicker = () => {
  const { looks: LOOKS, pairs: PAIRS } = useCatalog();
  const [active, setActive] = useState("Interview");
  const looks = LOOKS.filter((l) => l.occasion === active);
  return (
    <Section id="occasions" label="Occasion-first shopping">
      <SectionHead eyebrow="Occasion first" title="Dress for the Moment." copy="Start with where you're going. ZYRA works backwards from there." />
      <div className="flex flex-wrap gap-3">
        {OCCASION_PROMPTS.map((o) => (
          <button key={o.label} type="button" onClick={() => setActive(o.occasion)} aria-pressed={active === o.occasion}
            data-testid={`occasion-${o.occasion.toLowerCase().replace(/\s+/g, "-")}`}
            className="rounded-full border px-5 py-3 text-left text-[0.8rem] transition-colors duration-300"
            style={{ borderColor: active === o.occasion ? "var(--z-purple)" : "var(--z-border)", background: active === o.occasion ? "rgba(124,58,237,0.14)" : "transparent", color: active === o.occasion ? "#fff" : "var(--z-text-2)" }}>
            {o.label}
          </button>
        ))}
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" data-testid="occasion-results">
        {looks.map((l) => <LookCard key={l.id} look={l} />)}
        {PAIRS.filter((p) => p.occasion === active).map((p) => <PairCard key={p.id} pair={p} />)}
      </div>
    </Section>
  );
};

export default function Home() {
  const { pairs: PAIRS, looks: LOOKS, themes: THEMES, faqs: FAQS, products: PRODUCTS } = useCatalog();
  const featured = PAIRS.find((p) => p.id === "pair-midnight-formal") || PAIRS[0];
  const trending = TRENDING_IDS.map(findProduct);
  const accessoryProducts = PRODUCTS.filter((p) => ["Belts", "Watches", "Footwear", "Wallets"].includes(p.category)).slice(0, 4);

  return (
    <>
      <Seo title="ZYRA — Look Your Best. Today. | Fashion, Pairs & Complete Looks"
        description="ZYRA is a hyperlocal fashion commerce platform preparing to launch in Delhi NCR. Discover premium clothing, curated PAIRS, complete looks, accessories and custom tailoring."
        path="/" />
      <Hero />

      <Section label="What is ZYRA">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <SectionHead eyebrow="What is ZYRA?" title="Fashion Shouldn't Feel Complicated."
            copy="Finding the right outfit shouldn't mean visiting multiple stores, comparing endless products, wondering what matches, or discovering too late that the fit isn't right." />
          <div className="space-y-8">
            <p className="text-sm leading-relaxed sm:text-base" style={{ color: "var(--z-text-2)" }}>
              ZYRA brings fashion, styling, accessories, local discovery, and convenience into one experience.
            </p>
            <div className="space-y-4">
              {PRINCIPLES.map((p) => (
                <div key={p.title} className="z-card flex items-start gap-4 rounded-2xl p-5">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full" style={{ background: "rgba(124,58,237,0.16)" }}>
                    <p.icon size={16} style={{ color: "var(--z-purple-soft)" }} />
                  </span>
                  <div>
                    <h3 className="font-display text-base font-bold">{p.title}</h3>
                    <p className="mt-1 text-sm" style={{ color: "var(--z-text-2)" }}>{p.copy}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="font-display text-lg font-semibold" style={{ color: "var(--z-purple-soft)" }}>
              ZYRA helps you go from “What should I wear?” to “I'm ready.”
            </p>
          </div>
        </div>
      </Section>

      <Section id="pair" className="relative overflow-hidden" label="Meet PAIR">
        <Glow className="-left-40 top-10" size={560} />
        <div className="relative">
          <SectionHead eyebrow="Signature feature" title="Meet PAIR." copy="Stop wondering what goes with what. PAIR is ZYRA's curated fashion experience where complementary pieces are brought together into one ready-to-shop combination." />
          <div className="mb-12 flex flex-wrap gap-2">
            {["Shirt + Trouser", "Kurta + Bottom", "Jacket + Shirt", "Sherwani + Bottom", "Top + Skirt", "Dress + Accessories", "Casual Shirt + Jeans"].map((x) => (
              <span key={x} className="rounded-full border px-3.5 py-1.5 text-[0.72rem]" style={{ borderColor: "var(--z-border)", color: "var(--z-text-2)" }}>{x}</span>
            ))}
          </div>
          {featured && <PairShowcase pair={featured} />}
          <div className="mt-14">
            <div className="mb-5 flex items-end justify-between">
              <h3 className="font-display text-xl font-bold">More Sample Pairs</h3>
              <Link to="/pairs" className="text-[0.72rem] uppercase tracking-[0.16em]" style={{ color: "var(--z-purple-soft)" }}>All Pairs</Link>
            </div>
            <div className="z-scroll-x pb-2 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible">
              {PAIRS.filter((p) => p.id !== featured?.id).slice(0, 3).map((p) => (
                <PairCard key={p.id} pair={p} className="w-[78vw] max-w-[320px] md:w-auto md:max-w-none" />
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section label="Complete Looks" className="border-y" style={{ background: "var(--z-bg-2)" }}>
        <SectionHead eyebrow="Complete Looks" title="One Occasion. One Look. Zero Guesswork."
          copy="Tell ZYRA where you're going. We'll help you figure out what to wear." />
        <div className="z-scroll-x pb-2 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible lg:grid-cols-4">
          {LOOKS.slice(0, 8).map((l) => <LookCard key={l.id} look={l} className="w-[74vw] max-w-[300px] md:w-auto md:max-w-none" />)}
        </div>
        <div className="mt-8"><Link to="/looks" className="z-btn z-btn-ghost" data-testid="looks-cta">Explore Complete Looks</Link></div>
      </Section>

      <Section id="trending" label="Trending now">
        <SectionHead eyebrow="Preview collection" title="Trending Now" copy="A sample of the kind of pieces ZYRA is being built to surface. These are demonstration catalogue entries, not confirmed inventory." />
        <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
          {trending.map((p) => p && <ProductCard key={p.id} product={p} />)}
        </div>
        <div className="mt-8"><Link to="/search" className="z-btn z-btn-ghost" data-testid="trending-cta">Browse the Preview Catalogue</Link></div>
      </Section>

      <Section label="Accessories" className="relative overflow-hidden">
        <Glow className="-right-40 top-0" size={480} />
        <div className="relative grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <div>
            <SectionHead eyebrow="Accessories" title="The Outfit Isn't Finished Without the Details."
              copy="ZYRA doesn't stop at clothing. Complete your look with accessories selected to work with it." />
            <ul className="flex flex-wrap gap-2">
              {ACCESSORY_CATEGORIES.map((a) => (
                <li key={a} className="rounded-full border px-3.5 py-1.5 text-[0.72rem]" style={{ borderColor: "var(--z-border)", color: "var(--z-text-2)" }}>{a}</li>
              ))}
            </ul>
            <div className="z-card mt-9 rounded-2xl p-6">
              <Eyebrow>Cross-styling example</Eyebrow>
              <p className="font-display mt-2 text-lg font-bold">Black Shirt</p>
              <p className="mt-3 text-[0.7rem] uppercase tracking-[0.16em]" style={{ color: "var(--z-text-3)" }}>Recommended</p>
              <ul className="mt-2 space-y-1.5 text-sm" style={{ color: "var(--z-text-2)" }}>
                <li>Black Belt</li><li>Minimal Watch</li><li>Black Loafers</li><li>Leather Wallet</li>
              </ul>
              <Link to="/looks" className="z-btn z-btn-primary mt-6" data-testid="complete-look-cta">Complete the Look</Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {accessoryProducts.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </Section>

      <OccasionPicker />

      <Section label="Category discovery" className="border-y" style={{ background: "var(--z-bg-2)" }}>
        <SectionHead eyebrow="Discovery" title="Start Anywhere." copy="Ten entry points into the same curated experience." />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map((c) => <CategoryCard key={c.name} category={c} />)}
        </div>
      </Section>

      <Section label="Tailoring">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div className="overflow-hidden rounded-3xl border" style={{ borderColor: "var(--z-border)" }}>
            <img src={IMAGES.atelier} alt="A tailoring workshop with mannequins and materials" loading="lazy" className="aspect-[4/3] w-full object-cover" />
          </div>
          <div>
            <SectionHead eyebrow="Tailoring" title="Fit Shouldn't Be an Afterthought."
              copy="Two services, one standard: the garment should fit the person, not the other way around." />
            <div className="space-y-4">
              <div className="z-card rounded-2xl p-5">
                <div className="flex items-center gap-3"><Scissors size={16} style={{ color: "var(--z-purple-soft)" }} /><h3 className="font-display text-base font-bold">Instant Fit</h3></div>
                <p className="mt-2 text-sm" style={{ color: "var(--z-text-2)" }}>Hemming, sleeve shortening, waist adjustment, button replacement and minor fitting — optional, at your choice.</p>
                <Disclaimer>Subject to local tailor availability.</Disclaimer>
              </div>
              <div className="z-card rounded-2xl p-5">
                <div className="flex items-center gap-3"><Scissors size={16} style={{ color: "var(--z-purple-soft)" }} /><h3 className="font-display text-base font-bold">Book Custom Tailoring</h3></div>
                <p className="mt-2 text-sm" style={{ color: "var(--z-text-2)" }}>Sherwanis, suits, tuxedos, bridal wear, major alterations and custom stitching — scheduled as a premium service.</p>
              </div>
            </div>
            <Link to="/tailoring" className="z-btn z-btn-primary mt-7" data-testid="tailoring-cta">Explore Tailoring</Link>
          </div>
        </div>
      </Section>

      <Section label="Fast local fulfilment" className="relative overflow-hidden border-y" style={{ background: "var(--z-bg-2)" }}>
        <SectionHead eyebrow="Fulfilment" title="Fashion, When You Need It."
          copy="ZYRA connects customers with nearby fashion partners so locally available products can move from store to customer with less waiting." />
        <div className="grid gap-5 md:grid-cols-3">
          {[
            [Truck, "Fast local fulfilment", "Subject to merchant and delivery-partner availability."],
            [Sparkles, "24/7 discovery", "Discover and place requests around the clock."],
            [Store, "Partner-dependent delivery", "Fulfilment depends on partner operating hours and local availability."],
          ].map(([Icon, title, copy]) => (
            <div key={title} className="z-card rounded-2xl p-6">
              <Icon size={18} style={{ color: "var(--z-purple-soft)" }} />
              <h3 className="font-display mt-4 text-base font-bold">{title}</h3>
              <p className="mt-2 text-sm" style={{ color: "var(--z-text-2)" }}>{copy}</p>
            </div>
          ))}
        </div>
        <p className="font-display mt-10 max-w-2xl text-xl font-semibold sm:text-2xl">Fashion should be available when life happens.</p>
      </Section>

      <Section label="How ZYRA works">
        <SectionHead eyebrow="How it works" title="Four Steps. No Guesswork." />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(([n, t, c]) => (
            <div key={n} className="z-card rounded-2xl p-6">
              <p className="font-display text-3xl font-extrabold" style={{ color: "rgba(167,139,250,0.35)" }}>{n}</p>
              <h3 className="font-display mt-4 text-base font-bold">{t}</h3>
              <p className="mt-2 text-sm" style={{ color: "var(--z-text-2)" }}>{c}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section label="Theme specials" className="border-y" style={{ background: "var(--z-bg-2)" }}>
        <SectionHead eyebrow="Theme specials" title="Wear the World You Love."
          copy="ZYRA Themes bring together fashion collections inspired by moods, aesthetics, cultural moments, festivals, and entertainment-inspired styles." />
        <div className="z-scroll-x pb-2 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible lg:grid-cols-5">
          {THEMES.slice(0, 5).map((t) => (
            <article key={t.name} className="z-card w-[68vw] max-w-[260px] overflow-hidden rounded-2xl md:w-auto md:max-w-none">
              <img src={t.image} alt={`${t.name} theme styling`} loading="lazy" className="aspect-[3/4] w-full object-cover" />
              <div className="p-4">
                <h3 className="font-display text-base font-bold">{t.name}</h3>
                <p className="mt-1.5 text-[0.78rem]" style={{ color: "var(--z-text-2)" }}>{t.note}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-8"><Link to="/themes" className="z-btn z-btn-ghost" data-testid="themes-cta">All Themes</Link></div>
        <div className="mt-6"><Disclaimer>ZYRA uses original theme-inspired styling. We do not reproduce copyrighted characters, logos or artwork. Future licensed collaborations will be labelled “Licensed Collection”.</Disclaimer></div>
      </Section>

      <Section label="Merchant opportunity">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHead eyebrow="For merchants" title="Your Store. A Bigger Reach."
              copy="ZYRA helps local fashion businesses reach customers beyond their storefront." />
            <Link to="/merchants" className="z-btn z-btn-primary" data-testid="home-merchant-cta">Become a ZYRA Partner</Link>
          </div>
          <ul className="grid grid-cols-2 gap-3">
            {["New local customers", "Digital storefront", "Additional sales channel", "Complete Look exposure", "Accessory cross-selling", "Customer discovery", "Technology infrastructure", "Delivery ecosystem"].map((b) => (
              <li key={b} className="z-card rounded-xl p-4 text-[0.82rem]" style={{ color: "var(--z-text-2)" }}>{b}</li>
            ))}
          </ul>
        </div>
      </Section>

      <Section label="Investor opportunity" className="relative overflow-hidden border-y" style={{ background: "var(--z-bg-2)" }}>
        <Glow className="-left-32 top-0" size={460} />
        <div className="relative">
          <SectionHead eyebrow="Investors & partners" title="Build the Future of Fashion Commerce With Us."
            copy="Fashion remains fragmented across marketplaces, stores, styling decisions, accessories, fitting and fulfilment. ZYRA brings these experiences together through a hyperlocal marketplace." />
          <div className="flex flex-wrap gap-3">
            <Link to="/investors" className="z-btn z-btn-primary" data-testid="home-investor-cta">Partner With ZYRA</Link>
            <Link to="/investors#info" className="z-btn z-btn-ghost">Request Investor Information</Link>
          </div>
        </div>
      </Section>

      <Section label="Founder">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <figure className="relative overflow-hidden rounded-3xl border" style={{ borderColor: "var(--z-border)" }} data-testid="founder-photo">
            <img src={FOUNDER_PHOTO} alt="Abinash Kumar, Author and Founder of ZYRA" loading="lazy" className="aspect-[4/5] w-full object-cover object-top" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(5,5,5,0.6), transparent 55%)" }} />
          </figure>
          <div>
            <SectionHead eyebrow="The founder" title="Meet the Mind Behind ZYRA" />
            <p className="font-display text-2xl font-bold">Abinash Kumar</p>
            <p className="mt-1 text-[0.75rem] uppercase tracking-[0.18em]" style={{ color: "var(--z-purple-soft)" }}>Author &amp; Founder</p>
            <p className="mt-6 text-sm leading-relaxed sm:text-base" style={{ color: "var(--z-text-2)" }}>
              Author, strategist, and founder of ZYRA. Abinash Kumar combines a deep analytical study of human behavior,
              presentation, and self-sovereignty to craft purpose-driven lifestyle and apparel experiences.
            </p>
            <blockquote className="mt-8 border-l-2 pl-6" style={{ borderColor: "var(--z-purple)" }}>
              <p className="font-display text-lg font-semibold leading-relaxed sm:text-xl">
                “The world observes form before it understands substance. True style is not about seeking validation from the
                crowd; it is the outward alignment of internal discipline and self-respect.”
              </p>
            </blockquote>
            <Link to="/founder" className="z-btn z-btn-ghost mt-8" data-testid="home-founder-cta">Meet Abinash</Link>
          </div>
        </div>
      </Section>

      <Section label="Books" className="border-y" style={{ background: "var(--z-bg-2)" }}>
        <SectionHead eyebrow="Before ZYRA" title="Written Before ZYRA"
          copy="The same curiosity about human behaviour that shaped Abinash's writing informs the way ZYRA thinks about personal presentation, decision-making, confidence, and identity." />
        <div className="grid gap-5 sm:grid-cols-2">
          {BOOKS.map((b) => (
            <div key={b.id} className="z-card flex gap-5 rounded-2xl p-5" data-testid={`home-book-${b.id}`}>
              <img src={b.cover} alt={`Cover of ${b.title}`} loading="lazy" className="h-32 w-24 shrink-0 rounded-lg border object-cover object-top" style={{ borderColor: "var(--z-border)" }} />
              <div>
                <h3 className="font-display text-base font-bold">{b.title}</h3>
                <p className="mt-1 text-[0.75rem]" style={{ color: "var(--z-text-2)" }}>{b.credit}</p>
                <p className="mt-2"><Badge tone="grey">{b.status}</Badge></p>
                <a href={b.url} target="_blank" rel="noopener noreferrer" className="z-btn z-btn-ghost mt-4 !px-4 !py-2 !text-[0.66rem]">Explore the Book</a>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section label="Frequently asked questions">
        <SectionHead eyebrow="FAQ" title="Questions, Answered Plainly." />
        <FaqList items={FAQS.slice(0, 7)} testid="home-faq" />
        <div className="mt-8"><Link to="/faq" className="z-btn z-btn-ghost">All Questions</Link></div>
      </Section>

      <WaitlistSection />
    </>
  );
}
