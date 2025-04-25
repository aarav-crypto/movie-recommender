import React from 'react';
import MovieCard from './MovieCard';

interface MovieRowProps {
  title: string;
  movies: Array<{
    id: number;
    title: string;
    poster_path?: string | null;
    vote_average?: number;
  }>;
}

const MovieRow: React.FC<MovieRowProps> = ({ title, movies }) => {
  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <div className="my-8">
      <h2 className="mb-4 text-2xl font-bold text-white">{title}</h2>
      <div className="scrollbar-hide -mx-4 flex space-x-4 overflow-x-auto px-4 pb-4">
        {movies.map((movie) => (
          <div key={movie.id} className="w-[180px] flex-none">
            <MovieCard
              id={movie.id}
              title={movie.title}
              posterPath={movie.poster_path}
              voteAverage={movie.vote_average}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieRow;
