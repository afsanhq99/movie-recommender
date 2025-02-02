"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchMovie() {
    const [query, setQuery] = useState("");
    const router = useRouter();

    const handleSearch = () => {
        if (!query.trim()) return;
        router.push(`/movie/search?query=${query}`);
    };

    return (
        <div className="w-full max-w-md sm:max-w-full p-2 sm:p-0">
            {/* Fixed positioning, adjusted max-w */}
            <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for a movie..."
                        className="w-full text-black px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-blue-900 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-800 transition duration-200 ease-in-out shadow-md"
                    >
                        Search
                    </button>
                </div>
            </div>
        </div>
    );
}