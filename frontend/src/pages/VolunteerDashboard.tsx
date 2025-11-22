import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import API from "../lib/api-client";
import useAuthStore from "../lib/auth-store";
import VolunteerHoursLogging from "../components/VolunteerHoursLogging";
import TimeClock from "../components/TimeClock";

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

interface ApiResponse {
  message: string;
  events: ApiEvent[];
}

interface VolunteerStats {
  total_hours: number;
  completed_activities: number;
  active_badges: number;
}

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

    // Check if same day
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

const fetchEvents = async (): Promise<ApiEvent[]> => {
  const response = await API.get<ApiResponse[]>("/event");
  if (Array.isArray(response.data) && response.data.length > 0) {
    return response.data[0].events || [];
  }
  return [];
};

const fetchVolunteerEvents = async (): Promise<VolunteerEvent[]> => {
  try {
    const response = await API.get<VolunteerEventsResponse>(
      "/volunteer/events"
    );
    return response.data.events || [];
  } catch (error) {
    console.error("Error fetching volunteer events:", error);
    return [];
  }
};

const calculateVolunteerStats = (events: VolunteerEvent[]): VolunteerStats => {
  const totalHours = events.reduce(
    (sum, event) => sum + (event.volunteer_hours || 0),
    0
  );
  const completedActivities = events.filter(
    (e) => e.status === "completed"
  ).length;

  // TODO: Fetch actual badges count when endpoint is available
  return {
    total_hours: Math.round(totalHours * 100) / 100, // Round to 2 decimal places
    completed_activities: completedActivities,
    active_badges: 0, // Will be updated when badges endpoint is available
  };
};

const applyToEvent = async (eventId: string): Promise<void> => {
  await API.post(`/event/${eventId}/apply`, {});
};

const VolunteerDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [applyingEventId, setApplyingEventId] = useState<string | null>(null);
  const [currentSession, setCurrentSession] = useState<{
    startTime: string;
    eventTitle: string;
  } | null>(null);

  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
  });

  const { data: volunteerEvents } = useQuery({
    queryKey: ["volunteerEvents"],
    queryFn: fetchVolunteerEvents,
  });

  const stats = volunteerEvents
    ? calculateVolunteerStats(volunteerEvents)
    : null;

  // Check for existing checked-in session
  React.useEffect(() => {
    if (volunteerEvents) {
      const checkedInEvent = volunteerEvents.find((e) => e.is_checked_in);
      if (checkedInEvent) {
        // Try to get start time from localStorage
        const storedSession = localStorage.getItem(
          `checkin_${checkedInEvent.participation_id}`
        );
        if (storedSession) {
          try {
            const session = JSON.parse(storedSession);
            setCurrentSession({
              startTime: session.startTime,
              eventTitle: checkedInEvent.title,
            });
          } catch (e) {
            console.error("Error parsing stored session:", e);
          }
        }
      } else {
        setCurrentSession(null);
      }
    }
  }, [volunteerEvents]);

  const handleCheckInStart = (startTime: string, eventTitle: string) => {
    setCurrentSession({ startTime, eventTitle });
  };

  const handleCheckOut = () => {
    setCurrentSession(null);
  };

  const upcomingActivities = events ? events.slice(0, 3) : [];

  // Mock recent achievements
  const recentAchievements = [
    { title: "Completed Tree Planting Event", date: "2 days ago", badge: "🌱" },
    { title: "Earned Contributor Badge", date: "1 week ago", badge: "🔆" },
    { title: "Reached 40 Volunteer Hours", date: "2 weeks ago", badge: "⭐" },
  ];

  const handleApply = async (eventId: string) => {
    try {
      setApplyingEventId(eventId);
      await applyToEvent(eventId);
      alert("Successfully applied to event!");
      // Optionally refresh events
    } catch (error: any) {
      console.error("Error applying to event:", error);
      alert(
        error.response?.data?.message ||
          "Failed to apply to event. Please try again."
      );
    } finally {
      setApplyingEventId(null);
    }
  };

  return (
    <section className="px-8 py-10 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.username || "Volunteer"}!
        </h1>
        <p className="text-gray-600">
          Here's an overview of your volunteering journey
        </p>
      </div>

      {/* Active Session Clock - Show when checked in */}
      {currentSession && (
        <div className="mb-8">
          <TimeClock
            startTime={currentSession.startTime}
            eventTitle={currentSession.eventTitle}
          />
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Total Hours</p>
              <p className="text-3xl font-bold text-gray-800">
                {stats?.total_hours ?? 0}
              </p>
            </div>
            <div className="text-4xl">⏱️</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Activities Completed</p>
              <p className="text-3xl font-bold text-gray-800">
                {stats?.completed_activities ?? 0}
              </p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Active Badges</p>
              <p className="text-3xl font-bold text-gray-800">
                {stats?.active_badges ?? 0}
              </p>
            </div>
            <div className="text-4xl">🏆</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Activities */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Upcoming Activities</h2>
            <Link
              to="/opportunities"
              className="text-green-600 hover:text-green-700 text-sm font-medium"
            >
              View All →
            </Link>
          </div>
          <div className="space-y-4">
            {eventsLoading ? (
              <p className="text-gray-600 text-sm">Loading activities...</p>
            ) : upcomingActivities.length === 0 ? (
              <p className="text-gray-600 text-sm">No upcoming activities</p>
            ) : (
              upcomingActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">
                        {activity.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Event Organizer
                      </p>
                      <div className="flex gap-3 mt-2 text-xs text-gray-500">
                        <span>📍 {activity.location}</span>
                        <span>
                          📅{" "}
                          {formatDuration(
                            activity.start_time,
                            activity.end_time
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Link
                      to={`/event/${activity.id}`}
                      className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition text-sm text-center"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleApply(activity.id)}
                      disabled={applyingEventId === activity.id}
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {applyingEventId === activity.id
                        ? "Applying..."
                        : "Apply"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Achievements</h2>
          <div className="space-y-4">
            {recentAchievements.map((achievement, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
              >
                <div className="text-3xl">{achievement.badge}</div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">
                    {achievement.title}
                  </p>
                  <p className="text-sm text-gray-500">{achievement.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Time Logging Section */}
      <div className="mt-8">
        <VolunteerHoursLogging
          onCheckInStart={handleCheckInStart}
          onCheckOut={handleCheckOut}
        />
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/opportunities"
            className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-green-600 hover:bg-green-50 transition cursor-pointer"
          >
            <div className="text-3xl mb-2">🔍</div>
            <p className="text-sm font-medium text-center">
              Find Opportunities
            </p>
          </Link>
          <Link
            to="/profile"
            className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-green-600 hover:bg-green-50 transition cursor-pointer"
          >
            <div className="text-3xl mb-2">👤</div>
            <p className="text-sm font-medium text-center">View Profile</p>
          </Link>
          <Link
            to="/badges"
            className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-green-600 hover:bg-green-50 transition cursor-pointer"
          >
            <div className="text-3xl mb-2">🏅</div>
            <p className="text-sm font-medium text-center">My Badges</p>
          </Link>
          <Link
            to="/contact"
            className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-green-600 hover:bg-green-50 transition cursor-pointer"
          >
            <div className="text-3xl mb-2">📞</div>
            <p className="text-sm font-medium text-center">Contact Support</p>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default VolunteerDashboard;
