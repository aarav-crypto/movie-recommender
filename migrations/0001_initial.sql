-- Migration number: 0001 	 2025-01-16T13:42:41.031Z
-- Drop existing tables if they exist
DROP TABLE IF EXISTS movies;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS ratings;
DROP TABLE IF EXISTS genres;
DROP TABLE IF EXISTS movie_genres;
DROP TABLE IF EXISTS user_preferences;
DROP TABLE IF EXISTS recommendations;
DROP TABLE IF EXISTS watch_history;

-- Create movies table
CREATE TABLE IF NOT EXISTS movies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  overview TEXT,
  poster_path TEXT,
  backdrop_path TEXT,
  release_date TEXT,
  popularity REAL DEFAULT 0,
  vote_average REAL DEFAULT 0,
  vote_count INTEGER DEFAULT 0,
  runtime INTEGER,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME
);

-- Create ratings table
CREATE TABLE IF NOT EXISTS ratings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  movie_id INTEGER NOT NULL,
  rating REAL NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (movie_id) REFERENCES movies(id)
);

-- Create genres table
CREATE TABLE IF NOT EXISTS genres (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL
);

-- Create movie_genres junction table
CREATE TABLE IF NOT EXISTS movie_genres (
  movie_id INTEGER NOT NULL,
  genre_id INTEGER NOT NULL,
  PRIMARY KEY (movie_id, genre_id),
  FOREIGN KEY (movie_id) REFERENCES movies(id),
  FOREIGN KEY (genre_id) REFERENCES genres(id)
);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  genre_id INTEGER NOT NULL,
  preference_weight REAL DEFAULT 1.0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (genre_id) REFERENCES genres(id)
);

-- Create recommendations table
CREATE TABLE IF NOT EXISTS recommendations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  movie_id INTEGER NOT NULL,
  score REAL NOT NULL,
  recommendation_type TEXT NOT NULL, -- 'content_based', 'collaborative', 'hybrid'
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (movie_id) REFERENCES movies(id)
);

-- Create watch_history table
CREATE TABLE IF NOT EXISTS watch_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  movie_id INTEGER NOT NULL,
  watched_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  watch_duration INTEGER, -- in seconds
  completed BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (movie_id) REFERENCES movies(id)
);

-- Insert initial genres
INSERT INTO genres (name) VALUES 
  ('Action'),
  ('Adventure'),
  ('Animation'),
  ('Comedy'),
  ('Crime'),
  ('Documentary'),
  ('Drama'),
  ('Family'),
  ('Fantasy'),
  ('History'),
  ('Horror'),
  ('Music'),
  ('Mystery'),
  ('Romance'),
  ('Science Fiction'),
  ('TV Movie'),
  ('Thriller'),
  ('War'),
  ('Western');

-- Insert sample movies
INSERT INTO movies (title, overview, release_date, popularity, vote_average, vote_count) VALUES 
  ('The Shawshank Redemption', 'Framed in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison, where he puts his accounting skills to work for an amoral warden.', '1994-09-23', 85.5, 8.7, 21000),
  ('The Godfather', 'Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family.', '1972-03-14', 80.3, 8.7, 16500),
  ('The Dark Knight', 'Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets.', '2008-07-16', 90.1, 8.5, 27000),
  ('Pulp Fiction', 'A burger-loving hit man, his philosophical partner, a drug-addled gangster''s moll and a washed-up boxer converge in this sprawling, comedic crime caper.', '1994-10-14', 78.9, 8.5, 22500),
  ('Inception', 'Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible.', '2010-07-15', 88.2, 8.3, 31000);

-- Connect movies with genres
INSERT INTO movie_genres (movie_id, genre_id) VALUES 
  (1, 7), -- Shawshank: Drama
  (1, 5), -- Shawshank: Crime
  (2, 7), -- Godfather: Drama
  (2, 5), -- Godfather: Crime
  (3, 1), -- Dark Knight: Action
  (3, 5), -- Dark Knight: Crime
  (3, 7), -- Dark Knight: Drama
  (4, 5), -- Pulp Fiction: Crime
  (4, 7), -- Pulp Fiction: Drama
  (5, 1), -- Inception: Action
  (5, 15), -- Inception: Science Fiction
  (5, 13); -- Inception: Mystery

-- Create indexes for performance
CREATE INDEX idx_ratings_user_id ON ratings(user_id);
CREATE INDEX idx_ratings_movie_id ON ratings(movie_id);
CREATE INDEX idx_movie_genres_movie_id ON movie_genres(movie_id);
CREATE INDEX idx_movie_genres_genre_id ON movie_genres(genre_id);
CREATE INDEX idx_recommendations_user_id ON recommendations(user_id);
CREATE INDEX idx_watch_history_user_id ON watch_history(user_id);
CREATE INDEX idx_watch_history_movie_id ON watch_history(movie_id);
