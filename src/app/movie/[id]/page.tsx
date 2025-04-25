import { getMovieById, getMovieGenres } from '@/lib/db';
import { createRecommender } from '@/lib/recommender';
import Layout from '@/components/Layout';
import MovieRow from '@/components/MovieRow';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function MovieDetail({ params }: { params: { id: string } }) {
  const movieId = parseInt(params.id);
  const movie = await getMovieById(movieId);
  
  if (!movie) {
    return (
      <Layout>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">Movie not found</h1>
            <p className="mt-4 text-gray-400">The movie you're looking for doesn't exist.</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  // Get movie genres
  const genres = await getMovieGenres(movieId);
  
  // Get similar movies using content-based filtering
  const recommender = await createRecommender('content');
  // For demo purposes, we'll use user ID 1
  // In a real app, this would use the authenticated user's ID
  const userId = 1;
  const similarMovies = await recommender.getRecommendationsForUser(userId, 10);
  
  // Format movie details
  const backdropUrl = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` 
    : '/placeholder-backdrop.jpg';
  
  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
    : '/placeholder-poster.jpg';
  
  return (
    <Layout>
      <div className="pb-16">
        {/* Movie backdrop */}
        <div className="relative h-[50vh] w-full">
          <div className="absolute inset-0">
            <Image
              src={backdropUrl}
              alt={movie.title}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
          </div>
        </div>
        
        {/* Movie details */}
        <div className="mx-auto max-w-7xl px-4">
          <div className="relative -mt-32 flex flex-col md:flex-row md:space-x-8">
            {/* Movie poster */}
            <div className="w-64 flex-none">
              <div className="aspect-[2/3] overflow-hidden rounded-lg shadow-xl">
                <Image
                  src={posterUrl}
                  alt={movie.title}
                  width={256}
                  height={384}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            
            {/* Movie info */}
            <div className="mt-6 md:mt-0">
              <h1 className="text-3xl font-bold text-white md:text-4xl">{movie.title}</h1>
              
              {/* Movie metadata */}
              <div className="mt-2 flex flex-wrap items-center text-sm text-gray-400">
                <span>{new Date(movie.release_date).getFullYear()}</span>
                {movie.runtime && (
                  <>
                    <span className="mx-2">•</span>
                    <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
                  </>
                )}
                <span className="mx-2">•</span>
                <div className="flex items-center">
                  <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="ml-1">{movie.vote_average.toFixed(1)}</span>
                </div>
              </div>
              
              {/* Genres */}
              <div className="mt-4 flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <span 
                    key={genre.id}
                    className="rounded-full bg-gray-800 px-3 py-1 text-xs font-medium text-gray-300"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
              
              {/* Overview */}
              <p className="mt-6 text-gray-300">{movie.overview}</p>
              
              {/* Action buttons */}
              <div className="mt-8 flex space-x-4">
                <button className="flex items-center rounded-md bg-red-600 px-6 py-2 font-semibold text-white transition hover:bg-red-700">
                  <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Watch Now
                </button>
                <button className="flex items-center rounded-md bg-gray-700 px-6 py-2 font-semibold text-white transition hover:bg-gray-600">
                  <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add to My List
                </button>
              </div>
            </div>
          </div>
          
          {/* Similar movies */}
          <div className="mt-16">
            <MovieRow title="Similar Movies" movies={similarMovies} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
