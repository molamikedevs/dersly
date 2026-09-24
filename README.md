# Dersly

A teaching platform built for a real classroom. Dersly replaces sending homework over WhatsApp: students log in, read their homework, browse learning material, and check their English level.

**Live at [dersly.pro](https://dersly.pro)**

![Dersly](./public/og-image.png)

---

## Why this exists

I teach English in Baku. Private students online, a small course group, and a Sunday conversation club. Everything ran through WhatsApp: homework as photos, questions lost in scroll, no record of what was set when.

Dersly is the tool I built to fix that for my own students. It is in daily use, not a demo.

---

## What it does

### Teacher side

- **Classes** — create and manage classes of three kinds: one to one, course, and conversation. Each gets a six character invite code students use to join.
- **Homework** — post a document to a class, with optional instructions. Replace it each week; previous homework stays.
- **Materials** — a shared library of videos and documents, tagged by level, visible to every student.
- **Students** — every enrolment across all classes, with level and schedule.
- **Overview** — which classes have current homework and which do not.

### Student side

- **Home** — next lesson with a join link, current homework, recent materials.
- **Homework** — read the document in the browser or download it.
- **Materials** — filter by level, play videos inline, read documents.
- **Level test** — thirty CEFR questions, scored server side, result saved to the profile and retakeable.
- **Profile** — level, classes, schedule, and an avatar they upload themselves.

---

## Stack

|           |                                                    |
| --------- | -------------------------------------------------- |
| Framework | Next.js 16, App Router                             |
| Language  | TypeScript                                         |
| Database  | Supabase (PostgreSQL)                              |
| Auth      | Supabase Auth, email and password                  |
| Storage   | Supabase Storage, private buckets with signed URLs |
| Styling   | Tailwind CSS v4, shadcn/ui                         |
| Forms     | react-hook-form, Zod                               |
| Email     | Resend over custom SMTP                            |
| Hosting   | Vercel                                             |

---

## Architecture

**Server first.** Reads happen in Server Components calling query functions directly. Mutations go through Server Actions. There are no route handlers except the auth callback, because nothing external consumes this data.

**Row level security is the security boundary.** Every table has policies. A student sees homework because they are enrolled in the class it belongs to, not because a query filtered it. The same query returns different rows depending on who runs it.

**The URL is the source of truth.** Pagination, filters and sorting live in search params, validated by a shared Zod schema before reaching any query. No client state holds server data.

**Files are private.** Documents live in private Storage buckets and are served through short lived signed URLs, generated per request. Nothing is publicly addressable except avatars.

### Data model

Seven tables for the core app, four more for the level test.

```
profiles      extends auth.users, holds role and level
classes       a teaching unit, with an invite code
enrollments   joins students to classes
homework      posted work, scoped to a class
materials     global library, optionally class scoped
submissions   reserved, not used in V1
payment_receipts  reserved, not used in V1

quizzes, questions, options, quiz_attempts
```

A private student is modelled as a class of one. `classes.type` changes how a class is presented, never how it is queried, so there is no branching logic anywhere underneath.

---

## Decisions worth explaining

**Supabase Auth over Clerk.** Clerk would have saved a day of form building and cost a permanent sync layer between two sources of truth. With Supabase Auth, `profiles.id` is a foreign key to `auth.users` and `auth.uid()` works directly in RLS policies.

**No submissions.** Students hand work in during the lesson, so building an upload and grading flow would have been software nobody used. The table exists for a later version.

**No video calls.** Each class has a fixed meeting URL. Real time video is a separate product, not a feature.

**Archive rather than delete classes.** Deleting cascades to homework and enrolments. `is_active` hides a class and keeps a year of work.

**Enrolment happens in a database trigger.** The invite code travels in signup metadata, and the trigger creates the profile and the enrolment in the same transaction. Doing it in the action fails, because `auth.uid()` is not yet set when the action runs.

---

## Running locally

```bash
git clone https://github.com/molamikedevs/dersly.git
cd dersly
npm install
```

Create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

```bash
npm run dev
```

You will also need a Supabase project with the schema, RLS policies and storage buckets in place.

---

## Roadmap

- Classmates view, so group students can see who else is in their class
- Reminder emails when new homework is posted
- Practice quizzes per class
- Multi teacher support, so the school can run its Russian and Azerbaijani classes on the same platform

---

## Author

**Lamin Kevin Foday**
[GitHub](https://github.com/molamikedevs) · [LinkedIn](https://linkedin.com/in/lamin-foday-23a263344)
