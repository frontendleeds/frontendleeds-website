import { EventForm } from "@/components/admin/EventForm";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Create New Event | Frontend Leeds",
  description: "Create a new event for Frontend Leeds",
};

export default async function NewEventPage() {
  const session = await getServerSession(authOptions);
  
  // Check if user is authenticated and is an admin
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/auth/signin?callbackUrl=/admin/events/new");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Create New Event</h1>
        <EventForm />
      </div>
    </div>
  );
}
