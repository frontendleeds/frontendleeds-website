import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const rsvpSchema = z.object({
  eventId: z.string(),
  status: z.enum(["GOING", "NOT_GOING", "MAYBE"]),
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

    const body = await req.json();
    
    // Validate the request body
    const result = rsvpSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { message: "Invalid input data", errors: result.error.errors },
        { status: 400 }
      );
    }

    const { eventId, status } = result.data;
    const userId = session.user.id;

    // Check if the event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId, published: true },
    });

    if (!event) {
      return NextResponse.json(
        { message: "Event not found" },
        { status: 404 }
      );
    }

    // Check if the user has already RSVP'd to this event
    const existingRsvp = await prisma.rSVP.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
    });

    let rsvp;

    if (existingRsvp) {
      // Update existing RSVP
      rsvp = await prisma.rSVP.update({
        where: {
          id: existingRsvp.id,
        },
        data: {
          status,
        },
      });
    } else {
      // Create new RSVP
      rsvp = await prisma.rSVP.create({
        data: {
          userId,
          eventId,
          status,
        },
      });
    }

    return NextResponse.json(
      { message: "RSVP updated successfully", rsvp },
      { status: 200 }
    );
  } catch (error) {
    console.error("RSVP error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
