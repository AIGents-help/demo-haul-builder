import { UserPlus } from "lucide-react";

type Props = {
  variant?: "solid" | "outline" | "ghost";
  className?: string;
  label?: string;
};

export const SaveContactButton = ({ variant = "outline", className = "", label = "Save Contact" }: Props) => {
  const base =
    "inline-flex items-center gap-2 font-condensed font-bold uppercase px-4 py-2.5 transition-colors";
  const styles =
    variant === "solid"
      ? "bg-fire hover:bg-ember text-white"
      : variant === "ghost"
      ? "text-chalk hover:text-fire"
      : "border border-fire text-fire hover:bg-fire hover:text-white";

  return (
    <a
      href="/diantonios.vcf"
      download="DiAntonios-Demo-Hauling.vcf"
      className={`${base} ${styles} ${className}`}
      style={{ fontSize: 13, letterSpacing: 1 }}
      aria-label="Save DiAntonio's Demo & Hauling to your contacts"
    >
      <UserPlus className="h-4 w-4" />
      {label}
    </a>
  );
};