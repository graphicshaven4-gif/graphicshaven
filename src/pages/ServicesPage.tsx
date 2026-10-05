import React from 'react';
import {
  ArrowUpRight,
  PenTool,
  Sparkles,
  Package,
  Monitor,
  Megaphone,
  BookOpen,
  Share2,
  Printer,
  Image,
  FileText,
  CreditCard,
  Film,
  Layers,
  Code2,
} from 'lucide-react';
import { PageHero } from '../components/PageHero';
import { useContent } from '../context/ContentContext';

interface ServicesPageProps {
  onNavigate: (path: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate }) => {
  const { services } = useContent();
  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code2':
        return <Code2 className="h-5 w-5" />;
      case 'PenTool':
        return <PenTool className="h-5 w-5" />;
      case 'Sparkles':
        return <Sparkles className="h-5 w-5" />;
      case 'Package':
        return <Package className="h-5 w-5" />;
      case 'Monitor':
        return <Monitor className="h-5 w-5" />;
      case 'Megaphone':
        return <Megaphone className="h-5 w-5" />;
      case 'BookOpen':
        return <BookOpen className="h-5 w-5" />;
      case 'Share2':
        return <Share2 className="h-5 w-5" />;
      case 'Printer':
        return <Printer className="h-5 w-5" />;
      case 'Image':
        return <Image className="h-5 w-5" />;
      case 'FileText':
        return <FileText className="h-5 w-5" />;
      case 'CreditCard':
        return <CreditCard className="h-5 w-5" />;
      case 'Film':
        return <Film className="h-5 w-5" />;
      case 'Layers':
        return <Layers className="h-5 w-5" />;
      default:
        return <Sparkles className="h-5 w-5" />;
    }
  };

  return (
    <div className="flex-1">
      <PageHero
        badge="Services"
        titleRegular="Design services for"
        titleItalic="ambitious brands."
        description="From identity to interface, packaging to motion—each service is delivered by a senior team obsessed with craft."
      />

      {/* Services Grid */}
      <section className="container-x py-20 md:py-28">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <div key={service.id}>
              <div
                onClick={() => onNavigate('/contact')}
                className="group block h-full rounded-2xl border border-border bg-background p-6 hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer shadow-xs"
              >
                <div className="flex items-start justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-surface group-hover:bg-white/10 text-foreground group-hover:text-primary-foreground transition-colors">
                    {getServiceIcon(service.iconName)}
                  </div>
                  <ArrowUpRight className="h-5 w-5 opacity-40 group-hover:opacity-100 transition-opacity" />
                </div>

                <h3 className="mt-8 font-display text-xl font-semibold">{service.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground group-hover:text-primary-foreground/70 transition-colors">
                  {service.tagline}
                </p>
                <div className="mt-6 text-xs font-medium uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">
                  Get Started →
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Box */}
      <section className="container-x pb-24">
        <div className="rounded-3xl border border-border bg-surface p-8 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="font-display text-2xl md:text-3xl font-semibold">
              Need a custom tailored package?
            </h3>
            <p className="mt-2 text-muted-foreground">
              We frequently bundle brand identity, digital guidelines, packaging, and web development.
            </p>
          </div>
          <button
            onClick={() => onNavigate('/contact')}
            className="rounded-lg bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground hover:bg-accent transition-colors shrink-0 cursor-pointer"
          >
            Request Custom Scope
          </button>
        </div>
      </section>
    </div>
  );
};
