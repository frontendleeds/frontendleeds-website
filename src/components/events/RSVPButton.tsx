"use client";

import { Button } from "@/components/ui/Button";
import { AddToCalendarButton } from "@/components/events/AddToCalendarButton";
import { RSVPStatus } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getTrackedCalendarsFromCache, refreshCalendarCache } from "@/lib/calendar";

interface RSVPButtonProps {
  eventId: string;
  currentStatus: RSVPStatus | null;
  eventTitle?: string;
  eventDescription?: string;
  eventLocation?: string;
  eventStartTime?: Date;
  eventEndTime?: Date;
}

export function RSVPButton({ 
  eventId, 
  currentStatus,
  eventTitle,
  eventDescription,
  eventLocation,
  eventStartTime,
  eventEndTime
}: RSVPButtonProps) {
  const { status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState<RSVPStatus | null>(currentStatus);

  const isAuthenticated = status === "authenticated";

  // Track if the user has added this event to any calendars
  const [hasAddedToCalendars, setHasAddedToCalendars] = useState<boolean>(false);
  
  // Check if the user has added this event to any calendars
  useEffect(() => {
    async function checkCalendars() {
      if (typeof window !== 'undefined') {
        try {
          // First check the cache for immediate UI feedback
          const cachedCalendars = getTrackedCalendarsFromCache(eventId);
          if (cachedCalendars.length > 0) {
            setHasAddedToCalendars(true);
          }
          
          // Then refresh from the server
          const serverCalendars = await refreshCalendarCache(eventId);
          setHasAddedToCalendars(serverCalendars.length > 0);
        } catch (error) {
          console.error('Error checking calendars:', error);
        }
      }
    }
    
    checkCalendars();
  }, [eventId]);

  const handleRSVP = async (newStatus: RSVPStatus) => {
    if (!isAuthenticated) {
      router.push(`/auth/signin?callbackUrl=/events/${eventId}`);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/events/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId,
          status: newStatus,
        }),
      });

      if (response.ok) {
        // If the user has already added this event to a calendar and the status has changed,
        // show a notification that they should update their calendar
        const previousStatus = rsvpStatus;
        setRsvpStatus(newStatus);
        
        if (hasAddedToCalendars && previousStatus !== newStatus) {
          // We'll show a message in the UI about updating the calendar
          // This is handled in the JSX below
        }
        
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to RSVP:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Button
        onClick={() => router.push(`/auth/signin?callbackUrl=/events/${eventId}`)}
        className="w-full"
      >
        Sign in to RSVP
      </Button>
    );
  }

  return (
    <div className="space-y-3">
      <Button
        variant={rsvpStatus === "GOING" ? "default" : "outline"}
        className="w-full"
        onClick={() => handleRSVP("GOING")}
        disabled={isLoading}
      >
        {rsvpStatus === "GOING" ? "✓ Going" : "Going"}
      </Button>
      <Button
        variant={rsvpStatus === "MAYBE" ? "default" : "outline"}
        className="w-full"
        onClick={() => handleRSVP("MAYBE")}
        disabled={isLoading}
      >
        {rsvpStatus === "MAYBE" ? "✓ Maybe" : "Maybe"}
      </Button>
      <Button
        variant={rsvpStatus === "NOT_GOING" ? "default" : "outline"}
        className="w-full"
        onClick={() => handleRSVP("NOT_GOING")}
        disabled={isLoading}
      >
        {rsvpStatus === "NOT_GOING" ? "✓ Not Going" : "Not Going"}
      </Button>
      
      {/* Show Add to Calendar button when we have event details */}
      {eventTitle && eventDescription && eventLocation && eventStartTime && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          {/* Show different messages based on RSVP status */}
          {rsvpStatus === "GOING" && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Add this event to your calendar:
            </p>
          )}
          {rsvpStatus === "MAYBE" && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Add this event to your calendar as tentative:
            </p>
          )}
          {rsvpStatus === "NOT_GOING" && hasAddedToCalendars && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Update your calendar to show you&apos;re not attending:
            </p>
          )}
          {!rsvpStatus && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Add this event to your calendar:
            </p>
          )}
          
          {/* Show notification if RSVP status has changed and user has calendars */}
          {hasAddedToCalendars && rsvpStatus && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md mb-3">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Your RSVP status has changed. Please update your calendar to reflect your new status.
              </p>
            </div>
          )}
          
          <AddToCalendarButton
            eventId={eventId}
            title={eventTitle}
            description={eventDescription}
            location={eventLocation}
            startTime={new Date(eventStartTime)}
            endTime={eventEndTime ? new Date(eventEndTime) : undefined}
            rsvpStatus={rsvpStatus || undefined}
          />
        </div>
      )}
    </div>
  );
}
