import { RegistrationPage } from "@/components/section-pages";

export const metadata = { title: "Registration" };

export default async function Page({ searchParams }: PageProps<"/sil">) {
  const { event } = await searchParams;
  return <RegistrationPage section="temple" eventId={typeof event === "string" ? Number(event) : undefined} />;
}
