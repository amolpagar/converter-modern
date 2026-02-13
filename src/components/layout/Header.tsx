'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import {
  Sun,
  Moon,
  Menu,
  X,
  Wrench,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getToolsByCategory } from '@/lib/tools';

const converters = getToolsByCategory('converter');
const formatters = getToolsByCategory('formatter');
const decoders = getToolsByCategory('decoder');

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <span>
              Code<span className="text-brand-500">Mash</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {/* Converters Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('converters')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                Converters <ChevronDown className="w-3 h-3" />
              </button>
              {activeDropdown === 'converters' && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-2 animate-fade-in">
                  {converters.map((tool) => (
                    <Link
                      key={tool.id}
                      href={`/${tool.id}`}
                      className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-brand-50 dark:hover:bg-brand-950 hover:text-brand-600 dark:hover:text-brand-400 rounded-lg transition-colors"
                    >
                      {tool.shortTitle}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Formatters Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('formatters')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                Formatters <ChevronDown className="w-3 h-3" />
              </button>
              {activeDropdown === 'formatters' && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-2 animate-fade-in">
                  {formatters.map((tool) => (
                    <Link
                      key={tool.id}
                      href={`/${tool.id}`}
                      className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-brand-50 dark:hover:bg-brand-950 hover:text-brand-600 dark:hover:text-brand-400 rounded-lg transition-colors"
                    >
                      {tool.shortTitle}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Decoders Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('decoders')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                Decoders <ChevronDown className="w-3 h-3" />
              </button>
              {activeDropdown === 'decoders' && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-2 animate-fade-in">
                  {decoders.map((tool) => (
                    <Link
                      key={tool.id}
                      href={`/${tool.id}`}
                      className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-brand-50 dark:hover:bg-brand-950 hover:text-brand-600 dark:hover:text-brand-400 rounded-lg transition-colors"
                    >
                      {tool.shortTitle}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/compare"
              className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Compare
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              <Sun className="w-5 h-5 hidden dark:block" />
              <Moon className="w-5 h-5 block dark:hidden" />
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden transition-all duration-300',
          mobileOpen ? 'max-h-[80vh] overflow-y-auto' : 'max-h-0'
        )}
      >
        <div className="px-4 py-3 space-y-1">
          <p className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Converters
          </p>
          {converters.map((tool) => (
            <Link
              key={tool.id}
              href={`/${tool.id}`}
              className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              onClick={() => setMobileOpen(false)}
            >
              {tool.shortTitle}
            </Link>
          ))}

          <p className="px-3 py-1 pt-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Formatters
          </p>
          {formatters.map((tool) => (
            <Link
              key={tool.id}
              href={`/${tool.id}`}
              className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              onClick={() => setMobileOpen(false)}
            >
              {tool.shortTitle}
            </Link>
          ))}

          <p className="px-3 py-1 pt-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Decoders
          </p>
          {decoders.map((tool) => (
            <Link
              key={tool.id}
              href={`/${tool.id}`}
              className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              onClick={() => setMobileOpen(false)}
            >
              {tool.shortTitle}
            </Link>
          ))}

          <div className="border-t border-gray-200 dark:border-gray-800 my-2" />
          <Link
            href="/compare"
            className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            onClick={() => setMobileOpen(false)}
          >
            Compare
          </Link>
          <Link
            href="/about"
            className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            onClick={() => setMobileOpen(false)}
          >
            About
          </Link>
        </div>
      </div>
    </header>
  );
}
