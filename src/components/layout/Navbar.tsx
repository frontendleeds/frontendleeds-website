"use client";

import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

export function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isAuthenticated = status === "authenticated";
  const isAdmin = session?.user?.role === "ADMIN";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSpeakerApp, setShowSpeakerApp] = useState(false)
  

  const isActive = (path: string) => {
    return pathname === path;
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };


  useEffect(() => {
    setShowSpeakerApp(false);
  }, [pathname]);
  
  
  return (
    <header className="bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="container px-4 mx-auto sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
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

            <Link
            href="/about"
            className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
              isActive("/about")
                ? "border-blue-500 text-gray-900 dark:text-white"
                : "border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white"
            }`}
          >
           About
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
                <div className="relative ">
                  <button onClick={()=>setShowSpeakerApp(prev=>!prev)} className="flex items-center text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                    <span>{session.user.name || session.user.email}</span>
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>                
                  <div className={`absolute right-0 z-10 w-48 py-1 mt-2 bg-white rounded-md shadow-lg dark:bg-gray-800 ${showSpeakerApp ? "block":"hidden"}` }>
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
              className="inline-flex items-center justify-center p-2 text-gray-400 rounded-md dark:text-gray-300 hover:text-gray-500 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
              onClick={toggleMobileMenu}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <FiX className="block w-6 h-6" aria-hidden="true" />
              ) : (
                <FiMenu className="block w-6 h-6" aria-hidden="true" />
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

            
            <Link
            href="/about"
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              isActive("/about")
                ? "border-blue-500 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                : "border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white"
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Gallery
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
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full dark:bg-blue-900">
                      <span className="font-bold text-blue-600 dark:text-blue-400">
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
                    className="block w-full px-4 py-2 text-base font-medium text-left text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Speaker Applications
                  </Link>
                  <button
                    onClick={() => {
                      signOut({ callbackUrl: "/" });
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full px-4 py-2 text-base font-medium text-left text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
               <div className="px-2 mt-3 space-y-1">
                <Link
                  href="/auth/signin"
                  className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="block px-3 py-2 text-base font-medium text-white bg-blue-600 rounded-md dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600"
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
