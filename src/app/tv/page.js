"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const TvShowList = () => {
    const [tvShows, setTvShows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState('popularity.desc');
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchTvShows = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/discover/tv?sort_by=${sortBy}&page=${page}`);
                if (!response.ok) {
                    const message = await response.text();
                    throw new Error(`Failed to fetch tv shows ${response.status} ${message}`);
                }
                const data = await response.json();
                setTvShows(data.results || []);
            } catch (err) {
                console.error('Error fetching tv shows:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTvShows();
    }, [sortBy, page]);

    const handleSortChange = (event) => {
        setSortBy(event.target.value);
        setPage(1);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1) {
            setPage(newPage);
        }
    };

    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSearchSubmit = () => {
        if (searchQuery.trim()) {
            router.push(`/tv/search?query=${searchQuery}`);
        }
    };

    const TvShowSkeleton = () => (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-center h-8 bg-gray-800 rounded-md animate-pulse w-2/3 sm:w-1/2 md:w-1/3 mx-auto"></h1>
            <div className="flex justify-between items-center mb-4">
                <div className="h-8 bg-gray-800 rounded-md animate-pulse w-1/2 sm:w-1/4"></div>
            </div>
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


    if (loading) return <TvShowSkeleton />;
    if (error) return <div className="flex justify-center items-center min-h-screen text-red-500">Error: {error}</div>;

    return (
        <div className="container mx-auto p-4">
            <Link href="/" className="inline-block bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md mb-4">
                ← Back to Movies
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center">Discover TV Shows</h1>


            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2 sm:gap-0">
                <div className="flex items-center gap-2 mb-2 sm:mb-0">
                    <label htmlFor="sort" className="font-medium text-gray-200">Sort By:</label>
                    <select
                        id="sort"
                        value={sortBy}
                        onChange={handleSortChange}
                        className="bg-gray-700 text-white rounded px-2 py-1 text-sm"
                    >
                        <option value="popularity.desc">Popularity</option>
                        <option value="vote_average.desc">Rating</option>
                        <option value="first_air_date.desc">Release Date (Newest First)</option>
                        <option value="first_air_date.asc">Release Date (Oldest First)</option>
                    </select>
                </div>

                {/* Search Input and Button */}
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Search TV Shows..."
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                        className="bg-gray-700 text-white rounded px-2 py-1 text-sm focus:outline-none w-full sm:w-auto"
                    />
                    <button
                        onClick={handleSearchSubmit}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-1 px-2 rounded-md"
                    >
                        Search
                    </button>
                </div>
            </div>


            {/* TV Show List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {tvShows.map((tvShow) => (
                    <div key={tvShow.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-200">
                        <Link href={`/tv/${tvShow.id}`} className="block">
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
                        </Link>
                    </div>
                ))}
            </div>
            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-8">
                <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className={`bg-gray-700 text-white rounded px-4 py-2 text-sm ${page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600 transition'}`}
                >
                    Previous
                </button>
                <span className='text-gray-300 font-medium'>{page}</span>
                <button
                    onClick={() => handlePageChange(page + 1)}
                    className="bg-gray-700 text-white rounded px-4 py-2 text-sm hover:bg-gray-600 transition"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default TvShowList;