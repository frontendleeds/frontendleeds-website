import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

// Helper function to check if the user is authorized to modify the event
async function isAuthorized(eventId: string, userId: string) {
  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
  });

  return event && event.creatorId === userId;
}

export async function POST(req: NextRequest, props: { params: Promise<{ id: string }> }) {
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

    // Redirect to the events list
    return NextResponse.redirect(new URL("/admin/events", req.url));
  } catch (error) {
    console.error("Event deletion error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
