// ZYRA preview catalogue — demonstration content only (not real merchant inventory).
const IMG = {
  heroMan: "https://images.unsplash.com/photo-1536303158031-c868b371399f?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
  heroWoman: "https://images.unsplash.com/photo-1634733049839-0292be607569?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
  smoke: "https://images.unsplash.com/photo-1643320477860-e903e4af260b?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
  blonde: "https://images.unsplash.com/photo-1779911915373-ebeed44faff4?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
  formalWhite: "https://images.unsplash.com/photo-1675667804657-be9a9d0a6860?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
  blackSuit: "https://images.unsplash.com/photo-1784841399279-7e25f456d41a?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
  denim: "https://images.unsplash.com/photo-1626302010471-87735c78d04b?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
  blazer: "https://images.unsplash.com/photo-1775680978611-4bbc221f3944?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
  sherwani: "https://images.unsplash.com/photo-1729347917808-e3e35a462fec?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
  kurta: "https://images.unsplash.com/photo-1670296047577-36c2c1281a85?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
  bandhgala: "https://images.unsplash.com/photo-1785612160009-7b32a5afe875?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
  weddingEthnic: "https://images.unsplash.com/photo-1729347917808-e3e35a462fec?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
  accFlat: "https://images.unsplash.com/photo-1637868796504-32f45a96d5a0?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
  shoesWatch: "https://images.unsplash.com/photo-1581615394832-6435e81c491b?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
  watchWrist: "https://images.unsplash.com/photo-1709600677254-0e961c8ed94e?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
  shoesGlasses: "https://images.unsplash.com/photo-1542702942-01343dd60a84?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
  dressWhite: "https://images.unsplash.com/photo-1667890786333-ddb32e7e0d6e?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
  dressBlack: "https://images.unsplash.com/photo-1776697453034-17d1942cd02a?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
  dressSlip: "https://images.unsplash.com/photo-1784139024177-92007560530d?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
  dressWhite2: "https://images.unsplash.com/photo-1667890786022-98704b9b8fcb?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
  atelier: "https://images.unsplash.com/photo-1770910195240-ddec777b77f6?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400",
  threads: "https://images.unsplash.com/photo-1771555557406-d1cae82cdbca?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400",
};

export const IMAGES = IMG;

export const COLORS = ["Black", "White", "Navy", "Beige", "Olive"];
export const SIZES = ["S", "M", "L", "XL", "XXL"];

const p = (id, name, category, subcategory, price, image, colors, sizes, occasion, style, material, gender, description) => ({
  id, name, category, subcategory, price, image, colors, sizes, occasion, style, material, gender, description,
  demo: true, availability: "Availability confirmed by your nearest ZYRA Partner",
});

export const PRODUCTS = [
  p("p1", "Structured Black Overshirt", "Shirts", "Overshirt", 2499, IMG.blackSuit, ["Black", "Olive"], SIZES, ["Party", "Casual", "Date Night"], "Contemporary", "Cotton twill", "Men", "A sharp, structured overshirt with a clean shoulder line — built to layer over almost anything."),
  p("p2", "Premium Linen Shirt", "Shirts", "Linen", 1899, IMG.formalWhite, ["White", "Beige", "Navy"], SIZES, ["Office", "Travel", "Casual"], "Minimal", "100% linen", "Men", "Breathable linen with a relaxed drape for long days and warm cities."),
  p("p3", "Relaxed Tailored Trousers", "Trousers", "Tailored", 2299, IMG.blazer, ["Black", "Beige", "Navy"], SIZES, ["Office", "Interview", "Formal"], "Tailored", "Wool blend", "Men", "Tailored through the hip, relaxed through the leg. Holds a crease, moves like knit."),
  p("p4", "Textured Resort Shirt", "Shirts", "Resort", 2199, IMG.denim, ["Beige", "Olive", "White"], SIZES, ["Travel", "Casual", "Party"], "Resort", "Textured cotton", "Men", "Open-collar resort shirt with quiet texture and an easy silhouette."),
  p("p5", "Contemporary Kurta Set", "Kurtas", "Kurta Set", 3499, IMG.kurta, ["Beige", "Olive", "White"], SIZES, ["Festival", "Wedding"], "Ethnic", "Cotton silk", "Men", "A modern kurta set cut with restraint — festive without the noise."),
  p("p6", "Minimal Leather Loafers", "Footwear", "Loafers", 2799, IMG.shoesGlasses, ["Black", "Beige"], ["6", "7", "8", "9", "10", "11"], ["Office", "Formal", "Date Night"], "Minimal", "Full-grain leather", "Unisex", "Unlined loafers with a low profile sole. Formal enough, easy enough."),
  p("p7", "Ivory Ceremonial Sherwani", "Sherwanis", "Sherwani", 12999, IMG.sherwani, ["Beige", "White"], SIZES, ["Wedding"], "Ethnic", "Raw silk", "Men", "A ceremonial silhouette with hand-finished detail, made to be tailored to you."),
  p("p8", "Printed Bandhgala Jacket", "Jackets", "Bandhgala", 7499, IMG.bandhgala, ["Black", "Navy"], SIZES, ["Wedding", "Festival", "Party"], "Ethnic", "Brocade", "Men", "A statement bandhgala that turns a plain kurta into an occasion."),
  p("p9", "Midnight Slip Dress", "Dresses", "Slip", 2899, IMG.dressSlip, ["Black", "Navy"], SIZES, ["Date Night", "Party"], "Contemporary", "Satin blend", "Women", "A bias-cut slip that reads elegant in low light and easy in daylight."),
  p("p10", "Black Lace Evening Dress", "Dresses", "Evening", 4299, IMG.dressBlack, ["Black"], SIZES, ["Party", "Date Night"], "Evening", "Lace overlay", "Women", "Structured bodice, soft lace fall — an evening piece with intent."),
  p("p11", "Ivory Column Dress", "Dresses", "Column", 3399, IMG.dressWhite, ["White", "Beige"], SIZES, ["Office", "Date Night", "Formal"], "Minimal", "Ponte knit", "Women", "A clean column dress that behaves under a blazer and stands alone after six."),
  p("p12", "Sculpted Knit Dress", "Dresses", "Knit", 2699, IMG.dressWhite2, ["White", "Black", "Beige"], SIZES, ["Casual", "College", "Date Night"], "Minimal", "Compact knit", "Women", "Compact knit with a sculpted line. Simple, and deliberately so."),
  p("p13", "Tapered Dark Denim", "Jeans", "Denim", 2599, IMG.denim, ["Navy", "Black"], SIZES, ["Casual", "College", "Travel"], "Casual", "Stretch denim", "Unisex", "A dark, tapered denim with just enough give for a full day."),
  p("p14", "Double-Breasted Blazer", "Blazers", "Blazer", 5999, IMG.blazer, ["Navy", "Black", "Beige"], SIZES, ["Office", "Interview", "Formal"], "Tailored", "Wool blend", "Men", "Soft-shouldered, double-breasted, and quietly confident."),
  p("p15", "Leather Dress Belt", "Belts", "Belt", 1299, IMG.accFlat, ["Black", "Beige"], ["30", "32", "34", "36", "38"], ["Office", "Formal", "Interview"], "Minimal", "Leather", "Unisex", "A narrow leather belt with a brushed buckle. It disappears, correctly."),
  p("p16", "Minimal Steel Watch", "Watches", "Watch", 4999, IMG.watchWrist, ["Black", "White"], ["One size"], ["Office", "Formal", "Date Night", "Interview"], "Minimal", "Stainless steel", "Unisex", "Slim case, clean dial, no clutter. Reads as intent, not decoration."),
  p("p17", "Bifold Leather Wallet", "Wallets", "Wallet", 1699, IMG.accFlat, ["Black", "Beige"], ["One size"], ["Office", "Travel", "Casual"], "Minimal", "Leather", "Unisex", "Slim bifold that stays flat in a tailored pocket."),
  p("p18", "Weekend Leather Holdall", "Bags", "Holdall", 6499, IMG.accFlat, ["Black", "Beige"], ["One size"], ["Travel"], "Utility", "Leather", "Unisex", "One bag, two nights, no compromises."),
  p("p19", "Fine Chain Necklace", "Jewellery", "Necklace", 1999, IMG.smoke, ["Black", "White"], ["One size"], ["Party", "Date Night", "Festival"], "Contemporary", "Sterling silver", "Unisex", "A fine chain that finishes an open collar."),
  p("p20", "Amber Oud Eau de Parfum", "Fragrance", "Perfume", 3299, IMG.threads, ["Black"], ["50ml", "100ml"], ["Date Night", "Wedding", "Party"], "Evening", "Amber, oud, cedar", "Unisex", "Warm amber over dry cedar. Close, not loud."),
  p("p21", "Matte Black Sunglasses", "Accessories", "Sunglasses", 2199, IMG.shoesGlasses, ["Black"], ["One size"], ["Travel", "Casual", "Party"], "Contemporary", "Acetate", "Unisex", "Flat matte acetate with a squared frame."),
  p("p22", "Merino Crew T-Shirt", "T-shirts", "Crew", 1499, IMG.formalWhite, ["White", "Black", "Olive"], SIZES, ["Casual", "College", "Travel"], "Minimal", "Merino wool", "Unisex", "The plain t-shirt, done properly. Holds shape, resists odour."),
  p("p23", "Derby Formal Shoes", "Footwear", "Derby", 4499, IMG.shoesWatch, ["Black"], ["6", "7", "8", "9", "10", "11"], ["Interview", "Formal", "Office", "Wedding"], "Formal", "Polished leather", "Men", "Classic derby with a slim welt. Interview-ready without effort."),
  p("p24", "Low-Top Court Sneakers", "Footwear", "Sneakers", 3299, IMG.shoesGlasses, ["White", "Black"], ["6", "7", "8", "9", "10", "11"], ["Casual", "College", "Travel"], "Casual", "Leather", "Unisex", "A quiet low-top that works with denim and tailoring alike."),
  p("p25", "Charcoal Formal Trousers", "Trousers", "Formal", 2399, IMG.blackSuit, ["Black", "Navy"], SIZES, ["Interview", "Office", "Formal"], "Tailored", "Wool blend", "Men", "Charcoal, flat front, clean break. The default that always works."),
  p("p26", "Silk Occasion Scarf", "Accessories", "Scarf", 1899, IMG.blonde, ["Black", "Beige", "Olive"], ["One size"], ["Festival", "Party", "Travel"], "Contemporary", "Silk", "Women", "A printed silk square that changes a whole outfit."),
];

const item = (name, price) => ({ name, price });

export const PAIRS = [
  {
    id: "pair-midnight-formal", name: "Midnight Formal", occasion: "Formal", featured: true,
    image: IMG.blackSuit, price: 9296, group: "Featured",
    description: "A single dark line from collar to shoe. Built for evenings where the room notices detail.",
    components: [item("Black structured shirt", 2499), item("Charcoal trousers", 2399)],
    accessories: [item("Black leather belt", 1299), item("Minimal steel watch", 4999)],
    colors: ["Black", "Navy"], sizes: SIZES, style: "Tailored",
  },
  {
    id: "pair-interview-clean", name: "The Clean Slate", occasion: "Interview", featured: true,
    image: IMG.formalWhite, price: 8797, group: "Occasion",
    description: "Nothing to distract from what you say. White shirt, charcoal trouser, polished derby.",
    components: [item("Premium linen shirt", 1899), item("Charcoal formal trousers", 2399)],
    accessories: [item("Derby formal shoes", 4499)],
    colors: ["White", "Navy"], sizes: SIZES, style: "Formal",
  },
  {
    id: "pair-festive-ivory", name: "Festive Ivory", occasion: "Festival", featured: true,
    image: IMG.kurta, price: 10998, group: "Occasion",
    description: "A contemporary kurta set with a printed bandhgala over it. Ceremony, minus the costume.",
    components: [item("Contemporary kurta set", 3499), item("Printed bandhgala jacket", 7499)],
    accessories: [], colors: ["Beige", "White"], sizes: SIZES, style: "Ethnic",
  },
  {
    id: "pair-resort-ease", name: "Resort Ease", occasion: "Travel", featured: false,
    image: IMG.denim, price: 4798, group: "Seasonal",
    description: "Textured resort shirt with tapered dark denim — the pair that survives an airport and a dinner.",
    components: [item("Textured resort shirt", 2199), item("Tapered dark denim", 2599)],
    accessories: [item("Matte black sunglasses", 2199)],
    colors: ["Beige", "Olive"], sizes: SIZES, style: "Resort",
  },
  {
    id: "pair-evening-noir", name: "Evening Noir", occasion: "Date Night", featured: true,
    image: IMG.dressBlack, price: 6298, group: "Colour",
    description: "Black lace evening dress with a fine chain. One decision, whole evening handled.",
    components: [item("Black lace evening dress", 4299)],
    accessories: [item("Fine chain necklace", 1999)],
    colors: ["Black"], sizes: SIZES, style: "Evening",
  },
  {
    id: "pair-office-column", name: "Office Column", occasion: "Office", featured: false,
    image: IMG.dressWhite, price: 9398, group: "Premium",
    description: "Ivory column dress under a navy double-breasted blazer. Boardroom to dinner without a change.",
    components: [item("Ivory column dress", 3399), item("Double-breasted blazer", 5999)],
    accessories: [], colors: ["White", "Navy"], sizes: SIZES, style: "Tailored",
  },
  {
    id: "pair-campus-standard", name: "Campus Standard", occasion: "College", featured: false,
    image: IMG.dressSlip, price: 5798, group: "Trending",
    description: "Merino crew, tapered denim, low-top sneakers. The uniform that never looks like one.",
    components: [item("Merino crew t-shirt", 1499), item("Tapered dark denim", 2599)],
    accessories: [item("Low-top court sneakers", 3299)],
    colors: ["Black", "White"], sizes: SIZES, style: "Casual",
  },
  {
    id: "pair-wedding-ceremony", name: "Ceremony Ivory", occasion: "Wedding", featured: true,
    image: IMG.sherwani, price: 17498, group: "Premium",
    description: "Ivory ceremonial sherwani with derby shoes — a pair intended to be tailored, not just bought.",
    components: [item("Ivory ceremonial sherwani", 12999)],
    accessories: [item("Derby formal shoes", 4499)],
    colors: ["Beige", "White"], sizes: SIZES, style: "Ethnic",
  },
];

export const LOOKS = [
  { id: "look-interview", name: "The Interview", occasion: "Interview", image: IMG.formalWhite,
    description: "Read as prepared before you say a word.",
    products: ["Formal shirt", "Tailored trousers", "Belt", "Formal shoes", "Watch"] },
  { id: "look-wedding", name: "The Wedding", occasion: "Wedding", image: IMG.weddingEthnic,
    description: "Ceremonial, considered, and photographed from every angle.",
    products: ["Ethnic outfit", "Footwear", "Watch", "Brooch", "Fragrance"] },
  { id: "look-date", name: "The Date", occasion: "Date Night", image: IMG.dressSlip,
    description: "Smart without trying visibly hard.",
    products: ["Smart casual top", "Trousers", "Shoes", "Watch", "Fragrance"] },
  { id: "look-weekend", name: "The Weekend", occasion: "Casual", image: IMG.denim,
    description: "Two days, one bag, zero thinking.",
    products: ["Casual shirt", "Denim", "Sneakers", "Accessories"] },
  { id: "look-office", name: "The Office", occasion: "Office", image: IMG.blazer,
    description: "A default that holds up from Monday to review season.",
    products: ["Linen shirt", "Tailored trousers", "Loafers", "Belt", "Watch"] },
  { id: "look-party", name: "The Party", occasion: "Party", image: IMG.dressBlack,
    description: "Low light, high contrast, one statement piece.",
    products: ["Evening dress", "Chain necklace", "Heels", "Fragrance"] },
  { id: "look-travel", name: "The Travel Day", occasion: "Travel", image: IMG.accFlat,
    description: "Comfort that still photographs well on arrival.",
    products: ["Resort shirt", "Denim", "Sneakers", "Holdall", "Sunglasses"] },
  { id: "look-festival", name: "The Festival", occasion: "Festival", image: IMG.kurta,
    description: "Traditional roots, contemporary cut.",
    products: ["Kurta set", "Bandhgala", "Juttis", "Silk scarf"] },
  { id: "look-college", name: "The Campus", occasion: "College", image: IMG.dressWhite2,
    description: "Easy, repeatable, and still yours.",
    products: ["Merino tee", "Denim", "Sneakers", "Sunglasses"] },
  { id: "look-formal", name: "The Black Tie Adjacent", occasion: "Formal", image: IMG.blackSuit,
    description: "For rooms where the dress code is implied, not printed.",
    products: ["Structured shirt", "Charcoal trousers", "Derby shoes", "Steel watch"] },
];

export const OCCASIONS = ["Wedding", "Office", "Interview", "Date Night", "Party", "College", "Travel", "Festival", "Casual", "Formal"];

export const OCCASION_PROMPTS = [
  { label: "I have an interview.", occasion: "Interview" },
  { label: "I have a wedding.", occasion: "Wedding" },
  { label: "I have a date.", occasion: "Date Night" },
  { label: "I have a party tonight.", occasion: "Party" },
  { label: "I need something for work.", occasion: "Office" },
  { label: "I'm travelling.", occasion: "Travel" },
];

export const CATEGORIES = [
  { name: "Men", image: IMG.blackSuit }, { name: "Women", image: IMG.dressBlack },
  { name: "Ethnic", image: IMG.kurta }, { name: "Western", image: IMG.dressWhite },
  { name: "Formal", image: IMG.formalWhite }, { name: "Casual", image: IMG.denim },
  { name: "Footwear", image: IMG.shoesWatch }, { name: "Accessories", image: IMG.accFlat },
  { name: "Premium", image: IMG.sherwani }, { name: "Trending", image: IMG.blonde },
];

export const ACCESSORY_CATEGORIES = [
  "Shoes", "Watches", "Belts", "Wallets", "Bags", "Jewellery", "Fragrances", "Sunglasses", "Scarves",
];

export const THEMES = [
  { name: "Old Money", note: "Quiet tailoring, muted palettes, no logos.", image: IMG.blazer },
  { name: "Dark Academia", note: "Wool, ink, libraries at dusk.", image: IMG.smoke },
  { name: "Streetwear", note: "Volume, layers, city texture.", image: IMG.denim },
  { name: "Royal Wedding", note: "Ceremonial silks and hand finishing.", image: IMG.sherwani },
  { name: "Minimalist", note: "Three colours, perfect fit.", image: IMG.dressWhite },
  { name: "Summer Escape", note: "Linen, salt air, open collars.", image: IMG.formalWhite },
  { name: "Monochrome", note: "One colour, many textures.", image: IMG.blackSuit },
  { name: "Retro", note: "Wide lapels, warm tones.", image: IMG.bandhgala },
  { name: "Anime-inspired", note: "Original silhouettes inspired by the aesthetic — no licensed artwork.", image: IMG.blonde },
  { name: "Cinematic", note: "Costume-grade drama, wearable scale.", image: IMG.dressBlack },
];

export const TRENDING_IDS = ["p1", "p2", "p3", "p4", "p5", "p6"];

export const FAQS = [
  { q: "What is ZYRA?", a: "ZYRA is a hyperlocal fashion commerce platform being built to connect customers with nearby fashion merchants — offering individual products, curated PAIRS, Complete Looks, accessories, optional fit services and scheduled custom tailoring." },
  { q: "When is ZYRA launching?", a: "ZYRA is currently in development and preparing for launch. Join the waitlist and we will share launch details as they are confirmed." },
  { q: "Where will ZYRA launch first?", a: "ZYRA is currently in development and preparing for launch in Delhi NCR, beginning with Delhi, Gurugram and Noida." },
  { q: "What is PAIR?", a: "PAIR is ZYRA's curated fashion experience where complementary pieces are brought together into one ready-to-shop combination — so you stop wondering what goes with what." },
  { q: "What are Complete Looks?", a: "A Complete Look is an occasion-led combination of clothing plus the accessories that finish it: shoes, belt, watch, fragrance and more." },
  { q: "Can I buy individual products?", a: "Yes. Individual products, PAIRS and Complete Looks will all be available. PAIR is an option, not a requirement." },
  { q: "Will ZYRA deliver fashion instantly?", a: "ZYRA is being designed around fast local fulfilment. Actual delivery availability and timing will depend on merchant operating hours, local inventory, distance and delivery-partner availability." },
  { q: "Can I request tailoring?", a: "Yes. ZYRA is designed with two tailoring services: Instant Fit for minor adjustments and Book Custom Tailoring for complex garments. Both are subject to independent tailoring partner availability." },
  { q: "What is Instant Fit?", a: "Instant Fit covers minor adjustments such as pant hemming, sleeve shortening, waist adjustment, button replacement and small fitting corrections. It is optional and subject to local tailor availability." },
  { q: "What is Custom Tailoring?", a: "Custom Tailoring is a scheduled premium service for complex garments — sherwanis, suits, tuxedos, bridal wear, major alterations and custom stitching — booked with an independent tailoring partner." },
  { q: "How can I become a merchant?", a: "Apply through the For Merchants page. The ZYRA Partner team reviews each application and will contact you about commercial terms under the ZYRA partnership model." },
  { q: "Can I partner or invest?", a: "Yes. Use the Investors page to request information or start a conversation with the founder." },
  { q: "Is ZYRA available 24/7?", a: "Customers will be able to discover ZYRA around the clock, while physical fulfilment will depend on participating merchant hours and local service availability. ZYRA's long-term vision includes broader and eventually round-the-clock fulfilment coverage." },
];

export const FUTURE_VISION = [
  { title: "AI Styling", note: "Guidance that learns your taste.", tag: "Future Vision" },
  { title: "Virtual Try-On", note: "See the fit before it arrives.", tag: "Coming Later" },
  { title: "Personal Wardrobe", note: "Everything you own, styled together.", tag: "Future Vision" },
  { title: "Smart Recommendations", note: "Right piece, right moment.", tag: "Coming Later" },
  { title: "Premium Membership", note: "Priority fitting and access.", tag: "Future Vision" },
  { title: "Designer Collaborations", note: "Limited, licensed, labelled.", tag: "Coming Later" },
  { title: "Expanded Cities", note: "Beyond Delhi NCR, step by step.", tag: "Future Vision" },
];

export const FOUNDER_PHOTO =
  "https://customer-assets-4nw71qhi.emergentagent.net/job_fashion-ready-2/artifacts/koib5jij_PFP.jpeg";

export const BOOKS = [
  {
    id: "human-psychology-behaviour",
    title: "Human Psychology & Behaviour",
    subtitle: "A Comprehensive Exploration of the Architecture of the Human Soul and the Strategic Realities of Social Existence",
    author: "Abinash Kumar",
    credit: "By Abinash Kumar",
    status: "Published",
    cover: "/book-psychology.png",
    url: "https://customer-assets-4nw71qhi.emergentagent.net/job_fashion-ready-2/artifacts/n4oesss2_Human%20Psychology%20Behaviour%20final.pdf",
    description:
      "Structured across four phases and eleven lessons, the book examines the architecture of the human soul and the realities of social existence — from internal conflict to the dynamics that govern how people read one another.",
    highlights: [
      "Phase 1 — The Individual Foundation: Me vs Me · Self-Reflection & Feedback",
      "Phase 2 — The Social Arena: The Faces of Perspective · Rules of The Society · Social Standing At Edge of Hill · Bond With Unknowns",
      "Phase 3 — The Higher Knowledge: Undertaking The Wisdom From Wise · Help From The Heavens · Adjusting With The Preplanned",
      "Phase 4 — Universal Truths: The Karma's Teaching · The Law Of Nature",
    ],
  },
  {
    id: "wake-up-or-burn-out",
    title: "Wake Up, or Burn Out",
    subtitle: "A Guide to Reclaiming Purpose, Power, and a Life Worth Living",
    author: "Abhishek .S & Abinash .K",
    credit: "Co-authored by Abinash Kumar",
    status: "Published",
    cover: "/book-wakeup.png",
    url: "https://customer-assets-4nw71qhi.emergentagent.net/job_fashion-ready-2/artifacts/ioptiu2q_WakeUpOrBurnOut.pdf",
    description:
      "A study of purpose, habits, character and relationships, and how each one is built or eroded by daily choices. It works through the psychology behind behaviour change, self-compassion and durable connection.",
    highlights: [
      "Introduction — The Generation Nobody Warned",
      "Born With a Purpose · The Smoke and the Mirror · The Screen That Lies",
      "Seeing the Whole Person · Karma Is Not Superstition · The Mind Is a Garden",
      "The Hardest Strength · Discipline Without Self-Hatred · The Brotherhood of Wise Men",
      "Purpose as a Compass · Aryan's Transformation · The Covenant",
      "Appendix A — The Thirty-Day Wake-Up Protocol",
    ],
  },
];

export const inr = (n) => "₹" + n.toLocaleString("en-IN");
export const findProduct = (id) => PRODUCTS.find((x) => x.id === id);
export const findPair = (id) => PAIRS.find((x) => x.id === id);
