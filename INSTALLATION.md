# Installation Guide for MovieAI

This guide provides detailed step-by-step instructions to install and run the MovieAI recommendation app on your system.

## System Requirements

- **Operating System**: Windows, macOS, or Linux
- **Node.js**: Version 16.0.0 or higher
- **RAM**: Minimum 4GB (8GB recommended)
- **Disk Space**: At least 1GB of free space

## Installation Steps

### 1. Install Node.js and npm

If you don't have Node.js installed, download and install it from [nodejs.org](https://nodejs.org/).

Verify your installation:
```bash
node -v
npm -v
```

### 2. Clone or Download the Repository

#### Option A: Clone using Git
```bash
git clone https://github.com/yourusername/movie-recommendation-app.git
cd movie-recommendation-app
```

#### Option B: Download as ZIP
- Download the ZIP file of this repository
- Extract it to your desired location
- Open a terminal and navigate to the extracted folder

### 3. Install Dependencies

Run the following command in the project directory:
```bash
npm install
```

This will install all required dependencies including:
- Next.js
- React
- Tailwind CSS
- Other required packages

### 4. Configure the Database

The app uses a SQLite-compatible database through Cloudflare D1. To set it up:

1. Install Wrangler CLI globally:
   ```bash
   npm install -g wrangler
   ```

2. Initialize the database with sample data:
   ```bash
   npx wrangler d1 execute DB --local --file=migrations/0001_initial.sql
   ```

### 5. Start the Application

#### Development Mode
```bash
npm run dev
```
This will start the application in development mode with hot-reloading at `http://localhost:3000`.

#### Production Mode
```bash
npm run build
npm run start
```
This will build the application for production and start the server at `http://localhost:3000`.

## Troubleshooting

### Port Conflicts
If port 3000 is already in use, you can specify a different port:
```bash
npm run dev -- -p 3001
# or for production
npm run start -- -p 3001
```

### Database Connection Issues
If you encounter database connection issues:
1. Check that the database configuration in `wrangler.toml` is correct
2. Try resetting the local database:
   ```bash
   rm -rf .wrangler/state/v3
   npx wrangler d1 execute DB --local --file=migrations/0001_initial.sql
   ```

### Build Errors
If you encounter build errors:
1. Make sure all dependencies are installed:
   ```bash
   npm install
   ```
2. Clear the Next.js cache:
   ```bash
   rm -rf .next
   npm run build
   ```

## Accessing the Application

Once the application is running:

1. Open your web browser
2. Navigate to `http://localhost:3000` (or the port you specified)
3. You should see the MovieAI homepage with movie recommendations

## Using the Application

### Default User
For demonstration purposes, the application uses a default user (ID: 1). In a production environment, you would implement proper user authentication.

### Rating Movies
Click on a movie to view its details, then use the star rating system to rate it. Your ratings will influence future recommendations.

### Viewing Recommendations
The homepage displays personalized recommendations based on your ratings and watch history. You can also view recommendations on your profile page.

## Deployment Options

For deploying to a production environment, see the deployment section in the README.md file.
