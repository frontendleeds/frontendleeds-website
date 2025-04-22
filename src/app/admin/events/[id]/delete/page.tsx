import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";


interface DeleteEventPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}
export async function generateMetadata(props: DeleteEventPageProps): Promise<Metadata> {
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
    title: `Delete ${event.title} | Frontend Leeds`,
    description: `Delete ${event.title} from the system`,
  };
}

export default async function DeleteEventPage(props: DeleteEventPageProps) {
  const params = await props.params;
  const session = await getServerSession(authOptions);

  // Check if user is authenticated and is an admin
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/auth/signin?callbackUrl=/admin/events");
  }

  // Fetch the event
  const event = await prisma.event.findUnique({
    where: {
      id: params.id,
    },
    include: {
      _count: {
        select: {
          rsvps: true,
        },
      },
    },
  });

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Event Not Found</h1>
          <p className="mb-4 text-gray-700 dark:text-gray-300">The event you are looking for does not exist.</p>
          <Link href="/admin/events">
            <Button>Back to Events</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Delete Event</h1>
        
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-md p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400 dark:text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-400">Warning</h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                <p>
                  You are about to delete the event &quot;{event.title}&quot;. This action cannot be undone.
                </p>
                {event._count.rsvps > 0 && (
                  <p className="mt-1">
                    This event has {event._count.rsvps} RSVP(s). These RSVPs will be deleted.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <Link href="/admin/events">
            <Button variant="outline">Cancel</Button>
          </Link>
          <form action={`/api/events/${event.id}`} method="POST">
            <Button type="submit" variant="destructive">Delete Event</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
