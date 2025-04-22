"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiUsers, FiCalendar, FiMic, FiHome } from "react-icons/fi";

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect if not authenticated or not admin
  if (status === "loading") {
    return <div className="p-8 text-center">Loading...</div>;
  }
  
  if (status === "unauthenticated" || session?.user?.role !== "ADMIN") {
    router.push("/");
    return null;
  }

  const adminLinks = [
    {
      title: "Manage Users",
      description: "View, edit, and manage user accounts",
      icon: <FiUsers className="w-8 h-8" />,
      href: "/admin/users",
    },
    {
      title: "Manage Events",
      description: "Create, edit, and delete events",
      icon: <FiCalendar className="w-8 h-8" />,
      href: "/admin/events",
    },
    {
      title: "Speaker Applications",
      description: "Review and manage speaker applications",
      icon: <FiMic className="w-8 h-8" />,
      href: "/admin/speaker-applications",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your Frontend Leeds community</p>
        </div>
        <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center">
          <FiHome className="mr-1" />
          Back to Home
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminLinks.map((link) => (
          <Link 
            key={link.href} 
            href={link.href}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-start">
              <div className="mr-4 text-blue-600 dark:text-blue-400">
                {link.icon}
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2 dark:text-white">{link.title}</h2>
                <p className="text-gray-600 dark:text-gray-400">{link.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">Quick Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300 mb-1">Total Users</h3>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">-</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-1">Upcoming Events</h3>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">-</p>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
            <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-300 mb-1">Pending Applications</h3>
            <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">-</p>
          </div>
        </div>
      </div>
    </div>
  );
}
