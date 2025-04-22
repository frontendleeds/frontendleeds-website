"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";
import { FiArrowLeft, FiGithub, FiLinkedin, FiGlobe, FiTwitter } from "react-icons/fi";

interface Event {
  id: string;
  title: string;
  startTime: Date;
}

export default function SpeakerApplicationPage() {
  const { status } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    experience: "",
    bio: "",
    githubUrl: "",
    linkedinUrl: "",
    websiteUrl: "",
    twitterUrl: "",
    additionalInfo: "",
    eventId: "" // Optional - can be empty if applying generally
  });
  
  // Fetch upcoming events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events?upcoming=true');
        if (response.ok) {
          const data = await response.json();
       
          setEvents(data);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvents();
  }, []);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");

  // Redirect to login if not authenticated
  if (status === "unauthenticated") {
    router.push("/auth/signin?callbackUrl=/events/speak");
    return null;
  }

  // Loading state
  if (status === "loading") {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="animate-pulse flex flex-col space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.title.trim()) errors.title = "Talk title is required";
    if (!formData.description.trim()) errors.description = "Talk description is required";
    if (!formData.experience.trim()) errors.experience = "Speaking experience is required";
    if (!formData.bio.trim()) errors.bio = "Speaker bio is required";
    
    // Optional fields don't need validation
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/speaker-applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        console.log(response, "RESPONSE")
        throw new Error("Failed to submit application");
      }
      
      // Clear form and show success message
      setFormData({
        title: "",
        description: "",
        experience: "",
        bio: "",
        githubUrl: "",
        linkedinUrl: "",
        websiteUrl: "",
        twitterUrl: "",
        additionalInfo: "",
        eventId: ""
      });
      
      setSuccessMessage("Your application has been submitted successfully! We'll review it and get back to you soon.");
      
      // Scroll to top to show success message
      window.scrollTo(0, 0);
      
    } catch (error) {
      console.error("Error submitting application:", error);
      setFormErrors(prev => ({ 
        ...prev, 
        submit: "There was an error submitting your application. Please try again." 
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/events" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-6">
          <FiArrowLeft className="mr-2" />
          Back to Events
        </Link>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 dark:text-white">Apply to Speak</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Share your knowledge and experience with the Frontend Leeds community. 
            Fill out the form below to apply as a speaker for an upcoming event.
          </p>
          
          {successMessage && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 rounded-md p-4 mb-6">
              <p>{successMessage}</p>
            </div>
          )}
          
          {formErrors.submit && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 rounded-md p-4 mb-6">
              <p>{formErrors.submit}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Talk Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4 dark:text-white">Talk Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="eventId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Select Event (Optional)
                  </label>
                  <select
                    id="eventId"
                    name="eventId"
                    value={formData.eventId}
                    onChange={(e) => {
                      const selectedEvent = events.find(event => event.id === e.target.value);
                      handleChange(e);
                      if (selectedEvent) {
                        setFormData(prev => ({
                          ...prev,
                          eventId: e.target.value,
                          title: selectedEvent.title
                        }));
                      } else if (e.target.value === "") {
                        setFormData(prev => ({
                          ...prev,
                          eventId: "",
                          // Don't clear the title if it was manually entered
                        }));
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white mb-4"
                  >
                    <option value="">-- Select an event or enter custom title below --</option>
                    {isLoading ? (
                      <option disabled>Loading events...</option>
                    ) : events.length > 0 ? (
                      events.map(event => (
                        <option key={event.id} value={event.id}>
                          {event.title} ({new Date(event.startTime).toLocaleDateString()})
                        </option>
                      ))
                    ) : (
                      <option disabled>No upcoming events found</option>
                    )}
                  </select>
                  
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Talk Title <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., 'Modern CSS Techniques for Frontend Developers'"
                    className={formErrors.title ? "border-red-500" : ""}
                  />
                  {formErrors.title && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.title}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Talk Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe what your talk will cover and what attendees will learn"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                      formErrors.description ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                    }`}
                  />
                  {formErrors.description && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.description}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Speaking Experience <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Tell us about your previous speaking experience (or mention if this is your first time)"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                      formErrors.experience ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                    }`}
                  />
                  {formErrors.experience && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.experience}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Speaker Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4 dark:text-white">About You</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Speaker Bio <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Tell us about yourself, your background, and your expertise"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                      formErrors.bio ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                    }`}
                  />
                  {formErrors.bio && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.bio}</p>
                  )}
                </div>
                
                {/* Social Links - Optional */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                      <FiGithub className="mr-1" /> GitHub (Optional)
                    </label>
                    <Input
                      id="githubUrl"
                      name="githubUrl"
                      value={formData.githubUrl}
                      onChange={handleChange}
                      placeholder="https://github.com/yourusername"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                      <FiLinkedin className="mr-1" /> LinkedIn (Optional)
                    </label>
                    <Input
                      id="linkedinUrl"
                      name="linkedinUrl"
                      value={formData.linkedinUrl}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/yourusername"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                      <FiGlobe className="mr-1" /> Website (Optional)
                    </label>
                    <Input
                      id="websiteUrl"
                      name="websiteUrl"
                      value={formData.websiteUrl}
                      onChange={handleChange}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="twitterUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                      <FiTwitter className="mr-1" /> Twitter (Optional)
                    </label>
                    <Input
                      id="twitterUrl"
                      name="twitterUrl"
                      value={formData.twitterUrl}
                      onChange={handleChange}
                      placeholder="https://twitter.com/yourusername"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Additional Information (Optional)
                  </label>
                  <textarea
                    id="additionalInfo"
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Any other information you'd like to share with us"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-end space-x-3 pt-4">
              <Link href="/events">
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className={isSubmitting ? "opacity-70 cursor-not-allowed" : ""}
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
