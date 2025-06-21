
import { 
  Heart, 
  Shield, 
  Lightbulb, 
  Users, 
  Target, 
  Globe,
  Star,
  Award,
  TrendingUp,
  Handshake
} from 'lucide-react';
import { CoreValue, ValueStat, CulturalPrinciple } from './types';

export const coreValues: CoreValue[] = [
  {
    icon: Heart,
    title: "Customer Centricity",
    description: "Every decision we make is guided by what's best for our customers and vendors",
    principles: [
      "Listen to customer feedback actively",
      "Prioritize user experience in all features",
      "Provide exceptional support 24/7",
      "Build trust through transparency"
    ],
    color: "from-red-500 to-pink-500",
    bgPattern: "❤️"
  },
  {
    icon: Shield,
    title: "Trust & Integrity",
    description: "Building lasting relationships through honesty, reliability, and ethical practices",
    principles: [
      "Maintain highest security standards",
      "Be transparent in all communications",
      "Honor commitments and promises",
      "Protect user data and privacy"
    ],
    color: "from-blue-500 to-cyan-500",
    bgPattern: "🛡️"
  },
  {
    icon: Lightbulb,
    title: "Innovation Excellence",
    description: "Continuously pushing boundaries to deliver cutting-edge solutions and experiences",
    principles: [
      "Embrace emerging technologies",
      "Foster creative problem-solving",
      "Invest in research and development",
      "Learn from failures and iterate"
    ],
    color: "from-yellow-500 to-orange-500",
    bgPattern: "💡"
  },
  {
    icon: Users,
    title: "Collaborative Growth",
    description: "Growing together with our vendors, customers, and communities for mutual success",
    principles: [
      "Support vendor success actively",
      "Share knowledge and best practices",
      "Build strong partnerships",
      "Contribute to community development"
    ],
    color: "from-green-500 to-emerald-500",
    bgPattern: "🤝"
  },
  {
    icon: Target,
    title: "Excellence in Execution",
    description: "Delivering superior quality and performance in everything we do",
    principles: [
      "Set and exceed high standards",
      "Focus on continuous improvement",
      "Measure and optimize performance",
      "Deliver on time, every time"
    ],
    color: "from-purple-500 to-violet-500",
    bgPattern: "🎯"
  },
  {
    icon: Globe,
    title: "Social Responsibility",
    description: "Making a positive impact on society, environment, and local communities",
    principles: [
      "Promote sustainable practices",
      "Support local businesses and artisans",
      "Contribute to economic development",
      "Practice environmental stewardship"
    ],
    color: "from-indigo-500 to-blue-500",
    bgPattern: "🌍"
  }
];

export const valueStats: ValueStat[] = [
  { icon: Star, label: "Customer Satisfaction", value: "99.9%", color: "text-yellow-600" },
  { icon: Shield, label: "Trust Score", value: "4.9/5", color: "text-blue-600" },
  { icon: TrendingUp, label: "Growth Rate", value: "300%", color: "text-green-600" },
  { icon: Award, label: "Industry Awards", value: "15+", color: "text-purple-600" }
];

export const culturalPrinciples: CulturalPrinciple[] = [
  {
    title: "Respect & Inclusion",
    description: "We value diversity and treat everyone with respect and dignity",
    icon: Handshake
  },
  {
    title: "Continuous Learning",
    description: "We embrace learning, growth, and adaptation in everything we do",
    icon: Lightbulb
  },
  {
    title: "Accountability",
    description: "We take ownership of our actions and deliver on our commitments",
    icon: Target
  },
  {
    title: "Teamwork",
    description: "We collaborate effectively and support each other's success",
    icon: Users
  }
];
