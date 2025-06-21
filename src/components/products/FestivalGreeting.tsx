
import React from 'react';

export const FestivalGreeting: React.FC = () => {
  return (
    <section className="py-12 bg-gradient-to-r from-teal-100 to-blue-100">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          🤲 EID Mubarak Greetings 🤲
        </h2>
        <p className="text-xl text-gray-600 mb-6 italic">
          "May this blessed occasion bring peace, happiness, and prosperity to you and your loved ones"
        </p>
        <div className="flex flex-wrap justify-center gap-8 text-lg font-semibold">
          <div className="flex items-center gap-2">💚 PEACE</div>
          <div className="flex items-center gap-2">🤝 UNITY</div>
          <div className="flex items-center gap-2">🎁 GIVING</div>
          <div className="flex items-center gap-2">✨ CELEBRATION</div>
        </div>
        <p className="text-lg text-gray-600 mt-4">
          🌍 Celebrating with 2 Million+ Families Worldwide
        </p>
      </div>
    </section>
  );
};
