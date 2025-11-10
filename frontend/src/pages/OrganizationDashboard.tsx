import React from "react";
import { Link } from "react-router-dom";
import { opportunitiesData } from "../data/content";

const OrganizationDashboard: React.FC = () => {
  // Mock organization data
  const orgStats = {
    totalVolunteers: 127,
    activeOpportunities: opportunitiesData.length,
    totalHours: 3420,
    pendingApplications: 23,
  };

  // Mock recent applications
  const recentApplications = [
    { name: "John Doe", opportunity: "Tree Planting in Karura Forest", date: "2 hours ago", status: "pending" },
    { name: "Jane Smith", opportunity: "Beach Cleanup Drive", date: "5 hours ago", status: "approved" },
    { name: "Mike Johnson", opportunity: "Community Climate Awareness Workshop", date: "1 day ago", status: "pending" },
  ];

  const activeOpportunities = opportunitiesData;

  return (
    <section className="px-8 py-10 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Organization Dashboard</h1>
        <p className="text-gray-600">Manage your opportunities and connect with volunteers</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Total Volunteers</p>
              <p className="text-3xl font-bold text-gray-800">{orgStats.totalVolunteers}</p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Active Opportunities</p>
              <p className="text-3xl font-bold text-gray-800">{orgStats.activeOpportunities}</p>
            </div>
            <div className="text-4xl">📋</div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Total Hours</p>
              <p className="text-3xl font-bold text-gray-800">{orgStats.totalHours}</p>
            </div>
            <div className="text-4xl">⏱️</div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Pending Applications</p>
              <p className="text-3xl font-bold text-gray-800">{orgStats.pendingApplications}</p>
            </div>
            <div className="text-4xl">📬</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Opportunities */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Active Opportunities</h2>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm font-medium">
              + Create New
            </button>
          </div>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {activeOpportunities.map((opportunity) => (
              <div key={opportunity.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{opportunity.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{opportunity.category}</p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                    Active
                  </span>
                </div>
                <div className="flex gap-3 mt-2 text-xs text-gray-500 mb-3">
                  <span>📍 {opportunity.location}</span>
                  <span>📅 {opportunity.duration}</span>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition text-sm">
                    Edit
                  </button>
                  <button className="flex-1 bg-blue-100 text-blue-700 py-2 rounded-lg hover:bg-blue-200 transition text-sm">
                    View Applications
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Applications</h2>
            <Link to="#" className="text-green-600 hover:text-green-700 text-sm font-medium">
              View All →
            </Link>
          </div>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {recentApplications.map((application, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{application.name}</p>
                    <p className="text-sm text-gray-600 mt-1">{application.opportunity}</p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full font-medium ${
                      application.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {application.status === "approved" ? "✓ Approved" : "Pending"}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-3">{application.date}</p>
                {application.status === "pending" && (
                  <div className="flex gap-2">
                    <button className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition text-sm">
                      Approve
                    </button>
                    <button className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition text-sm">
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-green-600 hover:bg-green-50 transition cursor-pointer">
            <div className="text-3xl mb-2">➕</div>
            <p className="text-sm font-medium text-center">Create Opportunity</p>
          </button>
          <button className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-green-600 hover:bg-green-50 transition cursor-pointer">
            <div className="text-3xl mb-2">👥</div>
            <p className="text-sm font-medium text-center">Manage Volunteers</p>
          </button>
          <Link
            to="/profile"
            className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-green-600 hover:bg-green-50 transition cursor-pointer"
          >
            <div className="text-3xl mb-2">🏢</div>
            <p className="text-sm font-medium text-center">Organization Profile</p>
          </Link>
          <Link
            to="/contact"
            className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-green-600 hover:bg-green-50 transition cursor-pointer"
          >
            <div className="text-3xl mb-2">📊</div>
            <p className="text-sm font-medium text-center">View Analytics</p>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default OrganizationDashboard;
