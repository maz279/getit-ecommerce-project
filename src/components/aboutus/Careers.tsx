
import React from 'react';
import { 
  Users, 
  Briefcase, 
  TrendingUp, 
  Heart, 
  Award, 
  Coffee,
  MapPin,
  Clock,
  DollarSign,
  GraduationCap
} from 'lucide-react';

export const Careers: React.FC = () => {
  const openPositions = [
    {
      title: "Senior Software Engineer",
      department: "Technology",
      location: "Dhaka, Bangladesh",
      type: "Full-time",
      experience: "3-5 years"
    },
    {
      title: "Product Manager",
      department: "Product",
      location: "Dhaka, Bangladesh", 
      type: "Full-time",
      experience: "4-6 years"
    },
    {
      title: "Digital Marketing Specialist",
      department: "Marketing",
      location: "Dhaka, Bangladesh",
      type: "Full-time",
      experience: "2-4 years"
    },
    {
      title: "Customer Success Manager",
      department: "Customer Support",
      location: "Dhaka, Bangladesh",
      type: "Full-time",
      experience: "2-3 years"
    }
  ];

  const benefits = [
    {
      icon: Heart,
      title: "Health & Wellness",
      description: "Comprehensive health insurance for you and your family"
    },
    {
      icon: GraduationCap,
      title: "Learning & Development",
      description: "Annual learning budget and conference attendance"
    },
    {
      icon: Coffee,
      title: "Work-Life Balance",
      description: "Flexible working hours and remote work options"
    },
    {
      icon: DollarSign,
      title: "Competitive Compensation",
      description: "Market-competitive salary with performance bonuses"
    }
  ];

  return (
    <div className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Join Our Team</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Help us revolutionize e-commerce in Bangladesh. We're looking for passionate individuals who want to make a real impact.
        </p>
      </div>

      {/* Company Culture */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mb-12">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Why Work at GetIt?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white rounded-xl p-6 text-center shadow-lg">
              <benefit.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h4 className="font-bold text-gray-800 mb-2">{benefit.title}</h4>
              <p className="text-sm text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Open Positions */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">Current Openings</h3>
        <div className="space-y-4">
          {openPositions.map((position, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-gray-800 mb-2">{position.title}</h4>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Briefcase className="w-4 h-4 mr-1" />
                      {position.department}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {position.location}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {position.type}
                    </div>
                    <div className="flex items-center">
                      <Award className="w-4 h-4 mr-1" />
                      {position.experience}
                    </div>
                  </div>
                </div>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-8 text-center text-white">
        <Users className="w-16 h-16 mx-auto mb-6" />
        <h3 className="text-3xl font-bold mb-4">Ready to Join GetIt?</h3>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          Don't see a position that fits? We're always looking for talented individuals. Send us your resume!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            View All Positions
          </button>
          <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
            Send Your Resume
          </button>
        </div>
      </div>
    </div>
  );
};
