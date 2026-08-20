import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Check } from "lucide-react";
import { submitLead, formatApiErrorDetail } from "@/lib/api";

// Generic, data-driven lead form used by waitlist / merchant / investor / contact.
export const LeadForm = ({ type, fields, cta, success, testid, columns = 2 }) => {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [state, setState] = useState("idle");

  const set = (name, v) => {
    setValues((p) => ({ ...p, [name]: v }));
    setErrors((p) => ({ ...p, [name]: undefined }));
  };

  const validate = () => {
    const e = {};
    fields.forEach((f) => {
      const v = (values[f.name] || "").trim();
      if (f.required && !v) e[f.name] = `${f.label} is required`;
      if (f.name === "email" && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) e.email = "Enter a valid email address";
      if (f.type === "tel" && v && v.replace(/\D/g, "").length < 7) e[f.name] = "Enter a valid phone number";
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setState("loading");
    const core = ["name", "email", "phone", "city", "message"];
    const details = {};
    Object.entries(values).forEach(([k, v]) => {
      if (!core.includes(k) && v) details[k] = v;
    });
    try {
      await submitLead({
        type,
        name: values.name?.trim(),
        email: values.email?.trim(),
        phone: values.phone?.trim() || null,
        city: values.city?.trim() || null,
        message: values.message?.trim() || null,
        details,
      });
      setState("success");
      toast.success(success);
    } catch (err) {
      setState("idle");
      toast.error(formatApiErrorDetail(err.response?.data?.detail));
    }
  };

  if (state === "success")
    return (
      <div className="z-card rounded-2xl px-6 py-14 text-center" data-testid={`${testid}-success`}>
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full" style={{ background: "rgba(124,58,237,0.18)" }}>
          <Check size={22} style={{ color: "var(--z-purple-soft)" }} />
        </span>
        <p className="font-display mt-5 text-xl font-bold">{success}</p>
        <p className="mt-3 text-sm" style={{ color: "var(--z-text-2)" }}>We have your details. Nothing else needed from you right now.</p>
      </div>
    );

  return (
    <form onSubmit={onSubmit} noValidate data-testid={testid} className="grid gap-5" style={{ gridTemplateColumns: "1fr" }}>
      <div className={`grid gap-5 ${columns === 2 ? "sm:grid-cols-2" : ""}`}>
        {fields.map((f) => {
          const id = `${testid}-${f.name}`;
          const isFull = f.type === "textarea" || f.full;
          return (
            <div key={f.name} className={isFull && columns === 2 ? "sm:col-span-2" : ""}>
              <label htmlFor={id} className="mb-2 block text-[0.72rem] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--z-text-2)" }}>
                {f.label}{f.required && <span aria-hidden="true" style={{ color: "var(--z-purple-soft)" }}> *</span>}
              </label>
              {f.type === "textarea" ? (
                <textarea id={id} data-testid={id} rows={4} className="z-input" placeholder={f.placeholder}
                  value={values[f.name] || ""} onChange={(e) => set(f.name, e.target.value)}
                  aria-invalid={!!errors[f.name]} aria-describedby={errors[f.name] ? `${id}-err` : undefined} />
              ) : f.type === "select" ? (
                <select id={id} data-testid={id} className="z-input" value={values[f.name] || ""} onChange={(e) => set(f.name, e.target.value)}
                  aria-invalid={!!errors[f.name]}>
                  <option value="">Select…</option>
                  {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input id={id} data-testid={id} type={f.type || "text"} className="z-input" placeholder={f.placeholder}
                  value={values[f.name] || ""} onChange={(e) => set(f.name, e.target.value)}
                  aria-invalid={!!errors[f.name]} aria-describedby={errors[f.name] ? `${id}-err` : undefined} />
              )}
              {errors[f.name] && (
                <p id={`${id}-err`} role="alert" data-testid={`${id}-error`} className="mt-1.5 text-xs" style={{ color: "#f87171" }}>{errors[f.name]}</p>
              )}
            </div>
          );
        })}
      </div>
      <div>
        <button type="submit" disabled={state === "loading"} data-testid={`${testid}-submit`} className="z-btn z-btn-primary w-full sm:w-auto">
          {state === "loading" && <Loader2 size={15} className="animate-spin" />}
          {state === "loading" ? "Sending" : cta}
        </button>
      </div>
    </form>
  );
};

export const WAITLIST_FIELDS = [
  { name: "name", label: "Name", required: true, placeholder: "Your name" },
  { name: "email", label: "Email", type: "email", required: true, placeholder: "you@email.com" },
  { name: "phone", label: "Phone (optional)", type: "tel", placeholder: "+91" },
  { name: "city", label: "City", required: true, placeholder: "Delhi / Gurugram / Noida" },
  { name: "interest", label: "Interested in", type: "select", full: true,
    options: ["Shopping", "Pairs", "Tailoring", "Merchant Partnership", "Investment / Partnership"] },
];
