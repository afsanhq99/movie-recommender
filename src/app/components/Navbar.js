import Link from 'next/link';
import SearchMovie from './Search';

const Navbar = () => {
    return (
        <nav className="bg-gradient-to-r from-blue-900 via-blue-500 to-blue-300 shadow-lg mb-8">
            <div className="container mx-auto px-6 py-4 flex flex-col items-center">
                {/* Centered Heading */}
                <h1 className="text-white font-extrabold text-4xl tracking-wide drop-shadow-lg mb-4 italic font-serif">
                    Welcome to MoviesHub
                </h1>

                {/* Flexbox container for Button and Search */}
                <div className="w-full flex items-center justify-between px-4">
                    {/* Left Section (Recommendation Button) */}
                    <div>
                        <Link href="/movie/recommendation" passHref legacyBehavior>
                            <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-full shadow-md hover:scale-105 transform transition duration-300">
                                Get Recommendation Using Gemini
                            </button>
                        </Link>
                    </div>

                    {/* Right Section (SearchBar) */}
                    <SearchMovie />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
