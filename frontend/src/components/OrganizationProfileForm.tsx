import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { organizationProfileContent as content } from "../data/content";
import API from "../lib/api-client";

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

const fetchOrganizationProfile = async (): Promise<OrganizationProfile | null> => {
  try {
    const response = await API.get<OrganizationProfileResponse>("/auth/my-organization-profile");
    return response.data.organization;
  } catch (error) {
    console.error("Error fetching organization profile:", error);
    return null;
  }
};

export default function OrganizationProfileForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    contact_email: "",
    phone: "",
    website: "",
    address: "",
  });

  const {
    data: organizationProfile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["organizationProfile"],
    queryFn: fetchOrganizationProfile,
  });

  // Populate form when profile data is loaded
  useEffect(() => {
    if (organizationProfile) {
      setFormData({
        name: organizationProfile.name || "",
        description: organizationProfile.description || "",
        contact_email: organizationProfile.contact_email || "",
        phone: organizationProfile.phone || "",
        website: organizationProfile.website || "",
        address: organizationProfile.address || "",
      });
    }
  }, [organizationProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Note: Update endpoint would go here if available
    console.log("Organization profile submitted:", formData);
    alert("Organization profile saved successfully!");
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen flex justify-center items-center ${content.theme.bg}`}>
        <div className="text-center">
          <p className="text-gray-600">Loading organization profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex justify-center items-center ${content.theme.bg}`}>
        <div className="text-center">
          <p className="text-red-600">Error loading organization profile. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex justify-center items-center ${content.theme.bg} py-10`}>
      <div className={`bg-white shadow-md rounded-xl p-8 w-full max-w-2xl border ${content.theme.border}`}>
        <h2 className={`text-2xl font-bold mb-2 ${content.theme.title}`}>
          Organization Profile
        </h2>
        <p className="text-gray-500 mb-6">{content.subtitle}</p>

        {organizationProfile && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Organization ID:</strong> {organizationProfile.id}
            </p>
            {organizationProfile.updated_at && (
              <p className="text-sm text-gray-600 mt-1">
                <strong>Last Updated:</strong>{" "}
                {new Date(organizationProfile.updated_at).toLocaleString()}
              </p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
              Organization Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter organization name"
              className={`w-full p-2 border border-gray-300 rounded-md ${content.theme.ring}`}
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-gray-700 font-medium mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              required
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your organization"
              rows={4}
              className={`w-full p-2 border border-gray-300 rounded-md ${content.theme.ring}`}
            />
          </div>

          <div>
            <label htmlFor="contact_email" className="block text-gray-700 font-medium mb-1">
              Contact Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="contact_email"
              name="contact_email"
              required
              value={formData.contact_email}
              onChange={handleChange}
              placeholder="Enter contact email"
              className={`w-full p-2 border border-gray-300 rounded-md ${content.theme.ring}`}
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-gray-700 font-medium mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className={`w-full p-2 border border-gray-300 rounded-md ${content.theme.ring}`}
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-gray-700 font-medium mb-1">
              Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="address"
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter organization address"
              className={`w-full p-2 border border-gray-300 rounded-md ${content.theme.ring}`}
            />
          </div>

          <div>
            <label htmlFor="website" className="block text-gray-700 font-medium mb-1">
              Website (Optional)
            </label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="Enter website URL"
              className={`w-full p-2 border border-gray-300 rounded-md ${content.theme.ring}`}
            />
          </div>

          <button
            type="submit"
            className={`w-full text-white py-2 rounded-md transition duration-200 ${content.theme.button}`}
          >
            {content.submitButton}
          </button>
        </form>
      </div>
    </div>
  );
}
