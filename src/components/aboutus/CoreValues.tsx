
import React, { useState } from 'react';
import { ValueStats } from './corevalues/ValueStats';
import { CoreValuesGrid } from './corevalues/CoreValuesGrid';
import { CulturalPrinciples } from './corevalues/CulturalPrinciples';
import { ValuesInAction } from './corevalues/ValuesInAction';
import { coreValues, valueStats, culturalPrinciples } from './corevalues/coreValuesData';

export const CoreValues: React.FC = () => {
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);

  return (
    <div className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Core Values</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          The fundamental principles that guide our decisions, shape our culture, and define who we are as an organization.
        </p>
      </div>

      <ValueStats valueStats={valueStats} />
      
      <CoreValuesGrid 
        coreValues={coreValues}
        hoveredValue={hoveredValue}
        setHoveredValue={setHoveredValue}
      />
      
      <CulturalPrinciples culturalPrinciples={culturalPrinciples} />
      
      <ValuesInAction />
    </div>
  );
};
