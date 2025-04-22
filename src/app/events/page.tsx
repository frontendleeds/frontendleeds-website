import { prisma } from "@/lib/prisma";
import { EnhancedEventCard } from "@/components/events/EnhancedEventCard";
import { Hero } from "@/components/layout/Hero";
import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { FiMic } from "react-icons/fi";

export const metadata: Metadata = {
  title: "All Events | Frontend Leeds",
  description: "Browse all upcoming frontend development events in Leeds",
};

export default async function EventsPage() {
  // Fetch all upcoming events
  const events = await prisma.event.findMany({
    where: {
      published: true,
      startTime: {
        gte: new Date(),
      },
    },
    orderBy: {
      startTime: "asc", // Changed to ascending to show soonest events first
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
  });

  // Fetch past events
  const pastEvents = await prisma.event.findMany({
    where: {
      published: true,
      startTime: {
        lt: new Date(),
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
    take: 6, // Limit to 6 past events
  });

  return (
    <>
      <Hero 
        title="Frontend Leeds Events"
        subtitle="Join us at our upcoming events and connect with the community"
        backgroundImage="/frontend-leeds.jpg"
      />
      
      <div className="container px-4 py-12 mx-auto">
        {/* Speaker Application CTA */}
        <div className="mb-12 overflow-hidden shadow-lg bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-800 rounded-xl">
          <div className="flex flex-col items-center md:flex-row">
            <div className="flex-1 p-6 md:p-8">
              <h2 className="mb-2 text-2xl font-bold text-white md:text-3xl">Want to Share Your Knowledge?</h2>
              <p className="max-w-2xl mb-6 text-blue-100">
                We&apos;re always looking for speakers to share their experiences and insights with our community. 
                Whether you&apos;re a seasoned presenter or it&apos;s your first time, we&apos;d love to hear from you!
              </p>
              <Link href="/events/speak" >
                <Button className="flex items-center bg-blue-800 dark:bg-blue-800">
                  <FiMic className="mr-2" />
                  Apply to Speak
                </Button>
              </Link>
            </div>
            <div className="relative hidden w-64 h-64 overflow-hidden md:block">
              <div className="absolute inset-0 flex items-center justify-center bg-blue-800 bg-opacity-30">
                <FiMic className="text-white text-8xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="mb-2 text-2xl font-bold dark:text-white">Upcoming Events</h2>
              <p className="text-gray-600 dark:text-gray-400">Join us at our next events</p>
            </div>        
          </div>

          {events.length === 0 ? (
            <div className="py-12 text-center bg-white rounded-lg shadow-sm dark:bg-gray-800">
              <h3 className="mb-2 text-xl font-semibold dark:text-white">No upcoming events</h3>
              <p className="mb-6 text-gray-500 dark:text-gray-400">
                Check back later for new events or sign up to get notified.
              </p>
              <Link href="/events/speak">
                <Button>
                  <FiMic className="mr-2" />
                  Propose an Event
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EnhancedEventCard
                  key={event.id}
                  event={event}
                  attendeeCount={event._count.rsvps}
                />
              ))}
            </div>
          )}
        </div>

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <div>
            <div className="pt-12 mb-8 border-t">
              <h2 className="mb-2 text-2xl font-bold dark:text-white">Past Events</h2>
              <p className="text-gray-600 dark:text-gray-400">Take a look at our previous events</p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pastEvents.map((event) => (
                <EnhancedEventCard
                  key={event.id}
                  event={event}
                  attendeeCount={event._count.rsvps}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
