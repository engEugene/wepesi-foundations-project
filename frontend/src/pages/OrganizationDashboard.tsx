import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAuthStore from "../lib/auth-store";
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

type Opportunity = {
  id: string;
  title: string;
  category: string;
  location: string;
  duration: string;
  status: "active" | "past" | "future";
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

const getEventStatus = (
  startTime: string,
  endTime: string
): "active" | "past" | "future" => {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (now > end) {
    return "past";
  } else if (now >= start && now <= end) {
    return "active";
  } else {
    return "future";
  }
};

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

interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: number;
  total_hours: number;
}

interface Application {
  participation_id: string;
  status: string;
  applied_at: string;
  approved_at: string | null;
  volunteer: Volunteer;
}

interface EventApplicationsResponse {
  event_title: string;
  count: number;
  applications: Application[];
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

const fetchOrganizationEvents = async (
  organizationId: string
): Promise<ApiEvent[]> => {
  const response = await API.get(`/organization/${organizationId}/events`);
  // The API might return an array or an object with events
  if (Array.isArray(response.data)) {
    // If it's an array, check if first item has events property
    if (response.data.length > 0 && response.data[0].events) {
      return response.data[0].events;
    }
    return response.data;
  }
  // If it's an object with events property
  if (response.data.events) {
    return response.data.events;
  }
  return [];
};

const fetchEventApplications = async (
  eventId: string
): Promise<EventApplicationsResponse | null> => {
  try {
    const response = await API.get<EventApplicationsResponse>(
      `/event/${eventId}/applications`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching applications for event ${eventId}:`, error);
    return null;
  }
};

const formatRelativeTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "just now";
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${
        diffInMinutes === 1 ? "minute" : "minutes"
      } ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
    }

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
      return `${diffInWeeks} ${diffInWeeks === 1 ? "week" : "weeks"} ago`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths} ${diffInMonths === 1 ? "month" : "months"} ago`;
  } catch (error) {
    return "Unknown";
  }
};

const OrganizationDashboard: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedApplications, setSelectedApplications] = useState<
    (Application & { event_title: string })[]
  >([]);
  const [selectedEventTitle, setSelectedEventTitle] = useState<string>("");
  const { user } = useAuthStore();

  // First fetch organization profile to get the organization_id
  const { data: organizationProfile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["organizationProfile"],
    queryFn: fetchOrganizationProfile,
    enabled: !!user && user.role === "organization",
  });

  // Then fetch organization events using the organization_id from profile
  const {
    data: apiEvents,
    isLoading: isLoadingEvents,
    error,
  } = useQuery({
    queryKey: ["organizationEvents", organizationProfile?.id],
    queryFn: () => fetchOrganizationEvents(organizationProfile?.id || ""),
    enabled: !!organizationProfile?.id,
  });

  // Fetch applications for all events
  const { data: allApplicationsData, isLoading: isLoadingApplications } =
    useQuery({
      queryKey: ["eventApplications", apiEvents?.map((e) => e.id)],
      queryFn: async () => {
        if (!apiEvents || apiEvents.length === 0) return [];
        const results = await Promise.all(
          apiEvents.map(async (event) => {
            const eventData = await fetchEventApplications(event.id);
            return eventData ? { ...eventData, event_id: event.id } : null;
          })
        );
        return results.filter(
          (
            result
          ): result is EventApplicationsResponse & { event_id: string } =>
            result !== null
        );
      },
      enabled: !!apiEvents && apiEvents.length > 0,
    });

  const isLoading =
    isLoadingProfile || isLoadingEvents || isLoadingApplications;

  // Transform API events to Opportunity format
  const activeOpportunities: Opportunity[] = apiEvents
    ? apiEvents.map((event) => ({
        id: event.id,
        title: event.title,
        category: "Event", // Default category since API doesn't provide it
        location: event.location,
        duration: formatDuration(event.start_time, event.end_time),
        status: getEventStatus(event.start_time, event.end_time),
      }))
    : [];

  // Filter to show only active and future opportunities
  const displayedOpportunities = activeOpportunities.filter(
    (opp) => opp.status === "active" || opp.status === "future"
  );

  // Combine all applications from all events and flatten them
  const allApplications: (Application & {
    event_title: string;
    event_id: string;
  })[] = allApplicationsData
    ? allApplicationsData.flatMap((eventData) =>
        eventData.applications.map((app) => ({
          ...app,
          event_title: eventData.event_title,
          event_id: eventData.event_id,
        }))
      )
    : [];

  // Sort by applied_at (most recent first) and take the most recent ones
  const recentApplications = allApplications
    .sort(
      (a, b) =>
        new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime()
    )
    .slice(0, 10); // Show top 10 most recent

  // Calculate pending applications count
  const pendingApplicationsCount = allApplications.filter(
    (app) => app.status === "pending"
  ).length;

  // Calculate total unique volunteers from all applications
  const uniqueVolunteers = new Set(
    allApplications.map((app) => app.volunteer.id)
  );
  const totalVolunteersCount = uniqueVolunteers.size;

  // Calculate total hours from all unique volunteers
  // Since total_hours is cumulative per volunteer, we take the maximum value for each volunteer
  // (in case the same volunteer appears in multiple applications with potentially different total_hours)
  const volunteerHoursMap = new Map<string, number>();
  allApplications.forEach((app) => {
    const volunteerId = app.volunteer.id;
    const currentHours = volunteerHoursMap.get(volunteerId) || 0;
    // Take the maximum total_hours for each volunteer (most up-to-date value)
    volunteerHoursMap.set(
      volunteerId,
      Math.max(currentHours, app.volunteer.total_hours || 0)
    );
  });
  const totalHours = Array.from(volunteerHoursMap.values()).reduce(
    (sum, hours) => sum + hours,
    0
  );

  // Organization stats calculated from real API data
  const orgStats = {
    totalVolunteers: totalVolunteersCount,
    activeOpportunities: displayedOpportunities.length,
    totalHours: Math.round(totalHours * 10) / 10, // Round to 1 decimal place
    pendingApplications: pendingApplicationsCount,
  };

  const openModal = (opportunityId: string) => {
    // Find applications for this specific event by matching event_id
    const eventData = allApplicationsData?.find(
      (eventData) => eventData.event_id === opportunityId
    );

    if (eventData) {
      // Sort applications by applied_at (most recent first)
      const sortedApps = [...eventData.applications].sort(
        (a, b) =>
          new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime()
      );
      setSelectedApplications(
        sortedApps.map((app) => ({
          ...app,
          event_title: eventData.event_title,
        }))
      );
      setSelectedEventTitle(eventData.event_title);
    } else {
      setSelectedApplications([]);
      setSelectedEventTitle("");
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedApplications([]);
    setSelectedEventTitle("");
  };

  const updateApplicationStatus = (participationId: string, status: string) => {
    const updated = selectedApplications.map((app) =>
      app.participation_id === participationId ? { ...app, status } : app
    );
    setSelectedApplications(updated);
    // TODO: Make API call to update application status
  };

  // Show loading or error state if organization profile is not available
  if (isLoadingProfile) {
    return (
      <section className="px-8 py-10 max-w-7xl mx-auto">
        <div className="flex justify-center items-center py-20">
          <p className="text-gray-600">Loading organization profile...</p>
        </div>
      </section>
    );
  }

  if (!organizationProfile) {
    return (
      <section className="px-8 py-10 max-w-7xl mx-auto">
        <div className="flex flex-col justify-center items-center py-20">
          <p className="text-red-600 mb-4">
            Organization profile not found. Please ensure you are onboarded.
          </p>
          <Link
            to="/organization/onboard"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Go to Onboarding
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="px-8 py-10 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Organization Dashboard</h1>
        <p className="text-gray-600">
          Manage your opportunities and connect with volunteers
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Total Volunteers</p>
              <p className="text-3xl font-bold text-gray-800">
                {orgStats.totalVolunteers}
              </p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Active Opportunities</p>
              <p className="text-3xl font-bold text-gray-800">
                {orgStats.activeOpportunities}
              </p>
            </div>
            <div className="text-4xl">📋</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Total Hours</p>
              <p className="text-3xl font-bold text-gray-800">
                {orgStats.totalHours}
              </p>
            </div>
            <div className="text-4xl">⏱️</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Pending Applications</p>
              <p className="text-3xl font-bold text-gray-800">
                {orgStats.pendingApplications}
              </p>
            </div>
            <div className="text-4xl">📬</div>
          </div>
        </div>
      </div>

      {/* Active Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Active Opportunities</h2>
            <Link
              to="/organization/create-event"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm font-medium"
            >
              + Create New
            </Link>
          </div>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <p className="text-gray-600">Loading events...</p>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center py-8">
                <p className="text-red-600">
                  Error loading events. Please try again.
                </p>
              </div>
            ) : displayedOpportunities.length === 0 ? (
              <div className="flex justify-center items-center py-8">
                <p className="text-gray-600">
                  No active events. Create your first event!
                </p>
              </div>
            ) : (
              displayedOpportunities.map((opportunity) => (
                <div
                  key={opportunity.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">
                        {opportunity.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {opportunity.category}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium ${
                        opportunity.status === "active"
                          ? "bg-green-100 text-green-700"
                          : opportunity.status === "future"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {opportunity.status === "active"
                        ? "Active"
                        : opportunity.status === "future"
                        ? "Upcoming"
                        : "Past"}
                    </span>
                  </div>
                  <div className="flex gap-3 mt-2 text-xs text-gray-500 mb-3">
                    <span>📍 {opportunity.location}</span>
                    <span>📅 {opportunity.duration}</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition text-sm">
                      Edit
                    </button>
                    <button
                      className="flex-1 bg-blue-100 text-blue-700 py-2 rounded-lg hover:bg-blue-200 transition text-sm"
                      onClick={() => openModal(opportunity.id)}
                    >
                      View Applications
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Applications</h2>
            <Link
              to="#"
              className="text-green-600 hover:text-green-700 text-sm font-medium"
            >
              View All →
            </Link>
          </div>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {isLoadingApplications ? (
              <div className="flex justify-center items-center py-8">
                <p className="text-gray-600">Loading applications...</p>
              </div>
            ) : recentApplications.length === 0 ? (
              <div className="flex justify-center items-center py-8">
                <p className="text-gray-600">No applications yet.</p>
              </div>
            ) : (
              recentApplications.map((application) => (
                <div
                  key={application.participation_id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">
                        {application.volunteer.name}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {application.event_title}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium ${
                        application.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : application.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {application.status === "approved"
                        ? "✓ Approved"
                        : application.status === "rejected"
                        ? "Rejected"
                        : "Pending"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    Applied {formatRelativeTime(application.applied_at)}
                  </p>
                  {application.status === "pending" && (
                    <div className="flex gap-2">
                      <button className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition text-sm">
                        Approve
                      </button>
                      <button className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition text-sm">
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-green-600 hover:bg-green-50 transition cursor-pointer">
            <div className="text-3xl mb-2">➕</div>
            <p className="text-sm font-medium text-center">
              Create Opportunity
            </p>
          </button>
          <button className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-green-600 hover:bg-green-50 transition cursor-pointer">
            <div className="text-3xl mb-2">👥</div>
            <Link
              to="/organization/manage-volunteers"
              className="text-center text-sm font-medium"
            >
              Manage Volunteers
            </Link>
          </button>
          <Link
            to="/profile"
            className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-green-600 hover:bg-green-50 transition cursor-pointer"
          >
            <div className="text-3xl mb-2">🏢</div>
            <p className="text-sm font-medium text-center">
              Organization Profile
            </p>
          </Link>
          <Link
            to="/contact"
            className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-green-600 hover:bg-green-50 transition cursor-pointer"
          >
            <div className="text-3xl mb-2">📊</div>
            <p className="text-sm font-medium text-center">View Analytics</p>
          </Link>
        </div>
      </div>

      {/* Modal for Applications */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-11/12 md:w-2/3 lg:w-1/2 max-h-[80vh] overflow-y-auto p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 font-bold"
              onClick={closeModal}
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-2">
              {selectedEventTitle || "Applicants"}
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              {selectedApplications.length} application
              {selectedApplications.length !== 1 ? "s" : ""}
            </p>
            <div className="space-y-4">
              {selectedApplications.length === 0 ? (
                <div className="flex justify-center items-center py-8">
                  <p className="text-gray-600">
                    No applications for this event.
                  </p>
                </div>
              ) : (
                selectedApplications.map((application) => (
                  <div
                    key={application.participation_id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">
                          {application.volunteer.name}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {application.volunteer.email}
                        </p>
                        {application.volunteer.phone && (
                          <p className="text-xs text-gray-500 mt-1">
                            📞 {application.volunteer.phone}
                          </p>
                        )}
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                          application.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : application.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {application.status === "approved"
                          ? "✓ Approved"
                          : application.status === "rejected"
                          ? "Rejected"
                          : "Pending"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">
                      Applied {formatRelativeTime(application.applied_at)}
                      {application.approved_at && (
                        <span className="ml-2">
                          • Approved{" "}
                          {formatRelativeTime(application.approved_at)}
                        </span>
                      )}
                    </p>
                    {application.status === "pending" && (
                      <div className="flex gap-2">
                        <button
                          className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition text-sm"
                          onClick={() =>
                            updateApplicationStatus(
                              application.participation_id,
                              "approved"
                            )
                          }
                        >
                          Approve
                        </button>
                        <button
                          className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition text-sm"
                          onClick={() =>
                            updateApplicationStatus(
                              application.participation_id,
                              "rejected"
                            )
                          }
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default OrganizationDashboard;
