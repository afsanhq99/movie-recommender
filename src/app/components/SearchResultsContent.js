'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export function SearchResultsContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get("query");
    const router = useRouter();

    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [ratingFilter, setRatingFilter] = useState(0);

    useEffect(() => {
        if (!query) return;

        const fetchMovies = async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await fetch(`/api/movies?query=${query}`);
                const data = await res.json();

                if (data.error) throw new Error(data.error);

                const filteredMovies = data.results.filter(
                    (movie) => movie.vote_average >= ratingFilter
                );

                setMovies(filteredMovies || []);
            } catch (err) {
                setError(err.message);
            }

            setLoading(false);
        };

        fetchMovies();
    }, [query, ratingFilter]);

    return (
        <div className="flex min-h-screen bg-gray-900 text-white">
            {/* Sidebar */}
            <div className="w-64 bg-gray-800 p-6">
                <h2 className="text-xl font-semibold mb-4">Filter by Rating</h2>
                <div className="mb-4">
                    <label htmlFor="rating" className="text-sm">Minimum Rating:</label>
                    <input
                        id="rating"
                        type="range"
                        min="0"
                        max="10"
                        step="0.1"
                        value={ratingFilter}
                        onChange={(e) => setRatingFilter(parseFloat(e.target.value))}
                        className="w-full mt-2"
                    />
                    <div className="flex justify-between text-sm mt-1">
                        <span>0</span>
                        <span>10</span>
                    </div>
                    <p className="text-sm mt-2">Selected Rating: {ratingFilter}</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">
                <button
                    onClick={() => router.push("/")}
                    className="mb-6 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-md transition"
                >
                    ⬅ Back to Home
                </button>

                <h1 className="text-3xl font-bold mb-6 text-center">
                    Search Results for "<span className="text-blue-400">{query}</span>"
                </h1>

                {loading && <p className="text-center text-lg">Loading...</p>}
                {error && <p className="text-center text-red-400">{error}</p>}

                <div className="mt-6">
                    {movies.length > 0 ? (
                        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {movies.map((movie, index) => (
                                <li
                                    key={movie.id}
                                    className="bg-gray-800 p-4 rounded-lg shadow-lg transform transition duration-300 hover:scale-105"
                                >
                                    <Link href={`/movie/${movie.id}`}>
                                        {movie.poster_path ? (
                                            <Image
                                                src={`${TMDB_IMAGE_BASE_URL}/w500${movie.poster_path}`}
                                                alt={movie.title}
                                                width={500}
                                                height={750}
                                                className="rounded-lg shadow-md mx-auto"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                quality={80}
                                                priority={index < 3}
                                                loading={index < 3 ? undefined : "lazy"}
                                            />
                                        ) : (
                                            <div className="w-48 h-72 bg-gray-700 flex items-center justify-center text-gray-400 rounded-lg mx-auto">
                                                No Image
                                            </div>
                                        )}
                                        <div className="mt-4 text-center">
                                            <h2 className="text-lg font-semibold">{movie.title}</h2>
                                            <p className="text-sm text-gray-400">{movie.release_date}</p>
                                            <p className="text-sm mt-2 text-gray-300">
                                                {movie.overview.slice(0, 100)}...
                                            </p>
                                            <p className="mt-2 text-yellow-400 font-semibold">
                                                Rating: {movie.vote_average.toFixed(1)} / 10
                                            </p>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        !loading && (
                            <p className="text-center text-lg text-gray-300">No movies found.</p>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}