import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAuthStore from "../lib/auth-store";
import API from "../lib/api-client";

interface OrganizationProfile {
  id: string;
  name: string;
  description: string;
  contact_email: string;
  phone: string;
  website: string;
  address: string;
  updated_at: string;
}

interface OrganizationProfileResponse {
  organization: OrganizationProfile;
}

const fetchOrganizationProfile =
  async (): Promise<OrganizationProfile | null> => {
    try {
      const response = await API.get<OrganizationProfileResponse>(
        "/auth/my-organization-profile"
      );
      return response.data.organization;
    } catch (error) {
      console.error("Error fetching organization profile:", error);
      return null;
    }
  };

interface EventFormData {
  title: string;
  description: string;
  location: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  max_participants: string;
}

export default function EventCreationForm() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Fetch organization profile to get organization_id
  const { data: organizationProfile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["organizationProfile"],
    queryFn: fetchOrganizationProfile,
    enabled: !!user && user.role === "organization",
  });

  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    location: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    max_participants: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formatDateTime = (date: string, time: string): string => {
    if (!date || !time) return "";
    // Combine date and time, then format as ISO string
    const dateTime = new Date(`${date}T${time}`);
    return dateTime.toISOString();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validate that organization_id is available
    if (!organizationProfile?.id) {
      setError(
        "Organization profile not found. Please ensure you are onboarded."
      );
      setIsLoading(false);
      return;
    }

    // Format start_time and end_time
    const start_time = formatDateTime(formData.startDate, formData.startTime);
    const end_time = formatDateTime(formData.endDate, formData.endTime);

    // Validate dates
    if (!start_time || !end_time) {
      setError("Please provide both start and end date/time.");
      setIsLoading(false);
      return;
    }

    if (new Date(start_time) >= new Date(end_time)) {
      setError("End time must be after start time.");
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        organization_id: organizationProfile.id, // Use organization_id from profile
        title: formData.title,
        description: formData.description,
        location: formData.location,
        start_time: start_time,
        end_time: end_time,
        max_participants: parseInt(formData.max_participants, 10),
      };

      const response = await API.post("/event", payload);

      if (response.status === 201 || response.status === 200) {
        alert("Event created successfully!");
        navigate("/organization/dashboard");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Failed to create event. Please try again.";
      setError(errorMessage);
      console.error("Event creation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-3xl mx-auto">
        <div className="text-center py-8">
          <p className="text-gray-600">Loading organization profile...</p>
        </div>
      </div>
    );
  }

  if (!organizationProfile) {
    return (
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-3xl mx-auto">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">
            Organization profile not found. Please ensure you are onboarded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-2xl p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold text-green-700 mb-2">
        Create New Event
      </h2>
      <p className="text-gray-600 mb-4">
        Fill in the details below to create a new volunteer opportunity event.
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form className="grid gap-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title" className="block text-gray-700 mb-1">
            Event Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full"
            placeholder="Enter event title"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full"
            rows={4}
            placeholder="Describe the event and what volunteers will be doing"
            required
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-gray-700 mb-1">
            Location <span className="text-red-500">*</span>
          </label>
          <input
            id="location"
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full"
            placeholder="Enter event location"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-gray-700 mb-1">
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              id="startDate"
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 w-full"
              required
            />
          </div>
          <div>
            <label htmlFor="startTime" className="block text-gray-700 mb-1">
              Start Time <span className="text-red-500">*</span>
            </label>
            <input
              id="startTime"
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 w-full"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="endDate" className="block text-gray-700 mb-1">
              End Date <span className="text-red-500">*</span>
            </label>
            <input
              id="endDate"
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 w-full"
              required
            />
          </div>
          <div>
            <label htmlFor="endTime" className="block text-gray-700 mb-1">
              End Time <span className="text-red-500">*</span>
            </label>
            <input
              id="endTime"
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 w-full"
              required
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="max_participants"
            className="block text-gray-700 mb-1"
          >
            Maximum Participants <span className="text-red-500">*</span>
          </label>
          <input
            id="max_participants"
            type="number"
            name="max_participants"
            value={formData.max_participants}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full"
            placeholder="Enter maximum number of participants"
            min="1"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? "Creating Event..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}
