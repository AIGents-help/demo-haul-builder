export type LeadStatus = "new" | "contacted" | "quoted" | "booked" | "follow_up" | "closed";
export type JobStatus = "scheduled" | "in_progress" | "completed" | "invoiced" | "paid" | "issue";
export type ServiceType = "demolition" | "junk_removal" | "hauling";
export type PaymentMethod = "cash" | "card" | "venmo" | "zelle" | "check";

export type Lead = {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  service: string | null;
  zip: string | null;
  message: string | null;
  source: string | null;
  status: LeadStatus;
  estimate_low: number | null;
  estimate_high: number | null;
  follow_up_date: string | null;
  lead_notes: string | null;
};

export type Job = {
  id: string;
  job_number: number;
  job_name: string;
  service_type: ServiceType;
  customer_name: string;
  customer_phone: string | null;
  job_address: string | null;
  zip: string | null;
  job_date: string | null;
  status: JobStatus;
  quoted_amount: number | null;
  final_amount: number | null;
  paid: boolean;
  payment_method: PaymentMethod | null;
  google_review_requested: boolean;
  before_photo_url: string | null;
  after_photo_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export const LEAD_STATUS_COLOR: Record<LeadStatus, string> = {
  new: "hsl(var(--fire))",
  contacted: "#D4A017",
  quoted: "#a855f7",
  booked: "#22c55e",
  follow_up: "#a855f7",
  closed: "#6b7280",
};

export const JOB_STATUS_COLOR: Record<JobStatus, string> = {
  scheduled: "#3b82f6",
  in_progress: "hsl(var(--fire))",
  completed: "#D4A017",
  invoiced: "#a855f7",
  paid: "#22c55e",
  issue: "#dc2626",
};

export const LEAD_STATUS_LABEL: Record<LeadStatus, string> = {
  new: "🆕 New",
  contacted: "📞 Contacted",
  quoted: "💰 Quoted",
  booked: "✅ Booked",
  follow_up: "⏳ Follow Up",
  closed: "❌ Closed",
};

export const JOB_STATUS_LABEL: Record<JobStatus, string> = {
  scheduled: "📅 Scheduled",
  in_progress: "🔨 In Progress",
  completed: "✅ Completed",
  invoiced: "🧾 Invoiced",
  paid: "💰 Paid",
  issue: "⚠️ Issue",
};

export const SERVICE_LABEL: Record<ServiceType, string> = {
  demolition: "Demo",
  junk_removal: "Junk",
  hauling: "Hauling",
};

export const timeAgo = (iso: string) => {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

export const formatMoney = (n: number | null | undefined) =>
  n == null ? "—" : `$${Number(n).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;