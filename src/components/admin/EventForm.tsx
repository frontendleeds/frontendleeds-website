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
  location: z.string().min(3, "Location must be at least 3 characters"),
  startTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Start time must be a valid date",
  }),
  endTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "End time must be a valid date",
  }),
  imageUrl: z.string().optional(),
  capacity: z.string().optional(),
  published: z.boolean(),
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

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: event?.title || "",
      description: event?.description || "",
      content: event?.content || "",
      location: event?.location || "",
      startTime: event?.startTime
        ? new Date(event.startTime).toISOString().slice(0, 16)
        : "",
      endTime: event?.endTime
        ? new Date(event.endTime).toISOString().slice(0, 16)
        : "",
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

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          startTime: new Date(data.startTime).toISOString(),
          endTime: new Date(data.endTime).toISOString(),
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

        <div className="flex items-center space-x-2 mt-4">
          <input
            type="checkbox"
            id="published"
            className="rounded border-gray-300 dark:border-gray-700 text-blue-600 dark:text-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
            {...form.register("published")}
          />
          <label htmlFor="published" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Publish this event (make it visible to users)
          </label>
        </div>

        {error && <p className="text-sm text-red-500 mt-4">{error}</p>}

        <div className="flex justify-end space-x-4 mt-8">
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
