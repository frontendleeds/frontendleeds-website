-- CreateTable
CREATE TABLE "SpeakerApplication" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "experience" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "githubUrl" TEXT,
    "linkedinUrl" TEXT,
    "websiteUrl" TEXT,
    "twitterUrl" TEXT,
    "additionalInfo" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "eventId" TEXT,
    CONSTRAINT "SpeakerApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SpeakerApplication_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "SpeakerApplication_userId_idx" ON "SpeakerApplication"("userId");

-- CreateIndex
CREATE INDEX "SpeakerApplication_eventId_idx" ON "SpeakerApplication"("eventId");
