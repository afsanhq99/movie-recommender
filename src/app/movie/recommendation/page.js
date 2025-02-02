"use client";
import { useState, useEffect, useMemo } from "react";
import UserInputForm from "@/app/components/UserInputForm";
import MovieCard from "@/app/components/MovieCard";
import { motion } from "framer-motion";
import { useRouter } from 'next/navigation';


export default function Recommendation() {
    const router = useRouter();

    const [recommendations, setRecommendations] = useState([]);
    const [filteredRecommendations, setFilteredRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filtering, setFiltering] = useState(false);
    const [error, setError] = useState(null);

    const [voteFilter, setVoteFilter] = useState([0, 10]);
    const [releaseFilter, setReleaseFilter] = useState([1900, new Date().getFullYear()]);
    const [filtersVisible, setFiltersVisible] = useState(false);

    useEffect(() => {
        const storedRecommendations = localStorage.getItem('recommendations');
        const storedVoteFilter = localStorage.getItem('voteFilter');
        const storedReleaseFilter = localStorage.getItem('releaseFilter');

        if (storedRecommendations) {
            const loadedRecommendations = JSON.parse(storedRecommendations);
            setRecommendations(loadedRecommendations);
            setFiltersVisible(true);
            if (storedVoteFilter || storedReleaseFilter) {
                setFilteredRecommendations(filterMovies(loadedRecommendations)); // Apply filter on load
            } else {
                setFilteredRecommendations(loadedRecommendations);
            }
        }
        if (storedVoteFilter) {
            setVoteFilter(JSON.parse(storedVoteFilter));
        }
        if (storedReleaseFilter) {
            setReleaseFilter(JSON.parse(storedReleaseFilter));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('recommendations', JSON.stringify(recommendations));
    }, [recommendations]);

    useEffect(() => {
        localStorage.setItem('voteFilter', JSON.stringify(voteFilter));
    }, [voteFilter]);

    useEffect(() => {
        localStorage.setItem('releaseFilter', JSON.stringify(releaseFilter));
    }, [releaseFilter]);

    const filterMovies = (movies) => {
        setFiltering(true);
        try {
            return movies.filter((movie) => {
                const isVoteInRange = movie.vote_average >= voteFilter[0] && movie.vote_average <= voteFilter[1];
                const isReleaseInRange = movie.release_date && parseInt(movie.release_date.split("-")[0]) >= releaseFilter[0] && parseInt(movie.release_date.split("-")[0]) <= releaseFilter[1];
                return isVoteInRange && isReleaseInRange;
            });
        } finally {
            setFiltering(false);
        }
    };

    const handleRecommendations = (movies) => {
        setRecommendations(movies);
        setFilteredRecommendations(movies);
        setFiltersVisible(true);
    };

    // Memoize the filtering process to avoid unnecessary recalculations
    const filteredMovies = useMemo(() => {
        return filterMovies(recommendations);
    }, [recommendations, voteFilter, releaseFilter]);

    return (

        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center p-6 text-white">

            <button
                onClick={() => router.push("/")}
                className="mb-6 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-md transition"
            >
                ⬅ Back to Home
            </button>
            <motion.h1
                className="text-4xl font-bold mb-6 text-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                🎬 Movie Recommender
            </motion.h1>

            <UserInputForm
                setRecommendations={handleRecommendations}
                setLoading={setLoading}
                setError={setError}
            />

            <div className="mt-10 w-full max-w-4xl">
                <motion.h2
                    className="text-2xl font-semibold mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                >
                    🔥 Recommendations:
                </motion.h2>

                {error && (
                    <div className="bg-red-500 text-white p-4 rounded-lg mb-4 w-full text-center">
                        <strong>Error:</strong> {error}
                    </div>
                )}

                {loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <motion.div
                                key={index}
                                className="bg-gray-700 rounded-2xl p-6 h-80 animate-pulse"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.1 }}
                            >
                                <div className="w-full h-48 bg-gray-600 rounded-lg"></div>
                                <div className="w-3/4 h-6 bg-gray-500 rounded mt-4"></div>
                                <div className="w-1/2 h-4 bg-gray-500 rounded mt-2"></div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {filtersVisible && (
                    <motion.div
                        className="mt-10 space-y-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                    >
                        <div className="flex items-center gap-2">
                            <label htmlFor="vote" className="text-base shrink-0 w-16">Vote:</label>
                            <input
                                type="range"
                                id="vote"
                                min="0"
                                max="10"
                                step="0.1"
                                value={voteFilter[1]}
                                onChange={(e) => setVoteFilter([voteFilter[0], parseFloat(e.target.value)])}
                                className="w-24"
                            />
                            <span className="text-xs text-gray-400 w-16 text-right">
                                {voteFilter[0]} - {voteFilter[1]}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <label htmlFor="release" className="text-base shrink-0 w-16">Year:</label>
                            <input
                                type="range"
                                id="release"
                                min={1900}
                                max={new Date().getFullYear()}
                                step="1"
                                value={releaseFilter[1]}
                                onChange={(e) => setReleaseFilter([releaseFilter[0], parseInt(e.target.value)])}
                                className="w-24"
                            />
                            <span className="text-xs text-gray-400 w-16 text-right">
                                {releaseFilter[0]} - {releaseFilter[1]}
                            </span>
                        </div>
                    </motion.div>
                )}

                {filtering && <p>Filtering movies...</p>} {/* Display filtering message */}

                {!loading && filteredMovies.length > 0 && (
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        {filteredMovies.map((movie) => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
