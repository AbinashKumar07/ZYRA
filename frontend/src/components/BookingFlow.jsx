import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, CalendarDays, Check, Search } from "lucide-react";
import { Badge, Disclaimer, EmptyState } from "./Primitives";
import { fetchTailoringOptions, fetchSlots, requestBooking, trackBooking, formatApiErrorDetail } from "@/lib/api";

const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");
const dateOptions = () => {
  const out = [];
  for (let i = 1; i <= 21; i += 1) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
};
const pretty = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });

const STEPS = ["Garment", "Service", "Date & slot", "Measurements", "Your details"];

export const BookingFlow = () => {
  const [options, setOptions] = useState(null);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ city: "Delhi", garment: "", service: "", date: "", slot: "", measurement_method: "", name: "", email: "", phone: "", notes: "" });
  const [slots, setSlots] = useState(null);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetchTailoringOptions().then(setOptions).catch(() => setOptions({ garments: [], services: [], measurement_methods: [], cities: [], pricing: [] }));
  }, []);

  useEffect(() => {
    if (!form.date || !form.city) return;
    setSlotsLoading(true);
    setSlots(null);
    fetchSlots(form.city, form.date)
      .then(setSlots)
      .catch(() => setSlots({ slots: [], any_available: false }))
      .finally(() => setSlotsLoading(false));
  }, [form.date, form.city]);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v, ...(k === "date" ? { slot: "" } : {}) }));

  const band = options?.pricing?.find(
    (p) => p.garment === form.garment && p.service === form.service && p.city === form.city
  );

  const canContinue = [
    !!form.garment,
    !!form.service,
    !!form.date && !!form.slot,
    !!form.measurement_method,
    form.name.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) && form.phone.replace(/\D/g, "").length >= 7,
  ][step];

  const submit = async () => {
    setSubmitting(true);
    try {
      const data = await requestBooking({ ...form, notes: form.notes || null });
      setResult(data);
      toast.success("Request sent. A tailoring partner needs to accept it.");
    } catch (e) {
      toast.error(formatApiErrorDetail(e.response?.data?.detail));
    } finally {
      setSubmitting(false);
    }
  };

  if (!options) return <div className="z-skel h-64 w-full rounded-3xl" />;

  if (result)
    return (
      <div className="z-card rounded-3xl p-7 text-center" data-testid="booking-success">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full" style={{ background: "rgba(124,58,237,0.18)" }}>
          <Check size={22} style={{ color: "var(--z-purple-soft)" }} />
        </span>
        <p className="font-display mt-5 text-xl font-bold">Request sent — not confirmed yet</p>
        <p className="mx-auto mt-3 max-w-md text-sm" style={{ color: "var(--z-text-2)" }}>
          {result.partners_notified} independent tailoring {result.partners_notified === 1 ? "partner has" : "partners have"} been
          asked. Your appointment is confirmed only once a partner accepts — we'll email you the moment that happens.
        </p>
        <p className="font-display mt-5 text-lg font-bold" style={{ color: "var(--z-purple-soft)" }} data-testid="booking-reference">
          {result.reference}
        </p>
        {result.estimate_min ? (
          <p className="mt-2 text-sm" style={{ color: "var(--z-text-2)" }}>
            Estimated range {inr(result.estimate_min)} – {inr(result.estimate_max)}
          </p>
        ) : null}
        <div className="mt-6"><Disclaimer>Estimate ranges are indicative and are finalised by the partner after measurements.</Disclaimer></div>
        <button type="button" className="z-btn z-btn-ghost mt-6" data-testid="booking-restart"
          onClick={() => { setResult(null); setStep(0); setForm({ ...form, garment: "", service: "", date: "", slot: "", measurement_method: "", notes: "" }); }}>
          Book Another
        </button>
      </div>
    );

  return (
    <div className="z-card rounded-3xl p-6 sm:p-8" data-testid="booking-flow">
      <div className="flex flex-wrap items-center gap-2">
        {STEPS.map((s, i) => (
          <span key={s} className="flex items-center gap-2 text-[0.66rem] uppercase tracking-[0.14em]"
            style={{ color: i === step ? "var(--z-purple-soft)" : i < step ? "var(--z-text-2)" : "var(--z-text-3)" }}>
            {i > 0 && <span aria-hidden="true">·</span>}{s}
          </span>
        ))}
      </div>

      <div className="mt-7">
        {step === 0 && (
          <fieldset>
            <legend className="font-display text-lg font-bold">Which garment?</legend>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {options.garments.map((g) => (
                <button key={g} type="button" onClick={() => set("garment", g)} aria-pressed={form.garment === g}
                  data-testid={`booking-garment-${g.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                  className="rounded-full border px-4 py-2.5 text-[0.78rem] transition-colors duration-300"
                  style={{ borderColor: form.garment === g ? "var(--z-purple)" : "var(--z-border)", color: form.garment === g ? "#fff" : "var(--z-text-2)" }}>
                  {g}
                </button>
              ))}
            </div>
            <label className="mt-6 block max-w-xs">
              <span className="mb-1.5 block text-[0.66rem] uppercase tracking-[0.16em]" style={{ color: "var(--z-text-3)" }}>City</span>
              <select className="z-input" value={form.city} onChange={(e) => set("city", e.target.value)} data-testid="booking-city">
                {options.cities.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
          </fieldset>
        )}

        {step === 1 && (
          <fieldset>
            <legend className="font-display text-lg font-bold">Which service?</legend>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {options.services.map((s) => {
                const b = options.pricing.find((p) => p.garment === form.garment && p.service === s && p.city === form.city);
                return (
                  <button key={s} type="button" onClick={() => set("service", s)} aria-pressed={form.service === s}
                    data-testid={`booking-service-${s.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                    className="rounded-xl border p-4 text-left transition-colors duration-300"
                    style={{ borderColor: form.service === s ? "var(--z-purple)" : "var(--z-border)" }}>
                    <span className="font-display block text-[0.95rem] font-bold">{s}</span>
                    <span className="mt-1 block text-[0.74rem]" style={{ color: "var(--z-text-3)" }}>
                      {b ? `Estimated ${inr(b.min_price)} – ${inr(b.max_price)}` : "Estimate shared after review"}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}

        {step === 2 && (
          <fieldset>
            <legend className="font-display text-lg font-bold">Pick a date and slot</legend>
            <div className="z-scroll-x mt-4 pb-2">
              {dateOptions().map((d) => (
                <button key={d} type="button" onClick={() => set("date", d)} aria-pressed={form.date === d}
                  data-testid={`booking-date-${d}`}
                  className="rounded-xl border px-4 py-3 text-[0.76rem] transition-colors duration-300"
                  style={{ borderColor: form.date === d ? "var(--z-purple)" : "var(--z-border)", color: form.date === d ? "#fff" : "var(--z-text-2)" }}>
                  {pretty(d)}
                </button>
              ))}
            </div>
            <div className="mt-5" data-testid="booking-slots">
              {!form.date ? (
                <p className="text-sm" style={{ color: "var(--z-text-3)" }}>Choose a date to see the slots partners have opened.</p>
              ) : slotsLoading ? (
                <div className="flex gap-2">{[0, 1, 2, 3].map((i) => <span key={i} className="z-skel h-10 w-24 rounded-full" />)}</div>
              ) : slots?.any_available ? (
                <div className="flex flex-wrap gap-2.5">
                  {slots.slots.map((s) => (
                    <button key={s.slot} type="button" onClick={() => set("slot", s.slot)} aria-pressed={form.slot === s.slot}
                      data-testid={`booking-slot-${s.slot.replace(":", "")}`}
                      className="rounded-full border px-4 py-2.5 text-[0.78rem] transition-colors duration-300"
                      style={{ borderColor: form.slot === s.slot ? "var(--z-purple)" : "var(--z-border)", color: form.slot === s.slot ? "#fff" : "var(--z-text-2)" }}>
                      {s.slot}
                      <span className="ml-2 text-[0.62rem]" style={{ color: "var(--z-text-3)" }}>
                        {s.partners_available} {s.partners_available === 1 ? "partner" : "partners"}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="rounded-xl px-4 py-3 text-[0.8rem]" style={{ background: "rgba(255,255,255,0.03)", color: "var(--z-text-2)" }}>
                  No tailoring partner is available on that date in {form.city}. Try another date.
                </p>
              )}
            </div>
          </fieldset>
        )}

        {step === 3 && (
          <fieldset>
            <legend className="font-display text-lg font-bold">How should we take measurements?</legend>
            <div className="mt-4 grid gap-3">
              {options.measurement_methods.map((m) => (
                <button key={m} type="button" onClick={() => set("measurement_method", m)} aria-pressed={form.measurement_method === m}
                  data-testid={`booking-measure-${m.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 24)}`}
                  className="rounded-xl border p-4 text-left text-[0.85rem] transition-colors duration-300"
                  style={{ borderColor: form.measurement_method === m ? "var(--z-purple)" : "var(--z-border)", color: form.measurement_method === m ? "#fff" : "var(--z-text-2)" }}>
                  {m}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        {step === 4 && (
          <div className="grid gap-4 sm:grid-cols-2">
            {[["name", "Name", "text"], ["email", "Email", "email"], ["phone", "Phone", "tel"]].map(([k, label, type]) => (
              <label key={k} className={k === "phone" ? "sm:col-span-2" : ""}>
                <span className="mb-1.5 block text-[0.66rem] uppercase tracking-[0.16em]" style={{ color: "var(--z-text-3)" }}>{label}</span>
                <input className="z-input" type={type} value={form[k]} onChange={(e) => set(k, e.target.value)} data-testid={`booking-${k}`} />
              </label>
            ))}
            <label className="sm:col-span-2">
              <span className="mb-1.5 block text-[0.66rem] uppercase tracking-[0.16em]" style={{ color: "var(--z-text-3)" }}>Notes (optional)</span>
              <textarea rows={3} className="z-input" value={form.notes} onChange={(e) => set("notes", e.target.value)} data-testid="booking-notes" />
            </label>
            <div className="sm:col-span-2 rounded-xl px-4 py-3 text-[0.78rem]" style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(167,139,250,0.22)", color: "var(--z-text-2)" }}>
              {form.garment} · {form.service} · {pretty(form.date)} at {form.slot} · {form.city}
              {band ? <><br />Estimated {inr(band.min_price)} – {inr(band.max_price)} (indicative)</> : null}
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        {step > 0 && (
          <button type="button" className="z-btn z-btn-ghost" onClick={() => setStep((s) => s - 1)} data-testid="booking-back">Back</button>
        )}
        {step < STEPS.length - 1 ? (
          <button type="button" className="z-btn z-btn-primary" disabled={!canContinue} onClick={() => setStep((s) => s + 1)} data-testid="booking-next">
            Continue
          </button>
        ) : (
          <button type="button" className="z-btn z-btn-primary" disabled={!canContinue || submitting} onClick={submit} data-testid="booking-submit">
            {submitting && <Loader2 size={15} className="animate-spin" />}
            {submitting ? "Sending" : "Request This Appointment"}
          </button>
        )}
        <Badge tone="grey">Confirmed only after a partner accepts</Badge>
      </div>
    </div>
  );
};

export const BookingTracker = () => {
  const [ref, setRef] = useState("");
  const [state, setState] = useState({ status: "idle" });

  const look = async (e) => {
    e.preventDefault();
    setState({ status: "loading" });
    try {
      setState({ status: "done", data: await trackBooking(ref.trim()) });
    } catch (err) {
      setState({ status: "error", message: formatApiErrorDetail(err.response?.data?.detail) });
    }
  };

  return (
    <div className="z-card rounded-3xl p-6" data-testid="booking-tracker">
      <h3 className="font-display text-lg font-bold">Track a request</h3>
      <form onSubmit={look} className="mt-4 flex flex-col gap-3 sm:flex-row">
        <label htmlFor="track-ref" className="sr-only">Booking reference</label>
        <input id="track-ref" className="z-input" placeholder="ZT-XXXXXX" value={ref} onChange={(e) => setRef(e.target.value)} data-testid="track-input" />
        <button type="submit" className="z-btn z-btn-ghost" data-testid="track-submit">
          <Search size={14} /> Check
        </button>
      </form>
      {state.status === "loading" && <p className="mt-4 text-sm" style={{ color: "var(--z-text-2)" }}>Checking…</p>}
      {state.status === "error" && <p role="alert" className="mt-4 text-sm" style={{ color: "#f87171" }} data-testid="track-error">{state.message}</p>}
      {state.status === "done" && (
        <dl className="mt-5 grid grid-cols-2 gap-3 text-[0.8rem]" data-testid="track-result">
          <div><dt style={{ color: "var(--z-text-3)" }}>Status</dt><dd className="capitalize">{state.data.status.replace(/_/g, " ")}</dd></div>
          <div><dt style={{ color: "var(--z-text-3)" }}>Garment</dt><dd>{state.data.garment}</dd></div>
          <div><dt style={{ color: "var(--z-text-3)" }}>Date</dt><dd>{pretty(state.data.date)} · {state.data.slot}</dd></div>
          <div><dt style={{ color: "var(--z-text-3)" }}>Partner</dt><dd>{state.data.tailor_name || "Awaiting acceptance"}</dd></div>
        </dl>
      )}
    </div>
  );
};

export const InstantFitPanel = () => (
  <div className="z-card rounded-3xl p-6" data-testid="instant-fit-panel">
    <div className="flex items-center gap-3">
      <CalendarDays size={16} style={{ color: "var(--z-purple-soft)" }} />
      <h3 className="font-display text-lg font-bold">Instant Fit is not booked in advance</h3>
    </div>
    <p className="mt-3 text-sm" style={{ color: "var(--z-text-2)" }}>
      Instant Fit stays an availability-based service you opt into at the time of your order — not a scheduled appointment.
      If a partner is free nearby, you'll see the tailor, the estimated service fee and the estimated arrival before you accept.
    </p>
    <p className="mt-4 rounded-xl px-4 py-3 text-[0.78rem]" style={{ background: "rgba(255,255,255,0.03)", color: "var(--z-text-2)" }}>
      No tailor is available right now. Try another time or continue without fitting.
    </p>
    <div className="mt-4"><Disclaimer>Subject to local tailor availability.</Disclaimer></div>
  </div>
);

export const NoBookings = ({ label }) => <EmptyState title="Nothing here yet." copy={label} />;
