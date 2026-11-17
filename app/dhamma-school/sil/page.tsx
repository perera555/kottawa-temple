import { RegistrationPage } from "@/components/section-pages";

export const metadata = { title: "Registration" };

export default async function Page({ searchParams }: PageProps<"/dhamma-school/sil">) {
  const { event } = await searchParams;
  return <RegistrationPage section="dhamma" eventId={typeof event === "string" ? Number(event) : undefined} />;
}
