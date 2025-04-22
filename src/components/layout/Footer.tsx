import Link from "next/link";
import { FiGithub, FiTwitter, FiLinkedin, FiMail } from "react-icons/fi";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Frontend Leeds</h3>
            <p className="text-gray-400 mb-4">
              A community for frontend developers in Leeds to connect, learn, and grow together.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com/frontend-leeds" className="text-gray-400 hover:text-white transition-colors">
                <FiGithub size={20} />
              </a>
              <a href="https://twitter.com/frontendleeds" className="text-gray-400 hover:text-white transition-colors">
                <FiTwitter size={20} />
              </a>
              <a href="https://linkedin.com/company/frontend-leeds" className="text-gray-400 hover:text-white transition-colors">
                <FiLinkedin size={20} />
              </a>
              <a href="mailto:info@frontendleeds.com" className="text-gray-400 hover:text-white transition-colors">
                <FiMail size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-gray-400 hover:text-white transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-gray-400 hover:text-white transition-colors">
                  Gallery
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/resources#code-of-conduct" className="text-gray-400 hover:text-white transition-colors">
                  Code of Conduct
                </Link>
              </li>
              <li>
                <Link href="/resources#sponsorship" className="text-gray-400 hover:text-white transition-colors">
                  Sponsorship
                </Link>
              </li>
              <li>
                <Link href="/resources#speak" className="text-gray-400 hover:text-white transition-colors">
                  Speak at an Event
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Join Us</h3>
            <p className="text-gray-400 mb-4">
              Sign up to our newsletter to stay updated with our latest events and news.
            </p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="px-4 py-2 bg-gray-800 text-white rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r-md transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} Frontend Leeds. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
