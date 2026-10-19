# FounderDesk — Full-stack MVP

A focused Founder's Office workflow app for commitments, follow-ups, projects and collections. This is an independent portfolio prototype; all business names and sample concepts are illustrative and it is not connected to RovenLabs.

## Stack
- Next.js 14 / React / TypeScript
- Supabase Auth + PostgreSQL with row-level security
- Papa Parse for CSV import/export
- Optional server-side OpenAI API for follow-up drafts
- Vercel-ready deployment

## Prerequisites
- Node.js 20 or newer
- A Supabase project (free tier is sufficient)
- Optional OpenAI API key for AI-assisted drafts

## Local setup
1. Extract the project and open a terminal in this directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from Supabase → Project Settings → API.
4. In Supabase → SQL Editor, run the full `supabase/schema.sql` file.
5. In Supabase → Authentication → URL Configuration, add `http://localhost:3000` as a Site URL / allowed redirect URL.
6. Start the app:
   ```bash
   npm run dev
   ```
7. Visit http://localhost:3000, create an account, confirm email if requested, and sign in.

## Optional AI drafts
Add `OPENAI_API_KEY` and optionally `OPENAI_MODEL` to `.env.local`, restart the dev server, then use Draft on a follow-up. The key is only read by the server route. Without a key, the route returns a deterministic message template. The app never sends the draft to anyone automatically.

## Deploy to Vercel
1. Push this folder to a new GitHub repository.
2. Import the repository in https://vercel.com/new.
3. Add the same environment variables in Vercel Project Settings → Environment Variables.
4. Deploy. Add your deployed domain to Supabase Authentication → URL Configuration, including the `/dashboard` redirect as appropriate.
5. Test sign-up, sign-in, creating an action, completing an action, CSV import/export and drafting on the deployed site.

## Current implementation
- Public product landing page and sign-in/sign-up screen.
- Supabase authentication and protected dashboard route.
- Persistent actions, projects and invoices read from Supabase.
- Create/complete commitments, search, CSV import/export, follow-up draft API, weekly brief export.
- User-specific row-level security in SQL.

## Deliberate MVP limits
- Google Tasks/Gmail OAuth integration is not implemented yet.
- Projects and invoices currently have read/list views; creation/editing UI is a follow-up milestone.
- CSV import supports CSV, not XLSX. It expects a title/task column and common owner/business/due/priority/status columns.
- The AI route is optional and falls back to a template without an API key.
- No claims of actual RovenLabs internal data; demo rows must be added to your own Supabase account.

## HR demo account
See [DEMO-ACCOUNT-SETUP.md](./DEMO-ACCOUNT-SETUP.md) for creating a dedicated Supabase login and pre-populating it with fictional actions, projects and invoices. The seed SQL is `supabase/seed-demo-account.sql`.

## Suggested demo data
After signing up, create a few actions through the UI or use CSV import. Example columns:
`title,owner,business,due_date,priority,status,notes`
