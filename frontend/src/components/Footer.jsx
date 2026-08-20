import { Link } from "react-router-dom";
import { Wordmark } from "./Primitives";

const COLS = [
  { title: "Discover", links: [["Pairs", "/pairs"], ["Looks", "/looks"], ["Trending", "/search"], ["Themes", "/themes"], ["Accessories", "/looks"]] },
  { title: "Services", links: [["Fast Local Fulfilment", "/how-it-works"], ["Instant Fit", "/tailoring"], ["Custom Tailoring", "/tailoring"]] },
  { title: "Business", links: [["Become a Merchant", "/merchants"], ["Partner With Us", "/investors"], ["Investors", "/investors"]] },
  { title: "Company", links: [["About", "/about"], ["Founder", "/founder"], ["FAQ", "/faq"], ["Contact", "/contact"]] },
  { title: "Legal", links: [["Privacy", "/privacy"], ["Terms", "/terms"], ["Refund Policy", "/refund-policy"], ["Merchant Terms", "/merchant-terms"]] },
];

export const Footer = () => (
  <footer data-testid="footer" className="relative overflow-hidden border-t px-5 pb-28 pt-16 sm:px-8 md:pb-16 lg:px-12" style={{ borderColor: "var(--z-border)", background: "var(--z-bg-2)" }}>
    <div className="mx-auto w-full max-w-[1200px]">
      <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(5,1fr)]">
        <div>
          <Wordmark />
          <p className="font-display mt-4 text-sm font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--z-purple-soft)" }}>
            Look Your Best. Today.
          </p>
          <p className="mt-5 text-xs leading-relaxed" style={{ color: "var(--z-text-3)" }}>
            ZYRA is a marketplace being built to connect customers with independent local fashion partners. ZYRA does not
            necessarily own all products displayed. Availability depends on participating merchants, tailoring partners and
            local delivery capacity.
          </p>
        </div>
        {COLS.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <h3 className="text-[0.68rem] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--z-text-2)" }}>{c.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {c.links.map(([label, to]) => (
                <li key={label + to}>
                  <Link to={to} className="text-[0.82rem] transition-colors duration-300 hover:text-white" style={{ color: "var(--z-text-3)" }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="mt-14 flex flex-col gap-4 border-t pt-7 md:flex-row md:items-center md:justify-between" style={{ borderColor: "var(--z-border)" }}>
        <div>
          <p className="text-[0.78rem] font-semibold">Preparing for launch in Delhi NCR</p>
          <p className="mt-1 text-[0.72rem]" style={{ color: "var(--z-text-3)" }}>Delhi • Gurugram • Noida</p>
        </div>
        <p className="text-[0.72rem]" style={{ color: "var(--z-text-3)" }}>© 2026 ZYRA. All rights reserved.</p>
      </div>
    </div>
  </footer>
);
