export async function GET() {
    const apiKey = process.env.TMDB_API_KEY; // Replace with your actual API key from TMDb
    const url = `https://api.themoviedb.org/3/genre/movie/list?language=en&api_key=${apiKey}`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.status_message || "Failed to fetch genres");
        }

        return Response.json(data);
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
