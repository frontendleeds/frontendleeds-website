import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

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

// Helper function to check if the user is authorized to modify the event
async function isAuthorized(eventId: string, userId: string) {
  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
  });

  return event && event.creatorId === userId;
}

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
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
        { message: "Forbidden: Only admins can update events" },
        { status: 403 }
      );
    }

    // Check if the user is authorized to update this event
    const authorized = await isAuthorized(params.id, session.user.id);
    if (!authorized) {
      return NextResponse.json(
        { message: "Forbidden: You can only update your own events" },
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

    // Update the event
    const event = await prisma.event.update({
      where: {
        id: params.id,
      },
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
      },
    });

    return NextResponse.json(
      { message: "Event updated successfully", event },
      { status: 200 }
    );
  } catch (error) {
    console.error("Event update error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
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
        { message: "Forbidden: Only admins can delete events" },
        { status: 403 }
      );
    }

    // Check if the user is authorized to delete this event
    const authorized = await isAuthorized(params.id, session.user.id);
    if (!authorized) {
      return NextResponse.json(
        { message: "Forbidden: You can only delete your own events" },
        { status: 403 }
      );
    }

    // Delete all RSVPs for this event
    await prisma.rSVP.deleteMany({
      where: {
        eventId: params.id,
      },
    });

    // Delete all notifications for this event
    await prisma.notification.deleteMany({
      where: {
        eventId: params.id,
      },
    });

    // Delete the event
    await prisma.event.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json(
      { message: "Event deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Event deletion error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
