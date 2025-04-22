"use client";

import { useState } from "react";
import Image from "next/image";
import { GalleryLightbox } from "./GalleryLightbox";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface GalleryItem {
  id: string;
  title: string;
  date: string;
  images?: string[];
  icon?: React.ReactNode;
}

interface GalleryGridProps {
  items: GalleryItem[];
}

export function GalleryGrid({ items }: GalleryGridProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [selectedImageIndices, setSelectedImageIndices] = useState<number[]>(items.map(() => 0));
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const openLightbox = (itemIndex: number) => {
    setSelectedItemIndex(itemIndex);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const navigateImage = (itemIndex: number, direction: 'prev' | 'next') => {
    setSelectedImageIndices(prevIndices => {
      const newIndices = [...prevIndices];
      const item = items[itemIndex];
      const imageCount = item.images?.length || 0;
      
      if (imageCount <= 1) return prevIndices;
      
      if (direction === 'prev') {
        newIndices[itemIndex] = (newIndices[itemIndex] - 1 + imageCount) % imageCount;
      } else {
        newIndices[itemIndex] = (newIndices[itemIndex] + 1) % imageCount;
      }
      
      return newIndices;
    });
  };

  // Handle touch events for swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent, itemIndex: number) => {
    if (touchStartX === null) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartX;
    
    // If the swipe is significant enough (more than 50px)
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe right, go to previous image
        navigateImage(itemIndex, 'prev');
      } else {
        // Swipe left, go to next image
        navigateImage(itemIndex, 'next');
      }
    }
    
    setTouchStartX(null);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, itemIndex) => {
          const currentImageIndex = selectedImageIndices[itemIndex];
          const hasMultipleImages = item.images && item.images.length > 1;
          
          return (
            <div 
              key={item.id}
              className="rounded-lg overflow-hidden shadow-md hover:shadow-lg duration-300 cursor-pointer transform hover:scale-[1.02] transition-transform"
            >
              <div 
                className="relative h-64"
                onTouchStart={(e) => handleTouchStart(e)}
                onTouchEnd={(e) => handleTouchEnd(e, itemIndex)}
              >
                {item.images && item.images.length > 0 ? (
                  <>
                    <div className="relative w-full h-full" onClick={() => openLightbox(itemIndex)}>
                      <Image 
                        src={item.images[currentImageIndex]} 
                        alt={`${item.title} - Image ${currentImageIndex + 1}`} 
                        fill
                        className="object-cover transition-opacity duration-300"
                      />
                      
                      {/* Image counter indicator */}
                      {hasMultipleImages && (
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full">
                          {currentImageIndex + 1} / {item.images.length}
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-opacity duration-300 flex items-center justify-center">
                        <div className="text-white opacity-0 hover:opacity-100 transition-opacity duration-300 text-center">
                          <span className="bg-blue-600 rounded-full p-2 inline-flex">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Navigation arrows - only show if there are multiple images */}
                    {hasMultipleImages && (
                      <>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigateImage(itemIndex, 'prev');
                          }}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70 transition-all duration-200 focus:outline-none z-20"
                          aria-label="Previous image"
                        >
                          <FiChevronLeft size={20} />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigateImage(itemIndex, 'next');
                          }}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70 transition-all duration-200 focus:outline-none z-20"
                          aria-label="Next image"
                        >
                          <FiChevronRight size={20} />
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div 
                    className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700"
                    onClick={() => openLightbox(itemIndex)}
                  >
                    <span className="text-gray-400 dark:text-gray-300 text-5xl">
                      {item.icon}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-4 bg-white dark:bg-gray-800">
                <h3 className="font-semibold text-lg dark:text-white">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">{item.date}</p>
                
                {/* Dot indicators for multiple images */}
                {hasMultipleImages && item.images && (
                  <div className="flex justify-center mt-3 space-x-1">
                    {item.images.map((_, dotIndex) => (
                      <button
                        key={dotIndex}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedImageIndices(prev => {
                            const newIndices = [...prev];
                            newIndices[itemIndex] = dotIndex;
                            return newIndices;
                          });
                        }}
                        className={`w-2 h-2 rounded-full transition-all duration-200 ${
                          dotIndex === currentImageIndex 
                            ? 'bg-blue-600 dark:bg-blue-500 w-3' 
                            : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                        aria-label={`Go to image ${dotIndex + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {lightboxOpen && (
        <GalleryLightbox 
          items={items}
          initialIndex={selectedItemIndex}
          initialImageIndices={selectedImageIndices}
          onClose={closeLightbox}
        />
      )}
    </>
  );
}
