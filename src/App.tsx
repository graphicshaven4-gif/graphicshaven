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
import { ContentProvider } from './context/ContentContext';

export const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return !!(
      localStorage.getItem('gh_admin_token') || sessionStorage.getItem('gh_admin_token')
    );
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (path !== currentPath) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
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
    switch (currentPath) {
      case '/admin':
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

      case '/admin/dashboard':
        if (!isAdminAuthenticated) {
          return (
            <AdminLoginPage
              onLoginSuccess={handleLoginSuccess}
              onNavigateHome={() => navigate('/')}
            />
          );
        }
        return (
          <AdminDashboardPage
            onLogout={handleLogout}
            onNavigateHome={() => navigate('/')}
          />
        );

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
      <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-accent selection:text-white">
        {!isAdminRoute && <Navbar currentPath={currentPath} onNavigate={navigate} />}
        <main className="flex-1 flex flex-col">{renderPage()}</main>
        {!isAdminRoute && <Footer onNavigate={navigate} />}
      </div>
    </ContentProvider>
  );
};

export default App;
