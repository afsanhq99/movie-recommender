'use client';
import Navbar from './Navbar';
import MovieCarousel from './MovieCarousel';
import Discover from './Discover';
import GenreList from './GenreList';

const HomePage = () => {


    return (
        <div>

            <Navbar />
            <GenreList />

            <MovieCarousel />

            <Discover />
        </div>
    );
};

export default HomePage;
