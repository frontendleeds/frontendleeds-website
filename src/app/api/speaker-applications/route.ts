import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

// Schema for validating the request body
const applicationSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  experience: z.string().min(10, "Experience must be at least 10 characters"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  githubUrl: z.string().url().optional().or(z.literal("")),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  twitterUrl: z.string().url().optional().or(z.literal("")),
  additionalInfo: z.string().optional(),
  eventId: z.string().optional().or(z.literal("")),
});

export async function POST(req: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to submit an application" },
        { status: 401 }
      );
    }
    
    // Parse request body
    const body = await req.json();
    
    // Validate request body
    const result = applicationSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: result.error.errors },
        { status: 400 }
      );
    }
    
    const {
      title,
      description,
      experience,
      bio,
      githubUrl,
      linkedinUrl,
      websiteUrl,
      twitterUrl,
      additionalInfo,
      eventId,
    } = result.data;
    
    // Check if eventId is valid if provided
    if (eventId) {
      const event = await prisma.event.findUnique({
        where: { id: eventId },
      });
      
      if (!event) {
        return NextResponse.json(
          { error: "Event not found" },
          { status: 404 }
        );
      }
    }
    
    // Create the application
    const application = await prisma.speakerApplication.create({
      data: {
        title,
        description,
        experience,
        bio,
        githubUrl: githubUrl || null,
        linkedinUrl: linkedinUrl || null,
        websiteUrl: websiteUrl || null,
        twitterUrl: twitterUrl || null,
        additionalInfo: additionalInfo || null,
        eventId: eventId || null,
        userId: session.user.id,
      },
    });
    
    // Create notification for admins
    const admins = await prisma.user.findMany({
      where: { role: "ADMIN" },
      select: { id: true },
    });
    
    // Create a notification for each admin
    for (const admin of admins) {
      await prisma.notification.create({
        data: {
          title: "New Speaker Application",
          content: `A new speaker application has been submitted by ${session.user.name || session.user.email}`,
          type: "SITE_ANNOUNCEMENT",
          userId: admin.id,
        },
      });
    }
    
    return NextResponse.json({
      message: "Application submitted successfully",
      application,
    }, { status: 201 });
  } catch (error) {
    console.error("Error submitting application:", error);
    return NextResponse.json(
      { error: "An error occurred while submitting your application" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Check if user is authenticated and is an admin
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to view applications" },
        { status: 401 }
      );
    }
    
    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can view all applications" },
        { status: 403 }
      );
    }
    
    // Get query parameters
    const url = new URL(req.url);
    const status = url.searchParams.get("status");
    
    // Build the query
    const query: {
      status?: "PENDING" | "APPROVED" | "REJECTED";
    } = {};
    
    if (status && ["PENDING", "APPROVED", "REJECTED"].includes(status)) {
      query.status = status as "PENDING" | "APPROVED" | "REJECTED";
    }
    
    // Fetch applications
    const applications = await prisma.speakerApplication.findMany({
      where: query,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        event: {
          select: {
            id: true,
            title: true,
            startTime: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    
    return NextResponse.json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching applications" },
      { status: 500 }
    );
  }
}
