import { useState } from "react";
import { formSections } from "../data/content";

export default function EventCreationForm() {
  const eventForm = formSections.find((f) => f.id === "eventCreation");

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
    skillsRequired: "",
    volunteerSlots: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    alert("Event created successfully!");
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold text-green-700 mb-2">{eventForm?.title}</h2>
      <p className="text-gray-600 mb-4">{eventForm?.description}</p>

      <form className="grid gap-4" onSubmit={handleSubmit}>
        {eventForm?.fields.map((field) => (
          <div key={field}>
            <label
              htmlFor={field.toLowerCase().replace(/\s+/g, "")}
              className="block text-gray-700 capitalize mb-1"
            >
              {field}
            </label>
            {field === "Description" ? (
              <textarea
                id={field.toLowerCase().replace(/\s+/g, "")}
                name={field.toLowerCase().replace(/\s+/g, "")}
                value={formData[field.toLowerCase().replace(/\s+/g, "") as keyof typeof formData]}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-2 w-full"
                rows={3}
                title={`Enter ${field}`}
                placeholder={`Enter ${field}`}
              />
            ) : (
              <input
                id={field.toLowerCase().replace(/\s+/g, "")}
                type={field === "Date" ? "date" : "text"}
                name={field.toLowerCase().replace(/\s+/g, "")}
                value={formData[field.toLowerCase().replace(/\s+/g, "") as keyof typeof formData]}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-2 w-full"
                title={`Enter ${field}`}
                placeholder={`Enter ${field}`}
              />
            )}
          </div>
        ))}
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Create Event
        </button>
      </form>
    </div>
  );
}
