
import React from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  BarChart3, 
  Users, 
  Globe, 
  Calendar,
  Download,
  FileText,
  Presentation,
  Calculator
} from 'lucide-react';

export const InvestorRelations: React.FC = () => {
  const financialHighlights = [
    { label: "Revenue Growth", value: "150%", period: "YoY 2024", trend: "up" },
    { label: "Active Vendors", value: "50K+", period: "December 2024", trend: "up" },
    { label: "Monthly Orders", value: "500K+", period: "Average 2024", trend: "up" },
    { label: "Market Share", value: "25%", period: "Bangladesh E-commerce", trend: "up" }
  ];

  const investorDocuments = [
    {
      title: "Annual Report 2024",
      description: "Comprehensive annual financial and operational report",
      type: "PDF",
      date: "March 2024",
      size: "2.5 MB"
    },
    {
      title: "Q3 2024 Financial Results",
      description: "Quarterly earnings report and financial statements",
      type: "PDF", 
      date: "October 2024",
      size: "1.8 MB"
    },
    {
      title: "Investor Presentation",
      description: "Company overview and growth strategy presentation",
      type: "PDF",
      date: "November 2024",
      size: "3.2 MB"
    },
    {
      title: "Corporate Governance Report",
      description: "Governance practices and compliance report",
      type: "PDF",
      date: "January 2024",
      size: "1.1 MB"
    }
  ];

  const upcomingEvents = [
    {
      title: "Q4 2024 Earnings Call",
      date: "January 15, 2025",
      time: "2:00 PM GMT+6",
      type: "Virtual"
    },
    {
      title: "Annual Investor Day",
      date: "March 20, 2025",
      time: "10:00 AM GMT+6",
      type: "In-person, Dhaka"
    },
    {
      title: "Bangladesh Tech Investment Summit",
      date: "April 10, 2025",
      time: "9:00 AM GMT+6",
      type: "Conference"
    }
  ];

  return (
    <div className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Investor Relations</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Financial information, investor resources, and corporate updates for GetIt stakeholders.
        </p>
      </div>

      {/* Financial Highlights */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">Financial Highlights</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {financialHighlights.map((item, index) => (
            <div key={index} className="bg-white rounded-xl p-6 text-center shadow-lg border border-gray-100">
              <div className="flex justify-center mb-3">
                {item.trend === "up" ? (
                  <TrendingUp className="w-8 h-8 text-green-600" />
                ) : (
                  <BarChart3 className="w-8 h-8 text-blue-600" />
                )}
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-1">{item.value}</div>
              <div className="text-sm font-semibold text-gray-700 mb-1">{item.label}</div>
              <div className="text-xs text-gray-500">{item.period}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Investment Thesis */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 mb-12">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Investment Opportunity</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <Globe className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h4 className="font-bold text-gray-800 mb-2">Market Leadership</h4>
            <p className="text-sm text-gray-600">Dominant position in Bangladesh's rapidly growing e-commerce market</p>
          </div>
          <div className="text-center">
            <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h4 className="font-bold text-gray-800 mb-2">Strong Growth</h4>
            <p className="text-sm text-gray-600">Consistent revenue growth and expanding customer base</p>
          </div>
          <div className="text-center">
            <Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h4 className="font-bold text-gray-800 mb-2">Network Effects</h4>
            <p className="text-sm text-gray-600">Growing vendor and customer ecosystem creates competitive moats</p>
          </div>
        </div>
      </div>

      {/* Investor Documents */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-gray-800 mb-8">Financial Reports & Documents</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {investorDocuments.map((doc, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800 mb-2">{doc.title}</h4>
                  <p className="text-gray-600 text-sm mb-3">{doc.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>{doc.type}</span>
                    <span>{doc.date}</span>
                    <span>{doc.size}</span>
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

      {/* Upcoming Events */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-gray-800 mb-8">Upcoming Investor Events</h3>
        <div className="space-y-4">
          {upcomingEvents.map((event, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800 mb-2">{event.title}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {event.date}
                    </div>
                    <span>{event.time}</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      {event.type}
                    </span>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-800 font-semibold">
                  Register
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-center text-white">
        <Calculator className="w-16 h-16 mx-auto mb-6" />
        <h3 className="text-3xl font-bold mb-4">Investor Contact</h3>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          For investor inquiries, financial information, or shareholder services.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <h4 className="font-bold mb-2">Investor Relations</h4>
            <p className="text-sm">investors@getit.com.bd</p>
            <p className="text-sm">+880-1700-INVEST (468378)</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <h4 className="font-bold mb-2">Financial Office</h4>
            <p className="text-sm">finance@getit.com.bd</p>
            <p className="text-sm">+880-1700-FINANCE (346262)</p>
          </div>
        </div>
      </div>
    </div>
  );
};
