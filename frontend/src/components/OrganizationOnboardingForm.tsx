import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formSections } from "../data/content";
import useAuthStore from "../lib/auth-store";
import API from "../lib/api-client"; 

export default function OrganizationOnboardingForm() {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  const onboardingForm = formSections.find((f) => f.id === "onboarding");
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    contact_email: user?.email || "",
    website: "",
    address: "",
    phone: "",
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await API.post("/auth/onboard-organization", {
        name: formData.name,
        description: formData.description,
        contact_email: formData.contact_email,
        website: formData.website,
        address: formData.address,
        phone: formData.phone,
      });

      if (response.status === 201) {
        if (user) {
          setUser({ ...user, is_org_onboarded: true });
        }
        
        alert("Organization onboarded successfully!");
        navigate("/organization/dashboard");
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to onboard organization. Please try again.";
      setError(errorMessage);
      console.error("Onboarding error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold text-green-700 mb-2">
        {onboardingForm?.title}
      </h2>
      <p className="text-gray-600 mb-4">{onboardingForm?.description}</p>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form className="grid gap-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className="block text-gray-700 mb-1">
            Organization Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="Enter organization name"
            value={formData.name}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Describe your organization"
            value={formData.description}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full"
            rows={3}
            required
          />
        </div>

        <div>
          <label htmlFor="contact_email" className="block text-gray-700 mb-1">
            Contact Email <span className="text-red-500">*</span>
          </label>
          <input
            id="contact_email"
            type="email"
            name="contact_email"
            placeholder="Enter contact email"
            value={formData.contact_email}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full"
            required
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-gray-700 mb-1">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            name="phone"
            placeholder="Enter phone number"
            value={formData.phone}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full"
            required
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-gray-700 mb-1">
            Address <span className="text-red-500">*</span>
          </label>
          <input
            id="address"
            type="text"
            name="address"
            placeholder="Enter organization address"
            value={formData.address}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full"
            required
          />
        </div>

        <div>
          <label htmlFor="website" className="block text-gray-700 mb-1">
            Website (Optional)
          </label>
          <input
            id="website"
            type="url"
            name="website"
            placeholder="Enter website URL"
            value={formData.website}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}