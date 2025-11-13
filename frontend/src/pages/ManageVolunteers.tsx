import React, { useState } from "react";
import { opportunitiesData } from "../data/content";
import { Link } from "react-router-dom";

const ManageVolunteers: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedApplications, setSelectedApplications] = useState<any[]>([]);

  // Mock categorization
  const active = opportunitiesData.slice(0, 2);
  const future = opportunitiesData.slice(2, 4);
  const past = opportunitiesData.slice(4, 6);

  const opportunityApplications = opportunitiesData.map((opportunity) => ({
    opportunityId: opportunity.id,
    applicants: [
      { name: "John Doe", date: "2 hours ago", status: "pending" },
      { name: "Jane Smith", date: "5 hours ago", status: "approved" },
    ],
  }));

  const openModal = (opportunityId: number) => {
    const apps = opportunityApplications.find(
      (o) => o.opportunityId === opportunityId
    )?.applicants;
    setSelectedApplications(apps || []);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedApplications([]);
  };

  const updateApplicationStatus = (index: number, status: string) => {
    const updated = [...selectedApplications];
    updated[index].status = status;
    setSelectedApplications(updated);
  };

  const renderOpportunityCard = (opportunity: any, editable: boolean) => (
    <div
      key={opportunity.id}
      className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
    >
      <h3 className="font-semibold text-gray-800 mb-1">{opportunity.title}</h3>
      <p className="text-sm text-gray-600">{opportunity.category}</p>
      <div className="flex gap-2 mt-4">
        {editable && (
          <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition text-sm">
            Edit
          </button>
        )}
        <button
          className="flex-1 bg-blue-100 text-blue-700 py-2 rounded-lg hover:bg-blue-200 transition text-sm"
          onClick={() => openModal(opportunity.id)}
        >
          View Applications
        </button>
      </div>
    </div>
  );

  return (
    <section className="px-8 py-10 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Manage Volunteers</h1>

      {/* Active Opportunities */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Active Opportunities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {active.map((op) => renderOpportunityCard(op, true))}
        </div>
      </div>

      {/* Future Opportunities */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Future Opportunities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {future.map((op) => renderOpportunityCard(op, true))}
        </div>
      </div>

      {/* Past Opportunities */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Past Opportunities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {past.map((op) => renderOpportunityCard(op, false))}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-11/12 md:w-2/3 lg:w-1/2 max-h-[80vh] overflow-y-auto p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 font-bold"
              onClick={closeModal}
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4">Applicants</h2>
            <div className="space-y-4">
              {selectedApplications.map((applicant, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{applicant.name}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Applied for Opportunity
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium ${
                        applicant.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : applicant.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {applicant.status === "approved"
                        ? "✓ Approved"
                        : applicant.status === "rejected"
                        ? "Rejected"
                        : "Pending"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">{applicant.date}</p>
                  {applicant.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition text-sm"
                        onClick={() => updateApplicationStatus(index, "approved")}
                      >
                        Approve
                      </button>
                      <button
                        className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition text-sm"
                        onClick={() => updateApplicationStatus(index, "rejected")}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ManageVolunteers;
