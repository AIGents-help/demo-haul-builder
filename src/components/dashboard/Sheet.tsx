import { ReactNode, useEffect } from "react";

export const BottomSheet = ({
  open, onClose, title, children,
}: { open: boolean; onClose: () => void; title: string; children: ReactNode }) => {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end" style={{ background: "rgba(13,13,13,0.8)" }} onClick={onClose}>
      <div
        className="bg-iron border-t-2 border-fire max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-12 h-1 rounded-full bg-steel" />
        </div>
        <div className="px-5 pb-2 flex justify-between items-center">
          <h2 className="font-display text-chalk" style={{ fontSize: 22 }}>{title}</h2>
          <button onClick={onClose} className="text-fog text-2xl leading-none px-2">×</button>
        </div>
        <div className="px-5 pb-8">{children}</div>
      </div>
    </div>
  );
};

export const Toast = ({ message, kind }: { message: string; kind: "success" | "error" }) => (
  <div
    className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] px-4 py-2 text-white"
    style={{
      background: kind === "success" ? "#22c55e" : "#dc2626",
      fontFamily: "Barlow, sans-serif", fontSize: 14, fontWeight: 600,
    }}
  >
    {message}
  </div>
);