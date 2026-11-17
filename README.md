# Sri Punyabhiwardhanaramaya, Kottawa — Website

ශ්‍රී පුණ්‍යාභිවර්ධනාරාමය, කොට්ටාව

One Next.js app for the temple and the two schools it runs:

| Section | URL |
| --- | --- |
| Temple (main site) | `/` |
| Siri Saddharmodaya Sunday Dhamma School | `/dhamma-school` |
| Udaya Lama Uyana Pre School (Montessori) | `/montessori` |
| Admin panel | `/admin` |
| Member account | `/account` |

## Features

- **Temple**: notices & advertisements, activities, monthly calendar, programme schedule (dana host, bana preacher and their temple, time), Poya sil / Bodhi puja registration with timetable, daily dana roster (morning / noon / evening), dana booking requests, videos (Katina, Bodhi puja, Bana), gallery, reviews, contact form + map.
- **Dhamma School**: teachers, students (public achievements only), prefect board & class monitors, activities, notices & ads, calendar, gallery, reviews.
- **Montessori**: benefits & programmes, teachers, children, activities, notices, gallery, parent reviews.
- **Members**: register → automatic registration number (`PKT-2026-0001`), profile picture, online status, my dana bookings / messages / reviews, forgot & reset password (6-digit code).
- **Admin**: separate panels for Temple / Dhamma School / Montessori; create, edit, delete everything; monthly pinkam list (bulk add); daily dana roster; users & admins (roles, registration numbers, reset codes, online/offline).
- Sinhala / English toggle, 3D design (WebGL stupa, 3D cards and buttons).

## Tech

Next.js 16 (App Router, Server Actions) · PostgreSQL · Drizzle ORM · Tailwind CSS 4 · three.js / React Three Fiber · Vercel Blob (image uploads)

## Run locally

```bash
npm install
cp .env.example .env.local     # then edit the values
npm run db:local               # embedded Postgres on 127.0.0.1:5433 (no install needed) - keep running
npm run db:migrate
npm run db:seed                # creates the super admin from ADMIN_EMAIL / ADMIN_PASSWORD + starter content
npm run dev                    # http://localhost:3000
```

## Deploy (Vercel)

1. Import this repo in Vercel.
2. Add a Postgres database (Vercel → Storage → Neon) — this sets `DATABASE_URL`.
3. Add a Blob store (Vercel → Storage → Blob) for photo uploads — sets `BLOB_READ_WRITE_TOKEN`.
4. Set `AUTH_SECRET` (long random string). Optional email for reset codes: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`.
5. Deploy. Migrations run automatically during `npm run build`.
6. Create the first admin once: `DATABASE_URL=... ADMIN_EMAIL=... ADMIN_PASSWORD=... npm run db:seed`.
