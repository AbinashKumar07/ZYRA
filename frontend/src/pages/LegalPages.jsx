import Seo from "@/components/Seo";
import { Section, Glow, Disclaimer } from "@/components/Primitives";

const Legal = ({ title, path, description, intro, sections }) => (
  <>
    <Seo title={`${title} — ZYRA`} description={description} path={path} />
    <Section className="relative overflow-hidden pt-36 z-grain" label={`${title} hero`}>
      <Glow className="-right-32 top-10" size={420} />
      <div className="relative max-w-3xl">
        <p className="z-eyebrow">Legal</p>
        <h1 className="font-display mt-4 text-4xl font-extrabold leading-[1] sm:text-5xl">{title}</h1>
        <p className="mt-6 text-sm leading-relaxed" style={{ color: "var(--z-text-2)" }}>{intro}</p>
        <div className="mt-5"><Disclaimer>Last updated June 2026. ZYRA is pre-launch; these terms will be finalized before commercial operations begin and may change.</Disclaimer></div>
      </div>
    </Section>
    <Section label={title}>
      <div className="max-w-3xl space-y-9">
        {sections.map(([h, body]) => (
          <section key={h}>
            <h2 className="font-display text-xl font-bold">{h}</h2>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--z-text-2)" }}>{body}</p>
          </section>
        ))}
      </div>
    </Section>
  </>
);

export const Privacy = () => (
  <Legal title="Privacy Policy" path="/privacy" description="How ZYRA collects, uses and protects the information you share through waitlist, merchant, investor and contact forms."
    intro="This policy explains what ZYRA collects while the platform is in development, and how that information is handled."
    sections={[
      ["What we collect", "Only what you submit through our forms: your name, email, optional phone number, city, and any message or business details you choose to provide. We do not run advertising trackers on this website."],
      ["Why we collect it", "To contact you about the ZYRA launch, to review merchant applications, and to respond to investor, partnership, media and general enquiries."],
      ["How it is stored", "Submissions are stored in ZYRA's private database. Access is restricted to authorised ZYRA team members through a password-protected admin area."],
      ["Sharing", "We do not sell your information. We do not share it with third parties except where required by law or where you have explicitly asked us to connect you with a partner."],
      ["Retention", "We keep submissions for as long as needed to evaluate and respond to them. You may ask us to delete your details at any time via the contact form."],
      ["Your choices", "You can request access, correction or deletion of the information you submitted. Once official contact details are published, they will also be listed here."],
      ["Changes", "As ZYRA moves toward launch this policy will be expanded to cover orders, payments, delivery and tailoring services."],
    ]} />
);

export const Terms = () => (
  <Legal title="Terms of Use" path="/terms" description="The terms that apply to your use of the ZYRA website while the platform is in development."
    intro="These terms apply to the ZYRA website. ZYRA is currently in development and is not processing orders or payments."
    sections={[
      ["Nature of the website", "This website presents ZYRA's intended product experience. Products, PAIRS, Looks and prices shown are demonstration content labelled as Preview or Sample and do not represent confirmed merchant inventory."],
      ["No orders or payments", "No checkout, payment or order confirmation is available. Any “Add to ZYRA Bag” action is illustrative only and directs you to the waitlist."],
      ["Marketplace model", "When ZYRA launches, it will operate as a marketplace connecting customers with independent local fashion partners, independent tailoring professionals and delivery partners. ZYRA does not necessarily own the products displayed."],
      ["Service availability", "Fast local fulfilment, Instant Fit and Custom Tailoring will depend on merchant operating hours, local inventory, distance and partner availability. Nothing on this website is a guaranteed delivery or service commitment."],
      ["Intellectual property", "The ZYRA name, wordmark, copy and design are owned by ZYRA. Theme collections use original theme-inspired styling; we do not reproduce third-party copyrighted characters, logos or artwork."],
      ["Acceptable use", "Do not attempt to disrupt the website, submit false information through our forms, or access the admin area without authorisation."],
      ["Contact", "Questions about these terms can be sent through the contact form."],
    ]} />
);

export const RefundPolicy = () => (
  <Legal title="Refund Policy" path="/refund-policy" description="ZYRA's intended approach to returns, refunds and tailoring services once the platform launches."
    intro="ZYRA is not yet selling products, so no refunds are currently possible. This page sets out the intended approach at launch."
    sections={[
      ["Current status", "No transactions take place on this website. There is nothing to refund at this stage."],
      ["Intended returns approach", "At launch, eligible unworn items with tags intact are intended to be returnable within a defined window from delivery. The exact window will be published before commercial operations begin."],
      ["Items unlikely to be returnable", "Custom-stitched garments, items altered through Instant Fit or Custom Tailoring, fragrances with broken seals, innerwear and pierced jewellery are expected to be non-returnable for hygiene and customisation reasons."],
      ["Tailoring services", "Tailoring is a service performed by an independent tailoring partner. Where work has been completed, service fees are expected to be non-refundable, though we intend to offer corrective refitting where the outcome does not match the confirmed brief."],
      ["Marketplace refunds", "Because ZYRA is a marketplace, refunds will be coordinated between the customer, ZYRA and the merchant partner under the terms of the partnership agreement."],
      ["Final policy", "A complete, binding refund policy will replace this page before ZYRA begins accepting orders."],
    ]} />
);

export const MerchantTerms = () => (
  <Legal title="Merchant Terms" path="/merchant-terms" description="The intended framework for ZYRA merchant partnerships in Delhi NCR, ahead of a signed partnership agreement."
    intro="This page outlines the intended framework for ZYRA merchant partnerships. It is not a binding agreement."
    sections={[
      ["Applying", "Any registered local fashion business can apply through the For Merchants page. Applications are reviewed by the ZYRA Partner team."],
      ["Commercial terms", "No unnecessary upfront barrier. Commercial terms are agreed transparently with each partner according to the ZYRA partnership model. Our intended launch principle is no joining fee and a success-linked commercial model with transparent settlement."],
      ["Listings and inventory", "Partners are responsible for the accuracy of their listings, pricing and stock. Availability shown to customers depends on partner-maintained inventory."],
      ["Fulfilment", "Partners agree to accept, pack and hand over confirmed orders within the operating hours they set, and to meet the quality standard represented in their listings."],
      ["Tailoring and delivery", "Instant Fit and Custom Tailoring are performed by independent tailoring partners. Last-mile delivery is performed by delivery partners. Each service depends on local availability."],
      ["Brand use", "Partners may reference their ZYRA partnership but may not alter the ZYRA wordmark or represent themselves as ZYRA."],
      ["Binding agreement", "All rights, obligations, commissions, settlement cycles and termination conditions will be defined in a signed partnership agreement before any partner goes live."],
    ]} />
);
