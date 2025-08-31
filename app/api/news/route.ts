export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { fetchNews } from "@/services/news";

function response(data: any = null, error: string | null = null, status = 200) {
    return NextResponse.json({ success: !error, data, error }, { status });
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("q") || "rejection";

        const data = await fetchNews(query);
        return response(data);
    } catch (error) {
        console.error("News API Error:", error);
        return response(null, "Failed to fetch news", 500);
    }
}
