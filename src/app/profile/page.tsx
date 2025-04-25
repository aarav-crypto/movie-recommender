import { getUserById, getUserRatings, getUserWatchHistory, getUserRecommendations } from '@/lib/db';
import { getMovieById } from '@/lib/db';
import Layout from '@/components/Layout';
import MovieCard from '@/components/MovieCard';

export const dynamic = 'force-dynamic';

export default async function Profile() {
  // For demo purposes, we'll use user ID 1
  // In a real app, this would use the authenticated user's ID
  const userId = 1;
  
  // Get user data
  const user = await getUserById(userId);
  
  if (!user) {
    return (
      <Layout>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">User not found</h1>
            <p className="mt-4 text-gray-400">The user profile you're looking for doesn't exist.</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  // Get user ratings
  const ratings = await getUserRatings(userId);
  
  // Get watch history
  const watchHistory = await getUserWatchHistory(userId, 10);
  
  // Get personalized recommendations
  const recommendations = await getUserRecommendations(userId, 'all', 10);
  
  // Fetch full movie details for rated movies
  const ratedMovies = [];
  for (const rating of ratings.slice(0, 10)) { // Limit to 10 for performance
    const movie = await getMovieById(rating.movie_id);
    if (movie) {
      ratedMovies.push({
        ...movie,
        user_rating: rating.rating
      });
    }
  }
  
  // Fetch full movie details for watch history
  const watchedMovies = [];
  for (const history of watchHistory) {
    const movie = await getMovieById(history.movie_id);
    if (movie) {
      watchedMovies.push({
        ...movie,
        watched_at: history.watched_at,
        completed: history.completed
      });
    }
  }
  
  // Fetch full movie details for recommendations
  const recommendedMovies = [];
  for (const rec of recommendations) {
    const movie = await getMovieById(rec.movie_id);
    if (movie) {
      recommendedMovies.push({
        ...movie,
        score: rec.score,
        recommendation_type: rec.recommendation_type
      });
    }
  }
  
  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 pt-24 pb-16">
        <div className="mb-12 flex items-center space-x-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-600 text-white">
            <span className="text-3xl font-bold">{user.username.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{user.username}</h1>
            <p className="text-gray-400">Member since {new Date(user.created_at).toLocaleDateString()}</p>
          </div>
        </div>
        
        {/* Personalized recommendations */}
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-white">Your Recommendations</h2>
          {recommendedMovies.length > 0 ? (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {recommendedMovies.map((movie) => (
                <div key={movie.id}>
                  <MovieCard
                    id={movie.id}
                    title={movie.title}
                    posterPath={movie.poster_path}
                    voteAverage={movie.vote_average}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No recommendations yet. Start rating movies to get personalized suggestions!</p>
          )}
        </div>
        
        {/* Rated movies */}
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-white">Movies You've Rated</h2>
          {ratedMovies.length > 0 ? (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {ratedMovies.map((movie) => (
                <div key={movie.id} className="relative">
                  <MovieCard
                    id={movie.id}
                    title={movie.title}
                    posterPath={movie.poster_path}
                    voteAverage={movie.vote_average}
                  />
                  <div className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white">
                    <span className="text-sm font-bold">{movie.user_rating}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">You haven't rated any movies yet.</p>
          )}
        </div>
        
        {/* Watch history */}
        <div>
          <h2 className="mb-6 text-2xl font-bold text-white">Recently Watched</h2>
          {watchedMovies.length > 0 ? (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {watchedMovies.map((movie) => (
                <div key={movie.id} className="relative">
                  <MovieCard
                    id={movie.id}
                    title={movie.title}
                    posterPath={movie.poster_path}
                    voteAverage={movie.vote_average}
                  />
                  {movie.completed && (
                    <div className="absolute bottom-2 right-2 rounded-full bg-green-600 p-1">
                      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">You haven't watched any movies yet.</p>
          )}
        </div>
      </div>
    </Layout>
  );
}
