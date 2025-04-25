// Mock Cloudflare context for local development
const getCloudflareContext = () => {
  return {
    env: {
      DB: {
        prepare: (query: string) => {
          return {
            bind: (...params: any[]) => {
              return {
                all: async () => ({ results: [] }),
                run: async () => ({ meta: { last_row_id: 1 } })
              };
            }
          };
        }
      }
    }
  };
};

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  popularity: number;
  vote_average: number;
  vote_count: number;
  runtime: number | null;
  created_at: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
  last_login: string | null;
}

export interface Rating {
  id: number;
  user_id: number;
  movie_id: number;
  rating: number;
  created_at: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface MovieGenre {
  movie_id: number;
  genre_id: number;
}

export interface UserPreference {
  id: number;
  user_id: number;
  genre_id: number;
  preference_weight: number;
  created_at: string;
}

export interface Recommendation {
  id: number;
  user_id: number;
  movie_id: number;
  score: number;
  recommendation_type: 'content_based' | 'collaborative' | 'hybrid';
  created_at: string;
}

export interface WatchHistory {
  id: number;
  user_id: number;
  movie_id: number;
  watched_at: string;
  watch_duration: number | null;
  completed: boolean;
}

// Database access functions
export async function getMovies(limit = 20, offset = 0): Promise<Movie[]> {
  const { env } = getCloudflareContext();
  const db = env.DB;
  
  const { results } = await db.prepare(
    'SELECT * FROM movies ORDER BY popularity DESC LIMIT ? OFFSET ?'
  ).bind(limit, offset).all();
  
  return results as Movie[];
}

export async function getMovieById(id: number): Promise<Movie | null> {
  const { env } = getCloudflareContext();
  const db = env.DB;
  
  const { results } = await db.prepare(
    'SELECT * FROM movies WHERE id = ?'
  ).bind(id).all();
  
  return results.length > 0 ? results[0] as Movie : null;
}

export async function getMoviesByGenre(genreId: number, limit = 20, offset = 0): Promise<Movie[]> {
  const { env } = getCloudflareContext();
  const db = env.DB;
  
  const { results } = await db.prepare(`
    SELECT m.* FROM movies m
    JOIN movie_genres mg ON m.id = mg.movie_id
    WHERE mg.genre_id = ?
    ORDER BY m.popularity DESC
    LIMIT ? OFFSET ?
  `).bind(genreId, limit, offset).all();
  
  return results as Movie[];
}

export async function getGenres(): Promise<Genre[]> {
  const { env } = getCloudflareContext();
  const db = env.DB;
  
  const { results } = await db.prepare('SELECT * FROM genres ORDER BY name').all();
  
  return results as Genre[];
}

export async function getMovieGenres(movieId: number): Promise<Genre[]> {
  const { env } = getCloudflareContext();
  const db = env.DB;
  
  const { results } = await db.prepare(`
    SELECT g.* FROM genres g
    JOIN movie_genres mg ON g.id = mg.genre_id
    WHERE mg.movie_id = ?
    ORDER BY g.name
  `).bind(movieId).all();
  
  return results as Genre[];
}

export async function getUserById(id: number): Promise<User | null> {
  const { env } = getCloudflareContext();
  const db = env.DB;
  
  const { results } = await db.prepare(
    'SELECT id, username, email, created_at, last_login FROM users WHERE id = ?'
  ).bind(id).all();
  
  return results.length > 0 ? results[0] as User : null;
}

export async function getUserByUsername(username: string): Promise<User | null> {
  const { env } = getCloudflareContext();
  const db = env.DB;
  
  const { results } = await db.prepare(
    'SELECT id, username, email, created_at, last_login FROM users WHERE username = ?'
  ).bind(username).all();
  
  return results.length > 0 ? results[0] as User : null;
}

export async function getUserRatings(userId: number): Promise<Rating[]> {
  const { env } = getCloudflareContext();
  const db = env.DB;
  
  const { results } = await db.prepare(
    'SELECT * FROM ratings WHERE user_id = ? ORDER BY created_at DESC'
  ).bind(userId).all();
  
  return results as Rating[];
}

export async function getUserWatchHistory(userId: number, limit = 20, offset = 0): Promise<WatchHistory[]> {
  const { env } = getCloudflareContext();
  const db = env.DB;
  
  const { results } = await db.prepare(`
    SELECT * FROM watch_history 
    WHERE user_id = ? 
    ORDER BY watched_at DESC
    LIMIT ? OFFSET ?
  `).bind(userId, limit, offset).all();
  
  return results as WatchHistory[];
}

export async function getUserRecommendations(
  userId: number, 
  type: 'content_based' | 'collaborative' | 'hybrid' | 'all' = 'all',
  limit = 20, 
  offset = 0
): Promise<Recommendation[]> {
  const { env } = getCloudflareContext();
  const db = env.DB;
  
  let query = `
    SELECT * FROM recommendations 
    WHERE user_id = ?
  `;
  
  if (type !== 'all') {
    query += ` AND recommendation_type = ?`;
    query += ` ORDER BY score DESC LIMIT ? OFFSET ?`;
    
    const { results } = await db.prepare(query).bind(userId, type, limit, offset).all();
    return results as Recommendation[];
  } else {
    query += ` ORDER BY score DESC LIMIT ? OFFSET ?`;
    
    const { results } = await db.prepare(query).bind(userId, limit, offset).all();
    return results as Recommendation[];
  }
}

export async function createUser(username: string, email: string, passwordHash: string): Promise<number> {
  const { env } = getCloudflareContext();
  const db = env.DB;
  
  const result = await db.prepare(`
    INSERT INTO users (username, email, password_hash)
    VALUES (?, ?, ?)
  `).bind(username, email, passwordHash).run();
  
  return result.meta.last_row_id as number;
}

export async function rateMovie(userId: number, movieId: number, rating: number): Promise<void> {
  const { env } = getCloudflareContext();
  const db = env.DB;
  
  // Check if rating already exists
  const { results } = await db.prepare(
    'SELECT id FROM ratings WHERE user_id = ? AND movie_id = ?'
  ).bind(userId, movieId).all();
  
  if (results.length > 0) {
    // Update existing rating
    await db.prepare(`
      UPDATE ratings SET rating = ? WHERE user_id = ? AND movie_id = ?
    `).bind(rating, userId, movieId).run();
  } else {
    // Create new rating
    await db.prepare(`
      INSERT INTO ratings (user_id, movie_id, rating)
      VALUES (?, ?, ?)
    `).bind(userId, movieId, rating).run();
  }
}

export async function addToWatchHistory(
  userId: number, 
  movieId: number, 
  watchDuration: number | null = null,
  completed: boolean = false
): Promise<void> {
  const { env } = getCloudflareContext();
  const db = env.DB;
  
  await db.prepare(`
    INSERT INTO watch_history (user_id, movie_id, watch_duration, completed)
    VALUES (?, ?, ?, ?)
  `).bind(userId, movieId, watchDuration, completed ? 1 : 0).run();
}

export async function saveRecommendation(
  userId: number,
  movieId: number,
  score: number,
  recommendationType: 'content_based' | 'collaborative' | 'hybrid'
): Promise<void> {
  const { env } = getCloudflareContext();
  const db = env.DB;
  
  // Check if recommendation already exists
  const { results } = await db.prepare(`
    SELECT id FROM recommendations 
    WHERE user_id = ? AND movie_id = ? AND recommendation_type = ?
  `).bind(userId, movieId, recommendationType).all();
  
  if (results.length > 0) {
    // Update existing recommendation
    await db.prepare(`
      UPDATE recommendations SET score = ? 
      WHERE user_id = ? AND movie_id = ? AND recommendation_type = ?
    `).bind(score, userId, movieId, recommendationType).run();
  } else {
    // Create new recommendation
    await db.prepare(`
      INSERT INTO recommendations (user_id, movie_id, score, recommendation_type)
      VALUES (?, ?, ?, ?)
    `).bind(userId, movieId, score, recommendationType).run();
  }
}

export async function searchMovies(query: string, limit = 20, offset = 0): Promise<Movie[]> {
  const { env } = getCloudflareContext();
  const db = env.DB;
  
  const searchTerm = `%${query}%`;
  
  const { results } = await db.prepare(`
    SELECT * FROM movies 
    WHERE title LIKE ? OR overview LIKE ?
    ORDER BY popularity DESC
    LIMIT ? OFFSET ?
  `).bind(searchTerm, searchTerm, limit, offset).all();
  
  return results as Movie[];
}
