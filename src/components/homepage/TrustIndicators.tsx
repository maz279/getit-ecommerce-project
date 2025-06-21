
import React from 'react';
import { Shield, Truck, RefreshCw, Star, Quote, Award } from 'lucide-react';

export const TrustIndicators: React.FC = () => {
  const guarantees = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "100% Secure Payment",
      description: "Your money is safe with SSL encryption"
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Fast Delivery",
      description: "Same day delivery in Dhaka, 2-3 days nationwide"
    },
    {
      icon: <RefreshCw className="w-8 h-8" />,
      title: "Easy Returns",
      description: "7-day hassle-free return policy"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Quality Guarantee",
      description: "Verified products from trusted sellers"
    }
  ];

  const testimonials = [
    {
      name: "Ahmed Hassan",
      location: "Dhaka",
      rating: 5,
      text: "Best online shopping experience in Bangladesh! Fast delivery and genuine products.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Fatima Rahman",
      location: "Chittagong",
      rating: 5,
      text: "Amazing platform! Got my order delivered the same day. Highly recommended!",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b378?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Karim Uddin",
      location: "Sylhet",
      rating: 5,
      text: "Great variety of products and excellent customer service. My go-to shopping app!",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    }
  ];

  return (
    <section className="py-12 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Trust Guarantees */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose GETIT?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Trusted by millions of customers across Bangladesh for safe, fast, and reliable shopping experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {guarantees.map((guarantee, index) => (
            <div key={index} className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-all border border-gray-100">
              <div className="text-blue-600 mb-4 flex justify-center">
                {guarantee.icon}
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">{guarantee.title}</h3>
              <p className="text-gray-600 text-sm">{guarantee.description}</p>
            </div>
          ))}
        </div>

        {/* Customer Testimonials */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">What Our Customers Say</h3>
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <span className="text-gray-600 ml-2">4.8/5 from 500K+ reviews</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 relative">
              <Quote className="w-8 h-8 text-blue-200 absolute top-4 right-4" />
              <div className="flex items-center gap-4 mb-4">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                  <p className="text-gray-600 text-sm">{testimonial.location}</p>
                </div>
              </div>
              <div className="flex mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 italic">"{testimonial.text}"</p>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="text-center mt-12">
          <div className="flex items-center justify-center gap-8 flex-wrap">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">10M+</div>
              <div className="text-gray-600 text-sm">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">500K+</div>
              <div className="text-gray-600 text-sm">Products Delivered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">99.5%</div>
              <div className="text-gray-600 text-sm">Customer Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">24/7</div>
              <div className="text-gray-600 text-sm">Customer Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
