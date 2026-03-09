"use client"

import { useState } from "react";
import { InferType } from "yup";
import { INDUSTRIES, LeadSubmission } from "@/schemas/lead";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/shadcn/button";
import { Field, FieldLabel } from "@/components/shadcn/field";
import { Input } from "@/components/shadcn/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select";
import { toast } from "react-toastify";



export default function IntakeForm() {

    const form = useForm<InferType<typeof LeadSubmission>>({
        resolver: yupResolver(LeadSubmission),
        defaultValues: {
            name: "",
            email: "",
            business_name: "",
            industry: "Healthcare",
            message: ""
        },
    })

    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [focused, setFocused] = useState<string | null>(null);

    const onSubmit = async (data: InferType<typeof LeadSubmission>) => {
        setLoading(true);
        
        // Get the categorization data, at first.
        // Those are needed to completely fill the lead record, to be inserted into the database.
        const categorizeResponse = await fetch("/api/categorize", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: data.name,
                business_name: data.business_name,
                industry: data.industry,
                message: data.message
            })
        })

        const categorized = await categorizeResponse.json()

        if (!categorizeResponse.ok) {
            toast.error(categorized.error ?? "Failed to categorize lead")
            setLoading(false)
            return
        }

        const submitResponse = await fetch("/api/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...data,
                ai_summary: categorized.summary,
                ai_category: categorized.category,
            }),
        });

        const submitted = await submitResponse.json()

        if (!submitResponse.ok) {
            toast.error(submitted.error ?? "Failed to submit lead")
            setLoading(false)
            return
        }

        setLoading(false);
        setSubmitted(true);
    };

    /*-------------------------- Shared classes -----------------------*/

    // Shared class for input fields
    // A special border background is set for focused ones
    const inputClass = (field: string) =>
        `w-full px-[14px] py-[11px] border-[1.5px] rounded-[10px] text-sm outline-none bg-[#fafafa] text-[#1a1a1a] transition-all box-border ${focused === field
            ? "border-[#1a1a2e] shadow-[0_0_0_3px_rgba(26,26,46,0.07)]"
            : "border-[#e0e0e0]"
        }`;
    const labelClass = "block mb-1.5 text-[13px] font-semibold text-[#3d3d3d] tracking-[0.01em] font-dm-sans"; // Shared class for field labels


    // Success message on successful form submission 
    if (submitted) {
        return (
            <div className="text-center px-6 py-12">
                <div className="w-16 h-16 rounded-full bg-linear-to-br from-[#1a1a2e] to-[#16213e] flex items-center justify-center mx-auto mb-5">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                </div>
                <h3 className="text-2xl text-[#1a1a2e] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Submission Received
                </h3>
                <p className="text-[#666] text-sm mb-7 font-dm-sans">
                    We've received your request and will be in touch shortly.
                </p>
                <Button
                    className="bg-[#1a1a2e] text-white border-none px-6 py-2.5 rounded-lg cursor-pointer text-sm font-semibold font-dm-sans"
                    onClick={() => {
                        setSubmitted(false);  // Redisplay the form  
                        form.reset()
                    }}
                >
                    Submit Another
                </Button>
            </div >
        );
    }

    // The button is disabled, unless all form fields are filled.
    const isSubmitButtonDisabled = !form.watch("name") || !form.watch("email") || !form.watch("business_name") || !form.watch("industry") || !form.watch("message");

    return (
        <div className="p-8 pb-7">
            <div className="mb-7">
                <h2 className="text-[22px] text-[#1a1a2e] m-0 mb-1.5" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Tell us about your project
                </h2>
                <p className="text-[13px] text-[#888] m-0" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    We'll follow up within one business day.
                </p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <Controller
                        name="name"
                        control={form.control}
                        render={({ field }) => (
                            <Field>
                                <FieldLabel htmlFor="name" className={labelClass}>Full Name</FieldLabel>
                                <Input
                                    {...field}
                                    type="text"
                                    placeholder="Jane Smith"
                                    onFocus={() => setFocused("name")}
                                    onBlur={() => setFocused(null)}
                                    className={inputClass("name")}
                                />
                            </Field>
                        )}
                    />
                    <Controller
                        name="email"
                        control={form.control}
                        render={({ field }) => (
                            <Field>
                                <FieldLabel htmlFor="email" className={labelClass}>Email Address</FieldLabel>
                                <Input
                                    {...field}
                                    type="email"
                                    placeholder="jane@company.com"
                                    onFocus={() => setFocused("email")}
                                    onBlur={() => setFocused(null)}
                                    className={inputClass("email")}
                                />
                            </Field>
                        )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <Controller
                        name="business_name"
                        control={form.control}
                        render={({ field }) => (
                            <Field>
                                <FieldLabel htmlFor="business_name" className={labelClass}>Business Name</FieldLabel>
                                <Input
                                    {...field}
                                    type="text"
                                    placeholder="Acme Corp"
                                    onFocus={() => setFocused("business_name")}
                                    onBlur={() => setFocused(null)}
                                    className={inputClass("business_name")}
                                />
                            </Field>
                        )}
                    />
                    <Controller
                        name="industry"
                        control={form.control}
                        render={({ field }) => (
                            <Field>
                                <FieldLabel htmlFor="industry">Industry</FieldLabel>
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="cursor-pointer">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {
                                                INDUSTRIES.map(industry => (
                                                    <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                                                ))
                                            }
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </Field>
                        )}
                    />
                </div>

                <div className="mb-6">
                    <Controller
                        name="message"
                        control={form.control}
                        render={({ field }) => (
                            <Field>
                                <FieldLabel className={labelClass}>What do you need help with?</FieldLabel>
                                <textarea
                                    {...field}
                                    placeholder="Describe your project, goals, or challenges. The more detail, the better."
                                    rows={4}
                                    className={`${inputClass("message")} resize-y leading-relaxed font-dm-sans`}
                                />
                            </Field>
                        )}
                    >
                    </Controller>
                </div>

                <Button
                    type="submit"
                    disabled={loading || isSubmitButtonDisabled}
                    className={`w-full py-3.25 font-dm-sans text-white border-none rounded-[10px] text-sm font-bold cursor-pointer tracking-[0.03em] transition-all flex items-center justify-center gap-2 ${loading ? "bg-[#555] cursor-not-allowed" : "bg-linear-to-br from-[#1a1a2e] to-[#0f3460]"
                        } ${isSubmitButtonDisabled ? "opacity-50" : "opacity-100"}`}
                >
                    {loading ? (
                        <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-[spin_0.7s_linear_infinite] inline-block" />
                            Analyzing with AI...
                        </>
                    ) : "Submit Request →"}
                </Button>
            </form>
        </div >
    );
}