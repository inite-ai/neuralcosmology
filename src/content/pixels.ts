// Рекламные пиксели. Пустой ID — пиксель не грузится. Где взять:
// meta   — Events Manager → Data sources → Pixel ID (число);
// vk     — VK Реклама → Пиксели (Top.Mail.Ru, число);
// reddit — Reddit Ads → Events Manager → Pixel ID (a2_…).
// Яндекс.Метрика — в verification.ts (её номер нужен и Директу).
// В ЕЭЗ, UK и Швейцарии пиксели не грузятся: баннера согласия у сайта нет.
export const pixels = {
  meta: "1307118051447861",
  vk: "",
  reddit: "",
};
