import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, Search } from "lucide-react";
import { Wordmark } from "./Primitives";
import ThemeToggle from "./ThemeToggle";
import AuthDropdown from "./AuthDropdown"; // <-- Imported the new dropdown

const LINKS = [
  { to: "/how-it-works", label: "Discover" },
  { to: "/pairs", label: "Pairs" },
  { to: "/looks", label: "Looks" },
  { to: "/themes", label: "Themes" },
  { to: "/tailoring", label: "Tailoring" },
  { to: "/merchants", label: "For Merchants" },
  { to: "/about", label: "About" },
];

export const Navbar = () => {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      data-testid="navbar"
      className="fixed inset-x-0 top-0 z-50 transition-colors duration-500"
      style={{
        // Swapped hardcoded dark rgba for your dynamic background variable
        background: solid || open ? "var(--z-bg)" : "transparent",
        backdropFilter: solid || open ? "blur(18px)" : "none",
        borderBottom: solid || open ? "1px solid var(--z-border)" : "1px solid transparent",
      }}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1300px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
        <Wordmark small />

        <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              data-testid={`nav-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
              className="whitespace-nowrap text-[0.75rem] font-medium uppercase tracking-[0.14em] transition-colors duration-300"
              style={({ isActive }) => ({ color: isActive ? "var(--z-purple-soft)" : "var(--z-text-2)" })}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/search" aria-label="Search ZYRA" data-testid="nav-search" className="rounded-full p-2 transition-colors hover:bg-white/5">
            <Search size={17} style={{ color: "var(--z-text-2)" }} />
          </Link>
          
          <Link to="/#waitlist" data-testid="nav-waitlist" className="z-btn z-btn-primary hidden whitespace-nowrap !px-5 !py-2.5 !text-[0.7rem] lg:inline-flex">
            Join Waitlist
          </Link>
          
          {/* Swapped "Partner With Us" for the new Dropdown */}
          <div className="hidden xl:block">
             <AuthDropdown />
          </div>

          <ThemeToggle />

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            data-testid="mobile-menu-toggle"
            onClick={() => setOpen((v) => !v)}
            className="rounded-full p-2 transition-colors hover:bg-white/5 lg:hidden"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div data-testid="mobile-drawer" className="border-t lg:hidden" style={{ borderColor: "var(--z-border)" }}>
          <nav aria-label="Mobile" className="flex flex-col px-5 py-4">
            {LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                data-testid={`mobile-nav-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
                className="border-b py-3.5 font-display text-lg font-semibold"
                style={{ borderColor: "var(--z-border)" }}
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-5 flex flex-col gap-3">
              <Link to="/#waitlist" className="z-btn z-btn-primary w-full">Join Waitlist</Link>
              {/* Also updated the mobile menu to show Auth instead of Partner */}
              <AuthDropdown />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};