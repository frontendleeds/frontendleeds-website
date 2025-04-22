"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FiArrowLeft, FiCheck, FiX, FiEye } from "react-icons/fi";
import { Button } from "@/components/ui/Button";
import Image from "next/image";

interface SpeakerApplication {
  id: string;
  title: string;
  description: string;
  experience: string;
  bio: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string;
  };
  event?: {
    id: string;
    title: string;
    startTime: string;
  } | null;
}

export default function AdminSpeakerApplicationsPage() {
  const { data: session, status } = useSession();
  const [applications, setApplications] = useState<SpeakerApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("ALL");
  const [selectedApplication, setSelectedApplication] = useState<SpeakerApplication | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const queryParams = filter !== "ALL" ? `?status=${filter}` : "";
        const response = await fetch(`/api/speaker-applications${queryParams}`);
        
        if (response.ok) {
          const data = await response.json();
          setApplications(data);
        } else {
          setErrorMessage("Failed to fetch applications");
        }
      } catch (error) {
        console.error("Error fetching applications:", error);
        setErrorMessage("An error occurred while fetching applications");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (session?.user?.role === "ADMIN") {
      fetchApplications();
    }
  }, [session, filter]);

  // Redirect if not admin
  if (status === "loading") {
    return <div className="p-8 text-center">Loading...</div>;
  }
  
  if (status === "unauthenticated" || session?.user?.role !== "ADMIN") {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="mb-4">You must be an admin to view this page.</p>
        <Link href="/">
          <Button>Return to Home</Button>
        </Link>
      </div>
    );
  }

  const updateApplicationStatus = async (id: string, newStatus: "PENDING" | "APPROVED" | "REJECTED") => {
    setIsUpdating(true);
    setErrorMessage("");
    setSuccessMessage("");
    
    try {
      const response = await fetch(`/api/speaker-applications/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (response.ok) {
        // Update the application in the state
        setApplications(prev => 
          prev.map(app => 
            app.id === id ? { ...app, status: newStatus } : app
          )
        );
        
        // If we're viewing the details of this application, update it there too
        if (selectedApplication?.id === id) {
          setSelectedApplication(prev => prev ? { ...prev, status: newStatus } : null);
        }
        
        setSuccessMessage(`Application ${newStatus.toLowerCase()} successfully`);
      } else {
        setErrorMessage("Failed to update application status");
      }
    } catch (error) {
      console.error("Error updating application status:", error);
      setErrorMessage("An error occurred while updating the application");
    } finally {
      setIsUpdating(false);
    }
  };

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Speaker Applications</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage speaker applications for Frontend Leeds events</p>
        </div>
        <Link href="/admin" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center">
          <FiArrowLeft className="mr-1" />
          Back to Admin
        </Link>
      </div>
      
      {errorMessage && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 rounded-md p-4 mb-6">
          <p>{errorMessage}</p>
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 rounded-md p-4 mb-6">
          <p>{successMessage}</p>
        </div>
      )}
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter("ALL")}
              className={`px-3 py-1 rounded-md ${
                filter === "ALL" 
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" 
                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("PENDING")}
              className={`px-3 py-1 rounded-md ${
                filter === "PENDING" 
                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" 
                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter("APPROVED")}
              className={`px-3 py-1 rounded-md ${
                filter === "APPROVED" 
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" 
                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setFilter("REJECTED")}
              className={`px-3 py-1 rounded-md ${
                filter === "REJECTED" 
                  ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" 
                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
              }`}
            >
              Rejected
            </button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        ) : applications.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            No applications found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Speaker
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Talk Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Event
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {applications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {application.user.image ? (
                         <Image
                         src={application.user.image}
                         alt={application.user.name || "User"}
                         width={32}
                         height={32}
                         className="rounded-full mr-3"
                       />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 mr-3 flex items-center justify-center text-gray-500 dark:text-gray-400">
                            {application.user.name?.charAt(0) || "U"}
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {application.user.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {application.user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">{application.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {application.event ? application.event.title : "No specific event"}
                      </div>
                      {application.event && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(application.event.startTime).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(application.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(application.status)}`}>
                        {application.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setSelectedApplication(application)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-3"
                      >
                        <FiEye className="inline" /> View
                      </button>
                      {application.status !== "APPROVED" && (
                        <button
                          onClick={() => updateApplicationStatus(application.id, "APPROVED")}
                          disabled={isUpdating}
                          className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 mr-3"
                        >
                          <FiCheck className="inline" /> Approve
                        </button>
                      )}
                      {application.status !== "REJECTED" && (
                        <button
                          onClick={() => updateApplicationStatus(application.id, "REJECTED")}
                          disabled={isUpdating}
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                        >
                          <FiX className="inline" /> Reject
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
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
                <h3 className="text-lg font-semibold dark:text-white mb-2">Speaker Information</h3>
                <div className="flex items-center mb-4">
                  {selectedApplication.user.image ? (
                   <Image
                   src={selectedApplication.user.image}
                   alt={selectedApplication.user.name || "User"}
                   width={48}
                   height={48}
                   className="rounded-full mr-4"
                 />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-600 mr-4 flex items-center justify-center text-gray-500 dark:text-gray-400 text-xl">
                      {selectedApplication.user.name?.charAt(0) || "U"}
                    </div>
                  )}
                  <div>
                    <div className="font-medium dark:text-white">{selectedApplication.user.name}</div>
                    <div className="text-gray-500 dark:text-gray-400">{selectedApplication.user.email}</div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md mb-4">
                  <h4 className="font-medium dark:text-white mb-2">Bio</h4>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{selectedApplication.bio}</p>
                </div>
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
                
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                  <h4 className="font-medium dark:text-white mb-2">Speaking Experience</h4>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{selectedApplication.experience}</p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setSelectedApplication(null)}
                >
                  Close
                </Button>
                {selectedApplication.status !== "APPROVED" && (
                  <Button
                    onClick={() => updateApplicationStatus(selectedApplication.id, "APPROVED")}
                    disabled={isUpdating}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <FiCheck className="mr-1" /> Approve
                  </Button>
                )}
                {selectedApplication.status !== "REJECTED" && (
                  <Button
                    onClick={() => updateApplicationStatus(selectedApplication.id, "REJECTED")}
                    disabled={isUpdating}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <FiX className="mr-1" /> Reject
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
