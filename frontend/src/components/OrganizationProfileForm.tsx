import { useState } from "react";
import { organizationProfileContent as content } from "../data/content";

export default function OrganizationProfileForm() {
  const initialData = Object.fromEntries(content.fields.map(f => [f.name, ""]));
  const [formData, setFormData] = useState(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Organization profile submitted:", formData);
    alert("Organization profile saved successfully!");
  };

  return (
    <div className={`min-h-screen flex justify-center items-center ${content.theme.bg}`}>
      <form
        onSubmit={handleSubmit}
        className={`bg-white shadow-md rounded-xl p-8 w-full max-w-2xl border ${content.theme.border}`}
      >
        <h2 className={`text-2xl font-bold mb-2 ${content.theme.title}`}>
          {content.title}
        </h2>
        <p className="text-gray-500 mb-6">{content.subtitle}</p>

        {content.fields.map((field: any) => (
          <label key={field.name} className="block mb-4">
            <span className="text-gray-700 font-medium">{field.label}</span>
            {field.type === "textarea" ? (
              <textarea
                name={field.name}
                required={field.required}
                onChange={handleChange}
                value={formData[field.name]}
                placeholder={field.placeholder || ""}
                className={`w-full mt-1 p-2 border border-gray-300 rounded-md h-24 ${content.theme.ring}`}
              />
            ) : (
              <input
                type={field.type}
                name={field.name}
                required={field.required}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder || ""}
                className={`w-full mt-1 p-2 border border-gray-300 rounded-md ${content.theme.ring}`}
              />
            )}
          </label>
        ))}

        <button
          type="submit"
          className={`w-full text-white py-2 rounded-md transition duration-200 ${content.theme.button}`}
        >
          {content.submitButton}
        </button>
      </form>
    </div>
  );
}
