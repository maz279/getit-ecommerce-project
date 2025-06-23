
interface CategoryInfo {
  title: string;
  description: string;
  features: string[];
}

export const getSareeTypeInfo = (sareeType: string): CategoryInfo | null => {
  const sareeInfo: Record<string, CategoryInfo> = {
    'Cotton Saree': {
      title: 'Cotton Saree Collection',
      description: 'Discover our premium collection of authentic Bengali cotton sarees. From traditional handloom designs to modern printed patterns, find the perfect saree for every occasion.',
      features: ['✓ 100% Pure Cotton', '✓ Handloom Available', '✓ Traditional Designs', '✓ Free Shipping']
    },
    'Silk Saree': {
      title: 'Silk Saree Collection',
      description: 'Explore our exquisite range of silk sarees featuring luxurious fabrics and intricate designs. Perfect for special occasions and celebrations.',
      features: ['✓ Premium Silk Quality', '✓ Rich Textures', '✓ Elegant Designs', '✓ Special Occasions']
    },
    'Muslin Saree': {
      title: 'Muslin Saree Collection',
      description: 'Experience the heritage of Bengal with our authentic muslin sarees. These handcrafted masterpieces represent centuries of tradition.',
      features: ['✓ Heritage Quality', '✓ Handcrafted', '✓ Limited Edition', '✓ Premium Collection']
    },
    'Jamdani Saree': {
      title: 'Jamdani Saree Collection',
      description: 'Discover the artistic beauty of Jamdani sarees with their intricate handwoven motifs and traditional craftsmanship.',
      features: ['✓ Handwoven Motifs', '✓ Traditional Art', '✓ UNESCO Heritage', '✓ Artisan Made']
    },
    'Tant Saree': {
      title: 'Tant Saree Collection',
      description: 'Embrace tradition with our Bengal Tant sarees. Known for their comfort and classic designs, perfect for daily wear.',
      features: ['✓ Traditional Bengal', '✓ Comfortable Wear', '✓ Classic Designs', '✓ Affordable Price']
    },
    'Tangail Saree': {
      title: 'Tangail Saree Collection',
      description: 'Experience the elegance of Tangail sarees with their distinctive borders and traditional weaving techniques.',
      features: ['✓ Distinctive Borders', '✓ Traditional Weaving', '✓ Regional Heritage', '✓ Quality Craftsmanship']
    },
    'Banarasi Saree': {
      title: 'Banarasi Saree Collection',
      description: 'Indulge in luxury with our Banarasi silk sarees featuring rich gold and silver brocade work.',
      features: ['✓ Luxury Silk', '✓ Gold Zari Work', '✓ Wedding Collection', '✓ Premium Quality']
    },
    'Designer Saree': {
      title: 'Designer Saree Collection',
      description: 'Stay fashionable with our contemporary designer sarees that blend traditional elegance with modern style.',
      features: ['✓ Contemporary Designs', '✓ Fashion Forward', '✓ Modern Styling', '✓ Trendy Patterns']
    },
    'Bridal Saree': {
      title: 'Bridal Saree Collection',
      description: 'Make your special day memorable with our stunning bridal sarees featuring heavy embroidery and luxurious fabrics.',
      features: ['✓ Bridal Special', '✓ Heavy Embroidery', '✓ Luxury Fabrics', '✓ Wedding Ready']
    },
    'Casual Saree': {
      title: 'Casual Saree Collection',
      description: 'Find comfort and style with our casual sarees perfect for daily wear, office, and everyday occasions.',
      features: ['✓ Daily Comfort', '✓ Easy Care', '✓ Versatile Style', '✓ Affordable Range']
    },
    'Party Saree': {
      title: 'Party Saree Collection',
      description: 'Shine at every celebration with our glamorous party sarees featuring sequins, embellishments, and vibrant colors.',
      features: ['✓ Party Perfect', '✓ Glamorous Design', '✓ Special Events', '✓ Eye-catching Style']
    }
  };

  return sareeInfo[sareeType] || null;
};

export const getDressTypeInfo = (dressType: string): CategoryInfo | null => {
  const dressInfo: Record<string, CategoryInfo> = {
    'Cocktail Dresses': {
      title: 'Cocktail Dress Collection',
      description: 'Elevate your evening style with our sophisticated cocktail dresses. Perfect for parties, dinners, and special occasions.',
      features: ['✓ Evening Elegance', '✓ Premium Fabrics', '✓ Designer Cuts', '✓ Party Perfect']
    },
    'Evening Gowns': {
      title: 'Evening Gown Collection',
      description: 'Make a grand entrance with our luxurious evening gowns. Designed for formal events and special celebrations.',
      features: ['✓ Luxury Collection', '✓ Floor Length', '✓ Premium Quality', '✓ Event Ready']
    },
    'Maxi Dresses': {
      title: 'Maxi Dress Collection',
      description: 'Find comfort and style with our flowing maxi dresses. Perfect for casual outings, beach days, or relaxed events.',
      features: ['✓ Comfortable Wear', '✓ Full Length', '✓ Versatile Styles', '✓ Casual Elegance']
    },
    'Midi Dresses': {
      title: 'Midi Dress Collection',
      description: 'Discover our versatile midi dresses that strike the perfect balance between casual and formal wear.',
      features: ['✓ Business Casual', '✓ Modern Silhouettes', '✓ Versatile Wear', '✓ Office Ready']
    },
    'Mini Dresses': {
      title: 'Mini Dress Collection',
      description: 'Show off your style with our trendy mini dresses. Perfect for nights out, parties, and making a statement.',
      features: ['✓ Party Perfect', '✓ Modern Styles', '✓ Trendy Designs', '✓ Night Out Ready']
    }
  };

  return dressInfo[dressType] || null;
};

export const getSalwarKameezTypeInfo = (salwarKameezType: string): CategoryInfo | null => {
  const salwarKameezInfo: Record<string, CategoryInfo> = {
    'Cotton Salwar Kameez': {
      title: 'Cotton Salwar Kameez Collection',
      description: 'Discover our premium collection of comfortable cotton salwar kameez. Perfect for daily wear with traditional elegance and modern comfort.',
      features: ['✓ 100% Pure Cotton', '✓ Breathable Fabric', '✓ Traditional Designs', '✓ Comfortable Fit']
    },
    'Silk Salwar Kameez': {
      title: 'Silk Salwar Kameez Collection',
      description: 'Explore our luxurious silk salwar kameez collection featuring rich textures and elegant designs perfect for special occasions.',
      features: ['✓ Premium Silk Quality', '✓ Rich Textures', '✓ Elegant Designs', '✓ Special Occasions']
    },
    'Printed Salwar Kameez': {
      title: 'Printed Salwar Kameez Collection',
      description: 'Beautiful printed salwar kameez with vibrant colors and artistic patterns. Perfect blend of traditional style and contemporary prints.',
      features: ['✓ Vibrant Prints', '✓ Artistic Patterns', '✓ Modern Designs', '✓ Color Variety']
    },
    'Embroidered Salwar Kameez': {
      title: 'Embroidered Salwar Kameez Collection',
      description: 'Exquisite embroidered salwar kameez featuring intricate handwork and traditional craftsmanship for special celebrations.',
      features: ['✓ Intricate Embroidery', '✓ Handcrafted Work', '✓ Traditional Art', '✓ Premium Quality']
    },
    'Party Salwar Kameez': {
      title: 'Party Salwar Kameez Collection',
      description: 'Glamorous party salwar kameez with sequins, beads, and luxurious fabrics to make you shine at every celebration.',
      features: ['✓ Party Perfect', '✓ Glamorous Design', '✓ Luxury Fabrics', '✓ Special Events']
    },
    'Casual Salwar Kameez': {
      title: 'Casual Salwar Kameez Collection',
      description: 'Comfortable and stylish casual salwar kameez for everyday wear. Perfect for office, shopping, and daily activities.',
      features: ['✓ Daily Comfort', '✓ Easy Care', '✓ Versatile Style', '✓ Affordable Range']
    }
  };

  return salwarKameezInfo[salwarKameezType] || null;
};

export const getSuitsTypeInfo = (suitsType: string): CategoryInfo | null => {
  const suitsInfo: Record<string, CategoryInfo> = {
    'Designer Suits': {
      title: 'Designer Suits Collection',
      description: 'Premium designer suits featuring contemporary cuts, luxury fabrics, and modern silhouettes for the fashion-forward woman.',
      features: ['✓ Designer Collection', '✓ Premium Fabrics', '✓ Modern Cuts', '✓ Fashion Forward']
    }
  };

  return suitsInfo[suitsType] || null;
};
