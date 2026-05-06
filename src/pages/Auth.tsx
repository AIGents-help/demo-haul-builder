import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/dashboard", { replace: true });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) navigate("/dashboard", { replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setInfo(null); setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/dashboard` },
        });
        if (error) throw error;
        setInfo("Check your email to confirm your account, then sign in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-ink min-h-screen px-6 py-16">
      <div className="max-w-sm mx-auto">
        <h1 className="font-display text-fire" style={{ fontSize: 36 }}>OWNER LOGIN</h1>
        <p className="text-fog mt-2" style={{ fontSize: 14 }}>
          {mode === "signin" ? "Sign in to view leads & emails." : "Create your owner account."}
        </p>

        <form onSubmit={submit} className="mt-6 space-y-3">
          <input
            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full bg-iron border border-steel text-chalk p-3.5 focus:outline-none focus:border-fire"
          />
          <input
            type="password" required minLength={6} value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full bg-iron border border-steel text-chalk p-3.5 focus:outline-none focus:border-fire"
          />
          {error && <div className="text-avail-red" style={{ fontSize: 13 }}>{error}</div>}
          {info && <div className="text-avail-green" style={{ fontSize: 13 }}>{info}</div>}
          <button
            type="submit" disabled={loading}
            className="w-full bg-fire hover:bg-ember text-white font-display py-3.5 disabled:opacity-50"
            style={{ fontSize: 20 }}
          >
            {loading ? "..." : mode === "signin" ? "SIGN IN" : "CREATE ACCOUNT"}
          </button>
        </form>

        <button
          onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(null); setInfo(null); }}
          className="text-fog mt-4 underline"
          style={{ fontSize: 13 }}
        >
          {mode === "signin" ? "Need an account? Sign up" : "Have an account? Sign in"}
        </button>
      </div>
    </div>
  );
};

export default Auth;