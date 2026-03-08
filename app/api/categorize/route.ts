import { AIResult, GROQResponse } from "@/schemas/lead";
import * as yup from "yup";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { name, business_name, industry, message } = await req.json()

    const systemPrompt = `You are a lead intake assistant. Categorize and summarize this lead:
        Name: ${name}
        Business: ${business_name}
        Industry: ${industry}
        Message: ${message}

        Respond with a JSON object only, no markdown:
        {
            "summary": "one sentence describing what they need",
            "category": "one of: Automation, Website, AI Integration, SEO, Custom Software, Other"
        }
    `

    try {
        const apiURL = "https://api.groq.com/openai/v1/chat/completions"
        const response = await fetch(apiURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.GROQ_API_KEY!}`
            },
            body: JSON.stringify({
                "model": "llama-3.1-8b-instant",
                "messages": [
                    {
                        "role": "system",
                        "content": systemPrompt
                    },
                    {
                        "role": "user",
                        "content": message
                    }
                ],
            })
        })


        const data = await response.json()

        // Most probably, the request would fail due to API's high traffic usage
        if (!response.ok) {
            return NextResponse.json({ error: data.error.message }, { status: 503 })
        }
        
        const groqValidated = await GROQResponse.validate(data)
        const rawResponse = (groqValidated.choices[0] as any).message.content
        const parsed = JSON.parse(rawResponse)
        const result = await AIResult.validate(parsed)

        return NextResponse.json({ summary: result.summary, category: result.category })
    } catch (e) {
        if (e instanceof TypeError) {
            return NextResponse.json({ error: "Network error occurred: You might have lost the internet connection, or Groq platform might be facing a temporary outage!" }, { status: 500 })
        } else if (e instanceof yup.ValidationError) {
            return NextResponse.json({ error: `AI returned an unexpected response: ${e.message}` }, { status: 500 })
        } else if (e instanceof SyntaxError) {
            return NextResponse.json({ error: "AI returned invalid JSON" }, { status: 500 })
        } else {
            return NextResponse.json({ error: `Unexpected error occurred: ${e}` }, { status: 500 })
        }
    }

}
