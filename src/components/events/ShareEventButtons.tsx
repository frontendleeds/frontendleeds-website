"use client";

import { useState } from "react";
import { FiCopy, FiTwitter } from "react-icons/fi";
import { AddToCalendarButton } from "@/components/events/AddToCalendarButton";

interface ShareEventButtonsProps {
  eventId: string;
  title: string;
  description?: string;
  location?: string;
  startTime?: Date;
  endTime?: Date;
}

export function ShareEventButtons({ 
  eventId, 
  title,
  description,
  location,
  startTime,
  endTime
}: ShareEventButtonsProps) {
  const [copied, setCopied] = useState(false);
  
  const eventUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/events/${eventId}`
    : `/events/${eventId}`;
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(eventUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  const handleShareTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this event: ${title}`)}&url=${encodeURIComponent(eventUrl)}`;
    window.open(twitterUrl, '_blank');
  };
  
  return (
    <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
      <button 
        onClick={handleCopyLink}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors flex items-center"
      >
        <FiCopy className="mr-2" />
        {copied ? "Copied!" : "Copy Link"}
      </button>
      <button 
        onClick={handleShareTwitter}
        className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-50 transition-colors flex items-center dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
      >
        <FiTwitter className="mr-2 text-blue-400" />
        Share on Twitter
      </button>
      
      {/* Add to Calendar button if we have event details */}
      {description && location && startTime && (
          <AddToCalendarButton
            eventId={eventId}
            title={title}
            description={description}
            location={location}
            startTime={new Date(startTime)}
            endTime={endTime ? new Date(endTime) : undefined}
            // No RSVP status for the share section, as the user might not have RSVP'd yet
          />
      )}
    </div>
  );
}
