const Portfolio = require('../models/Portfolio');
const Blog = require('../models/Blog');
const Service = require('../models/Service');
const Client = require('../models/Client');
const Testimonial = require('../models/Testimonial');

const initialServices = [
  { title: 'Logo Design', tagline: 'Marks that outlast trends.', iconName: 'PenTool', slug: '/services/logo-design' },
  { title: 'Brand Identity', tagline: 'Complete visual systems.', iconName: 'Sparkles', slug: '/services/brand-identity' },
  { title: 'Product Packaging Design', tagline: 'Shelf-ready packaging.', iconName: 'Package', slug: '/services/packaging-design' },
  { title: 'Website Design', tagline: 'Award-worthy web experiences.', iconName: 'Monitor', slug: '/services/website-design' },
  { title: 'Web Development', tagline: 'High-performance full-stack web apps.', iconName: 'Code2', slug: '/services/web-development' },
  { title: 'Advertising Design', tagline: 'Campaigns that convert.', iconName: 'Megaphone', slug: '/services/advertising-design' },
  { title: 'Brochure Design', tagline: 'Editorial brochure systems.', iconName: 'BookOpen', slug: '/services/brochure-design' },
  { title: 'Social Media Design', tagline: 'On-brand content systems.', iconName: 'Share2', slug: '/services/social-media-design' },
  { title: 'Print Design', tagline: 'Craft-first print work.', iconName: 'Printer', slug: '/services/print-design' },
  { title: 'Poster Design', tagline: 'Statement posters.', iconName: 'Image', slug: '/services/poster-design' },
  { title: 'Catalogue Design', tagline: 'Editorial catalogues.', iconName: 'BookOpen', slug: '/services/catalogue-design' },
  { title: 'Flyer Design', tagline: 'High-impact flyers.', iconName: 'FileText', slug: '/services/flyer-design' },
  { title: 'Business Card Design', tagline: 'First impressions, refined.', iconName: 'CreditCard', slug: '/services/business-card-design' },
  { title: 'Motion Graphics', tagline: 'Design in motion.', iconName: 'Film', slug: '/services/motion-graphics' },
  { title: 'UI UX Design', tagline: 'Product design that ships.', iconName: 'Layers', slug: '/services/ui-ux-design' },
];

const initialClients = [
  { name: 'Food Partner', initials: 'FP', category: 'F&B' },
  { name: 'Rion Constructions', initials: 'RC', category: 'Architecture' },
  { name: 'Sharief Steel', initials: 'SS', category: 'Industrial' },
  { name: 'LB Electricals', initials: 'LB', category: 'Retail' },
  { name: 'AK Construction', initials: 'AK', category: 'Real Estate' },
  { name: 'Enayath Real Estate', initials: 'ER', category: 'Commercial' },
  { name: 'TapX Connect', initials: 'TC', category: 'Technology' },
  { name: 'Galaxy Air Link', initials: 'GA', category: 'Aviation' },
  { name: "Let's Brand Us", initials: 'LB', category: 'Creative' },
];

const initialPortfolio = [
  {
    title: 'Aperture House',
    category: 'Logo',
    year: '2026',
    description: 'Geometric identity for a modern architecture practice.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    featured: true,
  },
  {
    title: 'Nexlade',
    category: 'Logo',
    year: '2024',
    description: 'A cinematic logo system for a film studio — icon, lockups and applications.',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
    featured: true,
  },
  {
    title: 'Pemela Learning Centre',
    category: 'Logo',
    year: '2026',
    description: 'A learning centre brand identity with reception signage, acrylic signs, and student portals.',
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80',
    featured: true,
  },
  {
    title: 'Movewell',
    category: 'Brand Identity',
    year: '2025',
    description: 'Complete visual identity system for next-generation wellness diagnostics.',
    image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1200&q=80',
    featured: true,
  },
  {
    title: 'Casco Water',
    category: 'Packaging',
    year: '2025',
    description: 'Minimalist sustainable aluminum bottle and recyclable carton packaging design.',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1200&q=80',
    featured: true,
  },
  {
    title: 'Axiom Studio',
    category: 'Website',
    year: '2025',
    description: 'High-performance bespoke portfolio web platform with smooth shader interactions.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    featured: true,
  },
  {
    title: 'Orbit Works',
    category: 'Logo',
    year: '2025',
    description: 'A precise symbol for a next-generation technology studio.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    featured: false,
  },
  {
    title: 'Arôme Atelier',
    category: 'Brand Identity',
    year: '2024',
    description: 'An elegant wordmark and gold-embossed tactile stationery for a fragrance atelier.',
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1200&q=80',
    featured: false,
  },
];

const initialTestimonials = [
  {
    author: 'Mark Robinson',
    role: 'Founder & CEO',
    company: 'Northline Coffee Co.',
    avatarInitial: 'M',
    quote: 'Graphics Haven transformed our visual identity into something uniquely authentic. Our brand recognition skyrocketed in just three months.',
  },
  {
    author: 'Priya Sharma',
    role: 'Head of Marketing',
    company: 'Aperture House',
    avatarInitial: 'P',
    quote: 'Their attention to typographic nuance and structural brand cohesion made our architectural identity look as timeless as our buildings.',
  },
  {
    author: 'David Chen',
    role: 'VP Product Design',
    company: 'TapX Connect',
    avatarInitial: 'D',
    quote: 'The team delivered world-class web and product identity on an aggressive deadline. A pleasure to collaborate with.',
  },
];

const initialBlogs = [
  {
    title: 'Why Modern Brands Need Typographic Systems',
    excerpt: 'How variable typography and systematic font hierarchy establish distinction in overcrowded digital markets.',
    date: 'Oct 2026',
    readTime: '6 min read',
    category: 'Typography',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'The Evolution of Minimalist Packaging in 2026',
    excerpt: 'Sustainable materials, tactile embossing, and reductionist layout principles redefining shelf presence.',
    date: 'Sep 2026',
    readTime: '5 min read',
    category: 'Packaging',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Designing for Motion: When Static Brands Feel Stale',
    excerpt: 'Bringing brand marks to life with intentional micro-interactions and cinematic choreography.',
    date: 'Aug 2026',
    readTime: '4 min read',
    category: 'Motion Design',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
  },
];

const seedContentIfEmpty = async () => {
  try {
    const portfolioCount = await Portfolio.countDocuments();
    if (portfolioCount === 0) {
      console.log('[Seed] Seeding initial Portfolio projects into MongoDB Atlas...');
      await Portfolio.insertMany(initialPortfolio);
    }

    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0) {
      console.log('[Seed] Seeding initial Services into MongoDB Atlas...');
      await Service.insertMany(initialServices);
    }

    const clientCount = await Client.countDocuments();
    if (clientCount === 0) {
      console.log('[Seed] Seeding initial Clients into MongoDB Atlas...');
      await Client.insertMany(initialClients);
    }

    const testimonialCount = await Testimonial.countDocuments();
    if (testimonialCount === 0) {
      console.log('[Seed] Seeding initial Testimonials into MongoDB Atlas...');
      await Testimonial.insertMany(initialTestimonials);
    }

    const blogCount = await Blog.countDocuments();
    if (blogCount === 0) {
      console.log('[Seed] Seeding initial Blogs into MongoDB Atlas...');
      await Blog.insertMany(initialBlogs);
    }
  } catch (err) {
    console.warn('[Seed Content Warning]:', err.message);
  }
};

module.exports = { seedContentIfEmpty };
