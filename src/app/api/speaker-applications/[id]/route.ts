import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

// Schema for validating the request body
const updateSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
});

export async function PATCH(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    // Check if user is authenticated and is an admin
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to update an application" },
        { status: 401 }
      );
    }
    
    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can update application status" },
        { status: 403 }
      );
    }
    
    // Get application ID from params
    const { id } = params;
    
    // Parse request body
    const body = await req.json();
    
    // Validate request body
    const result = updateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: result.error.errors },
        { status: 400 }
      );
    }
    
    const { status } = result.data;
    
    // Check if application exists
    const application = await prisma.speakerApplication.findUnique({
      where: { id },
      select: { id: true, userId: true },
    });
    
    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }
    
    // Update application status
    const updatedApplication = await prisma.speakerApplication.update({
      where: { id },
      data: { status },
    });
    
    // Create notification for the user
    await prisma.notification.create({
      data: {
        title: `Speaker Application ${status}`,
        content: `Your speaker application has been ${status.toLowerCase()}.`,
        type: "SITE_ANNOUNCEMENT",
        userId: application.userId,
      },
    });
    
    return NextResponse.json({
      message: "Application status updated successfully",
      application: updatedApplication,
    });
  } catch (error) {
    console.error("Error updating application status:", error);
    return NextResponse.json(
      { error: "An error occurred while updating the application status" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to view an application" },
        { status: 401 }
      );
    }
    
    // Get application ID from params
    const { id } = params;
    
    // Fetch application
    const application = await prisma.speakerApplication.findUnique({
      where: { id },
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
    });
    
    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }
    
    // Check if user is authorized to view this application
    if (application.userId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "You are not authorized to view this application" },
        { status: 403 }
      );
    }
    
    return NextResponse.json(application);
  } catch (error) {
    console.error("Error fetching application:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching the application" },
      { status: 500 }
    );
  }
}
