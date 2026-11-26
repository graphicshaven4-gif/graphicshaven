import React, { useState, useEffect } from 'react';
import { ArrowUpRight, X, ChevronLeft, ChevronRight, Maximize2, ExternalLink } from 'lucide-react';
import { PageHero } from '../components/PageHero';
import { useContent } from '../context/ContentContext';
import { PORTFOLIO_CATEGORIES } from '../data/mockData';
import { PortfolioProject } from '../types';

const CATEGORY_ALIASES: Record<string, string[]> = {
  'Web & UI Design': ['web & ui design', 'website', 'web development', 'ui ux'],
  'Advertising & Promotional Design': ['advertising & promotional design', 'advertising', 'poster'],
  Brochures: ['brochures', 'brochure'],
  'Social Media Creatives': ['social media creatives', 'social media'],
  Flyers: ['flyers', 'flyer'],
  'Business Card Design': ['business card design', 'business card'],
  'Tent Design (Canopy)': ['tent design (canopy)', 'tent design', 'canopy'],
};

export const PortfolioPage: React.FC = () => {
  const { portfolio } = useContent();
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [isFullView, setIsFullView] = useState(false);

  const categories = ['All', ...PORTFOLIO_CATEGORIES];

  const filteredProjects =
    activeCategory === 'All'
      ? portfolio
      : portfolio.filter((p) => {
          const cat = p.category.trim().toLowerCase();
          const target = activeCategory.toLowerCase();
          const aliases = CATEGORY_ALIASES[activeCategory] || [target];
          return cat === target || aliases.includes(cat);
        });

  const currentIndex = selectedProject
    ? filteredProjects.findIndex((p) => p.id === selectedProject.id)
    : -1;

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (filteredProjects.length === 0) return;
    const nextIdx = currentIndex > 0 ? currentIndex - 1 : filteredProjects.length - 1;
    setSelectedProject(filteredProjects[nextIdx]);
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (filteredProjects.length === 0) return;
    const nextIdx = currentIndex < filteredProjects.length - 1 ? currentIndex + 1 : 0;
    setSelectedProject(filteredProjects[nextIdx]);
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedProject || isFullView) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProject, isFullView]);

  // Keyboard navigation (Escape, ArrowLeft, ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFullView) {
        if (e.key === 'Escape') setIsFullView(false);
        if (e.key === 'ArrowLeft') handlePrev();
        if (e.key === 'ArrowRight') handleNext();
        return;
      }

      if (selectedProject) {
        if (e.key === 'Escape') setSelectedProject(null);
        if (e.key === 'ArrowLeft') handlePrev();
        if (e.key === 'ArrowRight') handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject, isFullView, currentIndex, filteredProjects]);

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
            <article
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="group min-w-0 cursor-pointer flex flex-col focus:outline-none"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedProject(project);
                }
              }}
            >
              <div className="relative isolate block aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted text-left shadow-xs">
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  className="h-full w-full rounded-2xl object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <span className="absolute right-4 top-4 grid h-10 w-10 translate-y-1 place-items-center rounded-full bg-background/90 text-foreground opacity-0 shadow-soft backdrop-blur transition-all group-hover:translate-y-0 group-hover:opacity-100">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
                <span className="absolute bottom-3 left-3 rounded-md bg-black/60 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-xs opacity-0 transition-opacity group-hover:opacity-100">
                  Click to view full image
                </span>
              </div>

              <div className="pt-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-medium uppercase tracking-widest text-accent">
                    {project.category} · {project.year}
                  </div>
                  <h2 className="mt-1 truncate font-display text-xl font-semibold group-hover:text-accent transition-colors">
                    {project.title}
                  </h2>
                  <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">
                    {project.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-6 backdrop-blur-sm"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="relative max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-background p-4 sm:p-7 md:p-8 shadow-2xl animate-in zoom-in-95 duration-200 border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar with Controls */}
            <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
                  {selectedProject.category} · {selectedProject.year}
                </span>
                {filteredProjects.length > 1 && (
                  <span className="text-xs text-muted-foreground">
                    {currentIndex + 1} of {filteredProjects.length}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Fullscreen view button */}
                <button
                  type="button"
                  onClick={() => setIsFullView(true)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted hover:text-accent transition-colors cursor-pointer"
                  title="View fullscreen image"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Full Image</span>
                </button>

                {/* Open raw image in new tab */}
                <a
                  href={selectedProject.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid h-9 w-9 place-items-center rounded-full border border-border bg-surface hover:bg-muted text-foreground hover:text-accent transition-colors"
                  title="Open image in new tab"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="grid h-9 w-9 place-items-center rounded-full border border-border bg-surface hover:bg-muted text-foreground transition-colors cursor-pointer"
                  aria-label="Close dialog"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Uncropped Full Image Display with Prev/Next Navigation */}
            <div className="relative overflow-hidden rounded-2xl bg-neutral-950/5 dark:bg-neutral-900/40 border border-border/60 flex items-center justify-center min-h-[300px] max-h-[68vh] group">
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                onClick={() => setIsFullView(true)}
                className="max-h-[66vh] w-auto max-w-full object-contain rounded-xl select-none cursor-zoom-in transition-transform duration-300 group-hover:scale-[1.01]"
              />

              {/* Previous Button */}
              {filteredProjects.length > 1 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-full bg-background/90 text-foreground shadow-lg border border-border hover:bg-accent hover:text-white transition-all cursor-pointer"
                  aria-label="Previous project"
                >
                  <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              )}

              {/* Next Button */}
              {filteredProjects.length > 1 && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-full bg-background/90 text-foreground shadow-lg border border-border hover:bg-accent hover:text-white transition-all cursor-pointer"
                  aria-label="Next project"
                >
                  <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              )}

              <div className="pointer-events-none absolute bottom-3 right-3 rounded-lg bg-black/60 px-2.5 py-1 text-xs text-white backdrop-blur-xs flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="h-3 w-3" />
                <span>Click image to zoom</span>
              </div>
            </div>

            {/* Details Section */}
            <div className="mt-6 flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex-1">
                <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight">
                  {selectedProject.title}
                </h2>
                <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
                  {selectedProject.description}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsFullView(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-accent transition-colors cursor-pointer"
                >
                  <Maximize2 className="h-4 w-4" />
                  View Fullscreen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pure Fullscreen Lightbox View */}
      {isFullView && selectedProject && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 p-2 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setIsFullView(false)}
        >
          {/* Top bar */}
          <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between text-white">
            <div className="bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-xs sm:text-sm font-medium">
              <span>{selectedProject.title}</span>
              <span className="opacity-60 ml-2">({selectedProject.category})</span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={selectedProject.image}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10"
                title="Open raw image"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFullView(false);
                }}
                className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10 cursor-pointer"
                title="Close fullscreen (Esc)"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Full Image */}
          <div
            className="flex items-center justify-center w-full h-full p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedProject.image}
              alt={selectedProject.title}
              className="max-h-[92vh] max-w-[94vw] w-auto h-auto object-contain select-none shadow-2xl rounded-lg"
            />
          </div>

          {/* Prev/Next arrows in fullscreen */}
          {filteredProjects.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev(e);
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all cursor-pointer backdrop-blur-xs"
                title="Previous (Left arrow)"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext(e);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all cursor-pointer backdrop-blur-xs"
                title="Next (Right arrow)"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};
