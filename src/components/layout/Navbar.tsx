"use client";

import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

export function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isAuthenticated = status === "authenticated";
  const isAdmin = session?.user?.role === "ADMIN";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname === path;
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
              Frontend Leeds
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:ml-6 md:flex md:space-x-8">
            <Link
              href="/"
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                isActive("/")
                  ? "border-blue-500 text-gray-900 dark:text-white"
                  : "border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white"
              }`}
            >
              Home
            </Link>
            <Link
              href="/events"
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                isActive("/events")
                  ? "border-blue-500 text-gray-900 dark:text-white"
                  : "border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white"
              }`}
            >
              Events
            </Link>
            <Link
              href="/gallery"
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                isActive("/gallery")
                  ? "border-blue-500 text-gray-900 dark:text-white"
                  : "border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white"
              }`}
            >
              Gallery
            </Link>
            <Link
              href="/resources"
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                isActive("/resources")
                  ? "border-blue-500 text-gray-900 dark:text-white"
                  : "border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white"
              }`}
            >
              Resources
            </Link>
            {isAdmin && (
              <>
                <Link
                  href="/admin"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive("/admin")
                      ? "border-blue-500 text-gray-900 dark:text-white"
                      : "border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white"
                  }`}
                >
                  Admin
                </Link>
              </>
            )}
          </nav>

          {/* Desktop Auth Buttons and Theme Toggle */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <ThemeToggle />
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="relative group">
                  <button className="flex items-center text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                    <span>{session.user.name || session.user.email}</span>
                    <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                    <Link
                      href="/events/my-applications"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      My Speaker Applications
                    </Link>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link href="/auth/signin">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-2 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
              onClick={toggleMobileMenu}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <FiX className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <FiMenu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive("/")
                  ? "border-blue-500 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                  : "border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/events"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive("/events")
                  ? "border-blue-500 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                  : "border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Events
            </Link>
            <Link
              href="/gallery"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive("/gallery")
                  ? "border-blue-500 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                  : "border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Gallery
            </Link>
            <Link
              href="/resources"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive("/resources")
                  ? "border-blue-500 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                  : "border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Resources
            </Link>
            {isAdmin && (
              <>
                <Link
                  href="/admin"
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    isActive("/admin")
                      ? "border-blue-500 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                      : "border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
              </>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
            {isAuthenticated ? (
              <div>
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <span className="text-blue-600 dark:text-blue-400 font-bold">
                        {session.user.name ? session.user.name.charAt(0).toUpperCase() : 'U'}
                      </span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800 dark:text-gray-200">
                      {session.user.name || session.user.email}
                    </div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {session.user.email}
                    </div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Link
                    href="/events/my-applications"
                    className="block px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Speaker Applications
                  </Link>
                  <button
                    onClick={() => {
                      signOut({ callbackUrl: "/" });
                      setMobileMenuOpen(false);
                    }}
                    className="block px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-3 space-y-1 px-2">
                <Link
                  href="/auth/signin"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
