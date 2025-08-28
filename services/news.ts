export async function fetchNews(query: string) {
    const API_KEY = process.env.NEWS_API_KEY;

    if (!API_KEY) {
        return { error: "News API key not configured", status: 500 };
    }

    try {
        const response = await fetch(
            `https://newsapi.org/v2/everything?q=${encodeURIComponent(
                query
            )}&apiKey=${API_KEY}&pageSize=20&sortBy=publishedAt`
        );

        if (!response.ok) {
            return {
                error: `News API error: ${response.status}`,
                status: response.status,
            };
        }

        const data = await response.json();
        return { data };
    } catch (err) {
        console.error("Error fetching news:", err);
        return { error: "Failed to fetch news", status: 500 };
    }
}
