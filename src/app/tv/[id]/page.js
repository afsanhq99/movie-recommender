"use client";
import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export default function TvDetails({ params }) {
    const { id } = use(params);
    const [tvShow, setTvShow] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTvDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/tv/${id}`);
                if (!response.ok) {
                    const message = await response.text()
                    throw new Error(`Failed to fetch tv show details ${response.status} ${message}`);
                }

                const data = await response.json();
                setTvShow(data);
            } catch (err) {
                console.error('Error fetching tv show details:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTvDetails();
    }, [id]);


    const TvDetailsSkeleton = () => {
        return (
            <div className="min-h-screen bg-gray-900">
                <div className="relative h-[50vh] w-full bg-gray-800 animate-pulse">

                </div>
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row gap-8 -mt-32 relative">
                        {/* Poster Skeleton */}
                        <div className="w-full md:w-1/3 lg:w-1/4">
                            <div className="rounded-lg overflow-hidden shadow-lg bg-gray-800 aspect-[2/3] animate-pulse" >
                            </div>
                        </div>
                        {/* TV Show Info Skeleton */}
                        <div className="w-full md:w-2/3 lg:w-3/4 text-white flex flex-col gap-4">
                            <div className='h-8 bg-gray-800 rounded-md animate-pulse w-1/2'></div>
                            <div className='flex gap-4'>
                                <div className='h-6 bg-gray-800 rounded-md animate-pulse w-1/4'></div>
                                <div className='h-6 bg-gray-800 rounded-md animate-pulse w-1/4'></div>
                            </div>
                            <div className="h-24 bg-gray-800 rounded-md animate-pulse"></div>

                            {/* Cast Skeleton */}
                            <div className="space-y-2">
                                <div className="h-6 bg-gray-800 rounded-md animate-pulse w-1/4"></div>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {[...Array(8)].map((_, index) => (
                                        <div key={index} className='text-sm'>
                                            <div className="aspect-[2/3] bg-gray-800 rounded-md overflow-hidden animate-pulse mb-2">

                                            </div>
                                            <div className="h-4 bg-gray-800 rounded-md animate-pulse"></div>
                                            <div className="h-4 bg-gray-800 rounded-md animate-pulse"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }



    if (loading) return <TvDetailsSkeleton />;
    if (error) return <div className="flex justify-center items-center min-h-screen text-red-500">Error: {error}</div>;
    if (!tvShow) return null;

    const voteAverage = tvShow.vote_average ? tvShow.vote_average.toFixed(1) : 'N/A';

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Backdrop Image */}
            <div className="relative h-[50vh] w-full">
                {tvShow.backdrop_path && (
                    <Image
                        src={`${TMDB_IMAGE_BASE_URL}/w1280${tvShow.backdrop_path}`}
                        alt={tvShow.name}
                        fill
                        sizes="100vw"
                        className="object-cover brightness-50"
                        priority
                        quality={80}
                    />
                )}
                <Link
                    href="/tv"
                    className="absolute top-4 left-4 bg-black/50 text-white px-4 py-2 rounded-lg hover:bg-black/70"
                >
                    ← Back
                </Link>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-8 -mt-32 relative">
                    {/* Poster */}
                    <div className="w-full md:w-1/3 lg:w-1/4">
                        <div className="rounded-lg overflow-hidden shadow-lg">
                            {tvShow.poster_path ? (
                                <Image
                                    src={`${TMDB_IMAGE_BASE_URL}/w500${tvShow.poster_path}`}
                                    alt={tvShow.name}
                                    width={500}
                                    height={750}
                                    className="w-full h-auto"
                                    priority
                                    quality={80}
                                />
                            ) : (
                                <div className="bg-gray-800 aspect-[2/3] flex items-center justify-center">
                                    <span className="text-gray-400">No Image Available</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* TV Show Info */}
                    <div className="w-full md:w-2/3 lg:w-3/4 text-white">
                        <h2 className="text-3xl font-bold mb-4">{tvShow.name}</h2>
                        <div className="mb-4">
                            <span className="text-gray-400 mr-2">
                                Rating:
                                <span className="text-white font-medium ml-1">{voteAverage}</span>
                            </span>
                            {tvShow.first_air_date && (
                                <span className="text-gray-400">
                                    Release: <span className='text-white font-medium'>{new Date(tvShow.first_air_date).toLocaleDateString()}</span>
                                </span>
                            )}
                        </div>
                        <p className="text-gray-300 mb-6">{tvShow.overview}</p>

                        {/* Cast */}
                        {tvShow.credits?.cast?.length > 0 && (
                            <>
                                <h3 className="text-xl font-semibold mb-2">Cast</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {tvShow.credits.cast.slice(0, 8).map((actor) => (
                                        <div key={actor.id} className="text-sm">
                                            <div className="aspect-[2/3] relative rounded-lg overflow-hidden mb-2">
                                                {actor.profile_path ? (
                                                    <Image
                                                        src={`${TMDB_IMAGE_BASE_URL}/w185${actor.profile_path}`}
                                                        alt={actor.name}
                                                        fill
                                                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                                        className="object-cover"
                                                        quality={80}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                                        <span className="text-gray-400">No Image</span>
                                                    </div>
                                                )}
                                            </div>
                                            <p className="font-medium">{actor.name}</p>
                                            <p className="text-gray-400">{actor.character}</p>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}