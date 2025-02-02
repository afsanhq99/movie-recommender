import Link from 'next/link';
import SearchMovie from './Search';

const Navbar = () => {
    return (
        <nav className="bg-gradient-to-r from-blue-900 via-blue-500 to-blue-300 shadow-lg mb-8">
            <div className="container mx-auto px-4 sm:px-6 py-4 flex flex-col items-center">
                {/* Centered Heading */}
                <h1 className="text-white font-extrabold text-3xl sm:text-4xl tracking-wide drop-shadow-lg mb-4 italic font-serif text-center">
                    Welcome to MoviesHub
                </h1>

                {/* Flexbox container for Button and Search */}
                <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Left Section (Recommendation and TV Show Button) */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4 sm:mb-0">
                        <Link href="/movie/recommendation" passHref legacyBehavior>
                            <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-full shadow-md hover:scale-105 transform transition duration-300">
                                Get Recommendation
                            </button>
                        </Link>
                        <Link href="/tv" passHref legacyBehavior>
                            <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-full shadow-md hover:scale-105 transform transition duration-300">
                                Discover TV Shows
                            </button>
                        </Link>
                    </div>

                    {/* Right Section (SearchBar) */}
                    <div className="w-full sm:w-auto">
                        <SearchMovie />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;