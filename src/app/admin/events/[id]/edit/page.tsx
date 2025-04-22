import { EventForm } from "@/components/admin/EventForm";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";

interface EditEventPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata(props: EditEventPageProps) {
  const params = await props.params;
  const event = await prisma.event.findUnique({
    where: { id: params.id },
  });

  if (!event) {
    return {
      title: "Event Not Found | Frontend Leeds",
    };
  }

  return {
    title: `Edit ${event.title} | Frontend Leeds`,
    description: `Edit details for ${event.title}`,
  };
}

export default async function EditEventPage(props: EditEventPageProps) {
  const params = await props.params;
  const session = await getServerSession(authOptions);

  // Check if user is authenticated and is an admin
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/auth/signin?callbackUrl=/admin/events");
  }

  const event = await prisma.event.findUnique({
    where: {
      id: params.id,
      creatorId: session.user.id, // Ensure the event belongs to the current user
    },
  });

  if (!event) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Edit Event: {event.title}</h1>
        <EventForm event={event} isEditing={true} />
      </div>
    </div>
  );
}
