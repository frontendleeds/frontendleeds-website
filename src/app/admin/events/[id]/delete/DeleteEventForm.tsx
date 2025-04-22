"use client";

import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DeleteEventFormProps {
  eventId: string;
}

export default function DeleteEventForm({ eventId }: DeleteEventFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Failed to delete event");
        return;
      }

      router.push("/admin/events");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-md">
          {error}
        </div>
      )}

      <div className="flex justify-end space-x-4">
        <Button
          variant="outline"
          onClick={() => router.push("/admin/events")}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          variant="destructive"
          onClick={handleDelete}
          isLoading={isLoading}
        >
          Delete Event
        </Button>
      </div>
    </>
  );
}
