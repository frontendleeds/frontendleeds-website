import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Role } from "@prisma/client";

const updateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Please enter a valid email address").optional(),
  role: z.enum([Role.USER, Role.ADMIN], {
    errorMap: () => ({ message: "Invalid role" }),
  }).optional(),
});

export async function POST(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated and is an admin
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      role: formData.get("role") as Role,
    };

    // Validate the data
    const result = updateUserSchema.safeParse(data);
    if (!result.success) {
      return NextResponse.json(
        { message: "Invalid input data", errors: result.error.errors },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Check if email is already taken by another user
    if (data.email && data.email !== existingUser.email) {
      const userWithEmail = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (userWithEmail) {
        return NextResponse.json(
          { message: "Email is already taken" },
          { status: 409 }
        );
      }
    }

    // Update the user
    await prisma.user.update({
      where: { id: params.id },
      data: {
        name: data.name,
        email: data.email,
        role: data.role,
      },
    });

    // Redirect to the users list
    return NextResponse.redirect(new URL("/admin/users", req.url));
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
