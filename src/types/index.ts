export interface ServiceItem {
  id: string;
  title: string;
  tagline: string;
  iconName: string;
  slug: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  year: string;
  description: string;
  image: string;
  featured?: boolean;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  avatarInitial: string;
}

export interface ClientItem {
  id: string;
  name: string;
  initials: string;
  category: string;
}

export interface Milestone {
  year: string;
  tag: string;
  description: string;
  number: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  color?: string;
}
