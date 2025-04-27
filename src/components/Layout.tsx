import React from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <main>{children}</main>
      {/* Footer Section - Simplified to remove potentially broken links */}
      <footer className="mt-16 border-t border-gray-800 py-8">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div>
              <h3 className="text-lg font-semibold text-white">MovieAI</h3>
              <p className="mt-2 text-sm text-gray-400">
                Your personalized movie recommendation platform powered by AI and machine learning.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase text-gray-400">Navigation</h4>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="/" className="text-sm text-gray-300 hover:text-white">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/search" className="text-sm text-gray-300 hover:text-white">
                    Search
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase text-gray-400">Account</h4>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="/profile" className="text-sm text-gray-300 hover:text-white">
                    Profile
                  </a>
                </li>
                {/* Removed Settings link */}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase text-gray-400">Legal</h4>
              <ul className="mt-4 space-y-2">
                {/* Removed Privacy and Terms links */}
                <li>
                  <span className="text-sm text-gray-500">Privacy Policy (TBD)</span>
                </li>
                <li>
                  <span className="text-sm text-gray-500">Terms of Service (TBD)</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-8 text-center">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} MovieAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

