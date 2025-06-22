
export const getSubcategoryDetails = (subcategoryName: string) => {
  const details: { [key: string]: any } = {
    'Cotton Saree': {
      title: 'Cotton Sarees',
      description: 'Comfortable and breathable cotton sarees perfect for daily wear and casual occasions.',
      features: ['100% Pure Cotton', 'Machine Washable', 'Lightweight', 'Breathable Fabric'],
      occasions: ['Daily Wear', 'Office', 'Casual Events', 'Summer Festivals'],
      priceRange: '৳800 - ৳3,500',
      popular: ['Block Print Cotton Saree', 'Handloom Cotton Saree', 'Khadi Cotton Saree']
    },
    'Silk Saree': {
      title: 'Silk Sarees',
      description: 'Luxurious silk sarees that add elegance and grace to any special occasion.',
      features: ['Premium Silk Fabric', 'Rich Texture', 'Traditional Weaving', 'Elegant Drape'],
      occasions: ['Weddings', 'Festivals', 'Party', 'Special Events'],
      priceRange: '৳2,500 - ৳15,000',
      popular: ['Banarasi Silk Saree', 'Katan Silk Saree', 'Pure Silk Saree']
    },
    'Jamdani Saree': {
      title: 'Jamdani Sarees',
      description: 'Traditional Bengali handwoven sarees with intricate patterns and cultural heritage.',
      features: ['Handwoven', 'Traditional Patterns', 'Cultural Heritage', 'Unique Designs'],
      occasions: ['Pohela Boishakh', 'Cultural Events', 'Traditional Ceremonies', 'Special Occasions'],
      priceRange: '৳3,000 - ৳25,000',
      popular: ['Dhakai Jamdani', 'Tangail Jamdani', 'Modern Jamdani']
    },
    'Cotton Salwar Kameez': {
      title: 'Cotton Salwar Kameez',
      description: 'Comfortable cotton salwar kameez sets perfect for everyday wear and office.',
      features: ['Soft Cotton Fabric', 'Comfortable Fit', 'Easy Care', 'Versatile Styling'],
      occasions: ['Daily Wear', 'Office', 'College', 'Casual Outings'],
      priceRange: '৳1,200 - ৳4,000',
      popular: ['Straight Cut Cotton Suits', 'Printed Cotton Sets', 'Embroidered Cotton Suits']
    },
    'Anarkali Suits': {
      title: 'Anarkali Suits',
      description: 'Flowy and elegant Anarkali suits that create a graceful silhouette.',
      features: ['Flowy Design', 'Elegant Silhouette', 'Comfortable Fit', 'Traditional Style'],
      occasions: ['Parties', 'Weddings', 'Festivals', 'Special Events'],
      priceRange: '৳2,000 - ৳8,000',
      popular: ['Long Anarkali', 'Short Anarkali', 'Designer Anarkali']
    },
    'Cotton Kurtis': {
      title: 'Cotton Kurtis',
      description: 'Stylish and comfortable cotton kurtis perfect for modern women.',
      features: ['Breathable Cotton', 'Modern Designs', 'Easy to Wear', 'Versatile Pairing'],
      occasions: ['Casual Wear', 'Office', 'College', 'Shopping'],
      priceRange: '৳600 - ৳2,500',
      popular: ['A-line Kurtis', 'Straight Kurtis', 'High-Low Kurtis']
    },
    'Cocktail Dresses': {
      title: 'Cocktail Dresses',
      description: 'Elegant cocktail dresses perfect for evening parties and social events.',
      features: ['Sophisticated Design', 'Premium Quality', 'Perfect Fit', 'Party Ready'],
      occasions: ['Cocktail Parties', 'Evening Events', 'Social Gatherings', 'Date Nights'],
      priceRange: '৳2,500 - ৳8,000',
      popular: ['Little Black Dress', 'Sequin Cocktail Dress', 'Midi Cocktail Dress']
    },
    'Maxi Dresses': {
      title: 'Maxi Dresses',
      description: 'Floor-length maxi dresses that offer comfort and style for various occasions.',
      features: ['Full Length', 'Comfortable Fit', 'Versatile Styling', 'Flowy Design'],
      occasions: ['Beach Outings', 'Casual Events', 'Summer Parties', 'Vacation Wear'],
      priceRange: '৳1,500 - ৳5,000',
      popular: ['Floral Maxi Dress', 'Solid Color Maxi', 'Bohemian Maxi Dress']
    },
    'Casual Tops': {
      title: 'Casual Tops',
      description: 'Comfortable and stylish casual tops for everyday wear and relaxed occasions.',
      features: ['Comfortable Fabric', 'Easy Care', 'Versatile Pairing', 'Modern Designs'],
      occasions: ['Daily Wear', 'Casual Outings', 'Weekend Activities', 'Shopping'],
      priceRange: '৳500 - ৳2,000',
      popular: ['Cotton Casual Tops', 'Printed Casual Tops', 'Solid Color Tops']
    },
    'Skinny Jeans': {
      title: 'Skinny Jeans',
      description: 'Form-fitting skinny jeans that create a sleek and modern silhouette.',
      features: ['Slim Fit', 'Stretchable Fabric', 'Comfortable Wear', 'Versatile Styling'],
      occasions: ['Casual Wear', 'Shopping', 'College', 'Weekend Outings'],
      priceRange: '৳1,200 - ৳3,500',
      popular: ['High-Waisted Skinny Jeans', 'Classic Blue Skinny Jeans', 'Black Skinny Jeans']
    },
    'Sports Bras': {
      title: 'Sports Bras',
      description: 'Supportive and comfortable sports bras designed for active lifestyles.',
      features: ['High Support', 'Moisture Wicking', 'Comfortable Fit', 'Durable Quality'],
      occasions: ['Gym Workouts', 'Yoga Sessions', 'Running', 'Sports Activities'],
      priceRange: '৳800 - ৳2,500',
      popular: ['High Impact Sports Bras', 'Wireless Sports Bras', 'Padded Sports Bras']
    },
    'Women Pajama Sets': {
      title: 'Women Pajama Sets',
      description: 'Comfortable and cozy pajama sets perfect for a good night\'s sleep.',
      features: ['Soft Fabric', 'Comfortable Fit', 'Easy Care', 'Breathable Material'],
      occasions: ['Sleep Wear', 'Lounging', 'Home Comfort', 'Relaxation'],
      priceRange: '৳800 - ৳2,500',
      popular: ['Cotton Pajama Sets', 'Satin Pajama Sets', 'Printed Pajama Sets']
    },
    'Bikinis': {
      title: 'Bikinis',
      description: 'Stylish and comfortable bikinis perfect for beach and pool activities.',
      features: ['Quick Dry', 'UV Protection', 'Comfortable Fit', 'Trendy Designs'],
      occasions: ['Beach Vacations', 'Pool Parties', 'Swimming', 'Water Sports'],
      priceRange: '৳1,500 - ৳4,000',
      popular: ['Triangle Bikini', 'Bandeau Bikini', 'High-Waisted Bikini']
    },
    'Everyday Bras': {
      title: 'Everyday Bras',
      description: 'Comfortable and supportive bras designed for daily wear and comfort.',
      features: ['All Day Comfort', 'Perfect Support', 'Seamless Design', 'Durable Quality'],
      occasions: ['Daily Wear', 'Office', 'Casual Outings', 'Everyday Comfort'],
      priceRange: '৳600 - ৳2,000',
      popular: ['T-Shirt Bras', 'Wireless Bras', 'Full Coverage Bras']
    }
  };

  return details[subcategoryName] || {
    title: subcategoryName,
    description: `Premium ${subcategoryName.toLowerCase()} collection with various styles and designs.`,
    features: ['High Quality', 'Latest Designs', 'Comfortable Fit', 'Great Value'],
    occasions: ['Various Occasions', 'Daily Wear', 'Special Events'],
    priceRange: '৳500 - ৳5,000',
    popular: [`Designer ${subcategoryName}`, `Traditional ${subcategoryName}`, `Modern ${subcategoryName}`]
  };
};
