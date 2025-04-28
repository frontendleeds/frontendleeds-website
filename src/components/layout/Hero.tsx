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
      className="relative text-white bg-blue-900" 
      style={bgStyle}
    >
      {/* Overlay gradient for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-800 opacity-90"></div>
      
      {/* Content container */}
      <div className="container relative px-4 py-16 mx-auto sm:py-20 md:py-24 lg:py-32">
        <div className="max-w-3xl">
          {/* Responsive heading */}
          <h1 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl sm:mb-6">
            {title}
          </h1>
          
          {/* Responsive subtitle */}
          <p className="mb-6 text-lg text-blue-100 sm:text-xl md:text-2xl sm:mb-8">
            {subtitle}
          </p>
          
          {/* Responsive buttons */}
          {(primaryButtonText || secondaryButtonText) && (
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              {primaryButtonText && primaryButtonLink && (
                <Link 
                  href={primaryButtonLink} 
                  className="inline-flex items-center justify-center px-4 py-2 font-medium text-blue-900 transition-colors duration-300 bg-white rounded-md hover:bg-blue-50 dark:bg-blue-100 dark:hover:bg-white sm:px-6 sm:py-3 sm:justify-start"
                >
                  {primaryButtonText} {primaryButtonIcon && <span className="ml-2">{primaryButtonIcon}</span>}
                </Link>
              )}
              {secondaryButtonText && secondaryButtonLink && (
                <Link 
                  href={secondaryButtonLink} 
                  className="px-4 py-2 font-medium text-center transition-colors duration-300 bg-transparent border border-white rounded-md hover:bg-blue-800 dark:hover:bg-blue-700 sm:px-6 sm:py-3 sm:text-left"
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
