import { useEffect } from "react";

const SITE = "ZYRA";

export default function Seo({ title, description, path = "/", image }) {
  const full = title.includes("ZYRA") ? title : `${title} | ${SITE}`;
  const url = `${window.location.origin}${path}`;
  const img = image || `${window.location.origin}/og-zyra.svg`;

  useEffect(() => {
    document.title = full;
    const set = (sel, attrs) => {
      let el = document.head.querySelector(sel);
      if (!el) {
        el = document.createElement(attrs.tag);
        document.head.appendChild(el);
      }
      Object.entries(attrs).forEach(([k, v]) => k !== "tag" && el.setAttribute(k, v));
    };
    set('meta[name="description"]', { tag: "meta", name: "description", content: description });
    set('link[rel="canonical"]', { tag: "link", rel: "canonical", href: url });
    set('meta[property="og:title"]', { tag: "meta", property: "og:title", content: full });
    set('meta[property="og:description"]', { tag: "meta", property: "og:description", content: description });
    set('meta[property="og:url"]', { tag: "meta", property: "og:url", content: url });
    set('meta[property="og:image"]', { tag: "meta", property: "og:image", content: img });
    set('meta[property="og:type"]', { tag: "meta", property: "og:type", content: "website" });
    set('meta[name="twitter:card"]', { tag: "meta", name: "twitter:card", content: "summary_large_image" });
    set('meta[name="twitter:title"]', { tag: "meta", name: "twitter:title", content: full });
    set('meta[name="twitter:description"]', { tag: "meta", name: "twitter:description", content: description });
    set('meta[name="twitter:image"]', { tag: "meta", name: "twitter:image", content: img });
  }, [full, description, url, img]);

  return null;
}
