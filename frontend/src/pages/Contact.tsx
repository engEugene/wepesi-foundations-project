import React from "react";
import { contactContent } from "../data/content";

const Contact: React.FC = () => {
  const { title, subtitle, socials } = contactContent;

  return (
    <section className="px-8 py-10 text-center">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="text-gray-600 mb-6">{subtitle}</p>

      <div className="flex justify-center gap-6">
        <a href={socials.instagram} className="text-pink-600 hover:underline">Instagram</a>
        <a href={socials.linkedin} className="text-blue-600 hover:underline">LinkedIn</a>
        <a href={socials.x} className="text-gray-800 hover:underline">X (Twitter)</a>
      </div>
    </section>
  );
};

export default Contact;
