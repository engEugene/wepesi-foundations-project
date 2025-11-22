import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Badge from "../components/Badge";
import OrganizationProfileForm from "../components/OrganizationProfileForm";
import useAuthStore from "../lib/auth-store";

const Profile: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // If user is an organization, show organization profile form
  if (user?.role === "organization") {
    return <OrganizationProfileForm />;
  }

  // Default volunteer profile view
  return (
    <section className="px-8 py-10 text-center">
      <img
        src={"/images/placeholder.png"}
        alt="Profile"
        className="w-32 h-32 mx-auto rounded-full object-cover mb-4 border-4 border-green-600"
      />
      <h2 className="text-2xl font-semibold">Name</h2>
      <p className="text-gray-600">Volunteer</p>
      <h2 className="text-2xl font-semibold">Eugene</h2>
      {/* <p className="text-gray-600">{school}</p> */}
      <div className="mt-4 flex justify-center gap-8">
        <div>
          <p className="text-lg font-semibold">5 hours</p>
          <p className="text-gray-500 text-sm">Volunteer Hours</p>
        </div>
        <div>
          <p className="text-lg font-semibold">completed activitie</p>
          <p className="text-gray-500 text-sm">Activities</p>
        </div>
      </div>

      <h3 className="text-xl font-semibold mt-8 mb-4">Badges</h3>
      
    </section>
  );
};

export default Profile;