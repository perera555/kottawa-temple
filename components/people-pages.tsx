import { Award, GraduationCap, ShieldCheck, Users } from "lucide-react";
import { getClassCounts, getLeaders, getPublicStudents, getTeachers } from "@/lib/data";
import { getLang } from "@/lib/lang";
import { SECTION_INFO, tr, UI, type Section } from "@/lib/site";
import { Container, Empty, Img, PageHero, PersonCard, SectionTitle } from "./ui";

export async function TeachersPage({ section, title }: { section: Section; title?: string }) {
  const [lang, teachers] = await Promise.all([getLang(), getTeachers(section)]);
  return (
    <>
      <PageHero eyebrow={tr(SECTION_INFO[section].name, lang)} title={title ?? (lang === "si" ? "ගුරු මණ්ඩලය" : "Our Teachers")} icon={Users} />
      <Container className="py-12">
        {teachers.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {teachers.map((t, i) => <PersonCard key={t.id} name={t.name} role={t.position} sub={t.subject} imageUrl={t.imageUrl} note={t.bio} highlight={i === 0} />)}
          </div>
        ) : (
          <Empty text={tr(UI.noItems, lang)} />
        )}
      </Container>
    </>
  );
}

export async function StudentsPage({ section }: { section: Section }) {
  const [lang, students, counts] = await Promise.all([getLang(), getPublicStudents(section), getClassCounts(section)]);
  const si = lang === "si";
  const byGrade = students.reduce<Record<string, typeof students>>((acc, s) => {
    (acc[s.grade || "-"] ||= []).push(s);
    return acc;
  }, {});
  return (
    <>
      <PageHero
        eyebrow={tr(SECTION_INFO[section].name, lang)}
        title={section === "montessori" ? (si ? "අපේ දරුවෝ" : "Our Children") : si ? "සිසුන්" : "Our Students"}
        subtitle={si ? "අපගේ සිසුන්ගේ ජයග්‍රහණ සහ පන්ති" : "Our classes and our students' achievements"}
        icon={GraduationCap}
      />
      <Container className="py-12">
        {counts.length > 0 && (
          <section className="mb-12">
            <SectionTitle title={si ? "පන්ති" : "Classes"} />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
              {counts.map((c) => (
                <div key={c.grade} className="card p-4 text-center">
                  <GraduationCap className="mx-auto text-accent" />
                  <p className="mt-2 font-semibold">{c.grade || "-"}</p>
                  <p className="text-sm text-muted">{c.count} {si ? "සිසුන්" : "students"}</p>
                </div>
              ))}
            </div>
          </section>
        )}
        <SectionTitle title={si ? "සිසු ජයග්‍රහණ" : "Student Achievements"} />
        {students.length ? (
          Object.entries(byGrade).map(([grade, list]) => (
            <div key={grade} className="mb-10">
              <h3 className="mb-4 text-lg font-semibold text-accent">{grade}</h3>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {list.map((s) => (
                  <div key={s.id} className="card overflow-hidden">
                    <Img src={s.imageUrl} alt={s.name} className="aspect-[4/3] w-full" />
                    <div className="p-4">
                      <p className="font-semibold">{s.name}</p>
                      {s.achievement && (
                        <p className="mt-1 flex gap-1.5 text-sm text-muted"><Award size={16} className="mt-0.5 shrink-0 text-accent-2" /> {s.achievement}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <Empty text={tr(UI.noItems, lang)} />
        )}
      </Container>
    </>
  );
}

export async function PrefectsPage({ section }: { section: Section }) {
  const [lang, leaders] = await Promise.all([getLang(), getLeaders(section)]);
  const prefects = leaders.filter((l) => l.type === "prefect");
  const monitors = leaders.filter((l) => l.type === "monitor");
  const year = leaders.find((l) => l.year)?.year;
  return (
    <>
      <PageHero
        eyebrow={tr(SECTION_INFO[section].name, lang)}
        title={lang === "si" ? "ශිෂ්‍ය නායක මණ්ඩලය" : "Prefect Board & Monitors"}
        subtitle={year ? `${year}` : undefined}
        icon={ShieldCheck}
      />
      <Container className="py-12">
        <SectionTitle title={tr(UI.prefects, lang)} />
        {prefects.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {prefects.map((p, i) => <PersonCard key={p.id} name={p.name} role={p.position} sub={[p.grade, p.year].filter(Boolean).join(" · ")} imageUrl={p.imageUrl} highlight={i < 2} />)}
          </div>
        ) : (
          <Empty text={tr(UI.noItems, lang)} />
        )}
        <div className="mt-14">
          <SectionTitle title={tr(UI.monitors, lang)} />
          {monitors.length ? (
            <div className="grid gap-5 sm:grid-cols-3 lg:grid-cols-5">
              {monitors.map((p) => <PersonCard key={p.id} name={p.name} role={p.position} sub={p.grade} imageUrl={p.imageUrl} />)}
            </div>
          ) : (
            <Empty text={tr(UI.noItems, lang)} />
          )}
        </div>
      </Container>
    </>
  );
}
