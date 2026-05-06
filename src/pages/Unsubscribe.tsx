import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Unsubscribe = () => {
  const [state, setState] = useState<"loading" | "ready" | "done" | "invalid" | "already">("loading");
  const [submitting, setSubmitting] = useState(false);
  const token = new URLSearchParams(window.location.search).get("token");

  useEffect(() => {
    if (!token) { setState("invalid"); return; }
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`;
    fetch(url, { headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY } })
      .then((r) => r.json())
      .then((d) => {
        if (d.valid) setState("ready");
        else if (d.reason === "already_unsubscribed") setState("already");
        else setState("invalid");
      })
      .catch(() => setState("invalid"));
  }, [token]);

  const confirm = async () => {
    if (!token) return;
    setSubmitting(true);
    const { data } = await supabase.functions.invoke("handle-email-unsubscribe", { body: { token } });
    if (data?.success || data?.reason === "already_unsubscribed") setState("done");
    else setState("invalid");
    setSubmitting(false);
  };

  return (
    <main className="min-h-screen bg-ink flex items-center justify-center p-6">
      <div className="bg-iron border border-steel max-w-md w-full p-10 text-center">
        <h1 className="font-display text-chalk text-4xl mb-4">UNSUBSCRIBE</h1>
        {state === "loading" && <p className="text-fog">Checking your link...</p>}
        {state === "invalid" && <p className="text-fog">This link is invalid or expired.</p>}
        {state === "already" && <p className="text-fog">You've already unsubscribed.</p>}
        {state === "ready" && (
          <>
            <p className="text-fog mb-6">Click below to confirm you want to stop receiving these emails.</p>
            <button onClick={confirm} disabled={submitting} className="w-full bg-fire hover:bg-ember text-white font-display py-3 disabled:opacity-50">
              {submitting ? "PROCESSING..." : "CONFIRM UNSUBSCRIBE"}
            </button>
          </>
        )}
        {state === "done" && <p className="text-chalk">✅ You've been unsubscribed.</p>}
      </div>
    </main>
  );
};

export default Unsubscribe;