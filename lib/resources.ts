import { DANA_TYPES, EVENT_CATEGORIES, VIDEO_CATEGORIES, type Section } from "./site";

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "date"
  | "checkbox"
  | "select"
  | "image"
  | "email"
  | "password"
  | "agenda";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { value: string; label: string }[];
  help?: string;
  /** only shown for these sections */
  sections?: Section[];
};

export type ResourceKey =
  | "posts"
  | "events"
  | "gallery"
  | "videos"
  | "teachers"
  | "students"
  | "applications"
  | "leaders"
  | "testimonials"
  | "messages"
  | "registrations"
  | "dana"
  | "users";

export type Resource = {
  key: ResourceKey;
  label: string;
  singular: string;
  /** sections where this resource is used */
  sections: Section[];
  fields: Field[];
  /** columns for the list view */
  columns: string[];
  canCreate?: boolean;
  superAdminOnly?: boolean;
};

const opts = (rec: Record<string, { en: string }>) =>
  Object.entries(rec).map(([value, l]) => ({ value, label: l.en }));

export const RESOURCES: Record<ResourceKey, Resource> = {
  posts: {
    key: "posts",
    label: "Notices & Ads",
    singular: "Notice / Advertisement",
    sections: ["temple", "dhamma", "montessori"],
    columns: ["title", "kind", "publishedAt", "pinned"],
    canCreate: true,
    fields: [
      { name: "kind", label: "Type", type: "select", required: true, options: [
        { value: "notice", label: "Notice" },
        { value: "advertisement", label: "Advertisement" },
        { value: "news", label: "News" },
      ] },
      { name: "title", label: "Title", type: "text", required: true },
      { name: "body", label: "Message", type: "textarea" },
      { name: "imageUrl", label: "Image / Poster", type: "image" },
      { name: "linkUrl", label: "Link (optional)", type: "text" },
      { name: "publishedAt", label: "Publish date", type: "date" },
      { name: "expiresAt", label: "Hide after (optional)", type: "date" },
      { name: "pinned", label: "Pin to top / show on home page", type: "checkbox" },
    ],
  },
  events: {
    key: "events",
    label: "Activities",
    singular: "Activity",
    sections: ["temple", "dhamma", "montessori"],
    columns: ["eventDate", "title", "category", "startTime", "host", "preacher"],
    canCreate: true,
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "category", label: "Category", type: "select", options: opts(EVENT_CATEGORIES) },
      { name: "description", label: "Description", type: "textarea" },
      { name: "eventDate", label: "Date (leave empty for regular activities)", type: "date" },
      { name: "startTime", label: "Start time", type: "text", help: "e.g. 6.00 a.m." },
      { name: "endTime", label: "End time", type: "text", help: "e.g. 5.00 p.m." },
      { name: "schedule", label: "Repeats", type: "text", help: "e.g. Every Poya day, Every Sunday" },
      { name: "location", label: "Location", type: "text" },
      { name: "host", label: "Hosted by (Dayaka / family)", type: "text", help: "e.g. Mr. & Mrs. Perera and family" },
      { name: "preacher", label: "Bana / Dhamma talk by", type: "text", help: "e.g. Ven. Kiribathgoda Gnanananda Thero" },
      { name: "preacherFrom", label: "Preacher's temple / place", type: "text", help: "e.g. Mahamevnawa, Polgahawela" },
      { name: "imageUrl", label: "Photo", type: "image" },
      { name: "allowRegistration", label: "Allow online registration (Poya sil / Bodhi puja etc.)", type: "checkbox" },
      { name: "agenda", label: "Timetable (Sil programme schedule)", type: "agenda", help: "Time · activity · Hamuduruwo's name · temple — one row per item" },
    ],
  },
  videos: {
    key: "videos",
    label: "Videos",
    singular: "Video",
    sections: ["temple", "dhamma", "montessori"],
    columns: ["title", "category", "recordedAt", "featured"],
    canCreate: true,
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "category", label: "Category", type: "select", options: opts(VIDEO_CATEGORIES) },
      { name: "videoUrl", label: "Video link", type: "text", required: true, help: "Paste a YouTube link (best), a Facebook video link, or a direct .mp4 link" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "recordedAt", label: "Date", type: "date" },
      { name: "featured", label: "Show on home page", type: "checkbox" },
    ],
  },
  gallery: {
    key: "gallery",
    label: "Gallery",
    singular: "Photo",
    sections: ["temple", "dhamma", "montessori"],
    columns: ["imageUrl", "title", "album", "takenAt"],
    canCreate: true,
    fields: [
      { name: "imageUrl", label: "Photo", type: "image", required: true },
      { name: "title", label: "Title", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "album", label: "Album / Event", type: "text", help: "e.g. Vesak 2026" },
      { name: "takenAt", label: "Date", type: "date" },
    ],
  },
  teachers: {
    key: "teachers",
    label: "Teachers",
    singular: "Teacher",
    sections: ["dhamma", "montessori", "temple"],
    columns: ["imageUrl", "name", "position", "subject"],
    canCreate: true,
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "position", label: "Position", type: "text", help: "e.g. Principal, Grade 5 Teacher" },
      { name: "subject", label: "Grade / Subject", type: "text" },
      { name: "phone", label: "Phone (admin only)", type: "text" },
      { name: "email", label: "Email (admin only)", type: "email" },
      { name: "imageUrl", label: "Photo", type: "image" },
      { name: "bio", label: "Short note / quote", type: "textarea" },
      { name: "sortOrder", label: "Display order", type: "number" },
    ],
  },
  students: {
    key: "students",
    label: "Students",
    singular: "Student",
    sections: ["dhamma", "montessori"],
    columns: ["imageUrl", "name", "grade", "admissionNo", "showOnWebsite"],
    canCreate: true,
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "admissionNo", label: "Admission No.", type: "text" },
      { name: "grade", label: "Grade / Class", type: "text" },
      { name: "age", label: "Age", type: "number" },
      { name: "guardianName", label: "Parent / Guardian", type: "text" },
      { name: "contact", label: "Contact number", type: "text" },
      { name: "imageUrl", label: "Photo", type: "image" },
      { name: "achievement", label: "Achievement (shown publicly)", type: "textarea" },
      { name: "showOnWebsite", label: "Show on website (name, class, photo, achievement only)", type: "checkbox" },
      { name: "active", label: "Currently enrolled", type: "checkbox" },
    ],
  },
  applications: {
    key: "applications",
    label: "Admissions (Online)",
    singular: "Application",
    sections: ["dhamma", "montessori"],
    columns: ["photoUrl", "childName", "grade", "parentName", "phone", "status", "admissionNo", "createdAt"],
    canCreate: true,
    fields: [
      { name: "childName", label: "Child's full name", type: "text", required: true },
      { name: "dateOfBirth", label: "Date of birth", type: "date" },
      { name: "gender", label: "Gender", type: "select", options: [
        { value: "", label: "-" },
        { value: "boy", label: "Boy" },
        { value: "girl", label: "Girl" },
      ] },
      { name: "grade", label: "Grade / class applying for", type: "text" },
      { name: "schoolName", label: "Day school", type: "text" },
      { name: "parentName", label: "Parent / guardian", type: "text", required: true },
      { name: "relationship", label: "Relationship", type: "text" },
      { name: "phone", label: "Phone", type: "text", required: true },
      { name: "email", label: "Email", type: "email" },
      { name: "address", label: "Address", type: "text" },
      { name: "notes", label: "Medical / special notes", type: "textarea" },
      { name: "photoUrl", label: "Child's photo", type: "image" },
      { name: "status", label: "Status", type: "select", options: [
        { value: "pending", label: "Pending" },
        { value: "waiting", label: "Waiting list" },
        { value: "accepted", label: "Accepted (creates student)" },
        { value: "rejected", label: "Not accepted" },
      ] },
      { name: "admissionNo", label: "Admission No. (auto when accepted)", type: "text" },
    ],
  },
  leaders: {
    key: "leaders",
    label: "Prefects & Monitors",
    singular: "Prefect / Monitor",
    sections: ["dhamma"],
    columns: ["imageUrl", "name", "type", "position", "grade", "year"],
    canCreate: true,
    fields: [
      { name: "type", label: "Board", type: "select", options: [
        { value: "prefect", label: "Prefect Board" },
        { value: "monitor", label: "Class Monitor" },
      ] },
      { name: "name", label: "Name", type: "text", required: true },
      { name: "position", label: "Position", type: "text", help: "e.g. Head Prefect, Deputy Head Prefect, Monitor" },
      { name: "grade", label: "Grade / Class", type: "text" },
      { name: "year", label: "Year", type: "number" },
      { name: "imageUrl", label: "Photo", type: "image" },
      { name: "sortOrder", label: "Display order", type: "number" },
    ],
  },
  testimonials: {
    key: "testimonials",
    label: "Reviews",
    singular: "Review",
    sections: ["temple", "dhamma", "montessori"],
    columns: ["name", "rating", "message", "approved"],
    canCreate: true,
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "rating", label: "Rating (1-5)", type: "select", options: ["5", "4", "3", "2", "1"].map((v) => ({ value: v, label: "★".repeat(Number(v)) })) },
      { name: "message", label: "Message", type: "textarea", required: true },
      { name: "approved", label: "Approved (show on website)", type: "checkbox" },
    ],
  },
  messages: {
    key: "messages",
    label: "Messages",
    singular: "Message",
    sections: ["temple", "dhamma", "montessori"],
    columns: ["name", "subject", "phone", "createdAt", "isRead"],
    fields: [
      { name: "name", label: "Name", type: "text" },
      { name: "email", label: "Email", type: "email" },
      { name: "phone", label: "Phone", type: "text" },
      { name: "subject", label: "Subject", type: "text" },
      { name: "message", label: "Message", type: "textarea" },
      { name: "reply", label: "Reply (member sees this in their account)", type: "textarea" },
      { name: "isRead", label: "Mark as read", type: "checkbox" },
    ],
  },
  registrations: {
    key: "registrations",
    label: "Sil / Puja Registrations",
    singular: "Registration",
    sections: ["temple", "dhamma", "montessori"],
    columns: ["eventId", "name", "phone", "people", "status", "createdAt"],
    canCreate: true,
    fields: [
      { name: "eventId", label: "Programme ID", type: "number", required: true },
      { name: "name", label: "Name", type: "text", required: true },
      { name: "phone", label: "Phone", type: "text", required: true },
      { name: "people", label: "Number of people", type: "number" },
      { name: "notes", label: "Notes", type: "textarea" },
      { name: "status", label: "Status", type: "select", options: [
        { value: "registered", label: "Registered" },
        { value: "attended", label: "Attended" },
        { value: "cancelled", label: "Cancelled" },
      ] },
    ],
  },
  dana: {
    key: "dana",
    label: "Dana Bookings",
    singular: "Dana Booking",
    sections: ["temple"],
    columns: ["danaDate", "danaType", "name", "phone", "status"],
    canCreate: true,
    fields: [
      { name: "danaDate", label: "Date", type: "date", required: true },
      { name: "danaType", label: "Type", type: "select", options: opts(DANA_TYPES) },
      { name: "name", label: "Donor name", type: "text", required: true },
      { name: "phone", label: "Phone", type: "text", required: true },
      { name: "email", label: "Email", type: "email" },
      { name: "notes", label: "Notes", type: "textarea" },
      { name: "status", label: "Status", type: "select", options: [
        { value: "pending", label: "Pending" },
        { value: "confirmed", label: "Confirmed" },
        { value: "cancelled", label: "Cancelled" },
      ] },
    ],
  },
  users: {
    key: "users",
    label: "Users & Members",
    singular: "User Account",
    sections: ["temple"],
    columns: ["avatarUrl", "memberNo", "name", "email", "phone", "role", "lastSeenAt"],
    canCreate: true,
    superAdminOnly: true,
    fields: [
      { name: "memberNo", label: "Registration No.", type: "text", help: "Leave empty to generate automatically (PKT-2026-0001), or type a number manually" },
      { name: "name", label: "Full name", type: "text", required: true },
      { name: "email", label: "Email (login)", type: "email", required: true },
      { name: "phone", label: "Phone", type: "text" },
      { name: "address", label: "Address", type: "text" },
      { name: "avatarUrl", label: "Profile picture", type: "image" },
      { name: "role", label: "Role", type: "select", required: true, options: [
        { value: "member", label: "Member (website account)" },
        { value: "super_admin", label: "Super Admin (everything + manage users)" },
        { value: "temple", label: "Temple Admin" },
        { value: "dhamma", label: "Dhamma School Admin" },
        { value: "montessori", label: "Montessori Admin" },
      ] },
      { name: "password", label: "Password", type: "password", help: "Min 8 characters. Leave empty when editing to keep the current password." },
    ],
  },
};

export const RESOURCE_KEYS = Object.keys(RESOURCES) as ResourceKey[];

export function isResourceKey(k: string): k is ResourceKey {
  return k in RESOURCES;
}
