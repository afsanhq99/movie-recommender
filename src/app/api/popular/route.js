import { NextResponse } from 'next/server';

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export async function GET() {
    try {
        // Ensure API key is set
        const apiKey = process.env.TMDB_API_KEY;
        if (!apiKey) {
            console.error("TMDB_API_KEY is missing in environment variables.");
            return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
        }

        const url = `${TMDB_BASE_URL}/movie/popular?api_key=${apiKey}&language=en-US&page=1`;

        const response = await fetch(url);

        if (!response.ok) {
            const errorData = await response.json();
            console.error("TMDB API Error:", errorData);
            return NextResponse.json({ error: errorData.status_message || "Failed to fetch popular movies" }, { status: response.status });
        }

        const data = await response.json();

        if (!data.results || !Array.isArray(data.results)) {
            console.error("Unexpected TMDB API response format:", data);
            return NextResponse.json({ error: "Invalid response from TMDB" }, { status: 500 });
        }

        const popularMovies = data.results.map(movie => ({
            id: movie.id,
            title: movie.title,
            overview: movie.overview,
            release_date: movie.release_date,
            vote_average: movie.vote_average,
            poster_url: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : null,
        }));

        return NextResponse.json({ movies: popularMovies });

    } catch (error) {
        console.error("Error fetching popular movies:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}