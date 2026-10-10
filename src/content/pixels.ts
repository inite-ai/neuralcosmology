// Рекламные пиксели. Пустой ID — пиксель не грузится. Где взять:
// meta   — Events Manager → Data sources → Pixel ID (число);
// vk     — VK Реклама → Пиксели (Top.Mail.Ru, число);
// reddit — Reddit Ads → Events Manager → Pixel ID (a2_…).
// Яндекс.Метрика — в verification.ts (её номер нужен и Директу).
// В ЕЭЗ, UK и Швейцарии пиксели не грузятся: баннера согласия у сайта нет.
export const pixels = {
  // Пиксель портфолио Neuralcosmology: на нём Conversions API и автоматическое сопоставление.
  meta: "1141000561834089",
  // Прежний пиксель личного рекламного аккаунта — пока на нём старые объявления; потом убрать.
  metaLegacy: "1307118051447861",
  vk: "",
  reddit: "",
};
