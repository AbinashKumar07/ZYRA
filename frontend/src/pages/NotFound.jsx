import { Link } from "react-router-dom";
import Seo from "@/components/Seo";
import { Section, Glow } from "@/components/Primitives";

export default function NotFound() {
  return (
    <>
      <Seo title="Page Not Found — ZYRA" description="This ZYRA page could not be found." path="/404" />
      <Section className="relative overflow-hidden pt-40 z-grain" label="Not found">
        <Glow className="-left-32 top-10" size={480} />
        <div className="relative max-w-2xl">
          <p className="z-eyebrow">404</p>
          <h1 className="font-display mt-4 text-4xl font-extrabold leading-[1] sm:text-5xl lg:text-6xl">
            Looks like this look <span style={{ color: "var(--z-purple-soft)" }}>got lost.</span>
          </h1>
          <Link to="/" className="z-btn z-btn-primary mt-9" data-testid="notfound-cta">Back to ZYRA</Link>
        </div>
      </Section>
    </>
  );
}
