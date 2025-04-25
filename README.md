# MovieAI: Smart Movie Recommendation App

A Netflix-like movie recommendation application powered by AI and machine learning. This app provides personalized movie recommendations using content-based filtering, collaborative filtering, and a hybrid approach.

## Features

- **AI-Powered Recommendations**: Get personalized movie suggestions based on your preferences and viewing history
- **Multiple Recommendation Algorithms**:
  - Content-based filtering: Recommends movies similar to what you've liked
  - Collaborative filtering: Recommends movies that similar users have liked
  - Hybrid approach: Combines both methods for better recommendations
- **Movie Database**: Comprehensive movie information with details, ratings, and genres
- **User Profiles**: Track your ratings, watch history, and personalized recommendations
- **Search Functionality**: Find movies by title or description
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API routes, Cloudflare Workers
- **Database**: D1 (SQLite-compatible database for Cloudflare Workers)
- **AI/ML**: Custom recommendation algorithms implemented in TypeScript

## Installation and Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/movie-recommendation-app.git
   cd movie-recommendation-app
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Initialize the database:
   ```bash
   npx wrangler d1 execute DB --local --file=migrations/0001_initial.sql
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Building for Production

1. Build the application:
   ```bash
   npm run build
   # or
   yarn build
   ```

2. Start the production server:
   ```bash
   npm run start
   # or
   yarn start
   ```

## Project Structure

- `migrations/`: Database migration files
- `src/app/`: Next.js pages and API routes
- `src/components/`: Reusable UI components
- `src/lib/`: Utility functions, database access, and recommendation engine

## AI/ML Recommendation Engine

The recommendation engine uses three different approaches:

1. **Content-Based Filtering**: Analyzes movie attributes (genres, actors, directors) and recommends similar movies based on your preferences.

2. **Collaborative Filtering**: Identifies users with similar tastes and recommends movies they enjoyed that you haven't seen yet.

3. **Hybrid Approach**: Combines both methods to provide more accurate and diverse recommendations.

The recommendation engine continuously learns from your interactions (ratings and watch history) to improve future suggestions.

## Database Schema

The application uses a relational database with the following main tables:

- `movies`: Movie information (title, overview, release date, etc.)
- `users`: User profiles and authentication data
- `ratings`: User ratings for movies
- `genres`: Movie genres
- `movie_genres`: Junction table connecting movies and genres
- `user_preferences`: User genre preferences
- `recommendations`: Stored recommendations for users
- `watch_history`: User movie viewing history

## API Endpoints

- `/api/recommendations`: Get personalized movie recommendations
- `/api/watch-history`: Record movie viewing history

## Customization

You can customize the application by:

1. Modifying the recommendation algorithms in `src/lib/recommender.ts`
2. Adding new movie data to the database
3. Customizing the UI components in `src/components/`
4. Adding additional features like user authentication

## Deployment

The application can be deployed to various platforms:

### Cloudflare Pages

1. Install Wrangler CLI:
   ```bash
   npm install -g wrangler
   ```

2. Configure your Cloudflare account:
   ```bash
   wrangler login
   ```

3. Deploy the application:
   ```bash
   npm run deploy
   # or
   yarn deploy
   ```

### Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy the application:
   ```bash
   vercel
   ```

## Troubleshooting

- **Database Connection Issues**: Ensure the database configuration in `wrangler.toml` is correct
- **Build Errors**: Check for missing dependencies or configuration issues
- **Recommendation Engine Not Working**: Verify that you have sufficient user data (ratings and watch history)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Movie data sample is based on popular films
- Recommendation algorithms inspired by research in the field of AI and machine learning
