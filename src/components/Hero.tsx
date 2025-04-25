import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface HeroProps {
  movie: {
    id: number;
    title: string;
    overview: string;
    backdrop_path?: string | null;
  };
}

const Hero: React.FC<HeroProps> = ({ movie }) => {
  const backdropUrl = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` 
    : '/placeholder-backdrop.jpg';

  return (
    <div className="relative h-[70vh] w-full">
      <div className="absolute inset-0">
        <Image
          src={backdropUrl}
          alt={movie.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-8 text-white md:w-2/3 lg:p-16">
        <h1 className="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl">{movie.title}</h1>
        <p className="mb-6 line-clamp-3 text-lg text-gray-200">{movie.overview}</p>
        <div className="flex space-x-4">
          <Link 
            href={`/movie/${movie.id}`}
            className="flex items-center rounded-md bg-red-600 px-6 py-2 font-semibold text-white transition hover:bg-red-700"
          >
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Watch Now
          </Link>
          <button 
            className="flex items-center rounded-md bg-gray-700 px-6 py-2 font-semibold text-white transition hover:bg-gray-600"
          >
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            My List
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
