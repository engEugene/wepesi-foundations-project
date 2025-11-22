import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../lib/api-client";

interface VolunteerEvent {
  participation_id: string;
  event_id: string;
  organization_id: string;
  title: string;
  description: string;
  location: string;
  start_time: string;
  end_time: string;
  status: "applied" | "approved" | "completed";
  volunteer_hours: number | null;
  is_checked_in: boolean;
  applied_at: string | null;
  approved_at: string | null;
  completed_at: string | null;
}

interface VolunteerEventsResponse {
  message: string;
  count: number;
  events: VolunteerEvent[];
}

interface CheckInResponse {
  message: string;
  session_id: string;
  start_time: string;
}

interface CheckOutResponse {
  message: string;
  session_hours: number;
  event_total_hours: number;
  user_total_hours: number;
}

const fetchVolunteerEvents = async (): Promise<VolunteerEvent[]> => {
  const response = await API.get<VolunteerEventsResponse>("/volunteer/events");
  return response.data.events || [];
};

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "N/A";
  }
};

const formatDateTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "N/A";
  }
};

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

const getStatusBadge = (status: string) => {
  const badges = {
    applied: (
      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
        Applied
      </span>
    ),
    approved: (
      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
        Approved
      </span>
    ),
    completed: (
      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
        Completed
      </span>
    ),
  };
  return badges[status as keyof typeof badges] || badges.applied;
};

interface VolunteerHoursLoggingProps {
  eventId?: string; // Optional: filter to show only a specific event
  onCheckInStart?: (startTime: string, eventTitle: string) => void; // Callback when check-in starts
  onCheckOut?: () => void; // Callback when check-out happens
}

const VolunteerHoursLogging: React.FC<VolunteerHoursLoggingProps> = ({
  eventId,
  onCheckInStart,
  onCheckOut,
}) => {
  const queryClient = useQueryClient();
  const [checkingIn, setCheckingIn] = useState<string | null>(null);
  const [checkingOut, setCheckingOut] = useState<string | null>(null);
  const [currentSessionStart, setCurrentSessionStart] = useState<{
    startTime: string;
    eventTitle: string;
  } | null>(null);

  const {
    data: events,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["volunteerEvents"],
    queryFn: fetchVolunteerEvents,
  });

  // Filter events by eventId if provided
  const filteredEvents = React.useMemo(() => {
    if (!events) return [];
    if (eventId) {
      return events.filter((e) => e.event_id === eventId);
    }
    return events;
  }, [events, eventId]);

  // Check for existing checked-in session when events load
  React.useEffect(() => {
    if (filteredEvents) {
      const checkedInEvent = filteredEvents.find((e) => e.is_checked_in);
      if (checkedInEvent) {
        // Try to get start time from localStorage (stored when checking in)
        const storedSession = localStorage.getItem(
          `checkin_${checkedInEvent.participation_id}`
        );
        if (storedSession) {
          try {
            const session = JSON.parse(storedSession);
            setCurrentSessionStart({
              startTime: session.startTime,
              eventTitle: checkedInEvent.title,
            });
            if (onCheckInStart) {
              onCheckInStart(session.startTime, checkedInEvent.title);
            }
          } catch (e) {
            console.error("Error parsing stored session:", e);
          }
        }
      } else {
        setCurrentSessionStart(null);
      }
    }
  }, [filteredEvents, onCheckInStart]);

  const checkInMutation = useMutation({
    mutationFn: async (participationId: string) => {
      const response = await API.post<CheckInResponse>(
        `/participation/${participationId}/check-in`
      );
      return { ...response.data, participationId };
    },
    onSuccess: (data, participationId) => {
      queryClient.invalidateQueries({ queryKey: ["volunteerEvents"] });
      // Find the event to get its title - use events directly since filteredEvents might be stale
      const event = events?.find((e) => e.participation_id === participationId);
      if (event && data.start_time) {
        // Store session info in localStorage
        const sessionInfo = {
          startTime: data.start_time,
          participationId: participationId,
        };
        localStorage.setItem(
          `checkin_${participationId}`,
          JSON.stringify(sessionInfo)
        );
        setCurrentSessionStart({
          startTime: data.start_time,
          eventTitle: event.title,
        });
        if (onCheckInStart) {
          onCheckInStart(data.start_time, event.title);
        }
      }
      alert(data.message || "Checked in successfully!");
    },
    onError: (error: any) => {
      alert(
        error.response?.data?.message || "Failed to check in. Please try again."
      );
    },
    onSettled: () => {
      setCheckingIn(null);
    },
  });

  const checkOutMutation = useMutation({
    mutationFn: async (participationId: string) => {
      const response = await API.post<CheckOutResponse>(
        `/participation/${participationId}/check-out`
      );
      return { ...response.data, participationId };
    },
    onSuccess: (data, participationId) => {
      queryClient.invalidateQueries({ queryKey: ["volunteerEvents"] });
      queryClient.invalidateQueries({ queryKey: ["volunteerStats"] });
      // Clear stored session info
      localStorage.removeItem(`checkin_${participationId}`);
      setCurrentSessionStart(null);
      if (onCheckOut) {
        onCheckOut();
      }
      alert(
        `Checked out successfully! You worked ${data.session_hours.toFixed(
          2
        )} hours.`
      );
    },
    onError: (error: any) => {
      alert(
        error.response?.data?.message ||
          "Failed to check out. Please try again."
      );
    },
    onSettled: () => {
      setCheckingOut(null);
    },
  });

  const handleCheckIn = async (event: VolunteerEvent) => {
    setCheckingIn(event.participation_id);
    checkInMutation.mutate(event.participation_id);
  };

  const handleCheckOut = async (event: VolunteerEvent) => {
    setCheckingOut(event.participation_id);
    checkOutMutation.mutate(event.participation_id);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Time Logging</h2>
        <p className="text-gray-600">Loading your events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Time Logging</h2>
        <p className="text-red-600">
          Error loading your events. Please try refreshing the page.
        </p>
      </div>
    );
  }

  if (!filteredEvents || filteredEvents.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Time Logging</h2>
        <p className="text-gray-600">
          {eventId
            ? "You haven't applied to this event yet. Apply to start logging your volunteer hours!"
            : "You haven't participated in any events yet. Apply to events to start logging your volunteer hours!"}
        </p>
      </div>
    );
  }

  // Filter to show only approved events for check-in/check-out
  const approvedEvents = filteredEvents.filter((e) => e.status === "approved");
  const otherEvents = filteredEvents.filter((e) => e.status !== "approved");

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Time Logging</h2>
      <p className="text-gray-600 text-sm mb-6">
        Check in when you start volunteering and check out when you finish. Your
        hours will be automatically calculated and added to your total.
      </p>

      {approvedEvents.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4 text-gray-800">
            Active Events (Check In/Out Available)
          </h3>
          <div className="space-y-4">
            {approvedEvents.map((event) => {
              const isCheckedIn = event.is_checked_in;
              const canCheckIn = !isCheckedIn;
              const canCheckOut = isCheckedIn;

              return (
                <div
                  key={event.participation_id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-800">
                          {event.title}
                        </h4>
                        {getStatusBadge(event.status)}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {event.description}
                      </p>
                      <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-2">
                        <span>📍 {event.location}</span>
                        <span>
                          📅 {formatDuration(event.start_time, event.end_time)}
                        </span>
                        <span>
                          ⏱️ {(event.volunteer_hours || 0).toFixed(2)} hours
                          logged
                        </span>
                      </div>
                      {event.approved_at && (
                        <p className="text-xs text-gray-500">
                          Approved: {formatDateTime(event.approved_at)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleCheckIn(event)}
                      disabled={
                        !canCheckIn || checkingIn === event.participation_id
                      }
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition ${
                        canCheckIn
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {checkingIn === event.participation_id
                        ? "Checking In..."
                        : "Check In"}
                    </button>
                    <button
                      onClick={() => handleCheckOut(event)}
                      disabled={
                        !canCheckOut || checkingOut === event.participation_id
                      }
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition ${
                        canCheckOut
                          ? "bg-red-600 text-white hover:bg-red-700"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {checkingOut === event.participation_id
                        ? "Checking Out..."
                        : "Check Out"}
                    </button>
                  </div>
                  {isCheckedIn && (
                    <p className="text-xs text-green-600 mt-2 font-medium">
                      ✓ You are currently checked in
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {otherEvents.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-4 text-gray-800">
            Other Events
          </h3>
          <div className="space-y-4">
            {otherEvents.map((event) => (
              <div
                key={event.participation_id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-800">
                        {event.title}
                      </h4>
                      {getStatusBadge(event.status)}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {event.description}
                    </p>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                      <span>📍 {event.location}</span>
                      <span>
                        📅 {formatDuration(event.start_time, event.end_time)}
                      </span>
                      {(event.volunteer_hours || 0) > 0 && (
                        <span>
                          ⏱️ {(event.volunteer_hours || 0).toFixed(2)} hours
                        </span>
                      )}
                    </div>
                    {event.applied_at && (
                      <p className="text-xs text-gray-500 mt-2">
                        Applied: {formatDateTime(event.applied_at)}
                      </p>
                    )}
                    {event.completed_at && (
                      <p className="text-xs text-gray-500 mt-1">
                        Completed: {formatDateTime(event.completed_at)}
                      </p>
                    )}
                  </div>
                </div>
                {event.status === "applied" && (
                  <p className="text-xs text-yellow-600 mt-2">
                    Waiting for approval to start logging hours
                  </p>
                )}
                {event.status === "completed" && (
                  <p className="text-xs text-blue-600 mt-2">
                    Event completed. Total hours:{" "}
                    {(event.volunteer_hours || 0).toFixed(2)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VolunteerHoursLogging;
