import React from "react";

interface BadgeProps {
  id: string;
  name: string;
  description: string;
  criteria: string;
  image_url: string;
  isEarned?: boolean;
  awardedAt?: string;
}

const Badge: React.FC<BadgeProps> = ({
  id,
  name,
  description,
  criteria,
  image_url,
  isEarned = false,
  awardedAt,
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };

  return (
    <div
      className={`rounded-xl p-4 text-center border-2 transition ${
        isEarned
          ? "bg-green-50 border-green-400 shadow-md"
          : "bg-gray-50 border-gray-200 opacity-60"
      }`}
    >
      {image_url ? (
        <img
          src={image_url}
          alt={name}
          className="w-16 h-16 mx-auto rounded-lg object-cover mb-2"
        />
      ) : (
        <div className="text-4xl mb-2">{isEarned ? "🏅" : "🔒"}</div>
      )}
      <h4 className="font-semibold mt-2">{name}</h4>
      <p className="text-xs text-gray-600 mt-1">{description}</p>
      <p className="text-xs text-gray-500 mt-2">Criteria: {criteria}</p>
      {isEarned && awardedAt && (
        <p className="text-xs text-green-600 font-medium mt-2">
          ✓ Earned on {formatDate(awardedAt)}
        </p>
      )}
      {!isEarned && (
        <p className="text-xs text-gray-400 mt-2 italic">Not yet earned</p>
      )}
    </div>
  );
};

export default Badge;
