import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface HeroProps {
  movie: {
    id: number;
    title: string;
    overview: string;
    backdrop_path?: string | null;
  };
}

const Hero: React.FC<HeroProps> = ({ movie }) => {
  // Use local placeholder if no backdrop is available or if external image fails
  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : '/placeholder-backdrop.png';

  return (
    <div className="relative h-[60vh] w-full md:h-[70vh]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={backdropUrl}
          alt={movie.title}
          fill
          priority
          className="object-cover"
          onError={(e) => {
            // Fallback to local placeholder if external image fails
            const target = e.target as HTMLImageElement;
            target.onerror = null; // Prevent infinite loop
            target.src = '/placeholder-backdrop.png';
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full items-end px-4 pb-12 md:px-8 md:pb-20">
        <div className="max-w-xl">
          <h1 className="text-3xl font-bold text-white md:text-5xl lg:text-6xl">
            {movie.title}
          </h1>
          <p className="mt-4 text-sm text-gray-300 line-clamp-3 md:text-lg">
            {movie.overview}
          </p>
          <div className="mt-6 flex space-x-4">
            <Link href={`/movie/${movie.id}`}>
              <button className="flex items-center rounded-md bg-red-600 px-6 py-2 font-semibold text-white transition hover:bg-red-700">
                <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                More Info
              </button>
            </Link>
            <button className="flex items-center rounded-md bg-gray-700/70 px-6 py-2 font-semibold text-white backdrop-blur-sm transition hover:bg-gray-600/80">
              <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add to My List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

