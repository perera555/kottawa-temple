import { VideosPage } from "@/components/section-pages";

export const metadata = { title: "Videos" };

export default async function Page({ searchParams }: PageProps<"/montessori/videos">) {
  const { category } = await searchParams;
  return <VideosPage section="montessori" category={typeof category === "string" ? category : undefined} />;
}
