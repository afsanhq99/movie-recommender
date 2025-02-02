// app/api/movies/route.js
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || ""; // Get search query from URL
    const apiKey = process.env.TMDB_API_KEY; // Store API key in .env.local file

    if (!query) {
        return Response.json({ error: "Query parameter is required" }, { status: 400 });
    }

    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return Response.json(data);
    } catch (error) {
        return Response.json({ error: "Failed to fetch movies" }, { status: 500 });
    }
}
