// app/movie/[id]/page.js
'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';

const MovieDetails = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await fetch(`/api/movie/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch movie details');
                }
                const data = await response.json();
                setMovie(data.movie);
            } catch (err) {
                console.error("Error fetching movie details:", err);
                setError(err.message || "Failed to fetch movie details");
            } finally {
                setLoading(false);
            }
        };

        fetchMovieDetails();
    }, [id]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!movie) {
        return <p>No movie found</p>;
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/3">
                    <Image
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        width={300}
                        height={450}
                        className="rounded-lg"
                    />
                </div>
                <div className="w-full md:w-2/3">
                    <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
                    <p className="text-gray-300 mb-4">{movie.overview}</p>
                    <div className="flex items-center mb-4">
                        <span className="bg-yellow-500 text-black font-bold py-1 px-2 rounded-md text-sm">
                            {movie.vote_average.toFixed(1)}
                        </span>
                        <span className="ml-2 text-sm text-gray-400">
                            ({movie.vote_count} votes)
                        </span>
                    </div>
                    <div className="text-sm text-gray-400">
                        <p>Release Date: {movie.release_date}</p>
                        <p>Runtime: {movie.runtime} minutes</p>
                        <p>Genres: {movie.genres?.map(genre => genre.name).join(', ')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetails;