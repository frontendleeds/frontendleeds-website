import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to view your applications" },
        { status: 401 }
      );
    }
    
    // Get user ID from session
    const userId = session.user.id;
    
    // Fetch user's applications
    const applications = await prisma.speakerApplication.findMany({
      where: {
        userId,
      },
      include: {
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
    console.error("Error fetching user applications:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching your applications" },
      { status: 500 }
    );
  }
}
