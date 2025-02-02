import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"; // Use w500 for 500px width images

export async function POST(req) {
    try {
        const { userDescription } = await req.json();

        const prompt = `
      I want movie recommendations based on these details: ${userDescription}.
      Please provide a list of 6 movie titles that closely match these preferences.
      Output the result as a JSON array like this: ["Movie Title 1", "Movie Title 2", "Movie Title 3", "Movie Title 4", "Movie Title 5", "Movie Title 6"]
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Extract movie titles
        const movieTitles = JSON.parse(text);

        // Fetch movie details from TMDb API
        const movieDetails = await Promise.all(
            movieTitles.map(async (title) => {
                const tmdbSearchResponse = await fetch(
                    `${TMDB_BASE_URL}/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(title)}`
                );
                const searchData = await tmdbSearchResponse.json();

                if (searchData.results && searchData.results.length > 0) {
                    const movieId = searchData.results[0].id; // Get ID of the first match
                    const tmdbMovieResponse = await fetch(
                        `${TMDB_BASE_URL}/movie/${movieId}?api_key=${process.env.TMDB_API_KEY}`
                    );
                    const movieData = await tmdbMovieResponse.json();

                    return {
                        ...movieData,
                        poster_path: movieData.poster_path
                            ? `${TMDB_IMAGE_BASE_URL}${movieData.poster_path}`
                            : null,
                    };
                } else {
                    return null; // Handle case where movie is not found
                }
            })
        );

        return NextResponse.json({ movies: movieDetails.filter(movie => movie !== null) });
    } catch (error) {
        console.error("Error generating recommendations:", error);
        return NextResponse.json({ error: "Failed to generate recommendations" }, { status: 500 });
    }
}