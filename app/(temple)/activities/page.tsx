import { ActivitiesPage } from "@/components/section-pages";

export const metadata = { title: "Activities" };

export default async function Page({ searchParams }: PageProps<"/activities">) {
  const { category } = await searchParams;
  return <ActivitiesPage section="temple" category={typeof category === "string" ? category : undefined} title="Activities / පිංකම්" />;
}
