import { Container, PageHero } from "@/components/ui";
import { getLang } from "@/lib/lang";
import { SECTION_INFO, TEMPLE, tr } from "@/lib/site";

export const metadata = { title: "About the Dhamma School" };

export default async function Page() {
  const lang = await getLang();
  const si = lang === "si";
  const items = si
    ? [
        ["ධර්ම අධ්‍යාපනය", "බුද්ධ ධර්මය, පාලි, බෞද්ධ සංස්කෘතිය සහ ශීලය පිළිබඳ ශ්‍රේණිගත පාඩම්."],
        ["ගුණ වගාව", "ගරු කිරීම, කරුණාව, විනය සහ සමාජ වගකීම දරුවන් තුළ වර්ධනය කිරීම."],
        ["විභාග", "දහම් පාසල් ප්‍රවේශ, ශ්‍රේණි සහ දහම්සරසවි විභාග සඳහා සූදානම් කිරීම."],
        ["ක්‍රියාකාරකම්", "වෙසක් බැති ගී, තරඟ, චාරිකා, ක්‍රීඩා සහ ධර්ම දේශනා."],
      ]
    : [
        ["Dhamma education", "Graded lessons on the Buddha's teaching, Pali, Buddhist culture and sila."],
        ["Character building", "Developing respect, kindness, discipline and social responsibility."],
        ["Examinations", "Preparation for Dhamma School entrance, grade and Daham Sarasavi examinations."],
        ["Activities", "Vesak bakthi gee, competitions, trips, sports and Dhamma talks."],
      ];
  return (
    <>
      <PageHero eyebrow={`${tr(TEMPLE.name, lang)}, ${tr(TEMPLE.place, lang)}`} title={tr(SECTION_INFO.dhamma.name, lang)} subtitle={tr(SECTION_INFO.dhamma.tagline, lang)} />
      <Container className="py-14">
        <div className="card mx-auto max-w-3xl p-8 text-center">
          <p className="prose-text text-lg text-muted">
            {si
              ? "සිරි සද්ධර්මෝදය දහම් පාසල ශ්‍රී පුණ්‍යාභිවර්ධනාරාමයේ මඟපෙන්වීම යටතේ සෑම ඉරිදාවකම පවත්වනු ලැබේ. දරුවන් යහපත් පුරවැසියන් ලෙස හැදී වැඩීමට අවශ්‍ය ධර්ම ඥානය සහ ගුණධර්ම ලබා දීම අපගේ අරමුණයි."
              : "Siri Saddharmodaya Dhamma School is held every Sunday under the guidance of Sri Punyabhiwardhanaramaya. Our aim is to give children the Dhamma knowledge and values they need to grow into good citizens."}
          </p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(([t, d]) => (
            <div key={t} className="card p-6">
              <h3 className="font-display text-xl text-accent">{t}</h3>
              <p className="mt-2 text-sm text-muted">{d}</p>
            </div>
          ))}
        </div>
      </Container>
    </>
  );
}
