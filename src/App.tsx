import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { ClientsPage } from './pages/ClientsPage';
import { TestimonialsPage } from './pages/TestimonialsPage';
import { BlogPage } from './pages/BlogPage';
import { ContactPage } from './pages/ContactPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { ContentProvider } from './context/ContentContext';

// Helper to normalize path by stripping trailing slashes
const normalizePath = (path: string): string => {
  if (!path) return '/';
  // Strip query string and hash if present in pathname
  const clean = path.split('?')[0].split('#')[0].replace(/\/+$/, '');
  return clean === '' ? '/' : clean;
};

export const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return normalizePath(window.location.pathname || '/');
  });

  const [showIntro, setShowIntro] = useState<boolean>(() => {
    const initialPath = normalizePath(window.location.pathname || '/');
    return !initialPath.startsWith('/admin');
  });
  const [introFading, setIntroFading] = useState(false);

  useEffect(() => {
    if (!showIntro) return;
    const fadeTimer = setTimeout(() => setIntroFading(true), 1750);
    const hideTimer = setTimeout(() => setShowIntro(false), 2150);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [showIntro]);

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return !!(
      localStorage.getItem('gh_admin_token') || sessionStorage.getItem('gh_admin_token')
    );
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(normalizePath(window.location.pathname || '/'));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    const target = normalizePath(path);
    if (target !== currentPath) {
      window.history.pushState({}, '', target);
      setCurrentPath(target);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    navigate('/admin/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('gh_admin_token');
    localStorage.removeItem('gh_admin_user');
    sessionStorage.removeItem('gh_admin_token');
    sessionStorage.removeItem('gh_admin_user');
    setIsAdminAuthenticated(false);
    navigate('/admin');
  };

  const renderPage = () => {
    const path = normalizePath(currentPath);

    // Any admin route: /admin, /admin/, /admin/dashboard, etc.
    if (path.startsWith('/admin')) {
      if (isAdminAuthenticated) {
        return (
          <AdminDashboardPage
            onLogout={handleLogout}
            onNavigateHome={() => navigate('/')}
          />
        );
      }
      return (
        <AdminLoginPage
          onLoginSuccess={handleLoginSuccess}
          onNavigateHome={() => navigate('/')}
        />
      );
    }

    switch (path) {
      case '/about':
        return <AboutPage />;
      case '/services':
        return <ServicesPage onNavigate={navigate} />;
      case '/portfolio':
        return <PortfolioPage />;
      case '/clients':
        return <ClientsPage onNavigate={navigate} />;
      case '/testimonials':
        return <TestimonialsPage />;
      case '/blog':
        return <BlogPage />;
      case '/contact':
        return <ContactPage />;
      case '/':
      default:
        return <HomePage onNavigate={navigate} />;
    }
  };

  const isAdminRoute = currentPath.startsWith('/admin');

  return (
    <ContentProvider>
      {showIntro && !isAdminRoute && (
        <div
          className={`fixed inset-0 z-[100] flex items-center justify-center bg-background transition-opacity duration-400 ${
            introFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          aria-hidden="true"
        >
          <div className="flex flex-col items-center gap-4 px-6">
            <img
              src="/logo.png"
              alt="Graphics Haven"
              width="320"
              height="115"
              className="w-[240px] sm:w-[320px] h-auto object-contain animate-logo-zoom"
            />
          </div>
        </div>
      )}

      <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-accent selection:text-white">
        {!isAdminRoute && <Navbar currentPath={currentPath} onNavigate={navigate} />}
        <main
          className={`flex-1 flex flex-col ${!isAdminRoute ? 'pt-16 md:pt-20' : ''} ${
            !showIntro && !isAdminRoute ? 'animate-home-reveal' : ''
          }`}
        >
          {renderPage()}
        </main>
        {!isAdminRoute && <Footer onNavigate={navigate} />}
        {!isAdminRoute && <FloatingWhatsApp />}
      </div>
    </ContentProvider>
  );
};

export default App;
