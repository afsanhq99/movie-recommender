'use client';
import { Suspense } from 'react';
import { SearchResultsContent } from '@/app/components/SearchResultsContent';

export default function MovieResults() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
                    <div className="text-center text-xl">Loading...</div>
                </div>
            }
        >
            <SearchResultsContent />
        </Suspense>
    );
}