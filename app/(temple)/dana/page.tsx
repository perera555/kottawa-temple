import { CalendarCheck, HandHeart } from "lucide-react";
import { DanaForm } from "@/components/forms";
import { Container, fmtDate, PageHero } from "@/components/ui";
import { getSession } from "@/lib/auth";
import { MonthDanaList, TodayDana } from "@/components/daily-dana";
import { getBookedDana, getDailyDana } from "@/lib/data";
import { getLang } from "@/lib/lang";
import { DANA_TYPES, tr } from "@/lib/site";

export const metadata = { title: "Dana Booking" };

export default async function DanaPage() {
  const month = new Date().toISOString().slice(0, 7);
  const [y, mo] = month.split("-").map(Number);
  const lastDay = new Date(y, mo, 0).getDate();
  const [lang, booked, user, roster] = await Promise.all([
    getLang(),
    getBookedDana(),
    getSession(),
    getDailyDana(`${month}-01`, `${month}-${String(lastDay).padStart(2, "0")}`),
  ]);
  const si = lang === "si";
  return (
    <>
      <PageHero
        eyebrow={si ? "පිංකම්" : "Meritorious deeds"}
        title={si ? "දාන වෙන්කිරීම" : "Dana Booking"}
        icon={HandHeart}
        subtitle={si ? "මහා සංඝරත්නයට දානයක් පූජා කිරීමට දිනයක් ඉල්ලන්න. විහාරස්ථානයෙන් ඔබව අමතා තහවුරු කරනු ඇත." : "Request a date to offer dana to the Maha Sangha. The temple will call you to confirm."}
      />
      <Container className="space-y-6 pt-12">
        <TodayDana entries={roster} lang={lang} />
        <h2 className="font-display text-2xl text-accent">
          {si ? "මාසයේ දාන ලැයිස්තුව" : "This month's dana roster"} ·{" "}
          {new Date(month + "-01T00:00:00").toLocaleDateString(si ? "si-LK" : "en-GB", { month: "long", year: "numeric" })}
        </h2>
        <MonthDanaList entries={roster} month={month} lang={lang} />
      </Container>
      <Container className="grid gap-10 py-12 lg:grid-cols-5">
        <div className="card card-flat p-6 lg:col-span-3">
          <h2 className="mb-4 font-display text-2xl text-accent">{si ? "ඉල්ලීම් පෝරමය" : "Booking request"}</h2>
          <DanaForm lang={lang} defaults={user ? { name: user.name, email: user.email } : undefined} />
        </div>
        <aside className="lg:col-span-2">
          <div className="card p-6">
            <h2 className="mb-3 flex items-center gap-2 font-display text-xl text-accent">
              <CalendarCheck size={20} /> {si ? "දැනටමත් වෙන්කළ දින" : "Already booked"}
            </h2>
            {booked.length ? (
              <ul className="max-h-96 divide-y divide-line overflow-auto text-sm">
                {booked.map((b, i) => (
                  <li key={i} className="flex justify-between gap-3 py-2">
                    <span>{fmtDate(b.danaDate, lang)}</span>
                    <span className="text-muted">{tr(DANA_TYPES[b.danaType] ?? DANA_TYPES.other, lang)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted">{si ? "සියලු දින තවම නිදහස්." : "All upcoming dates are open."}</p>
            )}
          </div>
        </aside>
      </Container>
    </>
  );
}
