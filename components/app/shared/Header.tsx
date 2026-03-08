"use client"

import { usePathname } from "next/navigation"
import Link from "next/link";
import { DashboardProps } from "../dashboard/Dashboard";


export default function Header({ leads }: DashboardProps) {
    const pathname = usePathname()
    const isActive = (path: string) => pathname === path
    
    // Utility class evaluation utility for 'nav' buttons
    // The background color will accordingly be set, regarding to which menu is active (form or dashboard)
    // For the active one, the button will be colored to white.
    const navBtnClass = (isMenuActive: boolean) =>
        `px-5 py-2 rounded-lg border-none text-[13px] font-semibold cursor-pointer transition-all ${isMenuActive
            ? "bg-white text-[#1a1a2e] shadow-[0_1px_4px_rgba(0,0,0,0.12)]"
            : "bg-transparent text-white/65"
        }`;

    return (
        <div className="bg-linear-to-br from-[#1a1a2e] to-[#0f3460] pt-5 p-2">
            <div className="max-w-195 mx-auto px-6">
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                            </svg>
                        </div>
                        <span className="text-white text-[18px] font-bold tracking-[-0.01em]" style={{ fontFamily: "'Playfair Display', serif" }}>
                            LeadFlow
                        </span>
                    </div>
                    <div className="bg-white/10 rounded-[10px] p-1 flex gap-0.5">
                        <Link
                            className={`font-dm-sans ${navBtnClass(isActive("/"))}`}
                            href="/"
                        >
                            Submit Request
                        </Link>
                        <Link
                            className={`font-dm-sans ${navBtnClass(isActive("/dashboard"))}`}
                            href="/dashboard"
                        >
                            Dashboard
                            <span
                                className={`ml-1.5 bg-white/20 text-white text-[11px] font-bold px-1.75 py-px rounded-[10px] ${isActive("/dashboard")  ? "hidden" : "inline"}`}
                            >
                                {leads.length}
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
} 