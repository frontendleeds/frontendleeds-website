import Link from "next/link";
import { ReactNode } from "react";

interface HeroProps {
  title: string;
  subtitle: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  primaryButtonIcon?: ReactNode;
  backgroundImage?: string;
}

export function Hero({
  title,
  subtitle,
  primaryButtonText,
  primaryButtonLink,
  secondaryButtonText,
  secondaryButtonLink,
  primaryButtonIcon,
  backgroundImage,
}: HeroProps) {
  const bgStyle = backgroundImage
    ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : {};

  return (
    <section 
      className="relative bg-blue-900 text-white" 
      style={bgStyle}
    >
      {/* Overlay gradient for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-800 opacity-90"></div>
      
      {/* Content container */}
      <div className="relative container mx-auto px-4 py-16 sm:py-20 md:py-24 lg:py-32">
        <div className="max-w-3xl">
          {/* Responsive heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
            {title}
          </h1>
          
          {/* Responsive subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-blue-100">
            {subtitle}
          </p>
          
          {/* Responsive buttons */}
          {(primaryButtonText || secondaryButtonText) && (
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              {primaryButtonText && primaryButtonLink && (
                <Link 
                  href={primaryButtonLink} 
                  className="bg-white text-blue-900 hover:bg-blue-50 dark:bg-blue-100 dark:hover:bg-white px-4 sm:px-6 py-2 sm:py-3 rounded-md font-medium transition-colors duration-300 inline-flex items-center justify-center sm:justify-start"
                >
                  {primaryButtonText} {primaryButtonIcon && <span className="ml-2">{primaryButtonIcon}</span>}
                </Link>
              )}
              {secondaryButtonText && secondaryButtonLink && (
                <Link 
                  href={secondaryButtonLink} 
                  className="bg-transparent hover:bg-blue-800 dark:hover:bg-blue-700 border border-white px-4 sm:px-6 py-2 sm:py-3 rounded-md font-medium transition-colors duration-300 text-center sm:text-left"
                >
                  {secondaryButtonText}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
