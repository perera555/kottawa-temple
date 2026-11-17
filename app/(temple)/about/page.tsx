import { Landmark } from "lucide-react";
import { Container, PageHero, PersonCard, SectionTitle } from "@/components/ui";
import { getTeachers } from "@/lib/data";
import { getLang } from "@/lib/lang";
import { TEMPLE, tr } from "@/lib/site";

export const metadata = { title: "About the Temple" };

export default async function AboutTemple() {
  const [lang, sangha] = await Promise.all([getLang(), getTeachers("temple")]);
  const si = lang === "si";
  return (
    <>
      <PageHero
        eyebrow={tr(TEMPLE.place, lang)}
        title={si ? "විහාරස්ථානය ගැන" : "About the Temple"}
        subtitle={tr(TEMPLE.name, lang)}
        icon={Landmark}
      />
      <Container className="grid gap-10 py-14 lg:grid-cols-2">
        <div className="card p-8">
          <h2 className="font-display text-2xl text-accent">{si ? "අපගේ ඉතිහාසය" : "Our story"}</h2>
          <p className="prose-text mt-3 text-muted">
            {si
              ? "ශ්‍රී පුණ්‍යාභිවර්ධනාරාමය කොට්ටාව ප්‍රදේශයේ බෞද්ධ ජනතාවගේ ආධ්‍යාත්මික කේන්ද්‍රස්ථානයයි. දාන, පිරිත්, බෝධි පූජා, පොහොය සිල් වැඩසටහන් සහ ධර්ම දේශනා මගින් ප්‍රජාවට සේවය කරයි. විහාරස්ථානය යටතේ සිරි සද්ධර්මෝදය දහම් පාසල සහ උදය ළමා උයන පෙර පාසල පවත්වාගෙන යයි."
              : "Sri Punyabhiwardhanaramaya is the spiritual home of the Buddhist community in Kottawa. The temple serves devotees through dana, pirith, Bodhi puja, Poya sil programmes and Dhamma sermons. It also runs the Siri Saddharmodaya Sunday Dhamma School and the Udaya Lama Uyana Pre School."}
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {[
            { t: si ? "දැක්ම" : "Vision", d: si ? "ධර්මයෙන් පෝෂිත සාමකාමී ප්‍රජාවක්." : "A peaceful community nourished by the Dhamma." },
            { t: si ? "මෙහෙවර" : "Mission", d: si ? "ධර්ම අධ්‍යාපනය, පිංකම් සහ සමාජ සේවය මගින් ජනතාවට මග පෙන්වීම." : "To guide people through Dhamma education, meritorious deeds and social service." },
            { t: si ? "දහම් පාසල" : "Dhamma School", d: si ? "සෑම ඉරිදාවකම දරුවන්ට ධර්ම අධ්‍යාපනය." : "Dhamma education for children every Sunday." },
            { t: si ? "පෙර පාසල" : "Pre School", d: si ? "කුඩා දරුවන්ට ආදරණීය ඉගෙනුම් පරිසරයක්." : "A loving early-learning space for little ones." },
          ].map((x) => (
            <div key={x.t} className="card p-6">
              <h3 className="font-display text-xl text-accent">{x.t}</h3>
              <p className="mt-2 text-sm text-muted">{x.d}</p>
            </div>
          ))}
        </div>
      </Container>
      <Container className="pb-16">
        <SectionTitle title={si ? "මහා සංඝරත්නය" : "Maha Sangha"} />
        {sangha.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {sangha.map((m, i) => (
              <PersonCard key={m.id} name={m.name} role={m.position} sub={m.subject} imageUrl={m.imageUrl} note={m.bio} highlight={i === 0} />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <PersonCard name={tr(TEMPLE.chiefMonk, lang)} role={si ? "විහාරාධිපති" : "Chief Incumbent"} imageUrl="" highlight />
          </div>
        )}
      </Container>
    </>
  );
}
