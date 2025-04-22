import { Metadata } from "next";
import { Hero } from "@/components/layout/Hero";
import Link from "next/link";
import { FiBook, FiHeart, FiMic, FiFileText, FiGithub, FiCode } from "react-icons/fi";

export const metadata: Metadata = {
  title: "Resources | Frontend Leeds",
  description: "Resources for the Frontend Leeds community including code of conduct, sponsorship information, and speaking opportunities",
};

export default function ResourcesPage() {
  return (
    <>
      <Hero 
        title="Community Resources"
        subtitle="Everything you need to know about Frontend Leeds - from our code of conduct to how you can get involved"
        backgroundImage="/frontend-leeds.jpg"
      />
      
      <div className="container mx-auto px-4 py-12">
        {/* Code of Conduct Section */}
        <section id="code-of-conduct" className="mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                  <FiFileText className="text-blue-600" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Code of Conduct</h2>
              </div>
              
              <div className="prose max-w-none">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  We are dedicated to providing a harassment-free and inclusive event experience for everyone regardless of gender identity and expression, sexual orientation, disability, physical appearance, body size, race, age, religion, or nationality.
                </p>
                
                <h3 className="text-xl font-semibold mt-6 mb-3 dark:text-white">Our Standards</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Examples of behavior that contributes to creating a positive environment include:
                </p>
                <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
                  <li>Using welcoming and inclusive language</li>
                  <li>Being respectful of differing viewpoints and experiences</li>
                  <li>Gracefully accepting constructive criticism</li>
                  <li>Focusing on what is best for the community</li>
                  <li>Showing empathy towards other community members</li>
                </ul>
                
                <h3 className="text-xl font-semibold mt-6 mb-3 dark:text-white">Enforcement</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Violations of these rules may be reported to the event organizers. All reports will be reviewed and investigated and will result in a response that is deemed necessary and appropriate to the circumstances.
                </p>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mt-6">
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    If you experience or witness unacceptable behavior, or have any other concerns, please contact us at:
                  </p>
                  <a href="mailto:conduct@frontendleeds.com" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                    conduct@frontendleeds.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Sponsorship Section */}
        <section id="sponsorship" className="mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                  <FiHeart className="text-blue-600" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sponsorship</h2>
              </div>
              
              <div className="prose max-w-none">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Frontend Leeds is a community-driven event that relies on the support of sponsors to provide food, drinks, and venue space for our meetups. By sponsoring Frontend Leeds, you&apos;ll reach a targeted audience of frontend developers, designers, and tech enthusiasts in the Leeds area.
                </p>
                
                <h3 className="text-xl font-semibold mt-6 mb-3 dark:text-white">Sponsorship Packages</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 dark:bg-gray-700">
                    <h4 className="text-lg font-semibold mb-2 dark:text-white">Silver Sponsor</h4>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">£99 per event</p>
                    <ul className="text-gray-700 dark:text-gray-300 space-y-2">
                      <li>Logo on website for a month </li>
                      <li>Mention during event</li>
                    
                    </ul>
                  </div>
                  
                  <div className="border border-blue-200 dark:border-blue-700 rounded-lg p-6 bg-blue-50 dark:bg-blue-900/20">
                    <div className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-md inline-block mb-2">POPULAR</div>
                    <h4 className="text-lg font-semibold mb-2 dark:text-white">Gold Sponsor</h4>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">£199 per event</p>
                    <ul className="text-gray-700 dark:text-gray-300 space-y-2">
                      <li>Logo on website for three month</li>
                      <li>Mention during event</li>
                      <li>5-minute sponsor talk</li>  
                    </ul>
                  </div>
                  
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 dark:bg-gray-700">
                    <h4 className="text-lg font-semibold mb-2 dark:text-white">Platinum Sponsor</h4>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">£399 per event</p>
                    <ul className="text-gray-700 dark:text-gray-300 space-y-2">
                      <li>Logo on website for 6 month</li>
                      <li>Prominent mention during event</li>
                      <li>8 minute sponsor talk</li>
                      <li>Exclusive branding at event</li>
                      <li>Job listings on website</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mt-8">
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    Interested in sponsoring Frontend Leeds? Get in touch with us at:
                  </p>
                  <a href="mailto:sponsors@frontendleeds.com" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                    sponsors@frontendleeds.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Speak at an Event Section */}
        <section id="speak" className="mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                  <FiMic className="text-blue-600" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Speak at an Event</h2>
              </div>
              
              <div className="prose max-w-none">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  We&apos;re always looking for speakers for our monthly meetups. Whether you&apos;re a seasoned speaker or it&apos;s your first time, we&apos;d love to hear from you! Our community is interested in a wide range of frontend topics, from JavaScript frameworks to CSS, accessibility, performance, and more.
                </p>
                
                <h3 className="text-xl font-semibold mt-6 mb-3 dark:text-white">Talk Formats</h3>
                <ul className="text-gray-700 dark:text-gray-300 space-y-3">
                  <li>
                    <span className="font-medium">Lightning Talk (5-10 minutes):</span> Perfect for first-time speakers or focused topics
                  </li>
                  <li>
                    <span className="font-medium">Standard Talk (20-30 minutes):</span> Our most common format, ideal for most topics
                  </li>
                  <li>
                    <span className="font-medium">Workshop (45-60 minutes):</span> Interactive sessions with hands-on components
                  </li>
                </ul>
                
                <h3 className="text-xl font-semibold mt-6 mb-3 dark:text-white">Speaker Support</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  We&apos;re committed to supporting our speakers. We can provide:
                </p>
                <ul className="text-gray-700 dark:text-gray-300 space-y-2">
                  <li>Feedback on your talk proposal</li>
                  <li>Rehearsal opportunities</li>
                  <li>Technical equipment</li>
                  <li>Travel expenses for speakers coming from outside Leeds</li>
                </ul>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mt-8">
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    Ready to share your knowledge with the Frontend Leeds community? Submit your talk proposal at:
                  </p>
                  <a href="mailto:speakers@frontendleeds.com" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                    speakers@frontendleeds.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Additional Resources Section */}
        <section id="additional-resources">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Additional Resources</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <FiGithub className="text-blue-600" size={20} />
                </div>
                <h3 className="text-xl font-semibold dark:text-white">GitHub Repository</h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Check out our GitHub repository for code samples, slides from past talks, and community projects.
              </p>
              <a href="https://github.com/frontend-leeds" className="text-blue-600 dark:text-blue-400 font-medium hover:underline inline-flex items-center">
                Visit our GitHub <FiCode className="ml-1" />
              </a>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <FiBook className="text-blue-600" size={20} />
                </div>
                <h3 className="text-xl font-semibold dark:text-white">Learning Resources</h3>
              </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  We&apos;ve curated a list of learning resources for frontend developers at all levels.
                </p>
              <Link href="/resources/learning" className="text-blue-600 dark:text-blue-400 font-medium hover:underline inline-flex items-center">
                Explore resources <FiBook className="ml-1" />
              </Link>
            </div>    
         
          </div>
        </section>
      </div>
    </>
  );
}
