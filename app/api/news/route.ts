import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || 'rejection';
    
    const API_KEY = process.env.NEWS_API_KEY;
    
    if (!API_KEY) {
      return NextResponse.json({ error: 'News API key not configured' }, { status: 500 });
    }

    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=${API_KEY}&pageSize=20&sortBy=publishedAt`
    );

    if (!response.ok) {
      throw new Error(`News API error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}
