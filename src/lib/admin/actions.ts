"use server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getBookBySlug } from "@/content/books";
import { act, owner } from "@/lib/admin/guard";
import { STATUSES } from "@/lib/admin/data";
import { forgetGrants } from "@/lib/grants";
import { confirmWording, validEmail } from "@/lib/subscribe";
import { audience, grantChapters, rememberContact, stopAll } from "@/lib/audience.server";

// Действия бэкофиса. Каждое само проверяет владельца и пишет в журнал (act), прежде чем менять.

export type Result = { error?: string; ok?: string };
const UUID = /^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;
const field = (f: FormData, k: string, max = 500) => String(f.get(k) ?? "").trim().slice(0, max);
const done = (ok?: string): Result => {
  revalidatePath("/[locale]/admin", "layout");
  return { ok };
};

export async function setInquiry(_: Result, f: FormData): Promise<Result> {
  await owner();
  const id = field(f, "id"), status = field(f, "status"), note = field(f, "note", 4000);
  if (!UUID.test(id) || !(STATUSES as readonly string[]).includes(status)) return { error: "Не сохранилось: обновите страницу и попробуйте снова." };
  await act("inquiry.update", id, { status });
  const sql = await db();
  await sql`UPDATE inquiries SET status = ${status}, note = ${note || null}, updated_at = now() WHERE id = ${id}`;
  return done("Сохранено");
}

export async function deleteInquiry(f: FormData): Promise<void> {
  await owner();
  const id = field(f, "id");
  if (!UUID.test(id)) return;
  await act("inquiry.delete", id);
  const sql = await db();
  await sql`DELETE FROM inquiries WHERE id = ${id}`;
  done();
}

export async function grantBook(_: Result, f: FormData): Promise<Result> {
  const me = await owner();
  const email = field(f, "email", 254).toLowerCase(), userId = field(f, "userId", 200), book = field(f, "book", 60), note = field(f, "note");
  if (book !== "library" && !getBookBySlug(book)) return { error: "Выберите книгу." };
  if (!userId && !validEmail(email)) return { error: "Нужна почта читателя, целиком." };
  const sql = await db();
  const [same] = await sql`SELECT 1 FROM book_grants WHERE revoked_at IS NULL AND book = ${book}
    AND (${userId ? sql`user_id = ${userId}` : sql`lower(email) = ${email}`})`;
  if (same) return { error: "Этот доступ уже выдан." };
  await act("grant.add", userId || email, { book, note });
  await sql`INSERT INTO book_grants (email, user_id, book, note, granted_by) VALUES (${userId ? null : email}, ${userId || null}, ${book}, ${note || null}, ${me.email ?? me.sub})`;
  forgetGrants();
  return done("Доступ выдан");
}

export async function setGrant(f: FormData): Promise<void> {
  await owner();
  const id = field(f, "id"), on = field(f, "on") === "1";
  if (!UUID.test(id)) return;
  await act(on ? "grant.restore" : "grant.revoke", id);
  const sql = await db();
  await sql`UPDATE book_grants SET revoked_at = ${on ? null : new Date()} WHERE id = ${id}`;
  forgetGrants();
  done();
}

export async function setComment(f: FormData): Promise<void> {
  await owner();
  const id = field(f, "id"), status = field(f, "status");
  if (!UUID.test(id) || (status !== "published" && status !== "hidden")) return;
  await act(status === "published" ? "comment.publish" : "comment.hide", id);
  const sql = await db();
  await sql`UPDATE comments SET status = ${status} WHERE id = ${id}`;
  done();
}

export async function deleteComment(f: FormData): Promise<void> {
  await owner();
  const id = field(f, "id");
  if (!UUID.test(id)) return;
  await act("comment.delete", id);
  const sql = await db();
  await sql`DELETE FROM comments WHERE id = ${id}`;
  done();
}

export async function stopSubscriber(f: FormData): Promise<void> {
  await owner();
  const email = field(f, "email", 254).toLowerCase();
  if (!email) return;
  await act("subscriber.stop", email);
  const sql = await db();
  await sql`UPDATE subscribers SET status = 'unsubscribed' WHERE lower(email) = ${email}`;
  await sql`UPDATE reader_prefs SET notify = false WHERE lower(email) = ${email}`;
  done();
}

export async function deleteSubscriber(f: FormData): Promise<void> {
  await owner();
  const email = field(f, "email", 254).toLowerCase();
  if (!email) return;
  await act("subscriber.delete", email);
  const sql = await db();
  await sql`DELETE FROM subscribers WHERE lower(email) = ${email}`;
  done();
}

/**
 * Brings the old lists into the address book (@inite/audience): every confirmed
 * subscriber, and every reader with letters switched on in the account, gets the
 * consent they gave; every unsubscribed address goes on the stop list; every
 * enquiry becomes a contact. An address the book already has an answer for is
 * left as it is, so a second press changes nothing.
 */
export async function importAudience(_: Result): Promise<Result> {
  await owner();
  const a = await audience();
  if (!a) return { error: "Адресная книга выключена: нет AUDIENCE_SECRET." };
  const sql = await db();
  let granted = 0, stoppedN = 0, contacts = 0;
  const known = async (email: string) => (await sql`SELECT 1 FROM audience_consents WHERE email = ${email.toLowerCase()} LIMIT 1`).length > 0;
  for (const s of await sql`SELECT email, lang, source, status FROM subscribers`) {
    const email = (s.email as string).toLowerCase();
    if (s.status === "unsubscribed") {
      if (!(await a.suppression(email))) { await stopAll(email, "import"); stoppedN++; }
    } else if (s.status === "confirmed" && !(await known(email))) {
      const lang = ["ru", "en", "pt", "es"].includes(s.lang as string) ? (s.lang as string) : "en";
      await grantChapters(email, lang, confirmWording(lang), `import:subscribe:${(s.source as string | null) ?? "site"}`);
      granted++;
    } else {
      await rememberContact({ email, lang: s.lang as string, source: "subscribe" });
    }
  }
  for (const p of await sql`SELECT email, lang FROM reader_prefs WHERE notify AND email IS NOT NULL`) {
    const email = (p.email as string).toLowerCase();
    if (await known(email) || (await a.suppression(email))) continue;
    await grantChapters(email, (p.lang as string) || "en", "Account switch: write to me when new chapters come out.", "import:account");
    granted++;
  }
  for (const q of await sql`SELECT DISTINCT ON (lower(email)) email, name, lang, kind FROM inquiries ORDER BY lower(email), created_at DESC`) {
    await rememberContact({ email: q.email as string, name: q.name as string | null, lang: q.lang as string | null, source: `enquiry:${q.kind as string}` });
    contacts++;
  }
  await act("audience.import", "audience", { granted, stopped: stoppedN, contacts });
  return done(`Согласий перенесено: ${granted}, в стоп-лист: ${stoppedN}, контактов из обращений: ${contacts}.`);
}
