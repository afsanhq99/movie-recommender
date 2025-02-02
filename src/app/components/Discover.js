'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export default function Discover() {
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [popularMovies, setPopularMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchMovies() {
            try {
                const [trendingResponse, popularResponse] = await Promise.all([
                    fetch('/api/discover?sort_by=popularity.desc'),
                    fetch('/api/discover?sort_by=vote_average.desc&vote_count.gte=1000')
                ]);

                if (!trendingResponse.ok || !popularResponse.ok) {
                    throw new Error('Failed to fetch movies');
                }

                const [trendingData, popularData] = await Promise.all([
                    trendingResponse.json(),
                    popularResponse.json()
                ]);

                setTrendingMovies(trendingData.results || []);
                setPopularMovies(popularData.results || []);
            } catch (err) {
                setError(err.message);
                console.error("Error fetching movies:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchMovies();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            {/* Loading spinner */}
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
        </div>
    );
    if (error) return <div className="flex justify-center items-center min-h-screen text-red-500">Error: {error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-8 text-center">That's a Wrap 2024</h1>

            <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">Trending</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {trendingMovies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">What's Popular</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {popularMovies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            </section>
        </div>
    );
}

export const MovieCard = ({ movie }) => (
    <Link href={`/movie/${String(movie.id)}`} className="block">
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-200">
            {movie.poster_path ? (
                <div className="relative aspect-[2/3]">
                    <Image
                        src={`${TMDB_IMAGE_BASE_URL}${movie.poster_path}`}
                        alt={movie.title || 'Movie poster'}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                </div>
            ) : (
                <div className="aspect-[2/3] bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-400">No Image Available</span>
                </div>
            )}
            <div className="p-4">
                <h3 className="text-white font-medium line-clamp-1">{movie.title || 'Untitled'}</h3>
                <p className="text-gray-400 text-sm mt-1">
                    {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                </p>
            </div>
        </div>
    </Link>
);
