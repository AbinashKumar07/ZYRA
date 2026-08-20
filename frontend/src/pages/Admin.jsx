import { useEffect, useState } from "react";
import { LogOut, Mail } from "lucide-react";
import Seo from "@/components/Seo";
import { Section, Badge, EmptyState } from "@/components/Primitives";
import { LoginPanel, TOKEN_KEY } from "@/components/LoginPanel";
import { ContentManager } from "./admin/ContentManager";
import { BookingsPanel, TailorsPanel, TeamPanel } from "./admin/Panels";
import { fetchMe, adminStats, adminLeads, updateLeadStatus } from "@/lib/api";

const LEAD_TABS = ["waitlist", "merchant", "investor", "contact"];

const LeadsPanel = ({ token, canWrite }) => {
  const [tab, setTab] = useState("waitlist");
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    adminLeads(token, tab).then(setLeads).catch(() => setLeads([])).finally(() => setLoading(false));
  }, [token, tab]);

  const setStatus = async (id, status) => {
    await updateLeadStatus(token, id, status);
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
  };

  return (
    <div data-testid="leads-panel">
      <div className="flex flex-wrap gap-2">
        {LEAD_TABS.map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)} aria-pressed={tab === t} data-testid={`admin-tab-${t}`}
            className="rounded-full border px-4 py-2 text-[0.74rem] capitalize transition-colors duration-300"
            style={{ borderColor: tab === t ? "var(--z-purple)" : "var(--z-border)", color: tab === t ? "#fff" : "var(--z-text-2)" }}>
            {t}
          </button>
        ))}
      </div>
      {loading ? (
        <p className="mt-6 text-sm" style={{ color: "var(--z-text-2)" }}>Loading leads…</p>
      ) : leads.length === 0 ? (
        <div className="mt-6"><EmptyState title="No submissions yet." copy={`Nothing has come in under ${tab}.`} /></div>
      ) : (
        <div className="mt-6 space-y-3" data-testid="admin-leads">
          {leads.map((l) => (
            <article key={l.id} className="z-card rounded-2xl p-5" data-testid={`admin-lead-${l.id}`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-display text-base font-bold">{l.name}</p>
                  <p className="text-[0.78rem]" style={{ color: "var(--z-text-2)" }}>
                    {l.email}{l.phone ? ` · ${l.phone}` : ""}{l.city ? ` · ${l.city}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone="grey">{l.source || "website"}</Badge>
                  <Badge>{l.status}</Badge>
                  {canWrite && (
                    <select className="z-input !w-auto !py-1.5 !text-[0.72rem]" value={l.status} onChange={(e) => setStatus(l.id, e.target.value)}
                      aria-label={`Update status for ${l.name}`} data-testid={`admin-status-${l.id}`}>
                      {["new", "reviewed", "contacted", "archived"].map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  )}
                </div>
              </div>
              {l.message && <p className="mt-3 text-sm" style={{ color: "var(--z-text-2)" }}>{l.message}</p>}
              {l.details && Object.keys(l.details).length > 0 && (
                <dl className="mt-3 grid gap-2 text-[0.76rem] sm:grid-cols-3">
                  {Object.entries(l.details).map(([k, v]) => (
                    <div key={k}><dt style={{ color: "var(--z-text-3)" }}>{k}</dt><dd>{String(v)}</dd></div>
                  ))}
                </dl>
              )}
              <p className="mt-3 text-[0.68rem]" style={{ color: "var(--z-text-3)" }}>{new Date(l.created_at).toLocaleString()}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || "");
  const [me, setMe] = useState(null);
  const [ready, setReady] = useState(false);
  const [stats, setStats] = useState(null);
  const [view, setView] = useState("leads");

  useEffect(() => {
    if (!token) { setReady(true); return; }
    fetchMe(token)
      .then((u) => { setMe(u); setReady(true); })
      .catch(() => { localStorage.removeItem(TOKEN_KEY); setToken(""); setMe(null); setReady(true); });
  }, [token]);

  useEffect(() => {
    if (me && me.permissions.includes("leads:read")) adminStats(token).then(setStats).catch(() => {});
  }, [me, token]);

  if (!ready) return <Section className="pt-36"><p style={{ color: "var(--z-text-2)" }}>Loading…</p></Section>;

  if (!token || !me)
    return (
      <>
        <Seo title="ZYRA Admin" description="Protected ZYRA admin area." path="/admin" />
        <LoginPanel title="ZYRA Admin" subtitle="Protected area. Authorised team members only." testid="admin" onDone={setToken} />
      </>
    );

  if (me.role === "tailor")
    return (
      <Section className="pt-36">
        <EmptyState title="Tailoring partners have their own console."
          copy="Sign in at /tailor to see the requests offered to you."
          action={<a href="/tailor" className="z-btn z-btn-primary">Go to Tailor Console</a>} />
      </Section>
    );

  const can = (p) => me.permissions.includes(p);
  const VIEWS = [
    ["leads", "Leads", can("leads:read")],
    ["content", "Content CMS", can("content:read")],
    ["bookings", "Tailoring", can("bookings:read")],
    ["tailors", "Partners & Pricing", can("tailors:read")],
    ["team", "Team", can("team:read")],
  ].filter(([, , allowed]) => allowed);

  return (
    <>
      <Seo title="ZYRA Admin — Leads, Content & Tailoring" description="Protected ZYRA admin area." path="/admin" />
      <Section className="pt-32" label="Admin dashboard">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="z-eyebrow">{me.role} access</p>
            <h1 className="font-display mt-2 text-3xl font-extrabold">ZYRA Dashboard</h1>
            <p className="mt-1 text-[0.78rem]" style={{ color: "var(--z-text-2)" }}>{me.email}</p>
          </div>
          <button type="button" className="z-btn z-btn-ghost !py-2.5 !text-[0.68rem]" data-testid="admin-logout"
            onClick={() => { localStorage.removeItem(TOKEN_KEY); setToken(""); setMe(null); }}>
            <LogOut size={14} /> Sign Out
          </button>
        </div>

        {stats && (
          <>
            <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-6" data-testid="admin-stats">
              {[...LEAD_TABS, "total", "bookings"].map((k) => (
                <div key={k} className="z-card rounded-2xl p-5">
                  <p className="text-[0.66rem] uppercase tracking-[0.18em]" style={{ color: "var(--z-text-3)" }}>{k}</p>
                  <p className="font-display mt-1.5 text-2xl font-bold" style={{ color: "var(--z-purple-soft)" }}>{stats[k] ?? 0}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 flex items-center gap-2 text-[0.74rem]" style={{ color: "var(--z-text-3)" }} data-testid="alert-status">
              <Mail size={13} style={{ color: "var(--z-purple-soft)" }} />
              Lead alert emails go to {stats.alert_recipients} configured recipient{stats.alert_recipients === 1 ? "" : "s"} (set via LEAD_ALERT_RECIPIENTS)
              {stats.bookings_awaiting ? ` · ${stats.bookings_awaiting} tailoring request(s) awaiting a partner` : ""}
            </p>
          </>
        )}

        <div className="mt-9 flex flex-wrap gap-2">
          {VIEWS.map(([key, label]) => (
            <button key={key} type="button" onClick={() => setView(key)} aria-pressed={view === key} data-testid={`admin-view-${key}`}
              className="rounded-full border px-4 py-2 text-[0.74rem] transition-colors duration-300"
              style={{ borderColor: view === key ? "var(--z-purple)" : "var(--z-border)", color: view === key ? "#fff" : "var(--z-text-2)" }}>
              {label}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {view === "leads" && can("leads:read") && <LeadsPanel token={token} canWrite={can("leads:write")} />}
          {view === "content" && can("content:read") && <ContentManager token={token} canWrite={can("content:write")} />}
          {view === "bookings" && can("bookings:read") && <BookingsPanel token={token} />}
          {view === "tailors" && can("tailors:read") && <TailorsPanel token={token} canWrite={can("tailors:write")} />}
          {view === "team" && can("team:read") && <TeamPanel token={token} />}
        </div>
      </Section>
    </>
  );
}
