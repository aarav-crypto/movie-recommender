import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = () => {
  return (
    <header className="fixed top-0 z-50 w-full bg-gradient-to-b from-gray-900/80 to-transparent backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-bold text-red-600">MovieAI</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            <li>
              <Link href="/" className="text-sm font-medium text-white hover:text-red-500">
                Home
              </Link>
            </li>
            <li>
              <Link href="/search" className="text-sm font-medium text-white hover:text-red-500">
                Search
              </Link>
            </li>
            <li>
              <Link href="/profile" className="text-sm font-medium text-white hover:text-red-500">
                Profile
              </Link>
            </li>
          </ul>
        </nav>

        {/* Search and User */}
        <div className="flex items-center space-x-4">
          <Link href="/search" className="rounded-full bg-gray-800 p-2 text-gray-400 hover:text-white">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </Link>
          <Link href="/profile" className="flex items-center rounded-full bg-gray-800 p-1">
            <Image
              src="/placeholder-poster.png"
              alt="User"
              width={32}
              height={32}
              className="rounded-full"
            />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
