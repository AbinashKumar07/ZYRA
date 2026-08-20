import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge, EmptyState } from "@/components/Primitives";
import {
  adminBookings, adminTailors, createTailor, toggleTailor, adminPricing, upsertPricing,
  adminTeam, createTeamMember, setMemberActive, formatApiErrorDetail,
} from "@/lib/api";

const pretty = (iso) => new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
const inr = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");

export const BookingsPanel = ({ token }) => {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    adminBookings(token, filter || undefined).then(setBookings).catch(() => setBookings([]));
  }, [token, filter]);

  return (
    <div data-testid="bookings-panel">
      <div className="flex flex-wrap gap-2">
        {["", "awaiting_tailor", "confirmed"].map((s) => (
          <button key={s || "all"} type="button" onClick={() => setFilter(s)} aria-pressed={filter === s}
            data-testid={`bookings-filter-${s || "all"}`}
            className="rounded-full border px-4 py-2 text-[0.74rem] capitalize transition-colors duration-300"
            style={{ borderColor: filter === s ? "var(--z-purple)" : "var(--z-border)", color: filter === s ? "#fff" : "var(--z-text-2)" }}>
            {s ? s.replace(/_/g, " ") : "all"}
          </button>
        ))}
      </div>
      {bookings.length === 0 ? (
        <div className="mt-6"><EmptyState title="No tailoring requests yet." copy="Custom tailoring requests appear here as customers submit them." /></div>
      ) : (
        <div className="mt-6 space-y-2" data-testid="bookings-list">
          {bookings.map((b) => (
            <div key={b.id} className="z-card flex flex-wrap items-center justify-between gap-3 rounded-xl p-4" data-testid={`booking-row-${b.reference}`}>
              <div>
                <p className="font-display text-[0.95rem] font-bold">{b.garment} · {b.service}</p>
                <p className="mt-0.5 text-[0.74rem]" style={{ color: "var(--z-text-2)" }}>
                  {b.reference} · {pretty(b.date)} {b.slot} · {b.city} · {b.name} ({b.phone})
                </p>
                <p className="mt-0.5 text-[0.7rem]" style={{ color: "var(--z-text-3)" }}>
                  {b.estimate_min ? `${inr(b.estimate_min)} – ${inr(b.estimate_max)}` : "no estimate band"}
                  {b.tailor_name ? ` · ${b.tailor_name}` : ""}
                </p>
              </div>
              <Badge tone={b.status === "confirmed" ? "purple" : "grey"}>{b.status.replace(/_/g, " ")}</Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const TailorsPanel = ({ token, canWrite }) => {
  const [tailors, setTailors] = useState([]);
  const [pricing, setPricing] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", city: "Delhi" });
  const [band, setBand] = useState(null);

  const load = () => {
    adminTailors(token).then(setTailors).catch(() => setTailors([]));
    adminPricing(token).then(setPricing).catch(() => setPricing([]));
  };
  useEffect(load, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  const act = async (fn, ok) => {
    try { await fn(); toast.success(ok); load(); }
    catch (e) { toast.error(formatApiErrorDetail(e.response?.data?.detail)); }
  };

  return (
    <div data-testid="tailors-panel">
      {canWrite && (
        <div className="z-card rounded-2xl p-5">
          <h3 className="font-display text-base font-bold">Add a tailoring partner</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            <input className="z-input" placeholder="Name" value={form.name} data-testid="tailor-name"
              onChange={(e) => setForm({ ...form, name: e.target.value })} aria-label="Partner name" />
            <input className="z-input" placeholder="Email" value={form.email} data-testid="tailor-email"
              onChange={(e) => setForm({ ...form, email: e.target.value })} aria-label="Partner email" />
            <select className="z-input" value={form.city} data-testid="tailor-city" aria-label="Partner city"
              onChange={(e) => setForm({ ...form, city: e.target.value })}>
              {["Delhi", "Gurugram", "Noida"].map((c) => <option key={c}>{c}</option>)}
            </select>
            <button type="button" className="z-btn z-btn-primary !py-2.5 !text-[0.68rem]" data-testid="tailor-create"
              onClick={() => act(() => createTailor(token, { ...form, specialities: [] }), "Partner added")}>Add Partner</button>
          </div>
        </div>
      )}

      <div className="mt-5 space-y-2">
        {tailors.map((t) => (
          <div key={t.id} className="z-card flex flex-wrap items-center justify-between gap-3 rounded-xl p-4" data-testid={`tailor-row-${t.id}`}>
            <div>
              <p className="font-display text-[0.95rem] font-bold">{t.name}</p>
              <p className="mt-0.5 text-[0.74rem]" style={{ color: "var(--z-text-2)" }}>{t.email} · {t.city} · {t.open_dates} open dates</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge tone={t.active ? "purple" : "grey"}>{t.active ? "active" : "paused"}</Badge>
              {canWrite && (
                <button type="button" className="z-btn z-btn-ghost !px-3 !py-1.5 !text-[0.64rem]" data-testid={`tailor-toggle-${t.id}`}
                  onClick={() => act(() => toggleTailor(token, t.id, !t.active), "Updated")}>{t.active ? "Pause" : "Activate"}</button>
              )}
            </div>
          </div>
        ))}
      </div>

      <h3 className="font-display mt-10 text-base font-bold">Estimate ranges</h3>
      <p className="mt-1 text-[0.78rem]" style={{ color: "var(--z-text-3)" }}>Configurable per garment, service and city.</p>
      <div className="mt-4 space-y-2" data-testid="pricing-list">
        {pricing.map((p) => (
          <div key={`${p.garment}-${p.service}-${p.city}`} className="z-card flex flex-wrap items-center justify-between gap-3 rounded-xl p-3.5">
            <p className="text-[0.8rem]">{p.garment} · {p.service} · {p.city}</p>
            <div className="flex items-center gap-2">
              <span className="text-[0.78rem]" style={{ color: "var(--z-purple-soft)" }}>{inr(p.min_price)} – {inr(p.max_price)}</span>
              {canWrite && (
                <button type="button" className="z-btn z-btn-ghost !px-3 !py-1.5 !text-[0.62rem]"
                  data-testid={`pricing-edit-${p.garment}-${p.city}`.replace(/[^a-zA-Z0-9-]/g, "")}
                  onClick={() => setBand({ ...p })}>Edit</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {band && (
        <div className="z-card mt-4 rounded-2xl p-5" data-testid="pricing-form">
          <p className="font-display text-[0.95rem] font-bold">{band.garment} · {band.service} · {band.city}</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <input className="z-input !w-32" type="number" value={band.min_price} data-testid="pricing-min" aria-label="Minimum price"
              onChange={(e) => setBand({ ...band, min_price: Number(e.target.value) })} />
            <input className="z-input !w-32" type="number" value={band.max_price} data-testid="pricing-max" aria-label="Maximum price"
              onChange={(e) => setBand({ ...band, max_price: Number(e.target.value) })} />
            <button type="button" className="z-btn z-btn-primary !py-2.5 !text-[0.68rem]" data-testid="pricing-save"
              onClick={() => { act(() => upsertPricing(token, band), "Range updated"); setBand(null); }}>Save</button>
            <button type="button" className="z-btn z-btn-ghost !py-2.5 !text-[0.68rem]" onClick={() => setBand(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export const TeamPanel = ({ token }) => {
  const [team, setTeam] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "editor" });

  const load = () => adminTeam(token).then(setTeam).catch(() => setTeam([]));
  useEffect(load, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  const act = async (fn, ok) => {
    try { await fn(); toast.success(ok); load(); }
    catch (e) { toast.error(formatApiErrorDetail(e.response?.data?.detail)); }
  };

  return (
    <div data-testid="team-panel">
      <div className="z-card rounded-2xl p-5">
        <h3 className="font-display text-base font-bold">Invite a team member</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-5">
          <input className="z-input" placeholder="Name" value={form.name} data-testid="team-name" aria-label="Name"
            onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="z-input" placeholder="Email" value={form.email} data-testid="team-email" aria-label="Email"
            onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="z-input" type="password" placeholder="Password (min 8)" value={form.password} data-testid="team-password" aria-label="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <select className="z-input" value={form.role} data-testid="team-role" aria-label="Role"
            onChange={(e) => setForm({ ...form, role: e.target.value })}>
            {["admin", "editor", "viewer", "tailor"].map((r) => <option key={r}>{r}</option>)}
          </select>
          <button type="button" className="z-btn z-btn-primary !py-2.5 !text-[0.68rem]" data-testid="team-create"
            onClick={() => act(() => createTeamMember(token, form), "Team member added")}>Add</button>
        </div>
        <p className="mt-3 text-[0.72rem]" style={{ color: "var(--z-text-3)" }}>
          Admin: everything · Editor: content only · Viewer: read-only · Tailor: their own bookings (create the partner record first, same email)
        </p>
      </div>

      <div className="mt-5 space-y-2" data-testid="team-list">
        {team.map((m) => (
          <div key={m.id} className="z-card flex flex-wrap items-center justify-between gap-3 rounded-xl p-4" data-testid={`team-row-${m.email}`}>
            <div>
              <p className="font-display text-[0.95rem] font-bold">{m.name || m.email}</p>
              <p className="mt-0.5 text-[0.74rem]" style={{ color: "var(--z-text-2)" }}>{m.email}{m.city ? ` · ${m.city}` : ""}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge>{m.role}</Badge>
              <Badge tone="grey">{m.active ? "active" : "disabled"}</Badge>
              <button type="button" className="z-btn z-btn-ghost !px-3 !py-1.5 !text-[0.64rem]" data-testid={`team-toggle-${m.email}`}
                onClick={() => act(() => setMemberActive(token, m.id, !m.active), "Updated")}>{m.active ? "Disable" : "Enable"}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
