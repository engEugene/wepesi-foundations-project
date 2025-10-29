import React from "react";
import { badgesData } from "../data/content";
import Badge from "../components/Badge";

const Badges: React.FC = () => {
  return (
    <section className="px-8 py-10 text-center">
      <h2 className="text-2xl font-semibold mb-3">Your Volunteer Badges</h2>
      <p className="text-gray-600 mb-8">
        Each badge represents a milestone in your volunteering journey — from your first steps
        to becoming a community leader. Keep contributing and earn them all!
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {badgesData.map((badge, index) => (
          <Badge key={index} {...badge} />
        ))}
      </div>
    </section>
  );
};

export default Badges;
