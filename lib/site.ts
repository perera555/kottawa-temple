export type Section = "temple" | "dhamma" | "montessori";
export type Lang = "en" | "si";
export type Bi = { en: string; si: string };

export const SECTIONS: Section[] = ["temple", "dhamma", "montessori"];

export const TEMPLE = {
  name: { en: "Sri Punyabhiwardhanaramaya", si: "ශ්‍රී පුණ්‍යාභිවර්ධනාරාමය" },
  place: { en: "Kottawa", si: "කොට්ටාව" },
  address: { en: "Sri Punyabhiwardhanaramaya, Kottawa, Sri Lanka", si: "ශ්‍රී පුණ්‍යාභිවර්ධනාරාමය, කොට්ටාව" },
  phone: "+94 11 000 0000",
  email: "info@punyabhiwardhanaramaya.lk",
  chiefMonk: { en: "Ven. Weraduwe Siri Jothi Thero", si: "පූජ්‍ය වේරදුවේ සිරි ජෝති හිමි" },
};

type NavItem = { href: string; label: Bi };

export type SectionInfo = {
  key: Section;
  base: string;
  name: Bi;
  short: Bi;
  tagline: Bi;
  nav: NavItem[];
};

export const SECTION_INFO: Record<Section, SectionInfo> = {
  temple: {
    key: "temple",
    base: "",
    name: TEMPLE.name,
    short: { en: "Temple", si: "විහාරය" },
    tagline: {
      en: "A refuge of the Dhamma for the Kottawa community",
      si: "කොට්ටාව ජනතාවගේ ධර්ම සරණ",
    },
    nav: [
      { href: "/", label: { en: "Home", si: "මුල් පිටුව" } },
      { href: "/about", label: { en: "About", si: "විහාරය ගැන" } },
      { href: "/activities", label: { en: "Activities", si: "පිංකම්" } },
      { href: "/calendar", label: { en: "Calendar", si: "දින දර්ශනය" } },
      { href: "/videos", label: { en: "Videos", si: "වීඩියෝ" } },
      { href: "/dana", label: { en: "Dana", si: "දාන" } },
      { href: "/sil", label: { en: "Sil & Puja", si: "සිල් / පූජා" } },
      { href: "/notices", label: { en: "Notices", si: "නිවේදන" } },
      { href: "/gallery", label: { en: "Gallery", si: "ඡායාරූප" } },
      { href: "/reviews", label: { en: "Reviews", si: "අදහස්" } },
      { href: "/contact", label: { en: "Contact", si: "සම්බන්ධ වන්න" } },
    ],
  },
  dhamma: {
    key: "dhamma",
    base: "/dhamma-school",
    name: { en: "Siri Saddharmodaya Dhamma School", si: "සිරි සද්ධර්මෝදය දහම් පාසල" },
    short: { en: "Dhamma School", si: "දහම් පාසල" },
    tagline: {
      en: "Sunday Dhamma education for the children of Kottawa",
      si: "ඉරිදා දහම් අධ්‍යාපනය - දරුවන්ගේ යහපත උදෙසා",
    },
    nav: [
      { href: "/dhamma-school", label: { en: "Home", si: "මුල් පිටුව" } },
      { href: "/dhamma-school/about", label: { en: "About", si: "පාසල ගැන" } },
      { href: "/dhamma-school/teachers", label: { en: "Teachers", si: "ගුරු මණ්ඩලය" } },
      { href: "/dhamma-school/students", label: { en: "Students", si: "සිසුන්" } },
      { href: "/dhamma-school/prefects", label: { en: "Prefects & Monitors", si: "ශිෂ්‍ය නායක මණ්ඩලය" } },
      { href: "/dhamma-school/activities", label: { en: "Activities", si: "ක්‍රියාකාරකම්" } },
      { href: "/dhamma-school/calendar", label: { en: "Calendar", si: "දින දර්ශනය" } },
      { href: "/dhamma-school/notices", label: { en: "Notices & Ads", si: "නිවේදන" } },
      { href: "/dhamma-school/gallery", label: { en: "Gallery", si: "ඡායාරූප" } },
      { href: "/dhamma-school/reviews", label: { en: "Reviews", si: "අදහස්" } },
      { href: "/dhamma-school/contact", label: { en: "Contact", si: "සම්බන්ධ වන්න" } },
    ],
  },
  montessori: {
    key: "montessori",
    base: "/montessori",
    name: { en: "Udaya Lama Uyana Pre School", si: "උදය ළමා උයන පෙර පාසල" },
    short: { en: "Montessori", si: "පෙර පාසල" },
    tagline: { en: "A joyful place for early learning", si: "ළමා සංවර්ධනයට සතුටුදායක පරිසරයක්" },
    nav: [
      { href: "/montessori", label: { en: "Home", si: "මුල් පිටුව" } },
      { href: "/montessori/about", label: { en: "About & Teachers", si: "අප ගැන" } },
      { href: "/montessori/activities", label: { en: "Activities", si: "ක්‍රියාකාරකම්" } },
      { href: "/montessori/calendar", label: { en: "Calendar", si: "දින දර්ශනය" } },
      { href: "/montessori/students", label: { en: "Our Children", si: "අපේ දරුවෝ" } },
      { href: "/montessori/notices", label: { en: "Notices", si: "නිවේදන" } },
      { href: "/montessori/gallery", label: { en: "Gallery", si: "ඡායාරූප" } },
      { href: "/montessori/reviews", label: { en: "Reviews", si: "මව්පිය අදහස්" } },
      { href: "/montessori/contact", label: { en: "Contact", si: "සම්බන්ධ වන්න" } },
    ],
  },
};

export const EVENT_CATEGORIES: Record<string, Bi> = {
  dana: { en: "Dana", si: "දානය" },
  pirith: { en: "Pirith", si: "පිරිත්" },
  bodhi_puja: { en: "Bodhi Puja", si: "බෝධි පූජාව" },
  poya: { en: "Poya Programme", si: "පොහොය වැඩසටහන" },
  sil: { en: "Sil Observance", si: "සිල් සමාදානය" },
  meditation: { en: "Meditation", si: "භාවනා" },
  bana: { en: "Dhamma Sermon", si: "බණ" },
  kathina: { en: "Katina", si: "කඨින" },
  children: { en: "Children's Activity", si: "ළමා ක්‍රියාකාරකම්" },
  exam: { en: "Exam", si: "විභාගය" },
  competition: { en: "Competition", si: "තරඟ" },
  festival: { en: "Festival", si: "උත්සවය" },
  sports: { en: "Sports", si: "ක්‍රීඩා" },
  trip: { en: "Trip", si: "චාරිකාව" },
  other: { en: "Other", si: "වෙනත්" },
};

export const VIDEO_CATEGORIES: Record<string, Bi> = {
  kathina: { en: "Katina", si: "කඨින" },
  bodhi_puja: { en: "Bodhi Puja", si: "බෝධි පූජා" },
  bana: { en: "Bana / Sermons", si: "බණ" },
  pirith: { en: "Pirith", si: "පිරිත්" },
  events: { en: "Events", si: "උත්සව" },
  other: { en: "Other", si: "වෙනත්" },
};

export const DANA_SLOTS: { key: "morning" | "noon" | "evening"; label: Bi; time: string; emoji: string }[] = [
  { key: "morning", label: { en: "Morning Dana (Heel)", si: "උදේ - හීල් දානය" }, time: "6.30 a.m.", emoji: "🌅" },
  { key: "noon", label: { en: "Noon Dana", si: "දවල් - දහවල් දානය" }, time: "11.00 a.m.", emoji: "☀️" },
  { key: "evening", label: { en: "Evening Gilanpasa", si: "හවස - ගිලන්පස" }, time: "5.30 p.m.", emoji: "🌇" },
];

export const DANA_TYPES: Record<string, Bi> = {
  breakfast: { en: "Morning Dana (Heel Dana)", si: "හීල් දානය" },
  noon: { en: "Noon Dana (Ahara Puja)", si: "දහවල් දානය" },
  evening_gilanpasa: { en: "Evening Gilanpasa", si: "ගිලන්පස පූජාව" },
  bodhi_puja: { en: "Bodhi Puja", si: "බෝධි පූජාව" },
  pirith: { en: "Pirith Chanting", si: "පිරිත් දේශනාව" },
  other: { en: "Other", si: "වෙනත්" },
};

export const UI = {
  latestNotices: { en: "Latest Notices", si: "නවතම නිවේදන" },
  upcoming: { en: "Upcoming Activities", si: "ඉදිරි වැඩසටහන්" },
  regular: { en: "Regular Observances", si: "නිත්‍ය පූජා" },
  advertisements: { en: "Advertisements", si: "දැන්වීම්" },
  viewAll: { en: "View all", si: "සියල්ල බලන්න" },
  noItems: { en: "Nothing published yet.", si: "තවම කිසිවක් පළ කර නැත." },
  readMore: { en: "Read more", si: "තවත් කියවන්න" },
  send: { en: "Send", si: "යවන්න" },
  sending: { en: "Sending...", si: "යවමින්..." },
  name: { en: "Your name", si: "ඔබගේ නම" },
  phone: { en: "Phone", si: "දුරකථන" },
  email: { en: "Email", si: "විද්‍යුත් තැපෑල" },
  message: { en: "Message", si: "පණිවිඩය" },
  subject: { en: "Subject", si: "මාතෘකාව" },
  ourSections: { en: "Under the Temple", si: "විහාරස්ථානය යටතේ" },
  visit: { en: "Visit", si: "පිවිසෙන්න" },
  gallery: { en: "Gallery", si: "ඡායාරූප" },
  prefects: { en: "Prefect Board", si: "ශිෂ්‍ය නායක මණ්ඩලය" },
  monitors: { en: "Class Monitors", si: "පන්ති නායකයින්" },
  teachers: { en: "Teachers", si: "ගුරුවරුන්" },
  contactUs: { en: "Contact Us", si: "අප අමතන්න" },
};

export const tr = (b: Bi, lang: Lang) => b[lang] || b.en;

export function sectionHref(section: Section, path = "") {
  const base = SECTION_INFO[section].base;
  return (base + path) || "/";
}
