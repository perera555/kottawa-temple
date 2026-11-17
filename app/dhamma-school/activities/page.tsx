import { ActivitiesPage } from "@/components/section-pages";

export const metadata = { title: "Activities" };

export default async function Page({ searchParams }: PageProps<"/dhamma-school/activities">) {
  const { category } = await searchParams;
  return <ActivitiesPage section="dhamma" category={typeof category === "string" ? category : undefined} />;
}
