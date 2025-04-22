"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft, FiEye } from "react-icons/fi";
import { Button } from "@/components/ui/Button";

interface SpeakerApplication {
  id: string;
  title: string;
  description: string;
  experience: string;
  bio: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  event?: {
    id: string;
    title: string;
    startTime: string;
  } | null;
}

export default function MyApplicationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [applications, setApplications] = useState<SpeakerApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<SpeakerApplication | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch user's applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch('/api/speaker-applications/my-applications');
        
        if (response.ok) {
          const data = await response.json();
          setApplications(data);
        } else {
          setErrorMessage("Failed to fetch your applications");
        }
      } catch (error) {
        console.error("Error fetching applications:", error);
        setErrorMessage("An error occurred while fetching your applications");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (session?.user) {
      fetchApplications();
    }
  }, [session]);

  // Redirect if not authenticated
  if (status === "loading") {
    return <div className="p-8 text-center">Loading...</div>;
  }
  
  if (status === "unauthenticated") {
    router.push("/auth/signin?callbackUrl=/events/my-applications");
    return null;
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "APPROVED":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "REJECTED":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Your application is currently under review. We'll notify you once a decision has been made.";
      case "APPROVED":
        return "Congratulations! Your application has been approved. We'll be in touch with further details soon.";
      case "REJECTED":
        return "We're sorry, but your application was not selected at this time. Please consider applying for future events.";
      default:
        return "";
    }
  };

  const getStatusTextClass = (status: string) => {
    switch (status) {
      case "PENDING":
        return "text-yellow-800 dark:text-yellow-300";
      case "APPROVED":
        return "text-green-800 dark:text-green-300";
      case "REJECTED":
        return "text-red-800 dark:text-red-300";
      default:
        return "text-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold dark:text-white">My Speaker Applications</h1>
            <p className="text-gray-600 dark:text-gray-400">Track the status of your speaker applications</p>
          </div>
          <Link href="/events" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center">
            <FiArrowLeft className="mr-1" />
            Back to Events
          </Link>
        </div>
        
        {errorMessage && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 rounded-md p-4 mb-6">
            <p>{errorMessage}</p>
          </div>
        )}
        
        {isLoading ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">No Applications Yet</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You haven&apos;t submitted any speaker applications yet. Would you like to apply to speak at an upcoming event?
            </p>
            <Link href="/events/speak">
              <Button>Apply to Speak</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((application) => (
              <div key={application.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-semibold dark:text-white">{application.title}</h2>
                      {application.event && (
                        <p className="text-gray-600 dark:text-gray-400">
                          For: {application.event.title} ({new Date(application.event.startTime).toLocaleDateString()})
                        </p>
                      )}
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Submitted on {new Date(application.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadgeClass(application.status)}`}>
                      {application.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {application.description.length > 150 
                      ? `${application.description.substring(0, 150)}...` 
                      : application.description}
                  </p>
                  
                  <div className={`p-4 rounded-md mb-4 ${
                    application.status === "PENDING" 
                      ? "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800" 
                      : application.status === "APPROVED"
                        ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                        : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                  }`}>
                    <p className={getStatusTextClass(application.status)}>
                      {getStatusMessage(application.status)}
                    </p>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      variant="outline"
                      onClick={() => setSelectedApplication(application)}
                    >
                      <FiEye className="mr-2" /> View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Application Details Modal */}
        {selectedApplication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold dark:text-white">Application Details</h2>
                  <button
                    onClick={() => setSelectedApplication(null)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    &times;
                  </button>
                </div>
                
                <div className="mb-6">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(selectedApplication.status)}`}>
                    {selectedApplication.status}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                    Submitted on {new Date(selectedApplication.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold dark:text-white mb-2">Talk Information</h3>
                  <div className="mb-4">
                    <h4 className="font-medium dark:text-white">Title</h4>
                    <p className="text-gray-700 dark:text-gray-300">{selectedApplication.title}</p>
                  </div>
                  
                  {selectedApplication.event && (
                    <div className="mb-4">
                      <h4 className="font-medium dark:text-white">Event</h4>
                      <p className="text-gray-700 dark:text-gray-300">
                        {selectedApplication.event.title} ({new Date(selectedApplication.event.startTime).toLocaleDateString()})
                      </p>
                    </div>
                  )}
                  
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md mb-4">
                    <h4 className="font-medium dark:text-white mb-2">Description</h4>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{selectedApplication.description}</p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md mb-4">
                    <h4 className="font-medium dark:text-white mb-2">Speaking Experience</h4>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{selectedApplication.experience}</p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                    <h4 className="font-medium dark:text-white mb-2">Bio</h4>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{selectedApplication.bio}</p>
                  </div>
                </div>
                
                <div className={`p-4 rounded-md mb-6 ${
                  selectedApplication.status === "PENDING" 
                    ? "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800" 
                    : selectedApplication.status === "APPROVED"
                      ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                      : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                }`}>
                  <h4 className={`font-medium mb-2 ${getStatusTextClass(selectedApplication.status)}`}>
                    Status: {selectedApplication.status}
                  </h4>
                  <p className={getStatusTextClass(selectedApplication.status)}>
                    {getStatusMessage(selectedApplication.status)}
                  </p>
                </div>
                
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedApplication(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
