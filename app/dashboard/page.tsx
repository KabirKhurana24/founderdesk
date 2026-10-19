import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import Dashboard from '@/components/dashboard';
export default async function DashboardPage(){
 const supabase=createClient(); const {data:{user}}=await supabase.auth.getUser(); if(!user) redirect('/login');
 const [{data:actions},{data:projects},{data:invoices}] = await Promise.all([
  supabase.from('actions').select('*').order('due_date',{ascending:true}).limit(100),
  supabase.from('projects').select('*').order('created_at',{ascending:false}).limit(50),
  supabase.from('invoices').select('*').order('due_date',{ascending:true}).limit(50)
 ]);
 return <Dashboard user={{email:user.email||''}} initialActions={actions||[]} initialProjects={projects||[]} initialInvoices={invoices||[]}/>;
}
