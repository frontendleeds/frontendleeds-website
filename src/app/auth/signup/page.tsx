import { Metadata } from "next";
import SignUpForm from "./SignUpForm";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign Up | Frontend Leeds",
  description: "Create a new Frontend Leeds account",
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-400 to-blue-500 dark:from-indigo-900 dark:via-purple-900 dark:to-blue-900 px-4 py-16 sm:px-6 sm:py-24 flex flex-col items-center justify-center relative">
      <div className="absolute top-0 left-0 w-full h-full bg-white dark:bg-gray-900 opacity-10 pattern-grid-lg"></div>
      
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 sm:p-10 border border-gray-100 dark:border-gray-700 relative z-10">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2 text-center mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Create an account
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your details to create a new account
            </p>
          </div>
          
          <SignUpForm />
          
          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              >
                Sign in
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
