import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface MovieCardProps {
  id: number;
  title: string;
  posterPath?: string | null;
  voteAverage?: number;
}

const MovieCard: React.FC<MovieCardProps> = ({ 
  id, 
  title, 
  posterPath, 
  voteAverage 
}) => {
  // Use local placeholder if no poster is available or if external image fails
  const imageSrc = posterPath 
    ? `https://image.tmdb.org/t/p/w500${posterPath}` 
    : '/placeholder-poster.png';

  return (
    <div className="group relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:scale-105">
      <Link href={`/movie/${id}`}>
        <div className="aspect-[2/3] w-full bg-gray-800">
          <div className="relative h-full w-full">
            <Image
              src={imageSrc}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              priority={false}
              onError={(e) => {
                // Fallback to local placeholder if external image fails
                const target = e.target as HTMLImageElement;
                target.onerror = null; // Prevent infinite loop
                target.src = '/placeholder-poster.png';
              }}
            />
          </div>
          {/* Always visible title overlay for better UI */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent">
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <h3 className="text-lg font-bold line-clamp-2">{title}</h3>
              {voteAverage !== undefined && (
                <div className="mt-1 flex items-center">
                  <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="ml-1 text-sm">{voteAverage.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;
