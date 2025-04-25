import { getMovies, getMovieById, getGenres, getMoviesByGenre } from '@/lib/db';
import { createRecommender } from '@/lib/recommender';
import Hero from '@/components/Hero';
import MovieRow from '@/components/MovieRow';
import Layout from '@/components/Layout';

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Get featured movie for hero section (using the most popular movie)
  const allMovies = await getMovies(20, 0);
  const featuredMovie = allMovies[0];
  
  // Get movies by genres for different rows
  const genres = await getGenres();
  const moviesByGenre = {};
  
  for (const genre of genres.slice(0, 5)) { // Limit to 5 genres for performance
    moviesByGenre[genre.id] = await getMoviesByGenre(genre.id, 10, 0);
  }
  
  // Get personalized recommendations (for demo, we'll use user ID 1)
  // In a real app, this would use the authenticated user's ID
  const userId = 1;
  
  // Initialize the recommendation engine
  const recommender = await createRecommender('hybrid');
  const recommendedMovies = await recommender.getRecommendationsForUser(userId, 10);
  
  return (
    <Layout>
      <div className="pb-8">
        {/* Hero section with featured movie */}
        <Hero movie={featuredMovie} />
        
        {/* Main content with movie rows */}
        <div className="mx-auto max-w-7xl px-4 pt-16">
          {/* Personalized recommendations row */}
          <MovieRow title="Recommended for You" movies={recommendedMovies} />
          
          {/* Popular movies row */}
          <MovieRow title="Popular Movies" movies={allMovies} />
          
          {/* Genre-based rows */}
          {genres.slice(0, 5).map((genre) => (
            <MovieRow 
              key={genre.id} 
              title={genre.name} 
              movies={moviesByGenre[genre.id]} 
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}
