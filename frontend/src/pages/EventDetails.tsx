import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import API from "../lib/api-client";
import VolunteerHoursLogging from "../components/VolunteerHoursLogging";
import useAuthStore from "../lib/auth-store";

interface ApiEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  start_time: string;
  end_time: string;
  max_participants: number;
  created_at: string;
  updated_at: string;
}

interface EventResponse {
  message: string;
  event: ApiEvent;
}

const formatDuration = (startTime: string, endTime: string): string => {
  try {
    const start = new Date(startTime);
    const end = new Date(endTime);

    const startDate = start.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    const startTimeStr = start.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    const endTimeStr = end.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    if (start.toDateString() === end.toDateString()) {
      return `${startDate} (${startTimeStr} - ${endTimeStr})`;
    } else {
      const endDate = end.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      return `${startDate} - ${endDate}`;
    }
  } catch (error) {
    return "Date TBD";
  }
};

const fetchEvent = async (eventId: string): Promise<ApiEvent> => {
  const response = await API.get<EventResponse>(`/event/${eventId}`);
  return response.data.event;
};

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const [isApplying, setIsApplying] = useState(false);

  const {
    data: event,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["event", id],
    queryFn: () => fetchEvent(id!),
    enabled: !!id,
  });

  const handleApply = async () => {
    if (!event) return;
    try {
      setIsApplying(true);
      await API.post(`/event/${event.id}/apply`, {});
      alert("Successfully applied to event!");
    } catch (error: any) {
      console.error("Error applying to event:", error);
      alert(
        error.response?.data?.message ||
          "Failed to apply to event. Please try again."
      );
    } finally {
      setIsApplying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-8 max-w-3xl">
        <p className="text-center py-10">Loading event details...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container mx-auto px-6 py-8 max-w-3xl">
        <p className="text-center py-10 text-red-600">Event not found</p>
        <div className="text-center">
          <Link
            to="/opportunities"
            className="text-green-600 hover:underline"
          >
            ← Back to Opportunities
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-3xl">
      <div className="mb-6">
        <Link
          to="/opportunities"
          className="text-green-600 hover:underline mb-4 inline-block"
        >
          ← Back to Opportunities
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
        <p className="text-gray-600 mb-4">
          📍 {event.location} • 📅 {formatDuration(event.start_time, event.end_time)}
        </p>
        <p className="text-gray-700 mb-6">{event.description}</p>

        {user?.role === "volunteer" && (
          <button
            onClick={handleApply}
            disabled={isApplying}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isApplying ? "Applying..." : "Apply to Event"}
          </button>
        )}
      </div>

      {/* Time Tracking Section - Only show for volunteers */}
      {user?.role === "volunteer" && (
        <div className="mb-6">
          <VolunteerHoursLogging eventId={event.id} />
        </div>
      )}

      <div className="flex justify-between items-center">
        <Link to="/opportunities" className="text-green-600 hover:underline">
          ← Back to Opportunities
        </Link>
        {user?.role === "volunteer" && (
          <Link
            to="/volunteer/dashboard"
            className="bg-green-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-green-700 transition"
          >
            View Dashboard
          </Link>
        )}
      </div>
    </div>
  );
};

export default EventDetails;