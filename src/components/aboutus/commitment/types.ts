
export interface CommitmentItem {
  icon: any;
  title: string;
  description: string;
  details: string;
  color: string;
  initiatives: string[];
  stats: { value: string; label: string };
}

export interface SocialImpact {
  icon: any;
  label: string;
  value: string;
}

export interface SustainabilityGoal {
  goal: string;
  progress: number;
  year: string;
}
