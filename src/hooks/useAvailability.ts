import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AvailabilityStatus = "open" | "filling" | "full";
export interface Availability {
  status: AvailabilityStatus;
  message: string;
}

const DEFAULT: Availability = {
  status: "open",
  message: "This week — openings available",
};

export function useAvailability() {
  const [availability, setAvailability] = useState<Availability>(DEFAULT);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from("availability")
      .select("status, message")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled && data) {
          setAvailability({
            status: (data.status as AvailabilityStatus) ?? "open",
            message: data.message ?? DEFAULT.message,
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return availability;
}

export const statusColor = (s: AvailabilityStatus) =>
  s === "open" ? "hsl(var(--avail-green))"
  : s === "filling" ? "hsl(var(--gold))"
  : "hsl(var(--avail-red))";