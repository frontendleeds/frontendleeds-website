"use client";

import { Button } from "@/components/ui/Button";
import { 
  generateGoogleCalendarLink, 
  generateAppleCalendarLink, 
  generateOutlookCalendarLink, 
  generateYahooCalendarLink,
  trackCalendarEvent,
  refreshCalendarCache,
  getTrackedCalendarsFromCache,
  updateLocalCalendarCache
} from "@/lib/calendar";
import { useState, useRef, useEffect } from "react";
import { FiCalendar, FiChevronDown, FiCheck } from "react-icons/fi";
import { RSVPStatus } from "@prisma/client";

interface AddToCalendarButtonProps {
  eventId: string;
  title: string;
  description: string;
  location: string;
  startTime: Date;
  endTime?: Date;
  rsvpStatus?: RSVPStatus;
}

export function AddToCalendarButton({
  eventId,
  title,
  description,
  location,
  startTime,
  endTime,
  rsvpStatus,
}: AddToCalendarButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [trackedCalendars, setTrackedCalendars] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [trackedStates, setTrackedStates] = useState<Record<string, boolean>>({
    'Google Calendar': false,
    'Apple Calendar': false,
    'Outlook Calendar': false,
    'Yahoo Calendar': false
  });
  
  // Update the tracked states based on the calendar list
  const updateTrackedStates = (calendars: string[]) => {
    const newStates = { ...trackedStates };
    Object.keys(newStates).forEach(calType => {
      newStates[calType] = calendars.includes(calType);
    });
    setTrackedStates(newStates);
  };
  
  // Load tracked calendars on mount
  useEffect(() => {
    async function loadTrackedCalendars() {
      setIsLoading(true);
      try {
        // First check the cache for immediate UI feedback
        const cachedCalendars = getTrackedCalendarsFromCache(eventId);
        if (cachedCalendars.length > 0) {
          setTrackedCalendars(cachedCalendars);
          updateTrackedStates(cachedCalendars);
        }
        
        // Then refresh from the server
        const serverCalendars = await refreshCalendarCache(eventId);
        setTrackedCalendars(serverCalendars);
        updateTrackedStates(serverCalendars);
      } catch (error) {
        console.error('Error loading tracked calendars:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadTrackedCalendars();
  }, [eventId]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const eventUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/events/${eventId}`
    : `/events/${eventId}`;

  const calendarEvent = {
    title,
    description,
    location,
    startTime,
    endTime,
    url: eventUrl,
    status: rsvpStatus,
  };

  const googleCalendarLink = generateGoogleCalendarLink(calendarEvent);
  const appleCalendarLink = generateAppleCalendarLink(calendarEvent);
  const outlookCalendarLink = generateOutlookCalendarLink(calendarEvent);
  const yahooCalendarLink = generateYahooCalendarLink(calendarEvent);
  
  // Handle adding to calendar and track it
  const handleAddToCalendar = async (calendarType: string, url: string) => {
    try {
      // Track this calendar addition
      const success = await trackCalendarEvent(eventId, calendarType);
      
      if (success) {
        // Update the local cache
        updateLocalCalendarCache(eventId, calendarType);
        
        // Update the tracked calendars state
        setTrackedCalendars(prev => [...prev, calendarType]);
        setTrackedStates(prev => ({...prev, [calendarType]: true}));
        
        // Open the calendar link
        window.open(url, '_blank');
      }
    } catch (error) {
      console.error('Error adding to calendar:', error);
    } finally {
      // Close the dropdown
      setIsOpen(false);
    }
  };

  // Get button text based on tracked calendars
  const getButtonText = () => {
    if (trackedCalendars.length === 0) {
      return "Add to Calendar";
    }
    if (trackedCalendars.length === 1) {
      return `Added to ${trackedCalendars[0].replace('Calendar', '')}`;
    }
    return `Added to ${trackedCalendars.length} Calendars`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`${
          trackedCalendars.length > 0 
            ? "bg-green-700 hover:bg-green-800 dark:bg-green-800 dark:hover:bg-green-900" 
            : "bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
        } text-white px-6 py-3 rounded-md transition-colors flex items-center`}
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="animate-pulse">Loading...</span>
        ) : trackedCalendars.length > 0 ? (
          <>
            <FiCheck className="mr-2" />
            {getButtonText()}
          </>
        ) : (
          <>
            <FiCalendar className="mr-2" />
            {getButtonText()}
          </>
        )}
        <FiChevronDown className="ml-2" />
      </Button>

      {isOpen && !isLoading && (
        <div className="absolute z-10 bottom-full mb-2 w-64 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <button
              className={`w-full text-left block px-4 py-2 text-sm ${
                trackedStates['Google Calendar']
                  ? "text-green-600 dark:text-green-400 font-medium"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              role="menuitem"
              onClick={() => handleAddToCalendar('Google Calendar', googleCalendarLink)}
              disabled={trackedStates['Google Calendar']}
            >
              {trackedStates['Google Calendar'] ? (
                <span className="flex items-center">
                  <FiCheck className="mr-2" />
                  Added to Google Calendar
                </span>
              ) : (
                "Google Calendar"
              )}
            </button>
            
            <button
              className={`w-full text-left block px-4 py-2 text-sm ${
                trackedStates['Apple Calendar']
                  ? "text-green-600 dark:text-green-400 font-medium"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              role="menuitem"
              onClick={() => {
                handleAddToCalendar('Apple Calendar', appleCalendarLink);
                // For Apple Calendar, we need to trigger the download
                const link = document.createElement('a');
                link.href = appleCalendarLink;
                link.download = `${title.replace(/\s+/g, '-').toLowerCase()}.ics`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              disabled={trackedStates['Apple Calendar']}
            >
              {trackedStates['Apple Calendar'] ? (
                <span className="flex items-center">
                  <FiCheck className="mr-2" />
                  Added to Apple Calendar
                </span>
              ) : (
                "Apple Calendar"
              )}
            </button>
            
            <button
              className={`w-full text-left block px-4 py-2 text-sm ${
                trackedStates['Outlook Calendar']
                  ? "text-green-600 dark:text-green-400 font-medium"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              role="menuitem"
              onClick={() => handleAddToCalendar('Outlook Calendar', outlookCalendarLink)}
              disabled={trackedStates['Outlook Calendar']}
            >
              {trackedStates['Outlook Calendar'] ? (
                <span className="flex items-center">
                  <FiCheck className="mr-2" />
                  Added to Outlook Calendar
                </span>
              ) : (
                "Outlook Calendar"
              )}
            </button>
            
            <button
              className={`w-full text-left block px-4 py-2 text-sm ${
                trackedStates['Yahoo Calendar']
                  ? "text-green-600 dark:text-green-400 font-medium"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              role="menuitem"
              onClick={() => handleAddToCalendar('Yahoo Calendar', yahooCalendarLink)}
              disabled={trackedStates['Yahoo Calendar']}
            >
              {trackedStates['Yahoo Calendar'] ? (
                <span className="flex items-center">
                  <FiCheck className="mr-2" />
                  Added to Yahoo Calendar
                </span>
              ) : (
                "Yahoo Calendar"
              )}
            </button>
            
            {trackedCalendars.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-700 mt-1 pt-1 px-4 py-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {rsvpStatus === "GOING" 
                    ? "Your calendar will show you're attending this event."
                    : rsvpStatus === "MAYBE"
                    ? "Your calendar will show you might attend this event."
                    : rsvpStatus === "NOT_GOING"
                    ? "Your calendar will show you're not attending this event."
                    : "You can update your calendar if your RSVP status changes."}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
