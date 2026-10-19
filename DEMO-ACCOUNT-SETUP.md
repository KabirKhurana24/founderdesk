# Create a shareable FounderDesk demo account

This makes a dedicated login that an HR reviewer can use to explore a pre-populated workspace. It does **not** create the Supabase Auth user automatically; create that user in the dashboard first.

## 1. Create the demo login in Supabase

1. Open Supabase Dashboard -> your FounderDesk project -> **Authentication -> Users**.
2. Choose **Add user** / **Create new user**.
3. Use an email you control or a demo email you can reliably manage. For a portfolio demo, a dedicated address such as `founderdesk.demo@YOUR-DOMAIN` is preferable to your personal login.
4. Set a unique password specifically for this demo account and enable **Auto Confirm User** if the option is shown. Do not reuse your personal or production password.
5. Create the user, then copy its **User UID** from the Users table.

Do not send the database password, Supabase secret key, or service-role key to the reviewer. Only send the demo account's email/password and the deployed Vercel URL.

## 2. Seed the dummy data

1. Open `supabase/seed-demo-account.sql`.
2. Replace every occurrence of `DEMO_USER_UUID` with the exact User UID copied above (leave the single quotes around the UUID).
3. Open Supabase -> **SQL Editor** -> New query.
4. Paste the updated SQL and run it.
5. The script replaces existing rows only for that dedicated demo user's actions/projects/invoices, then creates 12 actions, 5 projects and 5 invoices. All names and business scenarios are fictional. Do not run this for your personal account.
6. Check the final verification query returns 12 actions, 5 projects and 5 invoices.

## 3. Verify before sharing

1. Open the deployed Vercel URL in a private/incognito window.
2. Sign in using the dedicated demo account.
3. Check Overview, Projects, Collections and Activity; complete one action and refresh to verify persistence.
4. Confirm the Supabase Auth URL Configuration includes your Vercel deployment URL as a Site URL/redirect URL if required.
5. Share the Vercel URL, demo email, and demo password with HR using a suitable private channel.

## Safety notes

- This is a shared demo account: anyone with its credentials can view and modify its demo workspace. Keep only synthetic data in it.
- Do not use actual client information, real invoices, or RovenLabs internal data.
- Since the login is shared, create a fresh password before sharing and rotate it after the hiring process if you want to retire access.
- Never expose `SUPABASE_SECRET_KEY` or a service-role key in `NEXT_PUBLIC_*` variables, client-side code, GitHub, or the HR handoff.
