interface CategoryStyle {
    bg: string;
    text: string,
    dot: string
}

export interface Category {
    Automation: CategoryStyle;
    Website: CategoryStyle;
    "AI Integration": CategoryStyle;
    SEO: CategoryStyle;
    "Custom Software": CategoryStyle;
    Other: CategoryStyle
}

export const CATEGORIES: Category = {
    Automation: { bg: "#e8f5e9", text: "#2e7d32", dot: "#43a047" },
    Website: { bg: "#e3f2fd", text: "#1565c0", dot: "#1e88e5" },
    "AI Integration": { bg: "#f3e5f5", text: "#6a1b9a", dot: "#8e24aa" },
    SEO: { bg: "#fff8e1", text: "#e65100", dot: "#fb8c00" },
    "Custom Software": { bg: "#fce4ec", text: "#880e4f", dot: "#e91e63" },
    Other: { bg: "#f5f5f5", text: "#424242", dot: "#757575" },
};