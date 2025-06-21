
import React, { useState } from 'react';
import { SocialImpactStats } from './commitment/SocialImpactStats';
import { CommitmentAreas } from './commitment/CommitmentAreas';
import { SustainabilityGoals } from './commitment/SustainabilityGoals';
import { PartnershipCTA } from './commitment/PartnershipCTA';
import { commitments, socialImpacts, sustainabilityGoals } from './commitment/commitmentData';

export const Commitment: React.FC = () => {
  const [activeCommitment, setActiveCommitment] = useState(0);

  return (
    <div className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Commitment to Bangladesh</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Beyond business success, we are dedicated to creating positive social, environmental, and economic impact across Bangladesh.
        </p>
      </div>

      <SocialImpactStats socialImpacts={socialImpacts} />
      
      <CommitmentAreas 
        commitments={commitments}
        activeCommitment={activeCommitment}
        setActiveCommitment={setActiveCommitment}
      />
      
      <SustainabilityGoals sustainabilityGoals={sustainabilityGoals} />
      
      <PartnershipCTA />
    </div>
  );
};
