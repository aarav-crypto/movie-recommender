import { 
  Movie, 
  Rating, 
  Genre, 
  UserPreference, 
  getMovies, 
  getMovieById, 
  getGenres, 
  getMovieGenres, 
  getUserRatings, 
  getUserWatchHistory,
  saveRecommendation
} from './db';

// Content-based filtering recommendation engine
export class ContentBasedRecommender {
  private movies: Movie[] = [];
  private genres: Genre[] = [];
  private movieGenresMap: Map<number, number[]> = new Map();
  
  constructor() {}
  
  async initialize(): Promise<void> {
    // Load all movies and genres
    this.movies = await getMovies(1000, 0); // Get up to 1000 movies
    this.genres = await getGenres();
    
    // Build movie-genre mapping
    for (const movie of this.movies) {
      const movieGenres = await getMovieGenres(movie.id);
      this.movieGenresMap.set(movie.id, movieGenres.map(g => g.id));
    }
  }
  
  async getRecommendationsForUser(userId: number, limit: number = 10): Promise<Movie[]> {
    // Get user preferences (from ratings and watch history)
    const userRatings = await getUserRatings(userId);
    const watchHistory = await getUserWatchHistory(userId, 100);
    
    // Calculate user genre preferences
    const genrePreferences = this.calculateGenrePreferences(userRatings, watchHistory);
    
    // Calculate similarity scores for all movies
    const movieScores: {movieId: number, score: number}[] = [];
    
    for (const movie of this.movies) {
      // Skip movies the user has already rated or watched
      if (userRatings.some(r => r.movie_id === movie.id) || 
          watchHistory.some(w => w.movie_id === movie.id)) {
        continue;
      }
      
      const score = this.calculateMovieScore(movie, genrePreferences);
      movieScores.push({ movieId: movie.id, score });
      
      // Save recommendation to database
      await saveRecommendation(userId, movie.id, score, 'content_based');
    }
    
    // Sort by score (descending) and take top N
    movieScores.sort((a, b) => b.score - a.score);
    const topMovieIds = movieScores.slice(0, limit).map(m => m.movieId);
    
    // Fetch full movie details
    const recommendedMovies: Movie[] = [];
    for (const movieId of topMovieIds) {
      const movie = await getMovieById(movieId);
      if (movie) recommendedMovies.push(movie);
    }
    
    return recommendedMovies;
  }
  
  private calculateGenrePreferences(
    userRatings: Rating[], 
    watchHistory: any[]
  ): Map<number, number> {
    const genrePreferences = new Map<number, number>();
    
    // Initialize all genres with base weight
    this.genres.forEach(genre => {
      genrePreferences.set(genre.id, 1.0); // Base weight
    });
    
    // Update weights based on ratings
    for (const rating of userRatings) {
      const movieGenres = this.movieGenresMap.get(rating.movie_id) || [];
      const ratingWeight = (rating.rating / 5.0) * 2; // Scale rating to weight
      
      for (const genreId of movieGenres) {
        const currentWeight = genrePreferences.get(genreId) || 1.0;
        genrePreferences.set(genreId, currentWeight + ratingWeight);
      }
    }
    
    // Update weights based on watch history
    for (const history of watchHistory) {
      const movieGenres = this.movieGenresMap.get(history.movie_id) || [];
      const watchWeight = history.completed ? 1.5 : 0.5; // Higher weight for completed movies
      
      for (const genreId of movieGenres) {
        const currentWeight = genrePreferences.get(genreId) || 1.0;
        genrePreferences.set(genreId, currentWeight + watchWeight);
      }
    }
    
    return genrePreferences;
  }
  
  private calculateMovieScore(movie: Movie, genrePreferences: Map<number, number>): number {
    const movieGenres = this.movieGenresMap.get(movie.id) || [];
    let score = 0;
    
    // Sum up genre preference weights
    for (const genreId of movieGenres) {
      score += genrePreferences.get(genreId) || 1.0;
    }
    
    // Normalize by number of genres
    if (movieGenres.length > 0) {
      score /= movieGenres.length;
    }
    
    // Factor in movie popularity and rating
    score *= (0.7 + (0.3 * (movie.vote_average / 10))); // Rating factor
    score *= (0.8 + (0.2 * (movie.popularity / 100))); // Popularity factor
    
    return score;
  }
}

// Collaborative filtering recommendation engine
export class CollaborativeRecommender {
  private userRatingsMap: Map<number, Map<number, number>> = new Map();
  private similarityMatrix: Map<number, Map<number, number>> = new Map();
  
  constructor() {}
  
  async initialize(): Promise<void> {
    // Get all movies (we'll need their IDs)
    const movies = await getMovies(1000, 0);
    
    // For a real system, we would load all users and their ratings
    // For this demo, we'll use a simplified approach with just the sample data
    
    // Build user-ratings map
    for (let i = 1; i <= 10; i++) { // Assuming we have users with IDs 1-10
      try {
        const userRatings = await getUserRatings(i);
        
        if (userRatings.length > 0) {
          const ratingsMap = new Map<number, number>();
          
          for (const rating of userRatings) {
            ratingsMap.set(rating.movie_id, rating.rating);
          }
          
          this.userRatingsMap.set(i, ratingsMap);
        }
      } catch (error) {
        // User might not exist, continue
        continue;
      }
    }
    
    // Calculate user similarity matrix
    this.calculateSimilarityMatrix();
  }
  
  async getRecommendationsForUser(userId: number, limit: number = 10): Promise<Movie[]> {
    const userRatings = await getUserRatings(userId);
    const userRatedMovieIds = new Set(userRatings.map(r => r.movie_id));
    
    // Get similar users
    const similarUsers = this.getSimilarUsers(userId);
    
    // Calculate predicted ratings for unrated movies
    const predictions: {movieId: number, score: number}[] = [];
    const allMovies = await getMovies(1000, 0);
    
    for (const movie of allMovies) {
      // Skip movies the user has already rated
      if (userRatedMovieIds.has(movie.id)) {
        continue;
      }
      
      const predictedRating = this.predictRating(userId, movie.id, similarUsers);
      
      if (predictedRating > 0) {
        predictions.push({ movieId: movie.id, score: predictedRating });
        
        // Save recommendation to database
        await saveRecommendation(userId, movie.id, predictedRating, 'collaborative');
      }
    }
    
    // Sort by predicted rating (descending) and take top N
    predictions.sort((a, b) => b.score - a.score);
    const topMovieIds = predictions.slice(0, limit).map(p => p.movieId);
    
    // Fetch full movie details
    const recommendedMovies: Movie[] = [];
    for (const movieId of topMovieIds) {
      const movie = await getMovieById(movieId);
      if (movie) recommendedMovies.push(movie);
    }
    
    return recommendedMovies;
  }
  
  private calculateSimilarityMatrix(): void {
    const users = Array.from(this.userRatingsMap.keys());
    
    for (let i = 0; i < users.length; i++) {
      const user1 = users[i];
      const similarityMap = new Map<number, number>();
      
      for (let j = 0; j < users.length; j++) {
        if (i === j) continue;
        
        const user2 = users[j];
        const similarity = this.calculateUserSimilarity(user1, user2);
        
        if (similarity > 0) {
          similarityMap.set(user2, similarity);
        }
      }
      
      this.similarityMatrix.set(user1, similarityMap);
    }
  }
  
  private calculateUserSimilarity(user1: number, user2: number): number {
    const ratings1 = this.userRatingsMap.get(user1);
    const ratings2 = this.userRatingsMap.get(user2);
    
    if (!ratings1 || !ratings2) return 0;
    
    // Find common rated movies
    const commonMovies: number[] = [];
    
    for (const movieId of ratings1.keys()) {
      if (ratings2.has(movieId)) {
        commonMovies.push(movieId);
      }
    }
    
    if (commonMovies.length === 0) return 0;
    
    // Calculate Pearson correlation coefficient
    let sum1 = 0, sum2 = 0, sum1Sq = 0, sum2Sq = 0, pSum = 0;
    
    for (const movieId of commonMovies) {
      const rating1 = ratings1.get(movieId) || 0;
      const rating2 = ratings2.get(movieId) || 0;
      
      sum1 += rating1;
      sum2 += rating2;
      sum1Sq += rating1 * rating1;
      sum2Sq += rating2 * rating2;
      pSum += rating1 * rating2;
    }
    
    const n = commonMovies.length;
    const num = pSum - (sum1 * sum2 / n);
    const den = Math.sqrt((sum1Sq - sum1 * sum1 / n) * (sum2Sq - sum2 * sum2 / n));
    
    if (den === 0) return 0;
    
    const similarity = num / den;
    
    // Return positive similarity only (negative means dissimilar tastes)
    return Math.max(0, similarity);
  }
  
  private getSimilarUsers(userId: number): Map<number, number> {
    return this.similarityMatrix.get(userId) || new Map<number, number>();
  }
  
  private predictRating(userId: number, movieId: number, similarUsers: Map<number, number>): number {
    let weightedSum = 0;
    let similaritySum = 0;
    
    for (const [otherUserId, similarity] of similarUsers.entries()) {
      const otherUserRatings = this.userRatingsMap.get(otherUserId);
      
      if (otherUserRatings && otherUserRatings.has(movieId)) {
        const rating = otherUserRatings.get(movieId) || 0;
        weightedSum += similarity * rating;
        similaritySum += similarity;
      }
    }
    
    if (similaritySum === 0) return 0;
    
    return weightedSum / similaritySum;
  }
}

// Hybrid recommendation engine combining both approaches
export class HybridRecommender {
  private contentRecommender: ContentBasedRecommender;
  private collaborativeRecommender: CollaborativeRecommender;
  
  constructor() {
    this.contentRecommender = new ContentBasedRecommender();
    this.collaborativeRecommender = new CollaborativeRecommender();
  }
  
  async initialize(): Promise<void> {
    await Promise.all([
      this.contentRecommender.initialize(),
      this.collaborativeRecommender.initialize()
    ]);
  }
  
  async getRecommendationsForUser(userId: number, limit: number = 10): Promise<Movie[]> {
    // Get recommendations from both systems
    const contentRecs = await this.contentRecommender.getRecommendationsForUser(userId, limit);
    const collaborativeRecs = await this.collaborativeRecommender.getRecommendationsForUser(userId, limit);
    
    // Combine and deduplicate recommendations
    const movieMap = new Map<number, {movie: Movie, score: number}>();
    
    // Add content-based recommendations with weight 0.4
    for (let i = 0; i < contentRecs.length; i++) {
      const movie = contentRecs[i];
      const score = (limit - i) / limit * 0.4; // Higher score for higher ranked movies
      movieMap.set(movie.id, {movie, score});
      
      // Save hybrid recommendation to database
      await saveRecommendation(userId, movie.id, score, 'hybrid');
    }
    
    // Add collaborative recommendations with weight 0.6
    for (let i = 0; i < collaborativeRecs.length; i++) {
      const movie = collaborativeRecs[i];
      const score = (limit - i) / limit * 0.6; // Higher score for higher ranked movies
      
      if (movieMap.has(movie.id)) {
        // Movie already in map, add scores
        const existing = movieMap.get(movie.id)!;
        const newScore = existing.score + score;
        movieMap.set(movie.id, {...existing, score: newScore});
        
        // Update hybrid recommendation in database
        await saveRecommendation(userId, movie.id, newScore, 'hybrid');
      } else {
        movieMap.set(movie.id, {movie, score});
        
        // Save hybrid recommendation to database
        await saveRecommendation(userId, movie.id, score, 'hybrid');
      }
    }
    
    // Sort by score and return top movies
    const sortedMovies = Array.from(movieMap.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.movie);
    
    return sortedMovies;
  }
}

// Factory function to create and initialize the appropriate recommender
export async function createRecommender(type: 'content' | 'collaborative' | 'hybrid' = 'hybrid'): Promise<ContentBasedRecommender | CollaborativeRecommender | HybridRecommender> {
  let recommender: ContentBasedRecommender | CollaborativeRecommender | HybridRecommender;
  
  switch (type) {
    case 'content':
      recommender = new ContentBasedRecommender();
      break;
    case 'collaborative':
      recommender = new CollaborativeRecommender();
      break;
    case 'hybrid':
    default:
      recommender = new HybridRecommender();
      break;
  }
  
  await recommender.initialize();
  return recommender;
}
