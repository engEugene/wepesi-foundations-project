import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../lib/api-client";

interface Badge {
  id: string;
  name: string;
  description: string;
  criteria: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

interface Participation {
  participation_id: string;
  status: string;
  volunteer_hours: number | null;
  volunteer: {
    id: string;
    name: string;
    email: string;
    phone: number;
    total_hours: number;
  };
}

interface EventApplicationsResponse {
  event_title: string;
  count: number;
  applications: Participation[];
}

interface BadgeManagementProps {
  eventId: string;
  eventTitle: string;
  onClose: () => void;
}

const fetchAllBadges = async (): Promise<Badge[]> => {
  try {
    const response = await API.get<Badge[]>("/badge");
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching badges:", error);
    return [];
  }
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

const awardBadge = async ({
  userId,
  badgeId,
  eventId,
}: {
  userId: string;
  badgeId: string;
  eventId: string;
}): Promise<void> => {
  await API.post("/badge/award", {
    user_id: userId,
    badge_id: badgeId,
    event_id: eventId,
  });
};

const BadgeManagement: React.FC<BadgeManagementProps> = ({
  eventId,
  eventTitle,
  onClose,
}) => {
  const [selectedVolunteer, setSelectedVolunteer] = useState<string | null>(
    null
  );
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: badges, isLoading: badgesLoading } = useQuery({
    queryKey: ["badges"],
    queryFn: fetchAllBadges,
  });

  const { data: applicationsData, isLoading: applicationsLoading } = useQuery({
    queryKey: ["eventApplications", eventId],
    queryFn: () => fetchEventApplications(eventId),
  });

  const awardBadgeMutation = useMutation({
    mutationFn: awardBadge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["volunteerStats"] });
      queryClient.invalidateQueries({ queryKey: ["userBadges"] });
      alert("Badge awarded successfully!");
      setSelectedVolunteer(null);
      setSelectedBadge(null);
    },
    onError: (error: any) => {
      console.error("Error awarding badge:", error);
      alert(
        error.response?.data?.message ||
          "Failed to award badge. Please try again."
      );
    },
  });

  const approvedParticipants =
    applicationsData?.applications.filter((app) => app.status === "approved") ||
    [];

  const handleAwardBadge = () => {
    if (!selectedVolunteer || !selectedBadge) {
      alert("Please select both a volunteer and a badge");
      return;
    }
    awardBadgeMutation.mutate({
      userId: selectedVolunteer,
      badgeId: selectedBadge,
      eventId,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-11/12 md:w-2/3 lg:w-3/4 max-h-[80vh] overflow-y-auto p-6 relative">
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 font-bold text-2xl"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-2">Award Badges</h2>
        <p className="text-sm text-gray-600 mb-6">{eventTitle}</p>

        {applicationsLoading || badgesLoading ? (
          <div className="flex justify-center items-center py-8">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Volunteers Section */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">
                Select Volunteer
              </h3>
              {approvedParticipants.length === 0 ? (
                <p className="text-gray-600 text-sm">
                  No approved participants for this event.
                </p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {approvedParticipants.map((participation) => (
                    <button
                      key={participation.participation_id}
                      onClick={() =>
                        setSelectedVolunteer(participation.volunteer.id)
                      }
                      className={`w-full text-left p-3 rounded-lg border-2 transition ${
                        selectedVolunteer === participation.volunteer.id
                          ? "border-green-600 bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <p className="font-medium text-gray-800">
                        {participation.volunteer.name}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {participation.volunteer.email}
                      </p>
                      {participation.volunteer_hours !== null && (
                        <p className="text-xs text-green-600 mt-1">
                          {participation.volunteer_hours} hours logged
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Badges Section */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Select Badge</h3>
              {!badges || badges.length === 0 ? (
                <p className="text-gray-600 text-sm">No badges available.</p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {badges.map((badge) => (
                    <button
                      key={badge.id}
                      onClick={() => setSelectedBadge(badge.id)}
                      className={`w-full text-left p-3 rounded-lg border-2 transition ${
                        selectedBadge === badge.id
                          ? "border-green-600 bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {badge.image_url ? (
                          <img
                            src={badge.image_url}
                            alt={badge.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center text-2xl">
                            🏅
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">
                            {badge.name}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            {badge.description}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Criteria: {badge.criteria}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-6 mt-6 border-t">
          <button
            onClick={handleAwardBadge}
            disabled={
              awardBadgeMutation.isPending ||
              !selectedVolunteer ||
              !selectedBadge
            }
            className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {awardBadgeMutation.isPending ? "Awarding..." : "Award Badge"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BadgeManagement;
