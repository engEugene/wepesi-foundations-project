import React from "react";
import { useQuery } from "@tanstack/react-query";
import API from "../lib/api-client";
import Badge from "../components/Badge";

interface BadgeData {
  id: string;
  name: string;
  description: string;
  criteria: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  awarded_at: string;
  event_id: string | null;
  badge: BadgeData;
}

const fetchAllBadges = async (): Promise<BadgeData[]> => {
  try {
    const response = await API.get<BadgeData[]>("/badge");
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching badges:", error);
    return [];
  }
};

const fetchUserBadges = async (): Promise<UserBadge[]> => {
  try {
    const response = await API.get<UserBadge[]>("/badge/my-badges");
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching user badges:", error);
    return [];
  }
};

const Badges: React.FC = () => {
  const { data: allBadges, isLoading: badgesLoading } = useQuery({
    queryKey: ["badges"],
    queryFn: fetchAllBadges,
  });

  const { data: userBadges, isLoading: userBadgesLoading } = useQuery({
    queryKey: ["userBadges"],
    queryFn: fetchUserBadges,
  });

  const earnedBadgeIds = new Set(
    userBadges?.map((ub) => ub.badge_id) || []
  );

  if (badgesLoading || userBadgesLoading) {
    return (
      <section className="px-8 py-10 text-center">
        <p className="text-gray-600">Loading badges...</p>
      </section>
    );
  }

  return (
    <section className="px-8 py-10 max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-3">Your Volunteer Badges</h2>
        <p className="text-gray-600 mb-2">
          Each badge represents a milestone in your volunteering journey — from
          your first steps to becoming a community leader. Keep contributing and
          earn them all!
        </p>
        {userBadges && userBadges.length > 0 && (
          <p className="text-green-600 font-medium">
            You've earned {userBadges.length} badge
            {userBadges.length !== 1 ? "s" : ""}!
          </p>
        )}
      </div>

      {!allBadges || allBadges.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600">No badges available.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {allBadges.map((badge) => {
            const isEarned = earnedBadgeIds.has(badge.id);
            const userBadge = userBadges?.find((ub) => ub.badge_id === badge.id);
            return (
              <Badge
                key={badge.id}
                id={badge.id}
                name={badge.name}
                description={badge.description}
                criteria={badge.criteria}
                image_url={badge.image_url}
                isEarned={isEarned}
                awardedAt={userBadge?.awarded_at}
              />
            );
          })}
        </div>
      )}
    </section>
  );
};

export default Badges;
