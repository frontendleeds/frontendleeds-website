import { prisma } from "@/lib/prisma";
import { formatDate, maskFullName } from "@/lib/utils";
import { RSVPButton } from "@/components/events/RSVPButton";
import { ShareEventButtons } from "@/components/events/ShareEventButtons";
import { notFound } from "next/navigation";
import { FiCalendar, FiMapPin, FiUsers } from "react-icons/fi";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Suspense } from "react";
import { RSVPStatus } from "@prisma/client";
import ReactMarkdown from "react-markdown";
import AvailableTicketsBar from "./AvailableTicketsBar";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const params = await props.params;

  // Fetch the event data
  const event = await prisma.event.findUnique({
    where: { id: params.id },
  });

  if (!event) {
    return {
      title: "Event Not Found",
    };
  }

  return {
    title: `${event.title} | Frontend Leeds`,
    description: event.description,
  };
}



export default async function EventPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const event = await prisma.event.findUnique({
    
    where: {
      id: params.id,
      published: true,
    },
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
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

  if (!event) {
    notFound();
  }

  // Get user's RSVP status if logged in
  let userRsvp = null;
  if (userId) {
    userRsvp = await prisma.rSVP.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId: event.id,
        },
      },
    });
  }

  // Get attendees
  const attendees = await prisma.rSVP.findMany({
    where: {
      eventId: event.id,
      status: "GOING",
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
    take: 10,
  });

  const isPast =  new Date() > new Date(event.endTime)
  return (
    <>
      {/* Hero Banner */}
      <div className="relative">
        {event.imageUrl ? (
          <div className="w-full h-64 sm:h-80 md:h-96 ">

<div className="relative w-full h-full">
<Image
  src={event.imageUrl}
  alt={event.title}
  fill
  className="object-cover w-full h-full"
/>
  <div className="absolute inset-0 opacity-100 bg-gradient-to-b from-transparent to-black"></div>
</div>


          
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white sm:p-6 md:p-8">
              <div className="container max-w-5xl mx-auto">
                <div className="inline-block px-2 py-1 mb-2 text-xs font-semibold text-white bg-blue-600 rounded-md sm:text-sm sm:px-3 sm:py-1 sm:mb-4">
                  Frontend Event
                </div>
                <h1 className="mb-2 text-2xl font-bold sm:text-3xl md:text-4xl lg:text-5xl sm:mb-4 drop-shadow-md ">{event.title}</h1>
                <p className="max-w-3xl mb-2 text-sm text-gray-100 sm:text-base md:text-xl drop-shadow-md sm:mb-6 line-clamp-2 md:line-clamp-none">{event.description}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-12 bg-gradient-to-r from-blue-700 to-indigo-800 sm:py-16 md:py-24">
            <div className="container max-w-5xl px-4 mx-auto">
              <div className="inline-block px-2 py-1 mb-2 text-xs font-semibold text-white bg-blue-500 rounded-md sm:text-sm sm:px-3 sm:py-1 sm:mb-4">
                Frontend Event
              </div>
              <h1 className="mb-2 text-2xl font-bold text-white sm:text-3xl md:text-4xl lg:text-5xl sm:mb-4">{event.title}</h1>
              <p className="max-w-3xl mb-2 text-sm text-gray-100 sm:text-base md:text-xl sm:mb-6">{event.description}</p>
            </div>
          </div>
        )}
      </div>

      <div className="container px-4 py-6 mx-auto sm:py-8 md:py-12">
        <div className="max-w-5xl mx-auto">
          {/* Event Details Card */}
          <div className="relative z-10 grid grid-cols-1 gap-4 p-4 mb-6 -mt-8 bg-white shadow-lg dark:bg-gray-800 rounded-xl sm:p-6 md:p-8 sm:mb-8 md:mb-12 sm:-mt-12 md:-mt-16 md:grid-cols-3 sm:gap-6 md:gap-8">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg dark:bg-blue-900/30">
                <FiCalendar className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Date and Time</h3>
                <p className="text-gray-600 dark:text-gray-300">{formatDate(event.startTime)}</p>
              
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg dark:bg-blue-900/30">
                <FiMapPin className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Location</h3>
                <p className="text-gray-600 dark:text-gray-300">{event.location}</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg dark:bg-blue-900/30">
                <FiUsers className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Attendees</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {event._count.rsvps}{" "}
                  {event._count.rsvps === 1 ? "person" : "people"} going
                </p>
                {event.capacity && (
                  <>
                    {event._count.rsvps >= event.capacity ? (
                      <p className="text-gray-600 dark:text-gray-300">
                        <span className="font-medium text-red-600 dark:text-red-400">Still accepting attendees</span>
                        <span className="ml-1 text-xs">({event._count.rsvps}/{event.capacity})</span>
                      </p>
                    ) : event._count.rsvps >= event.capacity * 0.8 ? (
                      <p className="text-gray-600 dark:text-gray-300">
                        <span className="font-medium text-yellow-600 dark:text-yellow-400">{event.capacity - event._count.rsvps} tickets left (limited)</span>
                        <span className="ml-1 text-xs">({event._count.rsvps}/{event.capacity})</span>
                      </p>
                    ) : (
                      <p className="text-gray-600 dark:text-gray-300">
                        <span className="font-medium">{event.capacity - event._count.rsvps} tickets available</span>
                        <span className="ml-1 text-xs">({event._count.rsvps}/{event.capacity})</span>
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 mb-12 md:grid-cols-3">
            <div className="md:col-span-2">
              {/* Event Image */}
              {event.imageUrl && (
                <div className="mb-6 overflow-hidden bg-white shadow-md dark:bg-gray-800 rounded-xl sm:mb-8">
                  <div className="relative w-full h-60 sm:h-80">
                   
                  <Image
  src={event.imageUrl}
  alt={event.title}
  className="object-cover w-full h-full"
  fill
  sizes="(max-width: 768px) 100vw, 100vw"
 
/>                    

                  </div>
                  <div className="p-3 border-t border-gray-100 sm:p-4 dark:border-gray-700">
                    <p className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                      {event.title} - Join us for this exciting frontend development event in Leeds
                    </p>
                  </div>
                </div>
              )}
              
              <div className="p-4 mb-6 bg-white shadow-md dark:bg-gray-800 rounded-xl sm:p-6 md:p-8 sm:mb-8">
                <h2 className="mb-4 text-xl font-bold text-gray-900 sm:text-2xl sm:mb-6 dark:text-white">About This Event</h2>
                <div className="prose prose-blue dark:prose-invert prose-lg prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white prose-headings:mt-6 prose-headings:mb-4 prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:my-4 prose-p:leading-relaxed prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:text-blue-800 dark:hover:prose-a:text-blue-300 prose-a:transition-colors prose-a:duration-200 prose-a:font-medium prose-strong:font-semibold prose-strong:text-gray-900 dark:prose-strong:text-white prose-code:text-gray-800 dark:prose-code:text-gray-200 prose-code:bg-gray-100 dark:prose-code:bg-gray-700 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-pre:text-gray-800 dark:prose-pre:text-gray-200 prose-pre:p-4 prose-pre:my-6 prose-pre:rounded-md prose-pre:overflow-x-auto prose-img:rounded-lg prose-img:shadow-md prose-img:my-8 prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-li:my-2 prose-ol:pl-8 prose-ol:my-6 prose-ol:list-decimal prose-ol:space-y-2 prose-ul:pl-8 prose-ul:my-6 prose-ul:list-disc prose-ul:space-y-2 prose-li:pl-1 prose-blockquote:border-l-4 prose-blockquote:border-blue-500 dark:prose-blockquote:border-blue-400 prose-blockquote:pl-4 prose-blockquote:py-1 prose-blockquote:my-6 prose-blockquote:italic prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300 prose-hr:border-gray-300 dark:prose-hr:border-gray-600 prose-hr:my-8 max-w-none text-base">
                  <ReactMarkdown>{event.content}</ReactMarkdown>
                </div>
              </div>
              
              {/* What to Bring Section */}
              <div className="p-4 mb-6 bg-white shadow-md dark:bg-gray-800 rounded-xl sm:p-6 md:p-8 sm:mb-8">
                <h2 className="mb-4 text-xl font-bold text-gray-900 sm:text-2xl sm:mb-6 dark:text-white">What to Bring</h2>
                <ul className="space-y-2 sm:space-y-3">
                  <li className="flex items-center">
                    <div className="p-2 mr-3 bg-blue-100 rounded-full dark:bg-blue-900/30">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="dark:text-gray-300">Your laptop (fully charged)</span>
                  </li>
                  <li className="flex items-center">
                    <div className="p-2 mr-3 bg-blue-100 rounded-full dark:bg-blue-900/30">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="dark:text-gray-300">Notepad and pen</span>
                  </li>
                  <li className="flex items-center">
                    <div className="p-2 mr-3 bg-blue-100 rounded-full dark:bg-blue-900/30">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="dark:text-gray-300">Questions for the speaker</span>
                  </li>
                  <li className="flex items-center">
                    <div className="p-2 mr-3 bg-blue-100 rounded-full dark:bg-blue-900/30">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="dark:text-gray-300">Business cards for networking</span>
                  </li>
                </ul>
              </div>              
                    
              {/* <div className="mb-6 overflow-hidden bg-white shadow-md dark:bg-gray-800 rounded-xl sm:mb-8">
                <div className="p-3 border-b border-gray-100 sm:p-4 dark:border-gray-700">
                  <h2 className="text-xl font-bold text-gray-900 sm:text-2xl dark:text-white">Event Location</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300 sm:text-base">{event.location}</p>
                </div>
                <div className="relative h-48 bg-gray-200 sm:h-64 dark:bg-gray-700">
                
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <div className="inline-flex p-3 mb-3 bg-blue-100 rounded-full dark:bg-blue-900/30">
                          <FiMapPin className="text-blue-600 dark:text-blue-400" size={24} />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400">Interactive map would be displayed here</p>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>

            <div>
              <div className="sticky p-4 bg-white shadow-md dark:bg-gray-800 rounded-xl sm:p-6 md:p-8 top-8">
                {
          isPast ?      <div>

            Event Has Passed
                
               </div> : <>
               
               <h3 className="mb-4 text-lg font-bold text-gray-900 sm:text-xl sm:mb-6 dark:text-white">RSVP to this event</h3>
                <Suspense fallback={<div className="h-10 bg-gray-200 rounded animate-pulse"></div>}>
                  <RSVPButton
                    eventId={event.id}
                    currentStatus={userRsvp?.status as RSVPStatus | null}
                    eventTitle={event.title}
                    eventDescription={event.description}
                    eventLocation={event.location}
                    eventStartTime={event.startTime}
                    eventEndTime={event.endTime}
                  />
                </Suspense>                
             
               
               </>
                  
                }
              </div>
            </div>
          </div>

          <div className="p-4 mb-6 bg-white shadow-md dark:bg-gray-800 rounded-xl sm:p-6 md:p-8 sm:mb-8 md:mb-12">
            <h2 className="mb-4 text-xl font-bold text-gray-900 sm:text-2xl sm:mb-6 dark:text-white">Attendees</h2>
            {attendees.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4 sm:gap-4 md:gap-6">
                {attendees.map((rsvp) => (
                  <div
                    key={rsvp.id}
                    className="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700 sm:p-4"
                  >
                    <div className="flex items-center justify-center w-8 h-8 mr-2 font-bold text-blue-600 bg-blue-100 rounded-full dark:bg-blue-900/30 dark:text-blue-400 sm:h-10 sm:w-10 sm:mr-3">
                      {rsvp.user.name ? rsvp.user.name.charAt(0).toUpperCase() : 'A'}
                    </div>
                    <div className="text-sm font-medium sm:text-base dark:text-white">
                      {maskFullName(rsvp?.user?.name || "Anonymous")}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
             <>
             {
              isPast ? <>
              
              <Button
        variant={"outline"}
        className="w-full"
         disabled
      >
        This Event is Past
  
      </Button>
      
                </>:   <div className="p-4 text-center rounded-lg bg-gray-50 dark:bg-gray-700 sm:p-6">
               
              <p className="mb-3 text-sm text-gray-500 dark:text-gray-400 sm:mb-4 sm:text-base">No attendees yet. Be the first to RSVP!</p>
              <Suspense fallback={<div>Loading...</div>}>
                <RSVPButton
                  eventId={event.id}
                  currentStatus={userRsvp?.status as RSVPStatus | null}
                  eventTitle={event.title}
                  eventDescription={event.description}
                  eventLocation={event.location}
                  eventStartTime={event.startTime}
                  eventEndTime={event.endTime}
                />
              </Suspense>
            </div>
             }
             </>
            )}
          </div>
          
          <div className="p-4 text-center bg-blue-50 dark:bg-blue-900/20 rounded-xl sm:p-6 md:p-8">
            <h2 className="mb-2 text-xl font-bold text-gray-900 sm:text-2xl sm:mb-4 dark:text-white">Share This Event</h2>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-300 sm:mb-6 sm:text-base">Invite your friends and colleagues to join this event</p>
            <ShareEventButtons 
              eventId={event.id} 
              title={event.title} 
              description={event.description}
              location={event.location}
              startTime={event.startTime}
              endTime={event.endTime}
            />
          </div>
        </div>
      </div>
      
      {/* Fixed available tickets bar for mobile - now shown for all events */}
      <AvailableTicketsBar 
        capacity={event.capacity} 
        attendeeCount={event._count.rsvps}
        eventId={event.id}
        currentStatus={userRsvp?.status as RSVPStatus | null}
        eventTitle={event.title}
        eventDescription={event.description}
        eventLocation={event.location}
        eventStartTime={event.startTime}
        eventEndTime={event.endTime}
      />
    </>
  );
}
