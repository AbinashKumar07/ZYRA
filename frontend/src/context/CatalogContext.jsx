import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { fetchPublicContent } from "@/lib/api";
import { PRODUCTS, PAIRS, LOOKS, THEMES, FAQS } from "@/data/catalog";

const CatalogContext = createContext(null);

const STATIC = { product: PRODUCTS, pair: PAIRS, look: LOOKS, theme: THEMES, faq: FAQS };

/** CMS items win when the team has published any of that type; otherwise the
 *  built-in preview collection is used so the site is never empty. */
const merge = (type, cmsItems) => {
  const published = cmsItems.filter((i) => i.type === type).map((i) => ({ ...i.data, id: i.data?.id || i.slug, cms: true }));
  return published.length ? published : STATIC[type];
};

export const CatalogProvider = ({ children }) => {
  const [cms, setCms] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetchPublicContent()
      .then(setCms)
      .catch(() => setCms([]))
      .finally(() => setReady(true));
  }, []);

  const value = useMemo(
    () => ({
      ready,
      cmsCount: cms.length,
      products: merge("product", cms),
      pairs: merge("pair", cms),
      looks: merge("look", cms),
      themes: merge("theme", cms),
      faqs: merge("faq", cms),
      home: cms.filter((i) => i.type === "home").map((i) => i.data),
    }),
    [cms, ready]
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
};

export const useCatalog = () => useContext(CatalogContext) || {
  ready: true, cmsCount: 0, products: PRODUCTS, pairs: PAIRS, looks: LOOKS, themes: THEMES, faqs: FAQS, home: [],
};
