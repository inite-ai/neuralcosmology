import SocialPanel from "@/components/account/SocialPanel";
import { SOCIAL_LABELS } from "@/components/account/socialLabels";
import { Title } from "@/components/admin/ui";
import { owner } from "@/lib/admin/guard";

type P = { params: Promise<{ locale: string }>; searchParams: Promise<{ connected?: string }> };

export default async function Quotes({ params, searchParams }: P) {
  const { locale } = await params;
  await owner(`/${locale}/admin/quotes`);
  const { title, lead, ...labels } = SOCIAL_LABELS.ru;
  return (
    <>
      <Title lead={lead}>{title}</Title>
      <SocialPanel locale={locale} labels={labels} connected={(await searchParams).connected ?? null} />
    </>
  );
}
