import React from "react";
import { opportunitiesData } from "../data/content";
import OpportunityCard from "../components/OpportunityCard";

const Opportunities: React.FC = () => {
  return (
    <section className="px-8 py-10">
      <h2 className="text-2xl font-semibold mb-6">Available Opportunities</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {opportunitiesData.map((op) => (
          <OpportunityCard
            key={op.id}
            title={op.title}
            organization={op.organization}
            duration={op.duration}
            location={op.location}
            category={op.category}
            description={op.description}
            image={`/src/images/${op.id === 1 ? "placeholder.png" : "placeholder.png"}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Opportunities;
