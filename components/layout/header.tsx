'use client';

import Link from 'next/link';
import { Briefcase, Search, Bell, UserCircle } from 'lucide-react';
import { useState } from 'react';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { ThemeToggle } from '@/components/theme-toggle';

export function Header() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search query:', searchQuery);
  };

  return (
    <header 
      className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 fixed w-full top-0 z-50 transition-colors"
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-md p-1 -m-1"
            aria-label="Fail U Forward - Go to homepage"
          >
            <Briefcase className="h-8 w-8 text-red-500" aria-hidden="true" />
            <span className="ml-2 space-x-2 text-xl font-bold dark:text-white">
              Fail U Forward
            </span>
          </Link>
          
          {/* Search */}
          <div className="flex-1 max-w-xl px-4" role="search">
            <form onSubmit={handleSearchSubmit} className="relative">
              <label htmlFor="search-input" className="sr-only">
                Search for failure stories and experiences
              </label>
              <Search 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" 
                aria-hidden="true"
              />
              <input
                id="search-input"
                type="search"
                placeholder="Search failures..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent dark:text-white dark:placeholder-gray-400 transition-colors"
                aria-describedby="search-description"
              />
              <div id="search-description" className="sr-only">
                Search through failure stories, experiences, and user posts
              </div>
            </form>
          </div>

          {/* Right Side Actions */}
          <nav className="flex items-center space-x-4" role="navigation" aria-label="User actions">
            <LanguageSwitcher /> {/* Language dropdown here */}
            <ThemeToggle />
            <button 
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2" 
              aria-label="View notifications"
              type="button"
            >
              <Bell className="h-6 w-6 text-gray-600 dark:text-gray-300" aria-hidden="true" />
            </button>
            <button 
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2" 
              aria-label="Open user profile menu"
              type="button"
            >
              <UserCircle className="h-6 w-6 text-gray-600 dark:text-gray-300" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
