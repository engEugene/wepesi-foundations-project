import { useState } from "react";
import { formSections } from "../data/content.ts";

export default function OrganizationOnboardingForm() {
  const onboardingForm = formSections.find((f) => f.id === "onboarding");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    description: "",
    website: "",
    focusAreas: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    alert("Organization submitted successfully!");
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold text-green-700 mb-2">
        {onboardingForm?.title}
      </h2>
      <p className="text-gray-600 mb-4">{onboardingForm?.description}</p>

      <form className="grid gap-4" onSubmit={handleSubmit}>
        {onboardingForm?.fields.map((field) => {
          const id = field.toLowerCase().replace(/\s+/g, "");
          return (
            <div key={field}>
              <label htmlFor={id} className="block text-gray-700 capitalize mb-1">{field}</label>
              {field === "Description" ? (
                <textarea
                  id={id}
                  name={id}
                  title={field}
                  placeholder={`Enter ${field}`}
                  value={formData[id as keyof typeof formData]}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg p-2 w-full"
                  rows={3}
                />
              ) : (
                <input
                  id={id}
                  type="text"
                  name={id}
                  title={field}
                  placeholder={`Enter ${field}`}
                  value={formData[id as keyof typeof formData]}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg p-2 w-full"
                />
              )}
            </div>
          );
        })}
        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
