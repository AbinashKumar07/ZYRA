import { Link } from "react-router-dom";
import Seo from "@/components/Seo";
import { Section, SectionHead, Glow, Badge, Disclaimer } from "@/components/Primitives";
import { LeadForm } from "@/components/LeadForm";
import { WaitlistSection } from "@/components/Shared";
import { BookCard } from "@/components/BookCard";
import { BOOKS, FOUNDER_PHOTO } from "@/data/catalog";

const Hero = ({ eyebrow, title, accent, copy }) => (
  <Section className="relative overflow-hidden pt-36 z-grain" label={`${title} hero`}>
    <Glow className="-left-32 top-10" size={520} />
    <div className="relative max-w-3xl">
      <p className="z-eyebrow">{eyebrow}</p>
      <h1 className="font-display mt-4 text-4xl font-extrabold leading-[0.98] sm:text-5xl lg:text-6xl">
        {title} {accent && <span style={{ color: "var(--z-purple-soft)" }}>{accent}</span>}
      </h1>
      {copy && <p className="mt-6 text-sm leading-relaxed sm:text-base" style={{ color: "var(--z-text-2)" }}>{copy}</p>}
    </div>
  </Section>
);

export function Merchants() {
  return (
    <>
      <Seo title="Become a ZYRA Partner | Grow Your Fashion Business" description="ZYRA helps local fashion businesses in Delhi NCR reach customers beyond their storefront with a digital storefront, Complete Look exposure and delivery infrastructure." path="/merchants" />
      <Hero eyebrow="For merchants" title="Your Store." accent="A Bigger Reach." copy="ZYRA helps local fashion businesses reach customers beyond their storefront." />
      <Section label="Merchant benefits">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[["New local customers", "Reach shoppers nearby who never walked past your shutter."],
            ["Digital storefront", "Your catalogue, presented to ZYRA's standard."],
            ["Additional sales channel", "Alongside whatever you already run."],
            ["Complete Look exposure", "Your pieces appear inside curated PAIRS and Looks."],
            ["Accessory cross-selling", "Attach the details that finish an outfit."],
            ["Customer discovery", "Occasion-first browsing brings intent, not window shopping."],
            ["Technology infrastructure", "Listings, orders and fulfilment in one place."],
            ["Delivery ecosystem", "Local delivery partners handle the last mile."]].map(([t, c]) => (
            <div key={t} className="z-card rounded-2xl p-5">
              <h3 className="font-display text-base font-bold">{t}</h3>
              <p className="mt-2 text-sm" style={{ color: "var(--z-text-2)" }}>{c}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section label="Commercial model" className="border-y" style={{ background: "var(--z-bg-2)" }}>
        <SectionHead eyebrow="Commercial model" title="Transparent, Partner by Partner."
          copy="No unnecessary upfront barrier. Commercial terms are agreed transparently with each partner according to the ZYRA partnership model." />
        <div className="grid gap-4 sm:grid-cols-3">
          {[["No joining fee", "Our intended launch principle."], ["Success-linked model", "Commercials tied to sales, not sign-up."], ["Settlement transparency", "Clear statements on every order."]].map(([t, c]) => (
            <div key={t} className="z-card rounded-2xl p-5">
              <Badge>Intended</Badge>
              <h3 className="font-display mt-3 text-base font-bold">{t}</h3>
              <p className="mt-2 text-sm" style={{ color: "var(--z-text-2)" }}>{c}</p>
            </div>
          ))}
        </div>
        <div className="mt-7 max-w-2xl"><Disclaimer>Final commercial terms are confirmed in a signed partnership agreement. Nothing on this page is a binding commitment.</Disclaimer></div>
      </Section>

      <Section id="apply" label="Merchant application">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <SectionHead eyebrow="Apply" title="Become a ZYRA Partner" copy="Tell us about your store. The ZYRA Partner team reviews every application." />
          <div className="z-card rounded-3xl p-6 sm:p-8">
            <LeadForm type="merchant" testid="merchant-form" cta="Apply to Become a Partner"
              success="Thank you. The ZYRA Partner team will review your details and contact you."
              fields={[
                { name: "name", label: "Full Name", required: true },
                { name: "storeName", label: "Store Name", required: true },
                { name: "phone", label: "Phone", type: "tel", required: true },
                { name: "email", label: "Email", type: "email", required: true },
                { name: "city", label: "City", required: true, placeholder: "Delhi / Gurugram / Noida" },
                { name: "storeLocation", label: "Store Location", required: true },
                { name: "fashionCategory", label: "Fashion Category", type: "select", required: true, options: ["Menswear", "Womenswear", "Ethnic", "Western", "Footwear", "Accessories", "Multi-brand", "Other"] },
                { name: "numberOfStores", label: "Number of Stores", type: "number" },
                { name: "instagramOrWebsite", label: "Instagram / Website" },
                { name: "productCategories", label: "Approximate Product Categories", placeholder: "Shirts, trousers, kurtas…" },
                { name: "message", label: "Message", type: "textarea" },
              ]} />
          </div>
        </div>
      </Section>
      <WaitlistSection />
    </>
  );
}

export function Investors() {
  return (
    <>
      <Seo title="Invest in ZYRA — Build the Future of Fashion Commerce" description="ZYRA is building a hyperlocal fashion commerce marketplace for Delhi NCR. Explore the problem, the model and the differentiation, then start a conversation." path="/investors" />
      <Hero eyebrow="Investors & strategic partners" title="Build the Future of" accent="Fashion Commerce With Us." />
      <Section label="Opportunity">
        <div className="grid gap-6 lg:grid-cols-3">
          {[["The Problem", "Fashion remains fragmented across marketplaces, stores, styling decisions, accessories, fitting and fulfilment."],
            ["The Opportunity", "ZYRA brings these experiences together through a hyperlocal marketplace."],
            ["The Model", "Customer → ZYRA → Local Fashion Partner → Delivery / Tailoring Ecosystem"]].map(([t, c]) => (
            <div key={t} className="z-card rounded-3xl p-7">
              <h2 className="font-display text-xl font-bold">{t}</h2>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--z-text-2)" }}>{c}</p>
            </div>
          ))}
        </div>
        <h2 className="font-display mt-14 mb-5 text-2xl font-bold">Differentiation</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {["PAIR", "Complete Looks", "Accessories", "Occasion-first discovery", "Hyperlocal supply", "Optional fitting", "Scheduled custom tailoring"].map((d) => (
            <div key={d} className="z-card rounded-xl p-4 text-[0.85rem]" style={{ color: "var(--z-text-2)" }}>{d}</div>
          ))}
        </div>
        <div className="mt-9 max-w-2xl"><Disclaimer>ZYRA is pre-launch. We do not publish market sizing, traction, revenue or fundraising status that has not been verified.</Disclaimer></div>
      </Section>

      <Section id="info" label="Investor form" className="border-y" style={{ background: "var(--z-bg-2)" }}>
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <SectionHead eyebrow="Get in touch" title="Partner With ZYRA" copy="Request investor information or open a strategic conversation with the founder." />
          <div className="z-card rounded-3xl p-6 sm:p-8">
            <LeadForm type="investor" testid="investor-form" cta="Start a Conversation" success="Thank you. We'll be in touch to continue the conversation."
              fields={[
                { name: "name", label: "Name", required: true },
                { name: "company", label: "Company", required: true },
                { name: "email", label: "Email", type: "email", required: true },
                { name: "phone", label: "Phone", type: "tel" },
                { name: "partnerType", label: "Investor / Partner Type", type: "select", required: true,
                  options: ["Angel Investor", "Venture Capital", "Strategic Partner", "Fashion Brand", "Retail Partner", "Technology Partner", "Other"] },
                { name: "organization", label: "Organization" },
                { name: "message", label: "Message", type: "textarea", required: true },
              ]} />
          </div>
        </div>
      </Section>
      <div className="px-5 pb-16 text-center sm:px-8"><Link to="/founder" className="z-btn z-btn-ghost">Meet Abinash</Link></div>
    </>
  );
}

export function Founder() {
  return (
    <>
      <Seo title="Abinash Kumar — Author & Founder of ZYRA" description="Abinash Kumar is a writer, content strategist and the founder of ZYRA, author of Human Psychology & Behaviour and co-author of Wake Up, or Burn Out." path="/founder" />
      <Section className="relative overflow-hidden pt-36 z-grain" label="Founder hero">
        <Glow className="-right-40 top-0" size={560} />
        <div className="relative grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <figure className="relative overflow-hidden rounded-3xl border" style={{ borderColor: "var(--z-border)" }} data-testid="founder-photo">
            <img src={FOUNDER_PHOTO} alt="Abinash Kumar, Author and Founder of ZYRA" className="aspect-[4/5] w-full object-cover object-top" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(5,5,5,0.55), transparent 55%)" }} />
            <figcaption className="absolute inset-x-5 bottom-5">
              <p className="font-display text-lg font-bold">Abinash Kumar</p>
              <p className="text-[0.68rem] uppercase tracking-[0.18em]" style={{ color: "var(--z-purple-soft)" }}>Author &amp; Founder</p>
            </figcaption>
          </figure>
          <div>
            <p className="z-eyebrow">The founder</p>
            <h1 className="font-display mt-4 text-4xl font-extrabold leading-[0.98] sm:text-5xl">Meet the Mind Behind ZYRA</h1>
            <p className="font-display mt-7 text-2xl font-bold">Abinash Kumar</p>
            <p className="mt-1 text-[0.75rem] uppercase tracking-[0.18em]" style={{ color: "var(--z-purple-soft)" }}>Author &amp; Founder</p>
            <p className="mt-6 text-sm leading-relaxed sm:text-base" style={{ color: "var(--z-text-2)" }}>
              Author, strategist, and founder of ZYRA. Abinash Kumar combines a deep analytical study of human behavior,
              presentation, and self-sovereignty to craft purpose-driven lifestyle and apparel experiences.
            </p>
          </div>
        </div>
      </Section>

      <Section label="Founder biography">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <SectionHead eyebrow="Long form" title="The Long Version" />
            <p className="text-sm leading-relaxed sm:text-base" style={{ color: "var(--z-text-2)" }}>
              Abinash Kumar is a writer, content strategist, and the founder of ZYRA. Having authored <em>Human Psychology &amp;
              Behaviour</em> and co-authored <em>Wake Up, or Burn Out</em>, his work explores the intersection of internal mastery,
              personal presentation, and intentional living. From navigating early career challenges to building independent
              creative ventures, Abinash established ZYRA as an expression of personal sovereignty and discipline. He believes
              that external aesthetics are a direct extension of one's internal standards, designing ZYRA for individuals who
              approach life with purpose, precision, and unapologetic self-respect.
            </p>
          </div>
          <div className="space-y-5">
            <div className="z-card rounded-2xl p-5">
              <p className="z-eyebrow">Education</p>
              <p className="mt-2 text-sm" style={{ color: "var(--z-text-2)" }}>Background in commerce, strategic analysis, and behavioral philosophy.</p>
            </div>
            <div className="z-card rounded-2xl p-5">
              <p className="z-eyebrow">Professional experience</p>
              <ul className="mt-3 space-y-3 text-sm">
                <li><span className="font-semibold">Founder</span> — ZYRA</li>
                <li><span className="font-semibold">Published Author &amp; Researcher</span> — <em>Human Psychology &amp; Behaviour</em> and <em>Wake Up, or Burn Out</em></li>
                <li><span className="font-semibold">Content Strategist</span> — Ad-Tech &amp; Digital Media, MoMagic Technologies</li>
                <li><span className="font-semibold">Digital Brand &amp; Content Consultant</span></li>
              </ul>
              <p className="mt-4 text-[0.7rem] uppercase tracking-[0.16em]" style={{ color: "var(--z-text-3)" }}>Specialized in</p>
              <p className="mt-1.5 text-sm" style={{ color: "var(--z-text-2)" }}>High-performance digital strategy · CTR optimization · Brand storytelling</p>
            </div>
          </div>
        </div>
      </Section>

      <Section label="Why ZYRA" className="relative overflow-hidden border-y" style={{ background: "var(--z-bg-2)" }}>
        <Glow className="-left-40 top-0" size={480} />
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="z-eyebrow">Why Abinash founded ZYRA</p>
          <blockquote className="font-display mt-7 text-2xl font-bold leading-[1.25] sm:text-3xl lg:text-4xl">
            “ZYRA was born out of the conviction that what you wear is your armor in the social arena. In a world that often
            encourages passive conformity, ZYRA was built for the self-guided individual who treats personal presentation not
            as vanity, but as a deliberate statement of self-sovereignty, focus, and quiet strength.”
          </blockquote>
        </div>
      </Section>

      <Section label="Founder philosophy">
        <div className="mx-auto max-w-3xl">
          <p className="z-eyebrow">Philosophy</p>
          <blockquote className="mt-6 border-l-2 pl-7" style={{ borderColor: "var(--z-purple)" }}>
            <p className="font-display text-xl font-semibold leading-relaxed sm:text-2xl">
              “The world observes form before it understands substance. True style is not about seeking validation from the
              crowd; it is the outward alignment of internal discipline and self-respect. In business and in fashion, scarcity
              creates value, and intentional design commands respect without needing to make noise.”
            </p>
          </blockquote>
        </div>
      </Section>

      <Section label="Books" className="border-y" style={{ background: "var(--z-bg-2)" }}>
        <SectionHead eyebrow="Before ZYRA" title="Written Before ZYRA"
          copy="The same curiosity about human behaviour that shaped Abinash's writing informs the way ZYRA thinks about personal presentation, decision-making, confidence, and identity." />
        <div className="grid gap-6 sm:grid-cols-2">
          {BOOKS.map((b) => <BookCard key={b.id} book={b} />)}
        </div>
        <p className="mt-8 font-display text-lg font-semibold" style={{ color: "var(--z-purple-soft)" }}>
          Human Behaviour → Personal Presentation → Intentional Living → ZYRA
        </p>
      </Section>
      <WaitlistSection />
    </>
  );
}
