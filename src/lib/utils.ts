import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZone: 'Europe/London', // Explicitly set to UTC+1 (Europe/London)
  }).format(new Date(date));
}



export function maskFullName(fullName:string) {
  if (!fullName) return '';

  const trimmed = fullName.trim().replace(/\s+/g, '');
  if (trimmed.length <= 4) return '*'.repeat(trimmed.length);

  const start = trimmed.slice(0, 2);
  const end = trimmed.slice(-2);
  const maskedLength = trimmed.length - 4;

  return `${start}${'*'.repeat(maskedLength)}${end}`;
}
