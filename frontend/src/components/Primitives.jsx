import { Link } from "react-router-dom";

export const Wordmark = ({ className = "", small = false }) => (
  <Link to="/" aria-label="ZYRA home" data-testid="zyra-wordmark" className={`inline-flex items-baseline gap-[3px] ${className}`}>
    <span
      // Replaced text-white with the dynamic text variable so it flips between black and white automatically
      className="font-display font-extrabold uppercase text-[var(--z-text)] transition-colors duration-400"
      style={{ letterSpacing: small ? "0.16em" : "0.2em", fontSize: small ? "1.05rem" : "1.35rem" }}
    >
      ZYR
    </span>
    <span
      className="font-display font-extrabold uppercase transition-colors duration-400"
      style={{ letterSpacing: "0.06em", fontSize: small ? "1.05rem" : "1.35rem", color: "var(--z-purple-soft)" }}
    >
      A
    </span>
    <span className="h-[5px] w-[5px] rounded-full transition-colors duration-400" style={{ background: "var(--z-purple)" }} aria-hidden="true" />
  </Link>
);

export const Eyebrow = ({ children }) => <p className="z-eyebrow">{children}</p>;

export const Badge = ({ children, tone = "purple" }) => (
  <span
    className="inline-flex items-center rounded-full px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em]"
    style={
      tone === "purple"
        ? { background: "rgba(124,58,237,0.14)", color: "var(--z-purple-soft)", border: "1px solid rgba(167,139,250,0.28)" }
        : { background: "rgba(255,255,255,0.05)", color: "var(--z-text-2)", border: "1px solid var(--z-border)" }
    }
  >
    {children}
  </span>
);

export const Section = ({ id, children, className = "", label, style }) => (
  <section id={id} aria-label={label} style={style} className={`relative px-5 py-20 sm:px-8 md:py-28 lg:px-12 ${className}`}>
    <div className="mx-auto w-full max-w-[1200px]">{children}</div>
  </section>
);

export const SectionHead = ({ eyebrow, title, copy, align = "left" }) => (
  <header className={`mb-12 max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
    {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
    <h2 className="font-display mt-3 text-3xl font-bold leading-[1.08] sm:text-4xl lg:text-5xl">{title}</h2>
    {copy && <p className="mt-5 text-sm leading-relaxed sm:text-base transition-colors duration-400" style={{ color: "var(--z-text-2)" }}>{copy}</p>}
  </header>
);

export const Glow = ({ className = "", size = 480 }) => (
  <span className={`z-glow ${className}`} style={{ width: size, height: size }} aria-hidden="true" />
);

export const EmptyState = ({ title, copy, action }) => (
  <div className="z-card rounded-2xl px-6 py-16 text-center" data-testid="empty-state">
    <h3 className="font-display text-xl font-bold">{title}</h3>
    {copy && <p className="mx-auto mt-3 max-w-md text-sm transition-colors duration-400" style={{ color: "var(--z-text-2)" }}>{copy}</p>}
    {action && <div className="mt-7">{action}</div>}
  </div>
);

export const CardSkeleton = () => (
  <div className="rounded-2xl border p-3 transition-colors duration-400" style={{ borderColor: "var(--z-border)" }}>
    <div className="z-skel aspect-[3/4] w-full rounded-xl" />
    <div className="z-skel mt-4 h-3.5 w-3/4 rounded" />
    <div className="z-skel mt-2 h-3 w-1/3 rounded" />
  </div>
);

export const Disclaimer = ({ children }) => (
  <span className="block text-[0.7rem] leading-relaxed transition-colors duration-400" style={{ color: "var(--z-text-3)" }}>{children}</span>
);