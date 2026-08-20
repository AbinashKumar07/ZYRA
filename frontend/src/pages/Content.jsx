import { Link } from "react-router-dom";
import Seo from "@/components/Seo";
import { Section, SectionHead, Glow, Badge, Disclaimer } from "@/components/Primitives";
import { WaitlistSection } from "@/components/Shared";
import { FaqList } from "@/components/FaqList";
import { FAQS, FUTURE_VISION, IMAGES } from "@/data/catalog";
import { LeadForm } from "@/components/LeadForm";
import { BookingFlow, BookingTracker, InstantFitPanel } from "@/components/BookingFlow";
import { useCatalog } from "@/context/CatalogContext";

const Hero = ({ eyebrow, title, copy, accent }) => (
  <Section className="relative overflow-hidden pt-36 z-grain" label={`${title} hero`}>
    <Glow className="-right-32 top-10" size={500} />
    <div className="relative max-w-3xl">
      <p className="z-eyebrow">{eyebrow}</p>
      <h1 className="font-display mt-4 text-4xl font-extrabold leading-[0.98] sm:text-5xl lg:text-6xl">
        {title} {accent && <span style={{ color: "var(--z-purple-soft)" }}>{accent}</span>}
      </h1>
      {copy && <p className="mt-6 text-sm leading-relaxed sm:text-base" style={{ color: "var(--z-text-2)" }}>{copy}</p>}
    </div>
  </Section>
);

export function About() {
  const blocks = [
    ["What ZYRA is", "ZYRA is a hyperlocal fashion commerce platform being built to make fashion shopping faster, easier, more curated, and more complete — connecting customers with nearby fashion merchants."],
    ["Why ZYRA exists", "People don't just buy clothes. They buy confidence, identity, preparation, and the feeling of being ready for the moment. ZYRA exists to turn “I don't know what to wear” into “I'm ready.”"],
    ["The fashion problem", "Fashion is fragmented. Products live in one place, styling advice in another, accessories somewhere else, and fit is discovered too late."],
    ["The ZYRA approach", "Start with the occasion, not the SKU. Then bring together the pieces, the accessories, the fit and the local supply that make the outfit real."],
    ["PAIR", "Complementary pieces brought together into one ready-to-shop combination, so you stop wondering what goes with what."],
    ["Complete Looks", "Occasion-led combinations that include the accessories which finish the outfit."],
    ["Accessories", "Shoes, watches, belts, wallets, bags, jewellery, fragrances, sunglasses and scarves — selected to work with what you chose."],
    ["Tailoring", "Optional Instant Fit for minor adjustments, and scheduled Custom Tailoring for complex garments, delivered by independent tailoring partners."],
    ["Local merchants", "ZYRA is a marketplace. Inventory, pricing and availability come from participating local fashion partners."],
    ["Future vision", "Broader city coverage, wider fulfilment hours, smarter styling and deeper personalisation — introduced only when they genuinely work."],
  ];
  return (
    <>
      <Seo title="About ZYRA — Hyperlocal Fashion Commerce for Delhi NCR" description="ZYRA is a hyperlocal fashion commerce platform in development, preparing to launch in Delhi NCR with PAIRS, Complete Looks, accessories and tailoring." path="/about" />
      <Hero eyebrow="About" title="Fashion, Brought" accent="Together." copy="ZYRA is currently in development and preparing for launch in Delhi NCR — Delhi, Gurugram and Noida." />
      <Section label="Company story">
        <div className="grid gap-x-14 gap-y-12 md:grid-cols-2">
          {blocks.map(([t, c], i) => (
            <article key={t}>
              <p className="font-display text-2xl font-extrabold" style={{ color: "rgba(167,139,250,0.3)" }}>{String(i + 1).padStart(2, "0")}</p>
              <h2 className="font-display mt-3 text-xl font-bold">{t}</h2>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--z-text-2)" }}>{c}</p>
            </article>
          ))}
        </div>
      </Section>
      <Section label="Future vision" className="border-y" style={{ background: "var(--z-bg-2)" }}>
        <SectionHead eyebrow="Not yet live" title="Future Vision" copy="Directions ZYRA is designed to grow into. None of these are operational today." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FUTURE_VISION.map((f) => (
            <div key={f.title} className="z-card rounded-2xl p-5">
              <Badge tone="grey">{f.tag}</Badge>
              <h3 className="font-display mt-3 text-base font-bold">{f.title}</h3>
              <p className="mt-1.5 text-sm" style={{ color: "var(--z-text-2)" }}>{f.note}</p>
            </div>
          ))}
        </div>
      </Section>
      <WaitlistSection />
    </>
  );
}

const JOURNEYS = [
  ["Customer", ["Discover", "Choose", "Customize", "Order", "Receive"]],
  ["Merchant", ["Join", "List", "Accept", "Pack", "Fulfil", "Earn"]],
  ["Tailor", ["Register", "Set Availability", "Accept", "Serve", "Get Paid"]],
  ["Delivery Partner", ["Register", "Go Online", "Accept", "Pickup", "Deliver", "Earn"]],
];

export function HowItWorks() {
  return (
    <>
      <Seo title="How ZYRA Works — Customers, Merchants, Tailors & Delivery Partners" description="See how ZYRA works for customers, merchant partners, independent tailoring professionals and delivery partners." path="/how-it-works" />
      <Hero eyebrow="How it works" title="Four Journeys." accent="One Platform." copy="ZYRA is a marketplace. Everything works because four groups of people work together." />
      <Section label="Journeys">
        <div className="space-y-12">
          {JOURNEYS.map(([who, steps]) => (
            <div key={who}>
              <h2 className="font-display mb-5 text-2xl font-bold">{who}</h2>
              <ol className="z-scroll-x pb-2 lg:grid lg:grid-cols-6 lg:gap-4 lg:overflow-visible">
                {steps.map((s, i) => (
                  <li key={s} className="z-card relative w-[46vw] max-w-[190px] rounded-2xl p-5 lg:w-auto lg:max-w-none">
                    <span className="font-display text-lg font-extrabold" style={{ color: "rgba(167,139,250,0.4)" }}>{String(i + 1).padStart(2, "0")}</span>
                    <p className="font-display mt-2 text-[0.95rem] font-bold">{s}</p>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
        <div className="mt-12 max-w-2xl"><Disclaimer>ZYRA works with independent merchants, independent tailoring professionals and delivery partners. Availability of each service depends on local partner participation and operating hours.</Disclaimer></div>
      </Section>
      <WaitlistSection />
    </>
  );
}

export function Tailoring() {
  return (
    <>
      <Seo title="ZYRA Tailoring — Instant Fit & Custom Tailoring" description="ZYRA Tailoring offers optional Instant Fit for minor adjustments and scheduled Custom Tailoring for suits, sherwanis, tuxedos and bridal wear in Delhi NCR." path="/tailoring" />
      <Hero eyebrow="Tailoring" title="Fit Shouldn't Be" accent="an Afterthought." copy="Two services, delivered by independent tailoring partners who choose their own availability through the ZYRA Tailor platform." />
      <Section label="Tailoring services">
        <div className="grid gap-6 lg:grid-cols-2">
          <article className="z-card rounded-3xl p-7">
            <Badge>Service 01</Badge>
            <h2 className="font-display mt-4 text-2xl font-bold">Instant Fit</h2>
            <p className="mt-3 text-sm" style={{ color: "var(--z-text-2)" }}>For minor adjustments, offered at your choice — never automatically added.</p>
            <ul className="mt-5 space-y-2 text-sm" style={{ color: "var(--z-text-2)" }}>
              {["Pant hemming", "Sleeve shortening", "Waist adjustment", "Button replacement", "Minor fitting"].map((x) => <li key={x}>· {x}</li>)}
            </ul>
            <dl className="mt-6 grid grid-cols-3 gap-3 text-[0.78rem]">
              <div><dt style={{ color: "var(--z-text-3)" }}>Available Tailor</dt><dd>Shown at checkout</dd></div>
              <div><dt style={{ color: "var(--z-text-3)" }}>Estimated Service Fee</dt><dd>Quoted per garment</dd></div>
              <div><dt style={{ color: "var(--z-text-3)" }}>Estimated Arrival</dt><dd>Shared on confirmation</dd></div>
            </dl>
            <div className="mt-5"><Disclaimer>Subject to local tailor availability.</Disclaimer></div>
            <p className="mt-4 rounded-xl px-4 py-3 text-[0.78rem]" style={{ background: "rgba(255,255,255,0.03)", color: "var(--z-text-2)" }}>
              No tailor is available right now. Try another time or continue without fitting.
            </p>
          </article>

          <article className="z-card rounded-3xl p-7">
            <Badge>Service 02</Badge>
            <h2 className="font-display mt-4 text-2xl font-bold">Book Custom Tailoring</h2>
            <p className="mt-3 text-sm" style={{ color: "var(--z-text-2)" }}>A scheduled premium service for complex garments — sherwani, suit, tuxedo, bridal wear, major alterations and custom stitching.</p>
            <ol className="mt-6 space-y-2.5">
              {["Choose garment", "Choose service", "Select date & time", "Provide measurements or request a measurement visit", "Tailor confirmation", "Custom work", "Fitting & finalization"].map((s, i) => (
                <li key={s} className="flex gap-3 text-sm">
                  <span className="font-display font-bold" style={{ color: "var(--z-purple-soft)" }}>{String(i + 1).padStart(2, "0")}</span>
                  <span style={{ color: "var(--z-text-2)" }}>{s}</span>
                </li>
              ))}
            </ol>
            <Link to="/tailoring#book" className="z-btn z-btn-primary mt-7" data-testid="book-tailoring-cta">Book Custom Tailoring</Link>
            <div className="mt-4"><Disclaimer>Service subject to confirmation by an Independent Tailoring Partner.</Disclaimer></div>
          </article>
        </div>
      </Section>
      <Section id="book" label="Custom tailoring booking" className="border-y" style={{ background: "var(--z-bg-2)" }}>
        <SectionHead eyebrow="Book custom tailoring" title="Choose a Date. A Partner Confirms It."
          copy="Pick the garment, service, date and slot. Your appointment is a request until an independent tailoring partner accepts it — we never confirm on their behalf." />
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <BookingFlow />
          <div className="space-y-6">
            <BookingTracker />
            <InstantFitPanel />
          </div>
        </div>
      </Section>

      <Section label="Tailor availability model" className="border-b" style={{ background: "var(--z-bg-2)" }}>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          <div className="overflow-hidden rounded-3xl border" style={{ borderColor: "var(--z-border)" }}>
            <img src={IMAGES.threads} alt="Spools of thread in a tailoring shop window" loading="lazy" className="aspect-[4/3] w-full object-cover" />
          </div>
          <div>
            <SectionHead eyebrow="Availability model" title="Independent Tailoring Partners"
              copy="ZYRA works with independent tailoring professionals who choose their availability through the ZYRA Tailor platform." />
            <ul className="space-y-2 text-sm" style={{ color: "var(--z-text-2)" }}>
              <li>· Availability-based service</li>
              <li>· Service subject to confirmation</li>
              <li>· ZYRA does not employ every tailor on the platform</li>
            </ul>
          </div>
        </div>
      </Section>
      <WaitlistSection />
    </>
  );
}

export function Faq() {
  const { faqs } = useCatalog();
  return (
    <>
      <Seo title="ZYRA FAQ — Launch, PAIR, Looks, Tailoring & Delivery" description="Answers about ZYRA's launch in Delhi NCR, PAIR, Complete Looks, delivery expectations, Instant Fit, Custom Tailoring and partnerships." path="/faq" />
      <Hero eyebrow="FAQ" title="Questions," accent="Answered Plainly." />
      <Section label="FAQ list"><FaqList items={FAQS} testid="faq" /></Section>
      <WaitlistSection />
    </>
  );
}

export function Contact() {
  return (
    <>
      <Seo title="Contact ZYRA — Customers, Merchants, Investors & Media" description="Get in touch with the ZYRA team about shopping, merchant partnership, investment, partnerships or media." path="/contact" />
      <Hero eyebrow="Contact" title="Start a" accent="Conversation." copy="Official business contact details are being finalized. In the meantime, this form reaches the ZYRA team directly." />
      <Section label="Contact">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="space-y-5">
            {[["Business email", "Coming soon"], ["Phone", "Coming soon"], ["Office", "Delhi NCR"]].map(([k, v]) => (
              <div key={k} className="z-card rounded-2xl p-5">
                <p className="text-[0.66rem] uppercase tracking-[0.18em]" style={{ color: "var(--z-text-3)" }}>{k}</p>
                <p className="font-display mt-1.5 text-base font-bold">{v}</p>
              </div>
            ))}
            <Disclaimer>We publish contact details only once they are live. Nothing here is a placeholder for a real number.</Disclaimer>
          </div>
          <div className="z-card rounded-3xl p-6 sm:p-8">
            <LeadForm type="contact" testid="contact-form" cta="Start the Conversation" success="Message received. The ZYRA team will get back to you."
              fields={[
                { name: "name", label: "Name", required: true },
                { name: "email", label: "Email", type: "email", required: true },
                { name: "phone", label: "Phone", type: "tel" },
                { name: "reason", label: "Reason for contacting", type: "select", required: true, options: ["Customer", "Merchant", "Investor", "Partnership", "Media", "General"] },
                { name: "message", label: "Message", type: "textarea", required: true, placeholder: "Tell us what you need." },
              ]} />
          </div>
        </div>
      </Section>
    </>
  );
}
