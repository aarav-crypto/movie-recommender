// Enhanced mock database implementation with sample data
const getCloudflareContext = () => {
  // Sample movie data
  const sampleMovies = [
    {
      id: 1,
      title: "The Matrix",
      overview: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
      poster_path: null, // Will use our placeholder
      backdrop_path: null, // Will use our placeholder
      release_date: "1999-03-31",
      popularity: 100.0,
      vote_average: 8.7,
      vote_count: 24000,
      runtime: 136,
      created_at: "2023-01-01T00:00:00Z"
    },
    {
      id: 2,
      title: "Inception",
      overview: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
      poster_path: null,
      backdrop_path: null,
      release_date: "2010-07-16",
      popularity: 95.0,
      vote_average: 8.4,
      vote_count: 22000,
      runtime: 148,
      created_at: "2023-01-01T00:00:00Z"
    },
    {
      id: 3,
      title: "The Shawshank Redemption",
      overview: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
      poster_path: null,
      backdrop_path: null,
      release_date: "1994-09-23",
      popularity: 90.0,
      vote_average: 8.7,
      vote_count: 21000,
      runtime: 142,
      created_at: "2023-01-01T00:00:00Z"
    },
    {
      id: 4,
      title: "The Dark Knight",
      overview: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
      poster_path: null,
      backdrop_path: null,
      release_date: "2008-07-18",
      popularity: 88.0,
      vote_average: 8.5,
      vote_count: 25000,
      runtime: 152,
      created_at: "2023-01-01T00:00:00Z"
    },
    {
      id: 5,
      title: "Pulp Fiction",
      overview: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
      poster_path: null,
      backdrop_path: null,
      release_date: "1994-10-14",
      popularity: 85.0,
      vote_average: 8.5,
      vote_count: 20000,
      runtime: 154,
      created_at: "2023-01-01T00:00:00Z"
    }
  ];

  // Sample genres
  const sampleGenres = [
    { id: 1, name: "Action" },
    { id: 2, name: "Drama" },
    { id: 3, name: "Sci-Fi" },
    { id: 4, name: "Thriller" },
    { id: 5, name: "Crime" }
  ];

  // Sample movie-genre relationships
  const sampleMovieGenres = [
    { movie_id: 1, genre_id: 1 }, // Matrix - Action
    { movie_id: 1, genre_id: 3 }, // Matrix - Sci-Fi
    { movie_id: 2, genre_id: 1 }, // Inception - Action
    { movie_id: 2, genre_id: 3 }, // Inception - Sci-Fi
    { movie_id: 2, genre_id: 4 }, // Inception - Thriller
    { movie_id: 3, genre_id: 2 }, // Shawshank - Drama
    { movie_id: 4, genre_id: 1 }, // Dark Knight - Action
    { movie_id: 4, genre_id: 2 }, // Dark Knight - Drama
    { movie_id: 4, genre_id: 4 }, // Dark Knight - Thriller
    { movie_id: 5, genre_id: 2 }, // Pulp Fiction - Drama
    { movie_id: 5, genre_id: 5 }  // Pulp Fiction - Crime
  ];

  // Sample user
  const sampleUsers = [
    { 
      id: 1, 
      username: "moviefan", 
      email: "user@example.com", 
      created_at: "2023-01-01T00:00:00Z",
      last_login: "2023-04-01T00:00:00Z"
    }
  ];

  // Sample ratings
  const sampleRatings = [
    { id: 1, user_id: 1, movie_id: 1, rating: 5, created_at: "2023-01-15T00:00:00Z" },
    { id: 2, user_id: 1, movie_id: 2, rating: 4, created_at: "2023-01-20T00:00:00Z" },
    { id: 3, user_id: 1, movie_id: 3, rating: 5, created_at: "2023-02-01T00:00:00Z" }
  ];

  // Sample watch history
  const sampleWatchHistory = [
    { id: 1, user_id: 1, movie_id: 1, watched_at: "2023-01-10T00:00:00Z", watch_duration: 136, completed: true },
    { id: 2, user_id: 1, movie_id: 2, watched_at: "2023-01-17T00:00:00Z", watch_duration: 148, completed: true },
    { id: 3, user_id: 1, movie_id: 3, watched_at: "2023-01-25T00:00:00Z", watch_duration: 142, completed: true }
  ];

  return {
    env: {
      DB: {
        prepare: (query: string) => {
          return {
            bind: (...params: any[]) => {
              return {
                all: async () => {
                  console.log(`Executing query: ${query} with params:`, params);
                  
                  // Handle different query types with our sample data
                  if (query.includes("SELECT * FROM movies")) {
                    if (query.includes("WHERE id = ?")) {
                      const movieId = params[0];
                      const movie = sampleMovies.find(m => m.id === movieId);
                      return { results: movie ? [movie] : [] };
                    }
                    // For movie list query
                    return { results: sampleMovies };
                  }
                  
                  if (query.includes("SELECT * FROM genres")) {
                    return { results: sampleGenres };
                  }
                  
                  if (query.includes("JOIN movie_genres") && query.includes("WHERE mg.genre_id = ?")) {
                    const genreId = params[0];
                    const movieIds = sampleMovieGenres
                      .filter(mg => mg.genre_id === genreId)
                      .map(mg => mg.movie_id);
                    const movies = sampleMovies.filter(m => movieIds.includes(m.id));
                    return { results: movies };
                  }
                  
                  if (query.includes("JOIN movie_genres") && query.includes("WHERE mg.movie_id = ?")) {
                    const movieId = params[0];
                    const genreIds = sampleMovieGenres
                      .filter(mg => mg.movie_id === movieId)
                      .map(mg => mg.genre_id);
                    const genres = sampleGenres.filter(g => genreIds.includes(g.id));
                    return { results: genres };
                  }
                  
                  if (query.includes("SELECT * FROM users")) {
                    const userId = params[0];
                    const user = sampleUsers.find(u => u.id === userId);
                    return { results: user ? [user] : [] };
                  }
                  
                  if (query.includes("SELECT * FROM ratings")) {
                    const userId = params[0];
                    const ratings = sampleRatings.filter(r => r.user_id === userId);
                    return { results: ratings };
                  }
                  
                  if (query.includes("SELECT * FROM watch_history")) {
                    const userId = params[0];
                    const history = sampleWatchHistory.filter(h => h.user_id === userId);
                    return { results: history };
                  }
                  
                  if (query.includes("SELECT * FROM recommendations")) {
                    // For simplicity, return empty results for recommendations
                    // In a real app, these would be generated by the recommendation engine
                    return { results: [] };
                  }
                  
                  // Default empty response for unhandled queries
                  return { results: [] };
                },
                run: async () => {
                  console.log(`Running query: ${query} with params:`, params);
                  return { meta: { last_row_id: 1 } };
                }
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
  recommendation_type: "content_based" | "collaborative" | "hybrid";
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
    "SELECT * FROM movies ORDER BY popularity DESC LIMIT ? OFFSET ?"
  ).bind(limit, offset).all();
  
  return results as Movie[];
}

export async function getMovieById(id: number): Promise<Movie | null> {
  const { env } = getCloudflareContext();
  const db = env.DB;
  
  const { results } = await db.prepare(
    "SELECT * FROM movies WHERE id = ?"
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
  
  // Fixed: Added .bind() before .all()
  const { results } = await db.prepare("SELECT * FROM genres ORDER BY name").bind().all();
  
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
    "SELECT id, username, email, created_at, last_login FROM users WHERE id = ?"
  ).bind(id).all();
  
  return results.length > 0 ? results[0] as User : null;
}

export async function getUserByUsername(username: string): Promise<User | null> {
  const { env } = getCloudflareContext();
  const db = env.DB;
  
  const { results } = await db.prepare(
    "SELECT id, username, email, created_at, last_login FROM users WHERE username = ?"
  ).bind(username).all();
  
  return results.length > 0 ? results[0] as User : null;
}

export async function getUserRatings(userId: number): Promise<Rating[]> {
  const { env } = getCloudflareContext();
  const db = env.DB;
  
  const { results } = await db.prepare(
    "SELECT * FROM ratings WHERE user_id = ? ORDER BY created_at DESC"
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
  type: "content_based" | "collaborative" | "hybrid" | "all" = "all",
  limit = 20, 
  offset = 0
): Promise<Recommendation[]> {
  const { env } = getCloudflareContext();
  const db = env.DB;
  
  let query = `
    SELECT * FROM recommendations 
    WHERE user_id = ?
  `;
  
  if (type !== "all") {
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
    "SELECT id FROM ratings WHERE user_id = ? AND movie_id = ?"
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
  recommendationType: "content_based" | "collaborative" | "hybrid"
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
