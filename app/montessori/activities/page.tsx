import { ActivitiesPage } from "@/components/section-pages";

export const metadata = { title: "Activities" };

export default async function Page({ searchParams }: PageProps<"/montessori/activities">) {
  const { category } = await searchParams;
  return <ActivitiesPage section="montessori" category={typeof category === "string" ? category : undefined} />;
}
