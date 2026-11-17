import { RegistrationPage } from "@/components/section-pages";

export const metadata = { title: "Registration" };

export default async function Page({ searchParams }: PageProps<"/montessori/sil">) {
  const { event } = await searchParams;
  return <RegistrationPage section="montessori" eventId={typeof event === "string" ? Number(event) : undefined} />;
}
