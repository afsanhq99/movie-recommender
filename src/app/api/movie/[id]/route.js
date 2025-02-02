import { NextResponse } from 'next/server';

const API_KEY = process.env.TMDB_API_KEY;

export async function GET(request, { params }) {
    // Ensure params are awaited properly
    const { id } = await params;

    if (!API_KEY) {
        return NextResponse.json({ error: 'TMDB API key is missing' }, { status: 500 });
    }

    try {
        // Fetch both movie details and credits in parallel
        const [movieResponse, creditsResponse] = await Promise.all([
            fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`),
            fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}`)
        ]);

        if (!movieResponse.ok || !creditsResponse.ok) {
            throw new Error('Failed to fetch movie details');
        }

        const [movieData, creditsData] = await Promise.all([
            movieResponse.json(),
            creditsResponse.json()
        ]);

        return NextResponse.json({ ...movieData, credits: creditsData });

    } catch (error) {
        console.error('Error fetching movie details:', error);
        return NextResponse.json({ error: 'Failed to fetch movie details' }, { status: 500 });
    }
}
