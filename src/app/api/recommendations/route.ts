import { createRecommender } from '@/lib/recommender';
import { getUserById, getMovieById, rateMovie, addToWatchHistory } from '@/lib/db';

// API route handler for getting personalized recommendations
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = parseInt(url.searchParams.get('userId') || '1');
    const type = url.searchParams.get('type') as 'content' | 'collaborative' | 'hybrid' || 'hybrid';
    const limit = parseInt(url.searchParams.get('limit') || '10');
    
    // Validate user exists
    const user = await getUserById(userId);
    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Initialize the appropriate recommender
    const recommender = await createRecommender(type);
    
    // Get recommendations
    const recommendations = await recommender.getRecommendationsForUser(userId, limit);
    
    return Response.json({ recommendations });
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return Response.json({ error: 'Failed to get recommendations' }, { status: 500 });
  }
}

// API route handler for rating a movie
export async function POST(request: Request) {
  try {
    const { userId, movieId, rating } = await request.json();
    
    // Validate inputs
    if (!userId || !movieId || rating === undefined) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Validate user exists
    const user = await getUserById(userId);
    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Validate movie exists
    const movie = await getMovieById(movieId);
    if (!movie) {
      return Response.json({ error: 'Movie not found' }, { status: 404 });
    }
    
    // Save rating
    await rateMovie(userId, movieId, rating);
    
    // Return success
    return Response.json({ success: true });
  } catch (error) {
    console.error('Error rating movie:', error);
    return Response.json({ error: 'Failed to rate movie' }, { status: 500 });
  }
}
