import { getCloudflareContext } from '@cloudflare/next/dist/framework';
import { searchMovies } from '@/lib/db';
import Layout from '@/components/Layout';
import MovieCard from '@/components/MovieCard';

export const dynamic = 'force-dynamic';

export default async function Search({ searchParams }: { searchParams: { q: string } }) {
  const query = searchParams.q || '';
  
  // Search movies based on query
  const results = query ? await searchMovies(query, 50, 0) : [];
  
  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 pt-24 pb-16">
        <h1 className="mb-8 text-3xl font-bold text-white">
          {query ? `Search results for "${query}"` : 'Search Movies'}
        </h1>
        
        {query && results.length === 0 && (
          <div className="rounded-lg bg-gray-800 p-8 text-center">
            <h2 className="text-xl font-semibold text-white">No results found</h2>
            <p className="mt-2 text-gray-400">
              We couldn't find any movies matching "{query}". Try a different search term.
            </p>
          </div>
        )}
        
        {results.length > 0 && (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {results.map((movie) => (
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
        )}
      </div>
    </Layout>
  );
}
