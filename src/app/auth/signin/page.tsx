import { Metadata } from "next";
import SignInForm from "./SignInForm";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign In | Frontend Leeds",
  description: "Sign in to your Frontend Leeds account",
};

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-400 to-blue-500 dark:from-indigo-900 dark:via-purple-900 dark:to-blue-900 px-4 py-16 sm:px-6 sm:py-24 flex flex-col items-center justify-center relative">
      <div className="absolute top-0 left-0 w-full h-full bg-white dark:bg-gray-900 opacity-10 pattern-grid-lg"></div>
      
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 sm:p-10 border border-gray-100 dark:border-gray-700 relative z-10">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2 text-center mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Welcome back
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in to your account
            </p>
          </div>
          
          <SignInForm />
          
          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/signup"
                className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-white font-medium hover:text-blue-100 transition-colors">
            ← Back to Frontend Leeds
          </Link>
        </div>
      </div>
    </div>
  );
}
