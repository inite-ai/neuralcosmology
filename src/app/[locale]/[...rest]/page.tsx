import { notFound } from "next/navigation";

// Любой несуществующий путь внутри языка → not-found этого языка (с шапкой, <html lang> и темой).
export default function CatchAll() {
  notFound();
}
