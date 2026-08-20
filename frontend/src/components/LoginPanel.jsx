import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Section } from "./Primitives";
import { login, formatApiErrorDetail } from "@/lib/api";

export const TOKEN_KEY = "zyra_admin_token";

export const LoginPanel = ({ title, subtitle, testid, onDone }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await login(email.trim(), password);
      localStorage.setItem(TOKEN_KEY, data.access_token);
      onDone(data.access_token);
    } catch (err) {
      setError(formatApiErrorDetail(err.response?.data?.detail) || err.message);
      setLoading(false);
    }
  };

  return (
    <Section className="pt-36" label={`${title} sign in`}>
      <div className="z-card mx-auto max-w-md rounded-3xl p-8">
        <h1 className="font-display text-2xl font-bold">{title}</h1>
        <p className="mt-2 text-sm" style={{ color: "var(--z-text-2)" }}>{subtitle}</p>
        <form onSubmit={submit} className="mt-7 space-y-4">
          <div>
            <label htmlFor={`${testid}-email`} className="mb-1.5 block text-[0.7rem] uppercase tracking-[0.16em]" style={{ color: "var(--z-text-2)" }}>Email</label>
            <input id={`${testid}-email`} data-testid={`${testid}-email`} type="email" className="z-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label htmlFor={`${testid}-password`} className="mb-1.5 block text-[0.7rem] uppercase tracking-[0.16em]" style={{ color: "var(--z-text-2)" }}>Password</label>
            <input id={`${testid}-password`} data-testid={`${testid}-password`} type="password" className="z-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p role="alert" data-testid={`${testid}-login-error`} className="text-xs" style={{ color: "#f87171" }}>{error}</p>}
          <button type="submit" disabled={loading} data-testid={`${testid}-login-submit`} className="z-btn z-btn-primary w-full">
            {loading && <Loader2 size={15} className="animate-spin" />}{loading ? "Signing in" : "Sign In"}
          </button>
        </form>
      </div>
    </Section>
  );
};
