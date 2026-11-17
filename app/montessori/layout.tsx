import { SectionShell } from "@/components/section-pages";

export default function Layout({ children }: LayoutProps<"/montessori">) {
  return <SectionShell section="montessori">{children}</SectionShell>;
}
