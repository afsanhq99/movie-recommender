"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function MovieCard({ movie, isLoading }) {
    if (isLoading) return <MovieCardSkeleton />;

    if (!movie) return null;

    const cardVariants = {
        initial: { opacity: 0, y: 30, scale: 0.95 },
        animate: { opacity: 1, y: 0, scale: 1 },
        whileHover: {
            scale: 1.07,
            boxShadow: "0px 10px 30px rgba(255, 255, 255, 0.15)",
        },
    };

    return (
        <motion.div
            className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg transition-all transform"
            variants={cardVariants}
            initial="initial"
            animate="animate"
            whileHover="whileHover"
            transition={{ duration: 0.5, ease: "easeInOut", type: "spring", stiffness: 100, damping: 10 }} // Smoother transition
        >
            <div className="relative w-full h-72 rounded-lg overflow-hidden">
                <Image
                    src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "/placeholder-image.jpg"}
                    alt={movie.title || "Movie Poster"}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                />
            </div>

            <motion.h3
                className="text-xl font-semibold mt-4 text-white"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }} // Smoother transition
            >
                {movie.title}
            </motion.h3>

            <motion.div
                className="mt-2 text-gray-300 text-sm space-y-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }} // Smoother transition
            >
                <p>
                    <span className="font-semibold text-white">Release Date:</span>{" "}
                    {movie.release_date || "N/A"}
                </p>
                <p className="line-clamp-3">
                    <span className="font-semibold text-white">Overview:</span>{" "}
                    {movie.overview || "No overview available."}
                </p>
                <p>
                    <span className="font-semibold text-white">Vote Average:</span>{" "}
                    <span className={`font-bold ${movie.vote_average >= 7 ? "text-green-400" : "text-yellow-400"}`}>
                        {movie.vote_average || "N/A"}
                    </span>
                </p>
            </motion.div>
        </motion.div>
    );
}


function MovieCardSkeleton() {
    return (
        <div
            className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg transition-all transform animate-pulse"
        >
            <div className="relative w-full h-72 rounded-lg overflow-hidden bg-gray-800" >

            </div>
            <div className="mt-4 space-y-2">
                <div className='h-6 bg-gray-800 rounded-md '></div>
                <div className='h-4 bg-gray-800 rounded-md '></div>
                <div className='h-4 bg-gray-800 rounded-md '></div>
                <div className='h-4 bg-gray-800 rounded-md '></div>

            </div>
        </div>
    )
}