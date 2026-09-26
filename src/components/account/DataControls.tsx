"use client";
import { useState } from "react";

type Labels = { export: string; del: string; confirm: string; cancel: string; done: string; note: string };

// Выгрузка и удаление данных читателя. Удаление — в два шага, без системных диалогов.
export default function DataControls({ labels, locale }: { labels: Labels; locale: string }) {
  const [step, setStep] = useState<"idle" | "confirm" | "done">("idle");
  const erase = async () => {
    const r = await fetch("/api/account/delete", { method: "POST" }).catch(() => null);
    if (r?.ok) {
      setStep("done");
      setTimeout(() => (window.location.href = `/api/auth/logout?returnTo=/${locale}`), 1500);
    }
  };
  return (
    <div>
      <div className="flex flex-wrap items-center gap-4">
        <a href="/api/account/export" className="inline-flex min-h-11 items-center rounded-sm hairline border-fg/60 px-5 label hover:bg-fg hover:text-bg">{labels.export}</a>
        {step === "idle" && <button type="button" onClick={() => setStep("confirm")} className="label text-muted hover:text-fg">{labels.del}</button>}
        {step === "confirm" && (
          <>
            <button type="button" onClick={erase} className="inline-flex min-h-11 items-center rounded-sm bg-[#b3261e] px-5 label text-white">{labels.confirm}</button>
            <button type="button" onClick={() => setStep("idle")} className="label text-muted hover:text-fg">{labels.cancel}</button>
          </>
        )}
        {step === "done" && <span className="label text-primary">{labels.done}</span>}
      </div>
      <p className="mt-4 max-w-[62ch] text-sm text-muted">{labels.note}</p>
    </div>
  );
}
