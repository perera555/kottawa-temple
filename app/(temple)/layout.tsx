import { SectionShell } from "@/components/section-pages";

export default function TempleLayout({ children }: LayoutProps<"/">) {
  return <SectionShell section="temple">{children}</SectionShell>;
}
