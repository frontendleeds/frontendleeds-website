import React from 'react';
import Image from 'next/image'; // Import Image component
import { FiUsers, FiTarget, FiCalendar, FiGift, FiCoffee, FiMail, FiHeart, FiLinkedin } from 'react-icons/fi';


const organizers = [
  {
    name: 'Kehinde Oke',
    role: 'Lead Organizer',
    bio: 'Kehinde is a passionate frontend developer with a strong belief in open learning, community collaboration, and pushing the web forward. With experience across modern frameworks and a love for sharing knowledge, Kehinde started Frontend Leeds to bring developers together and make Leeds a vibrant tech hub.',
    imageUrl: '/oke-kehinde-org.avif',
    linkedin:"https://www.linkedin.com/in/okeken/"
  
  },
  {
    name: 'Volunteer',
    role: 'Co-organizer',
    bio: `Frontend Leeds is growing, and we’re looking for passionate volunteers to help make our events even better. Whether it’s helping with logistics, managing social media, or curating talks—we’d love to have you on board.

No matter your level of experience, if you care about the frontend community and want to contribute, we’d love to hear from you.

Interested? Email us at team@frontenleeds.com and tell us a bit about yourself`,
    imageUrl: '/volunteer1.png',
  },
];

const AboutPage = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative py-16 text-center text-white bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-800 sm:py-24">
        <div className="container px-4 mx-auto">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            About Frontend Leeds
          </h1>
          <p className="max-w-3xl mx-auto mt-6 text-xl text-blue-100">
            Connecting, inspiring, and empowering the frontend community in Leeds, UK through monthly meetups, knowledge sharing, and networking.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container px-4 py-16 mx-auto sm:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-16">
          {/* Left Column (Span 2) */}
          <div className="space-y-10 lg:col-span-2">
            {/* Who We Are */}
            <section className="p-8 bg-white shadow-lg rounded-xl dark:bg-gray-800">
              <h2 className="mb-5 text-3xl font-bold text-gray-900 dark:text-white">Who We Are</h2>
              <div className="space-y-4 text-lg text-gray-700 dark:text-gray-300">
                <p>
                  Frontend Leeds is a vibrant, community-driven meetup for frontend developers, UI/UX designers, and web enthusiasts based in and around Leeds. We are passionate about creating a space where innovation meets collaboration.
                </p>
                <p>
                  Whether you are diving deep into JavaScript frameworks, crafting pixel-perfect CSS, championing web accessibility, optimizing for performance, or building robust design systems – Frontend Leeds is your local hub to connect, share, learn, and grow alongside fellow professionals.
                </p>
              </div>
            </section>

            {/* Our Mission */}
            <section className="p-8 bg-white shadow-lg rounded-xl dark:bg-gray-800">
              <div className="flex items-center mb-5">
                <FiTarget className="flex-shrink-0 w-8 h-8 mr-4 text-blue-600 dark:text-blue-400" />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Our Mission</h2>
              </div>
              <p className="mb-5 text-lg text-gray-700 dark:text-gray-300">
                To cultivate a friendly, inclusive, and inspiring environment where developers of all backgrounds and experience levels can thrive. We aim to:
              </p>
              <ul className="space-y-3 text-lg text-gray-700 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-5 h-5 mt-1 mr-3 text-blue-500">✔</span>
                  <span>Facilitate learning through insightful talks by experienced speakers.</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-5 h-5 mt-1 mr-3 text-blue-500">✔</span>
                  <span>Showcase emerging tools, trends, and best practices in frontend development.</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-5 h-5 mt-1 mr-3 text-blue-500">✔</span>
                  <span>Encourage the exchange of ideas, challenges, and real-world experiences.</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-5 h-5 mt-1 mr-3 text-blue-500">✔</span>
                  <span>Build valuable and lasting connections within the local tech community.</span>
                </li>
              </ul>
            </section>
          </div>

          {/* Right Column (Span 1) */}
          <div className="space-y-10 lg:col-span-1">
            {/* Who It's For */}
            <section className="p-6 bg-white shadow-lg rounded-xl dark:bg-gray-800">
              <div className="flex items-center mb-4">
                <FiUsers className="flex-shrink-0 mr-3 text-blue-600 w-7 h-7 dark:text-blue-400" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Who It is For</h3>
              </div>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>🚀 Aspiring junior developers eager to learn.</li>
                <li>🎓 Seasoned senior frontend engineers sharing expertise.</li>
                <li>🎨 Creative UI/UX designers shaping user experiences.</li>
                <li>💡 Anyone enthusiastic about the present and future of the web.</li>
              </ul>
            </section>

            {/* Our Events */}
            <section className="p-6 bg-white shadow-lg rounded-xl dark:bg-gray-800">
              <div className="flex items-center mb-4">
                <FiCalendar className="flex-shrink-0 mr-3 text-blue-600 w-7 h-7 dark:text-blue-400" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Our Events</h3>
              </div>
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                We host regular monthly meetups packed with value, typically featuring:
              </p>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>🎤 Engaging talks from local talent and guest speakers.</li>
                <li>❓ Interactive Q&A sessions and open discussions.</li>
                <li>📢 Community shout-outs and relevant announcements.</li>
                <li>🍕 Complimentary pizza, drinks, and networking (<FiCoffee className="inline w-4 h-4" /> & <FiGift className="inline w-4 h-4" />).</li>
              </ul>
            </section>
          </div>
        </div>

        {/* Meet the Organizers Section */}
        <section className="mt-16 sm:mt-20">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Meet the Team
            </h2>
            <p className="max-w-xl mx-auto mt-4 text-lg text-gray-600 dark:text-gray-400">
              Frontend Leeds is brought to you by dedicated volunteers passionate about community and technology.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 justify-items-center">
            {organizers.map((organizer) => (
              <div key={organizer.name} className="w-full max-w-sm p-6 text-center bg-white shadow-lg rounded-xl dark:bg-gray-800">
                <div className="mb-4">
                  <Image
                    src={organizer.imageUrl}
                    className="object-cover w-32 h-32 mx-auto rounded-full ring-4 ring-blue-300 dark:ring-blue-600"
                    alt={`Profile picture of ${organizer.name}`}
                    width={128}
                    height={128}
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{organizer.name}</h3>
                <p className="mb-3 text-sm font-medium text-blue-600 dark:text-blue-400">{organizer.role}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{organizer.bio}</p>
                {/* Add social links here if available */}
                <div className="flex justify-center mt-4 space-x-3">
                  {/* {organizer.twitter && <a href={organizer.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500">...Twitter Icon...</a>} */}
                  {organizer.linkedin && <a href={organizer.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500">   <FiLinkedin className="w-5 h-5 mr-2 -ml-1" /> </a>}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Get Involved Section */}
        <section className="p-8 mt-16 text-center text-white shadow-lg sm:mt-20 bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-800 rounded-xl">
          <FiHeart className="w-12 h-12 mx-auto mb-4 text-blue-300" />
          <h2 className="mb-4 text-3xl font-bold">Get Involved!</h2>
          <p className="max-w-2xl mx-auto mb-6 text-lg text-blue-100">
            Frontend Leeds thrives on community spirit! Want to contribute? We are always excited about new ideas, potential speakers, and supportive sponsors. Help us grow the Leeds tech scene!
          </p>
          <a
            href="mailto:team@frontenleeds.com"
            className="inline-flex items-center px-6 py-3 text-base font-medium text-blue-700 bg-white border border-transparent rounded-md shadow-sm hover:bg-blue-50 dark:bg-gray-100 dark:text-blue-800 dark:hover:bg-gray-200"
          >
            <FiMail className="w-5 h-5 mr-2 -ml-1" />
            Reach Out to the Team
          </a>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
