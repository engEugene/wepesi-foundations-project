import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import API from "../lib/api-client";
import OpportunityCard from "../components/OpportunityCard";
import EventDetailsModal from "../components/EventDetailsModal";

interface ApiEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  start_time: string;
  end_time: string;
  max_participants: number;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  message: string;
  events: ApiEvent[];
}

const formatDuration = (startTime: string, endTime: string): string => {
  try {
    const start = new Date(startTime);
    const end = new Date(endTime);

    const startDate = start.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    const startTimeStr = start.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    const endTimeStr = end.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    // Check if same day
    if (start.toDateString() === end.toDateString()) {
      return `${startDate} (${startTimeStr} - ${endTimeStr})`;
    } else {
      const endDate = end.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      return `${startDate} - ${endDate}`;
    }
  } catch (error) {
    return "Date TBD";
  }
};

const fetchEvents = async (): Promise<ApiEvent[]> => {
  const response = await API.get<ApiResponse[]>("/event");
  // The API returns an array with one object containing events
  if (Array.isArray(response.data) && response.data.length > 0) {
    return response.data[0].events || [];
  }
  return [];
};

const Opportunities: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<ApiEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: events,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
  });

  const handleViewDetails = (event: ApiEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  if (isLoading) {
    return (
      <section className="px-8 py-10">
        <h2 className="text-2xl font-semibold mb-6">Available Opportunities</h2>
        <div className="flex justify-center items-center py-20">
          <p className="text-gray-600">Loading opportunities...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="px-8 py-10">
        <h2 className="text-2xl font-semibold mb-6">Available Opportunities</h2>
        <div className="flex justify-center items-center py-20">
          <p className="text-red-600">
            Error loading opportunities. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  if (!events || events.length === 0) {
    return (
      <section className="px-8 py-10">
        <h2 className="text-2xl font-semibold mb-6">Available Opportunities</h2>
        <div className="flex justify-center items-center py-20">
          <p className="text-gray-600">
            No opportunities available at the moment.
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="px-8 py-10">
        <h2 className="text-2xl font-semibold mb-6">Available Opportunities</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <OpportunityCard
              key={event.id}
              id={event.id}
              title={event.title}
              organization="Event Organizer"
              duration={formatDuration(event.start_time, event.end_time)}
              location={event.location}
              category="Event"
              description={event.description}
              image={`/src/images/placeholder.png`}
              event={event}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      </section>
      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default Opportunities;
