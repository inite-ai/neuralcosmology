import { redirect } from "next/navigation";

// Переехало в бэкофис; адрес остаётся для старых закладок.
export default async function SocialPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ connected?: string }> }) {
  const { locale } = await params;
  const { connected } = await searchParams;
  redirect(`/${locale}/admin/quotes${connected ? `?connected=${encodeURIComponent(connected)}` : ""}`);
}
