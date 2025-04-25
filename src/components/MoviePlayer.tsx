import { useState, useEffect } from 'react';
import RatingStars from './RatingStars';
import { addToWatchHistory } from '@/lib/db';

interface MoviePlayerProps {
  movieId: number;
  userId?: number;
  title: string;
  posterPath?: string | null;
}

export default function MoviePlayer({
  movieId,
  userId = 1, // Default to user 1 for demo
  title,
  posterPath
}: MoviePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showRating, setShowRating] = useState(false);
  const [completed, setCompleted] = useState(false);
  
  // Simulate video playback
  useEffect(() => {
    if (!isPlaying) return;
    
    let interval: NodeJS.Timeout;
    let watchDuration = 0;
    
    // Record start of watch session
    const recordWatchStart = async () => {
      try {
        await fetch('/api/watch-history', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            movieId,
            watchDuration: 0,
            completed: false
          }),
        });
      } catch (error) {
        console.error('Error recording watch start:', error);
      }
    };
    
    recordWatchStart();
    
    // Update progress every second
    interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 0.5; // Increase by 0.5% each second for demo
        watchDuration += 1;
        
        // When reaching 100%, mark as completed and show rating prompt
        if (newProgress >= 100) {
          setIsPlaying(false);
          setCompleted(true);
          setShowRating(true);
          
          // Record completion
          const recordCompletion = async () => {
            try {
              await fetch('/api/watch-history', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  userId,
                  movieId,
                  watchDuration,
                  completed: true
                }),
              });
            } catch (error) {
              console.error('Error recording completion:', error);
            }
          };
          
          recordCompletion();
          
          return 100;
        }
        
        return newProgress;
      });
    }, 1000);
    
    return () => {
      clearInterval(interval);
      
      // Record watch duration on unmount if not completed
      if (!completed) {
        const recordWatchDuration = async () => {
          try {
            await fetch('/api/watch-history', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                userId,
                movieId,
                watchDuration,
                completed: false
              }),
            });
          } catch (error) {
            console.error('Error recording watch duration:', error);
          }
        };
        
        recordWatchDuration();
      }
    };
  }, [isPlaying, movieId, userId, completed]);
  
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  const imageSrc = posterPath 
    ? `https://image.tmdb.org/t/p/w500${posterPath}` 
    : '/placeholder-poster.jpg';
  
  return (
    <div className="rounded-lg bg-black shadow-xl">
      <div className="relative aspect-video overflow-hidden rounded-t-lg bg-gray-900">
        {/* Video placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img 
            src={imageSrc} 
            alt={title}
            className="h-full w-full object-cover opacity-50"
          />
          
          {/* Play/Pause button */}
          <button
            onClick={handlePlayPause}
            className="absolute flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-white transition hover:bg-red-700"
          >
            {isPlaying ? (
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </button>
          
          {/* Video title overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <h3 className="text-lg font-bold text-white">{title}</h3>
            {isPlaying && (
              <p className="text-sm text-gray-300">Now playing...</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="h-1 w-full bg-gray-800">
        <div 
          className="h-full bg-red-600 transition-all duration-1000"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      {/* Controls */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={handlePlayPause}
            className="flex items-center rounded-md bg-red-600 px-4 py-2 font-medium text-white transition hover:bg-red-700"
          >
            {isPlaying ? (
              <>
                <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Pause
              </>
            ) : (
              <>
                <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {completed ? 'Watch Again' : 'Play'}
              </>
            )}
          </button>
          
          <span className="text-sm text-gray-400">
            {Math.floor(progress / 100 * 120)}:00 / 2:00:00
          </span>
        </div>
        
        {/* Rating section */}
        {(showRating || completed) && (
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-white">Rate:</span>
            <RatingStars movieId={movieId} userId={userId} />
          </div>
        )}
      </div>
    </div>
  );
}
