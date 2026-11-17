import { SectionShell } from "@/components/section-pages";

export default function Layout({ children }: LayoutProps<"/dhamma-school">) {
  return <SectionShell section="dhamma">{children}</SectionShell>;
}
