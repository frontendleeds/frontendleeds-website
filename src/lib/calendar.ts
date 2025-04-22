/**
 * Utility functions for generating calendar links
 */

interface CalendarEvent {
  title: string;
  description: string;
  location: string;
  startTime: Date;
  endTime?: Date;
  url?: string;
  status?: 'GOING' | 'MAYBE' | 'NOT_GOING'; // RSVP status
}

// Store calendar event IDs in the database
export async function trackCalendarEvent(eventId: string, calendarType: string): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  
  try {
    const response = await fetch('/api/events/calendar-tracking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventId,
        calendarType,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to track calendar event: ${response.statusText}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error tracking calendar event:', error);
    return false;
  }
}

// Check if an event has been added to a specific calendar
export async function isCalendarEventTracked(eventId: string, calendarType: string): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  
  try {
    // Get all tracked calendars for this event
    const trackedCalendars = await getTrackedCalendars(eventId);
    
    // Check if this calendar type is in the list
    return trackedCalendars.includes(calendarType);
  } catch (error) {
    console.error('Error checking tracked calendar event:', error);
    return false;
  }
}

// Get all calendar types an event has been added to
export async function getTrackedCalendars(eventId: string): Promise<string[]> {
  if (typeof window === 'undefined') return [];
  
  try {
    const response = await fetch(`/api/events/calendar-tracking?eventId=${eventId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get tracked calendars: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.calendarTypes || [];
  } catch (error) {
    console.error('Error getting tracked calendars:', error);
    return [];
  }
}

// For client-side use, we'll also keep a local cache to avoid too many API calls
// This is just for UI purposes and will be refreshed when the page loads
const localCalendarCache: Record<string, string[]> = {};

// Update the local cache with the latest data from the server
export async function refreshCalendarCache(eventId: string): Promise<string[]> {
  try {
    const calendars = await getTrackedCalendars(eventId);
    localCalendarCache[eventId] = calendars;
    return calendars;
  } catch (error) {
    console.error('Error refreshing calendar cache:', error);
    return localCalendarCache[eventId] || [];
  }
}

// Get tracked calendars from the local cache, or fetch from the server if not available
export function getTrackedCalendarsFromCache(eventId: string): string[] {
  return localCalendarCache[eventId] || [];
}

// Update the local cache when a new calendar is added
export function updateLocalCalendarCache(eventId: string, calendarType: string): void {
  if (!localCalendarCache[eventId]) {
    localCalendarCache[eventId] = [];
  }
  
  if (!localCalendarCache[eventId].includes(calendarType)) {
    localCalendarCache[eventId].push(calendarType);
  }
}

/**
 * Format a date for use in calendar URLs
 * Format: YYYYMMDDTHHMMSSZ
 */
function formatDateForCalendar(date: Date): string {
  return date.toISOString().replace(/-|:|\.\d+/g, '');
}

/**
 * Generate a Google Calendar link
 * Includes RSVP status in the description if provided
 */
export function generateGoogleCalendarLink(event: CalendarEvent): string {
  const startTime = formatDateForCalendar(event.startTime);
  const endTime = event.endTime ? formatDateForCalendar(event.endTime) : formatDateForCalendar(new Date(event.startTime.getTime() + 60 * 60 * 1000)); // Default to 1 hour

  // Add RSVP status to description if provided
  let description = event.description;
  if (event.status) {
    const statusText = event.status === 'GOING' 
      ? 'I am attending this event' 
      : event.status === 'MAYBE' 
        ? 'I might attend this event' 
        : 'I am not attending this event';
    
    description = `${description}\n\nRSVP Status: ${statusText}`;
  }

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    details: description,
    location: event.location,
    dates: `${startTime}/${endTime}`,
  });

  if (event.url) {
    params.append('sprop', `website:${event.url}`);
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Generate an iCalendar file content
 * Includes RSVP status in the description if provided
 */
export function generateICalContent(event: CalendarEvent): string {
  const startTime = formatDateForCalendar(event.startTime);
  const endTime = event.endTime ? formatDateForCalendar(event.endTime) : formatDateForCalendar(new Date(event.startTime.getTime() + 60 * 60 * 1000)); // Default to 1 hour
  const now = formatDateForCalendar(new Date());
  const uid = `${now}-${Math.random().toString(36).substring(2, 11)}@frontendleeds.com`;

  // Add RSVP status to description if provided
  let description = event.description;
  if (event.status) {
    const statusText = event.status === 'GOING' 
      ? 'I am attending this event' 
      : event.status === 'MAYBE' 
        ? 'I might attend this event' 
        : 'I am not attending this event';
    
    description = `${description}\n\nRSVP Status: ${statusText}`;
  }

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Frontend Leeds//Calendar//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${uid}
SUMMARY:${event.title}
DESCRIPTION:${description.replace(/\n/g, '\\n')}
LOCATION:${event.location}
DTSTART:${startTime}
DTEND:${endTime}
DTSTAMP:${now}
END:VEVENT
END:VCALENDAR`;
}

/**
 * Generate an Apple Calendar link (uses iCal format)
 */
export function generateAppleCalendarLink(event: CalendarEvent): string {
  const icalContent = generateICalContent(event);
  const encodedContent = encodeURIComponent(icalContent);
  return `data:text/calendar;charset=utf-8,${encodedContent}`;
}

/**
 * Generate an Outlook Calendar link
 * Includes RSVP status in the description if provided
 */
export function generateOutlookCalendarLink(event: CalendarEvent): string {
  const startTime = formatDateForCalendar(event.startTime);
  const endTime = event.endTime ? formatDateForCalendar(event.endTime) : formatDateForCalendar(new Date(event.startTime.getTime() + 60 * 60 * 1000)); // Default to 1 hour

  // Add RSVP status to description if provided
  let description = event.description;
  if (event.status) {
    const statusText = event.status === 'GOING' 
      ? 'I am attending this event' 
      : event.status === 'MAYBE' 
        ? 'I might attend this event' 
        : 'I am not attending this event';
    
    description = `${description}\n\nRSVP Status: ${statusText}`;
  }

  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: event.title,
    body: description,
    location: event.location,
    startdt: startTime,
    enddt: endTime,
  });

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

/**
 * Generate a Yahoo Calendar link
 * Includes RSVP status in the description if provided
 */
export function generateYahooCalendarLink(event: CalendarEvent): string {
  const startTime = formatDateForCalendar(event.startTime);
  // Calculate duration in minutes
  const duration = Math.floor((event.endTime ? event.endTime.getTime() : event.startTime.getTime() + 60 * 60 * 1000 - event.startTime.getTime()) / (60 * 1000));

  // Add RSVP status to description if provided
  let description = event.description;
  if (event.status) {
    const statusText = event.status === 'GOING' 
      ? 'I am attending this event' 
      : event.status === 'MAYBE' 
        ? 'I might attend this event' 
        : 'I am not attending this event';
    
    description = `${description}\n\nRSVP Status: ${statusText}`;
  }

  const params = new URLSearchParams({
    v: '60',
    title: event.title,
    desc: description,
    in_loc: event.location,
    st: startTime,
    dur: duration.toString(),
  });

  return `https://calendar.yahoo.com/?${params.toString()}`;
}
