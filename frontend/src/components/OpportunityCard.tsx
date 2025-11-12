import React from "react";
import { Link } from "react-router-dom";  // ← ADD THIS

interface OpportunityCardProps {
  id: number; 
  title: string;
  organization: string;
  duration: string;
  location: string;
  category: string;
  description: string;
  image?: string;
}

const OpportunityCard: React.FC<OpportunityCardProps> = ({
  id, 
  title,
  organization,
  duration,
  location,
  category,
  description,
  image,
}) => {
  return (
    <div className="bg-white shadow-md rounded-2xl hover:shadow-lg transition">
      <div>
        <img
          src={image || "/public/images/treeplanting.jpg"}
          alt={title}
          className="rounded-xl w-full h-40 object-cover"
        />
      </div>
      <div className="mt-3 flex flex-col px-4 py-2">
        <h3 className="text-lg font-semibold mt-3">{title}</h3>
        <p className="text-sm text-gray-500">{organization}</p>
        <p className="text-sm mt-1">{duration}</p>
        <p className="text-sm">{location}</p>
        <span className="text-green-600 font-medium">{category}</span>
        <p className="mt-2 text-gray-600 text-sm">{description}</p>

        {/* ← REPLACE BUTTON WITH LINK */}
        <Link to={`/event/${id}`}>
          <button className="mt-3 bg-green-600 text-white py-2 px-4 rounded-xl hover:bg-green-700 w-full">
            View Details
          </button>
        </Link>
      </div>
    </div>
  );
};

export default OpportunityCard;