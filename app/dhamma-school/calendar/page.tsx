import { CalendarPage } from "@/components/section-pages";

export const metadata = { title: "Calendar" };

export default async function Page({ searchParams }: PageProps<"/dhamma-school/calendar">) {
  const { month } = await searchParams;
  return <CalendarPage section="dhamma" month={typeof month === "string" ? month : undefined} />;
}
