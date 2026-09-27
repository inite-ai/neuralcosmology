import "server-only";
import postgres from "postgres";

// База интерактива читалки: прогресс, пометки, обсуждения, ИИ-кэш и лимиты.
// Схема создаётся идемпотентно при первом обращении (CREATE ... IF NOT EXISTS).

const globalForDb = globalThis as unknown as { __ncSql?: postgres.Sql; __ncSchema?: Promise<void> };

export function dbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

function client(): postgres.Sql {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
  globalForDb.__ncSql ??= postgres(process.env.DATABASE_URL, { max: 5, idle_timeout: 30, prepare: false });
  return globalForDb.__ncSql;
}

const SCHEMA = `
CREATE TABLE IF NOT EXISTS reading_progress (
  user_id text NOT NULL, book text NOT NULL, lang text NOT NULL,
  chapter text NOT NULL, anchor text, chapters jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, book, lang)
);
CREATE TABLE IF NOT EXISTS annotations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL, book text NOT NULL, lang text NOT NULL, chapter text NOT NULL,
  anchor text NOT NULL, kind text NOT NULL CHECK (kind IN ('bookmark','highlight','note')),
  quote text NOT NULL DEFAULT '', start_off int, end_off int,
  color text, note text,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS annotations_user_book ON annotations (user_id, book, lang);
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book text NOT NULL, lang text NOT NULL, chapter text NOT NULL, anchor text,
  parent_id uuid REFERENCES comments(id) ON DELETE CASCADE,
  user_id text NOT NULL, author_name text NOT NULL, is_author boolean NOT NULL DEFAULT false,
  quote text, body text NOT NULL,
  status text NOT NULL DEFAULT 'published' CHECK (status IN ('published','hidden','rejected')),
  pinned boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS comments_chapter ON comments (book, lang, chapter, status);
CREATE TABLE IF NOT EXISTS comment_reactions (
  comment_id uuid NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  user_id text NOT NULL, PRIMARY KEY (comment_id, user_id)
);
CREATE TABLE IF NOT EXISTS ai_usage (
  user_id text NOT NULL, day date NOT NULL DEFAULT current_date, count int NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, day)
);
CREATE TABLE IF NOT EXISTS watermarks (
  mark text PRIMARY KEY, user_id text NOT NULL, email text, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS reader_prefs (
  user_id text PRIMARY KEY, email text, display_name text, currency text,
  notify boolean NOT NULL DEFAULT false, notify_books text[] NOT NULL DEFAULT '{}', lang text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS notify_log (
  book text NOT NULL, lang text NOT NULL, chapter text NOT NULL, sent_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (book, lang, chapter)
);
CREATE TABLE IF NOT EXISTS ai_cache (
  key text PRIMARY KEY, value text NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS auth_logouts (
  sub text PRIMARY KEY, at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS shares (
  id text PRIMARY KEY, book text NOT NULL, lang text NOT NULL, chapter text NOT NULL,
  anchor text NOT NULL, quote text NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
`;

/** Готовый к работе клиент; схема применяется один раз на процесс. */
export async function db(): Promise<postgres.Sql> {
  const sql = client();
  globalForDb.__ncSchema ??= sql.unsafe(SCHEMA).then(() => undefined).catch((e) => {
    globalForDb.__ncSchema = undefined;
    throw e;
  });
  await globalForDb.__ncSchema;
  return sql;
}
