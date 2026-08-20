import { useState } from "react";
import { BookOpen, X } from "lucide-react";
import { Badge, Disclaimer } from "./Primitives";

/** Premium book card. "Read Preview" shows only the book's own printed title page
 *  and contents — no unlicensed body text is reproduced. */
export const BookCard = ({ book }) => {
  const [open, setOpen] = useState(false);

  return (
    <article className="z-card overflow-hidden rounded-3xl" data-testid={`book-card-${book.id}`}>
      <div className="flex flex-col gap-6 p-6 sm:flex-row">
        <img
          src={book.cover}
          alt={`Cover of ${book.title} by ${book.author}`}
          loading="lazy"
          className="h-56 w-40 shrink-0 self-start rounded-xl border object-cover object-top"
          style={{ borderColor: "var(--z-border)" }}
        />
        <div>
          <h3 className="font-display text-xl font-bold leading-snug">{book.title}</h3>
          <p className="mt-2 text-[0.78rem] italic leading-relaxed" style={{ color: "var(--z-text-3)" }}>{book.subtitle}</p>
          <p className="mt-3 text-[0.8rem]" style={{ color: "var(--z-text-2)" }}>{book.credit}</p>
          <p className="mt-3"><Badge tone="grey">{book.status}</Badge></p>
          <p className="mt-4 text-sm leading-relaxed" style={{ color: "var(--z-text-2)" }}>{book.description}</p>
        </div>
      </div>

      <div className="border-t px-6 py-5" style={{ borderColor: "var(--z-border)" }}>
        <p className="text-[0.66rem] uppercase tracking-[0.18em]" style={{ color: "var(--z-text-3)" }}>Chapter highlights</p>
        <ul className="mt-3 space-y-2">
          {book.highlights.map((h) => (
            <li key={h} className="flex gap-3 text-[0.82rem] leading-relaxed" style={{ color: "var(--z-text-2)" }}>
              <span aria-hidden="true" style={{ color: "var(--z-purple-soft)" }}>—</span>
              <span>{h}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" className="z-btn z-btn-primary !text-[0.7rem]" onClick={() => setOpen(true)} data-testid={`book-preview-${book.id}`}>
            <BookOpen size={14} /> Read Preview
          </button>
          <a href={book.url} target="_blank" rel="noopener noreferrer" className="z-btn z-btn-ghost !text-[0.7rem]" data-testid={`book-cta-${book.id}`}>
            Explore the Book
          </a>
        </div>
      </div>

      {open && (
        <div role="dialog" aria-modal="true" aria-label={`${book.title} preview`} data-testid={`book-modal-${book.id}`}
          className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          style={{ background: "rgba(5,5,5,0.82)", backdropFilter: "blur(10px)" }}
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
          <div className="z-card max-h-[86vh] w-full max-w-2xl overflow-y-auto rounded-3xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="z-eyebrow">Preview</p>
                <h4 className="font-display mt-2 text-xl font-bold">{book.title}</h4>
              </div>
              <button type="button" aria-label="Close preview" onClick={() => setOpen(false)} data-testid={`book-modal-close-${book.id}`}
                className="rounded-full p-2 transition-colors hover:bg-white/5">
                <X size={18} />
              </button>
            </div>
            <img src={book.cover} alt={`Title page of ${book.title}`} className="mt-5 w-full rounded-xl border" style={{ borderColor: "var(--z-border)" }} />
            <p className="mt-6 text-[0.66rem] uppercase tracking-[0.18em]" style={{ color: "var(--z-text-3)" }}>Contents</p>
            <ul className="mt-3 space-y-2">
              {book.highlights.map((h) => (
                <li key={h} className="text-[0.85rem] leading-relaxed" style={{ color: "var(--z-text-2)" }}>{h}</li>
              ))}
            </ul>
            <div className="mt-6">
              <Disclaimer>
                This preview shows the book's title page and printed contents only. The full text is available through the
                author's own copy of the book.
              </Disclaimer>
            </div>
            <a href={book.url} target="_blank" rel="noopener noreferrer" className="z-btn z-btn-primary mt-6 !text-[0.7rem]">
              Explore the Book
            </a>
          </div>
        </div>
      )}
    </article>
  );
};
