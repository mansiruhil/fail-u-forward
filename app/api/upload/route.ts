import { NextRequest, NextResponse } from "next/server";
import { fetchNews } from "@/services/news";

function response(data: any = null, error: string | null = null, status = 200) {
    return NextResponse.json({ success: !error, data, error }, { status });
}

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("q") || "rejection";

        const result = await fetchNews(query);
        if (result.error) return response(null, result.error, result.status);

        return response(result.data);
    } catch (err) {
        console.error("Error in news route:", err);
        return response(null, "Failed to fetch news", 500);
    }
}
