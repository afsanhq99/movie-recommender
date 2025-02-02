// app/api/discover/tv/route.js
import { NextResponse } from 'next/server';

const API_KEY = process.env.TMDB_API_KEY;

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get('sort_by') || 'popularity.desc';
    const page = searchParams.get('page') || 1;


    let url = `https://api.themoviedb.org/3/discover/tv?include_adult=false&include_null_first_air_dates=false&language=en-US&page=${page}&sort_by=${sortBy}&api_key=${API_KEY}`;


    const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format


    if (sortBy === 'first_air_date.asc') {
        url += `&first_air_date.lte=${currentDate}`;
    } else if (sortBy === 'first_air_date.desc') {
        url += `&first_air_date.lte=${currentDate}`;
    }



    try {
        const res = await fetch(url);


        if (!res.ok) {
            const message = await res.text();
            throw new Error(`TMDB API returned an error: ${res.status} ${message}`);
        }


        const data = await res.json();
        return NextResponse.json(data);


    } catch (error) {
        console.error("Error fetching TV shows:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}