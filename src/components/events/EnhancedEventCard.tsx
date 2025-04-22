"use client";

import { formatDate } from "@/lib/utils";
import { Event } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import { FiCalendar, FiMapPin, FiClock, FiArrowRight, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useState, useEffect } from "react";

type EventWithCreator = Event & {
  creator: {
    name: string | null;
  };
};

interface EnhancedEventCardProps {
  event: EventWithCreator;
  attendeeCount: number;
}

export function EnhancedEventCard({ event, attendeeCount }: EnhancedEventCardProps) {
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
  
  // Format the date and time
  const formattedDate = formatDate(event.startTime);
  const startTime = new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const endTime = event.endTime ? new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null;
  
  // Calculate if the event is happening soon (within the next 7 days)
  const isUpcoming = new Date(event.startTime).getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000;
  
  // Calculate if the event has passed
  const hasPassed = new Date(event.startTime).getTime() < new Date().getTime();
  
  // Calculate if the event is at capacity
  const isAtCapacity = event.capacity !== null && attendeeCount >= event.capacity;
  
  return (
    <div className="relative overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800 group">
      <Link
        href={`/events/${event.id}`}
        className="block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative">
          {event.imageUrl ? (
            <div className="h-48 overflow-hidden">
              <Image
                src={event.imageUrl}
                alt={event.title}
                width={400}
                height={200}
                className={`w-full h-full object-cover transition-transform duration-700 ease-out ${isHovered ? 'scale-110' : 'scale-100'}`}
              />
              {/* Overlay gradient on hover for smoother text transition */}
              <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-500 ${isHovered ? 'opacity-70' : ''}`}></div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600">
              <div className={`transition-transform duration-500 ease-out ${isHovered ? 'scale-110' : 'scale-100'}`}>
                <FiCalendar className="text-5xl text-white" />
              </div>
            </div>
          )}
          
          {/* Event badges */}
          <div className="absolute flex flex-col gap-2 top-3 left-3">
            {hasPassed ? (
              <span className="px-2 py-1 text-xs font-bold text-white bg-gray-500 rounded-md shadow-md">
                Passed
              </span>
            ) : isUpcoming && (
              <span className="px-2 py-1 text-xs font-bold text-white bg-yellow-500 rounded-md shadow-md">
                Coming Soon
              </span>
            )}
            
            {isAtCapacity && (
              <span className="px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-md shadow-md">
                Sold Out
              </span>
            )}
          </div>
        </div>
        
        <div className={`p-6 ${isMobile ? 'pb-12' : ''}`}>
          <h3 className="mb-2 text-xl font-semibold text-gray-800 transition-colors duration-300 dark:text-white">{event.title}</h3>
          <p className={`text-gray-600 dark:text-gray-300 mb-4 transition-all duration-300 ease-in-out ${isMobile ? (isExpanded ? '' : 'line-clamp-2') : 'line-clamp-2'}`}>
            {event.description}
          </p>
          
          <div className={`space-y-2 text-sm text-gray-500 dark:text-gray-400 transition-all duration-300 ease-in-out ${isMobile && !isExpanded ? 'max-h-24 overflow-hidden' : ''}`}>
            <div className="flex items-center">
              <FiCalendar className="mr-2 text-blue-500 dark:text-blue-400" />
              <span>{event.startTime ? formattedDate : 'TBA'}</span>
            </div>
            <div className="flex items-center">
              <FiClock className="mr-2 text-blue-500 dark:text-blue-400" />
              <span>{event.startTime ? `${startTime}${endTime ? ` - ${endTime}` : ''}` : 'TBA'}</span>
            </div>
            <div className="flex items-center">
              <FiMapPin className="mr-2 text-blue-500 dark:text-blue-400" />
              <span className="line-clamp-1">{event.location || 'TBA'}</span>
            </div>         
          </div>
          
          <div className={`mt-4 text-sm text-gray-500 dark:text-gray-400 flex justify-between items-center transition-all duration-300 ${isMobile && !isExpanded ? 'opacity-0 h-0' : 'opacity-100'}`}>
            {/* <span>Organized by {event.creator.name || 'Anonymous'}</span> */}
            <span className={ `border p-2 rounded-sm mt-4 text-blue-600 dark:text-blue-400 flex items-center transition-all duration-300 ${isHovered ? 'translate-x-1' : ''}`}>
              View Event <FiArrowRight className={`ml-1 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
            </span>
          </div>
        </div>
      </Link>
      
      {/* Mobile expand/collapse button */}
      {isMobile && (
        <button 
          onClick={(e) => {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }}
          className="absolute bottom-0 left-0 right-0 flex items-end justify-center h-12 pb-2 text-blue-600 bg-gradient-to-t from-white dark:from-gray-800 to-transparent dark:text-blue-400"
          aria-label={isExpanded ? "Collapse event details" : "Expand event details"}
        >
          {isExpanded ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
        </button>
      )}
      
      {/* Enhanced hover effects */}
      <div className="absolute inset-0 transition-all duration-300 ease-in-out border border-transparent rounded-lg pointer-events-none group-hover:border-blue-400 dark:group-hover:border-blue-500"></div>
      <div className="absolute inset-0 transition-all duration-300 ease-in-out rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:shadow-xl"></div>
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-blue-500 transform scale-x-0 origin-left transition-transform duration-300 ease-out ${isHovered ? 'scale-x-100' : ''}`}></div>
    </div>
  );
}
