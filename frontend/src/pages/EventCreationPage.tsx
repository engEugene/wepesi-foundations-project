import React from "react";
import EventCreationForm from "../components/EventCreationForm";

const EventCreationPage = () => {
  return (
    <div className="page-container">
      <h1>Create a New Event</h1>
      <EventCreationForm />
    </div>
  );
};

export default EventCreationPage;
