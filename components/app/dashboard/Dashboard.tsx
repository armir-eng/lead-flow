"use client"

import { useState } from "react";
import { Tables } from "@/app/database.types"
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/shadcn/button";
import { CATEGORIES, Category } from "./config";

export interface DashboardProps {
    leads: Tables<'leads'>[]
}

function CategoryBadge({ category }: { category: keyof Category }) {
    const c = CATEGORIES[category]
    return (
        <span
            className="inline-flex items-center gap-1.25 px-2.5 py-0.75 rounded-full text-xs font-semibold tracking-[0.02em]"
            style={{ background: c.bg, color: c.text, fontFamily: "'DM Sans', sans-serif" }}
        >
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: c.dot }} />
            {category}
        </span>
    );
}


export default function Dashboard({ leads }: DashboardProps) {
    const [filter, setFilter] = useState<string>("All");
    const [expanded, setExpanded] = useState<string | null>(null);

    const filtered = filter === "All" ? leads : leads.filter(l => l.ai_category === filter);
    const filterButtonClass = (category: "All" | keyof Category) =>
        `px-3.25 py-1.5 rounded-full border-[1.5px] text-xs font-dm-sans font-semibold cursor-pointer transition-all ${filter === category
            ? "border-[#1a1a2e] bg-[#1a1a2e] text-white"
            : "border-[#e0e0e0] bg-white text-[#555]"
        }`

    return (
        <div className="py-7 px-8">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div>
                    <h2 className="text-[22px] text-[#1a1a2e] m-0 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Lead Submissions
                    </h2>
                    <p className="text-[13px] text-[#888] m-0" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {filtered.length} result{filtered.length !== 1 ? "s" : ""} {filter !== "All" ? `· ${filter}` : "· all categories"}
                    </p>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                    <Button
                        onClick={() => setFilter("All")}
                        className={filterButtonClass("All")}
                    >
                        All
                    </Button>
                    {Object.keys(CATEGORIES).map(category => (
                        <Button
                            key={category}
                            onClick={() => setFilter(category)}
                            className={filterButtonClass(category as keyof Category)}
                        >
                            {category}
                        </Button>
                    ))}
                </div>
            </div>

            {filtered.length === 0 ? (
                <div className="text-center py-12 text-[#aaa]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    No submissions in this category yet.
                </div>
            ) : (
                <div className="flex flex-col gap-2.5">
                    {filtered.map(lead => (
                        <div key={lead.id}
                            onClick={() => setExpanded(expanded === lead.id ? null : lead.id)}
                            className={`border-[1.5px] rounded-xl bg-white cursor-pointer transition-all overflow-hidden ${expanded === lead.id
                                ? "border-[#1a1a2e] shadow-[0_4px_16px_rgba(26,26,46,0.08)]"
                                : "border-[#eee] shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
                                }`}>
                            <div className="px-5 py-4 flex items-center gap-4 flex-wrap">
                                <div
                                    className="w-10 h-10 rounded-full shrink-0 bg-linear-to-br from-[#1a1a2e] to-[#0f3460] flex items-center justify-center text-white font-bold text-[15px]"
                                    style={{ fontFamily: "'Playfair Display', serif" }}
                                >
                                    {lead.name[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                                        <span className="font-bold text-sm text-[#1a1a2e]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                            {lead.name}
                                        </span>
                                        <span className="text-[#bbb] text-xs">·</span>
                                        <span className="text-[13px] text-[#666]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{lead.business_name}</span>
                                        <span className="text-[#bbb] text-xs">·</span>
                                        <span className="text-xs text-[#999]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{lead.industry}</span>
                                    </div>
                                    <p className="text-[13px] text-[#555] m-0 leading-snug" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                        {lead.ai_summary}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <CategoryBadge category={lead.ai_category as keyof Category} />
                                    <span className="text-[11px] text-[#bbb] whitespace-nowrap" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                        {formatDate(lead.created_at)}
                                    </span>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2"
                                        className={`transition-transform duration-200 ${expanded === lead.id ? "rotate-180" : "rotate-0"}`}>
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                </div>
                            </div>

                            {expanded === lead.id && (
                                <div className="px-5 pb-4.5 border-t border-[#f0f0f0]">
                                    <div className="pt-4 grid grid-cols-2 gap-3">
                                        <div>
                                            <p className="text-[11px] font-bold text-[#aaa] tracking-[0.08em] uppercase m-0 mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>Email</p>
                                            <p className="text-[13px] text-[#333] m-0" style={{ fontFamily: "'DM Sans', sans-serif" }}>{lead.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-bold text-[#aaa] tracking-[0.08em] uppercase m-0 mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>AI Category</p>
                                            <CategoryBadge category={lead.ai_category as keyof Category} />
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-[11px] font-bold text-[#aaa] tracking-[0.08em] uppercase m-0 mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>Original Message</p>
                                            <p className="text-[13px] text-[#444] m-0 leading-relaxed bg-[#f9f9f9] px-3.5 py-2.5 rounded-lg" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                                {lead.message}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}