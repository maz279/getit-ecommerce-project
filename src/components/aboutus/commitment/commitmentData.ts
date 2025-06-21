
import { 
  Heart, 
  Leaf, 
  Users, 
  Globe, 
  GraduationCap, 
  Building 
} from 'lucide-react';
import { CommitmentItem, SocialImpact, SustainabilityGoal } from './types';

export const commitments: CommitmentItem[] = [
  {
    icon: Heart,
    title: "Community Development",
    description: "Supporting local communities through employment, education, and economic growth initiatives",
    details: "We believe in giving back to the communities that make our success possible. Through various programs, we create opportunities for local development and empowerment.",
    color: "from-red-500 to-pink-500",
    initiatives: [
      "Local Employment Programs",
      "Digital Literacy Training",
      "Small Business Support",
      "Community Infrastructure"
    ],
    stats: { value: "5,000+", label: "Jobs Created" }
  },
  {
    icon: Leaf,
    title: "Environmental Sustainability",
    description: "Promoting eco-friendly practices and supporting sustainable businesses across our platform",
    details: "Environmental responsibility is core to our values. We actively promote sustainable practices and support businesses that prioritize environmental conservation.",
    color: "from-green-500 to-emerald-500",
    initiatives: [
      "Carbon Neutral Delivery",
      "Eco-friendly Packaging",
      "Green Vendor Program",
      "Paperless Operations"
    ],
    stats: { value: "40%", label: "Carbon Reduction" }
  },
  {
    icon: Users,
    title: "Social Inclusion",
    description: "Ensuring equal opportunities for all vendors and customers regardless of background or location",
    details: "We are committed to building an inclusive platform that provides equal opportunities for everyone to participate in the digital economy.",
    color: "from-blue-500 to-cyan-500",
    initiatives: [
      "Women Entrepreneur Support",
      "Rural Vendor Program",
      "Accessibility Features",
      "Minority Business Support"
    ],
    stats: { value: "60%", label: "Women Vendors" }
  },
  {
    icon: GraduationCap,
    title: "Education & Training",
    description: "Providing comprehensive training and educational resources for digital commerce skills",
    details: "Knowledge sharing is key to empowerment. We provide extensive training programs to help vendors and customers make the most of digital commerce.",
    color: "from-purple-500 to-violet-500",
    initiatives: [
      "Free Online Courses",
      "Vendor Certification",
      "Digital Marketing Training",
      "Financial Literacy"
    ],
    stats: { value: "10,000+", label: "People Trained" }
  }
];

export const socialImpacts: SocialImpact[] = [
  { icon: Building, label: "Local Businesses Supported", value: "50,000+" },
  { icon: Users, label: "Employment Opportunities", value: "5,000+" },
  { icon: Globe, label: "Rural Areas Reached", value: "64 Districts" },
  { icon: GraduationCap, label: "Training Programs", value: "100+" }
];

export const sustainabilityGoals: SustainabilityGoal[] = [
  { goal: "Carbon Neutral Operations", progress: 75, year: "2025" },
  { goal: "100% Green Packaging", progress: 60, year: "2026" },
  { goal: "50% Women Vendors", progress: 85, year: "2024" },
  { goal: "Rural Coverage 100%", progress: 40, year: "2027" }
];
