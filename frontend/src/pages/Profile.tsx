import React from "react";
import { defaultProfile, badgesData } from "../data/content";
import Badge from "../components/Badge";

const Profile: React.FC = () => {
  const { name, hours, completedActivities, avatar } = defaultProfile;

  return (
    <section className="px-8 py-10 text-center">
      <img
        src="/public/images/leila-avatar.png"
        alt="Profile"
        className="w-32 h-32 mx-auto rounded-full object-cover mb-4"
      />
      <h2 className="text-2xl font-semibold">{name}</h2>
      {/* <p className="text-gray-600">{school}</p> */}
      <div className="mt-4 flex justify-center gap-8">
        <div>
          <p className="text-lg font-semibold">{hours}</p>
          <p className="text-gray-500 text-sm">Volunteer Hours</p>
        </div>
        <div>
          <p className="text-lg font-semibold">{completedActivities}</p>
          <p className="text-gray-500 text-sm">Activities</p>
        </div>
      </div>

      <h3 className="text-xl font-semibold mt-8 mb-4">Badges</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {badgesData.map((badge, i) => (
          <Badge key={i} {...badge} />
        ))}
      </div>
    </section>
  );
};

export default Profile;
