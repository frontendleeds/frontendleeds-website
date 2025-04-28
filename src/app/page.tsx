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
    take: 3, 
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
      <section className="py-12 bg-white shadow-md dark:bg-gray-800">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-blue-600 dark:text-blue-400">{data.home.eventHosted}+</div>
              <div className="text-gray-600 dark:text-gray-300">Events Hosted</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-blue-600 dark:text-blue-400">{data.home.member}+</div>
              <div className="text-gray-600 dark:text-gray-300">Community Members</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-blue-600 dark:text-blue-400"> 100%</div>
              <div className="text-gray-600 dark:text-gray-300">Dev-Focused Content</div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-start justify-between mb-10 sm:flex-row sm:items-center">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Upcoming Events</h2>
              <p className="mt-2 text-gray-600 dark:text-gray-300">Join us at our next events and connect with the community</p>
            </div>
            <Link href="/events" className="inline-flex items-center font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
              View All <FiArrowRight className="ml-1" />
            </Link>
          </div>

          {upcomingEvents.length === 0 ? (
            <div className="py-12 text-center bg-white rounded-lg shadow-sm dark:bg-gray-800">
              <h3 className="mb-2 text-xl font-semibold dark:text-white">No upcoming events</h3>
              <p className="mb-6 text-gray-500 dark:text-gray-400">
                Check back later for new events or sign up to get notified.
              </p>
              <Link href="/auth/signup" className="px-6 py-3 font-medium text-white transition-colors duration-300 bg-blue-600 rounded-md hover:bg-blue-700">
                Sign Up for Updates
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
        <div className="container px-4 mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Community Gallery</h2>
            <p className="max-w-2xl mx-auto mt-2 text-gray-600 dark:text-gray-300">
              Take a look at our previous meetups and events
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Link href={"/gallery"}>
            <div className="overflow-hidden transition-shadow duration-300 rounded-lg shadow-md hover:shadow-lg">
              <div className="relative h-64">
                <Image 
                  src="/frontend-leeds.jpg" 
                  alt="Frontend Leeds Meetup" 
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4 bg-white dark:bg-gray-700">
                <h3 className="text-lg font-semibold dark:text-white">React Workshop</h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">April 2025</p>
              </div>
            </div>
            </Link>           
           
          </div>
        </div>
      </section>

      {/* Join Community Section */}
      <section className="py-16 text-white bg-blue-900">
        <div className="container px-4 mx-auto text-center">
          <h2 className="mb-6 text-3xl font-bold">Join Our Community Today</h2>
          <p className="max-w-2xl mx-auto mb-8 text-xl text-blue-100">
            Connect with other frontend developers in Leeds, share knowledge, and grow your skills.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/auth/signup" className="px-6 py-3 font-medium text-blue-900 transition-colors duration-300 bg-white rounded-md hover:bg-blue-50">
              Sign Up
            </Link>
            <Link href="/events" className="px-6 py-3 font-medium transition-colors duration-300 bg-transparent border border-white rounded-md hover:bg-blue-800">
              Explore Events
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
