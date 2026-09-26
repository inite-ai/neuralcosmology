"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ModerationActions({ id, status, labels }: { id: string; status: string; pinned: boolean; labels: { hide: string; show: string; del: string } }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const act = async (action: string) => {
    setBusy(true);
    await fetch(`/api/reader/comments/${id}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action }) });
    setBusy(false);
    router.refresh();
  };
  const btn = "inline-flex min-h-10 items-center rounded-sm hairline px-4 label disabled:opacity-40 hover:bg-fg hover:text-bg";
  return (
    <div className="flex gap-2">
      <button type="button" disabled={busy} className={btn} onClick={() => act(status === "published" ? "hide" : "show")}>
        {status === "published" ? labels.hide : labels.show}
      </button>
      <button type="button" disabled={busy} className={btn} onClick={() => act("delete")}>{labels.del}</button>
    </div>
  );
}
