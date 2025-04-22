import { prisma } from "@/lib/prisma";
import { EnhancedEventCard } from "@/components/events/EnhancedEventCard";
import data from "@/data"
import { Hero } from "@/components/layout/Hero";
import Link from "next/link";
import Image from "next/image";
import { FiArrowRight } from "react-icons/fi";
import { getServerSession } from "next-auth";

export default async function HomePage() {
  // Get current date
  const now = new Date();

  const session =await  getServerSession()
    
  // Fetch upcoming events (not passed)
  const upcomingEvents = await prisma.event.findMany({
    where: {
      published: true,
      startTime: {
        gte: now,
      },
    },
    orderBy: {
      startTime: "desc",
    },
    include: {
      creator: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          rsvps: {
            where: {
              status: "GOING",
            },
          },
        },
      },
    },
    take: 3, // Only take the first 3 upcoming events
  });

  return (
    <>
      <Hero 
        title="Frontend Leeds Community"
        subtitle="Join our community of frontend developers in Leeds for events, workshops, and networking opportunities."
        primaryButtonText="Explore Events"
        primaryButtonLink="/events"
        secondaryButtonText={session?.user?.email ? "Apply to Speak": "Join Community"}
        secondaryButtonLink={session?.user?.email  ? "events/speak": "/auth/signup"}
        primaryButtonIcon={<FiArrowRight />}
        backgroundImage="/frontend-leeds.jpg"
      />

    
      {/* Stats Section */}
      <section className="bg-white dark:bg-gray-800 py-12 shadow-md">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">{data.home.eventHosted}+</div>
              <div className="text-gray-600 dark:text-gray-300">Events Hosted</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">{data.home.member}+</div>
              <div className="text-gray-600 dark:text-gray-300">Community Members</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2"> 100%</div>
              <div className="text-gray-600 dark:text-gray-300">Dev-Focused Content</div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Upcoming Events</h2>
              <p className="text-gray-600 dark:text-gray-300 mt-2">Join us at our next events and connect with the community</p>
            </div>
            <Link href="/events" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium inline-flex items-center">
              View All <FiArrowRight className="ml-1" />
            </Link>
          </div>

          {upcomingEvents.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2 dark:text-white">No upcoming events</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Check back later for new events or sign up to get notified.
              </p>
              <Link href="/auth/signup" className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 rounded-md font-medium transition-colors duration-300">
                Sign Up for Updates
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <EnhancedEventCard
                  key={event.id}
                  event={event}
                  attendeeCount={event._count.rsvps}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Community Gallery</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2 max-w-2xl mx-auto">
              Take a look at our previous meetups and events
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href={"/gallery"}>
            <div className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="relative h-64">
                <Image 
                  src="/frontend-leeds.jpg" 
                  alt="Frontend Leeds Meetup" 
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4 bg-white dark:bg-gray-700">
                <h3 className="font-semibold text-lg dark:text-white">React Workshop</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">April 2025</p>
              </div>
            </div>
            </Link>
            
            {/* Placeholder gallery items */}
            {/* <div className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 bg-gray-100 dark:bg-gray-700">
              <div className="relative h-64 flex items-center justify-center bg-gray-200 dark:bg-gray-600">
                <FiCalendar className="text-gray-400 dark:text-gray-300 text-5xl" />
              </div>
              <div className="p-4 bg-white dark:bg-gray-700">
                <h3 className="font-semibold text-lg dark:text-white">JavaScript Fundamentals</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">March 2025</p>
              </div>
            </div> */}
            
            {/* <div className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 bg-gray-100 dark:bg-gray-700">
              <div className="relative h-64 flex items-center justify-center bg-gray-200 dark:bg-gray-600">
                <FiUsers className="text-gray-400 dark:text-gray-300 text-5xl" />
              </div>
              <div className="p-4 bg-white dark:bg-gray-700">
                <h3 className="font-semibold text-lg dark:text-white">CSS Grid Workshop</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">February 2025</p>
              </div>
            </div> */}

          </div>
        </div>
      </section>

      {/* Join Community Section */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Community Today</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Connect with other frontend developers in Leeds, share knowledge, and grow your skills.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/auth/signup" className="bg-white text-blue-900 hover:bg-blue-50 px-6 py-3 rounded-md font-medium transition-colors duration-300">
              Sign Up
            </Link>
            <Link href="/events" className="bg-transparent hover:bg-blue-800 border border-white px-6 py-3 rounded-md font-medium transition-colors duration-300">
              Explore Events
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
