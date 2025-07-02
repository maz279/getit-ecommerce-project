import React, { useState } from 'react';
import { Header } from '../components/homepage/Header';
import { Footer } from '../components/homepage/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Clock, 
  Users, 
  TrendingUp,
  Heart,
  Zap,
  Code,
  BarChart3,
  Palette,
  Settings,
  Filter,
  Search,
  ArrowRight
} from 'lucide-react';

const Careers: React.FC = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');

  const jobOpenings = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      department: 'Engineering',
      location: 'Dhaka, Bangladesh',
      type: 'Full-time',
      level: 'Senior',
      description: 'Join our engineering team to build cutting-edge e-commerce experiences using React, TypeScript, and modern web technologies.',
      requirements: ['5+ years React experience', 'TypeScript proficiency', 'E-commerce platform experience'],
      postedDate: '2025-01-10'
    },
    {
      id: 2,
      title: 'Product Manager - Marketplace',
      department: 'Product',
      location: 'Dhaka, Bangladesh',
      type: 'Full-time',
      level: 'Mid-Senior',
      description: 'Lead product strategy for our multi-vendor marketplace platform, working closely with engineering and design teams.',
      requirements: ['3+ years product management', 'Marketplace experience', 'Data-driven decision making'],
      postedDate: '2025-01-08'
    },
    {
      id: 3,
      title: 'Digital Marketing Specialist',
      department: 'Marketing',
      location: 'Dhaka, Bangladesh',
      type: 'Full-time',
      level: 'Mid-level',
      description: 'Drive user acquisition and engagement through digital marketing campaigns across multiple channels.',
      requirements: ['Digital marketing expertise', 'Google Ads & Facebook Ads', 'Analytics tools proficiency'],
      postedDate: '2025-01-06'
    },
    {
      id: 4,
      title: 'UX/UI Designer',
      department: 'Design',
      location: 'Dhaka, Bangladesh',
      type: 'Full-time',
      level: 'Mid-level',
      description: 'Create intuitive and beautiful user experiences for our e-commerce platform and mobile applications.',
      requirements: ['3+ years UX/UI design', 'Figma proficiency', 'E-commerce design experience'],
      postedDate: '2025-01-05'
    },
    {
      id: 5,
      title: 'Backend Engineer - Python',
      department: 'Engineering',
      location: 'Dhaka, Bangladesh',
      type: 'Full-time',
      level: 'Mid-Senior',
      description: 'Build scalable backend services and APIs to support our growing marketplace platform.',
      requirements: ['Python/Django expertise', 'PostgreSQL experience', 'API design knowledge'],
      postedDate: '2025-01-03'
    },
    {
      id: 6,
      title: 'Customer Success Manager',
      department: 'Customer Success',
      location: 'Dhaka, Bangladesh',
      type: 'Full-time',
      level: 'Mid-level',
      description: 'Ensure vendor success on our platform by providing support, training, and strategic guidance.',
      requirements: ['Customer success experience', 'B2B relationship management', 'Excellent communication'],
      postedDate: '2025-01-01'
    }
  ];

  const departments = ['All', 'Engineering', 'Product', 'Design', 'Marketing', 'Customer Success'];
  const locations = ['All', 'Dhaka, Bangladesh', 'Remote'];

  const benefits = [
    {
      icon: Heart,
      title: 'Health & Wellness',
      description: 'Comprehensive health insurance, mental health support, and wellness programs'
    },
    {
      icon: TrendingUp,
      title: 'Career Growth',
      description: 'Learning budget, conference attendance, and clear career progression paths'
    },
    {
      icon: Users,
      title: 'Team Culture',
      description: 'Collaborative environment, team outings, and inclusive workplace culture'
    },
    {
      icon: Zap,
      title: 'Flexible Work',
      description: 'Hybrid work options, flexible hours, and work-life balance focus'
    }
  ];

  const filteredJobs = jobOpenings.filter(job => {
    const matchesDepartment = selectedDepartment === 'All' || job.department === selectedDepartment;
    const matchesLocation = selectedLocation === 'All' || job.location === selectedLocation;
    return matchesDepartment && matchesLocation;
  });

  return (
    <div className="bg-white min-h-screen">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Join Our Team</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Help us build the future of e-commerce in Bangladesh. We're looking for passionate individuals 
            who want to make a difference in how people shop and sell online.
          </p>
          <div className="flex justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>50+ Team Members</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>Dhaka Office + Remote</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span>Fast Growing Startup</span>
            </div>
          </div>
        </div>

        {/* Company Values */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">Why Work With Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <benefit.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <select 
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            
            <select 
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <div className="ml-auto text-sm text-gray-600">
            {filteredJobs.length} open positions
          </div>
        </div>

        {/* Job Listings */}
        <div className="space-y-6 mb-12">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{job.title}</h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <Code className="h-4 w-4" />
                            {job.department}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {job.type}
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary">{job.level}</Badge>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{job.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.requirements.map((req, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {req}
                        </Badge>
                      ))}
                    </div>
                    
                    <p className="text-xs text-gray-500">
                      Posted on {new Date(job.postedDate).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-2 lg:w-40">
                    <Button className="w-full">
                      Apply Now
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      Learn More
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Can't Find Position */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Don't See the Perfect Role?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              We're always looking for talented individuals to join our team. 
              Send us your resume and let us know what role you'd love to have at GetIt.
            </p>
            <Button size="lg">
              Send General Application
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Company Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-primary mb-1">50+</div>
            <div className="text-sm text-gray-600">Team Members</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-1">5+</div>
            <div className="text-sm text-gray-600">Years Growing</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-1">1000+</div>
            <div className="text-sm text-gray-600">Active Vendors</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-1">95%</div>
            <div className="text-sm text-gray-600">Employee Satisfaction</div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Careers;