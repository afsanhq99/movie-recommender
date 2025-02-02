import { NextResponse } from 'next/server';

const API_KEY = process.env.TMDB_API_KEY;

export async function GET(request) {
    if (!API_KEY) {
        return new NextResponse('TMDB API key is missing. Set the TMDB_API_KEY environment variable.', { status: 500 });
    }

    // Get the search params from the request URL
    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get('sort_by') || 'popularity.desc';

    try {
        const apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=${sortBy}&language=en-US&include_adult=false`;

        const response = await fetch(apiUrl);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`TMDB API request failed with status ${response.status}: ${errorData.status_message || response.statusText}`);
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('Error fetching data from TMDB API:', error);
        return NextResponse.json({ error: 'Failed to fetch data from TMDB API.' }, { status: 500 });
    }
}