// Фоновые задачи сервера: расписание автопостинга цитат (lib/social/run.ts).
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs" || process.env.NEXT_PHASE === "phase-production-build") return;
  const { startScheduler } = await import("@/lib/social/run");
  startScheduler();
}
