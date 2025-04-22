"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface GalleryItem {
  id: string;
  title: string;
  date: string;
  images?: string[];
  icon?: React.ReactNode;
}

interface GalleryLightboxProps {
  items: GalleryItem[];
  initialIndex: number;
  initialImageIndices?: number[];
  onClose: () => void;
}

export function GalleryLightbox({ items, initialIndex, initialImageIndices, onClose }: GalleryLightboxProps) {
  const [currentItemIndex, setCurrentItemIndex] = useState(initialIndex);
  const [imageIndices, setImageIndices] = useState<number[]>(initialImageIndices || items.map(() => 0));
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  
  const currentItem = items[currentItemIndex];
  const currentImageIndex = imageIndices[currentItemIndex];
  const currentImage = currentItem.images?.[currentImageIndex];
  
  const navigateItem = (direction: 'prev' | 'next') => {
    setCurrentItemIndex((prevIndex) => {
      if (direction === 'prev') {
        return (prevIndex - 1 + items.length) % items.length;
      } else {
        return (prevIndex + 1) % items.length;
      }
    });
  };
  
  const navigateImage = (direction: 'prev' | 'next') => {
    if (!currentItem.images || currentItem.images.length <= 1) return;
    
    setImageIndices(prevIndices => {
      const newIndices = [...prevIndices];
      const imageCount = currentItem.images?.length || 0;
      
      if (direction === 'prev') {
        newIndices[currentItemIndex] = (currentImageIndex - 1 + imageCount) % imageCount;
      } else {
        newIndices[currentItemIndex] = (currentImageIndex + 1) % imageCount;
      }
      
      return newIndices;
    });
  };
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        // If there are multiple images for the current item, navigate between them first
        if (currentItem.images && currentItem.images.length > 1 && currentImageIndex > 0) {
          navigateImage('prev');
        } else {
          // Otherwise navigate to the previous item
          navigateItem('prev');
        }
      } else if (e.key === "ArrowRight") {
        // If there are multiple images for the current item, navigate between them first
        if (currentItem.images && currentItem.images.length > 1 && currentImageIndex < currentItem.images.length - 1) {
          navigateImage('next');
        } else {
          // Otherwise navigate to the next item
          navigateItem('next');
        }
      } else if (e.key === "ArrowUp") {
        // Always navigate to the previous item
        navigateItem('prev');
      } else if (e.key === "ArrowDown") {
        // Always navigate to the next item
        navigateItem('next');
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    
    // Prevent scrolling when lightbox is open
    document.body.style.overflow = "hidden";
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [onClose, currentItem, currentImageIndex, navigateImage, navigateItem]);
  
  // Handle touch events for swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartX;
    
    // If the swipe is significant enough (more than 50px)
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe right, go to previous
        navigateImage('prev');
      } else {
        // Swipe left, go to next
        navigateImage('next');
      }
    }
    
    setTouchStartX(null);
  };

  // Only show item navigation if there are multiple items
  const showItemNavigation = items.length > 1;
  
  // Only show image navigation if the current item has multiple images
  const showImageNavigation = currentItem.images && currentItem.images.length > 1;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Close button */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
        aria-label="Close lightbox"
      >
        <FiX size={32} />
      </button>
      
      {/* Image container */}
      <div className="relative w-full h-full max-w-5xl max-h-[80vh] mx-auto flex items-center justify-center">
        {currentImage ? (
          <div className="relative w-full h-full">
            <Image
              src={currentImage}
              alt={`${currentItem.title} - Image ${currentImageIndex + 1}`}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 80vw"
            />
          </div>
        ) : (
          <div className="w-64 h-64 flex items-center justify-center bg-gray-800 rounded-lg">
            <span className="text-gray-400 text-7xl">
              {currentItem.icon}
            </span>
          </div>
        )}
        
        {/* Caption */}
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-4">
          <h3 className="text-xl font-semibold">{currentItem.title}</h3>
          <p className="text-gray-300">{currentItem.date}</p>
          
          {/* Image counter if there are multiple images */}
          {showImageNavigation && (
            <p className="text-sm text-gray-400 mt-1">
              Image {currentImageIndex + 1} of {currentItem.images?.length}
            </p>
          )}
          
          {/* Dot indicators for multiple images */}
          {showImageNavigation && (
            <div className="flex justify-center mt-2 space-x-1">
              {currentItem.images?.map((_, dotIndex) => (
                <button
                  key={dotIndex}
                  onClick={() => {
                    setImageIndices(prev => {
                      const newIndices = [...prev];
                      newIndices[currentItemIndex] = dotIndex;
                      return newIndices;
                    });
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    dotIndex === currentImageIndex 
                      ? 'bg-blue-600 w-3' 
                      : 'bg-gray-500'
                  }`}
                  aria-label={`Go to image ${dotIndex + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Item navigation buttons - only show if there are multiple items */}
      {showItemNavigation && (
        <>
          <button 
            onClick={() => navigateItem('prev')}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 focus:outline-none bg-black bg-opacity-50 rounded-full p-2"
            aria-label="Previous item"
          >
            <FiChevronLeft size={32} />
          </button>
          <button 
            onClick={() => navigateItem('next')}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 focus:outline-none bg-black bg-opacity-50 rounded-full p-2"
            aria-label="Next item"
          >
            <FiChevronRight size={32} />
          </button>
        </>
      )}
      
      {/* Image navigation buttons - only show if current item has multiple images */}
      {showImageNavigation && (
        <>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              navigateImage('prev');
            }}
            className="absolute left-20 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 focus:outline-none bg-blue-600 bg-opacity-70 rounded-full p-2 z-20"
            aria-label="Previous image"
          >
            <FiChevronLeft size={24} />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              navigateImage('next');
            }}
            className="absolute right-20 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 focus:outline-none bg-blue-600 bg-opacity-70 rounded-full p-2 z-20"
            aria-label="Next image"
          >
            <FiChevronRight size={24} />
          </button>
        </>
      )}
      
      {/* Swipe area - covers the entire screen for mobile swipe gestures */}
      <div 
        className="absolute inset-0 z-0"
        onClick={(e) => {
          // Prevent clicks on the background from closing the lightbox
          e.stopPropagation();
        }}
      />
    </div>
  );
}
