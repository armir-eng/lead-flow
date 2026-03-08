# ⚡ LeadFlow

> An AI-powered lead intake portal that automatically categorizes and summarizes incoming client requests — surfacing them on a clean, filterable dashboard.

---

## What it does

When a potential client fills out the intake form, LeadFlow:

1. **Categorizes the lead** via an AI call (GROQ) — assigning it to one of: `Automation`, `Website`, `AI Integration`, `SEO`, or `Custom Software`
2. **Generates a one-sentence summary** of what the client needs
3. **Stores the enriched record** in a Supabase database
4. **Surfaces it on the dashboard** — updated in real time after each submission

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Forms | React Hook Form + Yup |
| Database | Supabase (PostgreSQL) |
| AI | Google Gemini API |
| Fonts | Playfair Display + DM Sans |

---

## Project structure

```
app/
  page.tsx              # Intake form page (/)
  dashboard/page.tsx    # Leads dashboard (/dashboard)
  api/
    categorize/         # POST — AI categorization via Gemini
    submit/             # POST — validated insert into Supabase
  globals.css           # Tailwind theme, fonts, animations

components/
  app/
    form/IntakeForm.tsx         # Lead submission form
    dashboard/Dashboard.tsx     # Leads list with filters
    shared/Header.tsx           # Nav (Submit / Dashboard)
    shared/Card.tsx             # Page wrapper card

schemas/
  lead.ts               # Yup schemas: LeadSubmission, GeminiResponse, LeadRecord

lib/
  supabase.ts           # Supabase admin client
```

---

## Data flow

```
Client submits form
      │
      ▼
POST /api/categorize  →  Gemini API  →  { summary, category }
      │
      ▼
POST /api/submit  →  Supabase insert (lead + AI fields)
      │
      ▼
router.refresh()  →  Dashboard re-fetches leads server-side
```

---

## Lead schema

| Field | Type | Source |
|---|---|---|
| `name` | string | Form |
| `email` | string | Form |
| `business_name` | string | Form |
| `industry` | string | Form (select) |
| `message` | string | Form |
| `ai_summary` | string | Gemini |
| `ai_category` | string | Gemini |
| `id` | uuid | Supabase |
| `created_at` | timestamp | Supabase |

---

## Getting started

**1. Install dependencies**
```bash
npm install
```

**2. Set environment variables**
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
GROQ_API_KEY=...
```

**3. Run the dev server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Self-hosting

Want to run this with your own Supabase and Gemini account? Follow these steps.

### 1. Create a Supabase project

Go to [supabase.com](https://supabase.com) → **New project**.

Once created, grab the following from **Project Settings → API**:
- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **service_role** secret → `SUPABASE_SERVICE_ROLE_KEY`

### 2. Create the database table

Install the [Supabase CLI](https://supabase.com/docs/guides/cli) if you haven't already:
```bash
npm install -g supabase
```

Link your project (find your project ref in **Project Settings → General**):
```bash
supabase link --project-ref your-project-ref
```

Push the migration — this creates the `leads` table with RLS enabled:
```bash
supabase db push
```

### 3. Get a Groq API key

Go to [console.groq.com](https://console.groq.com) → **API Keys** → **Create API Key** → `GROQ_API_KEY`

### 4. Configure environment variables

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
GROQ_API_KEY=gsk_...
```

### 5. Run

```bash
npm install
npm run dev
```
