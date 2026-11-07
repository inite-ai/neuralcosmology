"use client";

import { useState } from "react";

// Кнопка «Встроить к себе» под опытом: код рамки и ссылка на источник под ней.
// Ссылка стоит вне iframe — только такая считается ссылкой с чужой страницы на нашу.
export default function EmbedCode({ code, label, hint, copy, copied }: { code: string; label: string; hint: string; copy: string; copied: string }) {
  const [done, setDone] = useState(false);
  return (
    <details className="mt-6 text-sm">
      <summary className="label cursor-pointer text-fg-secondary hover:text-fg">{label}</summary>
      <p className="mt-3 text-fg-secondary">{hint}</p>
      <textarea
        readOnly
        value={code}
        rows={5}
        onFocus={(e) => e.currentTarget.select()}
        className="mt-3 w-full resize-none border border-line bg-bg p-3 font-mono text-xs leading-relaxed"
      />
      <button
        type="button"
        className="nc-x-btn mt-2"
        onClick={() => {
          navigator.clipboard?.writeText(code).then(() => {
            setDone(true);
            setTimeout(() => setDone(false), 2000);
          }, () => {});
        }}
      >
        {done ? copied : copy}
      </button>
    </details>
  );
}
