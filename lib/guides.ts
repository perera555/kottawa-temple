import type { Bi } from "./site";

export type GuideTopic = { id: string; icon: string; title: Bi; steps: Bi[]; tip?: Bi };

/* ------------------------------------------------------------------ */
/* USER GUIDE - for devotees, parents and members                      */
/* ------------------------------------------------------------------ */
export const USER_GUIDE: GuideTopic[] = [
  {
    id: "browse",
    icon: "🏛",
    title: { en: "Using the website", si: "වෙබ් අඩවිය භාවිතා කිරීම" },
    steps: [
      { en: "Use the buttons under the temple name to switch between the Temple, Dhamma School and Montessori websites.", si: "විහාරස්ථානයේ නම යටතේ ඇති බොත්තම් මගින් විහාරය, දහම් පාසල සහ පෙර පාසල අතර මාරු වන්න." },
      { en: "The coloured menu bar shows all pages of that section: Activities, Calendar, Notices, Gallery, Videos, Live and more.", si: "වර්ණවත් මෙනු තීරුවේ එම අංශයේ සියලු පිටු ඇත: ක්‍රියාකාරකම්, දින දර්ශනය, නිවේදන, ඡායාරූප, වීඩියෝ, සජීවී ආදිය." },
      { en: "On a phone, press the ☰ menu button to see all pages.", si: "ජංගම දුරකථනයේ ☰ මෙනු බොත්තම ඔබා සියලු පිටු බලන්න." },
      { en: "Press සිං / EN at the top right to change the website language.", si: "වෙබ් අඩවියේ භාෂාව වෙනස් කිරීමට ඉහළ දකුණු කෙළවරේ ඇති සිං / EN ඔබන්න." },
    ],
  },
  {
    id: "register",
    icon: "🪪",
    title: { en: "Create an account (Become a Member)", si: "ගිණුමක් සාදන්න (සාමාජික වන්න)" },
    steps: [
      { en: "Press “Become a Member / සාමාජික වන්න” at the top of any page.", si: "ඕනෑම පිටුවක ඉහළ ඇති “සාමාජික වන්න” ඔබන්න." },
      { en: "Enter your full name, email, phone, address and a password (at least 8 characters). Type the password twice.", si: "ඔබගේ සම්පූර්ණ නම, විද්‍යුත් තැපෑල, දුරකථන අංකය, ලිපිනය සහ මුරපදයක් (අවම අකුරු 8) ඇතුළත් කරන්න. මුරපදය දෙවරක් ටයිප් කරන්න." },
      { en: "Press “Create account”. You receive your membership number at once (for example PKT-2026-0005).", si: "“ගිණුම සාදන්න” ඔබන්න. ඔබගේ සාමාජික අංකය වහාම ලැබේ (උදා: PKT-2026-0005)." },
    ],
    tip: { en: "Members' reviews are published immediately and members can see all their bookings in one place.", si: "සාමාජිකයින්ගේ අදහස් වහාම පළ වන අතර ඔවුන්ගේ සියලු වෙන්කිරීම් එකම තැනක බැලිය හැක." },
  },
  {
    id: "login",
    icon: "🔑",
    title: { en: "Login and logout", si: "ඇතුල් වීම සහ පිටවීම" },
    steps: [
      { en: "Press “Login / ඇතුල් වන්න” at the top of the page.", si: "පිටුවේ ඉහළ ඇති “ඇතුල් වන්න” ඔබන්න." },
      { en: "Enter your email and password. Keep “Keep me signed in” ticked to stay logged in for 90 days on your own phone or computer.", si: "විද්‍යුත් තැපෑල සහ මුරපදය ඇතුළත් කරන්න. ඔබගේම දුරකථනයේ හෝ පරිගණකයේ දින 90ක් ඇතුල්ව සිටීමට “මාව මතක තබාගන්න” සලකුණු කර තබන්න." },
      { en: "When logged in, your profile picture with a green dot appears at the top right. Click it to open My Account or to Sign out.", si: "ඇතුල් වූ පසු ඉහළ දකුණේ ඔබගේ ඡායාරූපය කොළ තිතක් සමඟ පෙනේ. එය ක්ලික් කර “මගේ ගිණුම” හෝ “පිටවන්න” තෝරන්න." },
    ],
    tip: { en: "On a shared computer, always press Sign out when you finish.", si: "පොදු පරිගණකයක් නම් අවසානයේ සැමවිටම “පිටවන්න” ඔබන්න." },
  },
  {
    id: "forgot",
    icon: "🔐",
    title: { en: "Forgot your password?", si: "මුරපදය අමතක වුණාද?" },
    steps: [
      { en: "On the Login page press “Forgot password?”.", si: "ඇතුල් වීමේ පිටුවේ “මුරපදය අමතකද?” ඔබන්න." },
      { en: "Enter your email and press “Send reset code”. If you do not receive an email, call or WhatsApp the temple office — the admin will give you a 6-digit code.", si: "විද්‍යුත් තැපෑල ඇතුළත් කර “කේතය යවන්න” ඔබන්න. ඊමේල් නොලැබුණොත් විහාරස්ථාන කාර්යාලය අමතන්න — පරිපාලකවරයා ඉලක්කම් 6ක කේතයක් ලබා දේ." },
      { en: "Open “Reset password”, enter your email, the 6-digit code and a new password. The code works for 30 minutes.", si: "“මුරපදය යළි සකසන්න” විවෘත කර ඊමේල්, ඉලක්කම් 6 කේතය සහ නව මුරපදය ඇතුළත් කරන්න. කේතය මිනිත්තු 30ක් වලංගුයි." },
    ],
  },
  {
    id: "account",
    icon: "👤",
    title: { en: "My Account", si: "මගේ ගිණුම" },
    steps: [
      { en: "My Account shows your membership number, dana bookings, messages and replies, reviews and admission applications.", si: "“මගේ ගිණුම” හි ඔබගේ සාමාජික අංකය, දාන වෙන්කිරීම්, පණිවිඩ සහ පිළිතුරු, අදහස් සහ ඇතුළත් වීමේ අයදුම්පත් පෙන්වයි." },
      { en: "Under “My Profile” you can change your name, phone, address, profile picture and password. Press “Save profile”.", si: "“මගේ පැතිකඩ” යටතේ නම, දුරකථනය, ලිපිනය, ඡායාරූපය සහ මුරපදය වෙනස් කළ හැක. “සුරකින්න” ඔබන්න." },
    ],
  },
  {
    id: "dana",
    icon: "🍚",
    title: { en: "Book a dana", si: "දානයක් වෙන්කරගන්න" },
    steps: [
      { en: "Open the “Dana” page. Today's and tomorrow's dana donors and the whole month's roster are shown.", si: "“දාන” පිටුව විවෘත කරන්න. අද සහ හෙට දාන දායකයින් සහ මුළු මාසයේ ලැයිස්තුව පෙන්වයි." },
      { en: "Fill the booking form: date, type of dana (morning, noon, evening gilanpasa, bodhi puja, pirith), your name and phone.", si: "වෙන්කිරීමේ පෝරමය පුරවන්න: දිනය, දාන වර්ගය (හීල්, දහවල්, ගිලන්පස, බෝධි පූජා, පිරිත්), නම සහ දුරකථන අංකය." },
      { en: "The temple will call you to confirm. You can see the status in My Account.", si: "තහවුරු කිරීමට විහාරස්ථානයෙන් ඔබව අමතනු ඇත. තත්ත්වය “මගේ ගිණුම” හි බලන්න." },
    ],
  },
  {
    id: "sil",
    icon: "🌕",
    title: { en: "Register for Poya Sil / Bodhi Puja", si: "පොහොය සිල් / බෝධි පූජා සඳහා ලියාපදිංචිය" },
    steps: [
      { en: "Open “Sil & Puja” (or press “Register” in the Programme Schedule).", si: "“සිල් / පූජා” විවෘත කරන්න (නැතහොත් පිංකම් සටහනේ “ලියාපදිංචි වන්න” ඔබන්න)." },
      { en: "Choose the programme, enter your name, phone and number of people, then press “Register”.", si: "වැඩසටහන තෝරා නම, දුරකථන අංකය සහ පුද්ගලයින් ගණන ඇතුළත් කර “ලියාපදිංචි වන්න” ඔබන්න." },
      { en: "Each programme card shows the timetable with the Hamuduruwo's name and time.", si: "එක් එක් වැඩසටහනේ හාමුදුරුවන්ගේ නම සහ වේලාව සහිත කාල සටහන පෙන්වයි." },
    ],
  },
  {
    id: "admission",
    icon: "🎓",
    title: { en: "Register a child (Dhamma School / Montessori)", si: "දරුවෙකු ලියාපදිංචි කිරීම (දහම් පාසල / පෙර පාසල)" },
    steps: [
      { en: "Go to the Dhamma School or Montessori website and press “Admission / ඇතුළත් වීම”.", si: "දහම් පාසල හෝ පෙර පාසල වෙබ් අඩවියට ගොස් “ඇතුළත් වීම” ඔබන්න." },
      { en: "Fill in the child's details and the parent's details. You may add a photo. Tick the confirmation box and press “Submit application”.", si: "දරුවාගේ සහ දෙමාපියන්ගේ විස්තර පුරවන්න. ඡායාරූපයක් එක් කළ හැක. තහවුරු කිරීමේ කොටුව සලකුණු කර “අයදුම්පත යවන්න” ඔබන්න." },
      { en: "Can't fill the form? Press “WhatsApp Principal” or “WhatsApp Teacher” — your details are added to the message.", si: "පෝරමය පිරවිය නොහැකිද? “WhatsApp විදුහල්පති” හෝ “WhatsApp ගුරුවරිය” ඔබන්න — ඔබගේ විස්තර පණිවිඩයට එකතු වේ." },
      { en: "When accepted, the child receives an admission number (for example MT-2026-001). Members can see the status in My Account.", si: "පිළිගත් පසු දරුවාට ඇතුළත් වීමේ අංකයක් ලැබේ (උදා: MT-2026-001). සාමාජිකයින්ට තත්ත්වය “මගේ ගිණුම” හි බැලිය හැක." },
    ],
  },
  {
    id: "singlish",
    icon: "⌨️",
    title: { en: "Typing in Sinhala (Singlish keyboard)", si: "සිංහලෙන් ටයිප් කිරීම (සිංග්ලිෂ්)" },
    steps: [
      { en: "In every form, the “අ Singlish” switch at the bottom right is on. Type Sinhala words with English letters.", si: "සෑම පෝරමයකම පහළ දකුණේ “අ Singlish” ක්‍රියාත්මකයි. ඉංග්‍රීසි අකුරෙන් සිංහල වචන ටයිප් කරන්න." },
      { en: "Examples: aayuboowan → ආයුබෝවන්, budu saraNayi → බුදු සරණයි, daanaya → දානය, boodhi puujaawa → බෝධි පූජාව.", si: "උදාහරණ: aayuboowan → ආයුබෝවන්, budu saraNayi → බුදු සරණයි, daanaya → දානය, boodhi puujaawa → බෝධි පූජාව." },
      { en: "Long vowels: aa ා, ii ී, uu ූ, ee ේ, oo ෝ. Capital letters: N ණ, L ළ, D ඩ, Sh ෂ. x gives ං (laxkaawa → ලංකාව).", si: "දිගු ස්වර: aa ා, ii ී, uu ූ, ee ේ, oo ෝ. කැපිටල් අකුරු: N ණ, L ළ, D ඩ, Sh ෂ. x → ං (laxkaawa → ලංකාව)." },
      { en: "Press “EN” to type English (email addresses and passwords are always English).", si: "ඉංග්‍රීසියෙන් ටයිප් කිරීමට “EN” ඔබන්න (ඊමේල් සහ මුරපද සැමවිටම ඉංග්‍රීසියෙන්)." },
    ],
  },
  {
    id: "reviews",
    icon: "⭐",
    title: { en: "Write a review / send a message", si: "අදහසක් ලියන්න / පණිවිඩයක් යවන්න" },
    steps: [
      { en: "Open “Reviews”, choose stars, write your review and press “Post review”. Guest reviews appear after approval.", si: "“අදහස්” විවෘත කර තරු තෝරා අදහස ලියා “පළ කරන්න” ඔබන්න. අමුත්තන්ගේ අදහස් අනුමත කළ පසු පළ වේ." },
      { en: "Open “Contact” to send a message. The temple's reply appears in My Account.", si: "පණිවිඩයක් යැවීමට “සම්බන්ධ වන්න” විවෘත කරන්න. පිළිතුර “මගේ ගිණුම” හි පෙන්වයි." },
    ],
  },
  {
    id: "live",
    icon: "🔴",
    title: { en: "Live videos and social media", si: "සජීවී වීඩියෝ සහ සමාජ මාධ්‍ය" },
    steps: [
      { en: "When a pinkama is streamed, a red LIVE bar appears at the top. Press “Watch now”.", si: "පිංකමක් සජීවීව විකාශය වන විට ඉහළ රතු “LIVE” තීරුවක් පෙනේ. “නරඹන්න” ඔබන්න." },
      { en: "The “Live” page shows our Facebook posts and newest YouTube videos — they update automatically.", si: "“සජීවී” පිටුවේ අපගේ Facebook පළකිරීම් සහ නවතම YouTube වීඩියෝ ස්වයංක්‍රීයව පෙන්වයි." },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* ADMIN GUIDE                                                         */
/* ------------------------------------------------------------------ */
export const ADMIN_GUIDE: GuideTopic[] = [
  {
    id: "login",
    icon: "🔑",
    title: { en: "Logging in to the admin panel", si: "පරිපාලක පුවරුවට ඇතුල් වීම" },
    steps: [
      { en: "Go to /login, enter your admin email and password. Tick “Keep me signed in” to stay logged in for 90 days.", si: "/login වෙත ගොස් පරිපාලක ඊමේල් සහ මුරපදය ඇතුළත් කරන්න. දින 90ක් ඇතුල්ව සිටීමට “මාව මතක තබාගන්න” සලකුණු කරන්න." },
      { en: "You are taken to the admin Dashboard. From the website, click your profile picture → Admin Panel.", si: "ඔබව පරිපාලක පුවරුවට රැගෙන යයි. වෙබ් අඩවියේ සිට ඔබගේ ඡායාරූපය ක්ලික් කර → “Admin Panel” තෝරන්න." },
      { en: "To leave, press “Sign out” at the bottom of the left menu or in your profile menu.", si: "පිටවීමට වම් මෙනුවේ පහළ හෝ පැතිකඩ මෙනුවේ “Sign out” ඔබන්න." },
    ],
  },
  {
    id: "layout",
    icon: "🧭",
    title: { en: "How the admin panel is arranged", si: "පරිපාලක පුවරුවේ සැකැස්ම" },
    steps: [
      { en: "Top tabs choose the section: Temple, Dhamma School, Montessori, Users & Members. Each section is managed separately.", si: "ඉහළ ටැබ් මගින් අංශය තෝරන්න: විහාරය, දහම් පාසල, පෙර පාසල, පරිශීලකයින්. සෑම අංශයක්ම වෙන වෙනම කළමනාකරණය වේ." },
      { en: "The left menu lists everything for the chosen section. The Dashboard shows counts, quick-add buttons, today's dana, messages and who is online.", si: "වම් මෙනුවේ තෝරාගත් අංශයේ සියල්ල ඇත. Dashboard හි ගණන්, ඉක්මන් එකතු කිරීම්, අද දානය, පණිවිඩ සහ මාර්ගගතව සිටින අය පෙන්වයි." },
      { en: "Every list has Add (top right), ✏️ Edit and 🗑 Delete. Use the Search box to find anything.", si: "සෑම ලැයිස්තුවකම Add (ඉහළ දකුණ), ✏️ සංස්කරණය සහ 🗑 මකන්න ඇත. ඕනෑම දෙයක් සෙවීමට Search භාවිතා කරන්න." },
    ],
  },
  {
    id: "notices",
    icon: "📢",
    title: { en: "Notices and advertisements", si: "නිවේදන සහ දැන්වීම්" },
    steps: [
      { en: "Choose the section tab → Notices & Ads → Add.", si: "අංශය තෝරා → Notices & Ads → Add ඔබන්න." },
      { en: "Type: Notice, Advertisement or News. Add a title, message and optional poster image (upload or paste a link).", si: "වර්ගය: නිවේදනය, දැන්වීම හෝ පුවත්. මාතෘකාව, පණිවිඩය සහ අවශ්‍ය නම් පෝස්ටරයක් එක් කරන්න." },
      { en: "Tick “Pin” to show it first. Set “Hide after” to remove it automatically after a date.", si: "මුලින්ම පෙන්වීමට “Pin” සලකුණු කරන්න. දිනයකට පසු ඉවත් කිරීමට “Hide after” සකසන්න." },
    ],
  },
  {
    id: "activities",
    icon: "📅",
    title: { en: "Activities, monthly pinkam list and timetables", si: "ක්‍රියාකාරකම්, මාසික පිංකම් ලැයිස්තුව සහ කාල සටහන්" },
    steps: [
      { en: "Activities → Add for one programme: date, category (Dana, Pirith, Bodhi Puja, Poya, Bana...), time, host (dayaka), preacher and his temple.", si: "එක් වැඩසටහනක් සඳහා Activities → Add: දිනය, වර්ගය (දාන, පිරිත්, බෝධි පූජා, පොහොය, බණ...), වේලාව, දායකයා, දේශනා කරන හාමුදුරුවන් සහ විහාරය." },
      { en: "Leave the date empty and fill “Repeats” (e.g. Every Poya day) for regular activities.", si: "නිත්‍ය වැඩසටහන් සඳහා දිනය හිස්ව තබා “Repeats” පුරවන්න (උදා: සෑම පොහොය දිනකම)." },
      { en: "Timetable: add rows of time · activity · Hamuduruwo · temple, or press “Use Poya Sil template”. Tick “Allow online registration” for sil / bodhi puja.", si: "කාල සටහන: වේලාව · වැඩසටහන · හාමුදුරුවන් · විහාරය පේළි එක් කරන්න, නැතහොත් “Use Poya Sil template” ඔබන්න. සිල්/බෝධි පූජා සඳහා “Allow online registration” සලකුණු කරන්න." },
      { en: "Monthly Pinkam List: add the whole month at once — use the quick-fill buttons (Dana every day, Bodhi puja every Wed/Sat, Bana every Sunday).", si: "Monthly Pinkam List: මුළු මාසයම එකවර එක් කරන්න — ඉක්මන් බොත්තම් භාවිතා කරන්න (සෑම දිනකම දාන, බදාදා/සෙනසුරාදා බෝධි පූජා, ඉරිදා බණ)." },
    ],
  },
  {
    id: "dana",
    icon: "🍚",
    title: { en: "Daily dana roster and dana bookings", si: "දෛනික දාන ලැයිස්තුව සහ දාන වෙන්කිරීම්" },
    steps: [
      { en: "Temple → Daily Dana Roster: enter donors for morning, noon and evening for every day of the month, then “Save month”.", si: "විහාරය → Daily Dana Roster: මාසයේ සෑම දිනකම උදේ, දවල් සහ හවස දායකයින් ඇතුළත් කර “Save month” ඔබන්න." },
      { en: "Today's donors show automatically on the home page every day.", si: "අද දායකයින් සෑම දිනකම මුල් පිටුවේ ස්වයංක්‍රීයව පෙන්වයි." },
      { en: "Dana Bookings: requests from the website. Change the status to Confirmed or Cancelled after calling the donor.", si: "Dana Bookings: වෙබ් අඩවියෙන් ලැබෙන ඉල්ලීම්. දායකයා ඇමතූ පසු තත්ත්වය Confirmed හෝ Cancelled කරන්න." },
    ],
  },
  {
    id: "students",
    icon: "🎓",
    title: { en: "Students and online admissions", si: "සිසුන් සහ ඔන්ලයින් ඇතුළත් වීම්" },
    steps: [
      { en: "Choose Dhamma School or Montessori → Admissions (Online). Each application is a card with photo, child, parent and phone.", si: "දහම් පාසල හෝ පෙර පාසල තෝරා → Admissions (Online). සෑම අයදුම්පතක්ම ඡායාරූපය, දරුවා, දෙමාපියන් සහ දුරකථනය සහිත කාඩ්පතකි." },
      { en: "Call or WhatsApp the parent, then set the status: Waiting list, Accepted or Not accepted.", si: "දෙමාපියන් අමතා හෝ WhatsApp කර තත්ත්වය සකසන්න: Waiting list, Accepted හෝ Not accepted." },
      { en: "Accepted creates the student automatically with an admission number (DS-2026-001 / MT-2026-001).", si: "Accepted කළ විට ඇතුළත් වීමේ අංකය සමඟ (DS-2026-001 / MT-2026-001) සිසුවා ස්වයංක්‍රීයව එක් වේ." },
      { en: "Students: one card per student. Edit grade, photo and achievement. “On website” shows the student publicly (name, class, photo, achievement only).", si: "Students: සෑම සිසුවෙකුටම කාඩ්පතක්. ශ්‍රේණිය, ඡායාරූපය, ජයග්‍රහණ සංස්කරණය කරන්න. “On website” මගින් සිසුවා වෙබ් අඩවියේ පෙන්වයි (නම, පන්තිය, ඡායාරූපය, ජයග්‍රහණ පමණි)." },
      { en: "Dhamma School → Prefects & Monitors for the prefect board and class monitors.", si: "දහම් පාසල → Prefects & Monitors මගින් ශිෂ්‍ය නායක මණ්ඩලය සහ පන්ති නායකයින් එක් කරන්න." },
    ],
  },
  {
    id: "media",
    icon: "🖼",
    title: { en: "Gallery, videos and teachers", si: "ඡායාරූප, වීඩියෝ සහ ගුරුවරුන්" },
    steps: [
      { en: "Gallery → Add: upload a photo, add a title, description, album (e.g. Vesak 2026) and date.", si: "Gallery → Add: ඡායාරූපයක් උඩුගත කර මාතෘකාව, විස්තරය, ඇල්බමය (උදා: වෙසක් 2026) සහ දිනය එක් කරන්න." },
      { en: "Videos → Add: paste a YouTube or Facebook video link, choose the category (Katina, Bodhi Puja, Bana...).", si: "Videos → Add: YouTube හෝ Facebook වීඩියෝ සබැඳිය අලවා වර්ගය තෝරන්න (කඨින, බෝධි පූජා, බණ...)." },
      { en: "Teachers → Add for teachers (or the Maha Sangha under Temple). The first one is shown highlighted.", si: "ගුරුවරුන් සඳහා Teachers → Add (විහාරය යටතේ මහා සංඝරත්නය). පළමු තැනැත්තා විශේෂයෙන් පෙන්වයි." },
    ],
  },
  {
    id: "live",
    icon: "🔴",
    title: { en: "Social media and Go Live", si: "සමාජ මාධ්‍ය සහ සජීවී විකාශනය" },
    steps: [
      { en: "Each section → Social Media & Live: paste the Facebook page and YouTube channel links once, plus Principal / Teacher WhatsApp numbers (+94...). Press Save.", si: "සෑම අංශයක්ම → Social Media & Live: Facebook පිටුව සහ YouTube චැනලයේ සබැඳි එක් වරක් අලවන්න, විදුහල්පති / ගුරු WhatsApp අංක (+94...) ද එක් කර Save ඔබන්න." },
      { en: "New Facebook posts and YouTube videos then appear on the website automatically.", si: "ඉන්පසු නව Facebook පළකිරීම් සහ YouTube වීඩියෝ ස්වයංක්‍රීයව වෙබ් අඩවියේ පෙන්වයි." },
      { en: "Going live: on the Dashboard paste the live video link and press “● Go Live”. Press “End Live” when finished.", si: "සජීවී විකාශනය: Dashboard හි සජීවී වීඩියෝ සබැඳිය අලවා “● Go Live” ඔබන්න. අවසානයේ “End Live” ඔබන්න." },
    ],
  },
  {
    id: "messages",
    icon: "✉️",
    title: { en: "Messages, reviews and registrations", si: "පණිවිඩ, අදහස් සහ ලියාපදිංචි කිරීම්" },
    steps: [
      { en: "Messages: open a message, write a Reply and tick “Mark as read”. Members see your reply in My Account.", si: "Messages: පණිවිඩය විවෘත කර පිළිතුරක් ලියා “Mark as read” සලකුණු කරන්න. සාමාජිකයින්ට පිළිතුර “මගේ ගිණුම” හි පෙනේ." },
      { en: "Reviews: switch “Approved” to Yes to publish a guest review, or delete unwanted ones.", si: "Reviews: අමුත්තන්ගේ අදහසක් පළ කිරීමට “Approved” Yes කරන්න, අනවශ්‍ය ඒවා මකන්න." },
      { en: "Sil / Puja Registrations: see who registered for each programme and how many people.", si: "Sil / Puja Registrations: එක් එක් වැඩසටහනට ලියාපදිංචි වූ අය සහ පුද්ගලයින් ගණන බලන්න." },
    ],
  },
  {
    id: "users",
    icon: "👥",
    title: { en: "Users, admins and password resets (Super Admin)", si: "පරිශීලකයින්, පරිපාලකයින් සහ මුරපද යළි සැකසීම (Super Admin)" },
    steps: [
      { en: "Users & Members → Add: create an admin or member. Roles: Super Admin (everything), Temple Admin, Dhamma School Admin, Montessori Admin, Member.", si: "Users & Members → Add: පරිපාලකයෙකු හෝ සාමාජිකයෙකු සාදන්න. භූමිකා: Super Admin (සියල්ල), Temple Admin, Dhamma School Admin, Montessori Admin, Member." },
      { en: "Registration numbers are created automatically, or type one manually.", si: "ලියාපදිංචි අංක ස්වයංක්‍රීයව සෑදේ, නැතහොත් අතින් ටයිප් කරන්න." },
      { en: "Forgotten password: open the user → “Generate reset code” and give the 6-digit code to the user by phone / WhatsApp, or type a new password in the form.", si: "අමතක වූ මුරපදය: පරිශීලකයා විවෘත කර → “Generate reset code” ඔබා ඉලක්කම් 6 කේතය දුරකථනයෙන් / WhatsApp මගින් ලබා දෙන්න, නැතහොත් පෝරමයේ නව මුරපදයක් ටයිප් කරන්න." },
      { en: "The Status column shows who is online now (green) or when they were last seen.", si: "Status තීරුවේ දැන් මාර්ගගතව සිටින අය (කොළ) හෝ අවසන් වරට පැමිණි වේලාව පෙන්වයි." },
    ],
    tip: { en: "Give each person their own account — never share the Super Admin password.", si: "සෑම කෙනෙකුටම වෙනම ගිණුමක් දෙන්න — Super Admin මුරපදය කිසිවෙකු සමඟ බෙදා නොගන්න." },
  },
  {
    id: "typing",
    icon: "⌨️",
    title: { en: "Typing Sinhala in the admin panel", si: "පරිපාලක පුවරුවේ සිංහලෙන් ටයිප් කිරීම" },
    steps: [
      { en: "The “අ Singlish” switch (bottom right) works in every admin form: aayuboowan → ආයුබෝවන්. Press “EN” for English, links and phone numbers.", si: "“අ Singlish” (පහළ දකුණ) සෑම පරිපාලක පෝරමයකම ක්‍රියා කරයි: aayuboowan → ආයුබෝවන්. ඉංග්‍රීසි, සබැඳි සහ දුරකථන අංක සඳහා “EN” ඔබන්න." },
    ],
  },
];
