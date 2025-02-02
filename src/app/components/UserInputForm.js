"use client";
import { useState } from "react";

export default function UserInputForm({ setRecommendations }) {
    const [userDescription, setUserDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); // For handling errors
    const [success, setSuccess] = useState(false); // For success message
    const [warning, setWarning] = useState(null); // For content moderation warning

    const sensitiveWords = [
        "sex", "porn"
        // Add more sensitive words here
    ];

    const containsSensitiveWords = (input) => {
        return sensitiveWords.some(word => input.toLowerCase().includes(word));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!userDescription) {
            setError("Please provide a description.");
            return;
        }

        // Check if the user description contains sensitive words
        if (containsSensitiveWords(userDescription)) {
            setWarning("Your input contains inappropriate content. Please refrain from using offensive language.");
            setLoading(false); // Reset loading state
            return;
        }

        setLoading(true);
        setError(null); // Reset any previous error
        setSuccess(false); // Reset success message
        setWarning(null); // Reset warning message

        try {
            const response = await fetch("/api/recommend", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userDescription }),
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch recommendations. Status: ${response.status}`);
            }

            const data = await response.json();
            if (!data.movies || data.movies.length === 0) {
                throw new Error("No movies found for the given preferences.");
            }

            setRecommendations(data.movies);
            setSuccess(true); // Show success message
        } catch (err) {
            console.error("Error during fetch:", err);
            setError(err.message || "An error occurred while fetching recommendations. Please try again later.");
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg p-6 bg-white/10 backdrop-blur-lg rounded-2xl shadow-md text-white"
        >
            <textarea
                value={userDescription}
                onChange={(e) => setUserDescription(e.target.value)}
                placeholder="Describe your mood, preferences, or favorite genres..."
                rows={4}
                className="w-full p-3 rounded-lg bg-gray-900/60 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <button
                type="submit"
                className="mt-4 w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg transition-all shadow-lg hover:shadow-xl"
                disabled={loading} // Disable button during loading
            >
                {loading ? "Loading..." : "🎬 Get Recommendations"}
            </button>

            {error && (
                <div className="mt-4 text-red-500">
                    <p>{error}</p>
                </div>
            )}

            {warning && (
                <div className="mt-4 text-yellow-500">
                    <p>{warning}</p>
                </div>
            )}

            {success && (
                <div className="mt-4 text-green-500">
                    <p>Recommendations fetched successfully!</p>
                </div>
            )}
        </form>
    );
}
