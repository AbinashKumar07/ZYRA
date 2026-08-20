import { Section, SectionHead, Glow, Disclaimer } from "@/components/Primitives";
import { LeadForm, WAITLIST_FIELDS } from "@/components/LeadForm";
import { Link } from "react-router-dom";

export const WaitlistSection = () => (
  <Section id="waitlist" className="relative overflow-hidden z-grain" label="Join the ZYRA waitlist">
    <Glow className="-right-40 top-0" size={520} />
    <div className="relative grid gap-12 lg:grid-cols-[1fr_1.1fr]">
      <div>
        <SectionHead
          eyebrow="Ready for the moment?"
          title="READY FOR THE MOMENT?"
          copy="ZYRA is being built for the moments when looking your best isn't optional."
        />
        <div className="flex flex-wrap gap-3">
          <Link to="/merchants" className="z-btn z-btn-ghost" data-testid="final-merchant-cta">Become a ZYRA Partner</Link>
        </div>
        <div className="mt-8">
          <Disclaimer>
            ZYRA is currently in development and preparing for launch in Delhi NCR — Delhi, Gurugram and Noida.
          </Disclaimer>
        </div>
      </div>
      <div className="z-card rounded-3xl p-6 sm:p-8">
        <h3 className="font-display text-xl font-bold">Join the ZYRA Waitlist</h3>
        <p className="mt-2 text-sm" style={{ color: "var(--z-text-2)" }}>Be among the first to shop when we open.</p>
        <div className="mt-6">
          <LeadForm
            type="waitlist"
            testid="waitlist-form"
            fields={WAITLIST_FIELDS}
            cta="Join the ZYRA Waitlist"
            success="You're on the list. ZYRA is coming to Delhi NCR."
          />
        </div>
      </div>
    </div>
  </Section>
);

export const MobileStickyCta = () => (
  <div
    data-testid="mobile-sticky-cta"
    className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t px-4 py-3 md:hidden"
    style={{ background: "rgba(5,5,5,0.92)", backdropFilter: "blur(16px)", borderColor: "var(--z-border)" }}
  >
    <Link to="/#waitlist" className="z-btn z-btn-primary flex-1 !py-3">Join Waitlist</Link>
    <Link to="/search" aria-label="Search ZYRA" className="z-btn z-btn-ghost !px-4 !py-3">Search</Link>
  </div>
);
