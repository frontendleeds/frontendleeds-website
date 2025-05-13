"use client";

import { formatDate } from "@/lib/utils";
import { Event } from "@prisma/client";
import Link from "next/link";
import { FiCalendar, FiMapPin, FiUsers, FiChevronDown, FiChevronUp, FiArrowRight } from "react-icons/fi";
import { useState, useEffect } from "react";

type EventWithCreator = Event & {
  creator: {
    name: string | null;
  };
};

interface EventCardProps {
  event: EventWithCreator;
  attendeeCount: number;
}

export function EventCard({ event, attendeeCount }: EventCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Helper function to get current time in Europe/London timezone
  const getLondonTime = () => {
    const now = new Date();
    const londonTime = new Date(now.toLocaleString('en-GB', { timeZone: 'Europe/London' }));
    return londonTime.getTime();
  };

  // Calculate if the event has passed
  const hasPassed = new Date(event.startTime).getTime() < getLondonTime();

  return (
    <div className="relative overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800 group">
      <Link
        href={`/events/${event.id}`}
        className="block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {event.imageUrl && (
          <div className="h-48 overflow-hidden">
            <img
              src={event.imageUrl}
              alt={event.title}
              className={`w-full h-full object-cover transition-transform duration-500 ease-out ${isHovered ? 'scale-110' : 'scale-100'}`}
            />
          </div>
        )}
        <div className={`p-6 ${isMobile ? 'pb-12' : ''}`}>
          <h3 className="mb-2 text-xl font-semibold dark:text-white">{event.title}</h3>
          <p className={`text-gray-600 dark:text-gray-300 mb-4 transition-all duration-300 ease-in-out ${isMobile ? (isExpanded ? '' : 'line-clamp-2') : 'line-clamp-2'}`}>
            {event.description}
          </p>
          
          <div className={`space-y-2 text-sm text-gray-500 dark:text-gray-400 transition-all duration-300 ease-in-out ${isMobile && !isExpanded ? 'max-h-20 overflow-hidden' : ''}`}>
            <div className="flex items-center">
              <FiCalendar className="mr-2 text-blue-500 dark:text-blue-400" />
              <span>{formatDate(event.startTime)}</span>
              {hasPassed && (
                <span className="ml-2 bg-gray-500 text-white text-xs font-bold px-2 py-0.5 rounded-md">
                  Passed
                </span>
              )}
            </div>
            <div className="flex items-center">
              <FiMapPin className="mr-2 text-blue-500 dark:text-blue-400" />
              <span className="line-clamp-1">{event.location || 'TBA'}</span>
            </div>
            <div className="flex items-center">
              <FiUsers className="mr-2 text-blue-500 dark:text-blue-400" />
              <span>{attendeeCount} {attendeeCount === 1 ? 'attendee' : 'attendees'}</span>
              {event.capacity && (
                <span className="ml-1 text-xs">({attendeeCount}/{event.capacity})</span>
              )}
            </div>
          </div>
          
          <div className={`mt-4 text-sm text-gray-500 dark:text-gray-400 flex justify-between items-center transition-opacity duration-300 ${isMobile && !isExpanded ? 'opacity-0 h-0' : 'opacity-100'}`}>
       
            <span className={`text-blue-600 dark:text-blue-400 flex items-center transition-all duration-300 ${isHovered ? 'translate-x-1' : ''}`}>
              View Event <FiArrowRight className="ml-1" />
            </span>
          </div>
        </div>
      </Link>
      
      {/* Mobile expand/collapse button */}
      {isMobile && (
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute bottom-0 left-0 right-0 flex items-end justify-center h-12 pb-2 text-blue-600 bg-gradient-to-t from-white dark:from-gray-800 to-transparent dark:text-blue-400"
          aria-label={isExpanded ? "Collapse event details" : "Expand event details"}
        >
          {isExpanded ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
        </button>
      )}
      
      {/* Hover effect - subtle border and shadow animation */}
      <div className="absolute inset-0 transition-all duration-300 ease-in-out border border-transparent rounded-lg pointer-events-none group-hover:border-blue-400 dark:group-hover:border-blue-500"></div>
      <div className="absolute inset-0 transition-all duration-300 ease-in-out rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:shadow-xl"></div>
    </div>
  );
}
