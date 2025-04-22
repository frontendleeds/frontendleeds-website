-- Add CalendarTracking table to track which calendars an event has been added to
CREATE TABLE "CalendarTracking" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "calendarType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CalendarTracking_pkey" PRIMARY KEY ("id")
);

-- Create a unique constraint to prevent duplicate entries
CREATE UNIQUE INDEX "CalendarTracking_userId_eventId_calendarType_key" ON "CalendarTracking"("userId", "eventId", "calendarType");

-- Add foreign key constraints
ALTER TABLE "CalendarTracking" ADD CONSTRAINT "CalendarTracking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CalendarTracking" ADD CONSTRAINT "CalendarTracking_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
