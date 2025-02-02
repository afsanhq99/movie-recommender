// app/api/search/tv/route.js
import { NextResponse } from 'next/server';

const API_KEY = process.env.TMDB_API_KEY;

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const page = searchParams.get('page') || 1;

    if (!query) {
        return NextResponse.json({ error: "Query parameter 'query' is required" }, { status: 400 });
    }

    const url = `https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&language=en-US&page=${page}&include_adult=false&query=${encodeURIComponent(query)}`;

    try {
        const res = await fetch(url);

        if (!res.ok) {
            const message = await res.text();
            throw new Error(`TMDB API returned an error: ${res.status} ${message}`);
        }

        const data = await res.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error("Error searching TV shows:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}