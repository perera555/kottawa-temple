import Link from "next/link";
import { Images } from "lucide-react";
import { getGallery } from "@/lib/data";
import { SECTION_INFO, tr, type Lang, type Section } from "@/lib/site";
import { DharmaWheel } from "./dharma-wheel";

/** Three 3D "photo stack" cards: Temple / Dhamma School / Montessori galleries. */
export async function GalleryShowcase({ lang }: { lang: Lang }) {
  const sections: Section[] = ["temple", "dhamma", "montessori"];
  const data = await Promise.all(sections.map(async (s) => ({ s, photos: await getGallery(s, 3) })));
  const si = lang === "si";
  return (
    <div className="grid gap-10 md:grid-cols-3">
      {data.map(({ s, photos }) => {
        const info = SECTION_INFO[s];
        const href = `${info.base}/gallery`;
        return (
          <Link key={s} href={href} data-section={s} className="group block" style={{ perspective: "1000px" }}>
            <div className="relative mx-auto aspect-[4/3] w-[88%] transition duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateX(8deg)_rotateY(-8deg)]">
              {/* back cards of the stack */}
              {[2, 1].map((i) => {
                const p = photos[i];
                return (
                  <div
                    key={i}
                    className="absolute inset-0 overflow-hidden rounded-2xl border-4 border-white bg-accent-soft shadow-xl transition duration-500"
                    style={{ transform: `rotate(${i === 2 ? -8 : 6}deg) translateZ(${-i * 20}px)` }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {p && <img src={p.imageUrl} alt="" className="h-full w-full object-cover" />}
                  </div>
                );
              })}
              {/* front card */}
              <div className="hero-bg absolute inset-0 overflow-hidden rounded-2xl border-4 border-white shadow-[0_30px_50px_-20px_rgba(0,0,0,0.6)] transition duration-500 group-hover:-translate-y-2">
                {photos[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photos[0].imageUrl} alt={photos[0].title} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                ) : (
                  <div className="grid h-full place-items-center text-white/40">
                    <DharmaWheel className="h-20 w-20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <p className="text-xs uppercase tracking-[0.2em] text-flag-yellow">{si ? "ඡායාරූප" : "Gallery"}</p>
                  <p className="text-3d font-display text-xl">{tr(info.short, lang)}</p>
                </div>
              </div>
            </div>
            <p className="mt-6 text-center text-sm font-semibold text-accent">
              <span className="inline-flex items-center gap-1.5"><Images size={16} /> {si ? "ඡායාරූප බලන්න" : "Open gallery"} →</span>
            </p>
          </Link>
        );
      })}
    </div>
  );
}
