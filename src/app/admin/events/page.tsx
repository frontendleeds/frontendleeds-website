import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { FiEdit, FiEye, FiTrash2 } from "react-icons/fi";

export default async function AdminEventsPage() {
  const session = await getServerSession(authOptions);
  
  // Check if user is authenticated and is an admin
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/auth/signin?callbackUrl=/admin/events");
  }

  // Fetch all events created by the admin
  const events = await prisma.event.findMany({
    where: {
      creatorId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          rsvps: {
            where: {
              status: "GOING",
            },
          },
        },
      },
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold dark:text-white">Manage Events</h1>
        <Link href="/admin/events/new">
          <Button>Create New Event</Button>
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2 dark:text-white">No events found</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            You haven&apos;t created any events yet. Click the button above to create your first event.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Event
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Attendees
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {events.map((event) => (
                <tr key={event.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {event.title}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {event.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {formatDate(event.startTime)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        event.published
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                      }`}
                    >
                      {event.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {event._count.rsvps}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link href={`/events/${event.id}`}>
                        <Button variant="ghost" size="sm">
                          <FiEye className="mr-1" />
                          View
                        </Button>
                      </Link>
                      <Link href={`/admin/events/${event.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <FiEdit className="mr-1" />
                          Edit
                        </Button>
                      </Link>
                      <Link href={`/admin/events/${event.id}/delete`}>
                        <Button variant="ghost" size="sm">
                          <FiTrash2 className="mr-1" />
                          Delete
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
