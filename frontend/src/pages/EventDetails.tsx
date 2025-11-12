import React from "react";
import { useParams, Link } from "react-router-dom";
import { opportunitiesData } from "../data/content";

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const event = opportunitiesData.find(op => op.id === Number(id));

  if (!event) return <p className="text-center py-10 text-gray-600">Event not found</p>;

  // Mock applicants (replace with real API later)
  const applicants = Math.floor(Math.random() * 50 + 10);

  return (
    <div className="container mx-auto px-6 py-8 max-w-3xl bg-white rounded-2xl shadow-md">
      <img
        src={event.image}
        alt={event.title}
        className="w-full h-64 md:h-80 object-cover rounded-t-2xl mb-6"
      />
      <h1 className="text-3xl font-bold text-gray-800 mb-1">{event.title}</h1>
      <p className="text-green-700 font-medium mb-2">{event.organization}</p>
      <p className="text-gray-600 mb-2">{event.duration}</p>
      <p className="text-gray-600 mb-4">{event.location}</p>
      <span className="inline-block bg-green-600 text-white px-3 py-1 rounded-full text-sm mb-6">
        {event.category}
      </span>
      <p className="text-gray-700 leading-relaxed mb-6">{event.description}</p>

      <div className="bg-gray-50 p-5 rounded-xl mb-6 text-center">
        <p className="text-sm text-gray-600">Volunteers Joined</p>
        <p className="text-4xl font-bold text-green-600">{applicants}</p>
      </div>

      <button className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 mb-4">
        Join Event
      </button>

      <Link to="/opportunities" className="block text-center text-green-600 hover:underline">
        ← Back to Opportunities
      </Link>
    </div>
  );
};

export default EventDetails;