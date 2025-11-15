import React, { useState, useEffect } from "react";
import Badge from "../components/Badge";

interface ProfileData {
  name: string;
  title: string;
  hours: number;
  completedActivities: number;
  avatar: string;
  badges: { name: string; levelIcon: string; requirement: string; description: string }[];
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/profile")
      .then(res => res.json())
      .then(data => {
        // Map Flask badges to your Badge component format
        const mappedBadges = data.badges.map((name: string) => {
          const mockBadge = {
            name,
            levelIcon: name === "Environmentalist" ? "leaf" : name === "Contributor" ? "sun" : "globe",
            requirement: name === "Environmentalist" ? "1–10 hours" : "11–50 hours",
            description: `Earned ${name} badge`
          };
          return mockBadge;
        });

        setProfile({
          name: data.name,
          title: data.title,
          hours: data.hours,
          completedActivities: data.completedActivities,
          avatar: data.avatar,
          badges: mappedBadges
        });
      })
      .catch(() => console.log("Failed to load profile"));
  }, []);

  if (!profile) return <p className="text-center py-10">Loading...</p>;
  const { name, hours, completedActivities, avatar } = defaultProfile;

  return (
    <section className="px-8 py-10 text-center">
      <img
        src={profile.avatar}
        src="/src/images/placeholder.png"
        alt="Profile"
        className="w-32 h-32 mx-auto rounded-full object-cover mb-4 border-4 border-green-600"
      />
      <h2 className="text-2xl font-semibold">{profile.name}</h2>
      <p className="text-gray-600">{profile.title}</p>
      <h2 className="text-2xl font-semibold">{name}</h2>
      {/* <p className="text-gray-600">{school}</p> */}
      <div className="mt-4 flex justify-center gap-8">
        <div>
          <p className="text-lg font-semibold">{profile.hours}</p>
          <p className="text-gray-500 text-sm">Volunteer Hours</p>
        </div>
        <div>
          <p className="text-lg font-semibold">{profile.completedActivities}</p>
          <p className="text-gray-500 text-sm">Activities</p>
        </div>
      </div>

      <h3 className="text-xl font-semibold mt-8 mb-4">Badges</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {profile.badges.map((badge, i) => (
          <Badge key={i} {...badge} />
        ))}
      </div>
    </section>
  );
};

export default Profile;