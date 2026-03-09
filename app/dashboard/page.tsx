import Dashboard from "@/components/app/dashboard/Dashboard"
import { supabaseAdmin } from "@/lib/supabase"

export const dynamic = "force-dynamic"

export default async function Leads() {
    const {data: leads} = await supabaseAdmin.from('leads').select('*')
    
    return <Dashboard leads={leads ?? []} />
}