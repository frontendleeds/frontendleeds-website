"use client";

import { Suspense, useState } from "react";
import { RSVPStatus } from "@prisma/client";
import { RSVPButton } from "@/components/events/RSVPButton";
import {  FiUsers, FiChevronDown } from "react-icons/fi";
import { formatDate } from "@/lib/utils";

function AvailableTicketsBar({ 
    capacity, 
    attendeeCount, 
    eventId, 
    currentStatus, 
    eventTitle,
    eventDescription,
    eventLocation,
    eventStartTime,
    eventEndTime
  }: { 
    capacity: number | null, 
    attendeeCount: number,
    eventId: string,
    currentStatus: RSVPStatus | null,
    eventTitle: string,
    eventDescription: string,
    eventLocation: string,
    eventStartTime: Date,
    eventEndTime: Date | undefined
  }) {
    const [isExpanded, setIsExpanded] = useState(false);
    
    // Initialize variables for capacity display
    let statusText = "Join this event";
    let progressBarColor = "bg-blue-600 dark:bg-blue-500";
    let iconBgColor = "bg-blue-100 dark:bg-blue-900/30";
    let iconColor = "text-blue-600 dark:text-blue-400";
    let availableTickets = 0;
    let percentageFilled = 0;
    
    // If capacity is set, calculate availability
    if (capacity) {
      availableTickets = capacity - attendeeCount;
      percentageFilled = Math.round((attendeeCount / capacity) * 100);
      
      // Determine status and color based on capacity
      if (percentageFilled >= 100) {
        statusText = "still accepting attendees";
        progressBarColor = "bg-red-600 dark:bg-red-500";
        iconBgColor = "bg-red-100 dark:bg-red-900/30";
        iconColor = "text-red-600 dark:text-red-400";
      } else if (percentageFilled >= 80) {
        statusText = "tickets left (limited)";
        progressBarColor = "bg-yellow-500 dark:bg-yellow-500";
        iconBgColor = "bg-yellow-100 dark:bg-yellow-900/30";
        iconColor = "text-yellow-600 dark:text-yellow-400";
      } else {
        statusText = "tickets available";
      }
    }


    const isPast = new Date() > new Date(eventEndTime)

    return (
      <div className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50 md:hidden transition-all duration-300 ease-in-out ${isExpanded ? 'h-auto max-h-80' : 'h-auto max-h-24'}`}>
         {
          isPast ? <div className="flex items-center justify-center p-3">Event has Passed</div> :  <div className="container p-3 mx-auto">
          {/* Expandable header - always visible */}
          <div 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="flex items-center">
              <div className={`${iconBgColor} p-2 rounded-full mr-2 transition-all duration-300`}>
                <FiUsers className={iconColor} size={18} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {percentageFilled >= 100 ? 'Limited space' : availableTickets} {statusText}
                </p>
                <div className="w-32 h-2 mt-1 bg-gray-200 rounded-full dark:bg-gray-700">
                  <div 
                    className={`h-2 ${progressBarColor} rounded-full transition-all duration-500 ease-out`} 
                    style={{ width: `${Math.min(percentageFilled, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              {capacity ? (
                <p className="mr-2 text-xs text-gray-500 dark:text-gray-400">
                  {attendeeCount}/{capacity} spots filled
                </p>
              ) : (
                <p className="mr-2 text-xs text-gray-500 dark:text-gray-400">
                  {attendeeCount} attendees
                </p>
              )}
              
              {/* Expand/collapse indicator */}
              <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                <FiChevronDown className="text-gray-500 dark:text-gray-400" />
              </div>
            </div>
          </div>
          
          {/* Expandable content */}
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-60 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
            {/* Additional event details */}
            <div className="p-3 mb-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Date:</p>
                  <p className="font-medium text-gray-900 dark:text-white">{formatDate(eventStartTime)}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Time:</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(eventStartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {eventEndTime && ` - ${new Date(eventEndTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500 dark:text-gray-400">Location:</p>
                  <p className="font-medium text-gray-900 dark:text-white">{eventLocation}</p>
                </div>
              </div>
            </div>
            
          
            {capacity && (
              <div className="mb-3">
                <div className="flex justify-between mb-1 text-xs text-gray-500 dark:text-gray-400">
                  <span>0</span>
                  <span>{capacity}</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full dark:bg-gray-700">
                  <div 
                    className={`h-3 ${progressBarColor} rounded-full transition-all duration-500 ease-out`} 
                    style={{ width: `${Math.min(percentageFilled, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <span>{percentageFilled}% filled</span>
                  <span>{availableTickets} available</span>
                </div>
              </div>
            )}
          </div>
          
        
          <div className={`transition-all duration-300 ${isExpanded ? 'mt-3' : 'mt-2'}`}>
            <Suspense fallback={<div className="h-10 bg-gray-200 rounded animate-pulse"></div>}>
              <RSVPButton
                eventId={eventId}
                currentStatus={currentStatus}
                eventTitle={eventTitle}
                eventDescription={eventDescription}
                eventLocation={eventLocation}
                eventStartTime={eventStartTime}
                eventEndTime={eventEndTime}
              />
            </Suspense>
          </div>
        </div>
         }
      </div>
    );
  }

  export default AvailableTicketsBar