import Link from "next/link";
import { Container, PageHero, PersonCard, SectionTitle } from "@/components/ui";
import { getTeachers } from "@/lib/data";
import { getLang } from "@/lib/lang";
import { SECTION_INFO, tr } from "@/lib/site";

export const metadata = { title: "About Udaya Lama Uyana" };

export default async function Page() {
  const [lang, teachers] = await Promise.all([getLang(), getTeachers("montessori")]);
  const si = lang === "si";
  return (
    <>
      <PageHero
        eyebrow={tr(SECTION_INFO.montessori.name, lang)}
        title={si ? "උදය ළමා උයන පෙර පාසල ගැන 🌱" : "About Udaya Lama Uyana Pre School 🌱"}
        subtitle={si ? "දරුවන්ගේ මනස ආදරයෙන්, ඥානයෙන් සහ වටිනාකම් සමඟ වර්ධනය කිරීම." : "Nurturing young minds with care, wisdom, and strong moral values."}
      />
      <Container className="py-14">
        <SectionTitle title={si ? "අපගේ ගුරුවරුන් සහ මගපෙන්වීම 👩‍🏫" : "Our Teachers & Guidance 👩‍🏫"} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teachers.map((t, i) => (
            <PersonCard key={t.id} name={t.name} role={t.position} sub={t.subject} imageUrl={t.imageUrl} note={t.bio} highlight={i === 1} />
          ))}
        </div>
      </Container>
      <Container className="grid gap-8 pb-14 md:grid-cols-3">
        <div className="card p-6">
          <h2 className="font-display text-2xl text-accent">{si ? "අපගේ කතාව" : "Our Story"}</h2>
          <p className="mt-2 text-muted">
            {si
              ? "අපගේ පෙර පාසල දරුවන්ට ආරක්ෂිත, ආදරණීය හා ප්‍රබෝධමත් ඉගෙනුම් පරිසරයක් ලබාදීමට ශ්‍රී පුණ්‍යාභිවර්ධනාරාමය මගින් ස්ථාපිත කරන ලදී."
              : "Our pre school was founded by Sri Punyabhiwardhanaramaya to provide a safe, loving, and inspiring environment where children can grow, learn, and explore with confidence."}
          </p>
        </div>
        <div className="card p-6">
          <h2 className="font-display text-2xl text-accent">🎯 {si ? "මෙහෙවර" : "Mission"}</h2>
          <p className="mt-2 text-muted">{si ? "සෑම දරුවෙකුටම ශක්තිමත් අධ්‍යාපනික හා සදාචාරාත්මක පදනමක් ගොඩනැගීම." : "To build a strong educational and moral foundation for every child."}</p>
          <h2 className="mt-4 font-display text-2xl text-accent">🌟 {si ? "දැක්ම" : "Vision"}</h2>
          <p className="mt-2 text-muted">{si ? "අනාගතයට වගකිවයුතු, කරුණාවන්ත සහ විශ්වාසවන්ත පුද්ගලයින් බිහිකිරීම." : "To nurture responsible, kind, and confident individuals for the future."}</p>
        </div>
        <div className="card p-6">
          <h2 className="font-display text-2xl text-accent">🧘 {si ? "අපගේ දර්ශනය" : "Our Philosophy"}</h2>
          <p className="mt-2 text-muted">
            {si
              ? "සෑම දරුවෙක්ම විශේෂයි. මනස, ශරීරය සහ චරිතය සම්පූර්ණයෙන්ම වර්ධනය කිරීම අපගේ අරමුණයි."
              : "Every child is unique and full of potential. We nurture the whole child — mind, body, and character — through play, creativity and guided activities rooted in kindness and discipline."}
          </p>
        </div>
      </Container>
      <section className="hero-bg py-14 text-center text-white">
        <h2 className="text-3d font-display text-3xl">{si ? "අපගේ පවුලට එක්වන්න 🌟" : "Join Our Pre School Family 🌟"}</h2>
        <Link href="/montessori/contact" className="btn btn-gold mt-6">{si ? "අමතන්න" : "Contact Us"}</Link>
      </section>
    </>
  );
}
