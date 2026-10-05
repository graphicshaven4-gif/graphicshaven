import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ServiceItem,
  PortfolioProject,
  ClientItem,
  Testimonial,
  BlogPost,
} from '../types';
import {
  servicesData,
  portfolioProjects,
  clientLogos,
  testimonialsData,
  blogPostsData,
} from '../data/mockData';

const defaultClients: ClientItem[] = clientLogos.map((c, i) => ({
  id: `client-${i + 1}`,
  name: c.name,
  initials: c.initials,
  category: c.category,
}));

interface ContentContextType {
  services: ServiceItem[];
  addService: (item: Omit<ServiceItem, 'id'>) => Promise<void>;
  updateService: (id: string, item: Partial<ServiceItem>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;

  portfolio: PortfolioProject[];
  addPortfolio: (item: Omit<PortfolioProject, 'id'>) => Promise<void>;
  updatePortfolio: (id: string, item: Partial<PortfolioProject>) => Promise<void>;
  deletePortfolio: (id: string) => Promise<void>;

  clients: ClientItem[];
  addClient: (item: Omit<ClientItem, 'id'>) => Promise<void>;
  updateClient: (id: string, item: Partial<ClientItem>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;

  testimonials: Testimonial[];
  addTestimonial: (item: Omit<Testimonial, 'id'>) => Promise<void>;
  updateTestimonial: (id: string, item: Partial<Testimonial>) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;

  blogs: BlogPost[];
  addBlog: (item: Omit<BlogPost, 'id'>) => Promise<void>;
  updateBlog: (id: string, item: Partial<BlogPost>) => Promise<void>;
  deleteBlog: (id: string) => Promise<void>;

  resetToDefaults: () => void;
  reloadFromDatabase: () => Promise<void>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

const API_BASE = 'http://localhost:5000/api/content';

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Services
  const [services, setServices] = useState<ServiceItem[]>(() => {
    try {
      const saved = localStorage.getItem('gh_services');
      return saved ? JSON.parse(saved) : servicesData;
    } catch {
      return servicesData;
    }
  });

  // 2. Portfolio
  const [portfolio, setPortfolio] = useState<PortfolioProject[]>(() => {
    try {
      const saved = localStorage.getItem('gh_portfolio');
      return saved ? JSON.parse(saved) : portfolioProjects;
    } catch {
      return portfolioProjects;
    }
  });

  // 3. Clients
  const [clients, setClients] = useState<ClientItem[]>(() => {
    try {
      const saved = localStorage.getItem('gh_clients');
      return saved ? JSON.parse(saved) : defaultClients;
    } catch {
      return defaultClients;
    }
  });

  // 4. Testimonials
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    try {
      const saved = localStorage.getItem('gh_testimonials');
      return saved ? JSON.parse(saved) : testimonialsData;
    } catch {
      return testimonialsData;
    }
  });

  // 5. Blogs
  const [blogs, setBlogs] = useState<BlogPost[]>(() => {
    try {
      const saved = localStorage.getItem('gh_blogs');
      return saved ? JSON.parse(saved) : blogPostsData;
    } catch {
      return blogPostsData;
    }
  });

  // Load latest content from MongoDB Atlas via API
  const reloadFromDatabase = async () => {
    try {
      const res = await fetch(`${API_BASE}/all`);
      if (!res.ok) return;
      const json = await res.json();
      if (json.success && json.data) {
        if (json.data.services?.length) setServices(json.data.services);
        if (json.data.portfolio?.length) setPortfolio(json.data.portfolio);
        if (json.data.clients?.length) setClients(json.data.clients);
        if (json.data.testimonials?.length) setTestimonials(json.data.testimonials);
        if (json.data.blogs?.length) setBlogs(json.data.blogs);
      }
    } catch (e) {
      console.warn('[ContentContext] Backend API offline or unreachable, used cached data.');
    }
  };

  useEffect(() => {
    reloadFromDatabase();
  }, []);

  // Sync to localStorage as offline cache
  useEffect(() => {
    try {
      localStorage.setItem('gh_services', JSON.stringify(services));
    } catch {}
  }, [services]);

  useEffect(() => {
    try {
      localStorage.setItem('gh_portfolio', JSON.stringify(portfolio));
    } catch {}
  }, [portfolio]);

  useEffect(() => {
    try {
      localStorage.setItem('gh_clients', JSON.stringify(clients));
    } catch {}
  }, [clients]);

  useEffect(() => {
    try {
      localStorage.setItem('gh_testimonials', JSON.stringify(testimonials));
    } catch {}
  }, [testimonials]);

  useEffect(() => {
    try {
      localStorage.setItem('gh_blogs', JSON.stringify(blogs));
    } catch {}
  }, [blogs]);

  // ==========================================
  // PORTFOLIO CRUD (API & MongoDB)
  // ==========================================
  const addPortfolio = async (item: Omit<PortfolioProject, 'id'>) => {
    try {
      const res = await fetch(`${API_BASE}/portfolio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setPortfolio((prev) => [json.data, ...prev]);
        return;
      }
    } catch (err) {
      console.error('[Portfolio] Failed to save to database API:', err);
    }
    const fallback: PortfolioProject = {
      ...item,
      id: `project-${Date.now()}`,
    };
    setPortfolio((prev) => [fallback, ...prev]);
  };

  const updatePortfolio = async (id: string, updated: Partial<PortfolioProject>) => {
    setPortfolio((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
    try {
      await fetch(`${API_BASE}/portfolio/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch (err) {
      console.error('[Portfolio] Failed to update in database:', err);
    }
  };

  const deletePortfolio = async (id: string) => {
    setPortfolio((prev) => prev.filter((p) => p.id !== id));
    try {
      await fetch(`${API_BASE}/portfolio/${id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.error('[Portfolio] Failed to delete in database:', err);
    }
  };

  // ==========================================
  // BLOGS CRUD (API & MongoDB)
  // ==========================================
  const addBlog = async (item: Omit<BlogPost, 'id'>) => {
    try {
      const res = await fetch(`${API_BASE}/blogs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setBlogs((prev) => [json.data, ...prev]);
        return;
      }
    } catch (err) {
      console.error('[Blog] Failed to save to database API:', err);
    }
    const fallback: BlogPost = {
      ...item,
      id: `blog-${Date.now()}`,
    };
    setBlogs((prev) => [fallback, ...prev]);
  };

  const updateBlog = async (id: string, updated: Partial<BlogPost>) => {
    setBlogs((prev) => prev.map((b) => (b.id === id ? { ...b, ...updated } : b)));
    try {
      await fetch(`${API_BASE}/blogs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch (err) {
      console.error('[Blog] Failed to update in database:', err);
    }
  };

  const deleteBlog = async (id: string) => {
    setBlogs((prev) => prev.filter((b) => b.id !== id));
    try {
      await fetch(`${API_BASE}/blogs/${id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.error('[Blog] Failed to delete in database:', err);
    }
  };

  // ==========================================
  // SERVICES CRUD (API & MongoDB)
  // ==========================================
  const addService = async (item: Omit<ServiceItem, 'id'>) => {
    try {
      const res = await fetch(`${API_BASE}/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setServices((prev) => [json.data, ...prev]);
        return;
      }
    } catch (err) {
      console.error('[Service] Failed to save to database:', err);
    }
    const fallback: ServiceItem = { ...item, id: `service-${Date.now()}` };
    setServices((prev) => [fallback, ...prev]);
  };

  const updateService = async (id: string, updated: Partial<ServiceItem>) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)));
    try {
      await fetch(`${API_BASE}/services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch (err) {
      console.error('[Service] Failed to update in database:', err);
    }
  };

  const deleteService = async (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
    try {
      await fetch(`${API_BASE}/services/${id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.error('[Service] Failed to delete in database:', err);
    }
  };

  // ==========================================
  // CLIENTS CRUD (API & MongoDB)
  // ==========================================
  const addClient = async (item: Omit<ClientItem, 'id'>) => {
    try {
      const res = await fetch(`${API_BASE}/clients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setClients((prev) => [json.data, ...prev]);
        return;
      }
    } catch (err) {
      console.error('[Client] Failed to save to database:', err);
    }
    const fallback: ClientItem = { ...item, id: `client-${Date.now()}` };
    setClients((prev) => [fallback, ...prev]);
  };

  const updateClient = async (id: string, updated: Partial<ClientItem>) => {
    setClients((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
    try {
      await fetch(`${API_BASE}/clients/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch (err) {
      console.error('[Client] Failed to update in database:', err);
    }
  };

  const deleteClient = async (id: string) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
    try {
      await fetch(`${API_BASE}/clients/${id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.error('[Client] Failed to delete in database:', err);
    }
  };

  // ==========================================
  // TESTIMONIALS CRUD (API & MongoDB)
  // ==========================================
  const addTestimonial = async (item: Omit<Testimonial, 'id'>) => {
    try {
      const res = await fetch(`${API_BASE}/testimonials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setTestimonials((prev) => [json.data, ...prev]);
        return;
      }
    } catch (err) {
      console.error('[Testimonial] Failed to save to database:', err);
    }
    const fallback: Testimonial = { ...item, id: `testimonial-${Date.now()}` };
    setTestimonials((prev) => [fallback, ...prev]);
  };

  const updateTestimonial = async (id: string, updated: Partial<Testimonial>) => {
    setTestimonials((prev) => prev.map((t) => (t.id === id ? { ...t, ...updated } : t)));
    try {
      await fetch(`${API_BASE}/testimonials/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch (err) {
      console.error('[Testimonial] Failed to update in database:', err);
    }
  };

  const deleteTestimonial = async (id: string) => {
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
    try {
      await fetch(`${API_BASE}/testimonials/${id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.error('[Testimonial] Failed to delete in database:', err);
    }
  };

  const resetToDefaults = () => {
    setServices(servicesData);
    setPortfolio(portfolioProjects);
    setClients(defaultClients);
    setTestimonials(testimonialsData);
    setBlogs(blogPostsData);
  };

  return (
    <ContentContext.Provider
      value={{
        services,
        addService,
        updateService,
        deleteService,
        portfolio,
        addPortfolio,
        updatePortfolio,
        deletePortfolio,
        clients,
        addClient,
        updateClient,
        deleteClient,
        testimonials,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        blogs,
        addBlog,
        updateBlog,
        deleteBlog,
        resetToDefaults,
        reloadFromDatabase,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
