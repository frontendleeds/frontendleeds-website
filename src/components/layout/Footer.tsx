import Link from "next/link";
import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 text-white bg-gray-900 dark:bg-gray-950">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-xl font-bold">Frontend Leeds</h3>
            <p className="mb-4 text-gray-400">
              A community for frontend developers in Leeds to connect, learn, and grow together.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com/frontend-leeds" className="text-gray-400 transition-colors hover:text-white">
                <FiGithub size={20} />
              </a>             
              <a href="https://linkedin.com/company/frontendleeds" className="text-gray-400 transition-colors hover:text-white">
                <FiLinkedin size={20} />
              </a>
              <a href="mailto:info@frontendleeds.com" className="text-gray-400 transition-colors hover:text-white">
                <FiMail size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 transition-colors hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-gray-400 transition-colors hover:text-white">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-gray-400 transition-colors hover:text-white">
                  Gallery
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 text-lg font-semibold">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/resources#code-of-conduct" className="text-gray-400 transition-colors hover:text-white">
                  Code of Conduct
                </Link>
              </li>
              <li>
                <Link href="/resources#sponsorship" className="text-gray-400 transition-colors hover:text-white">
                  Sponsorship
                </Link>
              </li>
              <li>
                <Link href="/resources#speak" className="text-gray-400 transition-colors hover:text-white">
                  Speak at an Event
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 text-lg font-semibold">Join Us</h3>
            <p className="mb-4 text-gray-400">
              Sign up to our newsletter to stay updated with our latest events and news.
            </p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="w-full px-4 py-2 text-white bg-gray-800 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-4 py-2 transition-colors bg-blue-600 hover:bg-blue-700 rounded-r-md">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        <div className="pt-8 mt-12 text-center text-gray-400 border-t border-gray-800">
          <p>&copy; {currentYear} Frontend Leeds. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
