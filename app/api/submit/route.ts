import { supabaseAdmin } from "@/lib/supabase";
import { TablesInsert } from "@/app/database.types";
import { NextRequest, NextResponse } from "next/server";
import { LeadSubmission } from "@/schemas/lead";
import { ValidationError } from "yup";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
    let body: TablesInsert<'leads'>
    try {
        body = await req.json()
        await LeadSubmission.validate(body)
    } catch (e) {
        if (e instanceof ValidationError) {
            return NextResponse.json({ error: e.message }, { status: 400 })
        }
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    try {
        const { error } = await supabaseAdmin.from('leads').insert(body)
        if (error) return NextResponse.json({ error: error.message }, { status: 500 })
        revalidatePath('/dashboard')
        revalidatePath('/', 'layout')
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Service unavailable" }, { status: 503 })
    }
}