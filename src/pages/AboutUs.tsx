
import React from 'react';
import { Header } from '../components/homepage/Header';
import { Footer } from '../components/homepage/Footer';
import { Users, Award, Globe, TrendingUp, Heart, Shield, Zap, Target } from 'lucide-react';

const AboutUs: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">About GETIT</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Bangladesh's leading multi-vendor e-commerce platform connecting millions of buyers with trusted sellers across the country.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-blue-50 p-8 rounded-lg">
            <Target className="w-12 h-12 text-blue-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              To democratize commerce in Bangladesh by providing a secure, convenient, and accessible platform 
              that empowers both buyers and sellers to thrive in the digital economy. We believe in creating 
              opportunities for everyone to participate in e-commerce.
            </p>
          </div>
          
          <div className="bg-green-50 p-8 rounded-lg">
            <Globe className="w-12 h-12 text-green-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Vision</h2>
            <p className="text-gray-700 leading-relaxed">
              To become the most trusted and innovative e-commerce ecosystem in Bangladesh, where technology 
              meets tradition, and where every citizen has access to quality products and services at their fingertips.
            </p>
          </div>
        </div>

        {/* Company Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">50K+</div>
            <p className="text-gray-600">Registered Vendors</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">5M+</div>
            <p className="text-gray-600">Products Listed</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">100K+</div>
            <p className="text-gray-600">Daily Orders</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">64</div>
            <p className="text-gray-600">Districts Covered</p>
          </div>
        </div>

        {/* Our Story */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Our Story</h2>
          <div className="bg-gray-50 p-8 rounded-lg">
            <p className="text-gray-700 leading-relaxed mb-4">
              Founded in 2018, GETIT began as a small startup with a big dream: to revolutionize how people buy and sell products in Bangladesh. 
              Our founders recognized the immense potential of e-commerce in a country with a growing digital population and increasing internet penetration.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Starting with just a handful of vendors and a simple platform, we've grown exponentially while staying true to our core values of 
              trust, innovation, and customer satisfaction. Today, GETIT serves millions of customers and thousands of vendors across all 64 districts of Bangladesh.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our journey has been marked by continuous innovation, from introducing mobile banking integration to implementing AI-powered 
              recommendations, always with the goal of making online shopping more accessible and enjoyable for everyone.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Trust</h3>
              <p className="text-sm text-gray-600">Building lasting relationships through transparency and reliability</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Innovation</h3>
              <p className="text-sm text-gray-600">Continuously improving through technology and creative solutions</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Customer First</h3>
              <p className="text-sm text-gray-600">Putting our customers' needs at the center of everything we do</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Growth</h3>
              <p className="text-sm text-gray-600">Empowering businesses and individuals to reach their full potential</p>
            </div>
          </div>
        </div>

        {/* Leadership Team */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Leadership Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="font-semibold text-gray-800 mb-1">Ahmed Rahman</h3>
              <p className="text-gray-600 text-sm mb-2">CEO & Co-Founder</p>
              <p className="text-xs text-gray-500">15+ years in e-commerce and technology</p>
            </div>
            
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="font-semibold text-gray-800 mb-1">Fatima Khan</h3>
              <p className="text-gray-600 text-sm mb-2">CTO & Co-Founder</p>
              <p className="text-xs text-gray-500">Expert in scalable technology solutions</p>
            </div>
            
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="font-semibold text-gray-800 mb-1">Karim Hassan</h3>
              <p className="text-gray-600 text-sm mb-2">COO</p>
              <p className="text-xs text-gray-500">Operations and logistics specialist</p>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Our Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4">
              <Award className="w-8 h-8 text-yellow-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Best E-commerce Platform 2023</h3>
                <p className="text-sm text-gray-600">Recognized by Bangladesh Digital Commerce Association</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <Users className="w-8 h-8 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">10 Million+ Happy Customers</h3>
                <p className="text-sm text-gray-600">Serving customers across Bangladesh since 2018</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <TrendingUp className="w-8 h-8 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">300% Growth in 2023</h3>
                <p className="text-sm text-gray-600">Fastest growing e-commerce platform in Bangladesh</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <Shield className="w-8 h-8 text-purple-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">99.9% Secure Transactions</h3>
                <p className="text-sm text-gray-600">Industry-leading security and fraud protection</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AboutUs;
