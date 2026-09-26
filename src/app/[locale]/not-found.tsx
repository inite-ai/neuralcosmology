import Link from "next/link";
import { Sheet, Label, Headline } from "@/components/system";

export default function NotFound() {
  return (
    <main className="pt-14">
      <Sheet>
        <section className="py-24 md:px-10 md:py-32">
          <Label className="mb-5">404</Label>
          <Headline as="h1" size="display" em="Page not found.">
            Страница не найдена.
          </Headline>
          <div className="mt-10 flex flex-wrap gap-6">
            <Link href="/" className="label text-fg hover:text-primary">neuralcosmology.com →</Link>
            <Link href="/en/answers" className="label text-muted hover:text-fg">Questions →</Link>
            <Link href="/en/books" className="label text-muted hover:text-fg">Books →</Link>
          </div>
        </section>
      </Sheet>
    </main>
  );
}
