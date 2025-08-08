import { useEffect, useRef } from "react"

export function WordCounter({ count }: { count: number }) {
    const progressRef = useRef<SVGCircleElement | null>(null)

    const radius = 40
    const circumference = 2 * Math.PI * radius
    const maxWords = 600

    useEffect(() => {
        if (!progressRef.current) return
        const percentage = Math.min(100, (count / maxWords) * 100)
        const offset = circumference - (percentage / 100) * circumference
        progressRef.current.style.strokeDashoffset = offset.toString()
    }, [count, circumference])

    return (
        <div className="flex gap-1">
        <div className="w-7 h-7">
            <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                    className="text-gray-300 stroke-current"
                    strokeWidth="10"
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="transparent"
                />
                <circle
                    className="text-blue-500 stroke-current transition-all duration-500 ease-in-out"
                    strokeWidth="10"
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference}
                    strokeLinecap="round"
                    ref={progressRef}
                />
            </svg>
            </div>
            <div className="flex items-center justify-center text-xs font-semibold text-black">
                {count} / {maxWords}
            </div>
        </div>
    )
}
