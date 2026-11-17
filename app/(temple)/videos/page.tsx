import { VideosPage } from "@/components/section-pages";

export const metadata = { title: "Videos" };

export default async function Page({ searchParams }: PageProps<"/videos">) {
  const { category } = await searchParams;
  return <VideosPage section="temple" category={typeof category === "string" ? category : undefined} />;
}
