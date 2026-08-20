import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, LogOut, Check, X, CalendarDays } from "lucide-react";
import Seo from "@/components/Seo";
import { Section, Badge, EmptyState } from "@/components/Primitives";
import { LoginPanel, TOKEN_KEY } from "@/components/LoginPanel";
import { fetchMe, tailorBookings, tailorRespond, tailorAvailability, setTailorAvailability, formatApiErrorDetail } from "@/lib/api";

const SLOTS = ["10:00", "11:30", "13:00", "15:00", "16:30", "18:00"];
const pretty = (iso) => new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
const nextDates = () => Array.from({ length: 14 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + i + 1);
  return d.toISOString().slice(0, 10);
});

export default function Tailor() {
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || "");
  const [me, setMe] = useState(null);
  const [ready, setReady] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [busy, setBusy] = useState("");

  useEffect(() => {
    if (!token) { setReady(true); return; }
    fetchMe(token)
      .then((u) => { setMe(u); setReady(true); })
      .catch(() => { localStorage.removeItem(TOKEN_KEY); setToken(""); setMe(null); setReady(true); });
  }, [token]);

  const load = () => {
    if (!token) return;
    tailorBookings(token).then(setBookings).catch(() => {});
    tailorAvailability(token).then(setAvailability).catch(() => {});
  };

  useEffect(() => { if (me?.role === "tailor") load(); /* eslint-disable-next-line */ }, [me]);

  const respond = async (id, action) => {
    setBusy(id + action);
    try {
      await tailorRespond(token, id, action);
      toast.success(action === "accept" ? "Accepted. The customer has been emailed a confirmation." : "Declined. It stays open for other partners.");
      load();
    } catch (e) {
      toast.error(formatApiErrorDetail(e.response?.data?.detail));
    } finally {
      setBusy("");
    }
  };

  const toggleSlot = async (date, slot) => {
    const current = availability.find((a) => a.date === date)?.slots || [];
    const next = current.includes(slot) ? current.filter((s) => s !== slot) : [...current, slot].sort();
    try {
      await setTailorAvailability(token, date, next);
      setAvailability((prev) => {
        const rest = prev.filter((a) => a.date !== date);
        return [...rest, { date, slots: next }].sort((a, b) => a.date.localeCompare(b.date));
      });
    } catch (e) {
      toast.error(formatApiErrorDetail(e.response?.data?.detail));
    }
  };

  if (!ready) return <Section className="pt-36"><p style={{ color: "var(--z-text-2)" }}>Loading…</p></Section>;

  if (!token || !me)
    return (
      <>
        <Seo title="ZYRA Tailoring Partner Sign In" description="Protected sign-in for ZYRA independent tailoring partners." path="/tailor" />
        <LoginPanel title="Tailoring Partner" subtitle="Sign in to see the requests offered to you and set your availability."
          testid="tailor" onDone={setToken} />
      </>
    );

  if (me.role !== "tailor")
    return (
      <Section className="pt-36">
        <EmptyState title="This console is for tailoring partners." copy={`You are signed in as ${me.role}. Use the admin dashboard instead.`}
          action={<a href="/admin" className="z-btn z-btn-primary">Go to Admin</a>} />
      </Section>
    );

  const pending = bookings.filter((b) => b.status === "awaiting_tailor");
  const mine = bookings.filter((b) => b.status !== "awaiting_tailor");

  return (
    <>
      <Seo title="ZYRA Tailoring Partner Console" description="Requests and availability for ZYRA independent tailoring partners." path="/tailor" />
      <Section className="pt-32" label="Tailoring partner console">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="z-eyebrow">Tailoring partner</p>
            <h1 className="font-display mt-2 text-3xl font-extrabold">{me.name}</h1>
            <p className="mt-1 text-[0.78rem]" style={{ color: "var(--z-text-2)" }}>{me.email} · {me.city}</p>
          </div>
          <button type="button" className="z-btn z-btn-ghost !py-2.5 !text-[0.68rem]" data-testid="tailor-logout"
            onClick={() => { localStorage.removeItem(TOKEN_KEY); setToken(""); setMe(null); }}>
            <LogOut size={14} /> Sign Out
          </button>
        </div>

        <h2 className="font-display mt-10 text-xl font-bold">Requests waiting on you</h2>
        {pending.length === 0 ? (
          <div className="mt-4"><EmptyState title="No open requests." copy="New custom tailoring requests in your city will appear here." /></div>
        ) : (
          <div className="mt-4 space-y-3" data-testid="tailor-pending">
            {pending.map((b) => (
              <article key={b.id} className="z-card rounded-2xl p-5" data-testid={`tailor-booking-${b.reference}`}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-display text-base font-bold">{b.garment} · {b.service}</p>
                    <p className="mt-1 text-[0.8rem]" style={{ color: "var(--z-text-2)" }}>
                      {pretty(b.date)} at {b.slot} · {b.city} · {b.measurement_method}
                    </p>
                    <p className="mt-1 text-[0.75rem]" style={{ color: "var(--z-text-3)" }}>
                      {b.reference}{b.estimate_min ? ` · estimate ₹${b.estimate_min.toLocaleString("en-IN")}–₹${b.estimate_max.toLocaleString("en-IN")}` : ""}
                    </p>
                    {b.notes && <p className="mt-2 text-[0.8rem]" style={{ color: "var(--z-text-2)" }}>{b.notes}</p>}
                  </div>
                  <div className="flex gap-2">
                    <button type="button" className="z-btn z-btn-primary !px-4 !py-2 !text-[0.66rem]" disabled={busy === b.id + "accept"}
                      onClick={() => respond(b.id, "accept")} data-testid={`tailor-accept-${b.reference}`}>
                      {busy === b.id + "accept" ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />} Accept
                    </button>
                    <button type="button" className="z-btn z-btn-ghost !px-4 !py-2 !text-[0.66rem]" disabled={busy === b.id + "decline"}
                      onClick={() => respond(b.id, "decline")} data-testid={`tailor-decline-${b.reference}`}>
                      <X size={13} /> Decline
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <h2 className="font-display mt-12 text-xl font-bold">Your confirmed work</h2>
        {mine.length === 0 ? (
          <p className="mt-3 text-sm" style={{ color: "var(--z-text-3)" }}>Nothing accepted yet.</p>
        ) : (
          <div className="mt-4 space-y-3" data-testid="tailor-confirmed">
            {mine.map((b) => (
              <div key={b.id} className="z-card flex flex-wrap items-center justify-between gap-3 rounded-2xl p-5">
                <div>
                  <p className="font-display text-base font-bold">{b.garment} · {b.service}</p>
                  <p className="mt-1 text-[0.8rem]" style={{ color: "var(--z-text-2)" }}>{pretty(b.date)} at {b.slot} · {b.name} · {b.phone}</p>
                </div>
                <Badge>{b.status.replace(/_/g, " ")}</Badge>
              </div>
            ))}
          </div>
        )}

        <h2 className="font-display mt-12 text-xl font-bold">Your availability</h2>
        <p className="mt-2 text-sm" style={{ color: "var(--z-text-2)" }}>
          Only the slots you open here can be requested by customers.
        </p>
        <div className="mt-5 space-y-3" data-testid="tailor-availability">
          {nextDates().map((d) => {
            const slots = availability.find((a) => a.date === d)?.slots || [];
            return (
              <div key={d} className="z-card flex flex-wrap items-center gap-3 rounded-2xl p-4">
                <span className="flex w-32 items-center gap-2 text-[0.78rem]" style={{ color: "var(--z-text-2)" }}>
                  <CalendarDays size={14} style={{ color: "var(--z-purple-soft)" }} /> {pretty(d)}
                </span>
                <div className="flex flex-wrap gap-2">
                  {SLOTS.map((s) => (
                    <button key={s} type="button" onClick={() => toggleSlot(d, s)} aria-pressed={slots.includes(s)}
                      data-testid={`avail-${d}-${s.replace(":", "")}`}
                      className="rounded-full border px-3 py-1.5 text-[0.72rem] transition-colors duration-300"
                      style={{ borderColor: slots.includes(s) ? "var(--z-purple)" : "var(--z-border)", color: slots.includes(s) ? "#fff" : "var(--z-text-3)" }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Section>
    </>
  );
}
