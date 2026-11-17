import { CalendarPage } from "@/components/section-pages";

export const metadata = { title: "Calendar" };

export default async function Page({ searchParams }: PageProps<"/montessori/calendar">) {
  const { month } = await searchParams;
  return <CalendarPage section="montessori" month={typeof month === "string" ? month : undefined} />;
}
