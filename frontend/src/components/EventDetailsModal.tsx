import React, { useState } from "react";
import API from "../lib/api-client";

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

interface EventDetailsModalProps {
  event: ApiEvent;
  isOpen: boolean;
  onClose: () => void;
}

const formatDuration = (startTime: string, endTime: string): string => {
  try {
    const start = new Date(startTime);
    const end = new Date(endTime);

    const startDate = start.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
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

    // Check if same day
    if (start.toDateString() === end.toDateString()) {
      return `${startDate} (${startTimeStr} - ${endTimeStr})`;
    } else {
      const endDate = end.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      return `${startDate} - ${endDate}`;
    }
  } catch (error) {
    return "Date TBD";
  }
};

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  event,
  isOpen,
  onClose,
}) => {
  const [isApplying, setIsApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  if (!isOpen) return null;

  const handleApply = async () => {
    try {
      setIsApplying(true);
      await API.post(`/event/${event.id}/apply`, {});
      setApplied(true);
      alert("Successfully applied to event!");
    } catch (error: any) {
      console.error("Error applying to event:", error);
      alert(error.response?.data?.message || "Failed to apply to event. Please try again.");
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Event Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="px-6 py-6">
          <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
          <p className="text-green-700 font-medium mb-4">Event Organizer</p>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-2">
              <span className="text-gray-600 font-medium min-w-[100px]">📍 Location:</span>
              <span className="text-gray-800">{event.location}</span>
            </div>
            
            <div className="flex items-start gap-2">
              <span className="text-gray-600 font-medium min-w-[100px]">📅 Duration:</span>
              <span className="text-gray-800">{formatDuration(event.start_time, event.end_time)}</span>
            </div>
            
            <div className="flex items-start gap-2">
              <span className="text-gray-600 font-medium min-w-[100px]">👥 Max Participants:</span>
              <span className="text-gray-800">{event.max_participants}</span>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Description</h3>
            <p className="text-gray-700 leading-relaxed">{event.description}</p>
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <button
              onClick={handleApply}
              disabled={isApplying || applied}
              className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isApplying
                ? "Applying..."
                : applied
                ? "Applied ✓"
                : "Apply to Event"}
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;

