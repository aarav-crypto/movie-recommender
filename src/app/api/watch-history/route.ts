import { addToWatchHistory } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { userId, movieId, watchDuration, completed } = await request.json();
    
    // Validate inputs
    if (!userId || !movieId) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Add to watch history
    await addToWatchHistory(userId, movieId, watchDuration, completed);
    
    // Return success
    return Response.json({ success: true });
  } catch (error) {
    console.error('Error recording watch history:', error);
    return Response.json({ error: 'Failed to record watch history' }, { status: 500 });
  }
}
