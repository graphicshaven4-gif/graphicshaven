import React, { useState, useEffect } from 'react';
import {
  LogOut,
  FolderKanban,
  Inbox,
  Users,
  ArrowUpRight,
  Shield,
  ExternalLink,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  Sparkles,
  Building2,
  MessageSquareQuote,
  FileText,
  LayoutDashboard,
  RotateCcw,
  Star,
  RefreshCw,
  Phone,
} from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { ImageUpload } from '../components/ImageUpload';

interface AdminDashboardPageProps {
  onLogout: () => void;
  onNavigateHome: () => void;
}

type TabType = 'overview' | 'services' | 'portfolio' | 'clients' | 'testimonials' | 'blog';

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  onLogout,
  onNavigateHome,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [adminUser, setAdminUser] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Content Context
  const {
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
  } = useContent();

  // Live Inquiries State
  const [inquiries, setInquiries] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem('gh_inquiries');
      return stored
        ? JSON.parse(stored)
        : [
            {
              _id: 'inq-101',
              name: 'Sarah Jenkins',
              email: 'sarah@nordicliving.com',
              phone: '+1 (555) 234-5678',
              service: 'Brand Identity',
              budget: '$5k – $15k',
              details: 'Complete brand refresh for Scandinavian homeware store launch.',
              status: 'New',
              createdAt: new Date().toISOString(),
            },
            {
              _id: 'inq-102',
              name: 'Vikram Sundaram',
              email: 'vikram@chennaitech.io',
              phone: '+91 98401 23456',
              service: 'Web Development',
              budget: '$15k – $50k',
              details: 'Full-stack React & Node.js web application with dashboard.',
              status: 'In Review',
              createdAt: new Date(Date.now() - 7200000).toISOString(),
            },
            {
              _id: 'inq-103',
              name: 'Elena Rostova',
              email: 'elena@luxpackaging.fr',
              phone: '+33 1 42 68 55 00',
              service: 'Product Packaging Design',
              budget: '$5k – $15k',
              details: 'Luxury cosmetic carton boxes and foil stamping design.',
              status: 'Contacted',
              createdAt: new Date(Date.now() - 86400000).toISOString(),
            },
          ];
    } catch {
      return [];
    }
  });

  const [loadingInquiries, setLoadingInquiries] = useState(false);

  const fetchInquiries = async () => {
    setLoadingInquiries(true);
    try {
      const res = await fetch('http://localhost:5000/api/inquiries');
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setInquiries(json.data);
          try {
            localStorage.setItem('gh_inquiries', JSON.stringify(json.data));
          } catch (e) {
            // ignore
          }
        }
      }
    } catch (e) {
      // offline fallback maintains existing state
    } finally {
      setLoadingInquiries(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleUpdateInquiryStatus = async (id: string, newStatus: string) => {
    setInquiries((prev) =>
      prev.map((item) => (item._id === id || item.id === id ? { ...item, status: newStatus } : item))
    );
    showToast(`Inquiry status updated to ${newStatus}`);

    try {
      await fetch(`http://localhost:5000/api/inquiries/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (e) {
      // ignore
    }
  };

  const handleDeleteInquiry = async (id: string, clientName: string) => {
    if (!window.confirm(`Delete inquiry from "${clientName}"?`)) return;

    setInquiries((prev) => prev.filter((item) => item._id !== id && item.id !== id));
    showToast(`Inquiry deleted.`);

    try {
      await fetch(`http://localhost:5000/api/inquiries/${id}`, {
        method: 'DELETE',
      });
    } catch (e) {
      // ignore
    }
  };

  // Overview metrics state
  const dashboardData = {
    activeProjects: 14,
    totalInquiries: inquiries.length,
    happyClients: 1042,
    pendingReviews: inquiries.filter((inq) => inq.status === 'New').length,
  };

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<TabType>('services');
  const [editingItem, setEditingItem] = useState<any>(null);

  // Form states
  const [serviceForm, setServiceForm] = useState({
    title: '',
    tagline: '',
    iconName: 'Sparkles',
    slug: '',
  });

  const [portfolioForm, setPortfolioForm] = useState({
    title: '',
    category: 'Website',
    year: '2026',
    description: '',
    image: '',
    featured: true,
  });

  const [clientForm, setClientForm] = useState({
    name: '',
    initials: '',
    category: 'Technology',
  });

  const [testimonialForm, setTestimonialForm] = useState({
    author: '',
    role: '',
    company: '',
    avatarInitial: '',
    quote: '',
  });

  const [blogForm, setBlogForm] = useState({
    title: '',
    excerpt: '',
    date: 'Oct 2026',
    readTime: '5 min read',
    category: 'Brand Strategy',
    image: '',
  });

  useEffect(() => {
    const stored =
      localStorage.getItem('gh_admin_user') || sessionStorage.getItem('gh_admin_user');
    if (stored) {
      try {
        setAdminUser(JSON.parse(stored));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Open modal for Adding
  const handleOpenAdd = (type: TabType) => {
    setModalType(type);
    setEditingItem(null);

    if (type === 'services') {
      setServiceForm({
        title: '',
        tagline: '',
        iconName: 'Sparkles',
        slug: '',
      });
    } else if (type === 'portfolio') {
      setPortfolioForm({
        title: '',
        category: 'Web Development',
        year: new Date().getFullYear().toString(),
        description: '',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
        featured: true,
      });
    } else if (type === 'clients') {
      setClientForm({
        name: '',
        initials: '',
        category: 'Creative',
      });
    } else if (type === 'testimonials') {
      setTestimonialForm({
        author: '',
        role: 'Founder',
        company: '',
        avatarInitial: 'A',
        quote: '',
      });
    } else if (type === 'blog') {
      setBlogForm({
        title: '',
        excerpt: '',
        date: 'Oct 2026',
        readTime: '4 min read',
        category: 'Brand Strategy',
        image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80',
      });
    }
    setModalOpen(true);
  };

  // Open modal for Editing
  const handleOpenEdit = (type: TabType, item: any) => {
    setModalType(type);
    setEditingItem(item);

    if (type === 'services') {
      setServiceForm({
        title: item.title,
        tagline: item.tagline,
        iconName: item.iconName || 'Sparkles',
        slug: item.slug || `/services/${item.id}`,
      });
    } else if (type === 'portfolio') {
      setPortfolioForm({
        title: item.title,
        category: item.category,
        year: item.year,
        description: item.description,
        image: item.image,
        featured: item.featured ?? true,
      });
    } else if (type === 'clients') {
      setClientForm({
        name: item.name,
        initials: item.initials,
        category: item.category,
      });
    } else if (type === 'testimonials') {
      setTestimonialForm({
        author: item.author,
        role: item.role,
        company: item.company,
        avatarInitial: item.avatarInitial,
        quote: item.quote,
      });
    } else if (type === 'blog') {
      setBlogForm({
        title: item.title,
        excerpt: item.excerpt,
        date: item.date,
        readTime: item.readTime,
        category: item.category,
        image: item.image,
      });
    }
    setModalOpen(true);
  };

  // Save Modal Form
  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();

    if (modalType === 'services') {
      if (editingItem) {
        await updateService(editingItem.id, serviceForm);
        showToast(`Service "${serviceForm.title}" updated.`);
      } else {
        await addService({
          ...serviceForm,
          slug: serviceForm.slug || `/services/${serviceForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        });
        showToast(`Service "${serviceForm.title}" created.`);
      }
    } else if (modalType === 'portfolio') {
      if (editingItem) {
        await updatePortfolio(editingItem.id, portfolioForm);
        showToast(`Project "${portfolioForm.title}" updated.`);
      } else {
        await addPortfolio(portfolioForm);
        showToast(`Project "${portfolioForm.title}" created.`);
      }
    } else if (modalType === 'clients') {
      const initials = clientForm.initials || clientForm.name.slice(0, 2).toUpperCase();
      if (editingItem) {
        await updateClient(editingItem.id, { ...clientForm, initials });
        showToast(`Client "${clientForm.name}" updated.`);
      } else {
        await addClient({ ...clientForm, initials });
        showToast(`Client "${clientForm.name}" created.`);
      }
    } else if (modalType === 'testimonials') {
      const avatarInitial = testimonialForm.avatarInitial || testimonialForm.author.charAt(0).toUpperCase();
      if (editingItem) {
        await updateTestimonial(editingItem.id, { ...testimonialForm, avatarInitial });
        showToast(`Testimonial from "${testimonialForm.author}" updated.`);
      } else {
        await addTestimonial({ ...testimonialForm, avatarInitial });
        showToast(`Testimonial from "${testimonialForm.author}" created.`);
      }
    } else if (modalType === 'blog') {
      if (editingItem) {
        await updateBlog(editingItem.id, blogForm);
        showToast(`Article "${blogForm.title}" updated.`);
      } else {
        await addBlog(blogForm);
        showToast(`Article "${blogForm.title}" created.`);
      }
    }

    setModalOpen(false);
  };

  // Delete Action
  const handleDelete = async (type: TabType, id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    if (type === 'services') {
      await deleteService(id);
      showToast(`Service deleted.`);
    } else if (type === 'portfolio') {
      await deletePortfolio(id);
      showToast(`Project deleted.`);
    } else if (type === 'clients') {
      await deleteClient(id);
      showToast(`Client deleted.`);
    } else if (type === 'testimonials') {
      await deleteTestimonial(id);
      showToast(`Testimonial deleted.`);
    } else if (type === 'blog') {
      await deleteBlog(id);
      showToast(`Article deleted.`);
    }
  };

  const handleResetDefaults = () => {
    if (
      window.confirm(
        'Are you sure you want to reset all Services, Portfolio, Clients, Testimonials, and Blogs to initial sample data?'
      )
    ) {
      resetToDefaults();
      showToast('All content has been reset to default values.');
    }
  };

  return (
    <div className="flex-1 bg-surface/30 min-h-screen pb-20">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl bg-primary px-4 py-3 text-sm text-primary-foreground shadow-2xl animate-fade-in border border-white/10">
          <Check className="h-4 w-4 text-accent" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Admin Sub-bar */}
      <div className="border-b border-border bg-background sticky top-0 z-30 shadow-xs">
        <div className="container-x py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground font-display font-bold">
              {adminUser?.name ? adminUser.name.charAt(0) : 'A'}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold font-display text-foreground">
                  {adminUser?.name || 'Administrator'}
                </h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
                  <Shield className="h-3 w-3" />
                  {adminUser?.role || 'SUPERADMIN'}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                {adminUser?.email || 'admin@graphicshaven.in'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleResetDefaults}
              title="Reset all content to original defaults"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-surface transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset Data
            </button>
            <button
              onClick={onNavigateHome}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground hover:bg-surface transition-colors cursor-pointer"
            >
              View Site <ExternalLink className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-3.5 py-2 text-xs font-medium transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="container-x flex gap-1 overflow-x-auto no-scrollbar border-t border-border pt-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold tracking-wide border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-accent text-accent font-bold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            Overview
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold tracking-wide border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'services'
                ? 'border-accent text-accent font-bold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            Services
            <span className="rounded-full bg-surface px-2 py-0.5 text-[10px] font-mono border border-border">
              {services.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('portfolio')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold tracking-wide border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'portfolio'
                ? 'border-accent text-accent font-bold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <FolderKanban className="h-4 w-4" />
            Portfolio
            <span className="rounded-full bg-surface px-2 py-0.5 text-[10px] font-mono border border-border">
              {portfolio.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('clients')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold tracking-wide border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'clients'
                ? 'border-accent text-accent font-bold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Building2 className="h-4 w-4" />
            Clients
            <span className="rounded-full bg-surface px-2 py-0.5 text-[10px] font-mono border border-border">
              {clients.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('testimonials')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold tracking-wide border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'testimonials'
                ? 'border-accent text-accent font-bold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <MessageSquareQuote className="h-4 w-4" />
            Testimonials
            <span className="rounded-full bg-surface px-2 py-0.5 text-[10px] font-mono border border-border">
              {testimonials.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('blog')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold tracking-wide border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'blog'
                ? 'border-accent text-accent font-bold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <FileText className="h-4 w-4" />
            Blog
            <span className="rounded-full bg-surface px-2 py-0.5 text-[10px] font-mono border border-border">
              {blogs.length}
            </span>
          </button>
        </div>
      </div>

      <div className="container-x py-8">
        {/* ========================================================= */}
        {/* 1. OVERVIEW TAB */}
        {/* ========================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-border bg-background p-6 shadow-xs">
                <div className="flex items-center justify-between text-muted-foreground mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider">Active Projects</span>
                  <FolderKanban className="h-4 w-4 text-accent" />
                </div>
                <div className="font-display text-3xl font-semibold text-foreground">
                  {dashboardData.activeProjects}
                </div>
                <div className="mt-2 text-xs text-emerald-600 font-medium flex items-center gap-1">
                  <span>↑ 3 projects started this week</span>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-background p-6 shadow-xs">
                <div className="flex items-center justify-between text-muted-foreground mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider">Total Inquiries</span>
                  <Inbox className="h-4 w-4 text-primary" />
                </div>
                <div className="font-display text-3xl font-semibold text-foreground">
                  {dashboardData.totalInquiries}
                </div>
                <div className="mt-2 text-xs text-muted-foreground">Across India &amp; Global clients</div>
              </div>

              <div className="rounded-2xl border border-border bg-background p-6 shadow-xs">
                <div className="flex items-center justify-between text-muted-foreground mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider">Happy Clients</span>
                  <Users className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="font-display text-3xl font-semibold text-foreground">
                  {dashboardData.happyClients}
                </div>
                <div className="mt-2 text-xs text-muted-foreground">10+ years established studio</div>
              </div>

              <div className="rounded-2xl border border-border bg-background p-6 shadow-xs">
                <div className="flex items-center justify-between text-muted-foreground mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider">Managed Content</span>
                  <Sparkles className="h-4 w-4 text-amber-500" />
                </div>
                <div className="font-display text-3xl font-semibold text-foreground">
                  {services.length + portfolio.length + clients.length + testimonials.length + blogs.length}
                </div>
                <div className="mt-2 text-xs text-amber-600 font-medium">Live sync enabled</div>
              </div>
            </div>

            {/* Quick Management Shortcuts */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <button
                onClick={() => handleOpenAdd('services')}
                className="flex items-center gap-2.5 rounded-xl border border-border bg-background p-4 text-left hover:border-accent hover:bg-surface transition-all cursor-pointer group shadow-xs"
              >
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-surface text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                  <Plus className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold">New Service</div>
                  <div className="text-[11px] text-muted-foreground">{services.length} items</div>
                </div>
              </button>

              <button
                onClick={() => handleOpenAdd('portfolio')}
                className="flex items-center gap-2.5 rounded-xl border border-border bg-background p-4 text-left hover:border-accent hover:bg-surface transition-all cursor-pointer group shadow-xs"
              >
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-surface text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                  <Plus className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold">New Project</div>
                  <div className="text-[11px] text-muted-foreground">{portfolio.length} items</div>
                </div>
              </button>

              <button
                onClick={() => handleOpenAdd('clients')}
                className="flex items-center gap-2.5 rounded-xl border border-border bg-background p-4 text-left hover:border-accent hover:bg-surface transition-all cursor-pointer group shadow-xs"
              >
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-surface text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                  <Plus className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold">New Client</div>
                  <div className="text-[11px] text-muted-foreground">{clients.length} items</div>
                </div>
              </button>

              <button
                onClick={() => handleOpenAdd('testimonials')}
                className="flex items-center gap-2.5 rounded-xl border border-border bg-background p-4 text-left hover:border-accent hover:bg-surface transition-all cursor-pointer group shadow-xs"
              >
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-surface text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                  <Plus className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold">New Testimonial</div>
                  <div className="text-[11px] text-muted-foreground">{testimonials.length} items</div>
                </div>
              </button>

              <button
                onClick={() => handleOpenAdd('blog')}
                className="flex items-center gap-2.5 rounded-xl border border-border bg-background p-4 text-left hover:border-accent hover:bg-surface transition-all cursor-pointer group shadow-xs"
              >
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-surface text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                  <Plus className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold">New Blog Post</div>
                  <div className="text-[11px] text-muted-foreground">{blogs.length} articles</div>
                </div>
              </button>
            </div>

            {/* Inquiries Table */}
            <div className="rounded-3xl border border-border bg-background overflow-hidden shadow-soft">
              <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-display text-xl font-semibold text-foreground">
                    Recent Client Inquiries ({inquiries.length})
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Direct client leads received from the contact form and emailed to studio.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={fetchInquiries}
                    disabled={loadingInquiries}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-surface transition-colors cursor-pointer"
                    title="Refresh inquiries"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${loadingInquiries ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                  <div className="inline-flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Live Sync Active</span>
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-surface/50 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      <th className="py-3.5 px-6">Client / Contact</th>
                      <th className="py-3.5 px-6">Requested Service</th>
                      <th className="py-3.5 px-6">Budget Tier</th>
                      <th className="py-3.5 px-6">Date</th>
                      <th className="py-3.5 px-6">Status</th>
                      <th className="py-3.5 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-sm">
                    {inquiries.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-muted-foreground text-sm">
                          No inquiries found yet. Submissions from the contact form will appear here in real time.
                        </td>
                      </tr>
                    ) : (
                      inquiries.map((inquiry) => {
                        const inqId = inquiry._id || inquiry.id;
                        const formattedDate = inquiry.createdAt
                          ? new Date(inquiry.createdAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : inquiry.date || 'Recently';

                        return (
                          <tr key={inqId} className="hover:bg-surface/50 transition-colors">
                            <td className="py-4 px-6">
                              <div className="font-medium text-foreground">{inquiry.name}</div>
                              <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                                <span>{inquiry.email}</span>
                                {inquiry.phone && (
                                  <>
                                    <span>&bull;</span>
                                    <a
                                      href={`tel:${inquiry.phone}`}
                                      className="text-foreground hover:text-accent transition-colors flex items-center gap-0.5"
                                    >
                                      <Phone className="h-3 w-3" />
                                      {inquiry.phone}
                                    </a>
                                  </>
                                )}
                              </div>
                              {inquiry.details && (
                                <div className="mt-1 text-[11px] text-muted-foreground line-clamp-1 italic max-w-xs">
                                  "{inquiry.details}"
                                </div>
                              )}
                            </td>
                            <td className="py-4 px-6 font-medium text-foreground">
                              <span className="inline-flex rounded-lg bg-surface border border-border px-2.5 py-1 text-xs font-semibold">
                                {inquiry.service || 'General Inquiry'}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <span className="text-xs font-mono text-muted-foreground">
                                {inquiry.budget || 'Not specified'}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-xs text-muted-foreground whitespace-nowrap">
                              {formattedDate}
                            </td>
                            <td className="py-4 px-6">
                              <select
                                value={inquiry.status || 'New'}
                                onChange={(e) => handleUpdateInquiryStatus(inqId, e.target.value)}
                                className={`text-xs font-semibold rounded-lg px-2.5 py-1 border transition-colors cursor-pointer outline-hidden ${
                                  inquiry.status === 'New'
                                    ? 'bg-accent/10 text-accent border-accent/30'
                                    : inquiry.status === 'In Review'
                                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                                    : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                }`}
                              >
                                <option value="New">New</option>
                                <option value="In Review">In Review</option>
                                <option value="Contacted">Contacted</option>
                              </select>
                            </td>
                            <td className="py-4 px-6 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-2">
                                <a
                                  href={`mailto:${inquiry.email}?subject=Regarding your inquiry with Graphics Haven`}
                                  className="inline-flex items-center gap-1 rounded-lg bg-surface hover:bg-accent hover:text-white border border-border px-2.5 py-1 text-xs font-semibold text-foreground transition-colors"
                                  title="Send Email Reply"
                                >
                                  Reply <ArrowUpRight className="h-3 w-3" />
                                </a>
                                <button
                                  onClick={() => handleDeleteInquiry(inqId, inquiry.name)}
                                  className="rounded-lg p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                  title="Delete Inquiry"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 2. SERVICES TAB */}
        {/* ========================================================= */}
        {activeTab === 'services' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-display text-2xl font-semibold">Services Management</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Manage agency offerings displayed on the Services page and Homepage.
                </p>
              </div>
              <button
                onClick={() => handleOpenAdd('services')}
                className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2.5 text-xs font-semibold hover:bg-accent transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Add Service
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="rounded-2xl border border-border bg-background p-5 shadow-xs flex flex-col justify-between hover:border-primary/50 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-surface border border-border text-accent">
                        <Sparkles className="h-4 w-4" />
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit('services', service)}
                          className="rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-surface transition-colors cursor-pointer"
                          title="Edit Service"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete('services', service.id, service.title)}
                          className="rounded-lg p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete Service"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <h4 className="mt-4 font-display text-lg font-semibold">{service.title}</h4>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      {service.tagline}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                    <span>slug: {service.slug || `/services/${service.id}`}</span>
                    <span className="text-accent uppercase font-bold text-[9px] tracking-wider">
                      Active
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 3. PORTFOLIO TAB */}
        {/* ========================================================= */}
        {activeTab === 'portfolio' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-display text-2xl font-semibold">Portfolio Management</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Manage projects, imagery, categories, and featured case studies.
                </p>
              </div>
              <button
                onClick={() => handleOpenAdd('portfolio')}
                className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2.5 text-xs font-semibold hover:bg-accent transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Add Project
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {portfolio.map((project) => (
                <div
                  key={project.id}
                  className="rounded-2xl border border-border bg-background overflow-hidden shadow-xs flex flex-col justify-between hover:border-primary/50 transition-colors"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-surface">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="rounded-full bg-black/70 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-semibold text-white tracking-wide">
                        {project.category}
                      </span>
                      {project.featured && (
                        <span className="rounded-full bg-accent px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-display text-lg font-semibold">{project.title}</h4>
                        <span className="text-xs font-mono text-muted-foreground">{project.year}</span>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                        {project.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-border flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit('portfolio', project)}
                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-surface transition-colors cursor-pointer"
                      >
                        <Edit3 className="h-3.5 w-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete('portfolio', project.id, project.title)}
                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 4. CLIENTS TAB */}
        {/* ========================================================= */}
        {activeTab === 'clients' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-display text-2xl font-semibold">Clients &amp; Partners</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Manage brand partners, client logos, and industry tags.
                </p>
              </div>
              <button
                onClick={() => handleOpenAdd('clients')}
                className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2.5 text-xs font-semibold hover:bg-accent transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Add Client
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {clients.map((client) => (
                <div
                  key={client.id}
                  className="rounded-2xl border border-border bg-background p-5 text-center flex flex-col items-center justify-between shadow-xs hover:border-primary/50 transition-colors"
                >
                  <div className="w-full flex justify-end gap-1 mb-2">
                    <button
                      onClick={() => handleOpenEdit('clients', client)}
                      className="rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-surface transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete('clients', client.id, client.name)}
                      className="rounded-md p-1 text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-surface border border-border text-accent font-display text-base font-bold font-mono">
                    {client.initials}
                  </span>

                  <div className="mt-3">
                    <h4 className="font-display font-semibold text-sm text-foreground">
                      {client.name}
                    </h4>
                    <span className="mt-1 inline-block text-[11px] text-muted-foreground">
                      {client.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 5. TESTIMONIALS TAB */}
        {/* ========================================================= */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-display text-2xl font-semibold">Testimonials Management</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Manage client reviews and testimonials displayed across the studio site.
                </p>
              </div>
              <button
                onClick={() => handleOpenAdd('testimonials')}
                className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2.5 text-xs font-semibold hover:bg-accent transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Add Testimonial
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {testimonials.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-border bg-background p-6 shadow-xs flex flex-col justify-between hover:border-primary/50 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-accent text-accent" />
                        ))}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEdit('testimonials', item)}
                          className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-surface transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete('testimonials', item.id, item.author)}
                          className="rounded-lg p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <blockquote className="font-display text-sm leading-relaxed text-foreground italic">
                      "{item.quote}"
                    </blockquote>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground font-display font-bold text-xs">
                      {item.avatarInitial}
                    </span>
                    <div>
                      <div className="text-xs font-semibold">{item.author}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {item.role}, {item.company}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 6. BLOG TAB */}
        {/* ========================================================= */}
        {activeTab === 'blog' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-display text-2xl font-semibold">Blog &amp; Journal</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Publish essays, case study write-ups, and brand strategy articles.
                </p>
              </div>
              <button
                onClick={() => handleOpenAdd('blog')}
                className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2.5 text-xs font-semibold hover:bg-accent transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="h-4 w-4" /> New Article
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {blogs.map((post) => (
                <div
                  key={post.id}
                  className="rounded-2xl border border-border bg-background overflow-hidden shadow-xs flex flex-col justify-between hover:border-primary/50 transition-colors"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-surface relative">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute top-3 left-3 rounded-full bg-black/70 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-semibold text-white">
                      {post.category}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[11px] text-muted-foreground font-medium">
                        {post.date} · {post.readTime}
                      </div>
                      <h4 className="mt-2 font-display text-base font-semibold leading-snug">
                        {post.title}
                      </h4>
                      <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-border flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit('blog', post)}
                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-surface transition-colors cursor-pointer"
                      >
                        <Edit3 className="h-3.5 w-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete('blog', post.id, post.title)}
                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* GENERIC CRUD MODAL */}
      {/* ========================================================= */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-background p-5 sm:p-6 md:p-8 shadow-2xl my-auto">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <h3 className="font-display text-xl font-semibold">
                {editingItem ? 'Edit' : 'Add New'} {modalType.charAt(0).toUpperCase() + modalType.slice(1, -1)}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-surface hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="mt-6 space-y-4">
              {/* SERVICES FORM */}
              {modalType === 'services' && (
                <>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Service Title *
                    </label>
                    <input
                      required
                      value={serviceForm.title}
                      onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                      placeholder="e.g. Web Development"
                      className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm focus:border-accent focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Tagline *
                    </label>
                    <input
                      required
                      value={serviceForm.tagline}
                      onChange={(e) => setServiceForm({ ...serviceForm, tagline: e.target.value })}
                      placeholder="e.g. High-performance full-stack web apps."
                      className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm focus:border-accent focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Icon Name
                    </label>
                    <select
                      value={serviceForm.iconName}
                      onChange={(e) => setServiceForm({ ...serviceForm, iconName: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm focus:border-accent focus:outline-hidden"
                    >
                      <option value="Sparkles">Sparkles (Identity)</option>
                      <option value="Code2">Code2 (Web Development)</option>
                      <option value="Monitor">Monitor (Website)</option>
                      <option value="PenTool">PenTool (Logo)</option>
                      <option value="Package">Package (Packaging)</option>
                      <option value="Megaphone">Megaphone (Advertising)</option>
                      <option value="Layers">Layers (UI/UX)</option>
                      <option value="Film">Film (Motion)</option>
                    </select>
                  </div>
                </>
              )}

              {/* PORTFOLIO FORM */}
              {modalType === 'portfolio' && (
                <>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Project Title *
                    </label>
                    <input
                      required
                      value={portfolioForm.title}
                      onChange={(e) => setPortfolioForm({ ...portfolioForm, title: e.target.value })}
                      placeholder="e.g. Aperture House"
                      className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm focus:border-accent focus:outline-hidden"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Category *
                      </label>
                      <select
                        value={portfolioForm.category}
                        onChange={(e) => setPortfolioForm({ ...portfolioForm, category: e.target.value })}
                        className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm focus:border-accent focus:outline-hidden"
                      >
                        <option>Logo</option>
                        <option>Brand Identity</option>
                        <option>Packaging</option>
                        <option>Website</option>
                        <option>Web Development</option>
                        <option>UI UX</option>
                        <option>Advertising</option>
                        <option>Poster</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Year
                      </label>
                      <input
                        value={portfolioForm.year}
                        onChange={(e) => setPortfolioForm({ ...portfolioForm, year: e.target.value })}
                        placeholder="2026"
                        className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm focus:border-accent focus:outline-hidden"
                      >
                      </input>
                    </div>
                  </div>
                  <ImageUpload
                    label="Project Image"
                    required
                    value={portfolioForm.image}
                    onChange={(url) => setPortfolioForm({ ...portfolioForm, image: url })}
                  />
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      value={portfolioForm.description}
                      onChange={(e) => setPortfolioForm({ ...portfolioForm, description: e.target.value })}
                      placeholder="Short case study description..."
                      className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm focus:border-accent focus:outline-hidden"
                    />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={portfolioForm.featured}
                      onChange={(e) => setPortfolioForm({ ...portfolioForm, featured: e.target.checked })}
                      className="rounded border-border text-accent focus:ring-accent"
                    />
                    <span className="text-xs font-medium text-foreground">Mark as Featured on Home Page</span>
                  </label>
                </>
              )}

              {/* CLIENTS FORM */}
              {modalType === 'clients' && (
                <>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Client / Brand Name *
                    </label>
                    <input
                      required
                      value={clientForm.name}
                      onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
                      placeholder="e.g. Food Partner"
                      className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm focus:border-accent focus:outline-hidden"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Initials / Monogram
                      </label>
                      <input
                        maxLength={3}
                        value={clientForm.initials}
                        onChange={(e) => setClientForm({ ...clientForm, initials: e.target.value.toUpperCase() })}
                        placeholder="e.g. FP"
                        className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm focus:border-accent focus:outline-hidden uppercase"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Industry / Category
                      </label>
                      <input
                        value={clientForm.category}
                        onChange={(e) => setClientForm({ ...clientForm, category: e.target.value })}
                        placeholder="e.g. F&B or Tech"
                        className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm focus:border-accent focus:outline-hidden"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* TESTIMONIALS FORM */}
              {modalType === 'testimonials' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Author Name *
                      </label>
                      <input
                        required
                        value={testimonialForm.author}
                        onChange={(e) => setTestimonialForm({ ...testimonialForm, author: e.target.value })}
                        placeholder="e.g. Mark Robinson"
                        className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm focus:border-accent focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Role / Title
                      </label>
                      <input
                        value={testimonialForm.role}
                        onChange={(e) => setTestimonialForm({ ...testimonialForm, role: e.target.value })}
                        placeholder="e.g. Founder & CEO"
                        className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm focus:border-accent focus:outline-hidden"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Company *
                    </label>
                    <input
                      required
                      value={testimonialForm.company}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, company: e.target.value })}
                      placeholder="e.g. Northline Coffee Co."
                      className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm focus:border-accent focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Testimonial Quote *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={testimonialForm.quote}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, quote: e.target.value })}
                      placeholder="Write what the client said about working with Graphics Haven..."
                      className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm focus:border-accent focus:outline-hidden"
                    />
                  </div>
                </>
              )}

              {/* BLOG FORM */}
              {modalType === 'blog' && (
                <>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Article Title *
                    </label>
                    <input
                      required
                      value={blogForm.title}
                      onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                      placeholder="e.g. Why Modern Brands Need Typographic Systems"
                      className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm focus:border-accent focus:outline-hidden"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Category
                      </label>
                      <input
                        value={blogForm.category}
                        onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                        placeholder="e.g. Brand Strategy"
                        className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm focus:border-accent focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Read Time
                      </label>
                      <input
                        value={blogForm.readTime}
                        onChange={(e) => setBlogForm({ ...blogForm, readTime: e.target.value })}
                        placeholder="e.g. 5 min read"
                        className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm focus:border-accent focus:outline-hidden"
                      />
                    </div>
                  </div>
                  <ImageUpload
                    label="Article Cover Image"
                    required
                    value={blogForm.image}
                    onChange={(url) => setBlogForm({ ...blogForm, image: url })}
                  />
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Excerpt / Summary
                    </label>
                    <textarea
                      rows={2}
                      value={blogForm.excerpt}
                      onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                      placeholder="Brief teaser of the article..."
                      className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm focus:border-accent focus:outline-hidden"
                    />
                  </div>
                </>
              )}

              <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-medium text-foreground hover:bg-surface transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-accent transition-colors shadow-xs cursor-pointer"
                >
                  {editingItem ? 'Save Changes' : 'Create Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
