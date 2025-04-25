import { useState, useEffect } from 'react';
import MovieCard from './MovieCard';

interface RecommendationSectionProps {
  userId?: number;
  type?: 'content' | 'collaborative' | 'hybrid';
  title: string;
  limit?: number;
}

export default function RecommendationSection({
  userId = 1, // Default to user 1 for demo
  type = 'hybrid',
  title,
  limit = 10
}: RecommendationSectionProps) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/recommendations?userId=${userId}&type=${type}&limit=${limit}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch recommendations');
        }
        
        const data = await response.json();
        setMovies(data.recommendations || []);
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        setError('Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecommendations();
  }, [userId, type, limit]);

  if (loading) {
    return (
      <div className="my-8">
        <h2 className="mb-4 text-2xl font-bold text-white">{title}</h2>
        <div className="flex space-x-4 overflow-x-auto">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-[180px] flex-none">
              <div className="aspect-[2/3] animate-pulse rounded-lg bg-gray-700"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-8">
        <h2 className="mb-4 text-2xl font-bold text-white">{title}</h2>
        <div className="rounded-lg bg-gray-800 p-4 text-gray-400">
          {error}
        </div>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="my-8">
        <h2 className="mb-4 text-2xl font-bold text-white">{title}</h2>
        <div className="rounded-lg bg-gray-800 p-4 text-gray-400">
          No recommendations available. Try rating more movies!
        </div>
      </div>
    );
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
}
