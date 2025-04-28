import { Metadata } from "next";
import { Hero } from "@/components/layout/Hero";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";

export const metadata: Metadata = {
  title: "Gallery | Frontend Leeds",
  description: "Photos from our past events and meetups",
};

interface GalleryItem {
  id: string;
  title: string;
  date: string;
  images?: string[];
  icon?: React.ReactNode;
}

export default function GalleryPage() {

  const galleryItems: GalleryItem[] = [
    {
      id: "1",
      title: "Setting Up the Frontend Workspace",
      date: "March 2025",
      images: [
        "/frontend-leeds.jpg",
        "/img2.jpg",
      ],
    },
  ];

  return (
    <>
      <Hero 
        title="Community Gallery"
        subtitle="Take a look at photos from our past events and meetups. Join us at our next event to be part of the community!"
        backgroundImage="/frontend-leeds.jpg"
      />
      
      <div className="container px-4 py-12 mx-auto">
        <GalleryGrid items={galleryItems} />

        <div className="mt-16 text-center">
          <h2 className="mb-4 text-2xl font-bold dark:text-white">Share Your Photos</h2>
          <p className="max-w-2xl mx-auto mb-6 text-gray-600 dark:text-gray-300">
            Were you at one of our events? We&apos;d love to see your photos! Tag us on social media or send them to us directly.
          </p>
          <div className="inline-flex items-center justify-center px-6 py-3 text-blue-600 transition-colors duration-300 border border-blue-600 rounded-md dark:border-blue-400 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500">
            <a href="mailto:photos@frontendleeds.com">Submit Your Photos</a>
          </div>
        </div>
      </div>
    </>
  );
}
