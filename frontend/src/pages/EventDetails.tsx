import React from "react";
import { useParams, Link } from "react-router-dom";
import { opportunitiesData } from "../data/content";

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const event = opportunitiesData.find(op => op.id === Number(id));

  if (!event) return <p className="text-center py-10">Event not found</p>;

  const applicants = event.id === 1 ? 32 : event.id === 2 ? 28 : 15;

  return (
    <div className="container mx-auto px-6 py-8 max-w-3xl">
      <img src={event.image} alt={event.title} className="w-full h-64 md:h-80 object-cover rounded-2xl mb-6" />
      <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
      <p className="text-green-700 font-medium mb-2">{event.organization}</p>
      <p className="text-gray-600 mb-4">{event.duration} • {event.location}</p>
      <span className="inline-block bg-green-600 text-white px-3 py-1 rounded-full text-sm mb-6">
        {event.category}
      </span>
      <p className="text-gray-700 mb-6">{event.description}</p>

      <div className="bg-gray-50 p-5 rounded-xl text-center mb-6">
        <p className="text-sm text-gray-600">Volunteers Joined</p>
        <p className="text-4xl font-bold text-green-600">{applicants}</p>
      </div>

      <button className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 mb-6">
        Join Event
      </button>

      <div className="flex justify-between items-center">
        <Link to="/opportunities" className="text-green-600 hover:underline">
          ← Back to Opportunities
        </Link>
        <Link
          to="/profile"
          className="bg-green-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-green-700 transition"
        >
          View My Profile
        </Link>
      </div>
    </div>
  );
};

export default EventDetails;