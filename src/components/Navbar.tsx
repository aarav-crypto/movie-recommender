import React from 'react';
import Link from 'next/link';

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 z-50 w-full bg-gradient-to-b from-black/80 to-transparent px-4 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold text-red-600">
            MovieAI
          </Link>
          <div className="ml-8 hidden space-x-6 md:flex">
            <Link href="/" className="text-sm font-medium text-white hover:text-gray-300">
              Home
            </Link>
            <Link href="/movies" className="text-sm font-medium text-white hover:text-gray-300">
              Movies
            </Link>
            <Link href="/my-list" className="text-sm font-medium text-white hover:text-gray-300">
              My List
            </Link>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search movies..."
              className="w-32 rounded-full bg-gray-800 px-4 py-1 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 md:w-64"
            />
            <svg
              className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <Link href="/profile" className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white">
            <span className="text-sm font-bold">U</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
