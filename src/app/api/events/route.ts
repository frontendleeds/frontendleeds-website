import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const upcoming = url.searchParams.get("upcoming") === "true";
    
    // Build the query
    const query: {
      published: boolean;
      startTime?: {
        gte: Date;
      };
    } = {
      published: true,
    };
    
    // If upcoming is true, only return events that haven't happened yet
    if (upcoming) {
      query.startTime = {
        gte: new Date(),
      };
    }
    
    // Fetch events
    const events = await prisma.event.findMany({
      where: query,
      orderBy: {
        startTime: upcoming ? "asc" : "desc",
      },
      select: {
        id: true,
        title: true,
        description: true,
        location: true,
        startTime: true,
        endTime: true,
        imageUrl: true,
        capacity: true,
      },
    });
    
    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  location: z.string().min(3, "Location must be at least 3 characters"),
  startTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Start time must be a valid date",
  }),
  endTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "End time must be a valid date",
  }),
  imageUrl: z.string().optional(),
  capacity: z.string().optional(),
  published: z.boolean(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is an admin
    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Forbidden: Only admins can create events" },
        { status: 403 }
      );
    }

    const body = await req.json();
    
    // Validate the request body
    const result = eventSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { message: "Invalid input data", errors: result.error.errors },
        { status: 400 }
      );
    }

    const { 
      title, 
      description, 
      content, 
      location, 
      startTime, 
      endTime, 
      imageUrl, 
      capacity, 
      published 
    } = result.data;

    // Create the event
    const event = await prisma.event.create({
      data: {
        title,
        description,
        content,
        location,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        imageUrl,
        capacity: capacity ? parseInt(capacity) : null,
        published,
        creatorId: session.user.id,
      },
    });

    return NextResponse.json(
      { message: "Event created successfully", event },
      { status: 201 }
    );
  } catch (error) {
    console.error("Event creation error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
