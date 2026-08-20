import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, ArrowUp, ArrowDown, Upload, Loader2 } from "lucide-react";
import { Badge, EmptyState } from "@/components/Primitives";
import {
  adminContent, createContent, updateContent, deleteContent, reorderContent, bulkImportContent, formatApiErrorDetail,
} from "@/lib/api";
import { PRODUCTS, PAIRS, LOOKS, THEMES, FAQS } from "@/data/catalog";

const TYPES = [
  { key: "product", label: "Products", fields: ["name", "category", "price", "image", "description"] },
  { key: "pair", label: "Pairs", fields: ["name", "occasion", "price", "image", "description"] },
  { key: "look", label: "Looks", fields: ["name", "occasion", "image", "description"] },
  { key: "theme", label: "Themes", fields: ["name", "note", "image"] },
  { key: "faq", label: "FAQs", fields: ["q", "a"] },
  { key: "home", label: "Homepage", fields: ["section", "heading", "copy"] },
];

const slugify = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);

const IMPORTABLE = {
  product: PRODUCTS.map((p) => ({ data: p, slug: slugify(p.name) })),
  pair: PAIRS.map((p) => ({ data: p, slug: slugify(p.name) })),
  look: LOOKS.map((l) => ({ data: l, slug: slugify(l.name) })),
  theme: THEMES.map((t) => ({ data: t, slug: slugify(t.name) })),
  faq: FAQS.map((f) => ({ data: f, slug: slugify(f.q) })),
};

export const ContentManager = ({ token, canWrite }) => {
  const [type, setType] = useState("product");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);

  const meta = TYPES.find((t) => t.key === type);

  const load = () => {
    setLoading(true);
    adminContent(token, type).then(setItems).catch(() => setItems([])).finally(() => setLoading(false));
  };
  useEffect(load, [token, type]); // eslint-disable-line react-hooks/exhaustive-deps

  const act = async (fn, ok) => {
    try {
      await fn();
      toast.success(ok);
      load();
    } catch (e) {
      toast.error(formatApiErrorDetail(e.response?.data?.detail));
    }
  };

  const save = async () => {
    setSaving(true);
    const payloadData = { ...draft.data };
    if (payloadData.price) payloadData.price = Number(payloadData.price);
    try {
      if (draft.id) {
        await updateContent(token, draft.id, { data: payloadData, slug: draft.slug, status: draft.status });
        toast.success("Saved");
      } else {
        await createContent(token, { type, slug: draft.slug || slugify(payloadData.name || payloadData.q), status: draft.status, order: items.length, data: payloadData });
        toast.success("Created");
      }
      setDraft(null);
      load();
    } catch (e) {
      toast.error(formatApiErrorDetail(e.response?.data?.detail));
    } finally {
      setSaving(false);
    }
  };

  const move = (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
    act(() => reorderContent(token, next.map((it, i) => ({ id: it.id, order: i }))), "Order updated");
  };

  const importPreview = () =>
    act(
      () => bulkImportContent(token, (IMPORTABLE[type] || []).map((x, i) => ({
        type, slug: x.slug, status: "published", order: i, data: x.data,
      }))),
      "Preview catalogue imported"
    );

  return (
    <div data-testid="content-manager">
      <div className="flex flex-wrap gap-2">
        {TYPES.map((t) => (
          <button key={t.key} type="button" onClick={() => { setType(t.key); setDraft(null); }} aria-pressed={type === t.key}
            data-testid={`cms-type-${t.key}`}
            className="rounded-full border px-4 py-2 text-[0.74rem] transition-colors duration-300"
            style={{ borderColor: type === t.key ? "var(--z-purple)" : "var(--z-border)", color: type === t.key ? "#fff" : "var(--z-text-2)" }}>
            {t.label}
          </button>
        ))}
      </div>

      {canWrite && (
        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" className="z-btn z-btn-primary !py-2.5 !text-[0.68rem]" data-testid="cms-new"
            onClick={() => setDraft({ data: {}, status: "draft", slug: "" })}>
            <Plus size={14} /> New {meta.label.replace(/s$/, "")}
          </button>
          {IMPORTABLE[type] && (
            <button type="button" className="z-btn z-btn-ghost !py-2.5 !text-[0.68rem]" data-testid="cms-import" onClick={importPreview}>
              <Upload size={14} /> Import preview catalogue
            </button>
          )}
        </div>
      )}

      {draft && (
        <div className="z-card mt-5 rounded-2xl p-5" data-testid="cms-form">
          <div className="grid gap-4 sm:grid-cols-2">
            {meta.fields.map((f) => (
              <label key={f} className={f === "description" || f === "a" || f === "copy" ? "sm:col-span-2" : ""}>
                <span className="mb-1.5 block text-[0.66rem] uppercase tracking-[0.16em]" style={{ color: "var(--z-text-3)" }}>{f}</span>
                {["description", "a", "copy", "note"].includes(f) ? (
                  <textarea rows={3} className="z-input" data-testid={`cms-field-${f}`} value={draft.data[f] || ""}
                    onChange={(e) => setDraft((d) => ({ ...d, data: { ...d.data, [f]: e.target.value } }))} />
                ) : (
                  <input className="z-input" data-testid={`cms-field-${f}`} value={draft.data[f] || ""}
                    onChange={(e) => setDraft((d) => ({ ...d, data: { ...d.data, [f]: e.target.value } }))} />
                )}
              </label>
            ))}
            <label>
              <span className="mb-1.5 block text-[0.66rem] uppercase tracking-[0.16em]" style={{ color: "var(--z-text-3)" }}>Status</span>
              <select className="z-input" data-testid="cms-field-status" value={draft.status}
                onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value }))}>
                {["draft", "published", "archived"].map((s) => <option key={s}>{s}</option>)}
              </select>
            </label>
            <label>
              <span className="mb-1.5 block text-[0.66rem] uppercase tracking-[0.16em]" style={{ color: "var(--z-text-3)" }}>Slug</span>
              <input className="z-input" data-testid="cms-field-slug" value={draft.slug}
                placeholder={slugify(draft.data.name || draft.data.q)}
                onChange={(e) => setDraft((d) => ({ ...d, slug: slugify(e.target.value) }))} />
            </label>
          </div>
          <div className="mt-5 flex gap-3">
            <button type="button" className="z-btn z-btn-primary !py-2.5 !text-[0.68rem]" disabled={saving} onClick={save} data-testid="cms-save">
              {saving && <Loader2 size={13} className="animate-spin" />} Save
            </button>
            <button type="button" className="z-btn z-btn-ghost !py-2.5 !text-[0.68rem]" onClick={() => setDraft(null)} data-testid="cms-cancel">Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="mt-6 text-sm" style={{ color: "var(--z-text-2)" }}>Loading…</p>
      ) : items.length === 0 ? (
        <div className="mt-6"><EmptyState title={`No ${meta.label.toLowerCase()} in the CMS yet.`}
          copy="Until you publish items here, the site shows the built-in preview collection." /></div>
      ) : (
        <div className="mt-6 space-y-2" data-testid="cms-list">
          {items.map((it, i) => (
            <div key={it.id} className="z-card flex flex-wrap items-center justify-between gap-3 rounded-xl p-4" data-testid={`cms-item-${it.slug}`}>
              <div className="min-w-0">
                <p className="font-display truncate text-[0.95rem] font-bold">{it.data?.name || it.data?.q || it.data?.heading || it.slug}</p>
                <p className="mt-0.5 text-[0.7rem]" style={{ color: "var(--z-text-3)" }}>{it.slug} · order {it.order}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={it.status === "published" ? "purple" : "grey"}>{it.status}</Badge>
                {canWrite && (
                  <>
                    <select className="z-input !w-auto !py-1.5 !text-[0.7rem]" value={it.status} aria-label={`Status for ${it.slug}`}
                      data-testid={`cms-status-${it.slug}`}
                      onChange={(e) => act(() => updateContent(token, it.id, { status: e.target.value }), "Status updated")}>
                      {["draft", "published", "archived"].map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <button type="button" aria-label="Move up" onClick={() => move(i, -1)} className="rounded-full p-2 hover:bg-white/5" data-testid={`cms-up-${it.slug}`}><ArrowUp size={14} /></button>
                    <button type="button" aria-label="Move down" onClick={() => move(i, 1)} className="rounded-full p-2 hover:bg-white/5" data-testid={`cms-down-${it.slug}`}><ArrowDown size={14} /></button>
                    <button type="button" className="z-btn z-btn-ghost !px-3 !py-1.5 !text-[0.64rem]" data-testid={`cms-edit-${it.slug}`}
                      onClick={() => setDraft({ id: it.id, slug: it.slug, status: it.status, data: it.data || {} })}>Edit</button>
                    <button type="button" aria-label="Delete" data-testid={`cms-delete-${it.slug}`} className="rounded-full p-2 hover:bg-white/5"
                      onClick={() => act(() => deleteContent(token, it.id), "Deleted")}><Trash2 size={14} /></button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
