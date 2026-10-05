import React, { useState } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import { PageHero } from '../components/PageHero';
import { useContent } from '../context/ContentContext';
import { PortfolioProject } from '../types';

export const PortfolioPage: React.FC = () => {
  const { portfolio } = useContent();
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);

  const categories = [
    'All',
    'Logo',
    'Brand Identity',
    'Packaging',
    'Website',
    'Web Development',
    'Advertising',
    'Brochure',
    'Poster',
    'Social Media',
    'UI UX',
  ];

  const filteredProjects =
    activeCategory === 'All'
      ? portfolio
      : portfolio.filter((p) => p.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="flex-1">
      <PageHero
        badge="Portfolio"
        titleRegular="Selected"
        titleItalic="work."
        description="A curated look at projects across identity, packaging, digital and print."
      />

      <section className="container-x py-16 md:py-20">
        {/* Categories Tab Bar */}
        <div
          className="mb-10 flex gap-2 overflow-x-auto pb-2 md:flex-wrap no-scrollbar"
          role="tablist"
          aria-label="Portfolio categories"
        >
          {categories.map((cat) => {
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActiveCategory(cat)}
                className={`inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors h-9 px-4 py-2 shrink-0 rounded-full cursor-pointer ${
                  isSelected
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'border border-border bg-background text-foreground hover:bg-accent hover:text-white'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 gap-x-4 gap-y-9 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProjects.map((project) => (
            <article key={project.id} className="group min-w-0">
              <button
                type="button"
                onClick={() => setSelectedProject(project)}
                className="relative block aspect-[4/3] w-full overflow-hidden rounded-lg bg-muted text-left focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer shadow-xs"
              >
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <span className="absolute right-4 top-4 grid h-10 w-10 translate-y-1 place-items-center rounded-full bg-background/90 text-foreground opacity-0 shadow-soft backdrop-blur transition-all group-hover:translate-y-0 group-hover:opacity-100">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </button>

              <div className="pt-4">
                <div className="text-[11px] font-medium uppercase tracking-widest text-accent">
                  {project.category} · {project.year}
                </div>
                <h2 className="mt-1 truncate font-display text-xl font-semibold">{project.title}</h2>
                <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">
                  {project.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs">
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-background p-6 md:p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full border border-border bg-surface hover:bg-muted text-foreground transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="overflow-hidden rounded-2xl aspect-video w-full bg-muted">
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="mt-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
                {selectedProject.category} · {selectedProject.year}
              </div>
              <h2 className="mt-3 font-display text-3xl font-semibold">{selectedProject.title}</h2>
              <p className="mt-3 text-base text-muted-foreground leading-relaxed">
                {selectedProject.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
