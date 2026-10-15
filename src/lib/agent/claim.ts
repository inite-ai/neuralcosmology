import "server-only";
import { billing } from "@/lib/billing";

// Покупки, оформленные агентом на почту читателя (гостевой заказ
// neuralcosmology:<sha256(email)>), переходят на аккаунт, когда читатель
// входит с этой почтой и провайдер её подтвердил. Без этого купленная
// агентом книга не открылась бы: доступ проверяется по DID.
// Не бросает: при сбое следующий вход попробует снова.
export async function claimGuestPurchases(sub: string, email: string): Promise<void> {
  if (!billing().configured) return;
  const claimed = await billing().claimGuestPurchases(sub, email);
  if (claimed.length) console.log(`[claim] ${claimed.length} guest order(s) moved to ${sub.slice(0, 20)}`);
}
