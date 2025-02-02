'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const MovieCarousel = () => {
    const [movies, setMovies] = useState({
        trending: [],
        topRated: [],
        nowPlaying: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 🔹 Fix: Use separate refs for each category (No nested .current)
    const containerRefs = {
        trending: useRef(null),
        topRated: useRef(null),
        nowPlaying: useRef(null),
    };

    const router = useRouter();

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const [trendingRes, topRatedRes, nowPlayingRes] = await Promise.all([
                    fetch('/api/popular'),
                    fetch('/api/top-rated'),
                    fetch('/api/now-playing'),
                ]);

                if (!trendingRes.ok || !topRatedRes.ok || !nowPlayingRes.ok) {
                    const errorMessages = await Promise.all([
                        trendingRes.ok ? null : trendingRes.text(),
                        topRatedRes.ok ? null : topRatedRes.text(),
                        nowPlayingRes.ok ? null : nowPlayingRes.text(),
                    ]);
                    throw new Error(`Failed to fetch data: ${errorMessages.filter(Boolean).join(', ')}`);
                }

                const [trendingData, topRatedData, nowPlayingData] = await Promise.all([
                    trendingRes.json(),
                    topRatedRes.json(),
                    nowPlayingRes.json(),
                ]);

                setMovies({
                    trending: trendingData.movies || [],
                    topRated: topRatedData.movies || [],
                    nowPlaying: nowPlayingData.movies || [],
                });

            } catch (err) {
                console.error("Error fetching movies:", err);
                setError(err.message || "Failed to fetch movies");
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    // 🔹 Fix: Ensure event listeners use `.current` properly
    useEffect(() => {
        const handleWheelScroll = (event, category) => {
            const container = containerRefs[category]?.current;
            if (container && event.deltaY !== 0) {
                event.preventDefault();
                container.scrollLeft += event.deltaY;
            }
        };

        for (const category in containerRefs) {
            const container = containerRefs[category]?.current;
            if (container) {
                container.addEventListener('wheel', (event) => handleWheelScroll(event, category), { passive: false });
            }
        }

        return () => {
            for (const category in containerRefs) {
                const container = containerRefs[category]?.current;
                if (container) {
                    container.removeEventListener('wheel', (event) => handleWheelScroll(event, category));
                }
            }
        };
    }, [movies]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            for (const category in movies) {
                if (movies[category].length > 0 && containerRefs[category]?.current) {
                    const container = containerRefs[category].current;
                    const firstChild = container.firstChild;

                    if (firstChild) {
                        container.scrollBy({
                            left: firstChild.offsetWidth + 16,
                            behavior: 'smooth',
                        });
                    } else {
                        clearInterval(intervalId);
                    }
                }
            }
        }, 2000);

        return () => clearInterval(intervalId);
    }, [movies]);

    const handleMovieClick = (movieId) => {
        router.push(`/movie/${movieId}`);
    };

    // 🔹 Loading Skeleton Component
    const LoadingSkeleton = () => (
        <div className="container mx-auto">
            {['Trending Movies', 'Top Rated Movies', 'Now Playing Movies'].map((title, index) => (
                <section key={index} className="p-4 mb-8">
                    <div className="h-8 bg-gray-800 rounded-md animate-pulse w-1/4 mb-4"></div>
                    <div className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide">
                        {[...Array(5)].map((_, index) => (
                            <div key={index} className="w-40 min-w-[160px] bg-gray-800 p-2 rounded animate-pulse">
                                <div className="aspect-[2/3] bg-gray-900 rounded mb-2"></div>
                                <div className="h-4 bg-gray-900 rounded-md"></div>
                            </div>
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );

    // 🔹 Error Message Component
    const ErrorMessage = () => (
        <div className="flex justify-center items-center min-h-screen text-red-500">
            Error: {error}
        </div>
    );

    if (loading) {
        return <LoadingSkeleton />;
    }

    if (error) {
        return <ErrorMessage />;
    }

    const renderCarousel = (title, movieList, category) => {
        if (!movieList || movieList.length === 0) {
            return null;
        }

        return (
            <section className="p-4 mb-8">
                <h3 className="text-2xl font-semibold mb-4">{title}</h3>
                <div
                    className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide"
                    ref={containerRefs[category]} // 🔹 Fixed ref assignment
                >
                    {movieList.map((movie) => (
                        <div key={movie.id} className="w-40 min-w-[160px] relative bg-gray-800 p-2 rounded hover:scale-105 transition">
                            {movie.poster_url && (
                                <div className="relative">
                                    <Image
                                        src={movie.poster_url}
                                        alt={movie.title}
                                        width={200}
                                        height={300}
                                        className="h-48 w-full object-cover rounded"
                                    />
                                    <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs py-1 px-2 rounded">
                                        {category}
                                    </div>
                                    <div className="absolute bottom-2 right-2 bg-yellow-500 text-black font-bold py-0.5 px-1 rounded-md shadow-sm flex items-center text-xs">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 mr-0.5">
                                            <path fillRule="evenodd" d="M10 3.717l2.236 6.707a.75.75 0 01-.692.956l-2.032.677-.988 2.964a.75.75 0 01-1.448 0l-.988-2.965-2.032-.677a.75.75 0 01-.692-.956L10 3.717z" clipRule="evenodd" />
                                        </svg>
                                        {movie.vote_average.toFixed(1)}
                                    </div>
                                </div>
                            )}
                            <p className="mt-2 text-center text-sm font-medium line-clamp-1">{movie.title}</p>
                            <button onClick={() => handleMovieClick(movie.id)} className="absolute top-0 left-0 w-full h-full opacity-0 hover:opacity-100 bg-black bg-opacity-50">
                                <span className="sr-only">View details</span>
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        );
    };

    return (
        <div className="container mx-auto">
            {renderCarousel("Trending Movies", movies.trending, "trending")}
            {renderCarousel("Top Rated Movies", movies.topRated, "topRated")}
            {renderCarousel("Now Playing Movies", movies.nowPlaying, "nowPlaying")}
        </div>
    );
};

export default MovieCarousel;
