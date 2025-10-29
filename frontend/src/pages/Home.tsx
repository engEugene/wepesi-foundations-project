import React from "react";
import { homeContent } from "../data/content";

const Home: React.FC = () => {
  return (
    <section className="px-8 py-10 flex flex-col  items-center text-center">
      <h1 className="text-3xl font-bold mb-2">{homeContent.heroTitle}</h1>
      <p className="text-gray-600 mb-4">{homeContent.heroSubtitle}</p>
      <button className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700">
        {homeContent.ctaButton}
      </button>

      <div className="grid grid-cols-3 gap-6 mt-8">
        {homeContent.stats.map((stat, i) => (
          <div key={i}>
            <h3 className="text-2xl font-semibold">{stat.number}</h3>
            <p className="text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">How It Works</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {homeContent.howItWorks.map((step, i) => (
            <div key={i} className="bg-green-50 rounded-xl p-4">
              <h3 className="font-medium">{step.step}</h3>
              <p className="text-sm text-gray-600 mt-1">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Home;
