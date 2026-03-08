export default function Card({ children }: {children: React.ReactNode}) {
    return (
        <div className="max-w-195 mx-auto px-6 py-8">
            <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.07),0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden animate-[fadeUp_0.3s_ease]">
                {children}
            </div>
        </div>
    )
}