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

    const GenreSkeleton = () => (
        <div className="p-4">
            <div className="h-8 bg-gray-200 rounded-md animate-pulse w-1/3 mb-4"></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                {[...Array(10)].map((_, index) => (
                    <div key={index} className="bg-gray-200 rounded-lg h-12 animate-pulse">
                    </div>
                ))}
            </div>
        </div>
    );


    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Movie Genres</h2>
            {loading && <GenreSkeleton />}
            {error && <p className="text-center text-red-500">{error}</p>}

            {!loading && !error && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                    {genres.map((genre) => (
                        <div
                            key={genre.id}
                            className="bg-white p-4 rounded-lg text-center shadow-md hover:bg-gray-100 transition cursor-pointer text-gray-800"
                            onClick={() => handleGenreClick(genre.name)} // Trigger search on genre click
                        >
                            {genre.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}