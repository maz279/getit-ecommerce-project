import { navigationConfig, footerNavigation } from '@/components/navigation/NavigationMap';

export interface SitemapEntry {
  url: string;
  priority: number;
  changeFreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  lastModified?: string;
  title: string;
  titleBn: string;
  description?: string;
  category: string;
}

export const generateSitemap = (): SitemapEntry[] => {
  const baseUrl = 'https://getit.com.bd';
  const sitemap: SitemapEntry[] = [];

  // Homepage
  sitemap.push({
    url: `${baseUrl}/`,
    priority: 1.0,
    changeFreq: 'daily',
    title: 'GetIt - Bangladesh\'s Leading Multi-Vendor Marketplace',
    titleBn: 'গেটইট - বাংলাদেশের শীর্ষস্থানীয় মাল্টি-ভেন্ডর মার্কেটপ্লেস',
    description: 'Shop electronics, fashion, home goods and more from trusted vendors across Bangladesh',
    category: 'homepage'
  });

  // Main navigation pages
  const addNavigationPages = (items: typeof navigationConfig, parentPath = '') => {
    items.forEach(item => {
      if (item.path && !sitemap.find(entry => entry.url === `${baseUrl}${item.path}`)) {
        sitemap.push({
          url: `${baseUrl}${item.path}`,
          priority: parentPath ? 0.6 : 0.8,
          changeFreq: 'weekly',
          title: item.label,
          titleBn: item.labelBn,
          description: item.description,
          category: parentPath ? 'subcategory' : 'main-category'
        });
      }

      if (item.children) {
        addNavigationPages(item.children, item.path);
      }
    });
  };

  addNavigationPages(navigationConfig);

  // Category pages with products
  const productCategories = [
    {
      slug: 'electronics',
      title: 'Electronics & Gadgets',
      titleBn: 'ইলেকট্রনিক্স ও গ্যাজেট',
      subcategories: ['mobile-phones', 'laptops', 'cameras', 'headphones', 'smart-watches']
    },
    {
      slug: 'fashion',
      title: 'Fashion & Apparel',
      titleBn: 'ফ্যাশন ও পোশাক',
      subcategories: ['mens-clothing', 'womens-clothing', 'shoes', 'bags', 'jewelry']
    },
    {
      slug: 'home-garden',
      title: 'Home & Garden',
      titleBn: 'বাড়ি ও বাগান',
      subcategories: ['furniture', 'kitchen', 'bathroom', 'garden', 'home-decor']
    },
    {
      slug: 'health-beauty',
      title: 'Health & Beauty',
      titleBn: 'স্বাস্থ্য ও সৌন্দর্য',
      subcategories: ['skincare', 'makeup', 'fragrance', 'personal-care', 'health-supplements']
    }
  ];

  productCategories.forEach(category => {
    // Main category page
    sitemap.push({
      url: `${baseUrl}/categories/${category.slug}`,
      priority: 0.9,
      changeFreq: 'daily',
      title: category.title,
      titleBn: category.titleBn,
      description: `Shop ${category.title.toLowerCase()} from verified vendors in Bangladesh`,
      category: 'product-category'
    });

    // Subcategory pages
    category.subcategories.forEach(subcat => {
      sitemap.push({
        url: `${baseUrl}/categories/${category.slug}/${subcat}`,
        priority: 0.7,
        changeFreq: 'daily',
        title: `${subcat.replace('-', ' ')} | ${category.title}`,
        titleBn: `${subcat.replace('-', ' ')} | ${category.titleBn}`,
        category: 'product-subcategory'
      });
    });
  });

  // Promotional pages
  const promotionalPages = [
    {
      path: '/promotions/flash-sale',
      title: 'Flash Sale - Limited Time Offers',
      titleBn: 'ফ্ল্যাশ সেল - সীমিত সময়ের অফার',
      priority: 0.9,
      changeFreq: 'hourly' as const
    },
    {
      path: '/promotions/daily-deals',
      title: 'Daily Deals - New Offers Every Day',
      titleBn: 'দৈনিক অফার - প্রতিদিন নতুন অফার',
      priority: 0.8,
      changeFreq: 'daily' as const
    },
    {
      path: '/festival-sales',
      title: 'Festival Sales - Eid, Pohela Boishakh & More',
      titleBn: 'উৎসবের সেল - ঈদ, পহেলা বৈশাখ ও আরও',
      priority: 0.9,
      changeFreq: 'weekly' as const
    }
  ];

  promotionalPages.forEach(page => {
    sitemap.push({
      url: `${baseUrl}${page.path}`,
      priority: page.priority,
      changeFreq: page.changeFreq,
      title: page.title,
      titleBn: page.titleBn,
      category: 'promotional'
    });
  });

  // Vendor pages
  const vendorPages = [
    {
      path: '/vendor-directory',
      title: 'Vendor Directory - All Verified Sellers',
      titleBn: 'বিক্রেতার তালিকা - সব যাচাইকৃত বিক্রেতা'
    },
    {
      path: '/vendor-register',
      title: 'Become a Vendor - Start Selling Today',
      titleBn: 'বিক্রেতা হন - আজই বিক্রি শুরু করুন'
    }
  ];

  vendorPages.forEach(page => {
    sitemap.push({
      url: `${baseUrl}${page.path}`,
      priority: 0.7,
      changeFreq: 'weekly',
      title: page.title,
      titleBn: page.titleBn,
      category: 'vendor'
    });
  });

  // Support and legal pages
  Object.values(footerNavigation).forEach(section => {
    section.items.forEach(item => {
      if (!sitemap.find(entry => entry.url === `${baseUrl}${item.path}`)) {
        sitemap.push({
          url: `${baseUrl}${item.path}`,
          priority: 0.5,
          changeFreq: 'monthly',
          title: item.label,
          titleBn: item.labelBn,
          category: 'support'
        });
      }
    });
  });

  // Location-based pages for Bangladesh
  const bangladeshLocations = [
    { division: 'dhaka', name: 'Dhaka', nameBn: 'ঢাকা' },
    { division: 'chittagong', name: 'Chittagong', nameBn: 'চট্টগ্রাম' },
    { division: 'sylhet', name: 'Sylhet', nameBn: 'সিলেট' },
    { division: 'rajshahi', name: 'Rajshahi', nameBn: 'রাজশাহী' },
    { division: 'khulna', name: 'Khulna', nameBn: 'খুলনা' },
    { division: 'barisal', name: 'Barisal', nameBn: 'বরিশাল' },
    { division: 'rangpur', name: 'Rangpur', nameBn: 'রংপুর' },
    { division: 'mymensingh', name: 'Mymensingh', nameBn: 'ময়মনসিংহ' }
  ];

  bangladeshLocations.forEach(location => {
    sitemap.push({
      url: `${baseUrl}/location/${location.division}`,
      priority: 0.6,
      changeFreq: 'weekly',
      title: `Shop in ${location.name} - Local Vendors & Fast Delivery`,
      titleBn: `${location.nameBn}-এ কেনাকাটা - স্থানীয় বিক্রেতা ও দ্রুত ডেলিভারি`,
      category: 'location'
    });
  });

  // Sort by priority (highest first)
  return sitemap.sort((a, b) => b.priority - a.priority);
};

export const generateXMLSitemap = (): string => {
  const sitemap = generateSitemap();
  const now = new Date().toISOString();

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  sitemap.forEach(entry => {
    xml += `
  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastModified || now}</lastmod>
    <changefreq>${entry.changeFreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`;
  });

  xml += `
</urlset>`;

  return xml;
};

export const generateRobotsTxt = (): string => {
  return `User-agent: *
Allow: /

Sitemap: https://getit.com.bd/sitemap.xml

# Crawl delay for all bots
Crawl-delay: 1

# Disallow admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /private/
Disallow: /vendor/dashboard/
Disallow: /account/

# Allow important pages
Allow: /categories/
Allow: /products/
Allow: /vendors/
Allow: /promotions/
Allow: /search/

# Media files
Allow: /assets/
Allow: /images/
`;
};