"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const TvSearchResults = () => {
    const [tvShows, setTvShows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const searchParams = useSearchParams();
    const router = useRouter();

    const query = searchParams.get('query');
    const [page, setPage] = useState(1);

    useEffect(() => {
        const fetchTvShows = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/search/tv?query=${encodeURIComponent(query)}&page=${page}`);
                if (!response.ok) {
                    const message = await response.text();
                    throw new Error(`Failed to fetch tv shows ${response.status} ${message}`);
                }
                const data = await response.json();
                setTvShows(data.results || []);
            } catch (err) {
                console.error('Error fetching search results:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        if (query) {
            fetchTvShows();
        } else {
            setLoading(false);
            setTvShows([]);
        }
    }, [query, page]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1) {
            // Use router.push for navigation and update the query params
            const newParams = new URLSearchParams(searchParams);
            newParams.set('page', newPage.toString());
            router.push(`/tv/search?${newParams.toString()}`)
            setPage(newPage);
        }
    };

    const TvSearchSkeleton = () => (
        <div className="container mx-auto p-4">
            <div className="text-3xl font-bold mb-8 text-center h-8 bg-gray-800 rounded-md animate-pulse w-2/3 sm:w-1/2 md:w-1/3 mx-auto"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, index) => (
                    <div key={index} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg animate-pulse">
                        <div className="aspect-[2/3] bg-gray-900"></div>
                        <div className="p-4">
                            <div className="h-4 bg-gray-900 rounded-md mb-2"></div>
                            <div className="h-4 bg-gray-900 rounded-md w-1/2"></div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-center items-center gap-2 mt-8">
                <div className="h-10 bg-gray-800 rounded-md animate-pulse w-1/6 sm:w-1/12"></div>
                <div className="h-10 bg-gray-800 rounded-md animate-pulse w-1/6 sm:w-1/12"></div>
            </div>
        </div>
    );


    if (loading) return <TvSearchSkeleton />;
    if (error) return <div className="flex justify-center items-center min-h-screen text-red-500">Error: {error}</div>;

    if (!tvShows || tvShows.length === 0) {
        return <div className="flex justify-center items-center min-h-screen text-gray-300">
            {query ? `No results found for "${query}"` : "Please search a tv show"}
        </div>
    }


    return (
        <div className="container mx-auto p-4">
            <div className="mb-8">
                <Link href="/tv" className="inline-block bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md">
                    ← Back to TV Shows
                </Link>
            </div>
            <h1 className="text-3xl font-bold mb-8 text-center">Search Results for "{query}"</h1>

            {/* TV Show List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {tvShows.map((tvShow) => (
                    <div key={tvShow.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-200">
                        {tvShow.poster_path ? (
                            <div className="relative aspect-[2/3]">
                                <Image
                                    src={`${TMDB_IMAGE_BASE_URL}${tvShow.poster_path}`}
                                    alt={tvShow.name || 'TV Show poster'}
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
                            <h3 className="text-white font-medium line-clamp-1">{tvShow.name || 'Untitled'}</h3>
                            <p className="text-gray-400 text-sm mt-1">
                                {tvShow.first_air_date ? new Date(tvShow.first_air_date).getFullYear() : 'N/A'}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {tvShows.length > 0 && (
                <div className="flex justify-center items-center mt-8 gap-4">
                    <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page <= 1}
                        className={`bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        Previous
                    </button>
                    <span className="text-white">Page {page}</span>
                    <button
                        onClick={() => handlePageChange(page + 1)}
                        className={`bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md`}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default TvSearchResults;