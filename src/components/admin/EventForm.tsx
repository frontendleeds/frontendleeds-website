"use client";

import { Button } from "@/components/ui/Button";
import { Form, FormField } from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Event } from "@prisma/client";

const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  location: z.string().min(3, "Location must be at least 3 characters").optional(),
  startTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Start time must be a valid date",
  }),
  endTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "End time must be a valid date",
  }),
  imageUrl: z.string().optional(),
  capacity: z.string().optional(),
  published: z.boolean(),
  isPast:z.boolean().optional()
});

type EventFormValues = z.infer<typeof eventSchema>;

interface EventFormProps {
  event?: Event;
  isEditing?: boolean;
}

export function EventForm({ event, isEditing = false }: EventFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Helper function to format date for datetime-local input in Europe/London timezone
  const formatDateForInput = (date: Date | null | undefined): string => {
    if (!date) return "";
    
    // Format the date in Europe/London timezone
    const formatter = new Intl.DateTimeFormat('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'Europe/London'
    });
    
    // Convert "DD/MM/YYYY, HH:MM:SS" to "YYYY-MM-DDTHH:MM"
    const formattedDate = formatter.format(new Date(date))
      .replace(/(\d+)\/(\d+)\/(\d+), (\d+):(\d+):(\d+)/, '$3-$2-$1T$4:$5');
    
    return formattedDate;
  };

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: event?.title || "",
      description: event?.description || "",
      content: event?.content || "",
      location: event?.location || "",
      startTime: formatDateForInput(event?.startTime),
      endTime: formatDateForInput(event?.endTime),
      imageUrl: event?.imageUrl || "",
      capacity: event?.capacity?.toString() || "",
      published: event?.published || false,
    },
  });

  const onSubmit = async (data: EventFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const endpoint = isEditing
        ? `/api/events/${event?.id}`
        : "/api/events";
      const method = isEditing ? "PUT" : "POST";

      // Helper function to convert local datetime to Europe/London timezone
      const convertToLondonTime = (dateString: string) => {
        // Parse the local datetime string
        const localDate = new Date(dateString);
        
        // Format the date in a way that it's interpreted as Europe/London time
        // This creates a string like "2025-05-13T15:00:00" and explicitly states it's in Europe/London timezone
        const londonDateString = new Intl.DateTimeFormat('en-GB', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZone: 'Europe/London'
        }).format(localDate).replace(/(\d+)\/(\d+)\/(\d+), (\d+):(\d+):(\d+)/, '$3-$2-$1T$4:$5:$6');
        
        // Create a new Date object from this string and convert to ISO
        return new Date(londonDateString).toISOString();
      };

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          startTime: convertToLondonTime(data.startTime),
          endTime: convertToLondonTime(data.endTime),
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        setError(responseData.message || "Something went wrong");
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
    <div className="space-y-6">
      <Form form={form} onSubmit={onSubmit}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            name="title"
            label="Event Title"
            error={form.formState.errors.title?.message}
          >
            <Input
              id="title"
              placeholder="Frontend Workshop"
              disabled={isLoading}
              {...form.register("title")}
            />
          </FormField>

          <FormField
            name="location"
            label="Location"
            error={form.formState.errors.location?.message}
          >
            <Input
              id="location"
              placeholder="Leeds Digital Hub"
              disabled={isLoading}
              {...form.register("location")}
            />
          </FormField>

          <FormField
            name="startTime"
            label="Start Time"
            error={form.formState.errors.startTime?.message}
          >
            <Input
              id="startTime"
              type="datetime-local"
              disabled={isLoading}
              {...form.register("startTime")}
            />
          </FormField>

          <FormField
            name="endTime"
            label="End Time"
            error={form.formState.errors.endTime?.message}
          >
            <Input
              id="endTime"
              type="datetime-local"
              disabled={isLoading}
              {...form.register("endTime")}
            />
          </FormField>

          <FormField
            name="imageUrl"
            label="Image URL (optional)"
            error={form.formState.errors.imageUrl?.message}
          >
            <Input
              id="imageUrl"
              placeholder="https://example.com/image.jpg"
              disabled={isLoading}
              {...form.register("imageUrl")}
            />
          </FormField>

          <FormField
            name="capacity"
            label="Capacity (optional)"
            error={form.formState.errors.capacity?.message}
          >
            <Input
              id="capacity"
              type="number"
              placeholder="50"
              disabled={isLoading}
              {...form.register("capacity")}
            />
          </FormField>
        </div>

        <FormField
          name="description"
          label="Short Description"
          error={form.formState.errors.description?.message}
        >
          <textarea
            id="description"
            className="flex w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
            placeholder="A brief description of your event"
            disabled={isLoading}
            {...form.register("description")}
          />
        </FormField>

        <FormField
          name="content"
          label="Full Content (Markdown supported)"
          error={form.formState.errors.content?.message}
        >
          <textarea
            id="content"
            className="flex w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 min-h-[200px]"
            placeholder="Full details about your event. Markdown formatting is supported."
            disabled={isLoading}
            {...form.register("content")}
          />
        </FormField>

        <div className="flex items-center mt-4 space-x-2">
          <input
            type="checkbox"
            id="published"
            className="text-blue-600 border-gray-300 rounded dark:border-gray-700 dark:text-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
            {...form.register("published")}
          />
          <label htmlFor="published" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Publish this event (make it visible to users)
          </label>
        </div>

        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

        <div className="flex justify-end mt-8 space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/events")}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {isEditing ? "Update Event" : "Create Event"}
          </Button>
        </div>
      </Form>
    </div>
  );
}
