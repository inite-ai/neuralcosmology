import { ReactNode } from "react";

export default function PageShell({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  children: ReactNode;
}) {
  return (
    <main className="relative min-h-screen text-white">
      <div className="pt-24 sm:pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <header className="mb-10 sm:mb-14 max-w-3xl">
            {eyebrow && (
              <div className="text-xs uppercase tracking-[0.2em] text-indigo-300/80 mb-3">
                {eyebrow}
              </div>
            )}
            <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white leading-tight">
              {title}
            </h1>
            {lead && (
              <p className="mt-4 text-base sm:text-lg text-white/70 leading-relaxed">
                {lead}
              </p>
            )}
          </header>
          {children}
        </div>
      </div>
    </main>
  );
}
