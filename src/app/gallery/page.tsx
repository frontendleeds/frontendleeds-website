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

  // In a real application, this data would come from a database
  const galleryItems: GalleryItem[] = [
    {
      id: "1",
      title: "React Workshop",
      date: "April 2025",
      images: [
        "/frontend-leeds.jpg",
        "/globe.svg",
        "/file.svg",
        "/window.svg"
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
      
      <div className="container mx-auto px-4 py-12">
        <GalleryGrid items={galleryItems} />

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4 dark:text-white">Share Your Photos</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
            Were you at one of our events? We&apos;d love to see your photos! Tag us on social media or send them to us directly.
          </p>
          <div className="inline-flex items-center justify-center px-6 py-3 border border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 rounded-md hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 transition-colors duration-300">
            <a href="mailto:photos@frontendleeds.com">Submit Your Photos</a>
          </div>
        </div>
      </div>
    </>
  );
}
