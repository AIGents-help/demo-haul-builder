// Script wordmark that mirrors the logo printed on DiAntonio's shirts and trucks:
// green italic script with a hard black drop shadow.
type Props = { size?: "sm" | "md" | "lg"; className?: string };

const SIZES = {
  sm: { main: 26, sub: 13 },
  md: { main: 40, sub: 18 },
  lg: { main: 72, sub: 30 },
};

export const Logo = ({ size = "sm", className = "" }: Props) => {
  const s = SIZES[size];
  return (
    <div className={`leading-none select-none ${className}`} aria-label="DiAntonio's Demo & Hauling">
      <div className="font-script brand-script" style={{ fontSize: s.main }}>
        DiAntonio's
      </div>
      <div className="font-script brand-script -mt-1 pl-[18%]" style={{ fontSize: s.sub }}>
        Demo &amp; Hauling
      </div>
    </div>
  );
};
