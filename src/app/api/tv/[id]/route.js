// app/api/tv/[id]/route.js
import { NextResponse } from 'next/server';

const API_KEY = process.env.TMDB_API_KEY;

export async function GET(request, { params }) {
    const { id } = params;

    if (!id) {
        return NextResponse.json({ error: "TV series ID is required" }, { status: 400 });
    }

    const url = `https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&language=en-US&append_to_response=credits`;

    try {
        const res = await fetch(url);

        if (!res.ok) {
            const message = await res.text();
            throw new Error(`TMDB API returned an error: ${res.status} ${message}`);
        }

        const data = await res.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error("Error fetching TV show details:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}