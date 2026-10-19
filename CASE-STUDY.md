# FounderDesk — Product case study

## Problem hypothesis
In a small multi-business group, commitments can be scattered across meeting notes, messages and spreadsheets. A founder or operations owner needs a clear way to see what is overdue, who owns the next step, and which follow-up should happen next.

This is a product hypothesis inspired by a Founder's Office job description, not a claim about any employer's actual internal process.

## Product choice
Build a narrow follow-through workflow rather than a broad business OS. The first slice covers a persistent action queue, prioritisation by due date, CSV import/export, editable follow-up drafts and a weekly operating summary.

## Implementation
- Next.js and TypeScript for the web application.
- Supabase Auth and PostgreSQL for persistence.
- Row-level security policies scope data to the authenticated user.
- Optional server-side LLM integration for draft generation, with a template fallback.
- Human approval is required; drafts are never sent automatically.

## What to validate
1. Can a user import an existing CSV tracker without losing rows or silently mis-mapping fields?
2. Do overdue and upcoming commitments surface correctly for the user's timezone and date?
3. Does drafting save time without fabricating context?
4. Does the database isolate each user's data?
5. Is one integration (for example Google Tasks) worth the added OAuth complexity compared with a clean export?

## Known limitations
This is an MVP scaffold. Google integrations, XLSX parsing, full project/invoice CRUD, automated browser tests and production monitoring remain future work. It is not connected to the company named in the application context.
