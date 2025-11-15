import React from "react";
import { Link } from "react-router-dom";
import { defaultProfile, badgesData } from "../data/content";
import { opportunitiesData } from "../data/content";

const VolunteerDashboard: React.FC = () => {
  const { name, hours, completedActivities } = defaultProfile;
  
  // Mock upcoming activities
  const upcomingActivities = opportunitiesData.slice(0, 3);
  
  // Mock recent achievements
  const recentAchievements = [
    { title: "Completed Tree Planting Event", date: "2 days ago", badge: "🌱" },
    { title: "Earned Contributor Badge", date: "1 week ago", badge: "🔆" },
    { title: "Reached 40 Volunteer Hours", date: "2 weeks ago", badge: "⭐" },
  ];

  return (
    <section className="px-8 py-10 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {name}!</h1>
        <p className="text-gray-600">Here's an overview of your volunteering journey</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Total Hours</p>
              <p className="text-3xl font-bold text-gray-800">{hours}</p>
            </div>
            <div className="text-4xl">⏱️</div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Activities Completed</p>
              <p className="text-3xl font-bold text-gray-800">{completedActivities}</p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Active Badges</p>
              <p className="text-3xl font-bold text-gray-800">{badgesData.length}</p>
            </div>
            <div className="text-4xl">🏆</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Activities */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Upcoming Activities</h2>
            <Link to="/opportunities" className="text-green-600 hover:text-green-700 text-sm font-medium">
              View All →
            </Link>
          </div>
          <div className="space-y-4">
            {upcomingActivities.map((activity) => (
              <div key={activity.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{activity.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{activity.organization}</p>
                    <div className="flex gap-3 mt-2 text-xs text-gray-500">
                      <span>📍 {activity.location}</span>
                      <span>📅 {activity.duration}</span>
                    </div>
                  </div>
                </div>
                <button className="mt-3 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition text-sm">
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Achievements</h2>
          <div className="space-y-4">
            {recentAchievements.map((achievement, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl">{achievement.badge}</div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{achievement.title}</p>
                  <p className="text-sm text-gray-500">{achievement.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/opportunities"
            className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-green-600 hover:bg-green-50 transition cursor-pointer"
          >
            <div className="text-3xl mb-2">🔍</div>
            <p className="text-sm font-medium text-center">Find Opportunities</p>
          </Link>
          <Link
            to="/profile"
            className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-green-600 hover:bg-green-50 transition cursor-pointer"
          >
            <div className="text-3xl mb-2">👤</div>
            <p className="text-sm font-medium text-center">View Profile</p>
          </Link>
          <Link
            to="/badges"
            className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-green-600 hover:bg-green-50 transition cursor-pointer"
          >
            <div className="text-3xl mb-2">🏅</div>
            <p className="text-sm font-medium text-center">My Badges</p>
          </Link>
          <Link
            to="/contact"
            className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-green-600 hover:bg-green-50 transition cursor-pointer"
          >
            <div className="text-3xl mb-2">📞</div>
            <p className="text-sm font-medium text-center">Contact Support</p>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default VolunteerDashboard;
