-- FounderDesk HR demo workspace seed
-- IMPORTANT: Replace DEMO_USER_UUID with the UUID of the dedicated demo user
-- created in Supabase Dashboard -> Authentication -> Users.
-- Run this only for the dedicated demo account. It clears that user's current
-- actions/projects/invoices first, then inserts fictional sample records.

begin;

delete from public.actions where user_id = 'DEMO_USER_UUID'::uuid;
delete from public.projects where user_id = 'DEMO_USER_UUID'::uuid;
delete from public.invoices where user_id = 'DEMO_USER_UUID'::uuid;

insert into public.actions (user_id, title, owner, business, due_date, priority, status, notes) values
('DEMO_USER_UUID'::uuid, 'Send revised creative proposal to client', 'Aarav Mehta', 'Roven Studio', current_date - 2, 'high', 'open', 'Client feedback received; revised estimate pending.'),
('DEMO_USER_UUID'::uuid, 'Get final approval on product film storyboard', 'Maya Kapoor', 'Roven Studio', current_date - 1, 'high', 'blocked', 'Waiting for brand team approval before production.'),
('DEMO_USER_UUID'::uuid, 'Confirm shoot schedule and call sheet', 'Rhea Sharma', 'BrickLens', current_date + 1, 'high', 'open', 'Crew availability needs confirmation.'),
('DEMO_USER_UUID'::uuid, 'Follow up on Happer bulk order quotation', 'Kabir Khurana', 'Happer', current_date, 'high', 'open', 'B2B buyer requested revised pricing.'),
('DEMO_USER_UUID'::uuid, 'Share weekly production status with founder', 'Aarav Mehta', 'Operations', current_date, 'medium', 'in_progress', 'Summarise delivery risks across business lines.'),
('DEMO_USER_UUID'::uuid, 'Collect product dimensions from manufacturing', 'Nikhil Verma', 'Happer', current_date + 2, 'medium', 'open', 'Needed for updated catalogue and marketplace listing.'),
('DEMO_USER_UUID'::uuid, 'Send invoice reminder to Northstar Media', 'Rhea Sharma', 'BrickLens', current_date - 4, 'high', 'open', 'Invoice is overdue; ask for payment ETA politely.'),
('DEMO_USER_UUID'::uuid, 'Shortlist candidates for production coordinator', 'Maya Kapoor', 'Operations', current_date + 3, 'medium', 'open', 'Review six profiles and schedule first-round calls.'),
('DEMO_USER_UUID'::uuid, 'Compare competitor pricing for premium storage range', 'Kabir Khurana', 'Happer', current_date + 4, 'medium', 'open', 'Compare online prices, bundles and delivery promises.'),
('DEMO_USER_UUID'::uuid, 'Prepare client review deck for real-estate campaign', 'Rhea Sharma', 'BrickLens', current_date + 5, 'medium', 'open', 'Include first-cut frames and next production milestones.'),
('DEMO_USER_UUID'::uuid, 'Share final exports with client team', 'Aarav Mehta', 'Roven Studio', current_date - 3, 'high', 'done', 'Final exports delivered; archive source files.'),
('DEMO_USER_UUID'::uuid, 'Book internal review for next week', 'Kabir Khurana', 'Operations', current_date + 6, 'low', 'open', 'Align priorities and owner commitments.');

insert into public.projects (user_id, name, business, status, owner, due_date, budget) values
('DEMO_USER_UUID'::uuid, 'Product launch film', 'Roven Studio', 'blocked', 'Aarav Mehta', current_date + 4, 425000),
('DEMO_USER_UUID'::uuid, 'Social content pack', 'Roven Studio', 'in_progress', 'Maya Kapoor', current_date + 7, 185000),
('DEMO_USER_UUID'::uuid, 'Premium storage range — B2B launch', 'Happer', 'in_progress', 'Nikhil Verma', current_date + 12, 650000),
('DEMO_USER_UUID'::uuid, 'Gurugram residential property film', 'BrickLens', 'planned', 'Rhea Sharma', current_date + 10, 275000),
('DEMO_USER_UUID'::uuid, 'Weekly reporting and collections cleanup', 'Operations', 'in_progress', 'Kabir Khurana', current_date + 3, 0);

insert into public.invoices (user_id, client, business, amount, due_date, status) values
('DEMO_USER_UUID'::uuid, 'Northstar Media (fictional)', 'BrickLens', 87500, current_date - 9, 'overdue'),
('DEMO_USER_UUID'::uuid, 'LAVA campaign (fictional scenario)', 'Roven Studio', 150000, current_date - 2, 'overdue'),
('DEMO_USER_UUID'::uuid, 'Social content client (fictional)', 'Roven Studio', 64000, current_date + 5, 'pending'),
('DEMO_USER_UUID'::uuid, 'UrbanNest Developers (fictional)', 'BrickLens', 112000, current_date + 8, 'pending'),
('DEMO_USER_UUID'::uuid, 'Happer retail partner (fictional)', 'Happer', 98000, current_date - 15, 'paid');

commit;

-- Verify counts for the demo account:
select 'actions' as table_name, count(*) as rows from public.actions where user_id = 'DEMO_USER_UUID'::uuid
union all select 'projects', count(*) from public.projects where user_id = 'DEMO_USER_UUID'::uuid
union all select 'invoices', count(*) from public.invoices where user_id = 'DEMO_USER_UUID'::uuid;
