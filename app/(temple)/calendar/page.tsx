import { CalendarPage } from "@/components/section-pages";

export const metadata = { title: "Calendar" };

export default async function Page({ searchParams }: PageProps<"/calendar">) {
  const { month } = await searchParams;
  return <CalendarPage section="temple" month={typeof month === "string" ? month : undefined} />;
}
