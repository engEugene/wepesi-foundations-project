import React from "react";

interface BadgeProps {
  name: string;
  levelIcon: string;
  requirement: string;
  description: string;
}

const Badge: React.FC<BadgeProps> = ({ name, levelIcon, requirement, description }) => {
  return (
    <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
      <div className="text-3xl">{levelIcon}</div>
      <h4 className="font-semibold mt-2">{name}</h4>
      <p className="text-sm text-gray-500">{requirement}</p>
      <p className="text-xs text-gray-600 mt-1">{description}</p>
    </div>
  );
};

export default Badge;
