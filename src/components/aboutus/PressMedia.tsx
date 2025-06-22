
import React from 'react';
import { 
  Newspaper, 
  Tv, 
  Radio, 
  Globe, 
  Download, 
  Calendar,
  ExternalLink,
  Award,
  Users,
  TrendingUp
} from 'lucide-react';

export const PressMedia: React.FC = () => {
  const pressReleases = [
    {
      title: "GetIt Announces Record-Breaking Black Friday Sales",
      date: "December 15, 2024",
      summary: "Platform processes over 100,000 orders in 24 hours, setting new industry benchmark",
      type: "Press Release"
    },
    {
      title: "GetIt Expands to All 64 Districts of Bangladesh",
      date: "November 28, 2024",
      summary: "Complete nationwide coverage achieved with strategic logistics partnerships",
      type: "Press Release"
    },
    {
      title: "GetIt Raises $10M Series A Funding",
      date: "October 10, 2024",
      summary: "Investment to accelerate technology development and market expansion",
      type: "Press Release"
    },
    {
      title: "GetIt Launches AI-Powered Shopping Assistant",
      date: "September 5, 2024",
      summary: "Revolutionary feature helps customers find products using natural language",
      type: "Product Launch"
    }
  ];

  const mediaKit = [
    {
      title: "Company Logos",
      description: "High-resolution GetIt logos in various formats",
      type: "ZIP",
      size: "2.5 MB"
    },
    {
      title: "Brand Guidelines",
      description: "Complete brand identity and usage guidelines",
      type: "PDF", 
      size: "1.8 MB"
    },
    {
      title: "Company Fact Sheet",
      description: "Key statistics and company information",
      type: "PDF",
      size: "500 KB"
    },
    {
      title: "Executive Photos",
      description: "Professional headshots of leadership team",
      type: "ZIP",
      size: "5.2 MB"
    }
  ];

  const mediaStats = [
    { label: "Media Mentions", value: "150+", icon: Newspaper },
    { label: "Press Releases", value: "25+", icon: Globe },
    { label: "TV Appearances", value: "12+", icon: Tv },
    { label: "Podcast Features", value: "8+", icon: Radio }
  ];

  return (
    <div className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Press & Media</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Latest news, press releases, and media resources from GetIt Bangladesh.
        </p>
      </div>

      {/* Media Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {mediaStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 text-center shadow-lg border border-gray-100">
            <stat.icon className="w-8 h-8 mx-auto mb-3 text-blue-600" />
            <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Latest Press Releases */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-gray-800 mb-8">Latest Press Releases</h3>
        <div className="space-y-6">
          {pressReleases.map((release, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                      {release.type}
                    </span>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {release.date}
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">{release.title}</h4>
                  <p className="text-gray-600">{release.summary}</p>
                </div>
                <button className="text-blue-600 hover:text-blue-800">
                  <ExternalLink className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Media Kit */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-gray-800 mb-8">Media Kit & Resources</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mediaKit.map((item, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800 mb-2">{item.title}</h4>
                  <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>{item.type}</span>
                    <span>{item.size}</span>
                  </div>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Media Contact */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl p-8 text-center text-white">
        <Newspaper className="w-16 h-16 mx-auto mb-6" />
        <h3 className="text-3xl font-bold mb-4">Media Inquiries</h3>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          For press inquiries, interview requests, or additional information, please contact our media team.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <h4 className="font-bold mb-2">Press Contact</h4>
            <p className="text-sm">media@getit.com.bd</p>
            <p className="text-sm">+880-1700-MEDIA (63342)</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <h4 className="font-bold mb-2">Business Development</h4>
            <p className="text-sm">business@getit.com.bd</p>
            <p className="text-sm">+880-1700-BUSI (2874)</p>
          </div>
        </div>
      </div>
    </div>
  );
};
