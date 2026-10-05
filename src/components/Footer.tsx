import React from 'react';
import { Instagram, Facebook, Linkedin, Dribbble, ArrowUp } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleNavClick = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-x py-12 sm:py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 sm:gap-10 lg:gap-12">
        {/* Brand Info */}
        <div className="sm:col-span-2 md:col-span-3 lg:col-span-2">
          <a
            href="/"
            onClick={(e) => handleNavClick('/', e)}
            className="flex items-center gap-2"
          >
            <img
              src="/logo.svg"
              alt="Graphics Haven"
              width="280"
              height="100"
              className="w-[200px] h-auto object-contain"
            />
          </a>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground leading-relaxed">
            Transforming ideas into powerful visual brands. A premium creative studio with 10+ years
            designing for ambitious teams worldwide.
          </p>

          <div className="mt-6 flex items-center gap-2">
            <a
              href="https://www.instagram.com/graphicshaven4/"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-background hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href="https://facebook.com"
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-background hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <Facebook className="h-4 w-4" />
            </a>
            <a
              href="https://linkedin.com"
              aria-label="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-background hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href="https://dribbble.com"
              aria-label="Dribbble"
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-background hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <Dribbble className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Company Links */}
        <div>
          <h4 className="text-sm font-semibold font-display">Company</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li>
              <a
                href="/about"
                onClick={(e) => handleNavClick('/about', e)}
                className="hover:text-foreground transition-colors"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="/services"
                onClick={(e) => handleNavClick('/services', e)}
                className="hover:text-foreground transition-colors"
              >
                Services
              </a>
            </li>
            <li>
              <a
                href="/portfolio"
                onClick={(e) => handleNavClick('/portfolio', e)}
                className="hover:text-foreground transition-colors"
              >
                Portfolio
              </a>
            </li>
            <li>
              <a
                href="/clients"
                onClick={(e) => handleNavClick('/clients', e)}
                className="hover:text-foreground transition-colors"
              >
                Clients
              </a>
            </li>
          </ul>
        </div>

        {/* Resources Links */}
        <div>
          <h4 className="text-sm font-semibold font-display">Resources</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li>
              <a
                href="/blog"
                onClick={(e) => handleNavClick('/blog', e)}
                className="hover:text-foreground transition-colors"
              >
                Blog
              </a>
            </li>
            <li>
              <a
                href="/testimonials"
                onClick={(e) => handleNavClick('/testimonials', e)}
                className="hover:text-foreground transition-colors"
              >
                Testimonials
              </a>
            </li>
            <li>
              <a
                href="/contact"
                onClick={(e) => handleNavClick('/contact', e)}
                className="hover:text-foreground transition-colors"
              >
                Contact
              </a>
            </li>
            <li>
              <a
                href="/admin"
                onClick={(e) => handleNavClick('/admin', e)}
                className="hover:text-accent font-medium transition-colors text-xs flex items-center gap-1"
              >
                Studio Admin ↗
              </a>
            </li>
          </ul>
        </div>

        {/* Contact info */}
        <div>
          <h4 className="text-sm font-semibold font-display">Contact</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li className="hover:text-foreground transition-colors">
              <a href="mailto:graphicshaven4@gmail.com">graphicshaven4@gmail.com</a>
            </li>
            <li className="hover:text-foreground transition-colors">
              <a href="tel:+918778139593">+91 - 87 78 13 95 93</a>
            </li>
            <li className="leading-relaxed">
              158,B Aramapannai, Tuticorin Dist - 628 619.
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="container-x flex flex-col sm:flex-row items-center justify-between gap-4 py-6 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Graphics Haven. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="#terms" className="hover:text-foreground transition-colors">
              Terms
            </a>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer"
            >
              Back to top <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
