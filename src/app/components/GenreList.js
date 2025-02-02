"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GenreList() {
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchGenres = async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await fetch("/api/genres");
                const data = await res.json();

                if (data.error) throw new Error(data.error);

                setGenres(data.genres || []);
            } catch (err) {
                setError(err.message);
            }

            setLoading(false);
        };

        fetchGenres();
    }, []);

    // Handle genre click to navigate to search results
    const handleGenreClick = (genreName) => {
        router.push(`/movie/search?query=${genreName}`);
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Movie Genres</h2>
            {loading && (
                <div className="flex justify-center items-center">
                    {/* Loading spinner */}
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
                </div>
            )}
            {error && <p className="text-center text-red-500">{error}</p>}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                {genres.map((genre) => (
                    <div
                        key={genre.id}
                        className="bg-gray-900 p-4 rounded-lg text-center shadow-md hover:bg-gray-300 transition cursor-pointer"
                        onClick={() => handleGenreClick(genre.name)} // Trigger search on genre click
                    >
                        {genre.name}
                    </div>
                ))}
            </div>
        </div>
    );
}
